import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail, isValidPassword, isRequired } from '../lib/validators';
import { mapAuthError } from '../lib/firebaseErrors';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { GoogleIcon } from '../components/ui/GoogleIcon';
import { MailAtSign01Icon, SquareLock02Icon } from '@hugeicons/core-free-icons';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/events';

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError('');

    const nextErrors: FormErrors = {};
    if (!isValidEmail(email)) nextErrors.email = "Inserisci un'email valida.";
    if (mode === 'signup' && !isValidPassword(password)) {
      nextErrors.password = 'Almeno 8 caratteri, con lettere e numeri.';
    } else if (mode === 'signin' && !isRequired(password)) {
      nextErrors.password = 'Inserisci la password.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email.trim(), password);
      } else {
        await signInWithEmail(email.trim(), password);
      }
      navigate(redirectTo);
    } catch (error) {
      setFormError(mapAuthError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setFormError('');
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      navigate(redirectTo);
    } catch (error) {
      setFormError(mapAuthError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center p-5">
      <div className="flex w-full max-w-[480px] flex-col gap-4.5 rounded-3xl border border-white/20 p-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl">{mode === 'signin' ? 'Bentornato! 👋🏻' : 'Creiamo il tuo accesso'}</h1>
          <p className="text-base text-neutral-400">
            {mode === 'signin'
              ? 'Accedi per creare eventi e partecipare a quelli dei tuoi amici.'
              : 'Registrati con email e password, poi scegli tu nickname e contatti.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
          <Input
            id="email"
            label="Email *"
            icon={MailAtSign01Icon}
            type="email"
            placeholder="tuo@indirizzo.it"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email}
          />
          <Input
            id="password"
            label="Password *"
            icon={SquareLock02Icon}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={errors.password}
          />

          {formError && <p className="text-sm text-danger">{formError}</p>}

          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {mode === 'signin' ? 'Accedi' : 'Registrati'}
          </Button>
        </form>

        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <div className="h-px flex-1 bg-white/10" />
          oppure
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <Button variant="secondary" disabled={isSubmitting} onClick={handleGoogleSignIn}>
          <GoogleIcon className="h-4.5 w-4.5" />
          Continua con Google
        </Button>

        <button
          type="button"
          onClick={() => {
            setMode((current) => (current === 'signin' ? 'signup' : 'signin'));
            setErrors({});
            setFormError('');
          }}
          className="text-center text-sm text-neutral-400 hover:text-neutral-50"
        >
          {mode === 'signin' ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
        </button>
      </div>
    </div>
  );
}