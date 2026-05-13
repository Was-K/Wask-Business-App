import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  ArrowRight,
  Briefcase,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type AuthMode = 'login' | 'register';
type UserRole = 'business' | 'admin' | null;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRole) {
      alert('Please select a role');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      login(formData.email, selectedRole);
      
      // Navigate based on role
      if (selectedRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/business/dashboard');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-black relative">
      {/* Ambient Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-left radial glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/5 rounded-full mix-blend-screen blur-3xl animate-float"></div>

        {/* Top-right radial glow */}
        <div className="absolute -top-20 -right-40 w-80 h-80 bg-white/5 rounded-full mix-blend-screen blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        {/* Bottom-left radial glow */}
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-white/5 rounded-full mix-blend-screen blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

        {/* Bottom-right radial glow */}
        <div className="absolute -bottom-20 -right-32 w-80 h-80 bg-white/5 rounded-full mix-blend-screen blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Glass Container */}
          <div className="rounded-3xl bg-gray-900/60 backdrop-blur-2xl border border-white/10 shadow-glass overflow-hidden">
            {/* Header Section */}
            <div className="px-6 sm:px-8 pt-8 pb-6 text-center border-b border-white/10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 border border-white/20 mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <p className="text-xs font-semibold tracking-widest text-white/70 uppercase mb-3">
                Enterprise Access
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Portal de negocios
              </h1>
            </div>

            {/* Content Section */}
            <div className="px-6 sm:px-8 py-8">
              {/* Authentication Mode Toggle */}
              <div className="flex gap-3 p-1 bg-gray-800/50 rounded-full border border-white/10 mb-8">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2.5 px-4 rounded-full font-medium text-sm transition-all duration-300 ${
                    authMode === 'login'
                      ? 'bg-white text-black shadow-lg'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2.5 px-4 rounded-full font-medium text-sm transition-all duration-300 ${
                    authMode === 'register'
                      ? 'bg-white text-black shadow-lg'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Role Selection */}
              <div className="mb-8">
                <label className="block text-xs font-semibold tracking-widest text-white/70 uppercase mb-4">
                  Select Your Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Business Role Card */}
                  <button
                    onClick={() => setSelectedRole('business')}
                    className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                      selectedRole === 'business'
                        ? 'border-white bg-white/10 shadow-lg shadow-white/20'
                        : 'border-white/20 bg-gray-900/50 hover:border-white/30 hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all duration-300 ${
                        selectedRole === 'business'
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-700/50 text-white/50 group-hover:bg-gray-700'
                      }`}>
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <p className={`text-sm font-semibold transition-colors duration-300 ${
                        selectedRole === 'business'
                          ? 'text-white'
                          : 'text-white/70'
                      }`}>
                        Business
                      </p>
                    </div>
                  </button>

                  {/* Admin Role Card */}
                  <button
                    onClick={() => setSelectedRole('admin')}
                    className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                      selectedRole === 'admin'
                        ? 'border-white bg-white/10 shadow-lg shadow-white/20'
                        : 'border-white/20 bg-gray-900/50 hover:border-white/30 hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all duration-300 ${
                        selectedRole === 'admin'
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-700/50 text-white/50 group-hover:bg-gray-700'
                      }`}>
                        <Shield className="w-5 h-5" />
                      </div>
                      <p className={`text-sm font-semibold transition-colors duration-300 ${
                        selectedRole === 'admin'
                          ? 'text-white'
                          : 'text-white/70'
                      }`}>
                        Admin
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-white transition-colors duration-300" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@company.com"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>

                {/* Password Field */}
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-white transition-colors duration-300" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>

                {/* Confirm Password Field (Register Mode) */}
                {authMode === 'register' && (
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-white transition-colors duration-300" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      required={authMode === 'register'}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 py-3 px-6 rounded-xl font-semibold uppercase tracking-wider text-sm bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {authMode === 'login' ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Link */}
              <p className="text-center text-sm text-white/60 mt-6">
                {authMode === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => setAuthMode('register')}
                      className="text-white hover:text-gray-200 font-semibold transition-colors duration-300"
                    >
                      Register here
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setAuthMode('login')}
                      className="text-white hover:text-gray-200 font-semibold transition-colors duration-300"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="text-center mt-6 text-xs text-white/50 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Enterprise-grade encryption • GDPR Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
