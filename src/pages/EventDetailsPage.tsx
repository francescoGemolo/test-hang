import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { IconSvgElement } from '@hugeicons/react';
import {
  Add01Icon,
  Calendar05Icon,
  Clock01Icon,
  Delete02Icon,
  PinLocation01Icon,
  SquareLock02Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import { useEventParticipants } from '../hooks/useEventParticipants';
import { formatEventDate } from '../lib/formatters';
import { AppShell } from '../components/layout/AppShell';
import { HeaderBack } from '../components/layout/HeaderBack';
import { Icon } from '../components/ui/Icon';
import { Button } from '../components/ui/Button';
import { LinkButton } from '../components/ui/LinkButton';
import { ParticipantItem } from '../components/events/ParticipantItem';

function InfoRow({ icon, text }: { icon: IconSvgElement; text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon icon={icon} size={18} className="text-neutral-50" />
      <p className="text-sm text-neutral-50">{text}</p>
    </div>
  );
}

export default function EventDetailsPage() {
  const { id } = useParams();
  const { status, profile } = useAuth();
  const { events, isLoading, joinEvent, leaveEvent } = useEvents();
  const navigate = useNavigate();

  const isAuthenticated = status === 'authenticated';
  const event = events.find((item) => item.id === id);
  const { participants, isLoading: isLoadingParticipants } = useEventParticipants(id ?? '', isAuthenticated);

  useEffect(() => {
    if (!isLoading && !event) navigate('/events', { replace: true });
  }, [isLoading, event, navigate]);

  if (isLoading || !event) return null;

  const isParticipant = profile !== null && participants.some((participant) => participant.id === profile.id);
  const isFull = event.participantsCount >= event.maxParticipants;

  async function handleParticipateClick() {
    if (!isAuthenticated || !profile) {
      navigate(`/login?redirect=${encodeURIComponent(`/events/${event!.id}`)}`);
      return;
    }
    if (isParticipant) {
      await leaveEvent(event!.id, profile.id);
    } else {
      await joinEvent(event!.id, profile);
    }
  }

  return (
    <AppShell>
      <HeaderBack to="/events" />
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="pb-4.5 text-3xl">{event.title}</h1>
          <article className="flex flex-col gap-3 rounded-3xl border border-white/20 bg-surface p-5">
            <div className="flex flex-col gap-2">
              <InfoRow icon={Calendar05Icon} text={formatEventDate(event.date)} />
              <InfoRow icon={Clock01Icon} text={event.time} />
              <InfoRow icon={PinLocation01Icon} text={event.location} />
              <InfoRow
                icon={UserGroupIcon}
                text={`${event.participantsCount} / ${event.maxParticipants} partecipanti`}
              />
            </div>
            {event.description && (
              <div className="border-t border-white/10 pt-2">
                <p className="text-sm text-neutral-400">{event.description}</p>
              </div>
            )}
          </article>
          <Button
            variant="outline"
            className="mt-5 w-full"
            disabled={isAuthenticated && !isParticipant && isFull}
            onClick={handleParticipateClick}
          >
            <Icon icon={isParticipant ? Delete02Icon : Add01Icon} size={18} />
            {isParticipant ? 'Annulla partecipazione' : isAuthenticated && isFull ? 'Evento pieno' : 'Partecipa'}
          </Button>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Partecipanti ({event.participantsCount})</h2>
          {!isAuthenticated ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-white/20 bg-surface px-4.5 py-8 text-center">
              <Icon icon={SquareLock02Icon} size={28} className="text-neutral-500" />
              <p className="max-w-xs text-sm leading-relaxed text-neutral-400">
                Accedi per vedere chi partecipa e i loro contatti.
              </p>
              <LinkButton
                to={`/login?redirect=${encodeURIComponent(`/events/${event.id}`)}`}
                variant="outline"
                className="w-auto"
              >
                Accedi
              </LinkButton>
            </div>
          ) : isLoadingParticipants ? null : (
            participants.map((participant) => (
              <ParticipantItem
                key={participant.id}
                participant={participant}
                isOrganizer={participant.id === event.organizerId}
              />
            ))
          )}
        </section>
      </div>
    </AppShell>
  );
}