import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_DASHBOARD_PATH } from '../lib/roles';

export default function RedirectToRoleDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    // Wait for auth initialization to avoid redirect loops while loading
    if (loading) return;

    if (!user) {
      if (pathname !== '/login') navigate('/login', { replace: true });
      return;
    }

    const roleKey = (user.role || '').toLowerCase() as keyof typeof ROLE_DASHBOARD_PATH;
    const path = ROLE_DASHBOARD_PATH[roleKey] || '/dashboard';

    // Avoid navigating if we're already on the desired path
    if (!path || pathname.startsWith(path)) return;

    navigate(path, { replace: true });
  }, [user, loading, navigate, pathname]);

  return null;
}


