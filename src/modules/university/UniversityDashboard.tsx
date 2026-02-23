import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import VerificationRequests from './pages/VerificationRequests';
import IssuedCredentials from './pages/IssuedCredentials';
import Students from './pages/Students';
import Analytics from './pages/Analytics';

export default function UniversityDashboard() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/verification-requests" element={<VerificationRequests />} />
      <Route path="/issued-credentials" element={<IssuedCredentials />} />
      <Route path="/students" element={<Students />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}