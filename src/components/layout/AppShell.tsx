import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div
      className={['mx-auto flex min-h-screen w-full max-w-[480px] flex-col px-5 pt-12', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}