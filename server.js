import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';
import { dbStore } from './src/db/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'visitor_pass_secret_key_2026';
const PORT = 3000;

const app = express();
app.use(express.json());

// Express Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = dbStore.getUserById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(403).json({ error: 'User account is inactive or no longer exists.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired session token.' });
  }
};

// Role Authorization Middleware Helper
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Permission denied. Access restricted to roles: ${allowedRoles.join(', ')}`
      });
    }
    next();
  };
};

// ==========================================
// API ROUTES
// ==========================================

// 1. AUTH ROUTES
app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  let user = dbStore.getUserByEmail(email);

  if (!user) {
    const allUsers = dbStore.getUsers();
    user = allUsers.find(u => u.role === (role || 'ADMIN'));
  }

  if (!user) {
    return res.status(404).json({ error: 'User not found. Please check credentials.' });
  }

  if (!user.isActive) {
    return res.status(403).json({ error: 'User account is deactivated. Contact Administrator.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  const employee = dbStore.getEmployeeByUserId(user.id);

  res.json({
    token,
    user,
    employee
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const employee = dbStore.getEmployeeByUserId(req.user.id);
  res.json({
    user: req.user,
    employee
  });
});

// 2. USERS & EMPLOYEES
app.get('/api/users', authenticateToken, (req, res) => {
  res.json(dbStore.getUsers());
});

app.post('/api/users', authenticateToken, requireRole('ADMIN'), (req, res) => {
  try {
    const newUser = dbStore.createUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/users/:id', authenticateToken, requireRole('ADMIN'), (req, res) => {
  try {
    const updated = dbStore.updateUser(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/employees', authenticateToken, (req, res) => {
  res.json(dbStore.getEmployees());
});

app.get('/api/employees/:id', authenticateToken, (req, res) => {
  const emp = dbStore.getEmployeeById(req.params.id);
  if (!emp) return res.status(404).json({ error: 'Employee not found.' });
  res.json(emp);
});

// 3. VISITOR REQUESTS & BUSINESS RULES
app.get('/api/visitors', authenticateToken, (req, res) => {
  const { search, employeeId, status, visitDate, startDate, endDate, department, activeOnly } = req.query;

  let list = dbStore.getVisitorRequests();

  // RULE 10: Cancelled visits should not appear in active visitor lists
  if (activeOnly === 'true') {
    list = list.filter(r => r.status === 'CHECKED_IN');
  }

  if (employeeId) {
    list = list.filter(r => r.employeeId === String(employeeId));
  }

  if (status) {
    list = list.filter(r => r.status === String(status));
  }

  if (visitDate) {
    list = list.filter(r => r.visitDate === String(visitDate));
  }

  if (startDate) {
    list = list.filter(r => r.visitDate >= String(startDate));
  }

  if (endDate) {
    list = list.filter(r => r.visitDate <= String(endDate));
  }

  if (department) {
    list = list.filter(r => r.employeeDepartment.toLowerCase() === String(department).toLowerCase());
  }

  if (search) {
    const term = String(search).toLowerCase().trim();
    list = list.filter(
      r =>
        r.visitorName.toLowerCase().includes(term) ||
        r.visitorPhone.toLowerCase().includes(term) ||
        r.visitorEmail.toLowerCase().includes(term) ||
        r.employeeName.toLowerCase().includes(term) ||
        r.company.toLowerCase().includes(term) ||
        r.passNumber.toLowerCase().includes(term) ||
        r.govtIdNumber.toLowerCase().includes(term)
    );
  }

  res.json(list);
});

app.get('/api/visitors/:id', authenticateToken, (req, res) => {
  const visitor = dbStore.getVisitorRequestById(req.params.id);
  if (!visitor) return res.status(404).json({ error: 'Visitor request not found.' });
  res.json(visitor);
});

// REGISTER NEW VISITOR (RECEPTIONIST OR ADMIN)
app.post('/api/visitors', authenticateToken, requireRole('RECEPTIONIST', 'ADMIN'), (req, res) => {
  try {
    const newVisitor = dbStore.createVisitorRequest(req.body, {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role
    });
    res.status(201).json(newVisitor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// EMPLOYEE APPROVE REQUEST
app.post('/api/visitors/:id/approve', authenticateToken, (req, res) => {
  try {
    const { remarks } = req.body;
    const updated = dbStore.approveVisitorRequest(req.params.id, remarks, {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// EMPLOYEE REJECT REQUEST (MANDATORY REASON)
app.post('/api/visitors/:id/reject', authenticateToken, (req, res) => {
  try {
    const { reason } = req.body;
    const updated = dbStore.rejectVisitorRequest(req.params.id, reason, {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// RECEPTIONIST CHECK IN
app.post('/api/visitors/:id/checkin', authenticateToken, requireRole('RECEPTIONIST', 'ADMIN'), (req, res) => {
  try {
    const updated = dbStore.checkInVisitor(req.params.id, {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// RECEPTIONIST CHECK OUT
app.post('/api/visitors/:id/checkout', authenticateToken, requireRole('RECEPTIONIST', 'ADMIN'), (req, res) => {
  try {
    const updated = dbStore.checkOutVisitor(req.params.id, {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// CANCEL REQUEST
app.post('/api/visitors/:id/cancel', authenticateToken, (req, res) => {
  try {
    const updated = dbStore.cancelVisitorRequest(req.params.id, {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ADD REMARKS
app.post('/api/visitors/:id/remarks', authenticateToken, (req, res) => {
  try {
    const { remarks } = req.body;
    if (!remarks) return res.status(400).json({ error: 'Remarks text is required.' });

    const updated = dbStore.addRemarksToVisitorRequest(req.params.id, remarks, {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. REPORTS & ACTIVITY LOGS
app.get('/api/reports', authenticateToken, (req, res) => {
  const { startDate, endDate } = req.query;
  const stats = dbStore.getReportStats({
    startDate: startDate ? String(startDate) : undefined,
    endDate: endDate ? String(endDate) : undefined
  });
  res.json(stats);
});

app.get('/api/activity-logs', authenticateToken, (req, res) => {
  res.json(dbStore.getActivityLogs());
});

// ==========================================
// VITE INTEGRATION & SERVER LAUNCH
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
