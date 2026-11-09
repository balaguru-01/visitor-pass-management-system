import React from 'react';
import { ShieldCheck, Printer, Building, User, Calendar, Clock, QrCode } from 'lucide-react';

export const VisitorPassModal = ({ visitor, onClose }) => {
  if (!visitor) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none">
        
        {/* Pass Top Banner */}
        <div className="bg-slate-900 text-white p-5 text-center relative border-b-4 border-indigo-500">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white font-bold text-sm print:hidden"
          >
            ✕
          </button>
          <div className="inline-flex p-2 bg-indigo-600 rounded-xl mb-2">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-black uppercase tracking-wider">OFFICIAL VISITOR PASS</h2>
          <p className="text-2xs text-indigo-300 font-mono">PASS ID: {visitor.passNumber}</p>
        </div>

        {/* Pass Body Card */}
        <div className="p-6 space-y-5">
          
          {/* Visitor Photo & Name Header */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            {visitor.photoUrl ? (
              <img
                src={visitor.photoUrl}
                alt={visitor.visitorName}
                className="w-16 h-16 rounded-xl object-cover border-2 border-indigo-500 shadow-xs shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-indigo-100 border-2 border-indigo-500 text-indigo-700 flex items-center justify-center font-black text-xl shrink-0">
                {visitor.visitorName.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">{visitor.visitorName}</h3>
              <p className="text-xs text-slate-500 font-medium">{visitor.company || 'Personal Guest'}</p>
              <p className="text-2xs text-slate-400 font-mono mt-0.5">{visitor.govtIdType}: {visitor.govtIdNumber}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-2xs font-bold uppercase text-slate-400 block mb-0.5">Host Employee</span>
              <p className="font-bold text-slate-900">{visitor.employeeName}</p>
              <p className="text-2xs text-slate-500">{visitor.employeeDepartment}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-2xs font-bold uppercase text-slate-400 block mb-0.5">Scheduled Visit</span>
              <p className="font-bold text-slate-900">{visitor.visitDate}</p>
              <p className="text-2xs text-slate-500">{visitor.expectedTime}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <span className="text-2xs font-bold uppercase text-slate-400 block mb-0.5">Purpose of Visit</span>
            <p className="font-medium text-slate-800">{visitor.purpose}</p>
          </div>

          {/* QR Verification Placeholder */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-400">STATUS: {visitor.status}</p>
              <p className="text-2xs text-slate-400 mt-0.5">Valid for entry on authorized date only.</p>
            </div>
            <QrCode className="w-10 h-10 text-indigo-400" />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between print:hidden">
          <button
            onClick={handlePrint}
            className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print Visitor Pass
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
