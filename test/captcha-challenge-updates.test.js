import test from "node:test";
import assert from "node:assert/strict";

const logicModule = () => import("../public/js/captcha-logic.js");

test("createChallengeGeometry creates a real notch, a decoy notch, and rotation metadata with spacing", async () => {
  const { createChallengeGeometry } = await logicModule();
  const values = [0.22, 0.38, 0.31, 0.76, 0.59];
  let index = 0;
  const geometry = createChallengeGeometry({
    canvasWidth: 360,
    canvasHeight: 220,
    pieceRadius: 34,
    sliderStartX: 24,
    padding: 18,
    rng: () => values[index++] ?? 0.5
  });

  assert.ok(geometry.targetNotch);
  assert.ok(geometry.decoyNotch);
  assert.equal(geometry.targetNotch.rotation, geometry.pieceRotation);
  assert.notEqual(geometry.decoyNotch.rotation, geometry.pieceRotation);

  const notchDistance = Math.hypot(
    geometry.decoyNotch.x - geometry.targetNotch.x,
    geometry.decoyNotch.y - geometry.targetNotch.y
  );

  assert.ok(notchDistance >= geometry.minNotchDistance);
});

test("createFreshCaptchaState resets slider progress, locking, and animation flags", async () => {
  const { createFreshCaptchaState } = await logicModule();

  assert.deepEqual(createFreshCaptchaState({ sliderStartX: 24 }), {
    currentPieceX: 24,
    sliderValue: 0,
    isAnimating: false,
    isLocked: false,
    status: "idle"
  });
});
