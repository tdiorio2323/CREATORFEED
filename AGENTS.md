# Repository Guidelines

## Project Structure & Module Organization
- `components/` UI components and screens (e.g., `AuthScreen.tsx`, `DashboardScreen.tsx`, `Icons.tsx`, `Logo.tsx`).
- `services/` External integrations (e.g., `geminiService.ts` using `@google/genai`).
- `App.tsx` app routes and auth gating; `index.tsx` bootstraps React; `types.ts` shared types.
- `index.html`, `vite.config.ts`, `tsconfig.json` config. Build output in `dist/` (git-ignored).
- Co-locate small assets with components; import via relative paths or `@` alias (project root).

## Build, Test, and Development Commands
- `npm install` install dependencies.
- `npm run dev` start Vite dev server (hot reload).
- `npm run build` production build to `dist/`.
- `npm run preview` serve the built app locally.
- `npx tsc --noEmit` type-check the project.
- Env: add `.env.local` with `GEMINI_API_KEY=...` (required for Gemini features).

## Coding Style & Naming Conventions
- Language: TypeScript + React (functional components, hooks). Indent 2 spaces; include semicolons.
- Files: PascalCase for components (`Logo.tsx`), `*Screen.tsx` for routed screens, camelCase for vars/functions, PascalCase for types/interfaces.
- Keep UI components presentational; place API/SDK logic in `services/` and shared types in `types.ts`.
- Prefer explicit props types and narrow `any` usage. Use hooks over classes.

## Testing Guidelines
- No test runner configured yet. If adding tests, prefer Vitest + React Testing Library.
- Suggested conventions: `__tests__/` mirroring source, files named `*.test.tsx`.
- Aim to cover routing guards, service error paths, and critical UI states. Run `npm run build` and manual QA (`/login`, `/feed`).

## Commit & Pull Request Guidelines
- Use Conventional Commits (e.g., `feat:`, `fix:`, `chore:`) as seen in history.
- PRs: clear description, linked issue, and screenshots/GIFs for UI changes.
- Include setup notes for any env/config changes. Ensure `npm run build` passes.
- Do not commit `dist/` or `.env.local`.

## Security & Configuration Tips
- Keep `GEMINI_API_KEY` in `.env.local` only. Never log secrets.
- Vite exposes env via `vite.config.ts` defines; avoid leaking keys in UI or error messages.
- Handle missing/invalid keys gracefully (the service already warns and guards calls).

## Agent-Specific Instructions
- Scope: applies to the entire repository; nested AGENTS.md files take precedence.
- Keep changes minimal and consistent with existing patterns in `components/` and `services/`.
