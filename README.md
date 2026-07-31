# Hangout

Mobile-app per organizzare eventi tra amici. React + TypeScript + Tailwind CSS, autenticazione e dati su Firebase, deploy su GitHub Pages.

## Configurare Firebase (obbligatorio)

1. Crea un progetto su [console.firebase.google.com](https://console.firebase.google.com).
2. **Authentication** → Sign-in method → abilita **Email/Password** e **Google**.
3. **Firestore Database** → crea il database (modalità produzione).
4. Project settings → General → "Le tue app" → aggiungi una Web app → copia le chiavi nella sezione `firebaseConfig`.
5. Copia `.env.example` in `.env.local` e incolla i valori:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
6. Aggiorna `.firebaserc` con il tuo `projectId` e pubblica le regole di sicurezza:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules
   ```

Senza questi passaggi l'app mostra una schermata "Configura Firebase" invece di avviarsi.

## Sviluppo

```bash
npm install
npm run dev
```

## Build e deploy

```bash
npm run build      # build di produzione in dist/
npm run deploy      # build + pubblicazione su branch gh-pages
```