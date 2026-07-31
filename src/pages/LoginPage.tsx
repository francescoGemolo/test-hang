import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { InstagramIcon, TelegramIcon, UserIcon, WhatsappIcon } from '@hugeicons/core-free-icons';
import { useAuth } from '../hooks/useAuth';
import { isRequired } from '../lib/validators';
import { Input } from '../components/ui/Input';
import { Checkbox } from '../components/ui/Checkbox';
import { Button } from '../components/ui/Button';

interface FormErrors {
  nickname?: string;
  whatsapp?: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [telegram, setTelegram] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    if (!isRequired(nickname)) nextErrors.nickname = 'Inserisci un nickname.';
    if (!isRequired(whatsapp)) nextErrors.whatsapp = 'Inserisci il numero WhatsApp.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    await login(
      {
        nickname: nickname.trim(),
        whatsapp: whatsapp.trim(),
        instagram: instagram.trim() || undefined,
        telegram: telegram.trim() || undefined,
      },
      remember,
    );
    navigate('/events');
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
            Scegli un nickname e aggiungi i tuoi contatti (visibili solo ai partecipanti dei tuoi eventi).
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
        />
        <Input
          id="telegram"
          label="Telegram"
          icon={TelegramIcon}
          optional
          placeholder="@username"
          value={telegram}
          onChange={(event) => setTelegram(event.target.value)}
        />

        <div className="flex w-full items-center py-1">
          <Checkbox checked={remember} onChange={setRemember} label="Ricordami su questo dispositivo" />
        </div>

        <Button type="submit" variant="primary">
          Entra
        </Button>
      </form>
    </div>
  );
}