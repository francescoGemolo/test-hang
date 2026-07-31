import type { UserProfile } from './user';

export interface ParticipantPreview {
  id: string;
  nickname: string;
}

export interface HangoutEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  description?: string;
  organizerId: string;
  participantsCount: number;
  participantsPreview: ParticipantPreview[];
}

export type EventDraft = Pick<
  HangoutEvent,
  'title' | 'date' | 'time' | 'location' | 'maxParticipants' | 'description'
>;

export type EventParticipant = UserProfile;