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

## Hostinger Premium Deployment

This project is configured as a static Next.js export for Hostinger Premium hosting. The build creates an `out` directory containing the complete website as HTML, CSS, JavaScript and image files.

```bash
npm install
npm run build:hostinger
```

Upload the **contents inside** `out` to the domain's `public_html` directory in Hostinger File Manager. Do not upload the `out` directory itself as a nested folder.

To preview the production export locally:

```bash
npm run preview
```

The former Next.js admin/API routes required a persistent Node.js server and are not included because Hostinger Premium does not support Web Apps. Edit `data/admin-content.json` locally, rebuild, and upload the new `out` contents when managed content changes.

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
