import { spawn } from "node:child_process";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = 4308;
const origin = `http://localhost:${port}`;
const vinext = join(root, "node_modules", "vinext", "dist", "cli.js");
const child = spawn(process.execPath, [vinext, "dev", "--port", String(port)], {
  cwd: root,
  env: {
    ...process.env,
    WRANGLER_LOG_PATH: join(root, ".wrangler", "wrangler.log"),
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let log = "";
child.stdout.on("data", (chunk) => {
  log = `${log}${chunk}`.slice(-8_000);
});
child.stderr.on("data", (chunk) => {
  log = `${log}${chunk}`.slice(-8_000);
});

async function waitForServer() {
  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${origin}/api/calendar/events`);
      if (response.ok) return;
    } catch {
      // The temporary local server is still starting.
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
  }
  throw new Error("等待本地活动服务启动超时。\n" + log);
}

try {
  await waitForServer();
  process.env.ECC_LOCAL_APP_ORIGIN = origin;
  const { publishCalendar } = await import("./publish-calendar.mjs");
  console.log((await publishCalendar({ dryRun: true })).message);
} finally {
  child.kill("SIGTERM");
}
