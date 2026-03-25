import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Generate from './pages/Generate';
import Calendar from './pages/Calendar';
import BrandBuilder from './pages/BrandBuilder';
import Settings from './pages/Settings';
import Login from './pages/Login';

import { LanguageProvider } from './LanguageContext';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
              <Route index element={<Dashboard />} />
              <Route path="generate" element={<Generate />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="brand" element={<BrandBuilder />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </LanguageProvider>
    </AuthProvider>
  );
}
