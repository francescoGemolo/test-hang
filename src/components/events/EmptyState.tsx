import { Calendar03Icon } from '@hugeicons/core-free-icons';
import { Icon } from '../ui/Icon';
import { LinkButton } from '../ui/LinkButton';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}

export function EmptyState({ title, description, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <div className="mt-2 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-white/20 bg-surface px-4.5 py-10 text-center">
      <div className="text-neutral-500">
        <Icon icon={Calendar03Icon} size={40} />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mb-1 max-w-xs text-sm leading-relaxed text-neutral-400">{description}</p>
      {actionLabel && actionTo && (
        <LinkButton to={actionTo} variant="outline" className="w-auto">
          {actionLabel}
        </LinkButton>
      )}
    </div>
  );
}