import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { IconSvgElement } from '@hugeicons/react';
import { Add01Icon, Calendar05Icon, Clock01Icon, Delete02Icon, PinLocation01Icon, UserGroupIcon } from '@hugeicons/core-free-icons';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import { formatEventDate } from '../lib/formatters';
import { AppShell } from '../components/layout/AppShell';
import { HeaderBack } from '../components/layout/HeaderBack';
import { Icon } from '../components/ui/Icon';
import { Button } from '../components/ui/Button';
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
  const { user } = useAuth();
  const { events, isLoading, joinEvent, leaveEvent } = useEvents();
  const navigate = useNavigate();

  const event = events.find((item) => item.id === id);

  useEffect(() => {
    if (!isLoading && !event) navigate('/events', { replace: true });
  }, [isLoading, event, navigate]);

  if (isLoading || !event || !user) return null;

  const isParticipant = event.participants.some((participant) => participant.id === user.id);
  const isFull = event.participants.length >= event.maxParticipants;

  async function handleToggleParticipation() {
    if (!user) return;
    if (isParticipant) {
      await leaveEvent(event!.id, user.id);
    } else {
      await joinEvent(event!.id, user);
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
                text={`${event.participants.length} / ${event.maxParticipants} partecipanti`}
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
            disabled={!isParticipant && isFull}
            onClick={handleToggleParticipation}
          >
            <Icon icon={isParticipant ? Delete02Icon : Add01Icon} size={18} />
            {isParticipant ? 'Annulla partecipazione' : isFull ? 'Evento pieno' : 'Partecipa'}
          </Button>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Partecipanti ({event.participants.length})</h2>
          {event.participants.map((participant) => (
            <ParticipantItem
              key={participant.id}
              participant={participant}
              isOrganizer={participant.id === event.organizerId}
            />
          ))}
        </section>
      </div>
    </AppShell>
  );
}