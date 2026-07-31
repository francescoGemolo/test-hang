import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { InstagramIcon, TelegramIcon, UserIcon, WhatsappIcon } from '@hugeicons/core-free-icons';
import { useAuth } from '../hooks/useAuth';
import { isValidHandle, isValidNickname, isValidWhatsapp } from '../lib/validators';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

interface FormErrors {
  nickname?: string;
  whatsapp?: string;
  instagram?: string;
  telegram?: string;
}

export default function RegisterPage() {
  const { firebaseUser, completeProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/events';

  const [nickname, setNickname] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [telegram, setTelegram] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    if (!isValidNickname(nickname)) nextErrors.nickname = '3-15 caratteri: lettere, numeri, punto o underscore.';
    if (!isValidWhatsapp(whatsapp)) nextErrors.whatsapp = 'Inserisci un numero WhatsApp valido (8-16 cifre).';
    if (!isValidHandle(instagram)) nextErrors.instagram = 'Username non valido.';
    if (!isValidHandle(telegram)) nextErrors.telegram = 'Username non valido.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await completeProfile({
        nickname: nickname.trim(),
        whatsapp: whatsapp.trim(),
        instagram: instagram.trim() || undefined,
        telegram: telegram.trim() || undefined,
      });
      navigate(redirectTo);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center p-5">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[480px] flex-col gap-4.5 rounded-3xl border border-white/20 p-5"
      >
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl">Ciao! 👋🏻</h1>
          <p className="text-base text-neutral-400">
            Accesso effettuato{firebaseUser?.email ? ` come ${firebaseUser.email}` : ''}. Ora scegli un nickname e
            aggiungi i tuoi contatti (visibili solo agli utenti autenticati).
          </p>
        </div>

        <Input
          id="nickname"
          label="Nickname *"
          icon={UserIcon}
          placeholder="es. Marco_92"
          maxLength={15}
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          error={errors.nickname}
        />
        <Input
          id="whatsapp"
          label="Whatsapp *"
          icon={WhatsappIcon}
          inputMode="numeric"
          placeholder="328 333 ..."
          value={whatsapp}
          onChange={(event) => setWhatsapp(event.target.value)}
          error={errors.whatsapp}
        />
        <Input
          id="instagram"
          label="Instagram"
          icon={InstagramIcon}
          optional
          placeholder="@username"
          value={instagram}
          onChange={(event) => setInstagram(event.target.value)}
          error={errors.instagram}
        />
        <Input
          id="telegram"
          label="Telegram"
          icon={TelegramIcon}
          optional
          placeholder="@username"
          value={telegram}
          onChange={(event) => setTelegram(event.target.value)}
          error={errors.telegram}
        />

        <Button type="submit" variant="primary" disabled={isSubmitting}>
          Entra
        </Button>
      </form>
    </div>
  );
}