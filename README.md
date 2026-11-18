# One More Dream

A little fishing game about big dreams. Cast a line, catch a few pieces of my story, and find the one more dream at the end.

An independent personal project by Oliver Züllig. Not affiliated with or endorsed by Spotify.

## Run locally

Requires Node 24 (see `.nvmrc`).

```sh
npm ci
npm run dev       # http://localhost:5173/one-more-dream/
npm test
npm run test:e2e  # browser smoke test (first: npx playwright install chromium)
npm run build
```

Texts and catches live in `src/content/`.

## How this was built

I built this with AI coding agents in a deliberately structured workflow: a binding product description (`docs/product.md`), architecture decisions (`docs/adr/`), coding standards, test-first changes, a pre-push quality gate (`.githooks/`) and one reviewed pull request per issue. `AGENTS.md` is the brief the agents work from. Every change was reviewed and decided by me.
