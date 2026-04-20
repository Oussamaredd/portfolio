# AGENTS.md

## Purpose
This repository is a React + Vite + Tailwind portfolio with a custom interactive constellation background.

Any future edits must preserve the current interaction model and visual structure unless the user explicitly asks to redesign those parts.

## Stack
- React 18
- Vite
- Tailwind CSS
- Custom canvas animation in `src/components/CyberBackground.jsx`

## Change Discipline
- Default to the smallest safe change set.
- Do not rewrite layout, scroll orchestration, navigation wiring, background logic, or GitHub API wiring unless the user explicitly asks for that scope.
- If a task touches shared structure, keep these files aligned:
  - `src/pages/HomePage.jsx`
  - `src/components/DesktopSidebar.jsx`
  - `src/data/siteContent.js`
  - `src/index.css`
- Every handoff must document:
  - which files changed
  - whether behavior changed or was intentionally preserved
  - which checks were completed or intentionally not run

## Non-Negotiable Behavior

### Desktop scrolling
- Desktop layout is intentionally split into two independent scroll panes.
- The left pane is the desktop sidebar index.
- The right pane is the content pane.
- Do not collapse desktop back to one global page scroll unless the user explicitly asks for that change.
- Keep the wheel handoff behavior in `src/pages/HomePage.jsx`.
  - When one pane reaches its scroll limit, wheel scrolling should continue into the other pane.
  - This currently depends on `applyScrollDelta`, `handleDesktopMainWheel`, and `handleDesktopSidebarWheel`.
- Keep desktop shell behavior:
  - outer desktop wrapper uses viewport height
  - desktop root uses `overflow-hidden`
  - left and right panes each use their own `overflow-y-auto`

### Desktop navigation/index
- The left side is the main section index on desktop.
- Preserve the current left-nav pattern:
  - thin horizontal line
  - uppercase section label
  - active item highlighted with the accent color
  - social icons anchored near the bottom
- `navItems` in `src/data/siteContent.js` must stay aligned with real section IDs.
- Hash navigation must continue to work.
- Active section tracking must keep working while the right pane scrolls.

### About section placement
- On desktop:
  - the left pane contains profile summary and section index only
  - the full About content lives in the right content pane
- Do not duplicate the long About copy on both sides.
- On mobile, About stays in the normal content flow.

### Mobile scrolling
- Mobile uses normal page scrolling.
- Do not introduce desktop-style split panes on mobile.
- Keep the mobile nav fixed at the top.

## Visual Structure Rules

### Background
- Keep the custom constellation / linked-particle canvas background.
- Do not replace it with a generic library unless the user explicitly approves that change.
- Preserve:
  - linked particles
  - cursor repulsion / disturbance
  - reconnect behavior after cursor movement
  - reduced-motion fallback
- The background must remain a visible part of the portfolio identity.

### Transparency and layout surfaces
- Do not add opaque page-level wrappers, glass panels, or heavy section cards around the main desktop layout unless the user explicitly asks for them.
- Current intent:
  - top-level wrappers stay visually transparent
  - background remains visible through the layout
  - content should not block the theme more than necessary
- The shared classes in `src/index.css` are intentionally flattened right now:
  - `.panel`
  - `.section-shell`
  - `.section-card`
- If these are changed, confirm that the background is still clearly visible behind the content.

### Content density
- Keep text readable, but do not let copy become so large or dense that it overwhelms the background.
- Before increasing text size, spacing, or content width, check that the background still reads as a deliberate design feature.

## Structural Dependencies
- Section navigation and active tracking rely on:
  - `data-section` attributes on section containers
  - matching heading IDs such as `#about`, `#experience`, `#projects`, etc.
- If a section is renamed or moved, update both:
  - `src/data/siteContent.js`
  - the corresponding section ID / `data-section`
- `src/components/DesktopSidebar.jsx` and `src/pages/HomePage.jsx` must stay in sync.

## Background Ownership
- Background logic lives in `src/components/CyberBackground.jsx`.
- Layout and scroll orchestration live in `src/pages/HomePage.jsx`.
- Left desktop index behavior lives in `src/components/DesktopSidebar.jsx`.
- Shared visual rules live in `src/index.css`.

## GitHub Activity
- `src/components/GitHubSection.jsx` is currently a placeholder, not a real integration.
- Do not describe it as working until a real data source is implemented.

## Secrets And Deployment Safety

### Environment files
- Never commit real credentials, tokens, API keys, or copied dashboard values into the repository.
- `.env`, `.env.*`, and `.vercel/` must stay ignored. `.env.example` is the only env template that may be committed.
- `.env.example` may contain variable names and placeholder values only.
- When adding or renaming environment variables, update `.env.example` in the same change.
- If git metadata is unavailable locally, say clearly that current history leakage cannot be verified from this workspace.

### Public vs server-only envs
- Only intentionally public client-side configuration may use the `VITE_` prefix.
- Never expose `GITHUB_TOKEN` or any other secret through:
  - `VITE_*`
  - `import.meta.env`
  - `src/`
  - `public/`
  - `dist/`
  - hardcoded fetch headers, query strings, logs, screenshots, or docs
- Secrets must stay server-only and be read from runtime env via `process.env` inside server paths such as:
  - `api/`
  - `server/`
  - server-only Vite middleware

### GitHub and Vercel work
- For GitHub integration, the React client may consume only sanitized API responses. It must never receive raw tokens.
- Missing or invalid secret configuration must fail gracefully without breaking the rest of the portfolio.
- For Vercel deployment, store secrets in Vercel project environment settings, not in repository files.
- Do not commit `.vercel/project.json`, local Vercel state, downloaded API payloads, or captured secret-bearing logs.

## Validation
- Do not run `npm run build` after every prompt by default.
- Run the build only if the user explicitly asks for it, or if the change directly targets build, deployment, or runtime config and build validation is necessary.
- If build validation is skipped, say that explicitly in the final handoff.
- After any change that affects layout, scrolling, navigation, section IDs, background rendering, GitHub integration, env handling, or deployment wiring, verify the relevant checks below.
- Manually verify on desktop:
  - left and right panes scroll independently
  - wheel handoff works in both directions
  - active nav state updates correctly
  - hash navigation still lands on the intended section
- Manually verify on mobile:
  - single-page scroll still works
  - fixed mobile nav still works
  - content does not overlap the background in a broken way
- Verify for env / deployment work:
  - `.gitignore` still protects local env and Vercel files
  - `.env.example` matches the expected env contract without real values
  - no secret moved into client-visible code or static assets
