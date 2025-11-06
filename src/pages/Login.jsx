import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, User, AlertCircle, ArrowRight, Sparkles, Shield, TrendingUp } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    const result = login(username, password);

    if (!result.success) {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary blue blob - top right */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>

        {/* Secondary teal blob - bottom left */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-teal-500 to-emerald-400 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

        {/* Accent indigo blob - center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-500 to-blue-400 rounded-full mix-blend-screen filter blur-3xl opacity-8 animate-blob animation-delay-4000"></div>

        {/* Additional subtle accent - top left */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-cyan-400 to-blue-300 rounded-full mix-blend-screen filter blur-3xl opacity-5 animate-blob animation-delay-6000"></div>

        {/* Grid overlay for depth */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block text-white space-y-8 px-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-md px-4 py-2 rounded-full border border-blue-400/20 shadow-lg shadow-blue-500/5">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-medium text-blue-100">Professional Construction Management</span>
            </div>

            <h1 className="text-6xl font-bold leading-tight">
              Welcome to
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent mt-2">
                ByCodez
              </span>
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed">
              Your complete solution for tracking construction project expenses, managing multiple sites, and maintaining financial clarity.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-md p-5 rounded-xl border border-white/10 hover:border-blue-400/30 transition-all duration-300 group">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-white">Multi-Site Management</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Manage multiple construction sites with independent financial tracking</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-md p-5 rounded-xl border border-white/10 hover:border-teal-400/30 transition-all duration-300 group">
              <div className="bg-gradient-to-br from-teal-500/20 to-emerald-500/20 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-white">Real-Time Analytics</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Track payments, expenses, and project progress with live dashboards</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-md p-5 rounded-xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group">
              <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-white">Secure & Reliable</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Your data is safe with automatic backups and restore capabilities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-2xl shadow-blue-500/20 mb-4 transform hover:scale-105 transition-transform">
              <Building2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">ByCodez</h1>
            <p className="text-slate-300">Construction Expense Tracker</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 p-8 border border-white/20 ring-1 ring-blue-500/5">
            <div className="mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                Sign In
              </h2>
              <p className="text-slate-600">Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 animate-slide-in">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                    placeholder="Enter your username"
                    disabled={loading}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                    placeholder="Enter your password"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-4 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                Demo Credentials
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200/50 hover:border-blue-300 transition-colors">
                  <p className="font-semibold text-blue-900 mb-2 text-sm flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    Admin Access
                  </p>
                  <p className="text-xs text-blue-700">
                    <span className="font-mono bg-white px-2 py-1 rounded shadow-sm">admin</span>
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    <span className="font-mono bg-white px-2 py-1 rounded shadow-sm">admin123</span>
                  </p>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-4 rounded-xl border border-teal-200/50 hover:border-teal-300 transition-colors">
                  <p className="font-semibold text-teal-900 mb-2 text-sm flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    User Access
                  </p>
                  <p className="text-xs text-teal-700">
                    <span className="font-mono bg-white px-2 py-1 rounded shadow-sm">user</span>
                  </p>
                  <p className="text-xs text-teal-700 mt-1">
                    <span className="font-mono bg-white px-2 py-1 rounded shadow-sm">user123</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-400 mt-6 text-sm">
            © 2025 ByCodez. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

