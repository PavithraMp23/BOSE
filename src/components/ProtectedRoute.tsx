import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  roles?: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (roles) {
    const allowed = roles.map(r => r.toLowerCase()).includes((user.role || '').toLowerCase());
    if (!allowed) return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}