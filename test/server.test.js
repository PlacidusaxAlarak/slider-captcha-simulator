import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";

const serverModule = () => import("../server.js");

test("startStaticServer serves index and JavaScript files from the provided root", async (t) => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "slider-captcha-static-"));
  const publicDir = path.join(rootDir, "public");

  await mkdir(path.join(publicDir, "js"), { recursive: true });
  await writeFile(path.join(publicDir, "index.html"), "<!doctype html><title>ok</title><h1>captcha</h1>");
  await writeFile(path.join(publicDir, "js", "app.js"), "console.log('captcha');");

  t.after(async () => {
    await rm(rootDir, { recursive: true, force: true });
  });

  const { startStaticServer } = await serverModule();
  const server = await startStaticServer({ rootDir: publicDir, port: 0 });

  t.after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  });

  const address = server.address();
  assert.ok(address && typeof address === "object");

  const baseUrl = `http://127.0.0.1:${address.port}`;

  const indexResponse = await fetch(`${baseUrl}/`);
  assert.equal(indexResponse.status, 200);
  assert.match(indexResponse.headers.get("content-type") ?? "", /text\/html/);
  assert.match(await indexResponse.text(), /captcha/);

  const scriptResponse = await fetch(`${baseUrl}/js/app.js`);
  assert.equal(scriptResponse.status, 200);
  assert.match(scriptResponse.headers.get("content-type") ?? "", /text\/javascript/);
});

test("startStaticServer blocks path traversal outside the static root", async (t) => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "slider-captcha-traversal-"));
  const publicDir = path.join(rootDir, "public");

  await mkdir(publicDir, { recursive: true });
  await writeFile(path.join(publicDir, "index.html"), "safe");
  await writeFile(path.join(rootDir, "secret.txt"), "unsafe");

  t.after(async () => {
    await rm(rootDir, { recursive: true, force: true });
  });

  const { startStaticServer } = await serverModule();
  const server = await startStaticServer({ rootDir: publicDir, port: 0 });

  t.after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  });

  const address = server.address();
  assert.ok(address && typeof address === "object");

  const response = await fetch(`http://127.0.0.1:${address.port}/..%2Fsecret.txt`);
  assert.equal(response.status, 404);
});
