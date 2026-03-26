import http from "node:http";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const CONTENT_TYPES = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"]
]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getContentType(filePath) {
  return CONTENT_TYPES.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream";
}

function resolvePublicPath(rootDir, requestUrl = "/") {
  const requestPath = new URL(requestUrl, "http://127.0.0.1").pathname;
  const decodedPath = decodeURIComponent(requestPath === "/" ? "/index.html" : requestPath);
  const resolvedRoot = path.resolve(rootDir);
  const resolvedTarget = path.resolve(resolvedRoot, `.${decodedPath}`);

  if (resolvedTarget !== resolvedRoot && !resolvedTarget.startsWith(`${resolvedRoot}${path.sep}`)) {
    return null;
  }

  return resolvedTarget;
}

async function sendResponse(response, statusCode, body, contentType = "text/plain; charset=utf-8") {
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Type": contentType
  });
  response.end(body);
}

async function handleRequest(request, response, rootDir) {
  const resolvedPath = resolvePublicPath(rootDir, request.url);

  if (!resolvedPath) {
    await sendResponse(response, 404, "Not found");
    return;
  }

  try {
    const fileStats = await stat(resolvedPath);
    const filePath = fileStats.isDirectory() ? path.join(resolvedPath, "index.html") : resolvedPath;
    const body = await readFile(filePath);

    await sendResponse(response, 200, body, getContentType(filePath));
  } catch {
    await sendResponse(response, 404, "Not found");
  }
}

export async function startStaticServer({
  rootDir = path.join(__dirname, "public"),
  port = Number(process.env.PORT ?? 4173)
} = {}) {
  const server = http.createServer((request, response) => {
    handleRequest(request, response, rootDir).catch(async () => {
      if (!response.headersSent) {
        await sendResponse(response, 500, "Internal Server Error");
      } else {
        response.end();
      }
    });
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, () => {
      server.off("error", reject);
      resolve();
    });
  });

  return server;
}

const launchedDirectly =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (launchedDirectly) {
  try {
    const server = await startStaticServer();
    const address = server.address();

    if (address && typeof address === "object") {
      console.log(`Slider captcha server running at http://localhost:${address.port}`);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
