import { Calendar03Icon } from '@hugeicons/core-free-icons';
import { Icon } from '../components/ui/Icon';
import { LinkButton } from '../components/ui/LinkButton';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 p-5 text-center">
      <div className="flex flex-col items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-accent-hover bg-accent/10 text-accent">
          <Icon icon={Calendar03Icon} size={40} />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">Hangout</h1>
          <p className="max-w-xs text-base text-neutral-400">
            Organizza e scopri eventi tra amici: crea un evento, invita chi vuoi e gestisci i partecipanti in un
            unico posto.
          </p>
        </div>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <LinkButton to="/login" variant="primary">
          Accedi
        </LinkButton>
        <LinkButton to="/events" variant="secondary">
          Continua come ospite
        </LinkButton>
      </div>
    </div>
  );
}