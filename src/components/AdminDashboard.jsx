import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { ReportsView } from './ReportsView.jsx';
import { ActivityLogsTable } from './ActivityLogsTable.jsx';
import { ManageEmployeesModal } from './ManageEmployeesModal.jsx';
import { ManageUsersModal } from './ManageUsersModal.jsx';
import { VisitorPassModal } from './VisitorPassModal.jsx';
import {
  ShieldCheck,
  Users,
  BarChart3,
  History,
  Search,
  FileText
} from 'lucide-react';

export const AdminDashboard = ({
  currentUser,
  users = [],
  employees = [],
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [visitors, setVisitors] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isManageEmployeesOpen, setIsManageEmployeesOpen] = useState(false);
  const [isManageUsersOpen, setIsManageUsersOpen] = useState(false);
  const [selectedVisitorPass, setSelectedVisitorPass] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [visitorRes, logRes] = await Promise.all([
        api.getVisitors(),
        api.getActivityLogs()
      ]);
      setVisitors(visitorRes);
      setActivityLogs(logRes);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalVisitors = visitors.length;
  const activeInside = visitors.filter(v => v.status === 'CHECKED_IN').length;
  const pendingRequests = visitors.filter(v => v.status === 'PENDING').length;
  const totalEmployeesCount = employees.length;

  const filteredVisitors = visitors.filter(v => {
    const matchesSearch =
      v.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.visitorPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.passNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' ? true : v.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-2xs font-bold uppercase tracking-wider rounded-full">
            System Administration Panel
          </span>
          <h2 className="text-2xl font-black tracking-tight">System Administrator Dashboard</h2>
          <p className="text-xs text-slate-300">
            Global management of user roles, staff employee accounts, visitor pass policies, analytical reports, and audit logs.
          </p>
        </div>

        {/* Quick Admin Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setIsManageEmployeesOpen(true)}
            className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-xs"
          >
            <Users className="w-4 h-4" /> Manage Employees
          </button>
          <button
            onClick={() => setIsManageUsersOpen(true)}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> User Accounts
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`py-2 px-4 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'OVERVIEW' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> System Overview
        </button>
        <button
          onClick={() => setActiveTab('REPORTS')}
          className={`py-2 px-4 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'REPORTS' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" /> Visitor Reports
        </button>
        <button
          onClick={() => setActiveTab('ACTIVITY_LOGS')}
          className={`py-2 px-4 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'ACTIVITY_LOGS' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" /> Activity History Logs
        </button>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Top Overview KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Total Registered Visitors</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{totalVisitors}</p>
              <span className="text-2xs text-indigo-600 font-semibold mt-1 block">All Time Records</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Visitors Inside Building</p>
              <p className="text-3xl font-black text-indigo-600 mt-1">{activeInside}</p>
              <span className="text-2xs text-emerald-600 font-semibold mt-1 block">Active Checked-In</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Pending Host Approval</p>
              <p className="text-3xl font-black text-amber-600 mt-1">{pendingRequests}</p>
              <span className="text-2xs text-amber-600 font-semibold mt-1 block">Awaiting Review</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Total Host Employees</p>
              <p className="text-3xl font-black text-slate-800 mt-1">{totalEmployeesCount}</p>
              <span className="text-2xs text-slate-500 font-semibold mt-1 block">Active Accounts</span>
            </div>
          </div>

          {/* Master Visitors Directory */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Master Visitor Pass Records</h3>
                <p className="text-xs text-slate-500 mt-0.5">Comprehensive audit directory of all visitor passes.</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search visitor, phone, host..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="CHECKED_IN">Checked In</option>
                  <option value="APPROVED">Approved</option>
                  <option value="PENDING">Pending</option>
                  <option value="CHECKED_OUT">Checked Out</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Pass #</th>
                    <th className="px-5 py-3">Visitor Name</th>
                    <th className="px-5 py-3">Host Employee</th>
                    <th className="px-5 py-3">Visit Date & Time</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredVisitors.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-3.5 font-mono font-bold text-indigo-600">{v.passNumber}</td>
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">{v.visitorName}</p>
                        <p className="text-2xs text-slate-400">{v.visitorPhone} • {v.company || 'Personal'}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-800">{v.employeeName}</p>
                        <p className="text-2xs text-slate-400">{v.employeeDepartment}</p>
                      </td>
                      <td className="px-5 py-3.5">{v.visitDate} @ {v.expectedTime}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-2xs font-bold ${
                          v.status === 'CHECKED_IN' ? 'bg-indigo-50 text-indigo-700' :
                          v.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                          v.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                          v.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedVisitorPass(v)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                        >
                          View Pass
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: REPORTS */}
      {activeTab === 'REPORTS' && <ReportsView />}

      {/* TAB CONTENT: ACTIVITY LOGS */}
      {activeTab === 'ACTIVITY_LOGS' && <ActivityLogsTable logs={activityLogs} />}

      {/* Manage Employees Modal */}
      <ManageEmployeesModal
        isOpen={isManageEmployeesOpen}
        onClose={() => setIsManageEmployeesOpen(false)}
        employees={employees}
        onRefresh={() => {
          onRefreshData();
          fetchData();
        }}
      />

      {/* Manage Users Modal */}
      <ManageUsersModal
        isOpen={isManageUsersOpen}
        onClose={() => setIsManageUsersOpen(false)}
        users={users}
        onRefresh={() => {
          onRefreshData();
          fetchData();
        }}
      />

      {/* Digital Visitor Pass Modal */}
      <VisitorPassModal
        visitor={selectedVisitorPass}
        onClose={() => setSelectedVisitorPass(null)}
      />

    </div>
  );
};
