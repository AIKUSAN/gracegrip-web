# UI Standards — GraceGrip WebApp

## Design Philosophy: "Calm UI"

GraceGrip uses a grace-first, trauma-informed design language. Every visual element should communicate safety, warmth, and encouragement.

**Rules:**
- Never use shame-spiral language (e.g., "You failed", "streak broken", "days wasted").
- Always frame setbacks with grace (e.g., "Every new moment is a fresh start").
- Avoid aggressive colors (red warnings, harsh alerts) in recovery contexts.
- Prefer soft transitions and gentle animations over abrupt state changes.

## Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Primary | Warm teal | `#305f4f` |
| Secondary | Amber | `#eadcc8` |
| Background | Cream | `#f6f1e9` |

CSS custom properties are defined in `app/globals.css`:
- `--background`, `--foreground`, `--primary`, `--secondary`, `--accent`, `--muted`, etc.
- Dark mode overrides are scoped under the `.dark` selector.

## Design Tokens

All tokens defined in `app/globals.css` with dark mode variants in `:root.dark`.

| Group | Tokens |
|-------|--------|
| Page | `--bg` (cream), `--bg-strong` (amber), `--card` |
| Text | `--ink` (dark), `--ink-soft` (muted) |
| Brand | `--brand` (teal), `--brand-strong`, `--accent` (amber) |
| Borders | `--line`, `--calm-line` |
| Calm palette | `--calm-sage`, `--calm-sage-strong`, `--calm-slate`, `--calm-cream`, `--calm-card` |
| Panic palette | `--panic-action` (`#8d5e62`), `--panic-action-strong` (`#754a4e`) |
| Feedback | `--danger` (`#992d2d`) |

## Font Stack

| Role | Family | Weight | Loading |
|------|--------|--------|---------|
| Display / Scripture | Libre Baskerville | 400, 700 | `next/font/google` — self-hosted at build |
| Body / UI | Manrope | 400–800 | `next/font/google` — self-hosted at build |

CSS variables: `--font-serif` (Libre Baskerville), `--font-sans` (Manrope).
Set on `<html>` via class injection in `app/layout.jsx`.

**No runtime Google Fonts requests.** The CSP (`font-src 'self'`) enforces this.

## Dark Mode

- Three modes: `light`, `dark`, `system` (follows `prefers-color-scheme`).
- Toggled via `.dark` class on `<html>` (Tailwind `@custom-variant dark`).
- Theme preference persisted in `appState.themePreference` via localStorage.

## Icons

- **Lucide React** — primary icon library.
- **Tabler Icons** — configured as the shadcn/ui icon library in `components.json` (`iconLibrary: "tabler"`).
- Prefer Lucide for app UI; Tabler icons come in via shadcn components.

## Animation

- **Motion** (Framer Motion v12) — use the `motion` namespace for animated components.
- `AnimatedGroup` (`src/components/ui/animated-group.jsx`) — group entrance animations.
- `TextEffect` (`src/components/ui/text-effect.jsx`) — text reveal animations.
- Prefer subtle, purpose-driven animation. Avoid gratuitous motion.
- Respect `prefers-reduced-motion` where possible.

## Toast Notifications

- **Sonner** — toast notification library (`sonner` v2).
- `<Toaster position="bottom-center" richColors />` mounted in `app/layout.jsx`.
- Use `toast()`, `toast.success()`, `toast.error()` from `sonner` for all user feedback.
- Do not use browser `alert()` or custom notification components.

## Assets

- All production assets in `public/` are **SVG only** — no raster images (PNG, JPG, WebP).
- `public/logo.svg` (121.5 KB) is the largest asset; consider `svgo` if optimization is needed.
- Verse category art lives in `public/verse-art/` (mapped via `src/lib/verseArt.js`).

## shadcn/ui Configuration

Configured via `components.json`:
- Style: `maia`
- Language: JSX (not TSX)
- Icon library: Tabler
- Base color: neutral
- CSS variables: enabled
- Path aliases: `@/components`, `@/lib`, `@/hooks`, `@/components/ui`

## CSS Component Patterns (Phase 1+2)

These conventions were established during the backup/QR feature build and must be followed for any new feature CSS.

### Warning colors
- **Non-critical warnings** (size limits, soft cautions): amber via `color-mix(in srgb, var(--brand) 50%, #b26d2f)` — never use `var(--danger)` for warnings that don't indicate data loss or errors.
- **`var(--danger)`** (`#992d2d`) is reserved for destructive actions only (e.g., delete, wipe).

### Tab / action row gaps
- `.actions-row`, tab groups: use `gap: 0.6rem` to match the established spacing rhythm.
- Never use `gap: 0.5rem` for flex rows containing buttons or tabs.

### Visibility toggling
- Always toggle visibility via CSS class (e.g., `.element--hidden { display: none; }`) not inline `style={{ display: ... }}`.
- This keeps React render output clean and makes styles themeable/overridable.
- Pattern: `` className={`qr-canvas${condition ? ' qr-canvas--hidden' : ''}`} ``

### CSS class naming for feature blocks
- Feature-scoped CSS uses a BEM-like block prefix: `.backup-*`, `.qr-*`, `.legacy-settings-*`
- Every class referenced in JSX **must** be defined in `app/globals.css` — no ghost classes.
- Empty placeholder rules (e.g., `.legacy-settings-screen { }`) are acceptable to document the namespace and prevent lint confusion.

### Responsive canvas / QR
- Full-width canvas: `width: 100%; max-width: 100%`
- Mobile override at `@media (max-width: 520px)`: `max-width: 240px` to prevent oversized QR on small screens.
