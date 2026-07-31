import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function RequireNeedsProfile({ children }: { children: ReactNode }) {
  const { status } = useAuth();

  if (status === 'loading') return null;
  if (status === 'guest') return <Navigate to="/login" replace />;
  if (status === 'authenticated') return <Navigate to="/events" replace />;
  return <>{children}</>;
}