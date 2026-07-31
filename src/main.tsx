import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const rootElement = document.getElementById('root')!;
const isFirebaseConfigured = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);

if (isFirebaseConfigured) {
  import('./App').then(({ default: App }) => {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <div className="grid min-h-screen place-items-center p-5 text-center">
        <div className="flex max-w-sm flex-col gap-3 rounded-3xl border border-white/20 bg-surface p-6">
          <h1 className="text-lg font-semibold">Configura Firebase</h1>
          <p className="text-sm leading-relaxed text-neutral-400">
            Aggiungi le tue credenziali del progetto Firebase in <code className="text-neutral-50">.env.local</code>{' '}
            (vedi <code className="text-neutral-50">.env.example</code> e il README) e riavvia il server.
          </p>
        </div>
      </div>
    </StrictMode>,
  );
}