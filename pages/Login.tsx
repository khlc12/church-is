import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { User, UserRole } from '../types';
import { LOGO_URL, LOGO_FALLBACK } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [imgSrc, setImgSrc] = useState(LOGO_URL);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    if (username === 'admin' && password === 'admin') {
      onLogin({ username: 'Administrator', role: UserRole.ADMIN });
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Try admin/admin');
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
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-parish-blue focus:border-transparent outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-parish-blue hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition shadow-lg transform active:scale-95"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;