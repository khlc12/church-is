import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Schedules from './pages/Schedules';
import Bulletin from './pages/Bulletin';
import Donations from './pages/Donations';
import Login from './pages/Login';
import RequestService from './pages/RequestService';
import AdminDashboard from './pages/AdminDashboard';
import Records from './pages/Records';
import ManageSchedules from './pages/admin/ManageSchedules';
import ManageBulletin from './pages/admin/ManageBulletin';
import ManageDonations from './pages/admin/ManageDonations';
import ManageRequests from './pages/admin/ManageRequests';
import CertificateRegistry from './pages/admin/CertificateRegistry';
import { User } from './types';
import { ParishProvider } from './context/ParishContext';

interface ProtectedRouteProps {
  user: User | null;
  children: React.ReactNode;
}

// Protected Route Wrapper
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ParishProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans">
          <Navbar user={user} onLogout={handleLogout} />
          
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/schedules" element={<Schedules />} />
              <Route path="/bulletin" element={<Bulletin />} />
              <Route path="/donations" element={<Donations />} />
              <Route path="/services" element={<RequestService />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />

              {/* Protected Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute user={user}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/records" 
                element={
                  <ProtectedRoute user={user}>
                    <Records />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/manage-schedules" 
                element={
                  <ProtectedRoute user={user}>
                    <ManageSchedules />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/manage-bulletin" 
                element={
                  <ProtectedRoute user={user}>
                    <ManageBulletin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/manage-donations" 
                element={
                  <ProtectedRoute user={user}>
                    <ManageDonations />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/manage-requests" 
                element={
                  <ProtectedRoute user={user}>
                    <ManageRequests />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/registry" 
                element={
                  <ProtectedRoute user={user}>
                    <CertificateRegistry />
                  </ProtectedRoute>
                } 
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ParishProvider>
  );
};

export default App;