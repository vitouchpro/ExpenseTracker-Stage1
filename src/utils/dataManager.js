import pako from 'pako';

const STORAGE_KEY = 'bycodez_data';
const BACKUP_FILE_EXTENSION = '.ttf';

// Default data structure
export const getDefaultData = () => ({
  users: [
    {
      id: '1',
      username: 'admin',
      password: 'admin123', // In production, use proper hashing
      role: 'admin',
      name: 'Administrator'
    },
    {
      id: '2',
      username: 'user',
      password: 'user123',
      role: 'user',
      name: 'Regular User'
    }
  ],
  projects: [],
  currentProjectId: null,
  settings: {
    currency: '₹',
    dateFormat: 'DD/MM/YYYY',
    autoBackup: false,
    backupFrequency: 'weekly'
  },
  metadata: {
    version: '2.0.0',
    lastModified: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
});

// Default project structure
export const getDefaultProject = (name, totalCommittedAmount = 0) => ({
  id: generateId(),
  name: name,
  totalCommittedAmount: parseFloat(totalCommittedAmount) || 0,
  description: '',
  startDate: new Date().toISOString(),
  status: 'active', // active, completed, on-hold
  departments: [
    { id: generateId(), name: 'Mason', isDefault: true },
    { id: generateId(), name: 'Plumbing', isDefault: true },
    { id: generateId(), name: 'Electrical', isDefault: true },
    { id: generateId(), name: 'Interior', isDefault: true },
    { id: generateId(), name: 'Painting', isDefault: true },
    { id: generateId(), name: 'Miscellaneous', isDefault: true }
  ],
  paymentsIn: [],
  paymentsOut: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Load data from localStorage
export const loadData = () => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const data = JSON.parse(storedData);
      return { ...getDefaultData(), ...data };
    }
    return getDefaultData();
  } catch (error) {
    console.error('Error loading data:', error);
    return getDefaultData();
  }
};

// Save data to localStorage
export const saveData = (data) => {
  try {
    const dataToSave = {
      ...data,
      metadata: {
        ...data.metadata,
        lastModified: new Date().toISOString()
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

// Create backup file (.ttf format)
export const createBackup = (data) => {
  try {
    const backupData = {
      ...data,
      metadata: {
        ...data.metadata,
        backupDate: new Date().toISOString()
      }
    };
    
    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.href = url;
    link.download = `bycodez_backup_${timestamp}${BACKUP_FILE_EXTENSION}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error creating backup:', error);
    return false;
  }
};

// Create compressed backup (.json.gz format)
export const createCompressedBackup = (data) => {
  try {
    const backupData = {
      ...data,
      metadata: {
        ...data.metadata,
        backupDate: new Date().toISOString()
      }
    };
    
    const jsonString = JSON.stringify(backupData);
    const compressed = pako.gzip(jsonString);
    const blob = new Blob([compressed], { type: 'application/gzip' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.href = url;
    link.download = `bycodez_backup_${timestamp}.json.gz`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error creating compressed backup:', error);
    return false;
  }
};

// Restore from backup file
export const restoreFromBackup = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        let jsonString = e.target.result;
        
        // Check if file is compressed
        if (file.name.endsWith('.gz')) {
          const compressed = new Uint8Array(e.target.result);
          jsonString = pako.ungzip(compressed, { to: 'string' });
        }
        
        const data = JSON.parse(jsonString);
        
        // Validate data structure
        if (!data.users || !data.departments) {
          throw new Error('Invalid backup file structure');
        }
        
        // Merge with default data to ensure all fields exist
        const restoredData = { ...getDefaultData(), ...data };
        
        // Save to localStorage
        saveData(restoredData);
        
        resolve(restoredData);
      } catch (error) {
        reject(new Error('Failed to restore backup: ' + error.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read backup file'));
    };
    
    if (file.name.endsWith('.gz')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
};

// Clear all data
export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// File handling utilities
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv'
];

// Convert file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Validate file
export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB` };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: 'File type not supported' };
  }

  return { valid: true };
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Get file extension
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Check if file is image
export const isImageFile = (fileType) => {
  return fileType.startsWith('image/');
};

// Check if file is PDF
export const isPDFFile = (fileType) => {
  return fileType === 'application/pdf';
};

// Format currency
export const formatCurrency = (amount, currency = '₹') => {
  return `${currency}${parseFloat(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

// Format date
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  if (format === 'DD/MM/YYYY') {
    return `${day}/${month}/${year}`;
  } else if (format === 'MM/DD/YYYY') {
    return `${month}/${day}/${year}`;
  } else if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  }
  
  return `${day}/${month}/${year}`;
};

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Calculate total payments in
export const calculateTotalPaymentsIn = (paymentsIn) => {
  return paymentsIn.reduce((total, payment) => total + parseFloat(payment.amount || 0), 0);
};

// Calculate total payments out
export const calculateTotalPaymentsOut = (paymentsOut) => {
  return paymentsOut.reduce((total, payment) => total + parseFloat(payment.amount || 0), 0);
};

// Calculate balance
export const calculateBalance = (paymentsIn, paymentsOut) => {
  const totalIn = calculateTotalPaymentsIn(paymentsIn);
  const totalOut = calculateTotalPaymentsOut(paymentsOut);
  return totalIn - totalOut;
};

// Check if payment reminder needed
export const needsPaymentReminder = (paymentsIn, paymentsOut) => {
  const balance = calculateBalance(paymentsIn, paymentsOut);
  return balance < 0;
};

// Get expenses by department
export const getExpensesByDepartment = (paymentsOut, departments) => {
  const expenseMap = {};

  departments.forEach(dept => {
    expenseMap[dept.id] = {
      name: dept.name,
      total: 0,
      count: 0
    };
  });

  paymentsOut.forEach(payment => {
    if (expenseMap[payment.departmentId]) {
      expenseMap[payment.departmentId].total += parseFloat(payment.amount || 0);
      expenseMap[payment.departmentId].count += 1;
    }
  });

  return Object.values(expenseMap);
};

// Get current project
export const getCurrentProject = (data) => {
  if (!data.currentProjectId || !data.projects) return null;
  return data.projects.find(p => p.id === data.currentProjectId) || null;
};

// Calculate payment progress for a project
export const calculatePaymentProgress = (project) => {
  if (!project || !project.totalCommittedAmount) {
    return {
      totalCommitted: 0,
      totalReceived: 0,
      remainingBalance: 0,
      percentageReceived: 0,
      percentageRemaining: 100
    };
  }

  const totalCommitted = parseFloat(project.totalCommittedAmount) || 0;
  const totalReceived = calculateTotalPaymentsIn(project.paymentsIn || []);
  const remainingBalance = totalCommitted - totalReceived;
  const percentageReceived = totalCommitted > 0 ? (totalReceived / totalCommitted) * 100 : 0;
  const percentageRemaining = 100 - percentageReceived;

  return {
    totalCommitted,
    totalReceived,
    remainingBalance,
    percentageReceived: Math.min(percentageReceived, 100),
    percentageRemaining: Math.max(percentageRemaining, 0)
  };
};

// Get project summary
export const getProjectSummary = (project) => {
  if (!project) return null;

  const totalIn = calculateTotalPaymentsIn(project.paymentsIn || []);
  const totalOut = calculateTotalPaymentsOut(project.paymentsOut || []);
  const balance = totalIn - totalOut;
  const progress = calculatePaymentProgress(project);

  return {
    ...progress,
    totalExpenses: totalOut,
    netBalance: balance,
    needsPaymentReminder: balance < 0
  };
};

