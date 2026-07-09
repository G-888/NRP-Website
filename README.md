# Nuaim Razak & Partners Website

Redesigned website for Nuaim Razak & Partners, a Malaysian Syariah law firm.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- lucide-react icons
- Centralized content in `lib/site-data.ts`

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Admin Panel

Create `.env.local` based on `.env.example`:

```bash
ADMIN_PASSWORD=change-this-password
ADMIN_SESSION_SECRET=change-this-long-random-secret
```

Then open `http://localhost:3000/admin`.

## Useful Commands

```bash
npm run typecheck
npm run lint
npm run build
```

## Pages

- `/`
- `/tentang-kami`
- `/bidang-amalan`
- `/peguam`
- `/artikel`
- `/hubungi-kami`
- `/temujanji`

## Content And Assets

The site uses real firm information, contact details, lawyer profiles, blog titles/excerpts and images from the existing Nuaim Razak & Partners website. Shared firm data, navigation, services, lawyers, FAQs and blog posts are maintained in `lib/site-data.ts`.

## TODO

The appointment/contact form is currently frontend-only with validation and success/error states. Connect it later to an email or backend provider such as a Next.js API route, Resend, Nodemailer, Formspree or an existing WordPress/backend endpoint.
