import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IconSvgElement } from '@hugeicons/react';
import { Alert01Icon, Delete02Icon, InstagramIcon, Pen01Icon, TelegramIcon, UserIcon, WhatsappIcon } from '@hugeicons/core-free-icons';
import { useAuth } from '../hooks/useAuth';
import { isRequired } from '../lib/validators';
import { AppShell } from '../components/layout/AppShell';
import { HeaderBack } from '../components/layout/HeaderBack';
import { Avatar } from '../components/ui/Avatar';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Icon } from '../components/ui/Icon';

interface FormErrors {
  nickname?: string;
  whatsapp?: string;
}

function ProfileInfoRow({ icon, label, value, className }: { icon: IconSvgElement; label: string; value: string; className: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-xl border ${className}`}>
        <Icon icon={icon} size={18} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm text-neutral-500">{label}</span>
        <p className="text-base text-neutral-50">{value}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp ?? '');
  const [instagram, setInstagram] = useState(user?.instagram ?? '');
  const [telegram, setTelegram] = useState(user?.telegram ?? '');
  const [errors, setErrors] = useState<FormErrors>({});

  if (!user) return null;

  function enterEditMode() {
    setNickname(user!.nickname);
    setWhatsapp(user!.whatsapp ?? '');
    setInstagram(user!.instagram ?? '');
    setTelegram(user!.telegram ?? '');
    setErrors({});
    setIsEditing(true);
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    if (!isRequired(nickname)) nextErrors.nickname = 'Inserisci un nickname.';
    if (!isRequired(whatsapp)) nextErrors.whatsapp = 'Inserisci il numero WhatsApp.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    await updateProfile({
      nickname: nickname.trim(),
      whatsapp: whatsapp.trim(),
      instagram: instagram.trim() || undefined,
      telegram: telegram.trim() || undefined,
    });
    setIsEditing(false);
  }

  async function handleDeleteAccount() {
    await logout();
    navigate('/');
  }

  return (
    <AppShell>
      <HeaderBack to="/events" title="Il tuo profilo" />
      <main className="flex flex-col gap-10">
        <div className="flex flex-col items-center gap-3">
          <Avatar label={user.nickname} size="lg" />
          <h2 className="text-2xl font-semibold">{user.nickname}</h2>
        </div>

        <article className="flex flex-col gap-4.5 rounded-3xl border border-white/20 bg-surface p-5">
          {!isEditing ? (
            <>
              <div className="flex flex-col gap-3">
                {user.whatsapp && (
                  <ProfileInfoRow
                    icon={WhatsappIcon}
                    label="WhatsApp"
                    value={user.whatsapp}
                    className="border-whatsapp/40 bg-whatsapp/20 text-whatsapp"
                  />
                )}
                {user.instagram && (
                  <ProfileInfoRow
                    icon={InstagramIcon}
                    label="Instagram"
                    value={`@${user.instagram}`}
                    className="border-instagram/40 bg-instagram/20 text-instagram"
                  />
                )}
                {user.telegram && (
                  <ProfileInfoRow
                    icon={TelegramIcon}
                    label="Telegram"
                    value={`@${user.telegram}`}
                    className="border-telegram/40 bg-telegram/20 text-telegram"
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full" onClick={enterEditMode}>
                  <Icon icon={Pen01Icon} size={18} />
                  Modifica
                </Button>
                <Button variant="secondaryDanger" className="w-full" onClick={() => setIsDeleteModalOpen(true)}>
                  <Icon icon={Delete02Icon} size={18} />
                  Elimina account
                </Button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSave} className="flex flex-col gap-4.5">
              <Input
                id="nickname"
                label="Nickname *"
                icon={UserIcon}
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
                value={whatsapp}
                onChange={(event) => setWhatsapp(event.target.value)}
                error={errors.whatsapp}
              />
              <Input
                id="instagram"
                label="Instagram"
                icon={InstagramIcon}
                optional
                value={instagram}
                onChange={(event) => setInstagram(event.target.value)}
              />
              <Input
                id="telegram"
                label="Telegram"
                icon={TelegramIcon}
                optional
                value={telegram}
                onChange={(event) => setTelegram(event.target.value)}
              />
              <div className="mt-1 flex flex-col gap-3">
                <Button type="submit" variant="primary">
                  Salva modifiche
                </Button>
                <Button type="button" variant="cancel" onClick={() => setIsEditing(false)}>
                  Annulla
                </Button>
              </div>
            </form>
          )}
        </article>
      </main>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        icon={Alert01Icon}
        title="Eliminare l'account?"
        description="Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile e perderai la partecipazione a tutti gli eventi."
      >
        <Button variant="danger" onClick={handleDeleteAccount}>
          Sì, elimina
        </Button>
        <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
          Annulla
        </Button>
      </Modal>
    </AppShell>
  );
}