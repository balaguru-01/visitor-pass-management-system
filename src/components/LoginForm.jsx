import React, { useState } from 'react';
import { api } from '../lib/api.js';
import { ShieldCheck, Mail, ArrowRight, UserCheck, Shield, Building2 } from 'lucide-react';

export const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('admin@company.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e, roleOverride, emailOverride) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    const targetEmail = emailOverride || email;

    try {
      await api.login(targetEmail, roleOverride);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const quickLoginAs = (role, targetEmail) => {
    setEmail(targetEmail);
    handleLogin(null, role, targetEmail);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-slate-800/90 backdrop-blur-md rounded-3xl border border-slate-700/80 shadow-2xl p-8 space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 text-indigo-400 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Visitor Pass System</h2>
          <p className="text-xs text-slate-400 font-medium">Enterprise Role-Based Visitor Management System</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Account Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. admin@company.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </button>
        </form>

        {/* Quick Demo Login Cards */}
        <div className="pt-4 border-t border-slate-700/60 space-y-3">
          <p className="text-2xs font-bold uppercase tracking-wider text-slate-400 text-center">
            Instant Demo Role Switcher
          </p>

          <div className="grid grid-cols-1 gap-2.5 text-left">
            <button
              onClick={() => quickLoginAs('ADMIN', 'admin@company.com')}
              className="p-3 bg-slate-900/60 hover:bg-indigo-950/40 border border-slate-700 hover:border-indigo-500/50 rounded-xl transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-indigo-300">System Administrator</p>
                  <p className="text-2xs text-slate-400">admin@company.com</p>
                </div>
              </div>
              <span className="text-2xs font-bold px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-md">Admin</span>
            </button>

            <button
              onClick={() => quickLoginAs('RECEPTIONIST', 'reception@company.com')}
              className="p-3 bg-slate-900/60 hover:bg-emerald-950/40 border border-slate-700 hover:border-emerald-500/50 rounded-xl transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-emerald-300">Front Desk Receptionist</p>
                  <p className="text-2xs text-slate-400">reception@company.com</p>
                </div>
              </div>
              <span className="text-2xs font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-md">Receptionist</span>
            </button>

            <button
              onClick={() => quickLoginAs('EMPLOYEE', 'john.doe@company.com')}
              className="p-3 bg-slate-900/60 hover:bg-amber-950/40 border border-slate-700 hover:border-amber-500/50 rounded-xl transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-amber-300">Host Employee (John Doe)</p>
                  <p className="text-2xs text-slate-400">john.doe@company.com</p>
                </div>
              </div>
              <span className="text-2xs font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-md">Employee</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
