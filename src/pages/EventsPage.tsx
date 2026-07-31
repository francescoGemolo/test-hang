import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import { useScrollFab } from '../hooks/useScrollFab';
import { AppShell } from '../components/layout/AppShell';
import { EventFilters, type EventFilter } from '../components/events/EventFilters';
import { EventCard } from '../components/events/EventCard';
import { EmptyState } from '../components/events/EmptyState';
import { Avatar } from '../components/ui/Avatar';
import { Icon } from '../components/ui/Icon';

export default function EventsPage() {
  const { user } = useAuth();
  const { events, isLoading, deleteEvent } = useEvents();
  const [filter, setFilter] = useState<EventFilter>('all');
  const navigate = useNavigate();
  const { isActive, isHidden } = useScrollFab();

  if (!user) return null;

  const filteredEvents = events.filter((event) => {
    if (filter === 'mine') return event.organizerId === user.id;
    if (filter === 'joined') return event.participants.some((participant) => participant.id === user.id);
    return true;
  });

  return (
    <AppShell className="pb-28">
      <header className="flex w-full items-center justify-between border-b border-white/10 pb-3">
        <p className="text-lg">Scopri gli eventi</p>
        <Link to="/profile">
          <Avatar label={user.nickname} />
        </Link>
      </header>

      <EventFilters active={filter} onChange={setFilter} />

      <main className="flex flex-col gap-4.5 pt-7.5">
        {!isLoading && filteredEvents.length === 0 && (
          <EmptyState
            title="Nessun evento in programma"
            description="Non c'è ancora nessun evento disponibile in questa sezione. Creane uno tu per iniziare!"
            actionLabel="Crea un evento"
            actionTo="/events/new"
          />
        )}
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            currentUserId={user.id}
            onEdit={() => navigate(`/events/${event.id}/edit`)}
            onDelete={() => deleteEvent(event.id)}
          />
        ))}
      </main>

      <Link
        to="/events/new"
        aria-label="Crea un nuovo evento"
        className={[
          'fixed bottom-5 right-5 z-50 flex items-center justify-center rounded-full bg-accent/35 text-bg shadow-lg transition-all duration-300 hover:scale-105 hover:bg-accent-hover active:scale-95',
          isActive ? 'h-14 w-14 bg-accent shadow-2xl' : 'h-12 w-12',
          isHidden ? 'translate-y-20 scale-75 opacity-0' : 'translate-y-0 scale-100 opacity-100',
        ].join(' ')}
      >
        <Icon icon={Add01Icon} size={isActive ? 26 : 22} />
      </Link>
    </AppShell>
  );
}