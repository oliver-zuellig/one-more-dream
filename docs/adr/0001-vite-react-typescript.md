# 0001: Vite, React and TypeScript with SVG/CSS animation

## Context

One More Dream is a four-cast browser game that must load fast, work on phones, be fully accessible and deploy as a static site to GitHub Pages. It is also a work sample for a Senior Fullstack Engineer application, so the code itself is read.

## Decision

Vite + React + TypeScript (strict). Game logic is a pure reducer; animations are SVG and CSS and never drive state. No game engine. Vitest + React Testing Library for unit and component tests, Playwright for one browser smoke test. ESLint and Prettier for static checks and formatting. npm with `package-lock.json`; Node version pinned in `.nvmrc`. GitHub Actions builds and deploys to Pages.

## Consequences

Small bundle and familiar tooling. Accessibility comes from plain HTML controls instead of a canvas. Rich physics or many sprites would need a rethink, which the scope rules out. The Vite `base` must match the repository name (`/one-more-dream/`).
