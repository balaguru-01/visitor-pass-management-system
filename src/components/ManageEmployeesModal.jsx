import React, { useState } from 'react';
import { api } from '../lib/api.js';
import { Users, UserPlus, Building, Phone, Mail, CheckCircle, XCircle } from 'lucide-react';

export const ManageEmployeesModal = ({
  isOpen,
  onClose,
  employees = [],
  onRefresh
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Senior Staff');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.createUser({
        name,
        email,
        role: 'EMPLOYEE',
        department,
        designation,
        phone,
        isActive: true
      });

      setName('');
      setEmail('');
      setPhone('');
      setShowAddForm(false);
      onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  const toggleEmployeeActive = async (employee) => {
    try {
      await api.updateUser(employee.userId, { isActive: !employee.isActive });
      onRefresh();
    } catch (err) {
      console.error('Failed toggling employee active state', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base">Host Employee Management</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">
              Directory of staff members who can host visitors and approve incoming access requests.
            </p>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" /> {showAddForm ? 'Cancel Form' : 'Add Employee'}
            </button>
          </div>

          {/* Add Employee Form */}
          {showAddForm && (
            <form onSubmit={handleCreateEmployee} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Add New Staff Host Employee</h4>
              
              {error && <div className="p-2 bg-rose-50 text-rose-700 text-xs rounded-lg">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. jane.doe@company.com"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Marketing & Sales">Marketing & Sales</option>
                    <option value="IT & Security">IT & Security</option>
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    placeholder="e.g. Lead Architect"
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
                  {loading ? 'Saving...' : 'Save & Register Employee'}
                </button>
              </div>
            </form>
          )}

          {/* Employee Directory List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2.5">Code</th>
                  <th className="px-4 py-2.5">Staff Name</th>
                  <th className="px-4 py-2.5">Department & Title</th>
                  <th className="px-4 py-2.5">Pending Approvals</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-600">{emp.employeeCode}</td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">{emp.name}</p>
                      <p className="text-2xs text-slate-400">{emp.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-800">{emp.department}</p>
                      <p className="text-2xs text-slate-400">{emp.designation}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-2xs ${
                        emp.pendingRequestsCount && emp.pendingRequestsCount >= 3
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {emp.pendingRequestsCount || 0} / 3 Max
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {emp.isActive ? (
                        <span className="text-2xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
                      ) : (
                        <span className="text-2xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Inactive</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleEmployeeActive(emp)}
                        className="text-2xs font-bold text-indigo-600 hover:underline"
                      >
                        {emp.isActive ? 'Deactivate' : 'Activate'}
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
