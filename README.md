# Hangout

Mobile-app per organizzare eventi tra amici. React + TypeScript + Tailwind CSS, deploy su GitHub Pages.

## Sviluppo

```bash
npm install
npm run dev
```

## Build e deploy

```bash
npm run build     # build di produzione in dist/
npm run deploy     # build + pubblicazione su branch gh-pages
```

Lo storage è attualmente basato su `localStorage`/`sessionStorage` (vedi `src/data/`), in attesa dell'integrazione con Firestore.