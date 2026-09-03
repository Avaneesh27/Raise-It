import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';

// Citizen Experience
import { CitizenLayout } from './layouts/CitizenLayout';
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { CitizenReportsPage } from './pages/citizen/CitizenReportsPage';
import { CitizenReportIssuePage } from './pages/citizen/CitizenReportIssuePage';
import { CitizenBadgesPage } from './pages/citizen/CitizenBadgesPage';
import { CitizenAssistantPage } from './pages/citizen/CitizenAssistantPage';
import { CitizenProfilePage } from './pages/citizen/CitizenProfilePage';

// Authority Experience
import { AuthorityLayout } from './layouts/AuthorityLayout';
import { AuthorityDashboard } from './pages/authority/AuthorityDashboard';
import { IssueList } from './pages/authority/IssueList';
import { IssueDetails } from './pages/authority/IssueDetails';
import { AuthorityMapPage } from './pages/authority/AuthorityMapPage';
import { ResolutionReports } from './pages/authority/ResolutionReports';
import { PriorityLocations } from './pages/authority/PriorityLocations';
import { DepartmentAnalytics } from './pages/authority/DepartmentAnalytics';

// Admin Experience
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AuthorityManagement } from './pages/admin/AuthorityManagement';
import { DepartmentManagement } from './pages/admin/DepartmentManagement';
import { CategoryManagement } from './pages/admin/CategoryManagement';
import { KnowledgeBase } from './pages/admin/KnowledgeBase';

import { User } from './types';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('raiseit_token');
    const savedUser = localStorage.getItem('raiseit_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('raiseit_token');
        localStorage.removeItem('raiseit_user');
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (loggedInUser: User, receivedToken: string) => {
    setUser(loggedInUser);
    setToken(receivedToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('raiseit_token');
    localStorage.removeItem('raiseit_user');
    setUser(null);
    setToken(null);
  };

  const getDashboardRedirect = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'AUTHORITY') return '/authority';
    return '/citizen';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] flex items-center justify-center text-slate-500 font-sans text-sm">
        Loading RaiseIt Platform...
      </div>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            {/* 1. PUBLIC LANDING PAGE (Root route MUST NOT force login) */}
            <Route path="/" element={<LandingPage user={user} onLogout={handleLogout} />} />

            {/* 2. AUTHENTICATION ROUTES */}
            <Route
              path="/login"
              element={
                token ? (
                  <Navigate to={getDashboardRedirect()} replace />
                ) : (
                  <Login onLoginSuccess={handleLoginSuccess} />
                )
              }
            />

            <Route
              path="/signup"
              element={
                token ? (
                  <Navigate to={getDashboardRedirect()} replace />
                ) : (
                  <SignUp onLoginSuccess={handleLoginSuccess} />
                )
              }
            />

            {/* 3. CITIZEN PROTECTED WORKSPACE */}
            <Route
              path="/citizen"
              element={
                token ? (
                  <CitizenLayout user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              <Route index element={<CitizenDashboard />} />
              <Route path="reports" element={<CitizenReportsPage />} />
              <Route path="report" element={<CitizenReportIssuePage />} />
              <Route path="badges" element={<CitizenBadgesPage />} />
              <Route path="achievements" element={<Navigate to="/citizen/badges" replace />} />
              <Route path="assistant" element={<CitizenAssistantPage />} />
              <Route path="profile" element={<CitizenProfilePage />} />
            </Route>

            {/* 4. AUTHORITY PROTECTED WORKSPACE */}
            <Route
              path="/authority"
              element={
                token ? (
                  <AuthorityLayout user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              <Route index element={<AuthorityDashboard />} />
              <Route path="issues" element={<IssueList />} />
              <Route path="issues/:reportId" element={<IssueDetails />} />
              <Route path="map" element={<AuthorityMapPage />} />
              <Route path="resolutions" element={<ResolutionReports />} />
              <Route path="priority-locations" element={<PriorityLocations />} />
              <Route path="analytics" element={<DepartmentAnalytics />} />
            </Route>

            {/* 5. ADMIN PROTECTED WORKSPACE */}
            <Route
              path="/admin"
              element={
                token ? (
                  <AdminLayout user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="issues" element={<IssueList />} />
              <Route path="issues/:reportId" element={<IssueDetails />} />
              <Route path="authorities" element={<AuthorityManagement />} />
              <Route path="departments" element={<DepartmentManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="knowledge-base" element={<KnowledgeBase />} />
            </Route>

            {/* Fallback to Public Landing Page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
