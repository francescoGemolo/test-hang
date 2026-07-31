import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IconSvgElement } from '@hugeicons/react';
import { Alert01Icon, Delete02Icon, InstagramIcon, Pen01Icon, TelegramIcon, UserIcon, WhatsappIcon } from '@hugeicons/core-free-icons';
import { useAuth } from '../hooks/useAuth';
import { isValidHandle, isValidNickname, isValidWhatsapp } from '../lib/validators';
import { mapAuthError } from '../lib/firebaseErrors';
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
  instagram?: string;
  telegram?: string;
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
  const { profile, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [nickname, setNickname] = useState(profile?.nickname ?? '');
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp ?? '');
  const [instagram, setInstagram] = useState(profile?.instagram ?? '');
  const [telegram, setTelegram] = useState(profile?.telegram ?? '');
  const [errors, setErrors] = useState<FormErrors>({});

  if (!profile) return null;

  function enterEditMode() {
    setNickname(profile!.nickname);
    setWhatsapp(profile!.whatsapp ?? '');
    setInstagram(profile!.instagram ?? '');
    setTelegram(profile!.telegram ?? '');
    setErrors({});
    setIsEditing(true);
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    if (!isValidNickname(nickname)) nextErrors.nickname = '3-15 caratteri: lettere, numeri, punto o underscore.';
    if (!isValidWhatsapp(whatsapp)) nextErrors.whatsapp = 'Inserisci un numero WhatsApp valido (8-16 cifre).';
    if (!isValidHandle(instagram)) nextErrors.instagram = 'Username non valido.';
    if (!isValidHandle(telegram)) nextErrors.telegram = 'Username non valido.';
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
    setDeleteError('');
    try {
      await deleteAccount();
      navigate('/');
    } catch (error) {
      setDeleteError(mapAuthError(error));
    }
  }

  return (
    <AppShell>
      <HeaderBack to="/events" title="Il tuo profilo" />
      <main className="flex flex-col gap-10">
        <div className="flex flex-col items-center gap-3">
          <Avatar label={profile.nickname} size="lg" />
          <h2 className="text-2xl font-semibold">{profile.nickname}</h2>
        </div>

        <article className="flex flex-col gap-4.5 rounded-3xl border border-white/20 bg-surface p-5">
          {!isEditing ? (
            <>
              <div className="flex flex-col gap-3">
                {profile.whatsapp && (
                  <ProfileInfoRow
                    icon={WhatsappIcon}
                    label="WhatsApp"
                    value={profile.whatsapp}
                    className="border-whatsapp/40 bg-whatsapp/20 text-whatsapp"
                  />
                )}
                {profile.instagram && (
                  <ProfileInfoRow
                    icon={InstagramIcon}
                    label="Instagram"
                    value={`@${profile.instagram}`}
                    className="border-instagram/40 bg-instagram/20 text-instagram"
                  />
                )}
                {profile.telegram && (
                  <ProfileInfoRow
                    icon={TelegramIcon}
                    label="Telegram"
                    value={`@${profile.telegram}`}
                    className="border-telegram/40 bg-telegram/20 text-telegram"
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full" onClick={enterEditMode}>
                  <Icon icon={Pen01Icon} size={18} />
                  Modifica
                </Button>
                <Button
                  variant="secondaryDanger"
                  className="w-full"
                  onClick={() => {
                    setDeleteError('');
                    setIsDeleteModalOpen(true);
                  }}
                >
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
                error={errors.instagram}
              />
              <Input
                id="telegram"
                label="Telegram"
                icon={TelegramIcon}
                optional
                value={telegram}
                onChange={(event) => setTelegram(event.target.value)}
                error={errors.telegram}
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
        {deleteError && <p className="text-sm text-danger">{deleteError}</p>}
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