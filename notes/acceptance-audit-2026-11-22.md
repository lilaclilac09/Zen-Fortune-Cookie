# Acceptance audit — 2026-11-22

Scope: existing work at `origin/main` `5877fe4b249dad6840aab2903a031b3d002bf5f2`, all merged PRs returned by the paginated GitHub API, tracked documentation and UI. Only this repository's [ACCEPTANCE.md](../ACCEPTANCE.md) and the instructions it incorporates apply. Historical work is assessed against today's standard, not described as violating a rule that already existed at the time.

| # | Item | Fails rule | Source rule | Fix or not fixable |
|---|------|------------|-------------|--------------------|
| 1 | README had no product status or next human action | "Demo ≠ product"; "LIVE / BLOCKED / LOCAL ONLY + next human action in one line" | `ACCEPTANCE.md` §5, quoting `ship-visible-mvp.mdc` | Added LOCAL ONLY plus next human action. Pages API: HTTP 404; repository homepage: null; deployments API: empty. README's AI Studio URL returns HTTP 200 only after redirecting to Google sign-in, not a verified public product. |
| 2 | Existing app had no 390×844 still plus interaction evidence in tracked files or merged PRs | "no screenshots = not done"; "Screenshot at 390×844 **and** interaction proof" | `ACCEPTANCE.md` §4, quoting `ui-step-screenshot.mdc`; root `AGENTS.md` | Captured intact → click cookie → fortune/count 1 → Next Cookie → intact; reload retained count 1. Three 390×844 stills and a recording are linked below and in the prepared PR body. Camera-gesture proof is **not fixable in this environment**: browser reports `Requested device not found`; no camera or gesture results were simulated. |

## Verification

- GitHub API returned exactly one merged PR: [#1](https://github.com/lilaclilac09/Zen-Fortune-Cookie/pull/1), process files only. Its current body passes `python3 scripts/check_acceptance.py`; its merge SHA is an ancestor of `origin/main`. There are no merged UI PRs; the original UI predates the acceptance rollout.
- Read `README.md`, root `AGENTS.md`/`CLAUDE.md`, and `.cursor/rules/acceptance.mdc`. No additional English-only, privacy or results/job-ID rules are present. No results ledger was found. The static fortune game does not use the README's requested Gemini key.
- Forbidden-claim search found no unqualified completion claims in product code/docs; mandated prohibitions and source quotations in the acceptance rules are not product completion claims.
- `npm run build`: passed. No test or lint script exists in `package.json`.
- Local Chromium, actual app with no API/camera mocks: click/reset/reload flow passed at 390×844. Camera gestures remain unverified. This is local evidence, not production evidence.

## UI evidence

- [Intact, 390×844](https://app.devin.ai/attachments/dd280b5c-7aec-4354-8f10-2399d714973e/01-intact-390.png)
- [Fortune and count 1, 390×844](https://app.devin.ai/attachments/ead30067-c9dd-4e48-b092-73a4c7edeb25/02-fortune-390.png)
- [Reset, 390×844](https://app.devin.ai/attachments/3ca5122f-bb67-4c44-ac1b-af07ef2631de/03-reset-390.png)
- [Click → fortune → reset → reload recording](https://app.devin.ai/attachments/1f70dc91-2700-40f0-9c5d-3925308c803d/click-reset-reload.webm)

| blocked_on | evidence | impact | human_action | not_doing |
|------------|----------|--------|--------------|-----------|
| Camera hardware for gesture verification | Chromium `Requested device not found` | degraded: click path captured; gesture path unverified | Open locally with a real camera, allow access and record the two-hand gesture | No synthetic gesture evidence or claim of production verification |

Passed: merged PR #1's closer; merge ancestry; no unsupported result claims found; build and local click/reset/persistence flow. Existing instructions and product implementation preserved.

Observed, no rule covers it: mobile broken-cookie art extends beyond the viewport; emoji glyph availability depends on the browser environment; README asks for a Gemini key despite no key use in the current app. No layout, font or setup redesign was made.
