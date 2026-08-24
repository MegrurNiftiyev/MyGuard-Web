import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { UserRoleProvider } from './context/UserRoleContext';
import { PageShell } from './components/layout/PageShell';

import DashboardPage from './pages/DashboardPage';
import ScanPage from './pages/ScanPage';
import AnalysisResultPage from './pages/AnalysisResultPage';
import TextComparisonPage from './pages/TextComparisonPage';
import DocumentsPage from './pages/DocumentsPage';
import RiskReportsPage from './pages/RiskReportsPage';
import AssistantPage from './pages/AssistantPage';
import ModelManagementPage from './pages/ModelManagementPage';
import SettingsPage from './pages/SettingsPage';
// import ActionSecurityPage from './pages/ActionSecurityPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <UserRoleProvider>
        <Router>
          <PageShell>
            <Routes>
              {/* 5 Primary Sections (In Bottom Nav) */}
              <Route path="/" element={<DashboardPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/risk-reports" element={<RiskReportsPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Secondary & Detail Pages (Accessed via internal navigation) */}
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/analysis/:id" element={<AnalysisResultPage />} />
              <Route path="/analysis" element={<AnalysisResultPage />} />
              <Route path="/comparison/:id" element={<TextComparisonPage />} />
              <Route path="/comparison" element={<TextComparisonPage />} />
              <Route path="/models" element={<ModelManagementPage />} />
              {/* <Route path="/agent-action" element={<ActionSecurityPage />} /> */}

              {/* Fallback redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PageShell>
        </Router>
      </UserRoleProvider>
    </LanguageProvider>
  );
};

export default App;
