# Copilot Instructions – Portfolio 2025

## Architecture Overview

This is a **Next.js 14 App Router** portfolio site with:

- **Prisma + Turso/SQLite** as the database layer (replaces file-based Contentlayer)
- **Route Groups**: `(site)` for public pages, `(admin)` for admin dashboard
- **Content pattern**: Database-first with JSON/MDX fallback in `content/`

### Key Data Flow

1. **Database** → `lib/db.ts` (Prisma client with LibSQL adapter)
2. **Loaders** → `lib/content/loaders.ts` (raw Prisma queries, type definitions)
3. **Hooks** → `lib/content/hooks.ts` (React `cache()` wrapped for SSR deduplication)
4. **Components** → Import from hooks, never directly from loaders

## Developer Commands

```bash
pnpm dev          # Start dev server (auto-runs prisma generate via postinstall)
pnpm build        # Runs typecheck + lint before build
pnpm lint         # ESLint with zero warnings allowed
pnpm typecheck    # TypeScript validation
pnpm format       # Prettier (Tailwind plugin auto-sorts classes)
```

**Database**: uses Turso (env: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`)

## Code Patterns

### Component Structure

- **UI primitives** in `components/ui/` – use `cva()` for variants, `cn()` for class merging
- **Section components** in `components/sections/{page}/` – receive typed props from hooks
- Always use `@/` path aliases (configured in `tsconfig.json`)

```tsx
// Pattern: Section component with typed content
import { getProfile } from "@/lib/content/hooks";
import { cn } from "@/lib/utils";

export async function Hero() {
  const profile = await getProfile(); // React-cached
  return <section className={cn("relative", className)}>...</section>;
}
```

### API Routes (Admin)

- Located at `app/api/admin/{resource}/route.ts`
- Use shared auth from `app/api/admin/_shared.ts`: `validateAuth()`, `unauthorized()`, `prisma`
- Pattern: Bearer token auth via `ADMIN_PASSWORD` env var

```typescript
import { prisma, validateAuth, unauthorized } from "../_shared";

export async function GET(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();
  // ... Prisma query
}
```

### Styling Conventions

- CSS variables defined in `app/globals.css` (HSL format: `--primary: 32 94% 48%`)
- Use semantic tokens: `bg-background`, `text-foreground`, `text-muted-foreground`
- Dark mode via `.dark` class (CSS variables swap automatically)
- Tailwind config extends with `shadow-soft`, custom container padding

### Content Types

- **Projects**: MDX files in `content/mdx/projects/` with YAML frontmatter
- **Structured data**: JSON in `content/json/` (profile, skills, experience)
- All content types defined in `lib/content/loaders.ts` and `types/content.ts`

## Dynamic Rendering

Pages using database content must export:

```tsx
export const dynamic = "force-dynamic";
```

## Validation

- Use **Zod** for API request validation (see `app/api/contact/route.ts`)
- Prisma types for database operations
- Content interfaces in `lib/content/loaders.ts`

## File Naming

- Components: `PascalCase.tsx`
- API routes: `route.ts`
- Content: `kebab-case.json` / `kebab-case.mdx`
- Utilities: `camelCase.ts`
