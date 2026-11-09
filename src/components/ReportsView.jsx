import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import {
  FileText,
  BarChart2,
  Calendar,
  Building,
  Users,
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
  Download
} from 'lucide-react';

export const ReportsView = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Date Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await api.getReports({ startDate, endDate });
      setReportData(data);
    } catch (err) {
      console.error('Failed fetching analytics report', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate]);

  const handleExportCSV = () => {
    if (!reportData) return;

    let csv = 'Metric,Value\n';
    csv += `Total Visitor Requests,${reportData.totalVisitors}\n`;
    csv += `Pending Requests,${reportData.pendingRequests}\n`;
    csv += `Approved Visitors,${reportData.approvedVisitors}\n`;
    csv += `Rejected Visitors,${reportData.rejectedVisitors}\n`;
    csv += `Checked In Visitors,${reportData.checkedInVisitors}\n`;
    csv += `Checked Out Visitors,${reportData.checkedOutVisitors}\n`;
    csv += `Cancelled Visits,${reportData.cancelledVisitors}\n\n`;

    csv += 'Department,Visitor Count\n';
    Object.entries(reportData.departmentBreakdown).forEach(([dept, count]) => {
      csv += `"${dept}",${count}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Filters Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            Visitor Analytics & Compliance Reports
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time metric breakdown by department, status, and custom date range filters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="bg-transparent border-none focus:outline-hidden text-xs font-semibold text-slate-700"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="bg-transparent border-none focus:outline-hidden text-xs font-semibold text-slate-700"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading analytical metrics...</div>
      ) : !reportData ? (
        <div className="p-12 text-center text-slate-400">No report data available.</div>
      ) : (
        <div className="space-y-6">
          
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Total Visits</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{reportData.totalVisitors}</p>
              <span className="text-2xs text-slate-500 mt-1 block">In Selected Range</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Approved Passes</p>
              <p className="text-3xl font-black text-emerald-600 mt-1">{reportData.approvedVisitors}</p>
              <span className="text-2xs text-emerald-600 font-semibold mt-1 block">Host Approved</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Checked-In Guests</p>
              <p className="text-3xl font-black text-indigo-600 mt-1">{reportData.checkedInVisitors}</p>
              <span className="text-2xs text-indigo-600 font-semibold mt-1 block">Currently Active</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Rejected Requests</p>
              <p className="text-3xl font-black text-rose-600 mt-1">{reportData.rejectedVisitors}</p>
              <span className="text-2xs text-rose-600 font-semibold mt-1 block">Declined Access</span>
            </div>
          </div>

          {/* Departmental & Status Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Department Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600" />
                Departmental Visitor Distribution
              </h4>

              <div className="space-y-3">
                {Object.keys(reportData.departmentBreakdown).length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium">No departmental logs in this period.</p>
                ) : (
                  Object.entries(reportData.departmentBreakdown).map(([dept, count]) => {
                    const pct = Math.round((count / (reportData.totalVisitors || 1)) * 100);
                    return (
                      <div key={dept} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-800">{dept}</span>
                          <span className="text-slate-500">{count} visitors ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Status Breakdown List */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Status Transition Summary
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-semibold block">Pending Approval</span>
                  <span className="text-xl font-bold text-amber-600 mt-1 block">{reportData.pendingRequests}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-semibold block">Approved</span>
                  <span className="text-xl font-bold text-emerald-600 mt-1 block">{reportData.approvedVisitors}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-semibold block">Checked In</span>
                  <span className="text-xl font-bold text-indigo-600 mt-1 block">{reportData.checkedInVisitors}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-semibold block">Checked Out</span>
                  <span className="text-xl font-bold text-slate-700 mt-1 block">{reportData.checkedOutVisitors}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-semibold block">Rejected</span>
                  <span className="text-xl font-bold text-rose-600 mt-1 block">{reportData.rejectedVisitors}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-semibold block">Cancelled</span>
                  <span className="text-xl font-bold text-slate-500 mt-1 block">{reportData.cancelledVisitors}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
