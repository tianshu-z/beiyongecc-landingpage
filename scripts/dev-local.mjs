import { spawn } from "node:child_process";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const children = [
  spawn(
    process.execPath,
    [join(root, "node_modules", "vinext", "dist", "cli.js"), "dev"],
    {
      cwd: root,
      env: {
        ...process.env,
        WRANGLER_LOG_PATH: join(root, ".wrangler", "wrangler.log"),
      },
      stdio: "inherit",
    },
  ),
  spawn(process.execPath, [join(root, "scripts", "calendar-publisher-server.mjs")], {
    cwd: root,
    env: process.env,
    stdio: "inherit",
  }),
];

let stopping = false;
function stop(signal = "SIGTERM") {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.killed) child.kill(signal);
  }
}

for (const child of children) {
  child.on("exit", (code) => {
    if (!stopping && code) {
      stop();
      process.exitCode = code;
    }
  });
}

process.on("SIGINT", () => stop("SIGINT"));
process.on("SIGTERM", () => stop("SIGTERM"));
