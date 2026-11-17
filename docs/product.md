# Product: One More Dream

> Binding product description. Agents build from it; the owner resolves contradictions. Exact user-facing texts live in `src/content/`.

## Goal

A tiny browser fishing game that accompanies Oliver Züllig's application for a Senior Fullstack Engineer role at Spotify. The visitor casts a line, catches three items from Oliver's background and then the final message "My next dream: Working at Spotify." It is solved when a recruiter understands the page within five seconds, can finish it in 30–60 seconds, and can reach the same information without playing.

## Users and environment

Spotify recruiters and engineers, plus anyone viewing the public repository. Desktop and phone browsers (down to ~360 px wide), online. English only. No account, install or permissions.

## Scope

### Must (MVP)

- Landing: lake scene, title, subtitle, opening copy, `Cast the line` button and an always visible `Meet Oliver` button.
- Cast cycle: cast → bobber lands → nibble → reel meter (each click, tap or key press fills it, `BOOST` fills it at once, it also fills slowly on its own) → catch card with headline and story → cast again. No reflex or precision gates, no fail state.
- Exactly three normal catches without duplicates, then the final dream ticket on the fourth cast. Deterministic order in the MVP.
- Finale message as in the spec, followed by `Meet Oliver`, `View the code` and `Replay`. Never implies a job offer or endorsement.
- Profile panel ("Hi, I'm Oliver.") with a photo the owner supplies, reachable in one click from every state. Links to GitHub and LinkedIn from `src/content/links.json`; empty ones are hidden.
- All catch texts and copy live in `src/content/`, not in game logic.
- Accessibility: keyboard and touch, visible focus, live region announcing catches, `prefers-reduced-motion` shows results without decorative delay, controls at least 44×44 px.
- Original pixel art by the owner (PNG, sprite sheets in `src/art/`): lakeside background, animated fisherman, sky and water overlays, catches.
- Footer disclaimer: "An independent personal project by Oliver Züllig. Not affiliated with or endorsed by Spotify."
- Deployed on GitHub Pages; works on direct entry and refresh.
- Unit tests for reducer, catch order, finale and replay; one browser smoke test for the full flow and mobile layout.

### Later

- Versions for other companies: a neutral finale and per-company content, each version only visible to its company.
- Opt-in original sound effects (default off).
- Replay with a different catch order or the extra catches (AI duck, cabin).
- Tackle-box collection, rare `404` fish, social preview image.

### Explicitly not

- CV download, email address, phone number or home address on the site: the CV goes with the application, not onto a public page.
- Spotify logo, wordmark, green circle, music, album art or API.
- Analytics, cookies, tracking, backend, database, leaderboards.
- Multi-level game, physics simulation, game engine without a clear need.
- Invented skills, credentials or URLs.

## Constraints

- Static site, no runtime calls to third parties.
- All assets original.
- Making the repository public and publishing the site happen with the owner's go.

## Phases (become milestones)

| Phase                | Content                                                                                                                                   | Done when                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| M1 Playable skeleton | Scaffold, content catalogue, reducer, placeholder scene, cast/reveal controls, finale, replay, profile panel, keyboard and reduced motion | Full playthrough works with placeholder art; unit tests green |
| M2 Art and polish    | Owner's pixel art, reel meter, cast/splash/reveal animations, profile photo, favicon, responsive layout, final copy, disclaimer, meta tags                                     | Looks finished on phone and desktop                           |
| M3 Publish           | Playwright smoke test, Pages workflow, README, link check with the owner                                                                  | Live URL works including refresh; all links verified          |

## Open questions

- Real URLs for GitHub profile and LinkedIn (owner fills `src/content/links.json`).
