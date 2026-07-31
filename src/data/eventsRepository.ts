import type { EventDraft, HangoutEvent } from '../types/event';
import type { UserProfile } from '../types/user';
import { readJSON, writeJSON } from './storage';

const EVENTS_KEY = 'hangout:events';

export interface EventsRepository {
  list(): Promise<HangoutEvent[]>;
  create(draft: EventDraft, organizer: UserProfile): Promise<HangoutEvent>;
  update(id: string, draft: EventDraft): Promise<HangoutEvent>;
  remove(id: string): Promise<void>;
  join(id: string, participant: UserProfile): Promise<HangoutEvent>;
  leave(id: string, userId: string): Promise<HangoutEvent>;
}

function seedEvents(): HangoutEvent[] {
  const marco: UserProfile = { id: 'seed-marco', nickname: 'Marco', whatsapp: '+39 333 1234567', instagram: 'marco_roma' };
  const giulia: UserProfile = { id: 'seed-giulia', nickname: 'Giulia', instagram: 'giulia.foto', telegram: 'giulia_tg' };

  const andrea: UserProfile = { id: 'seed-andrea', nickname: 'Andrea', whatsapp: '+39 333 2223344' };
  const paolo: UserProfile = { id: 'seed-paolo', nickname: 'Paolo', instagram: 'paolo.dj' };
  const marta: UserProfile = { id: 'seed-marta', nickname: 'Marta', telegram: 'marta_tg' };
  const elena: UserProfile = { id: 'seed-elena', nickname: 'Elena' };
  const davide: UserProfile = { id: 'seed-davide', nickname: 'Davide' };
  const saraDp: UserProfile = { id: 'seed-sara-dp', nickname: 'Sara' };

  const riccardo: UserProfile = { id: 'seed-riccardo', nickname: 'Riccardo', whatsapp: '+39 333 5556677' };
  const saraCena: UserProfile = { id: 'seed-sara-cena', nickname: 'Sara', instagram: 'sara.cucina' };
  const tommaso: UserProfile = { id: 'seed-tommaso', nickname: 'Tommaso', telegram: 'tommaso_tg' };
  const valentina: UserProfile = { id: 'seed-valentina', nickname: 'Valentina' };

  return [
    {
      id: 'seed-event-1',
      title: 'Aperitivo Serale',
      date: '2026-08-08',
      time: '19:30',
      location: 'Bar Mediterraneo',
      maxParticipants: 10,
      description: 'Apericucciole con le cucciole.',
      organizerId: marco.id,
      participants: [marco, giulia],
    },
    {
      id: 'seed-event-2',
      title: 'Danza Puzzo',
      date: '2026-08-12',
      time: '23:30',
      location: 'Disco Sole',
      maxParticipants: 8,
      organizerId: andrea.id,
      participants: [andrea, paolo, marta, elena, davide, saraDp],
    },
    {
      id: 'seed-event-3',
      title: 'Cena tra amici',
      date: '2026-08-14',
      time: '20:00',
      location: 'Trattoria Da Gino',
      maxParticipants: 4,
      organizerId: riccardo.id,
      participants: [riccardo, saraCena, tommaso, valentina],
    },
  ];
}

function loadEvents(): HangoutEvent[] {
  const existing = readJSON<HangoutEvent[]>(EVENTS_KEY);
  if (existing) return existing;
  const seeded = seedEvents();
  writeJSON(EVENTS_KEY, seeded);
  return seeded;
}

function saveEvents(events: HangoutEvent[]): void {
  writeJSON(EVENTS_KEY, events);
}

class LocalEventsRepository implements EventsRepository {
  async list(): Promise<HangoutEvent[]> {
    return loadEvents();
  }

  async create(draft: EventDraft, organizer: UserProfile): Promise<HangoutEvent> {
    const events = loadEvents();
    const event: HangoutEvent = {
      id: crypto.randomUUID(),
      organizerId: organizer.id,
      participants: [organizer],
      ...draft,
    };
    saveEvents([event, ...events]);
    return event;
  }

  async update(id: string, draft: EventDraft): Promise<HangoutEvent> {
    const events = loadEvents();
    const index = events.findIndex((event) => event.id === id);
    if (index === -1) throw new Error('Evento non trovato');
    const updated = { ...events[index], ...draft };
    events[index] = updated;
    saveEvents(events);
    return updated;
  }

  async remove(id: string): Promise<void> {
    saveEvents(loadEvents().filter((event) => event.id !== id));
  }

  async join(id: string, participant: UserProfile): Promise<HangoutEvent> {
    const events = loadEvents();
    const index = events.findIndex((event) => event.id === id);
    if (index === -1) throw new Error('Evento non trovato');
    const event = events[index];
    if (event.participants.some((p) => p.id === participant.id)) return event;
    const updated = { ...event, participants: [...event.participants, participant] };
    events[index] = updated;
    saveEvents(events);
    return updated;
  }

  async leave(id: string, userId: string): Promise<HangoutEvent> {
    const events = loadEvents();
    const index = events.findIndex((event) => event.id === id);
    if (index === -1) throw new Error('Evento non trovato');
    const event = events[index];
    const updated = { ...event, participants: event.participants.filter((p) => p.id !== userId) };
    events[index] = updated;
    saveEvents(events);
    return updated;
  }
}

export const eventsRepository: EventsRepository = new LocalEventsRepository();