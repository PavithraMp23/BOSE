import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardHome from '../../common/pages/DashboardHome';
import NetworkCredentials from '../../admin/pages/NetworkCredentials';
import NetworkAnalytics from '../../admin/pages/NetworkAnalytics';
import Settings from '../../common/pages/Settings';
import StudentDashboard from '../../candidate/pages/StudentDashboard';
import RecruiterDashboard from '../../recruiter/RecruiterDashboard';
import UniversityDashboard from '../../university/UniversityDashboard';

export default function Dashboard() {
    return (
        <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/employer" element={<RecruiterDashboard />} />
            <Route path="/institution" element={<UniversityDashboard />} />
            <Route path="/credentials" element={<NetworkCredentials />} />
            <Route path="/analytics" element={<NetworkAnalytics />} />
            <Route path="/settings" element={<Settings />} />
        </Routes>
    );
}
