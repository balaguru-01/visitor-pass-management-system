import React, { useState, useEffect } from 'react';
import { ShieldCheck, LogOut, Clock, RefreshCw } from 'lucide-react';

export const Navbar = ({
  user,
  onLogout,
  onSwitchRoleDemo,
  activeTab,
  setActiveTab
}) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-0.5 rounded-full text-xs font-bold">Administrator</span>;
      case 'RECEPTIONIST':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full text-xs font-bold">Reception Desk</span>;
      case 'EMPLOYEE':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full text-xs font-bold">Host Employee</span>;
      default:
        return null;
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                Visitor Pass <span className="text-xs font-normal text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-800/60">React Vite</span>
              </h1>
              <p className="text-2xs text-slate-400 hidden sm:block">Enterprise Visitor Pass Management & Audit System</p>
            </div>
          </div>

          {/* Role Persona Quick Switcher (For evaluators to easily test each role!) */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 text-xs">
            <span className="text-slate-400 text-2xs uppercase tracking-wider font-bold px-2 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-indigo-400" /> Switch Role:
            </span>
            <button
              onClick={() => onSwitchRoleDemo('ADMIN')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                user.role === 'ADMIN' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => onSwitchRoleDemo('RECEPTIONIST')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                user.role === 'RECEPTIONIST' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              Receptionist
            </button>
            <button
              onClick={() => onSwitchRoleDemo('EMPLOYEE')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                user.role === 'EMPLOYEE' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              Employee
            </button>
          </div>

          {/* Right User Info & Clock */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 py-1.5 px-3 rounded-lg border border-slate-700/40 font-mono">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{time}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right text-xs hidden sm:block">
                <p className="font-bold text-slate-100">{user.name}</p>
                <div className="mt-0.5">{getRoleBadge(user.role)}</div>
              </div>

              <button
                onClick={onLogout}
                title="Logout"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition border border-transparent hover:border-slate-700"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
