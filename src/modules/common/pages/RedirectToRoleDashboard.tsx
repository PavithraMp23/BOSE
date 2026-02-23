import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

export default function RedirectToRoleDashboard() {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;

    const role = (user.role || '').toLowerCase();
    if (role === 'admin') return <Navigate to="/dashboard/admin" />;
    if (role === 'institution' || role === 'verifier' || role === 'issuer') return <Navigate to="/dashboard/institution" />;
    if (role === 'student' || role === 'candidate' || role === 'employee') return <Navigate to="/dashboard/student" />;
    return <Navigate to="/dashboard/employer" />;
}
