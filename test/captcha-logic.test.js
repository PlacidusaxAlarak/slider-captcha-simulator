import test from "node:test";
import assert from "node:assert/strict";

const logicModule = () => import("../public/js/captcha-logic.js");

test("createPentagonShape returns five points inside a positive bounding box", async () => {
  const { createPentagonShape } = await logicModule();
  const shape = createPentagonShape(34);

  assert.equal(shape.points.length, 5);
  assert.ok(shape.width > 0);
  assert.ok(shape.height > 0);

  for (const point of shape.points) {
    assert.ok(point.x >= 0 && point.x <= shape.width);
    assert.ok(point.y >= 0 && point.y <= shape.height);
  }
});

test("createChallengeGeometry keeps the target within the safe horizontal and vertical bounds", async () => {
  const { createChallengeGeometry } = await logicModule();
  const geometry = createChallengeGeometry({
    canvasWidth: 360,
    canvasHeight: 220,
    pieceRadius: 34,
    sliderStartX: 24,
    padding: 18,
    rng: () => 0.5
  });

  assert.ok(geometry.targetX >= geometry.safeBounds.minX);
  assert.ok(geometry.targetX <= geometry.safeBounds.maxX);
  assert.ok(geometry.targetY >= geometry.safeBounds.minY);
  assert.ok(geometry.targetY <= geometry.safeBounds.maxY);
  assert.ok(geometry.maxTravel >= geometry.targetX - geometry.sliderStartX);
});

test("sliderValueToPieceX clamps drag travel inside the legal movement range", async () => {
  const { sliderValueToPieceX } = await logicModule();

  assert.equal(sliderValueToPieceX({ sliderValue: -10, sliderStartX: 24, maxTravel: 180 }), 24);
  assert.equal(sliderValueToPieceX({ sliderValue: 96, sliderStartX: 24, maxTravel: 180 }), 120);
  assert.equal(sliderValueToPieceX({ sliderValue: 500, sliderStartX: 24, maxTravel: 180 }), 204);
});

test("evaluateAttempt accepts the exact tolerance boundary and rejects values outside it", async () => {
  const { evaluateAttempt } = await logicModule();

  assert.deepEqual(evaluateAttempt({ pieceX: 140, targetX: 145, tolerancePx: 5 }), {
    success: true,
    delta: 5
  });

  assert.deepEqual(evaluateAttempt({ pieceX: 139, targetX: 145, tolerancePx: 5 }), {
    success: false,
    delta: 6
  });
});
