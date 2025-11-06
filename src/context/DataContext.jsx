import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { loadData, saveData, generateId, getDefaultProject, getCurrentProject } from '../utils/dataManager';

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(loadData());
  const [loading, setLoading] = useState(false);

  // Get current project
  const currentProject = useMemo(() => getCurrentProject(data), [data, data.currentProjectId]);

  // Auto-save data whenever it changes
  useEffect(() => {
    saveData(data);
  }, [data]);

  // Projects
  const addProject = (name, totalCommittedAmount, description = '') => {
    const newProject = getDefaultProject(name, totalCommittedAmount);
    newProject.description = description;

    setData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
      currentProjectId: newProject.id
    }));
    return newProject;
  };

  const updateProject = (projectId, updates) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === projectId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      )
    }));
  };

  const deleteProject = (projectId) => {
    setData(prev => {
      const newProjects = prev.projects.filter(p => p.id !== projectId);
      const newCurrentId = prev.currentProjectId === projectId
        ? (newProjects.length > 0 ? newProjects[0].id : null)
        : prev.currentProjectId;

      return {
        ...prev,
        projects: newProjects,
        currentProjectId: newCurrentId
      };
    });
  };

  const setCurrentProject = (projectId) => {
    setData(prev => ({
      ...prev,
      currentProjectId: projectId
    }));
  };

  // Departments (for current project)
  const addDepartment = (name) => {
    if (!currentProject) return null;

    const newDepartment = {
      id: generateId(),
      name,
      isDefault: false
    };

    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === currentProject.id
          ? { ...p, departments: [...p.departments, newDepartment], updatedAt: new Date().toISOString() }
          : p
      )
    }));
    return newDepartment;
  };

  const deleteDepartment = (id) => {
    if (!currentProject) return;

    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === currentProject.id
          ? {
              ...p,
              departments: p.departments.filter(d => d.id !== id && !d.isDefault),
              updatedAt: new Date().toISOString()
            }
          : p
      )
    }));
  };

  // Payments In (for current project)
  const addPaymentIn = (payment) => {
    if (!currentProject) return null;

    const newPayment = {
      id: generateId(),
      ...payment,
      date: payment.date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === currentProject.id
          ? { ...p, paymentsIn: [...p.paymentsIn, newPayment], updatedAt: new Date().toISOString() }
          : p
      )
    }));
    return newPayment;
  };

  const updatePaymentIn = (id, updates) => {
    if (!currentProject) return;

    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === currentProject.id
          ? {
              ...p,
              paymentsIn: p.paymentsIn.map(payment =>
                payment.id === id ? { ...payment, ...updates, updatedAt: new Date().toISOString() } : payment
              ),
              updatedAt: new Date().toISOString()
            }
          : p
      )
    }));
  };

  const deletePaymentIn = (id) => {
    if (!currentProject) return;

    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === currentProject.id
          ? { ...p, paymentsIn: p.paymentsIn.filter(payment => payment.id !== id), updatedAt: new Date().toISOString() }
          : p
      )
    }));
  };

  // Payments Out (for current project)
  const addPaymentOut = (payment) => {
    if (!currentProject) return null;

    const newPayment = {
      id: generateId(),
      ...payment,
      date: payment.date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === currentProject.id
          ? { ...p, paymentsOut: [...p.paymentsOut, newPayment], updatedAt: new Date().toISOString() }
          : p
      )
    }));
    return newPayment;
  };

  const updatePaymentOut = (id, updates) => {
    if (!currentProject) return;

    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === currentProject.id
          ? {
              ...p,
              paymentsOut: p.paymentsOut.map(payment =>
                payment.id === id ? { ...payment, ...updates, updatedAt: new Date().toISOString() } : payment
              ),
              updatedAt: new Date().toISOString()
            }
          : p
      )
    }));
  };

  const deletePaymentOut = (id) => {
    if (!currentProject) return;

    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === currentProject.id
          ? { ...p, paymentsOut: p.paymentsOut.filter(payment => payment.id !== id), updatedAt: new Date().toISOString() }
          : p
      )
    }));
  };

  // Restore data
  const restoreData = (newData) => {
    setData(newData);
  };

  const value = {
    data,
    loading,
    currentProject,
    // Projects
    addProject,
    updateProject,
    deleteProject,
    setCurrentProject,
    // Departments
    addDepartment,
    deleteDepartment,
    // Payments In
    addPaymentIn,
    updatePaymentIn,
    deletePaymentIn,
    // Payments Out
    addPaymentOut,
    updatePaymentOut,
    deletePaymentOut,
    // Restore
    restoreData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

