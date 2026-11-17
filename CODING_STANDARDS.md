# Coding standards

Read by `/code-review` (Standards axis). Only judgement calls belong here: rules a linter, formatter, type checker or test can enforce go into that tool instead. Every rule names its reason. Remove rules that no longer catch anything.

## Game and UI

- Game state changes only through the pure reducer in `src/game/`; animations and timers dispatch actions, they never decide outcomes. _Why: the flow stays testable and works with reduced motion._
- Copy and catch texts live in `src/content/`, never inline in components or game logic. _Why: the owner edits texts in one place._
- Primary actions are real `<button>`s or links; SVG is decoration with `aria-hidden` unless it carries meaning. _Why: keyboard and screen-reader access without extra work._
- No Spotify logo, wordmark, lookalike colours, music or API. _Why: trademark; the project must not look endorsed._

## Design

- Prefer deep modules: a small interface hiding a lot of behaviour. Don't add a layer that only forwards calls. _Why: shallow layers make change expensive for humans and agents alike._
- Put domain logic where it can be tested without UI, network or filesystem. _Why: fast, deterministic tests at the seams._

## Errors and boundaries

- Validate input at system boundaries (user input, files, network, external service responses); trust it inside. _Why: one place to get it right._
- Don't swallow errors. Either handle them meaningfully or let them surface with context. _Why: silent failures cost the most debugging time._

## Tests

- Test external behaviour through the public interface, not implementation details. _Why: refactors shouldn't break tests._
- No real external service (paid API, language model, network) in automated tests; use fakes with named scenarios. _Why: cost, flakiness, privacy._
