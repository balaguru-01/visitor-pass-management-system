import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import {
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Building2
} from 'lucide-react';

export const EmployeeDashboard = ({
  currentUser,
  employee,
  onRefreshEmployees
}) => {
  const [assignedVisitors, setAssignedVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Approval/Rejection Modal state
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [remarksText, setRemarksText] = useState('');
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAssignedVisitors = async () => {
    setLoading(true);
    try {
      if (employee) {
        const data = await api.getVisitors({ employeeId: employee.id });
        setAssignedVisitors(data);
      } else {
        const data = await api.getVisitors();
        setAssignedVisitors(data);
      }
    } catch (err) {
      console.error('Failed to load employee visitor requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedVisitors();
  }, [employee]);

  const pendingRequests = assignedVisitors.filter(v => v.status === 'PENDING');
  const pastRequests = assignedVisitors.filter(v => v.status !== 'PENDING');

  const pendingCount = pendingRequests.length;
  const isAtMaxPending = pendingCount >= 3;

  const handleOpenAction = (visitor, type) => {
    setSelectedVisitor(visitor);
    setActionType(type);
    setRemarksText('');
    setError(null);
  };

  const handleCloseModal = () => {
    setSelectedVisitor(null);
    setActionType(null);
    setRemarksText('');
    setError(null);
  };

  const handleSubmitAction = async (e) => {
    e.preventDefault();
    if (!selectedVisitor || !actionType) return;

    setError(null);

    if (actionType === 'REJECT' && !remarksText.trim()) {
      setError('Rule Requirement: Rejection remarks/reason are mandatory when rejecting a visitor request.');
      return;
    }

    setActionLoading(true);
    try {
      if (actionType === 'APPROVE') {
        await api.approveVisitor(selectedVisitor.id, remarksText.trim() || undefined);
      } else if (actionType === 'REJECT') {
        await api.rejectVisitor(selectedVisitor.id, remarksText.trim());
      } else if (actionType === 'REMARKS') {
        await api.addRemarks(selectedVisitor.id, remarksText.trim());
      }

      handleCloseModal();
      fetchAssignedVisitors();
      onRefreshEmployees();
    } catch (err) {
      setError(err.message || 'Operation failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CHECKED_IN':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">Checked In</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>;
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">Awaiting Your Review</span>;
      case 'CHECKED_OUT':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">Checked Out</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">Rejected</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-500 border border-slate-300">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 text-2xs font-bold uppercase tracking-wider rounded-full">
            Host Employee Dashboard
          </span>
          <h2 className="text-2xl font-black tracking-tight">Welcome, {currentUser.name}</h2>
          <p className="text-xs text-slate-300">
            Review incoming visitor pass requests, grant access clearance, or add host remarks.
          </p>
        </div>

        {/* Rule 5 Pending Quota Badge */}
        <div className={`p-4 rounded-2xl border text-center shrink-0 ${
          isAtMaxPending ? 'bg-rose-500/20 border-rose-400/40 text-rose-200' : 'bg-slate-800/80 border-slate-700 text-slate-200'
        }`}>
          <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Rule 5 Pending Request Capacity</p>
          <p className="text-2xl font-black mt-0.5">
            <span className={isAtMaxPending ? 'text-rose-400' : 'text-amber-400'}>{pendingCount}</span> / 3 Max
          </p>
          {isAtMaxPending && (
            <p className="text-2xs text-rose-300 font-bold mt-1">⛔ At Maximum Quota Limit</p>
          )}
        </div>
      </div>

      {/* Section 1: Pending Visitor Requests Awaiting Review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            Visitor Requests Awaiting Your Approval ({pendingCount})
          </h3>
          <span className="text-xs text-slate-500">
            Action required before receptionists can issue entry passes.
          </span>
        </div>

        {loading ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">
            Loading your assigned visitor requests...
          </div>
        ) : pendingRequests.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 space-y-1">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="font-bold text-slate-800">All Visitor Requests Cleared!</p>
            <p className="text-xs text-slate-400">You currently have zero pending visitor approvals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingRequests.map(v => (
              <div key={v.id} className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs space-y-4 relative overflow-hidden">
                <div className="top-0 left-0 right-0 h-1 bg-amber-500 absolute"></div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center font-bold text-amber-800 text-sm">
                      {v.visitorName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">{v.visitorName}</h4>
                      <p className="text-2xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400" /> {v.company || 'Personal Visit'}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-2xs font-bold px-2 py-0.5 bg-slate-100 text-indigo-600 rounded-md">
                    {v.passNumber}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                  <p><span className="text-slate-500 font-medium">Scheduled:</span> <strong className="text-slate-800">{v.visitDate} @ {v.expectedTime}</strong></p>
                  <p><span className="text-slate-500 font-medium">Contact:</span> {v.visitorPhone}</p>
                  <p><span className="text-slate-500 font-medium">{v.govtIdType}:</span> {v.govtIdNumber}</p>
                  <div className="pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500 block mb-0.5 font-medium">Purpose:</span>
                    <p className="text-slate-800 font-medium italic">{v.purpose}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleOpenAction(v, 'APPROVE')}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleOpenAction(v, 'REJECT')}
                    className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Visitor History & Approved Logs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Visitor History & Active Clearances</h3>
            <p className="text-xs text-slate-500 mt-0.5">Past approved, checked-in, and departed guests.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Pass #</th>
                <th className="px-5 py-3">Visitor Name</th>
                <th className="px-5 py-3">Schedule</th>
                <th className="px-5 py-3">Purpose</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {pastRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    No past visitor history recorded for your host account yet.
                  </td>
                </tr>
              ) : (
                pastRequests.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-600 whitespace-nowrap">{v.passNumber}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900">{v.visitorName}</p>
                      <p className="text-2xs text-slate-400">{v.company || 'Personal'}</p>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {v.visitDate} @ {v.expectedTime}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">
                      {v.purpose}
                      {v.remarks && <p className="text-2xs text-indigo-600 italic mt-0.5">Remarks: {v.remarks}</p>}
                      {v.rejectionReason && <p className="text-2xs text-rose-600 italic mt-0.5">Reason: {v.rejectionReason}</p>}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {getStatusBadge(v.status)}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenAction(v, 'REMARKS')}
                        className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-2xs font-bold transition flex items-center gap-1 inline-flex"
                      >
                        <MessageSquare className="w-3 h-3 text-indigo-600" /> Add Remarks
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Dialog Modal */}
      {selectedVisitor && actionType && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <h3 className="font-semibold text-lg">
                {actionType === 'APPROVE' && 'Approve Visitor Pass Request'}
                {actionType === 'REJECT' && 'Reject Visitor Pass Request'}
                {actionType === 'REMARKS' && 'Add Host Remarks'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitAction} className="p-6 space-y-4">
              
              {error && (
                <div className="p-3 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl text-rose-800 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-slate-900 text-sm">{selectedVisitor.visitorName}</p>
                <p className="text-slate-500">Scheduled: {selectedVisitor.visitDate} @ {selectedVisitor.expectedTime}</p>
                <p className="text-slate-500">Purpose: {selectedVisitor.purpose}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {actionType === 'REJECT' ? (
                    <span>Rejection Reason / Remarks <span className="text-rose-500">* (Mandatory)</span></span>
                  ) : (
                    <span>Optional Host Remarks</span>
                  )}
                </label>
                <textarea
                  rows={3}
                  required={actionType === 'REJECT'}
                  placeholder={
                    actionType === 'REJECT'
                      ? 'Please state why this request is being rejected (e.g. Schedule conflict / Unplanned request).'
                      : 'Add any specific entry instructions or clearance notes for reception.'
                  }
                  value={remarksText}
                  onChange={e => setRemarksText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-medium"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={`flex-1 py-2.5 px-4 text-white font-bold text-xs rounded-xl transition ${
                    actionType === 'REJECT' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {actionLoading ? 'Processing...' : actionType === 'REJECT' ? 'Confirm Rejection' : 'Confirm & Save'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
