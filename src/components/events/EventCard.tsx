import { Link } from 'react-router-dom';
import { ArrowRight01Icon, Calendar05Icon, Clock01Icon, Delete02Icon, Pen01Icon, PinLocation01Icon } from '@hugeicons/core-free-icons';
import type { HangoutEvent } from '../../types/event';
import { formatEventDate } from '../../lib/formatters';
import { Icon } from '../ui/Icon';
import { Avatar, stackColor } from '../ui/Avatar';
import { DropdownMenu } from '../ui/DropdownMenu';

interface EventCardProps {
  event: HangoutEvent;
  currentUserId: string;
  onEdit: () => void;
  onDelete: () => void;
}

const STATUS_CONFIG = {
  open: { label: 'Posti liberi', className: 'border-status-open/40 bg-status-open/10 text-status-open' },
  almost: { label: 'Quasi pieno', className: 'border-status-almost/40 bg-status-almost/10 text-status-almost' },
  full: { label: 'Pieno', className: 'border-danger/40 bg-danger/10 text-danger' },
};

export function EventCard({ event, currentUserId, onEdit, onDelete }: EventCardProps) {
  const isOrganizer = event.organizerId === currentUserId;
  const spotsLeft = event.maxParticipants - event.participants.length;
  const status = spotsLeft <= 0 ? 'full' : spotsLeft <= 2 ? 'almost' : 'open';
  const statusConfig = STATUS_CONFIG[status];

  const visibleAvatars = event.participants.slice(0, 3);
  const remaining = event.participants.length - visibleAvatars.length;

  return (
    <article className="relative flex flex-col gap-3 rounded-3xl border border-white/20 bg-surface p-5 transition hover:border-white/30">
      {isOrganizer && (
        <DropdownMenu
          items={[
            { label: 'Modifica', icon: Pen01Icon, onClick: onEdit },
            { label: 'Elimina', icon: Delete02Icon, onClick: onDelete, danger: true },
          ]}
        />
      )}

      <div className="flex items-start justify-between gap-3 pr-8">
        <h2 className="text-lg font-semibold leading-snug">{event.title}</h2>
        <span
          className={`inline-flex flex-shrink-0 items-center whitespace-nowrap rounded-full border px-3 py-1 text-xs ${statusConfig.className}`}
        >
          {statusConfig.label}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-sm text-neutral-400">
          <Icon icon={Calendar05Icon} size={18} className="w-5 flex-shrink-0 text-center text-neutral-400" />
          <p>{formatEventDate(event.date)}</p>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-neutral-400">
          <Icon icon={Clock01Icon} size={18} className="w-5 flex-shrink-0 text-center text-neutral-400" />
          <p>{event.time}</p>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-neutral-400">
          <Icon icon={PinLocation01Icon} size={18} className="w-5 flex-shrink-0 text-center text-neutral-400" />
          <p>{event.location}</p>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center">
            {visibleAvatars.map((participant, index) => (
              <Avatar
                key={participant.id}
                label={participant.nickname}
                size="sm"
                colorClassName={stackColor(index)}
                className={`border-2 border-surface ${index > 0 ? '-ml-2.5' : ''}`}
              />
            ))}
            {remaining > 0 && (
              <span className="-ml-2.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-surface bg-bg text-xs font-semibold text-neutral-400">
                +{remaining}
              </span>
            )}
          </div>
          <span className="text-xs text-neutral-500">
            {event.participants.length} / {event.maxParticipants} partecipanti
          </span>
        </div>
        <Link
          to={`/events/${event.id}`}
          aria-label="Vedi dettagli evento"
          className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-accent bg-accent text-bg transition hover:-translate-y-0.5 hover:border-accent-hover hover:bg-accent-hover"
        >
          <Icon icon={ArrowRight01Icon} size={18} />
        </Link>
      </div>
    </article>
  );
}