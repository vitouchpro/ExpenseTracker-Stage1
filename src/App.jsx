import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import PaymentsIn from './pages/PaymentsIn';
import PaymentsOut from './pages/PaymentsOut';
import Departments from './pages/Departments';
import Settings from './pages/Settings';
import Layout from './components/Layout';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('projects');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'projects':
        return <Projects />;
      case 'dashboard':
        return <Dashboard />;
      case 'payments-in':
        return <PaymentsIn />;
      case 'payments-out':
        return <PaymentsOut />;
      case 'departments':
        return <Departments />;
      case 'settings':
        return <Settings />;
      default:
        return <Projects />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;

