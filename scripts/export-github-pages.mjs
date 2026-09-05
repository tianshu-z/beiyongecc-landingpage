import { spawn } from "node:child_process";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "pages-dist");
const port = 4173;
const localOrigin = `http://localhost:${port}`;
const productionOrigin = "https://beiyongecc.org";
const wrangler = join(root, "node_modules", "wrangler", "bin", "wrangler.js");

const baseRoutes = [
  "/",
  "/about",
  "/calendar",
  "/join",
];

function routeOutputPath(route) {
  return route === "/"
    ? join(output, "index.html")
    : join(output, route.slice(1), "index.html");
}

async function waitForServer() {
  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(localOrigin, {
        headers: { accept: "text/html" },
      });
      if (response.ok) return;
    } catch {
      // Wrangler is still starting.
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
  }
  throw new Error("Timed out waiting for the local static-export server.");
}

async function exportRoute(route) {
  const response = await fetch(`${localOrigin}${route}`, {
    headers: { accept: "text/html" },
  });
  if (!response.ok) {
    throw new Error(`Could not render ${route}: HTTP ${response.status}`);
  }

  const html = (await response.text()).replaceAll(localOrigin, productionOrigin);
  const destination = routeOutputPath(route);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, html);
  console.log(`exported ${route}`);
  return html;
}

await rm(output, { recursive: true, force: true });
await cp(join(root, "dist", "client"), output, { recursive: true });

const server = spawn(
  process.execPath,
  [wrangler, "dev", "--config", "dist/server/wrangler.json", "--port", String(port)],
  {
    cwd: root,
    env: {
      ...process.env,
      ECC_STATIC_EXPORT: "1",
      WRANGLER_LOG_PATH: join(root, ".wrangler", "wrangler.log"),
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

let serverLog = "";
server.stdout.on("data", (chunk) => {
  serverLog = `${serverLog}${chunk}`.slice(-8_000);
});
server.stderr.on("data", (chunk) => {
  serverLog = `${serverLog}${chunk}`.slice(-8_000);
});

try {
  await waitForServer();
  const calendarResponse = await fetch(`${localOrigin}/api/calendar/events`, {
    headers: { accept: "application/json" },
  });
  if (!calendarResponse.ok) {
    throw new Error(`Could not read calendar routes: HTTP ${calendarResponse.status}`);
  }
  const calendarPayload = await calendarResponse.json();
  const eventRoutes = Array.isArray(calendarPayload.events)
    ? calendarPayload.events.map((event) => `/calendar/${encodeURIComponent(event.slug)}`)
    : [];
  const routes = [...baseRoutes, ...eventRoutes];
  let homeHtml = "";
  for (const route of routes) {
    const html = await exportRoute(route);
    if (route === "/") homeHtml = html;
  }

  await writeFile(join(output, "404.html"), homeHtml);
  await writeFile(join(output, "CNAME"), "beiyongecc.org\n");
  await writeFile(join(output, ".nojekyll"), "");
} catch (error) {
  if (serverLog) console.error(serverLog);
  throw error;
} finally {
  server.kill("SIGTERM");
}
