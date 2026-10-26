# Running Pupil PH

## Local development and checks

Use the installed Node/npm toolchain from the project root. Runtime dependencies are **React and React DOM only**. No backend, CDN, font server, external audio, account service or API key is needed.

```sh
npm run dev                         # loopback development server; no development service worker
npm test                            # Vitest, including source-fidelity and integration regressions
npm run build                       # unchanged pipeline: tsc -b && vite build
npm run check:budget                # requires dist/ from the build
npm run preview -- --port 4173      # production build on 127.0.0.1
npm run test:e2e                     # starts/stops its own loopback preview on port 4173
```

Stop a manually started preview before running e2e: the e2e server uses strict port ownership and will not reuse an unrelated process. Tests use installed Chromium at `/home/siru/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`. On another provisioned host, set `CHROMIUM_PATH=/absolute/path/to/chrome` for the browser checks. No browser or dependency installation was performed during integration.

Vitest includes `tests/**/*.test.{ts,tsx}` only; browser `.spec.ts` tests live in `tests/e2e/`. The two existing opt-in computed-style tests remain skipped by default; their specifically host-owned commands were not run by integration. The independent full-app e2e suite checks computed stage backgrounds and actual input geometry instead. `tests/B/vitest.config.ts` is the retained **isolated-lane** alias configuration; do not use it for integrated acceptance. Bare `npm test` uses real module imports.

## Demo school

First launch seeds `MABINI-01` and four remembered cards when no school exists. These are public demonstration credentials, not private classroom accounts:

| Account | Grade/skin | Public demo PIN |
|---|---|---|
| Aya Cruz | Preschool / Playful | 1111 |
| Joshua Dizon | Lower elementary / Guided | 2222 |
| Bea Ramos | Upper elementary / Dashboard | 3333 |
| Mark Santos | High school / Studio, Foundations initially on | 4444 |
| Teacher / Parent Access | Local administration | 1234 |

Tap a card and enter four digits using the physical keyboard or keypad. Backspace corrects a digit; Escape closes the modal. Incorrect PIN feedback is deliberately gentle. The keypad is at least 64×64 CSS pixels. Mark's **Start from Basics** switch and **Alt+F** change the course without changing the mature Studio theme. All six typing stages remain available through the drill selector.

Teacher access manages students, grades, Foundations, PIN resets, group names, local progress and remembered cards. Existing PINs cannot be recovered or displayed: set a replacement. Deletion removes the account and its local progress/queued writes. Removing a remembered card is different: it removes quick login, not the account. A new immutable group code is created/selected through the school gate; renaming changes its display name, not a roster migration.

## Local-only privacy and saves

**Local save** means this browser/device only. Progress writes to localStorage and IndexedDB. Offline completions queue durable local reconciliation; reconnecting drains that queue into local IndexedDB. Nothing is sent to a school or cloud endpoint. Clearing site data, private-mode expiration, browser storage eviction or losing the device can lose accounts and work. No backup/export/server recovery is implied.

Student/teacher credentials use salted PBKDF2-SHA256 (10,000 iterations); plaintext PINs are not persisted. Four-digit local PINs are a shared-device convenience, not protection against a determined person who controls the browser or its files. Use roster nicknames and do not enter sensitive personal information. Switch student when finished; idle sessions expire after 30 minutes.

Work-in-progress snapshots are buffered for at most three seconds and flushed on pagehide/hidden visibility. After an interrupted tab is reopened and the student signs in, **Resume** restores the saved module, drill/lesson and character/slide position. **Dismiss** clears the offered snapshot. Finished lessons, drills and games clear their recovery state. Up to the last unsaved three seconds can be lost on a true power cut; browser events cannot be guaranteed during abrupt OS termination.

## Offline PWA

Use production preview locally or an operator-managed HTTPS origin. HTTPS or loopback is required for Web Crypto and service workers. Keep the first production visit open until the service worker has finished installing. The build automatically injects **every generated JS/CSS chunk**, including unvisited feature/data chunks, into the precache; no separate postbuild command is needed. The manifest includes real maskable PNG icons at 192 and 512 pixels. `public/offline.html` is a zero-JavaScript fallback.

The shell is cache-first. JSON curriculum requests use stale-while-revalidate (the supplied production banks are currently bundled TypeScript chunks, also fully precached). Content hashes version caches. An updated worker waits for old tabs to close before activation, avoiding an old running index losing its lazy chunks; the new worker then removes only obsolete Pupil caches. Close all Pupil tabs and reopen to activate an available update. No development worker is registered.

Offline content includes the approved **35 lessons / 13 modules**, 75 vocabulary cards, 30 sentence exercises, 13 stories, 60 drills, 15 Jeepney stops and 20 scramble puzzles. Source wording is preserved, including awkward supplied wording. Scramble display/validation normalizes source punctuation from the authoritative complete sentence; Foundations deliberately reuses the mature fourth-tier scramble bank because there is no separate bridge bank.

## Speech, audio and device caveats

Speech uses installed native English voices, preferring en-PH, then en-US, then another English voice. Some voices require network access or are absent offline. Text remains readable when speech is unavailable. Karaoke highlights only native word-boundary events; a browser without those events stays unsynchronized. Tap Replay after user activation if autoplay is blocked. Sound is synthesized with native Web Audio, with no audio download.

The integration runner proved native scheduling and mocked speech-boundary wiring, **not** audible Android synchronization or acoustic latency on low-spec ARM/Celeron hardware. Actual target-device voice availability, under-15ms audible response, 60 FPS, below-80MB RAM and target-network FCP require physical-device signoff. See `QA-REPORT.md` for the precise pass/partial matrix.

The budget command enforces **initial JS ≤120,000 gzip bytes** and initial CSS ≤30,000 gzip bytes, traversing static manifest imports rather than counting only the entry file. It separately lists every lazy chunk and the total. Current total offline JavaScript exceeds 120KB; do not describe the initial budget result as a total-JS pass.

## Tooling security

`npm audit --omit=dev` is clean at integration time. The full audit reports six development-tool vulnerabilities in the pinned Vite 5/Vitest 2 toolchain, including critical tinypool advisories. No forced major upgrade was authorized. Keep dev/preview tooling on loopback, do not expose Vitest mock servers to untrusted clients, and do not run untrusted projects or worker options. Production deployment must serve built static files, not a development/test server. A separately approved tooling upgrade remains necessary.
