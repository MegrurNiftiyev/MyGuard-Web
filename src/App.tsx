import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { UserRoleProvider } from './context/UserRoleContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/auth/ProtectedRoute';
import { PageShell } from './components/layout/PageShell';

import DashboardPage from './pages/DashboardPage';
import ScanPage from './pages/ScanPage';
import AnalysisResultPage from './pages/AnalysisResultPage';
import TextComparisonPage from './pages/TextComparisonPage';
import DocumentsPage from './pages/DocumentsPage';
import AssistantPage from './pages/AssistantPage';
import ModelManagementPage from './pages/ModelManagementPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ActionSecurityPage from './pages/ActionSecurityPage';
import NotFoundPage from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <UserRoleProvider>
        <AuthProvider>
          <Router>
            <PageShell>
              <Routes>
                {/* Auth Route (Public Only - Redirects to / if logged in) */}
                <Route
                  path="/login"
                  element={
                    <PublicOnlyRoute>
                      <LoginPage />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <PublicOnlyRoute>
                      <ForgotPasswordPage />
                    </PublicOnlyRoute>
                  }
                />

                {/* Protected Routes (Require Token/Auth - Redirect to /login if unauthenticated) */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/documents"
                  element={
                    <ProtectedRoute>
                      <DocumentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assistant"
                  element={
                    <ProtectedRoute>
                      <AssistantPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/scan"
                  element={
                    <ProtectedRoute>
                      <ScanPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analysis/:id"
                  element={
                    <ProtectedRoute>
                      <AnalysisResultPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analysis"
                  element={
                    <ProtectedRoute>
                      <AnalysisResultPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/comparison/:id"
                  element={
                    <ProtectedRoute>
                      <TextComparisonPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/comparison"
                  element={
                    <ProtectedRoute>
                      <TextComparisonPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/models"
                  element={
                    <ProtectedRoute>
                      <ModelManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/agent-action"
                  element={
                    <ProtectedRoute>
                      <ActionSecurityPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback 404 Route for any non-existent page or unknown route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </PageShell>
          </Router>
        </AuthProvider>
      </UserRoleProvider>
    </LanguageProvider>
  );
};

export default App;
