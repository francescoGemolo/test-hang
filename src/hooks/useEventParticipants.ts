import { useEffect, useState } from 'react';
import { subscribeToParticipants } from '../data/eventsRepository';
import type { EventParticipant } from '../types/event';

export function useEventParticipants(eventId: string, enabled: boolean) {
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setParticipants([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const unsubscribe = subscribeToParticipants(eventId, (nextParticipants) => {
      setParticipants(nextParticipants);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [eventId, enabled]);

  return { participants, isLoading };
}