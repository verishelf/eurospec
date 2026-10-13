# EuroSpec Systems

Professional website for **EuroSpec Systems** — Precision Automotive Technology.

Built with [Next.js](https://nextjs.org) (App Router), TypeScript, and Tailwind CSS.

## Features

- Modern dark-theme landing page
- Services overview
- About / process section
- Contact form (ready to wire to your backend)
- Responsive navigation
- Brand logo integration

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for Production

```bash
npm run build
npm start
```

## Deploy

This project is ready for [Vercel](https://vercel.com):

1. Push this repo to GitHub (already done if you're reading this)
2. Import the project in Vercel
3. Deploy with zero configuration

## Project Structure

```
src/
  app/
    layout.tsx      # Root layout + metadata
    page.tsx        # Homepage
    globals.css     # Tailwind + theme tokens
  components/
    Navbar.tsx
    Footer.tsx
public/
  logo.png          # Add your logo here
```

## Customize

- Update contact details in `Footer.tsx` and the contact section
- Add `public/logo.png` (your EuroSpec logo)
- Wire the contact form to Formspree, Resend, or your API

---

© EuroSpec Systems
