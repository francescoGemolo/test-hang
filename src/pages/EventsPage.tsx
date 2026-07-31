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
  const { status, profile } = useAuth();
  const { events, isLoading, deleteEvent } = useEvents();
  const [filter, setFilter] = useState<EventFilter>('all');
  const navigate = useNavigate();
  const { isActive, isHidden } = useScrollFab();

  const isGuest = status !== 'authenticated';

  const filteredEvents = events.filter((event) => {
    if (filter === 'mine') return profile !== null && event.organizerId === profile.id;
    if (filter === 'joined') {
      return profile !== null && event.participantsPreview.some((participant) => participant.id === profile.id);
    }
    return true;
  });

  return (
    <AppShell className="pb-28">
      <header className="flex w-full items-center justify-between border-b border-white/10 pb-3">
        <p className="text-lg">Scopri gli eventi</p>
        <Link to="/profile">
          <Avatar label={isGuest ? 'Ospite' : (profile?.nickname ?? '?')} />
        </Link>
      </header>

      {isGuest && (
        <Link
          to="/login"
          className="mt-4.5 flex items-center justify-between gap-2 rounded-xl border border-accent-hover/40 bg-accent/10 px-4 py-3 text-sm text-accent transition hover:bg-accent/15"
        >
          Stai navigando come ospite: accedi per creare eventi e partecipare
          <span className="font-semibold whitespace-nowrap">Accedi →</span>
        </Link>
      )}

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
            currentUserId={profile?.id}
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