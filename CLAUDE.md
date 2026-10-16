# JNV Studio — rules for coding assistants

Showcase site + installable app for **PM SHRI School JNV Serchhip, Thenzawl**
(Mizoram). Class 7–9 students publish HTML games and Gemini-made songs.
Visitors play/listen free with no login. Hidden admin panel manages content.

@AGENTS.md

## Stack
- Next.js 16 (App Router, TypeScript strict), Tailwind CSS v4
- Supabase (Postgres + Storage), region Mumbai
- Deployed to **Cloudflare Workers** via `@opennextjs/cloudflare`
  (`pnpm preview` to test the Worker build locally, `pnpm deploy`)
- No `proxy.ts`/middleware: admin pages are guarded in `app/admin/(panel)/layout.tsx`
  and every admin route/action calls `requireAdmin()`.

## Rules
- Audience: children aged 11–15 on cheap Android phones over 4G.
  Mobile-first, simple, touch targets ≥ 48px, icon + text labels.
- Performance: Lighthouse mobile ≥ 95. Server Components by default; client
  components only where interaction needs it. Dynamic-import heavy libs
  (Monaco, cropper). Covers are pre-sized WebP made in the browser at upload,
  so `images.unoptimized` is on. No layout shift.
- Security:
  - Student game HTML is served only from `/g/[slug]` (and the admin
    preview page `/gp`) with a `Content-Security-Policy: sandbox ...` header,
    and embedded in `<iframe sandbox="allow-scripts ...">`. Never add
    `allow-same-origin`, never inject game HTML into our own pages.
  - Admin password exists only as a PBKDF2 hash in env
    (`ADMIN_PASSWORD_HASH`). Never in client code.
  - All writes go through server code using the service-role key
    (`lib/supabase/admin.ts`, `import "server-only"`).
  - Supabase RLS: anon can read published rows only.
- Privacy: students shown as first name/nickname + class only.
- Design: dark theme; use tokens in `app/globals.css`, never hardcode colors.
- Code: small components, zod for input validation, no unused deps.
- Work in phases; after each phase list what to test manually.
