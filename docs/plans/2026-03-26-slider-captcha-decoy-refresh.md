# Slider Captcha Decoy Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a real notch plus a decoy notch, randomize the pentagon rotation per challenge, and provide an always-visible refresh button that regenerates the full captcha state.

**Architecture:** Keep challenge generation in `public/js/captcha-logic.js`, expand the geometry model to include a real notch, a decoy notch, and shared rotation metadata, and let `public/app.js` own the challenge lifecycle and reset behavior. Update the renderer to draw both notch silhouettes and the rotated piece from the same normalized pentagon points, then expose a visible refresh control in the existing page shell.

**Tech Stack:** Node.js built-in server, browser ES modules, HTML5 Canvas, vanilla JavaScript, `node:test`

---

### Task 1: Extend challenge-generation tests

**Files:**
- Modify: `G:\Test\test\captcha-logic.test.js`

**Step 1: Write the failing test**

- Add expectations that `createChallengeGeometry()` returns:
  - `targetNotch` and `decoyNotch`
  - a shared piece rotation equal to the target rotation
  - a decoy rotation that differs from the target rotation
  - enough spacing between the two notch origins

**Step 2: Run test to verify it fails**

Run: `npm test`  
Expected: FAIL because the current geometry model does not expose target/decoy notch objects or rotation metadata.

**Step 3: Write minimal implementation**

- Update challenge generation to create target and decoy notch objects plus rotation data.

**Step 4: Run test to verify it passes**

Run: `npm test`  
Expected: PASS for the new geometry assertions.

### Task 2: Add refresh-state helper tests

**Files:**
- Modify: `G:\Test\test\captcha-logic.test.js`

**Step 1: Write the failing test**

- Add a small pure helper test that verifies a fresh challenge state resets slider progress to `0`, unlocks the control, and clears animation state.

**Step 2: Run test to verify it fails**

Run: `npm test`  
Expected: FAIL because the helper does not exist yet.

**Step 3: Write minimal implementation**

- Add a pure reset-state helper in `public/js/captcha-logic.js`.

**Step 4: Run test to verify it passes**

Run: `npm test`  
Expected: PASS for both geometry and reset-state coverage.

### Task 3: Implement renderer and UI updates

**Files:**
- Modify: `G:\Test\public\index.html`
- Modify: `G:\Test\public\styles.css`
- Modify: `G:\Test\public\app.js`
- Modify: `G:\Test\public\js\captcha-renderer.js`
- Modify: `G:\Test\public\js\captcha-logic.js`

**Step 1: Write the minimal UI contract**

- Add a refresh button that is always visible near the status/controls area.

**Step 2: Implement challenge regeneration**

- Regenerate target notch, decoy notch, and piece rotation on initial load and on button click.
- Ensure refresh interrupts current animation/success state and returns the slider to the starting state.

**Step 3: Implement rotated rendering**

- Draw the real notch, decoy notch, and floating piece using the same pentagon points with per-shape rotation metadata.

**Step 4: Run verification**

Run: `npm test`  
Expected: PASS.

### Task 4: Final verification and state sync

**Files:**
- Modify: `G:\Test\AGENTS.md`

**Step 1: Verify runtime behavior**

- Start with `npm run dev`
- Confirm:
  - the refresh button is always visible
  - each refresh changes notch placement and rotation
  - only the real notch can pass validation
  - the decoy notch causes failure and rebound

**Step 2: Update AGENTS.md**

- Record the geometry/refresh design outcome and latest verification evidence.
