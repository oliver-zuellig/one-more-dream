# One More Dream

Instructions for coding agents working on One More Dream, a tiny browser fishing game (Vite, React, TypeScript) that accompanies Oliver Züllig's application to Spotify. Static site on GitHub Pages.

If `AGENTS.local.md` exists, read it too: it holds the owner's local workflow (skills, hooks, issue process) and is not part of the repository.

- **What to build:** `docs/product.md` (binding). If it contradicts an issue, ask the owner.
- **How it is built:** the ADRs in `docs/adr/`.
- **Code conventions:** `CODING_STANDARDS.md`.

## Commands

| Purpose                     | Command                                       |
| --------------------------- | --------------------------------------------- |
| Install                     | `npm ci`                                      |
| Test                        | `npm test`                                    |
| Static checks (types, lint) | `npm run typecheck`, `npm run lint`           |
| Format                      | `npm run format` (check: `npm run format:check`) |
| Build / run                 | `npm run build` / `npm run dev`               |

Run the checks one after the other, not in parallel. Test and static checks must pass before a commit.

`.githooks/checks` lists the same checks; `but push` and `but pr new` run them through `.githooks/pre-push` (GitButler runs no pre-commit hooks). Never skip it with `--no-hooks` unless the owner says so.

## Communication

- Answer the owner in the language they write in, short and direct. Code, comments, commit messages, issues, PRs and docs are in English.
- When a decision belongs to the owner (scope, UX, product trade-offs, anything irreversible), ask with a recommendation instead of guessing.
- Report honestly: if a check fails or was skipped, say so. List what only a human can verify as "Manual checks for the owner".

## Version control: GitButler

- Use `but` for every version-control write (commit, branch, amend, push, pull, PR). Read-only `git log/show/blame/diff` is fine. Load the GitButler skill for syntax.
- Several agents may share this checkout. Commit only your own changes; never touch another agent's branch or uncommitted work.
- One branch per session or issue: `issue-<N>-<slug>`, otherwise `<topic>-<slug>`.
- Commit messages and PR descriptions are short and precise. No boilerplate footers.
- Commit messages: what changed, why, important decisions. Reference issues as `(#N)`. Keep tests in the commit with the behaviour they verify. Amend small follow-up fixes into the unpublished commit they belong to.
- Push and open PRs only as part of the issue workflow or when asked. Merge only when the owner says so for that PR.

## Working rules

- Tests first at the agreed seams. Tests check external behaviour and never call a real external service (paid API, language model, network): use fakes.
- Keep the diff inside the task's scope. Anything else you notice becomes a new issue.
- Never read, print or commit secrets (`.env*`, keys, tokens). Configuration goes through environment variables with a committed `.env.example`.
- Throwaway work (spikes, reviews, drafts, logs) goes to `.scratch/` (gitignored), never into `docs/`.
