import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { VisitorRegistrationModal } from './VisitorRegistrationModal.jsx';
import { VisitorPassModal } from './VisitorPassModal.jsx';
import {
  UserPlus,
  LogIn,
  LogOut,
  Search,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Users,
  ShieldCheck,
  XCircle,
  FileText
} from 'lucide-react';

export const ReceptionistDashboard = ({
  employees = [],
  onRefreshEmployees
}) => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusTab, setStatusTab] = useState('ALL');

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedVisitorPass, setSelectedVisitorPass] = useState(null);

  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const data = await api.getVisitors();
      setVisitors(data);
    } catch (err) {
      console.error('Failed fetching receptionist visitors list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleCheckIn = async (requestId, visitorName) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      await api.checkInVisitor(requestId);
      setActionSuccess(`Check-In successful for visitor ${visitorName}. Digital pass activated.`);
      fetchVisitors();
    } catch (err) {
      setActionError(err.message || 'Failed checking in visitor.');
    }
  };

  const handleCheckOut = async (requestId, visitorName) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      await api.checkOutVisitor(requestId);
      setActionSuccess(`Check-Out completed for visitor ${visitorName}. Pass closed.`);
      fetchVisitors();
    } catch (err) {
      setActionError(err.message || 'Failed checking out visitor.');
    }
  };

  const handleCancelVisit = async (requestId, visitorName) => {
    if (!confirm(`Are you sure you want to cancel the visitor pass for ${visitorName}?`)) return;

    setActionError(null);
    setActionSuccess(null);
    try {
      await api.cancelVisitor(requestId);
      setActionSuccess(`Visitor pass cancelled for ${visitorName}. Removed from active queue.`);
      fetchVisitors();
    } catch (err) {
      setActionError(err.message || 'Failed cancelling visit.');
    }
  };

  // Filter out CANCELLED visits from active receptionist operational queues (Rule 10)
  const activeDirectory = visitors.filter(v => v.status !== 'CANCELLED');

  const filteredVisitors = activeDirectory.filter(v => {
    const matchesSearch =
      v.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.visitorPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.passNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.employeeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusTab === 'ALL' ? true : v.status === statusTab;

    return matchesSearch && matchesStatus;
  });

  const checkedInCount = visitors.filter(v => v.status === 'CHECKED_IN').length;
  const approvedCount = visitors.filter(v => v.status === 'APPROVED').length;
  const pendingCount = visitors.filter(v => v.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      
      {/* Front Desk Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-2xs font-bold uppercase tracking-wider rounded-full">
            Front Desk Reception Console
          </span>
          <h2 className="text-2xl font-black tracking-tight">Visitor Registration & Check-In Desk</h2>
          <p className="text-xs text-slate-300">
            Register walk-in guests, verify host approval status, process check-ins/check-outs, and issue digital passes.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="shrink-0">
          <button
            onClick={() => {
              setActionError(null);
              setActionSuccess(null);
              setIsRegisterModalOpen(true);
            }}
            className="py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-emerald-600/30 flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" /> Register Walk-In Visitor
          </button>
        </div>
      </div>

      {/* Real-Time Alert Banners */}
      {actionError && (
        <div className="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-2xl text-rose-800 text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-500 hover:text-rose-800">✕</button>
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-2xl text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-500 hover:text-emerald-800">✕</button>
        </div>
      )}

      {/* KPI Operational Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Currently Inside Building</p>
            <p className="text-3xl font-black text-indigo-600 mt-0.5">{checkedInCount}</p>
            <span className="text-2xs text-indigo-600 font-semibold mt-1 block">Active Checked-In Visitors</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <LogIn className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Approved & Ready to Check In</p>
            <p className="text-3xl font-black text-emerald-600 mt-0.5">{approvedCount}</p>
            <span className="text-2xs text-emerald-600 font-semibold mt-1 block">Cleared by Host</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Awaiting Host Approval</p>
            <p className="text-3xl font-black text-amber-600 mt-0.5">{pendingCount}</p>
            <span className="text-2xs text-amber-600 font-semibold mt-1 block">Pending Review</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Receptionist Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Table Filter Controls */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-2xs font-bold">
            <button
              onClick={() => setStatusTab('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${statusTab === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
            >
              All Visitors
            </button>
            <button
              onClick={() => setStatusTab('CHECKED_IN')}
              className={`px-3 py-1.5 rounded-lg transition ${statusTab === 'CHECKED_IN' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600'}`}
            >
              Checked In ({checkedInCount})
            </button>
            <button
              onClick={() => setStatusTab('APPROVED')}
              className={`px-3 py-1.5 rounded-lg transition ${statusTab === 'APPROVED' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600'}`}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setStatusTab('PENDING')}
              className={`px-3 py-1.5 rounded-lg transition ${statusTab === 'PENDING' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600'}`}
            >
              Pending
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search visitor pass #, name, phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
            />
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Pass #</th>
                <th className="px-5 py-3">Visitor Details</th>
                <th className="px-5 py-3">Host Employee</th>
                <th className="px-5 py-3">Schedule / Status</th>
                <th className="px-5 py-3 text-center">Desk Operational Actions</th>
                <th className="px-5 py-3 text-right">Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400 font-normal">
                    No visitor passes found matching your filter parameters.
                  </td>
                </tr>
              ) : (
                filteredVisitors.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-600 whitespace-nowrap">
                      {v.passNumber}
                    </td>

                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900">{v.visitorName}</p>
                      <p className="text-2xs text-slate-500">{v.visitorPhone} • {v.company || 'Personal'}</p>
                      <p className="text-2xs text-slate-400 font-mono">{v.govtIdType}: {v.govtIdNumber}</p>
                    </td>

                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-800">{v.employeeName}</p>
                      <p className="text-2xs text-slate-400">{v.employeeDepartment}</p>
                    </td>

                    <td className="px-5 py-3.5">
                      <p className="text-slate-800 font-medium">{v.visitDate} @ {v.expectedTime}</p>
                      <div className="mt-1">
                        {v.status === 'CHECKED_IN' && (
                          <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Checked In @ {v.checkInTime ? new Date(v.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        )}
                        {v.status === 'APPROVED' && (
                          <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Approved by Host
                          </span>
                        )}
                        {v.status === 'PENDING' && (
                          <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Awaiting Host Approval
                          </span>
                        )}
                        {v.status === 'CHECKED_OUT' && (
                          <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            Checked Out
                          </span>
                        )}
                        {v.status === 'REJECTED' && (
                          <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Rejected by Host
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Operational Actions strictly conforming to Rule 6, 7, 8, 9 */}
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      {v.status === 'APPROVED' && (
                        <button
                          onClick={() => handleCheckIn(v.id, v.visitorName)}
                          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-2xs font-bold transition inline-flex items-center gap-1 shadow-2xs"
                        >
                          <LogIn className="w-3.5 h-3.5" /> Process Check-In
                        </button>
                      )}

                      {v.status === 'CHECKED_IN' && (
                        <button
                          onClick={() => handleCheckOut(v.id, v.visitorName)}
                          className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-2xs font-bold transition inline-flex items-center gap-1 shadow-2xs"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Process Check-Out
                        </button>
                      )}

                      {v.status === 'PENDING' && (
                        <div className="inline-flex items-center gap-2">
                          <span className="text-2xs text-amber-600 italic font-medium">Awaiting Approval</span>
                          <button
                            onClick={() => handleCancelVisit(v.id, v.visitorName)}
                            title="Cancel Visit Request"
                            className="text-2xs text-slate-400 hover:text-rose-600 font-bold underline"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      {v.status === 'REJECTED' && (
                        <span className="text-2xs text-rose-600 font-semibold bg-rose-50 px-2 py-1 rounded-lg">
                          Rule 9: Check-In Restricted
                        </span>
                      )}

                      {v.status === 'CHECKED_OUT' && (
                        <span className="text-2xs text-slate-500 font-medium">
                          Visit Cycle Complete
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedVisitorPass(v)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition font-bold text-2xs inline-flex items-center gap-1"
                      >
                        <QrCode className="w-3.5 h-3.5" /> Pass
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Walk-In Modal */}
      <VisitorRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        employees={employees}
        onSuccess={() => {
          fetchVisitors();
          onRefreshEmployees();
        }}
      />

      {/* Digital Visitor Pass Print Modal */}
      <VisitorPassModal
        visitor={selectedVisitorPass}
        onClose={() => setSelectedVisitorPass(null)}
      />

    </div>
  );
};
