import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Edit2, Trash2, TrendingDown, Calendar, FileText, Tag, Building2 } from 'lucide-react';
import { formatCurrency, formatDate, calculateTotalPaymentsOut } from '../utils/dataManager';
import FileUpload from '../components/FileUpload';
import AttachmentBadge from '../components/AttachmentBadge';

const PaymentsOut = () => {
  const { currentProject, addPaymentOut, updatePaymentOut, deletePaymentOut } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    departmentId: '',
    description: '',
    category: 'material',
    attachments: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!formData.departmentId) {
      alert('Please select a department');
      return;
    }

    if (editingPayment) {
      updatePaymentOut(editingPayment.id, formData);
    } else {
      addPaymentOut(formData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      departmentId: '',
      description: '',
      category: 'material',
      attachments: []
    });
    setEditingPayment(null);
    setShowModal(false);
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setFormData({
      amount: payment.amount,
      date: new Date(payment.date).toISOString().split('T')[0],
      departmentId: payment.departmentId,
      description: payment.description || '',
      category: payment.category || 'material',
      attachments: payment.attachments || []
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      deletePaymentOut(id);
    }
  };

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Building2 className="w-20 h-20 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Project Selected</h2>
          <p className="text-gray-600">Please select a construction project first</p>
        </div>
      </div>
    );
  }

  const getDepartmentName = (departmentId) => {
    const dept = currentProject.departments.find(d => d.id === departmentId);
    return dept ? dept.name : 'Unknown';
  };

  const totalExpenses = calculateTotalPaymentsOut(currentProject.paymentsOut);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-6 h-6 text-primary-600" />
            <span className="text-sm font-medium text-gray-600">{currentProject.name}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Payments Out</h1>
          <p className="text-gray-600 mt-1">Track all expenses and outgoing payments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2 justify-center"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </button>
      </div>

      {/* Summary Card */}
      <div className="card bg-gradient-to-br from-danger-500 to-danger-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-danger-100 text-sm font-medium">Total Expenses</p>
            <h2 className="text-4xl font-bold mt-2">{formatCurrency(totalExpenses)}</h2>
            <p className="text-danger-100 mt-2">{currentProject.paymentsOut.length} transactions</p>
          </div>
          <div className="bg-white/20 p-4 rounded-xl">
            <TrendingDown className="w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Files</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProject.paymentsOut
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(payment.date)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {getDepartmentName(payment.departmentId)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payment.category === 'material' 
                          ? 'bg-blue-100 text-blue-700' 
                          : payment.category === 'labor'
                          ? 'bg-green-100 text-green-700'
                          : payment.category === 'equipment'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {payment.category || 'Other'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        {payment.description || '-'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <AttachmentBadge attachments={payment.attachments} />
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-danger-600">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(payment)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(payment.id)}
                          className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {currentProject.paymentsOut.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    <TrendingDown className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No expenses recorded yet</p>
                    <p className="text-sm mt-1">Click "Add Expense" to record your first expense</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingPayment ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Department *</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="">Select Department</option>
                    {currentProject.departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="material">Material</option>
                    <option value="labor">Labor</option>
                    <option value="equipment">Equipment</option>
                    <option value="transport">Transport</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="label">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="input"
                    placeholder="Enter amount"
                    required
                  />
                </div>

                <div>
                  <label className="label">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input"
                    rows="3"
                    placeholder="Enter expense description"
                  />
                </div>

                {/* File Upload */}
                <FileUpload
                  attachments={formData.attachments}
                  onAttachmentsChange={(attachments) => setFormData({ ...formData, attachments })}
                  maxFiles={5}
                />

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingPayment ? 'Update Expense' : 'Add Expense'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsOut;

