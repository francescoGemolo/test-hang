import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { EventDraft, EventParticipant, HangoutEvent, ParticipantPreview } from '../types/event';
import type { UserProfile } from '../types/user';

const EVENTS_COLLECTION = 'events';
const PARTICIPANTS_SUBCOLLECTION = 'participants';
const PREVIEW_SIZE = 3;

function eventsCollectionRef() {
  return collection(db, EVENTS_COLLECTION);
}

function eventDocRef(eventId: string) {
  return doc(db, EVENTS_COLLECTION, eventId);
}

function participantsCollectionRef(eventId: string) {
  return collection(db, EVENTS_COLLECTION, eventId, PARTICIPANTS_SUBCOLLECTION);
}

function participantDocRef(eventId: string, uid: string) {
  return doc(db, EVENTS_COLLECTION, eventId, PARTICIPANTS_SUBCOLLECTION, uid);
}

function toHangoutEvent(id: string, data: Record<string, unknown>): HangoutEvent {
  return {
    id,
    title: data.title as string,
    date: data.date as string,
    time: data.time as string,
    location: data.location as string,
    maxParticipants: data.maxParticipants as number,
    description: (data.description as string | null) ?? undefined,
    organizerId: data.organizerId as string,
    participantsCount: data.participantsCount as number,
    participantsPreview: (data.participantsPreview as ParticipantPreview[]) ?? [],
  };
}

function toParticipant(id: string, data: Record<string, unknown>): EventParticipant {
  return {
    id,
    nickname: data.nickname as string,
    whatsapp: (data.whatsapp as string | null) ?? undefined,
    instagram: (data.instagram as string | null) ?? undefined,
    telegram: (data.telegram as string | null) ?? undefined,
  };
}

function draftToFields(draft: EventDraft) {
  return {
    title: draft.title,
    date: draft.date,
    time: draft.time,
    location: draft.location,
    maxParticipants: draft.maxParticipants,
    description: draft.description ?? null,
  };
}

function participantSnapshotFields(participant: UserProfile) {
  return {
    nickname: participant.nickname,
    whatsapp: participant.whatsapp ?? null,
    instagram: participant.instagram ?? null,
    telegram: participant.telegram ?? null,
    joinedAt: serverTimestamp(),
  };
}

export function subscribeToEvents(callback: (events: HangoutEvent[]) => void): Unsubscribe {
  const eventsQuery = query(eventsCollectionRef(), orderBy('date', 'asc'), orderBy('time', 'asc'));
  return onSnapshot(eventsQuery, (snapshot) => {
    callback(snapshot.docs.map((docSnap) => toHangoutEvent(docSnap.id, docSnap.data())));
  });
}

export function subscribeToParticipants(
  eventId: string,
  callback: (participants: EventParticipant[]) => void,
): Unsubscribe {
  const participantsQuery = query(participantsCollectionRef(eventId), orderBy('joinedAt', 'asc'));
  return onSnapshot(participantsQuery, (snapshot) => {
    callback(snapshot.docs.map((docSnap) => toParticipant(docSnap.id, docSnap.data())));
  });
}

export async function createEvent(draft: EventDraft, organizer: UserProfile): Promise<string> {
  const eventRef = doc(eventsCollectionRef());
  const batch = writeBatch(db);

  batch.set(eventRef, {
    ...draftToFields(draft),
    organizerId: organizer.id,
    participantsCount: 1,
    participantsPreview: [{ id: organizer.id, nickname: organizer.nickname }] satisfies ParticipantPreview[],
    createdAt: serverTimestamp(),
  });
  batch.set(participantDocRef(eventRef.id, organizer.id), participantSnapshotFields(organizer));

  await batch.commit();
  return eventRef.id;
}

export async function updateEvent(eventId: string, draft: EventDraft): Promise<void> {
  await updateDoc(eventDocRef(eventId), draftToFields(draft));
}

export async function removeEvent(eventId: string): Promise<void> {
  const participantsSnapshot = await getDocs(participantsCollectionRef(eventId));
  const batch = writeBatch(db);
  participantsSnapshot.docs.forEach((docSnap) => batch.delete(docSnap.ref));
  batch.delete(eventDocRef(eventId));
  await batch.commit();
}

export async function joinEvent(eventId: string, participant: UserProfile): Promise<void> {
  await runTransaction(db, async (transaction) => {
    const eventSnap = await transaction.get(eventDocRef(eventId));
    if (!eventSnap.exists()) throw new Error('Evento non trovato');
    const event = eventSnap.data();

    const participantSnap = await transaction.get(participantDocRef(eventId, participant.id));
    if (participantSnap.exists()) return;

    const currentCount = event.participantsCount as number;
    const maxParticipants = event.maxParticipants as number;
    if (currentCount >= maxParticipants) throw new Error('Evento pieno');

    const currentPreview = (event.participantsPreview as ParticipantPreview[]) ?? [];
    const nextPreview =
      currentPreview.length < PREVIEW_SIZE
        ? [...currentPreview, { id: participant.id, nickname: participant.nickname }]
        : currentPreview;

    transaction.set(participantDocRef(eventId, participant.id), participantSnapshotFields(participant));
    transaction.update(eventDocRef(eventId), {
      participantsCount: currentCount + 1,
      participantsPreview: nextPreview,
    });
  });
}

export async function leaveEvent(eventId: string, userId: string): Promise<void> {
  await runTransaction(db, async (transaction) => {
    const eventSnap = await transaction.get(eventDocRef(eventId));
    if (!eventSnap.exists()) return;
    const event = eventSnap.data();

    const participantSnap = await transaction.get(participantDocRef(eventId, userId));
    if (!participantSnap.exists()) return;

    const currentCount = event.participantsCount as number;
    const currentPreview = (event.participantsPreview as ParticipantPreview[]) ?? [];
    const nextPreview = currentPreview.filter((entry) => entry.id !== userId);

    transaction.delete(participantDocRef(eventId, userId));
    transaction.update(eventDocRef(eventId), {
      participantsCount: Math.max(0, currentCount - 1),
      participantsPreview: nextPreview,
    });
  });
}