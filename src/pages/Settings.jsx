import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { 
  Download, 
  Upload, 
  Database, 
  AlertCircle, 
  CheckCircle,
  Settings as SettingsIcon,
  FileArchive
} from 'lucide-react';
import { 
  createBackup, 
  createCompressedBackup, 
  restoreFromBackup,
  clearAllData 
} from '../utils/dataManager';

const Settings = () => {
  const { data, restoreData } = useData();
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      const success = createBackup(data);
      if (success) {
        showMessage('success', 'Backup created successfully! File downloaded to your device.');
      } else {
        showMessage('error', 'Failed to create backup. Please try again.');
      }
    } catch (error) {
      showMessage('error', 'Error creating backup: ' + error.message);
    }
    setLoading(false);
  };

  const handleCreateCompressedBackup = async () => {
    setLoading(true);
    try {
      const success = createCompressedBackup(data);
      if (success) {
        showMessage('success', 'Compressed backup created successfully! File downloaded to your device.');
      } else {
        showMessage('error', 'Failed to create compressed backup. Please try again.');
      }
    } catch (error) {
      showMessage('error', 'Error creating compressed backup: ' + error.message);
    }
    setLoading(false);
  };

  const handleRestoreBackup = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.ttf') && !file.name.endsWith('.json.gz')) {
      showMessage('error', 'Invalid file format. Please select a .ttf or .json.gz backup file.');
      return;
    }

    if (!window.confirm('Restoring a backup will replace all current data. Are you sure you want to continue?')) {
      event.target.value = '';
      return;
    }

    setLoading(true);
    try {
      const restoredData = await restoreFromBackup(file);
      restoreData(restoredData);
      showMessage('success', 'Backup restored successfully! Page will reload in 2 seconds.');
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      showMessage('error', 'Error restoring backup: ' + error.message);
    }
    setLoading(false);
    event.target.value = '';
  };

  const handleClearData = () => {
    if (!window.confirm('WARNING: This will delete ALL data permanently. This action cannot be undone. Are you sure?')) {
      return;
    }

    if (!window.confirm('This is your final warning. All data will be lost. Continue?')) {
      return;
    }

    setLoading(true);
    try {
      clearAllData();
      showMessage('success', 'All data cleared. Page will reload in 2 seconds.');
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      showMessage('error', 'Error clearing data: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your application settings and data</p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`p-4 rounded-lg flex items-start gap-3 animate-slide-in ${
          message.type === 'success' 
            ? 'bg-success-50 border border-success-200' 
            : 'bg-danger-50 border border-danger-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
          )}
          <p className={message.type === 'success' ? 'text-success-700' : 'text-danger-700'}>
            {message.text}
          </p>
        </div>
      )}

      {/* Backup & Restore Section */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary-100 p-3 rounded-lg">
            <Database className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Backup & Restore</h2>
            <p className="text-gray-600 text-sm">Protect your data with regular backups</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Create Backup */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Create Backup (.ttf)</h3>
                <p className="text-sm text-gray-600">
                  Download a backup of all your data in native .ttf format. This file contains all your 
                  payments, departments, and settings in JSON format.
                </p>
              </div>
              <button
                onClick={handleCreateBackup}
                disabled={loading}
                className="btn btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                Create Backup
              </button>
            </div>
          </div>

          {/* Create Compressed Backup */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Create Compressed Backup (.json.gz)</h3>
                <p className="text-sm text-gray-600">
                  Download a compressed backup for easier sharing and storage. This format is smaller 
                  and ideal for portability.
                </p>
              </div>
              <button
                onClick={handleCreateCompressedBackup}
                disabled={loading}
                className="btn btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                <FileArchive className="w-4 h-4" />
                Compressed
              </button>
            </div>
          </div>

          {/* Restore Backup */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Restore from Backup</h3>
                <p className="text-sm text-gray-600">
                  Upload a previously created backup file (.ttf or .json.gz) to restore your data. 
                  This will replace all current data.
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="btn btn-secondary flex items-center gap-2 whitespace-nowrap"
              >
                <Upload className="w-4 h-4" />
                Restore
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".ttf,.gz"
                onChange={handleRestoreBackup}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-warning-100 p-3 rounded-lg">
            <SettingsIcon className="w-6 h-6 text-warning-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Data Management</h2>
            <p className="text-gray-600 text-sm">Manage your application data</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Data Statistics */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Current Data Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Payments In</p>
                <p className="text-2xl font-bold text-gray-900">{data.paymentsIn.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payments Out</p>
                <p className="text-2xl font-bold text-gray-900">{data.paymentsOut.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900">{data.departments.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Users</p>
                <p className="text-2xl font-bold text-gray-900">{data.users.length}</p>
              </div>
            </div>
          </div>

          {/* Clear All Data */}
          <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-danger-900 mb-1">Clear All Data</h3>
                <p className="text-sm text-danger-700">
                  Permanently delete all data from the application. This action cannot be undone. 
                  Make sure to create a backup before proceeding.
                </p>
              </div>
              <button
                onClick={handleClearData}
                disabled={loading}
                className="btn btn-danger flex items-center gap-2 whitespace-nowrap"
              >
                <AlertCircle className="w-4 h-4" />
                Clear Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="card bg-primary-50 border-primary-200">
        <h3 className="font-semibold text-primary-900 mb-3">Backup Best Practices</h3>
        <ul className="space-y-2 text-sm text-primary-800">
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            <span>Create regular backups to prevent data loss</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            <span>Store backup files in a safe location (cloud storage, external drive)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            <span>Use .ttf format for native backups and .json.gz for compressed/portable backups</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            <span>Test your backups periodically by restoring them in a test environment</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            <span>Keep multiple backup versions from different dates</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;

