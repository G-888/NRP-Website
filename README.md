# Nuaim Razak & Partners Website

Redesigned website for Nuaim Razak & Partners, a Malaysian Syariah law firm.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- lucide-react icons
- Centralized managed content in `data/admin-content.json`
- PHP 8 + MySQL admin authentication
- GitHub Actions deployment to Hostinger

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

The public site remains a static export. The `/admin/` dashboard uses small PHP endpoints on Hostinger for MySQL-backed authentication, appointment management, image uploads and GitHub publishing. Each publication commits `data/admin-content.json` to `main`; `.github/workflows/deploy-hostinger.yml` rebuilds the site and force-pushes the generated export to `hostinger`.

## Admin Setup

1. Create a MySQL database and database user in Hostinger.
2. Create a fine-grained GitHub token for `G-888/NRP-Website` with **Contents: Read and write** permission.
3. Copy `public/api/config.example.php` to `nrp-admin-config.php`, fill in the database, GitHub and site-origin values, then upload it one directory above `public_html`. Keeping it outside the public document root prevents deployments and web requests from exposing it. A local `public/api/config.php` fallback is also supported and ignored by Git.
4. Generate a long random `setup_key` in that configuration.
5. Open `/admin/`, enter the setup key and create the first admin account. The setup screen locks after the first account is created.

The GitHub token and database password stay in server-side PHP configuration. The browser receives only an HTTP-only session cookie and CSRF token.

Appointment submissions are stored in MySQL and appear in the admin inbox. The API attempts to send a notification through the hosting PHP mail service; a mail failure is recorded but never discards the enquiry. Set `notifications.appointment_email` in `nrp-admin-config.php` to override the default firm email address.

## Useful Commands

```bash
npm run typecheck
npm run lint
npm run build
npm run import:articles
```

## Pages

- `/`
- `/tentang-kami`
- `/bidang-amalan`
- `/peguam`
- `/artikel`
- `/hubungi-kami`
- `/temujanji`
- `/dasar-privasi`
- `/admin`

## Content And Assets

The site uses real firm information, contact details, lawyer profiles, articles and images from the existing Nuaim Razak & Partners website. Firm details, page headings, homepage content, services, lawyers, certificates, full article content and FAQs can be changed from `/admin/`.

Published articles are generated as internal static pages using their saved slug. The four legacy WordPress article slugs are preserved at the site root, included in the sitemap and rendered with `Article` structured data. New articles remain private drafts until the admin enables **Terbitkan artikel** and supplies a slug, summary and full content.

The appointment form validates input in the browser and stores enquiries in MySQL for the authenticated admin inbox. It also offers a pre-filled WhatsApp message as an optional follow-up channel.
