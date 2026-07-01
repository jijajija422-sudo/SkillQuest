# SkillQuest

A cozy, calming RPG-style learning quest board built with Next.js, Tailwind CSS and TypeScript. SkillQuest helps learners track small, actionable quests, upload proof of completion, and celebrate wins together in a live guild feed.

## Quick start

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Scripts

- `npm run dev` — runs the Next.js dev server
- `npm run build` — builds the production app
- `npm start` — starts the production server after build
- `npm run lint` — runs ESLint (project includes a basic `.eslintrc.json`)

## What this project includes

- Interactive quest list with detail modals and checklists
- Proof of completion upload (Cloudinary or local demo fallback)
- Guild feed for recent completions with applause reactions
- Character sheet / XP progression (local demo state)
- Quest search, filters, and active journey sections
- Theme selector with multiple calming themes and a dark mode toggle
- LocalStorage fallback for theme and demo feed state
- Minimal Firebase & Cloudinary integration stubs for optional live mode

## Features (expanded)

- Interactive Quests: browse categorized quests, open a quest card to view requirements and start a mini-journey.
- Proof Upload: attach screenshots or photos as proof of completion. If Cloudinary is configured, uploads go there; otherwise images are read locally (Data URL) for demo mode.
- Guild Feed: live feed of recent completions. When Firebase is configured, this uses Firestore; otherwise it uses a `localStorage`-backed demo feed.
- Applause: members can applaud completions. Applause is persisted in Firebase or locally depending on configuration.
- Character Sheet: basic XP tracking and level/badge assignment based on quest completion.
- Themes & Dark Mode: choose from multiple preset themes (Calm, Forest, Dusk, Paper) and a dark/light mode — preference persists in `localStorage`.
- Accessibility & Performance: components use semantic HTML and Tailwind utilities; images are served through `next/image` for optimization where applicable.

## Environment variables (optional)

Create `.env.local` at the project root to enable Cloudinary and Firebase features. Copy from a provided example if present.

- Cloudinary (optional):
  - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
  - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (or server upload endpoint)

- Firebase (optional):
  - `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, etc. (your Firebase web app config)

If these are omitted the app runs in demo mode using localStorage and Data URLs for uploads.

## Cloudinary setup (optional)

1. Create a Cloudinary account.
2. Create an unsigned upload preset (Dashboard → Settings → Upload → Upload presets).
3. Set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` in `.env.local`.

## Firebase setup (optional)

1. Create a Firebase project and enable Firestore.
2. Add a web app and copy the client config into `NEXT_PUBLIC_FIREBASE_*` vars.
3. Recommended Firestore rules for the `completions` collection (allow reads/creates; limit applause updates):

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /completions/{doc} {
      allow read: if true;
      allow create: if true;
      allow update: if request.resource.data.applause == resource.data.applause + 1;
    }
  }
}
```

## Project structure

- `app/` — Next.js App Router pages and components
- `app/components/` — UI components (Header, ThemeSelector, GuildFeed, ProofUpload, etc.)
- `lib/` — small helpers (quests metadata, feed-storage, upload, firebase stubs)
- `public/` — static assets
- `next.config.mjs`, `tailwind.config.js`, `postcss.config.js` — build & styling config

## Development notes & troubleshooting

- ESLint: the project includes a basic `.eslintrc.json`. Run `npm run lint`.
- TypeScript: the repo uses a newer TypeScript version; you may see a compatibility warning from `@typescript-eslint/typescript-estree` — this is informational.
- Images: the app prefers `next/image` for improved performance; local demo uploads use Data URLs for previews.

## Contributing

Contributions welcome. Open an issue or a pull request with a clear description of the change and reasoning.

## License

This repository does not include a license file by default. Add one (for example `MIT`) if you plan to open-source the project.

---

If you'd like, I can also add a `.env.example` file, a `CONTRIBUTING.md`, or a short demo GIF to the README. 
