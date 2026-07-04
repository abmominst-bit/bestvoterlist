import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, ArrowLeft, Info } from 'lucide-react';
import { loginAdmin, signupAdmin } from '../auth';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onGoToVisitor: () => void;
  logoElement: React.ReactNode;
}

export default function AdminLogin({ onLoginSuccess, onGoToVisitor, logoElement }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      let result;
      
      if (isSignup) {
        result = await signupAdmin(email, password);
      } else {
        result = await loginAdmin(email, password);
      }

      if (result.success) {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        }
        onLoginSuccess();
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load remembered email
  useEffect(() => {
    const remembered = localStorage.getItem('rememberedEmail');
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-32 right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-10 left-1/3 w-36 h-36 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">{logoElement}</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Union Voter Admin</h1>
          <p className="text-slate-600">Control Panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl shadow-2xl p-8 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-500/20 border border-red-400 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-100">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-white font-semibold text-sm tracking-wide">EMAIL</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full bg-transparent border-b-2 border-purple-300 text-white placeholder-purple-200 focus:outline-none focus:border-white py-2 transition-colors"
                  disabled={loading}
                />
                <Mail className="absolute right-0 bottom-2 w-5 h-5 text-purple-200" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-white font-semibold text-sm tracking-wide">PASSWORD</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-transparent border-b-2 border-purple-300 text-white placeholder-purple-200 focus:outline-none focus:border-white py-2 transition-colors pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-2 text-purple-200 hover:text-white transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-purple-300 bg-purple-700 accent-white cursor-pointer"
                disabled={loading}
              />
              <label htmlFor="rememberMe" className="text-white text-sm cursor-pointer">
                Remember Me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-purple-700 font-bold py-3 rounded-full hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Log in'}
            </button>
          </form>

          {/* Toggle Signup/Login */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              disabled={loading}
              className="text-purple-200 text-sm hover:text-white transition-colors disabled:opacity-50"
            >
              {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Back to Visitor */}
          <button
            type="button"
            onClick={onGoToVisitor}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-full border-2 border-white hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
            Go to Visitor
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Powered by Supabase Authentication
        </p>
      </div>
    </div>
  );
}
