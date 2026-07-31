import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import { createEvent, joinEvent, leaveEvent, removeEvent, subscribeToEvents, updateEvent } from '../data/eventsRepository';
import type { EventDraft, HangoutEvent } from '../types/event';
import type { UserProfile } from '../types/user';

export interface EventsContextValue {
  events: HangoutEvent[];
  isLoading: boolean;
  createEvent: (draft: EventDraft, organizer: UserProfile) => Promise<string>;
  updateEvent: (id: string, draft: EventDraft) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  joinEvent: (id: string, participant: UserProfile) => Promise<void>;
  leaveEvent: (id: string, userId: string) => Promise<void>;
}

export const EventsContext = createContext<EventsContextValue | null>(null);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<HangoutEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToEvents((nextEvents) => {
      setEvents(nextEvents);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleCreateEvent = useCallback((draft: EventDraft, organizer: UserProfile) => createEvent(draft, organizer), []);
  const handleUpdateEvent = useCallback((id: string, draft: EventDraft) => updateEvent(id, draft), []);
  const handleDeleteEvent = useCallback((id: string) => removeEvent(id), []);
  const handleJoinEvent = useCallback((id: string, participant: UserProfile) => joinEvent(id, participant), []);
  const handleLeaveEvent = useCallback((id: string, userId: string) => leaveEvent(id, userId), []);

  return (
    <EventsContext.Provider
      value={{
        events,
        isLoading,
        createEvent: handleCreateEvent,
        updateEvent: handleUpdateEvent,
        deleteEvent: handleDeleteEvent,
        joinEvent: handleJoinEvent,
        leaveEvent: handleLeaveEvent,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}