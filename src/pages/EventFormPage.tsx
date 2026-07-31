import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Calendar05Icon, Clock01Icon, Note01Icon, PinLocation01Icon, TextFontIcon, UserGroupIcon } from '@hugeicons/core-free-icons';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import { isRequired, isValidMaxParticipants } from '../lib/validators';
import type { EventDraft } from '../types/event';
import { AppShell } from '../components/layout/AppShell';
import { HeaderBack } from '../components/layout/HeaderBack';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { LinkButton } from '../components/ui/LinkButton';

interface FormErrors {
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  maxParticipants?: string;
}

export default function EventFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const { events, isLoading, createEvent, updateEvent } = useEvents();
  const navigate = useNavigate();

  const existing = isEdit ? events.find((event) => event.id === id) : undefined;

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setDate(existing.date);
      setTime(existing.time);
      setLocation(existing.location);
      setMaxParticipants(String(existing.maxParticipants));
      setDescription(existing.description ?? '');
    }
  }, [existing]);

  useEffect(() => {
    if (isEdit && !isLoading && !existing) navigate('/events', { replace: true });
  }, [isEdit, isLoading, existing, navigate]);

  if (!user) return null;
  if (isEdit && isLoading) return null;
  if (isEdit && !existing) return null;
  if (isEdit && existing && existing.organizerId !== user.id) return <Navigate to="/events" replace />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user) return;

    const nextErrors: FormErrors = {};
    if (!isRequired(title)) nextErrors.title = "Inserisci un titolo per l'evento.";
    if (!isRequired(date)) nextErrors.date = 'Seleziona una data.';
    if (!isRequired(time)) nextErrors.time = 'Seleziona un orario.';
    if (!isRequired(location)) nextErrors.location = "Inserisci il luogo dell'evento.";
    if (!isValidMaxParticipants(maxParticipants)) {
      nextErrors.maxParticipants = 'Inserisci il numero massimo di partecipanti (min. 2).';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const draft: EventDraft = {
      title: title.trim(),
      date,
      time,
      location: location.trim(),
      maxParticipants: Number(maxParticipants),
      description: description.trim() || undefined,
    };

    if (isEdit && existing) {
      await updateEvent(existing.id, draft);
    } else {
      await createEvent(draft, user);
    }
    navigate('/events');
  }

  return (
    <AppShell>
      <HeaderBack to="/events" title={isEdit ? 'Modifica Evento' : 'Crea Evento'} />
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4.5">
        <Input
          id="event-title"
          label="Titolo dell'evento *"
          icon={Note01Icon}
          placeholder="es. Aperitivo Serale"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          error={errors.title}
        />
        <div className="flex w-full gap-3">
          <Input
            id="event-date"
            label="Data *"
            icon={Calendar05Icon}
            type="date"
            containerClassName="min-w-0 flex-1"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            error={errors.date}
          />
          <Input
            id="event-time"
            label="Ora *"
            icon={Clock01Icon}
            type="time"
            containerClassName="min-w-0 flex-1"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            error={errors.time}
          />
        </div>
        <Input
          id="event-location"
          label="Luogo *"
          icon={PinLocation01Icon}
          placeholder="es. Bar Mediterraneo o link Maps"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          error={errors.location}
        />
        <Input
          id="event-max-participants"
          label="Partecipanti max *"
          icon={UserGroupIcon}
          type="number"
          inputMode="numeric"
          min={2}
          placeholder="es. 10"
          value={maxParticipants}
          onChange={(event) => setMaxParticipants(event.target.value)}
          error={errors.maxParticipants}
        />
        <Input
          id="event-description"
          label="Descrizione"
          icon={TextFontIcon}
          optional
          placeholder="es. Portate qualcosa da bere!"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <div className="mt-1 flex flex-col gap-3">
          <Button type="submit" variant="primary">
            {isEdit ? 'Salva modifiche' : 'Crea Evento'}
          </Button>
          <LinkButton to="/events" variant="cancel">
            Annulla
          </LinkButton>
        </div>
      </form>
    </AppShell>
  );
}