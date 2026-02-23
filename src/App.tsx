//import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { ToastProvider } from './components/ui/toast';
import Landing from './modules/landing/pages/Landing';
import Login from './modules/auth/pages/Login';
import Dashboard from './modules/core/pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import './App.css';
import StudentDashboard from './modules/candidate/pages/StudentDashboard';
//import EmployerDashboard from './pages/recruiters/EmployerDashboard';
import RecruiterDashboard from './modules/recruiter/RecruiterDashboard';
import RecruiterJobs from './modules/recruiter/pages/Jobs';
import Applicants from './modules/recruiter/pages/Applicants';
import Candidates from './modules/recruiter/pages/Candidates';
import AdminDashboard from './modules/admin/pages/AdminDashboard';
import UniversityDashboard from './modules/university/UniversityDashboard';
import Messages from './modules/recruiter/pages/Messages';
import RedirectToRoleDashboard from './modules/common/pages/RedirectToRoleDashboard';
import Unauthorized from './modules/common/pages/Unauthorized';
import CandidateDashboard from './modules/candidate/pages/CandidateDashboard';
import CandidateProfile from './modules/candidate/pages/Profile';
import PublicProfile from './modules/candidate/pages/PublicProfile';


function App() {
  return (
    <Router>
      <AuthProvider>
        <DarkModeProvider>
          <ToastProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
              <Routes>
                {/* Public Profile Route - No Authentication Required */}
                <Route path="/profile/:userId" element={<PublicProfile />} />

                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard/student" element={
                  <ProtectedRoute roles={["student", "candidate", "employee"]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/candidate" element={
                  <ProtectedRoute roles={["candidate"]}>
                    <Layout>
                      <CandidateDashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/candidate/profile" element={
                  <ProtectedRoute roles={["candidate"]}>
                    <Layout>
                      <CandidateProfile />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/employer" element={
                  <ProtectedRoute>
                    <Layout>
                      <RecruiterDashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/employer/jobs" element={
                  <ProtectedRoute>
                    <Layout>
                      <RecruiterJobs />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/employer/applicants" element={
                  <ProtectedRoute>
                    <Layout>
                      <Applicants />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/employer/candidates" element={
                  <ProtectedRoute>
                    <Layout>
                      <Candidates />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/employer/analytics" element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="space-y-6"><h1 className="text-2xl font-bold text-gray-900">Recruiter Analytics</h1><p className="text-sm text-gray-500">Coming soon…</p></div>
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/employer/settings" element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="space-y-6"><h1 className="text-2xl font-bold text-gray-900">Recruiter Settings</h1><p className="text-sm text-gray-500">Coming soon…</p></div>
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/employer/messages" element={
                  <ProtectedRoute>
                    <Layout>
                      <Messages />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin" element={
                  <ProtectedRoute roles={["admin"]}>
                    <Layout>
                      <AdminDashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/university/*" element={
                  <ProtectedRoute roles={["university", "institution", "verifier", "issuer"]}>
                    <Layout>
                      <UniversityDashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={<RedirectToRoleDashboard />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/dashboard/*" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </ToastProvider>
        </DarkModeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;