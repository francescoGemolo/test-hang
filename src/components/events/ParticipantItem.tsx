import type { UserProfile } from '../../types/user';
import { Avatar } from '../ui/Avatar';
import { ContactBadge } from '../ui/ContactBadge';

interface ParticipantItemProps {
  participant: UserProfile;
  isOrganizer: boolean;
}

export function ParticipantItem({ participant, isOrganizer }: ParticipantItemProps) {
  return (
    <article className="flex items-start gap-3 border-b border-white/10 pb-4.5 last:border-0 last:pb-0">
      <Avatar label={participant.nickname} />
      <div className="flex w-full flex-col gap-1.5">
        <div className="flex items-center gap-1">
          <h3 className="text-base font-medium">{participant.nickname}</h3>
          {isOrganizer && <p className="text-sm text-neutral-500">- Organizzatore</p>}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {participant.whatsapp && <ContactBadge type="whatsapp" value={participant.whatsapp} />}
          {participant.instagram && <ContactBadge type="instagram" value={participant.instagram} />}
          {participant.telegram && <ContactBadge type="telegram" value={participant.telegram} />}
        </div>
      </div>
    </article>
  );
}