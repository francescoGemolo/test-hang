import { InstagramIcon, TelegramIcon, WhatsappIcon } from '@hugeicons/core-free-icons';
import { Icon } from './Icon';

type ContactType = 'whatsapp' | 'instagram' | 'telegram';

interface ContactBadgeProps {
  type: ContactType;
  value: string;
}

const CONFIG: Record<ContactType, { icon: typeof WhatsappIcon; className: string; href: (value: string) => string }> = {
  whatsapp: {
    icon: WhatsappIcon,
    className: 'border-whatsapp/40 bg-whatsapp/20 text-whatsapp',
    href: (value) => `https://wa.me/${value.replace(/\D/g, '')}`,
  },
  instagram: {
    icon: InstagramIcon,
    className: 'border-instagram/40 bg-instagram/20 text-instagram',
    href: (value) => `https://instagram.com/${value.replace(/^@/, '')}`,
  },
  telegram: {
    icon: TelegramIcon,
    className: 'border-telegram/40 bg-telegram/20 text-telegram',
    href: (value) => `https://t.me/${value.replace(/^@/, '')}`,
  },
};

export function ContactBadge({ type, value }: ContactBadgeProps) {
  const config = CONFIG[type];
  return (
    <a
      href={config.href(value)}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${config.className}`}
    >
      <Icon icon={config.icon} size={16} />
      {value}
    </a>
  );
}