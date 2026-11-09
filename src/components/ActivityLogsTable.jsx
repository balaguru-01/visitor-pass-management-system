import React, { useState } from 'react';
import { Search, History, ShieldAlert, CheckCircle, XCircle, LogIn, LogOut, MessageSquare, Plus } from 'lucide-react';

export const ActivityLogsTable = ({ logs = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.performedByName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const getActionBadge = (action) => {
    switch (action) {
      case 'CREATED':
        return (
          <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Plus className="w-3 h-3" /> Created
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" /> Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case 'CHECKED_IN':
        return (
          <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <LogIn className="w-3 h-3" /> Checked In
          </span>
        );
      case 'CHECKED_OUT':
        return (
          <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <LogOut className="w-3 h-3" /> Checked Out
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <ShieldAlert className="w-3 h-3" /> Cancelled
          </span>
        );
      case 'REMARKS_ADDED':
        return (
          <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <MessageSquare className="w-3 h-3" /> Remarks
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            Audit Activity History
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Full compliance audit trail of all visitor registration actions & status transitions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search visitor or user..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">All Actions</option>
            <option value="CREATED">Created</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CHECKED_IN">Checked In</option>
            <option value="CHECKED_OUT">Checked Out</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REMARKS_ADDED">Remarks Added</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-5 py-3">Timestamp</th>
              <th className="px-5 py-3">Action</th>
              <th className="px-5 py-3">Visitor Name</th>
              <th className="px-5 py-3">Performed By</th>
              <th className="px-5 py-3">Audit Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-400 font-normal">
                  No activity logs matching your filter parameters.
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {getActionBadge(log.action)}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap font-semibold text-slate-900">
                    {log.visitorName}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-800">{log.performedByName}</span>
                      <span className="text-2xs px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 font-bold">
                        {log.performedByRole}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {log.details}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
