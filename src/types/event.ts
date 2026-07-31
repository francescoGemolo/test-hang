import type { UserProfile } from './user';

export interface HangoutEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  description?: string;
  organizerId: string;
  participants: UserProfile[];
}

export type EventDraft = Pick<
  HangoutEvent,
  'title' | 'date' | 'time' | 'location' | 'maxParticipants' | 'description'
>;