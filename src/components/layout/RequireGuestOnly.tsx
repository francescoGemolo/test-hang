import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function RequireGuestOnly({ children }: { children: ReactNode }) {
  const { status } = useAuth();

  if (status === 'loading' || status === 'needs-profile') return null;
  if (status === 'authenticated') return <Navigate to="/events" replace />;
  return <>{children}</>;
}