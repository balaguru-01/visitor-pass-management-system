import React, { useState } from 'react';
import { api } from '../lib/api.js';
import { Shield, UserPlus, ShieldCheck, Mail, CheckCircle, XCircle } from 'lucide-react';

export const ManageUsersModal = ({
  isOpen,
  onClose,
  users = [],
  onRefresh
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('RECEPTIONIST');
  const [department, setDepartment] = useState('Front Desk');
  const [designation, setDesignation] = useState('Staff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.createUser({
        name,
        email,
        role,
        department,
        designation,
        isActive: true
      });

      setName('');
      setEmail('');
      setShowAddForm(false);
      onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to create user account');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserActive = async (user) => {
    try {
      await api.updateUser(user.id, { isActive: !user.isActive });
      onRefresh();
    } catch (err) {
      console.error('Failed toggling user active state', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">User Account & Role Management</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">
              Manage RBAC login accounts (Administrator, Receptionist, Host Employee).
            </p>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" /> {showAddForm ? 'Cancel Form' : 'Create User Account'}
            </button>
          </div>

          {/* Add User Form */}
          {showAddForm && (
            <form onSubmit={handleCreateUser} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Provision System Account</h4>
              
              {error && <div className="p-2 bg-rose-50 text-rose-700 text-xs rounded-lg">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Emily Davis"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. emily@company.com"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-1">Assigned Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-indigo-600"
                  >
                    <option value="ADMIN">ADMINISTRATOR</option>
                    <option value="RECEPTIONIST">RECEPTIONIST</option>
                    <option value="EMPLOYEE">HOST EMPLOYEE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    placeholder="e.g. Front Desk / Security"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                >
                  {loading ? 'Creating...' : 'Provision User'}
                </button>
              </div>
            </form>
          )}

          {/* User Directory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2.5">User Name</th>
                  <th className="px-4 py-2.5">Role</th>
                  <th className="px-4 py-2.5">Department</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Toggle Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-2xs text-slate-400">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-2xs font-bold ${
                        u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-800' :
                        u.role === 'RECEPTIONIST' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{u.department || 'General'}</td>
                    <td className="px-4 py-3">
                      {u.isActive ? (
                        <span className="text-2xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
                      ) : (
                        <span className="text-2xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Inactive</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleUserActive(u)}
                        className="text-2xs font-bold text-indigo-600 hover:underline"
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
