import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import { eventsRepository } from '../data/eventsRepository';
import type { EventDraft, HangoutEvent } from '../types/event';
import type { UserProfile } from '../types/user';

export interface EventsContextValue {
  events: HangoutEvent[];
  isLoading: boolean;
  createEvent: (draft: EventDraft, organizer: UserProfile) => Promise<HangoutEvent>;
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
    eventsRepository.list().then((list) => {
      setEvents(list);
      setIsLoading(false);
    });
  }, []);

  const createEvent = useCallback(async (draft: EventDraft, organizer: UserProfile) => {
    const event = await eventsRepository.create(draft, organizer);
    setEvents((prev) => [event, ...prev]);
    return event;
  }, []);

  const updateEvent = useCallback(async (id: string, draft: EventDraft) => {
    const updated = await eventsRepository.update(id, draft);
    setEvents((prev) => prev.map((event) => (event.id === id ? updated : event)));
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    await eventsRepository.remove(id);
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }, []);

  const joinEvent = useCallback(async (id: string, participant: UserProfile) => {
    const updated = await eventsRepository.join(id, participant);
    setEvents((prev) => prev.map((event) => (event.id === id ? updated : event)));
  }, []);

  const leaveEvent = useCallback(async (id: string, userId: string) => {
    const updated = await eventsRepository.leave(id, userId);
    setEvents((prev) => prev.map((event) => (event.id === id ? updated : event)));
  }, []);

  return (
    <EventsContext.Provider
      value={{ events, isLoading, createEvent, updateEvent, deleteEvent, joinEvent, leaveEvent }}
    >
      {children}
    </EventsContext.Provider>
  );
}