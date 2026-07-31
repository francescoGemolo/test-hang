import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function AuthGate({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return null;
  if (status === 'needs-profile' && location.pathname !== '/register') {
    const redirectTarget = `${location.pathname}${location.search}`;
    return <Navigate to={`/register?redirect=${encodeURIComponent(redirectTarget)}`} replace />;
  }
  return <>{children}</>;
}