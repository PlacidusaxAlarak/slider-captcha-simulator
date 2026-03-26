# AGENTS.md

## Project Goal
- Build, test, and run a localhost slider captcha simulation system with a pentagon-shaped Canvas cutout, a draggable horizontal slider, tolerance-based validation, failure rebound animation, and clear modular separation between rendering and validation logic.
- Extend the captcha with a decoy notch, per-challenge random rotation, and an always-available refresh button that regenerates the entire challenge state.

## Task Breakdown & Status
- Done: Confirmed the workspace is empty and Node.js/npm are available locally.
- Done: Initialized the project state file and created the first red-phase test scaffolding.
- Done: Verified the red phase with `npm test`; failures are caused by the missing `server.js` and `public/js/captcha-logic.js` modules.
- Done: Added a Node static server on port `4173` with `PORT` override support.
- Done: Implemented shared captcha geometry, Canvas rendering, slider interactions, and status messaging.
- Done: Added local placeholder background assets and fallback loading.
- Done: Verified with `npm test`, HTTP probing, browser screenshots, failure rebound, success alignment, and fallback image loading.
- Done: Brainstormed and approved the follow-up feature design for a true notch, a decoy notch, random rotation, and an always-visible refresh control.
- Done: Added the second round of tests and implementation for decoy geometry generation and refresh/reset state management.
- Done: Re-ran automated and browser-level verification against the updated challenge behavior.
- Doing: Initialize local git history and prepare the project for GitHub upload.
- To-Do: Attach a GitHub remote and push the repository once the target repo information is available.

## Technical Log
- Constraint: The workspace starts empty and is not a git repository, so the implementation must scaffold the whole project from scratch.
- Decision: Use Node.js built-in `http` for the local static server and `node:test` for automated tests to avoid third-party dependencies.
- Decision: The first mutable artifact must be `AGENTS.md`, per the task protocol, and it will be updated at each milestone.
- TDD checkpoint: The first test run failed with `ERR_MODULE_NOT_FOUND` for `server.js` and `public/js/captcha-logic.js`, which confirms the tests are exercising missing implementation rather than silently passing.
- Decision: Keep geometry and validation in a browser-safe ES module under `public/js/` so both the browser app and Node tests can consume the same logic without duplication.
- Decision: The pentagon shape is normalized into a reusable bounding box once, then translated for both the notch and the moving piece so the visual silhouette and X-axis comparison stay perfectly aligned.
- Verification note: `agent-browser` could not install its managed Playwright browser because the environment's proxy endpoint `127.0.0.1:7897` refused outbound npm traffic, so browser verification switched to the locally installed Chrome executable.
- Verification note: Browser-level checks confirmed three user-visible behaviors on `http://localhost:4173`: failure prompts with rebound to origin, success prompts with the slider disabled at the solved position, and image fallback returning `usedFallback: true` when the primary image path is invalid.
- Design note: The approved deception model is "one real notch plus one fake notch"; the real notch must share the piece rotation, while the decoy notch must differ in both position and angle.
- Design note: The refresh button must be visible and clickable in every state, including while the user is dragging, during rebound animation, and after a success state.
- Implementation note: Challenge generation now returns `targetNotch`, `decoyNotch`, `pieceRotation`, and `minNotchDistance`, which keeps the decoy rules inside the pure logic layer and leaves the UI responsible only for rendering and state resets.
- Verification note: After this change, `npm test` passed with 8/8 tests, including the new geometry-spacing and refresh-state coverage.
- Verification note: Browser validation on `http://localhost:4173` confirmed that the refresh button is always visible, refresh regenerates positions and angles, failed attempts still rebound to origin, success can still be reached, and refresh after success re-enables the slider with a fresh challenge.
- Publish note: The workspace was not a git repository when the upload request arrived, so the first publishing step is to initialize local git history before adding any GitHub remote.

## Run Instructions
- Default port: `4173`
- Start command: `npm run dev`
- Test command: `npm test`
- Open URL: `http://localhost:4173`
- Config file: `public/js/config.js`
