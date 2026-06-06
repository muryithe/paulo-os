<<<<<<< HEAD
# Paulo OS

A unified personal system — public portfolio, SQL knowledge base, and private dashboard.

## Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB Atlas via Mongoose
- **File Storage**: Vercel Blob
- **Auth**: NextAuth.js (Credentials)
- **Styling**: Tailwind CSS + CSS variables

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment Variables

Create `.env.local`:

```

```

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add all env variables in Vercel project settings
4. Set `NEXTAUTH_URL` to your production URL (e.g. `https://paulo-os.vercel.app`)
5. Deploy

## Routes

### Public
- `/` — Portfolio landing page
- `/knowledge-base` — KB index
- `/knowledge-base/sql` — Full 30-module SQL curriculum
- `/login` — Private OS login

### Private (requires auth)
- `/dashboard` — Home widgets
- `/dashboard/files` — File manager
- `/dashboard/database` — Dataset library
- `/dashboard/family` — Family album & events
- `/dashboard/notes` — Markdown notes editor
- `/dashboard/settings` — Settings
=======
# paulo-os
>>>>>>> 
