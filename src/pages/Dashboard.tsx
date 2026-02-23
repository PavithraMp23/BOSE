import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardHome from '../modules/common/pages/DashboardHome';
import NetworkCredentials from '../modules/admin/pages/NetworkCredentials';
import NetworkAnalytics from '../modules/admin/pages/NetworkAnalytics';
import Settings from '../modules/common/pages/Settings';
import StudentDashboard from '../modules/candidate/pages/StudentDashboard';
import RecruiterDashboard from '../modules/recruiter/RecruiterDashboard';
import InstitutionDashboard from '../modules/institution/pages/InstitutionDashboard';

export default function Dashboard() {
  return (
    <Routes>
      <Route path="/" element={<DashboardHome />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/employer" element={<RecruiterDashboard />} />
      <Route path="/institution" element={<InstitutionDashboard />} />
      <Route path="/credentials" element={<NetworkCredentials />} />
      <Route path="/analytics" element={<NetworkAnalytics />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}