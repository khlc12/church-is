import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { User, UserRole } from '../types';
import { LOGO_URL, LOGO_FALLBACK } from '../constants';
import { api } from '../services/api';

interface LoginProps {
  onLogin: (user: User, token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [imgSrc, setImgSrc] = useState(LOGO_URL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await api.login({ username, password });
      onLogin({ username: response.user.username, role: response.user.role as UserRole }, response.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid credentials or server error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-parish-blue p-8 text-center">
          <img 
             src={imgSrc} 
             onError={() => setImgSrc(LOGO_FALLBACK)}
             alt="Logo" 
             className="w-20 h-20 mx-auto rounded-full bg-white p-1 shadow-lg object-contain mb-4" 
          />
          <h2 className="text-2xl font-serif font-bold text-white">Staff Access</h2>
          <p className="text-blue-200 text-sm">Please sign in to manage records</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
              <Icons.Shield size={16} /> {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-parish-blue focus:border-transparent outline-none transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-parish-blue focus:border-transparent outline-none transition pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <Icons.EyeOff size={18} /> : <Icons.Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-parish-blue hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition shadow-lg transform active:scale-95"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
