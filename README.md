# Portfolio 2025

A modern personal portfolio for showcasing projects, professional experience, and contact capabilities. The site is built with **Next.js 14**, **TypeScript**, **Contentlayer**, and **Tailwind CSS**, and ships production-ready configurations for linting, formatting, and deployment on Vercel.

---

## ✨ Highlights

- **App Router + Server Actions**: Uses the latest Next.js features for routing and form handling.
- **Structured content**: Contentlayer consumes JSON and MDX so projects, experience, and skills stay versioned and type-safe.
- **Responsive design system**: Tailwind CSS with custom UI components provides consistent styling and theming.
- **DX tooling**: ESLint, Prettier, Husky, and lint-staged keep the codebase clean on every commit.
- **Ready for Vercel**: Includes `vercel.json` and edge-friendly API routes for deployment.

---

## 📁 Project Structure

```
app/                   # Next.js App Router pages, layouts, API routes
components/            # Reusable UI and section components
content/               # JSON + MDX source content consumed by Contentlayer
lib/                   # Shared utilities and Contentlayer loaders/schemas
public/                # Static assets (images, favicon, etc.)
scripts/               # Deployment and diagnostics utilities
```

Supporting configuration lives at the repository root (`tailwind.config.ts`, `contentlayer.config.ts`, `postcss.config.mjs`, etc.).

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18.18+** (Next.js 14 requirement)
- **pnpm 8+** (configured via `pnpm-workspace.yaml`)
- Recommended: clone over SSH for Husky Git hooks

### Install Dependencies

```powershell
pnpm install
```

### Environment Variables

Copy `.env.example` as a starting point:

```powershell
Copy-Item .env.example .env.local
```

Populate the values as needed (e.g., SMTP credentials for contact form delivery).

### Run the Development Server

```powershell
pnpm dev
```

The app will be available at <http://localhost:3000>. Hot reloading is enabled by default.

---

## 🧱 Content Management

- `content/json` holds structured data for profile, skills, experience, and feature toggles.
- `content/mdx/projects` contains long-form project case studies. Frontmatter is typed by Contentlayer schemas in `lib/contentlayer/schemas.ts`.
- Update content, run `pnpm contentlayer:build` (via Next.js dev/build scripts) if you need to regenerate type definitions.

Content changes are picked up automatically in development via the Contentlayer watcher.

---

## 🧪 Quality Checks

| Command          | Description                                         |
| ---------------- | --------------------------------------------------- |
| `pnpm lint`      | Runs ESLint with the repository ruleset.            |
| `pnpm format`    | Applies Prettier formatting rules.                  |
| `pnpm typecheck` | Validates TypeScript types without emitting output. |
| `pnpm test`      | Placeholder for future Jest/Vitest suites.          |

Husky pre-commit hooks execute `lint-staged` to lint and format staged files. To bypass hooks temporarily, run with `HUSKY=0`.

---

## 📦 Build & Deploy

### Production Build

```powershell
pnpm build
```

### Start Preview Server

```powershell
pnpm start
```

### Deploying

1. Push changes to the `chore/cleanup-no-plausible` branch (or your feature branch).
2. Vercel will build using the default configuration. Ensure environment variables are configured in the Vercel dashboard.
3. Monitor deployment logs for Contentlayer build output and contact API route validation.

---

## 🔧 Scripts Reference

- `pnpm dev`: Start the local development server.
- `pnpm build`: Generate a production build.
- `pnpm start`: Serve the production build locally.
- `pnpm lint`: Run ESLint across the repo.
- `pnpm format`: Format code with Prettier.
- `pnpm typecheck`: Run TypeScript in project-references mode.

Additional util scripts live in `scripts/` and can be invoked via `pnpm exec tsx path/to/script.ts`.

---

## 🤝 Contributing

1. Create a feature branch off `main` or the active chore branch.
2. Make your changes and ensure `pnpm lint` and `pnpm build` succeed.
3. Commit with conventional commit messages where possible.
4. Submit a pull request with notes on any new environment variables or scripts.

---

## 🗺️ Roadmap Ideas

- Add automated tests for API routes and Contentlayer loaders.
- Introduce dark/light theme toggles driven by `content/json/toggles.json`.
- Integrate analytics (Plausible, Umami, etc.) via first-party scripts.

---

## 📄 License

This project is proprietary to ThanhJamie. Reach out before reusing code or assets.
