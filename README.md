# Colruyt UI

A modern, feature-rich web application that provides an enhanced browsing experience for Colruyt products and promotions. Built with SvelteKit and Svelte 5, it offers filtering, searching, favourites, dark mode, and multilingual support — all deployable to Cloudflare Pages.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Linting & Formatting](#linting--formatting)
- [Project Structure](#project-structure)
- [Internationalization (i18n)](#internationalization-i18n)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Features

- 🛒 Browse and search Colruyt **products** and **promotions**
- 🔍 Advanced **filtering** and **sorting** on product lists
- ❤️ **Favourites** — save products for quick access
- 🌙 **Dark mode** toggle
- 🌐 **Multilingual** — Dutch (NL), French (FR), and English (EN)
- ⚡ **Skeleton loaders** and lazy-loaded images for fast perceived performance
- 📱 **Progressive Web App (PWA)** support for offline use
- 🔗 **Social sharing** for products and promotions
- ♿ Accessibility-first UI

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [SvelteKit 2](https://kit.svelte.dev) + [Svelte 5](https://svelte.dev) |
| Language | TypeScript |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| UI Components | [Flowbite Svelte](https://flowbite-svelte.com) |
| Testing | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com/docs/svelte-testing-library/intro) |
| Linting | [ESLint](https://eslint.org) + [Prettier](https://prettier.io) |
| Deployment | [Cloudflare Pages](https://pages.cloudflare.com) |

---

## Prerequisites

Make sure you have the following installed before getting started:

- **Node.js** 20 or newer recommended
- **npm** a recent version compatible with your installed Node.js release

Verify your versions:

```bash
node --version
npm --version
```

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Merilairon/colruyt-ui.git
   cd colruyt-ui
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

---

## Development

Start the local development server with hot-module replacement:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

To automatically open it in your browser:

```bash
npm run dev -- --open
```

To run TypeScript type-checking alongside development (in a second terminal):

```bash
npm run check:watch
```

---

## Building

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally before deploying:

```bash
npm run preview
```

> **Note:** The local `build` script uses Windows-specific syntax to set `CF_PAGES=1`. On Cloudflare Pages (Linux), set the build command to `CF_PAGES=1 npm run build` so the Cloudflare Pages adapter is activated correctly. If you need to target a different deployment environment, update the adapter in `svelte.config.js`. See [SvelteKit adapters](https://kit.svelte.dev/docs/adapters) for more information.

---

## Testing

Run the test suite using Vitest:

```bash
# Run tests once
npm test

# Run tests with an interactive UI
npm run test:ui
```

Tests are co-located with the source files under `src/` and follow the `*.test.ts` / `*.spec.ts` naming convention. The test environment is JSDOM with `@testing-library/svelte` for component testing.

---

## Linting & Formatting

Check for lint and formatting issues:

```bash
npm run lint
```

Auto-fix formatting issues with Prettier:

```bash
npm run format
```

Run TypeScript / Svelte type-checking:

```bash
npm run check
```

---

## Project Structure

```
colruyt-ui/
├── src/
│   ├── lib/
│   │   ├── components/       # Reusable Svelte components
│   │   │   ├── FilterPopup.svelte
│   │   │   ├── FilterManagerPopup.svelte
│   │   │   ├── Pagination.svelte
│   │   │   ├── ProductCard.svelte
│   │   │   ├── ProductsOverview.svelte
│   │   │   ├── PromotionCard.svelte
│   │   │   ├── Share.svelte
│   │   │   ├── SkeletonCard.svelte
│   │   │   └── StateDisplay.svelte
│   │   ├── i18n.ts           # i18n initialisation
│   │   ├── slugify.ts        # URL slug helpers
│   │   └── index.ts          # Library exports
│   ├── locales/              # Translation files (en, fr, nl)
│   ├── params/               # SvelteKit parameter matchers
│   ├── routes/               # File-based routing
│   │   ├── +layout.svelte    # Root layout (Navbar, Footer, theme)
│   │   ├── +page.svelte      # Home page (promotions/products overview)
│   │   ├── products/         # Product list and detail pages
│   │   ├── promotions/       # Promotion list and detail pages
│   │   ├── favourites/       # Saved favourites page
│   │   └── changes/          # Price changes page
│   ├── stores/               # Svelte stores (filters, favourites, …)
│   ├── app.css               # Global styles
│   └── app.html              # HTML shell
├── static/                   # Static assets (favicon, images, PWA manifest)
├── svelte.config.js          # SvelteKit configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── vite.config.ts            # Vite configuration
├── vitest.config.ts          # Vitest configuration
└── package.json
```

---

## Internationalization (i18n)

The application supports three languages out of the box:

| Code | Language |
|------|----------|
| `nl` | Dutch |
| `fr` | French |
| `en` | English (default) |

Translation files are located in `src/locales/`. The active locale can be switched from the navigation bar. Adding a new language requires:

1. Creating a new JSON file in `src/locales/` (e.g., `de.json`).
2. Registering the locale in `src/lib/i18n.ts`.

---

## Deployment

This project can be deployed to **Cloudflare Pages**. With the current SvelteKit setup, the deployment target is detected automatically in the Cloudflare environment via `@sveltejs/adapter-auto`.

To deploy manually:

1. Build the project:

   ```bash
   npm run build
   ```

2. Deploy the generated output to Cloudflare Pages using the Cloudflare dashboard or the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/).

For automatic deployments, connect the repository to a Cloudflare Pages project and set the following build settings:

| Setting | Value |
|---------|-------|
| Build command | `CF_PAGES=1 npm run build` |
| Build output directory | `.svelte-kit/cloudflare` |

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository and create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes, ensuring they pass all checks:

   ```bash
   npm run lint && npm run check && npm test
   ```

3. Commit your changes with a descriptive message and open a pull request against `main`.

Please keep PRs focused on a single concern and include a clear description of what was changed and why.
