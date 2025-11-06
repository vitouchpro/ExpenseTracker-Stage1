import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Edit2, Trash2, Building2, CheckCircle, Clock, Pause, TrendingUp, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate, getProjectSummary } from '../utils/dataManager';

const Projects = () => {
  const { data, currentProject, addProject, updateProject, deleteProject, setCurrentProject } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    totalCommittedAmount: '',
    description: '',
    status: 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a project name');
      return;
    }

    if (!formData.totalCommittedAmount || parseFloat(formData.totalCommittedAmount) <= 0) {
      alert('Please enter a valid total committed amount');
      return;
    }

    if (editingProject) {
      updateProject(editingProject.id, formData);
    } else {
      addProject(formData.name, formData.totalCommittedAmount, formData.description);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      totalCommittedAmount: '',
      description: '',
      status: 'active'
    });
    setEditingProject(null);
    setShowModal(false);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      totalCommittedAmount: project.totalCommittedAmount,
      description: project.description || '',
      status: project.status || 'active'
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project? All associated data will be lost.')) {
      deleteProject(id);
    }
  };

  const handleSelectProject = (projectId) => {
    setCurrentProject(projectId);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success-600" />;
      case 'on-hold':
        return <Pause className="w-5 h-5 text-warning-600" />;
      default:
        return <Clock className="w-5 h-5 text-primary-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success-100 text-success-700 border-success-200';
      case 'on-hold':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      default:
        return 'bg-primary-100 text-primary-700 border-primary-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Construction Sites</h1>
          <p className="text-gray-600 mt-1">Manage multiple construction projects independently</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2 justify-center"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {/* Current Project Banner */}
      {currentProject && (
        <div className="card bg-gradient-to-r from-primary-500 to-primary-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium mb-1">Currently Active Project</p>
              <h2 className="text-2xl font-bold">{currentProject.name}</h2>
              {currentProject.description && (
                <p className="text-primary-100 mt-2">{currentProject.description}</p>
              )}
            </div>
            <Building2 className="w-16 h-16 text-white/30" />
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.projects.map((project) => {
          const summary = getProjectSummary(project);
          const isActive = currentProject?.id === project.id;
          
          return (
            <div
              key={project.id}
              className={`card hover:shadow-lg transition-all cursor-pointer ${
                isActive ? 'ring-2 ring-primary-500 bg-primary-50' : ''
              }`}
              onClick={() => handleSelectProject(project.id)}
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                    <h3 className="font-bold text-lg text-gray-900 truncate">{project.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(project.status)}
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Project Stats */}
              <div className="space-y-3">
                {/* Total Committed Amount */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Total Contract</span>
                    <DollarSign className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(summary.totalCommitted)}</p>
                </div>

                {/* Payment Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">Payment Progress</span>
                    <span className="text-xs font-semibold text-primary-600">
                      {summary.percentageReceived.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(summary.percentageReceived, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      Received: {formatCurrency(summary.totalReceived)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Remaining: {formatCurrency(summary.remainingBalance)}
                    </span>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600">Expenses</p>
                    <p className="text-sm font-semibold text-danger-600">{formatCurrency(summary.totalExpenses)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Net Balance</p>
                    <p className={`text-sm font-semibold ${summary.netBalance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                      {formatCurrency(summary.netBalance)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Indicator */}
              {isActive && (
                <div className="mt-4 pt-3 border-t border-primary-200">
                  <div className="flex items-center gap-2 text-primary-700">
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">Active Project</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {data.projects.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Yet</h3>
            <p className="text-gray-600 mb-4">Create your first construction project to get started</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create First Project
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Project Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="e.g., Residential Building - Phase 1"
                    required
                  />
                </div>

                <div>
                  <label className="label">Total Committed Amount (Contract Value) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.totalCommittedAmount}
                    onChange={(e) => setFormData({ ...formData, totalCommittedAmount: e.target.value })}
                    className="input"
                    placeholder="Enter total contract amount"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This is the total estimated/agreed construction cost
                  </p>
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input"
                    rows="3"
                    placeholder="Enter project description"
                  />
                </div>

                {editingProject && (
                  <div>
                    <label className="label">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="input"
                    >
                      <option value="active">Active</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingProject ? 'Update Project' : 'Create Project'}
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

export default Projects;

