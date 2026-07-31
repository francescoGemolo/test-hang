import { Link } from 'react-router-dom';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { Icon } from '../ui/Icon';

interface HeaderBackProps {
  to: string;
  title?: string;
}

export function HeaderBack({ to, title }: HeaderBackProps) {
  return (
    <header className="relative mb-10 flex min-h-10 w-full items-center justify-center">
      <Link
        to={to}
        aria-label="Torna indietro"
        className="absolute left-0 top-1/2 -translate-y-1/2 rounded-xl border border-white/20 bg-surface p-2 text-neutral-50 transition hover:opacity-80"
      >
        <Icon icon={ArrowLeft01Icon} size={22} />
      </Link>
      {title && <h1 className="text-lg font-semibold">{title}</h1>}
    </header>
  );
}