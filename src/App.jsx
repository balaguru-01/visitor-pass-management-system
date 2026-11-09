import React, { useState, useEffect } from 'react';
import { api, getToken } from './lib/api.js';
import { Navbar } from './components/Navbar.jsx';
import { LoginForm } from './components/LoginForm.jsx';
import { AdminDashboard } from './components/AdminDashboard.jsx';
import { ReceptionistDashboard } from './components/ReceptionistDashboard.jsx';
import { EmployeeDashboard } from './components/EmployeeDashboard.jsx';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [employee, setEmployee] = useState(undefined);
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  const initAuthAndData = async () => {
    setLoading(true);
    const token = getToken();

    if (token) {
      try {
        const me = await api.getCurrentUser();
        setCurrentUser(me.user);
        setEmployee(me.employee);

        const [userList, empList] = await Promise.all([
          api.getUsers(),
          api.getEmployees()
        ]);
        setUsers(userList);
        setEmployees(empList);
      } catch (err) {
        console.error('Failed to load session, resetting token', err);
        api.logout();
        setCurrentUser(null);
      }
    } else {
      // Auto login default Admin for immediate instant view
      try {
        const defaultAuth = await api.login('admin@company.com');
        setCurrentUser(defaultAuth.user);
        setEmployee(defaultAuth.employee);

        const [userList, empList] = await Promise.all([
          api.getUsers(),
          api.getEmployees()
        ]);
        setUsers(userList);
        setEmployees(empList);
      } catch (err) {
        console.error('Failed auto login default user', err);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    initAuthAndData();
  }, []);

  const refreshEmployees = async () => {
    try {
      const [empList, userList] = await Promise.all([
        api.getEmployees(),
        api.getUsers()
      ]);
      setEmployees(empList);
      setUsers(userList);
    } catch (err) {
      console.error('Failed refreshing employees', err);
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setEmployee(undefined);
  };

  const handleSwitchRoleDemo = async (role) => {
    let emailToUse = 'admin@company.com';
    if (role === 'RECEPTIONIST') emailToUse = 'reception@company.com';
    if (role === 'EMPLOYEE') emailToUse = 'john.doe@company.com';

    try {
      const res = await api.login(emailToUse, role);
      setCurrentUser(res.user);
      setEmployee(res.employee);
      refreshEmployees();
    } catch (err) {
      console.error('Role switch failed', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-3">
        <ShieldCheck className="w-12 h-12 text-indigo-500 animate-pulse" />
        <p className="text-sm font-semibold tracking-wide text-slate-300">Initializing Visitor Pass Management System...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginForm onSuccess={initAuthAndData} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Top Navbar */}
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        onSwitchRoleDemo={handleSwitchRoleDemo}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Role-Based Rendering */}
        {currentUser.role === 'ADMIN' && (
          <AdminDashboard
            currentUser={currentUser}
            users={users}
            employees={employees}
            onRefreshData={refreshEmployees}
          />
        )}

        {currentUser.role === 'RECEPTIONIST' && (
          <ReceptionistDashboard
            employees={employees}
            onRefreshEmployees={refreshEmployees}
          />
        )}

        {currentUser.role === 'EMPLOYEE' && (
          <EmployeeDashboard
            currentUser={currentUser}
            employee={employee}
            onRefreshEmployees={refreshEmployees}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p className="font-medium">
          Visitor Pass Management System • Built with MERN / Express React Vite Stack
        </p>
      </footer>
    </div>
  );
}
