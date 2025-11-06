import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Edit2, Trash2, TrendingUp, Calendar, FileText, Building2 } from 'lucide-react';
import { formatCurrency, formatDate, calculateTotalPaymentsIn } from '../utils/dataManager';
import FileUpload from '../components/FileUpload';
import AttachmentBadge from '../components/AttachmentBadge';

const PaymentsIn = () => {
  const { currentProject, addPaymentIn, updatePaymentIn, deletePaymentIn } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'installment',
    description: '',
    clientName: '',
    attachments: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (editingPayment) {
      updatePaymentIn(editingPayment.id, formData);
    } else {
      addPaymentIn(formData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      type: 'installment',
      description: '',
      clientName: '',
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
      type: payment.type,
      description: payment.description || '',
      clientName: payment.clientName || '',
      attachments: payment.attachments || []
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      deletePaymentIn(id);
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

  const totalPayments = calculateTotalPaymentsIn(currentProject.paymentsIn);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-6 h-6 text-primary-600" />
            <span className="text-sm font-medium text-gray-600">{currentProject.name}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Payments In</h1>
          <p className="text-gray-600 mt-1">Track all incoming payments from clients</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2 justify-center"
        >
          <Plus className="w-5 h-5" />
          Add Payment
        </button>
      </div>

      {/* Summary Card */}
      <div className="card bg-gradient-to-br from-success-500 to-success-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-success-100 text-sm font-medium">Total Payments Received</p>
            <h2 className="text-4xl font-bold mt-2">{formatCurrency(totalPayments)}</h2>
            <p className="text-success-100 mt-2">{currentProject.paymentsIn.length} transactions</p>
          </div>
          <div className="bg-white/20 p-4 rounded-xl">
            <TrendingUp className="w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Client</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Files</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProject.paymentsIn
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
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payment.type === 'advance' 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'bg-success-100 text-success-700'
                      }`}>
                        {payment.type === 'advance' ? 'Advance' : 'Installment'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{payment.clientName || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        {payment.description || '-'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <AttachmentBadge attachments={payment.attachments} />
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-success-600">
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
              {currentProject.paymentsIn.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No payments received yet</p>
                    <p className="text-sm mt-1">Click "Add Payment" to record your first payment</p>
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
                {editingPayment ? 'Edit Payment' : 'Add New Payment'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Payment Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="advance">Advance Payment</option>
                    <option value="installment">Installment</option>
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
                  <label className="label">Client Name</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="input"
                    placeholder="Enter client name"
                  />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input"
                    rows="3"
                    placeholder="Enter payment description"
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
                    {editingPayment ? 'Update Payment' : 'Add Payment'}
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

export default PaymentsIn;

