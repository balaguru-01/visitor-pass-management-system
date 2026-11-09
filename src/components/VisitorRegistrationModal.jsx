import React, { useState } from 'react';
import { api } from '../lib/api.js';
import { UserPlus, AlertCircle, Camera, CheckCircle2 } from 'lucide-react';

export const VisitorRegistrationModal = ({
  isOpen,
  onClose,
  employees = [],
  onSuccess
}) => {
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [govtIdType, setGovtIdType] = useState('Driving License');
  const [govtIdNumber, setGovtIdNumber] = useState('');
  const [company, setCompany] = useState('');
  const [employeeId, setEmployeeId] = useState(employees[0]?.id || '');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  const [visitDate, setVisitDate] = useState(todayStr);
  const [expectedTime, setExpectedTime] = useState(nowTimeStr);
  const [purpose, setPurpose] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [businessRuleError, setBusinessRuleError] = useState(null);

  if (!isOpen) return null;

  const handleRegister = async (e) => {
    e.preventDefault();
    setBusinessRuleError(null);

    const selectedEmployee = employees.find(emp => emp.id === employeeId);
    if (!selectedEmployee) {
      setBusinessRuleError('Please select a valid host employee.');
      return;
    }

    setLoading(true);

    try {
      await api.createVisitorRequest({
        visitorName,
        visitorPhone,
        visitorEmail,
        govtIdType,
        govtIdNumber,
        company,
        photoUrl: photoUrl.trim() || undefined,
        employeeId,
        employeeName: selectedEmployee.name,
        employeeDepartment: selectedEmployee.department,
        visitDate,
        expectedTime,
        purpose
      });

      // Reset form
      setVisitorName('');
      setVisitorPhone('');
      setVisitorEmail('');
      setGovtIdNumber('');
      setCompany('');
      setPurpose('');
      setPhotoUrl('');

      onSuccess();
      onClose();
    } catch (err) {
      setBusinessRuleError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Register Visitor Pass</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleRegister} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Business Rules Error Card */}
          {businessRuleError && (
            <div className="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-2xl text-rose-800 text-xs font-semibold space-y-1">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Business Rule Validation Failed</span>
              </div>
              <p className="pl-6 leading-relaxed">{businessRuleError}</p>
            </div>
          )}

          {/* Visitor Details Section */}
          <div className="space-y-3">
            <h4 className="text-2xs font-extrabold uppercase tracking-wider text-slate-400">1. Visitor Personal Information</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-2xs font-bold text-slate-700 mb-1">Full Visitor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robert California"
                  value={visitorName}
                  onChange={e => setVisitorName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +1 555-0199"
                  value={visitorPhone}
                  onChange={e => setVisitorPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. visitor@company.com"
                  value={visitorEmail}
                  onChange={e => setVisitorEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 mb-1">Company / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Sabre Tech Solutions"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Govt ID Verification */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-2xs font-extrabold uppercase tracking-wider text-slate-400">2. Security Identity Clearance</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-2xs font-bold text-slate-700 mb-1">Govt ID Type *</label>
                <select
                  value={govtIdType}
                  onChange={e => setGovtIdType(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                >
                  <option value="Driving License">Driving License</option>
                  <option value="Passport">Passport</option>
                  <option value="National ID / Aadhaar">National ID / Aadhaar</option>
                  <option value="Voter ID">Voter ID</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 mb-1">Govt ID Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DL-9842104"
                  value={govtIdNumber}
                  onChange={e => setGovtIdNumber(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-medium focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Host & Schedule */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-2xs font-extrabold uppercase tracking-wider text-slate-400">3. Host Employee & Visit Schedule</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-2xs font-bold text-slate-700 mb-1">Select Host Employee *</label>
                <select
                  required
                  value={employeeId}
                  onChange={e => setEmployeeId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.department}) {emp.pendingRequestsCount ? `[${emp.pendingRequestsCount}/3 Pending]` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 mb-1">Visit Date *</label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={visitDate}
                  onChange={e => setVisitDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 mb-1">Expected Time *</label>
                <input
                  type="time"
                  required
                  value={expectedTime}
                  onChange={e => setExpectedTime(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-700 mb-1">Purpose of Visit *</label>
              <textarea
                required
                rows={2}
                placeholder="e.g. Technical Architecture Review Meeting"
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white"
              ></textarea>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              {loading ? 'Processing Business Rules...' : 'Submit & Create Visitor Request'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
