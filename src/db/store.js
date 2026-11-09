import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// Initial default seed data for immediate out-of-the-box system demo
const initialUsers = [
  {
    id: 'user-admin-1',
    name: 'Sarah Connor (Admin)',
    email: 'admin@company.com',
    role: 'ADMIN',
    department: 'IT & Administration',
    designation: 'System Administrator',
    phone: '+1 555-0192',
    isActive: true,
    createdAt: new Date('2026-01-01').toISOString()
  },
  {
    id: 'user-recep-1',
    name: 'Emily Davis (Reception)',
    email: 'reception@company.com',
    role: 'RECEPTIONIST',
    department: 'Front Desk',
    designation: 'Lead Receptionist',
    phone: '+1 555-0143',
    isActive: true,
    createdAt: new Date('2026-01-01').toISOString()
  },
  {
    id: 'user-emp-1',
    name: 'John Doe (Engineering)',
    email: 'john.doe@company.com',
    role: 'EMPLOYEE',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    phone: '+1 555-0188',
    isActive: true,
    createdAt: new Date('2026-01-01').toISOString()
  },
  {
    id: 'user-emp-2',
    name: 'Sarah Smith (HR)',
    email: 'sarah.smith@company.com',
    role: 'EMPLOYEE',
    department: 'Human Resources',
    designation: 'HR Manager',
    phone: '+1 555-0122',
    isActive: true,
    createdAt: new Date('2026-01-01').toISOString()
  },
  {
    id: 'user-emp-3',
    name: 'Alex Chen (Finance)',
    email: 'alex.chen@company.com',
    role: 'EMPLOYEE',
    department: 'Finance',
    designation: 'Financial Analyst',
    phone: '+1 555-0155',
    isActive: true,
    createdAt: new Date('2026-01-01').toISOString()
  }
];

const initialEmployees = [
  {
    id: 'emp-1',
    userId: 'user-emp-1',
    employeeCode: 'EMP-1001',
    name: 'John Doe',
    email: 'john.doe@company.com',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    phone: '+1 555-0188',
    isActive: true
  },
  {
    id: 'emp-2',
    userId: 'user-emp-2',
    employeeCode: 'EMP-1002',
    name: 'Sarah Smith',
    email: 'sarah.smith@company.com',
    department: 'Human Resources',
    designation: 'HR Manager',
    phone: '+1 555-0122',
    isActive: true
  },
  {
    id: 'emp-3',
    userId: 'user-emp-3',
    employeeCode: 'EMP-1003',
    name: 'Alex Chen',
    email: 'alex.chen@company.com',
    department: 'Finance',
    designation: 'Financial Analyst',
    phone: '+1 555-0155',
    isActive: true
  }
];

// Helper to get today ISO date YYYY-MM-DD
function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const todayDate = getTodayString();

const initialVisitorRequests = [
  {
    id: 'vr-101',
    passNumber: 'VP-2026-0805-001',
    visitorName: 'Michael Scott',
    visitorPhone: '+1 555-9011',
    visitorEmail: 'm.scott@paperco.com',
    govtIdType: 'Driving License',
    govtIdNumber: 'DL-9842104',
    company: 'Dunder Mifflin',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    employeeId: 'emp-1',
    employeeName: 'John Doe',
    employeeDepartment: 'Engineering',
    visitDate: todayDate,
    expectedTime: '10:30',
    purpose: 'Vendor Technical Integration Discussion',
    status: 'CHECKED_IN',
    checkInTime: new Date(Date.now() - 3600000 * 2).toISOString(),
    createdBy: 'user-recep-1',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'vr-102',
    passNumber: 'VP-2026-0805-002',
    visitorName: 'David Wallace',
    visitorPhone: '+1 555-9022',
    visitorEmail: 'd.wallace@enterprise.com',
    govtIdType: 'Passport',
    govtIdNumber: 'PASS-882190',
    company: 'Enterprise Solutions',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    employeeId: 'emp-2',
    employeeName: 'Sarah Smith',
    employeeDepartment: 'Human Resources',
    visitDate: todayDate,
    expectedTime: '14:00',
    purpose: 'Executive Interview & HR Compliance',
    status: 'APPROVED',
    remarks: 'Approved by HR Manager. Security clearance confirmed.',
    createdBy: 'user-recep-1',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: 'vr-103',
    passNumber: 'VP-2026-0805-003',
    visitorName: 'Robert California',
    visitorPhone: '+1 555-9033',
    visitorEmail: 'r.california@sabre.com',
    govtIdType: 'Aadhaar',
    govtIdNumber: '4821-9921-1029',
    company: 'Sabre International',
    employeeId: 'emp-1',
    employeeName: 'John Doe',
    employeeDepartment: 'Engineering',
    visitDate: todayDate,
    expectedTime: '16:00',
    purpose: 'Quarterly Architecture Review',
    status: 'PENDING',
    createdBy: 'user-recep-1',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: 'vr-104',
    passNumber: 'VP-2026-0805-004',
    visitorName: 'Pam Beesly',
    visitorPhone: '+1 555-9044',
    visitorEmail: 'pam.b@graphics.com',
    govtIdType: 'Driving License',
    govtIdNumber: 'DL-7712399',
    company: 'Art & Design Co.',
    employeeId: 'emp-3',
    employeeName: 'Alex Chen',
    employeeDepartment: 'Finance',
    visitDate: todayDate,
    expectedTime: '09:00',
    purpose: 'Design Invoice Audit',
    status: 'CHECKED_OUT',
    checkInTime: new Date(Date.now() - 3600000 * 5).toISOString(),
    checkOutTime: new Date(Date.now() - 3600000 * 1).toISOString(),
    createdBy: 'user-recep-1',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString()
  }
];

const initialActivityLogs = [
  {
    id: 'log-1',
    visitorRequestId: 'vr-101',
    visitorName: 'Michael Scott',
    action: 'CREATED',
    performedByUserId: 'user-recep-1',
    performedByName: 'Emily Davis (Reception)',
    performedByRole: 'RECEPTIONIST',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    details: 'Visitor registration created for host John Doe.'
  },
  {
    id: 'log-2',
    visitorRequestId: 'vr-101',
    visitorName: 'Michael Scott',
    action: 'APPROVED',
    performedByUserId: 'user-emp-1',
    performedByName: 'John Doe',
    performedByRole: 'EMPLOYEE',
    timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    details: 'Visit request approved by host employee.'
  },
  {
    id: 'log-3',
    visitorRequestId: 'vr-101',
    visitorName: 'Michael Scott',
    action: 'CHECKED_IN',
    performedByUserId: 'user-recep-1',
    performedByName: 'Emily Davis (Reception)',
    performedByRole: 'RECEPTIONIST',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    details: 'Visitor checked in at front desk. Digital pass issued.'
  },
  {
    id: 'log-4',
    visitorRequestId: 'vr-102',
    visitorName: 'David Wallace',
    action: 'CREATED',
    performedByUserId: 'user-recep-1',
    performedByName: 'Emily Davis (Reception)',
    performedByRole: 'RECEPTIONIST',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    details: 'Visitor registration created for host Sarah Smith.'
  },
  {
    id: 'log-5',
    visitorRequestId: 'vr-102',
    visitorName: 'David Wallace',
    action: 'APPROVED',
    performedByUserId: 'user-emp-2',
    performedByName: 'Sarah Smith',
    performedByRole: 'EMPLOYEE',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    details: 'Visit request approved. Remarks: Approved by HR Manager.'
  }
];

class Store {
  constructor() {
    this.data = {
      users: [...initialUsers],
      employees: [...initialEmployees],
      visitorRequests: [...initialVisitorRequests],
      activityLogs: [...initialActivityLogs]
    };
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error initializing data store, using memory fallback:', err);
    }
  }

  save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving data store to file:', err);
    }
  }

  // Helper to log activities
  addActivityLog(visitorRequestId, visitorName, action, user, details) {
    const log = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      visitorRequestId,
      visitorName,
      action,
      performedByUserId: user.id,
      performedByName: user.name,
      performedByRole: user.role,
      timestamp: new Date().toISOString(),
      details
    };
    this.data.activityLogs.unshift(log);
    this.save();
    return log;
  }

  // ==================== USER OPERATIONS ====================
  getUsers() {
    return this.data.users;
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData) {
    const id = 'user-' + Date.now();
    const newUser = {
      ...userData,
      id,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);

    if (userData.role === 'EMPLOYEE') {
      const empId = 'emp-' + Date.now();
      const newEmp = {
        id: empId,
        userId: id,
        employeeCode: 'EMP-' + Math.floor(1000 + Math.random() * 9000),
        name: userData.name,
        email: userData.email,
        department: userData.department || 'General',
        designation: userData.designation || 'Staff',
        phone: userData.phone || '',
        isActive: userData.isActive
      };
      this.data.employees.push(newEmp);
    }

    this.save();
    return newUser;
  }

  updateUser(id, updates) {
    const userIndex = this.data.users.findIndex(u => u.id === id);
    if (userIndex === -1) return undefined;

    this.data.users[userIndex] = {
      ...this.data.users[userIndex],
      ...updates
    };

    const empIndex = this.data.employees.findIndex(e => e.userId === id);
    if (empIndex !== -1) {
      if (updates.name) this.data.employees[empIndex].name = updates.name;
      if (updates.email) this.data.employees[empIndex].email = updates.email;
      if (updates.department) this.data.employees[empIndex].department = updates.department;
      if (updates.designation) this.data.employees[empIndex].designation = updates.designation;
      if (updates.phone) this.data.employees[empIndex].phone = updates.phone;
      if (updates.isActive !== undefined) this.data.employees[empIndex].isActive = updates.isActive;
    }

    this.save();
    return this.data.users[userIndex];
  }

  // ==================== EMPLOYEE OPERATIONS ====================
  getEmployees() {
    return this.data.employees.map(emp => {
      const pendingCount = this.data.visitorRequests.filter(
        vr => vr.employeeId === emp.id && vr.status === 'PENDING'
      ).length;
      return {
        ...emp,
        pendingRequestsCount: pendingCount
      };
    });
  }

  getEmployeeById(id) {
    const emp = this.data.employees.find(e => e.id === id);
    if (!emp) return undefined;

    const pendingCount = this.data.visitorRequests.filter(
      vr => vr.employeeId === emp.id && vr.status === 'PENDING'
    ).length;

    return {
      ...emp,
      pendingRequestsCount: pendingCount
    };
  }

  getEmployeeByUserId(userId) {
    const emp = this.data.employees.find(e => e.userId === userId);
    if (!emp) return undefined;
    return this.getEmployeeById(emp.id);
  }

  // ==================== VISITOR REQUEST & BUSINESS RULES ====================
  getVisitorRequests() {
    return this.data.visitorRequests;
  }

  getVisitorRequestById(id) {
    return this.data.visitorRequests.find(vr => vr.id === id);
  }

  /**
   * BUSINESS RULES VALIDATION FOR NEW REGISTRATION
   */
  validateNewVisitorRequest(params) {
    const { visitorName, visitorPhone, visitorEmail, govtIdNumber, employeeId, visitDate, expectedTime } = params;

    const todayStr = getTodayString();
    const cleanPhone = visitorPhone.replace(/\D/g, '');
    const cleanEmail = visitorEmail.trim().toLowerCase();
    const cleanGovtId = govtIdNumber.trim().toUpperCase();

    // RULE 1: A visitor cannot have more than one active visit at the same time.
    const activeVisit = this.data.visitorRequests.find(vr => {
      const isStatusActive = ['PENDING', 'APPROVED', 'CHECKED_IN'].includes(vr.status);
      if (!isStatusActive) return false;

      const samePhone = cleanPhone && vr.visitorPhone.replace(/\D/g, '') === cleanPhone;
      const sameEmail = cleanEmail && vr.visitorEmail.trim().toLowerCase() === cleanEmail;
      const sameGovtId = cleanGovtId && vr.govtIdNumber.trim().toUpperCase() === cleanGovtId;

      return samePhone || sameEmail || sameGovtId;
    });

    if (activeVisit) {
      return {
        valid: false,
        ruleNumber: 1,
        error: `Rule 1 Violation: Visitor ${visitorName} already has an active visit (Pass #${activeVisit.passNumber}, Status: ${activeVisit.status}). A visitor cannot have multiple active visits simultaneously.`
      };
    }

    // RULE 2: Duplicate visitor registrations for the same visitor on the same date should not be allowed.
    const duplicateSameDate = this.data.visitorRequests.find(vr => {
      if (vr.visitDate !== visitDate) return false;
      if (vr.status === 'CANCELLED') return false;

      const samePhone = cleanPhone && vr.visitorPhone.replace(/\D/g, '') === cleanPhone;
      const sameEmail = cleanEmail && vr.visitorEmail.trim().toLowerCase() === cleanEmail;
      const sameGovtId = cleanGovtId && vr.govtIdNumber.trim().toUpperCase() === cleanGovtId;

      return samePhone || sameEmail || sameGovtId;
    });

    if (duplicateSameDate) {
      return {
        valid: false,
        ruleNumber: 2,
        error: `Rule 2 Violation: Duplicate registration detected. A visit registration for ${visitorName} on ${visitDate} already exists (Pass #${duplicateSameDate.passNumber}).`
      };
    }

    // RULE 3: Visit date cannot be earlier than the current date.
    if (visitDate < todayStr) {
      return {
        valid: false,
        ruleNumber: 3,
        error: `Rule 3 Violation: Visit date (${visitDate}) cannot be in the past. Today's date is ${todayStr}.`
      };
    }

    // RULE 4: For today's registrations, expected arrival time cannot be earlier than current time.
    if (visitDate === todayStr && expectedTime) {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      const [expHours, expMins] = expectedTime.split(':').map(Number);
      
      const currentTotalMins = currentHours * 60 + currentMinutes;
      const expTotalMins = expHours * 60 + expMins;

      if (expTotalMins < currentTotalMins - 10) {
        const timeNowFormatted = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;
        return {
          valid: false,
          ruleNumber: 4,
          error: `Rule 4 Violation: Expected arrival time (${expectedTime}) cannot be earlier than current time (${timeNowFormatted}).`
        };
      }
    }

    // RULE 5: An employee cannot have more than three pending visitor requests awaiting approval.
    const employeePendingRequests = this.data.visitorRequests.filter(
      vr => vr.employeeId === employeeId && vr.status === 'PENDING'
    );

    if (employeePendingRequests.length >= 3) {
      const emp = this.getEmployeeById(employeeId);
      const empName = emp ? emp.name : 'Selected Employee';
      return {
        valid: false,
        ruleNumber: 5,
        error: `Rule 5 Violation: Host employee ${empName} already has ${employeePendingRequests.length} pending visitor requests awaiting approval. An employee cannot have more than 3 pending requests.`
      };
    }

    return { valid: true };
  }

  createVisitorRequest(data, currentUser) {
    const validation = this.validateNewVisitorRequest({
      visitorName: data.visitorName,
      visitorPhone: data.visitorPhone,
      visitorEmail: data.visitorEmail,
      govtIdNumber: data.govtIdNumber,
      employeeId: data.employeeId,
      visitDate: data.visitDate,
      expectedTime: data.expectedTime
    });

    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const id = 'vr-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const passSeq = String(this.data.visitorRequests.length + 1).padStart(3, '0');
    const dateFormatted = data.visitDate.replace(/-/g, '');
    const passNumber = `VP-${dateFormatted}-${passSeq}`;

    const emp = this.getEmployeeById(data.employeeId);

    const newRequest = {
      ...data,
      id,
      passNumber,
      employeeName: emp ? emp.name : data.employeeName,
      employeeDepartment: emp ? emp.department : data.employeeDepartment,
      status: 'PENDING',
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.visitorRequests.unshift(newRequest);
    this.save();

    this.addActivityLog(
      newRequest.id,
      newRequest.visitorName,
      'CREATED',
      currentUser,
      `Visitor pass registration created for host ${newRequest.employeeName} (${newRequest.employeeDepartment}).`
    );

    return newRequest;
  }

  approveVisitorRequest(requestId, remarks, currentUser) {
    const req = this.getVisitorRequestById(requestId);
    if (!req) throw new Error('Visitor request not found.');

    if (req.status !== 'PENDING') {
      throw new Error(`Cannot approve request. Current status is ${req.status}.`);
    }

    req.status = 'APPROVED';
    if (remarks) req.remarks = remarks;
    req.updatedAt = new Date().toISOString();

    this.save();

    this.addActivityLog(
      req.id,
      req.visitorName,
      'APPROVED',
      currentUser,
      `Visit request approved by ${currentUser.name}.${remarks ? ` Remarks: ${remarks}` : ''}`
    );

    return req;
  }

  rejectVisitorRequest(requestId, reason, currentUser) {
    const req = this.getVisitorRequestById(requestId);
    if (!req) throw new Error('Visitor request not found.');

    if (req.status !== 'PENDING') {
      throw new Error(`Cannot reject request. Current status is ${req.status}.`);
    }

    if (!reason || reason.trim().length === 0) {
      throw new Error('Rejection reason/remarks are mandatory when rejecting a visitor request.');
    }

    req.status = 'REJECTED';
    req.rejectionReason = reason;
    req.updatedAt = new Date().toISOString();

    this.save();

    this.addActivityLog(
      req.id,
      req.visitorName,
      'REJECTED',
      currentUser,
      `Visit request rejected by ${currentUser.name}. Reason: ${reason}`
    );

    return req;
  }

  checkInVisitor(requestId, currentUser) {
    const req = this.getVisitorRequestById(requestId);
    if (!req) throw new Error('Visitor request not found.');

    // RULE 9: Rejected visitor requests cannot be checked in.
    if (req.status === 'REJECTED') {
      throw new Error('Rule 9 Violation: Rejected visitor requests cannot be checked in.');
    }

    // RULE 7: A visitor who is already checked in cannot be checked in again until checked out.
    if (req.status === 'CHECKED_IN') {
      throw new Error(`Rule 7 Violation: Visitor ${req.visitorName} is already checked in at ${req.checkInTime}.`);
    }

    // RULE 6: Visitors can only be checked in after approval.
    if (req.status !== 'APPROVED') {
      throw new Error(`Rule 6 Violation: Visitors can only be checked in after host approval. Current status is '${req.status}'.`);
    }

    const checkInIso = new Date().toISOString();
    req.status = 'CHECKED_IN';
    req.checkInTime = checkInIso;
    req.updatedAt = checkInIso;

    this.save();

    this.addActivityLog(
      req.id,
      req.visitorName,
      'CHECKED_IN',
      currentUser,
      `Visitor checked in at front desk by ${currentUser.name}. Pass #${req.passNumber} activated.`
    );

    return req;
  }

  checkOutVisitor(requestId, currentUser) {
    const req = this.getVisitorRequestById(requestId);
    if (!req) throw new Error('Visitor request not found.');

    if (req.status !== 'CHECKED_IN') {
      throw new Error(`Cannot check out visitor. Visitor status is '${req.status}', not 'CHECKED_IN'.`);
    }

    const checkOutIso = new Date().toISOString();

    // RULE 8: Check-out time must always be later than check-in time.
    if (req.checkInTime) {
      const checkInMs = new Date(req.checkInTime).getTime();
      const checkOutMs = new Date(checkOutIso).getTime();
      if (checkOutMs <= checkInMs) {
        throw new Error('Rule 8 Violation: Check-out time must always be later than check-in time.');
      }
    }

    req.status = 'CHECKED_OUT';
    req.checkOutTime = checkOutIso;
    req.updatedAt = checkOutIso;

    this.save();

    this.addActivityLog(
      req.id,
      req.visitorName,
      'CHECKED_OUT',
      currentUser,
      `Visitor checked out by ${currentUser.name}. Pass #${req.passNumber} completed.`
    );

    return req;
  }

  cancelVisitorRequest(requestId, currentUser) {
    const req = this.getVisitorRequestById(requestId);
    if (!req) throw new Error('Visitor request not found.');

    if (req.status === 'CHECKED_IN') {
      throw new Error('Cannot cancel a visit that is currently checked in. Please check out the visitor instead.');
    }

    req.status = 'CANCELLED';
    req.updatedAt = new Date().toISOString();

    this.save();

    // RULE 10: Cancelled visits should not appear in active visitor lists.
    this.addActivityLog(
      req.id,
      req.visitorName,
      'CANCELLED',
      currentUser,
      `Visit request cancelled by ${currentUser.name}. (Removed from active visitor lists)`
    );

    return req;
  }

  addRemarksToVisitorRequest(requestId, remarks, currentUser) {
    const req = this.getVisitorRequestById(requestId);
    if (!req) throw new Error('Visitor request not found.');

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedRemark = `[${currentUser.name} @ ${timestamp}]: ${remarks}`;

    req.remarks = req.remarks ? `${req.remarks}\n${formattedRemark}` : formattedRemark;
    req.updatedAt = new Date().toISOString();

    this.save();

    this.addActivityLog(
      req.id,
      req.visitorName,
      'REMARKS_ADDED',
      currentUser,
      `Remarks added by ${currentUser.name}: "${remarks}"`
    );

    return req;
  }

  getActivityLogs() {
    return this.data.activityLogs;
  }

  getReportStats(dateRange) {
    let requests = this.data.visitorRequests;

    if (dateRange) {
      if (dateRange.startDate) {
        requests = requests.filter(r => r.visitDate >= dateRange.startDate);
      }
      if (dateRange.endDate) {
        requests = requests.filter(r => r.visitDate <= dateRange.endDate);
      }
    }

    const deptBreakdown = {};
    requests.forEach(r => {
      const dept = r.employeeDepartment || 'Other';
      deptBreakdown[dept] = (deptBreakdown[dept] || 0) + 1;
    });

    const statusCounts = {};
    requests.forEach(r => {
      statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
    });

    const dailyMap = {};
    requests.forEach(r => {
      dailyMap[r.visitDate] = (dailyMap[r.visitDate] || 0) + 1;
    });

    const dailyBreakdown = Object.keys(dailyMap)
      .sort()
      .map(date => ({ date, count: dailyMap[date] }));

    const statusBreakdown = Object.keys(statusCounts).map(status => ({
      status,
      count: statusCounts[status]
    }));

    return {
      totalVisitors: requests.length,
      pendingRequests: statusCounts['PENDING'] || 0,
      approvedVisitors: statusCounts['APPROVED'] || 0,
      rejectedVisitors: statusCounts['REJECTED'] || 0,
      checkedInVisitors: statusCounts['CHECKED_IN'] || 0,
      checkedOutVisitors: statusCounts['CHECKED_OUT'] || 0,
      cancelledVisitors: statusCounts['CANCELLED'] || 0,
      departmentBreakdown: deptBreakdown,
      dailyBreakdown,
      statusBreakdown
    };
  }
}

export const dbStore = new Store();
