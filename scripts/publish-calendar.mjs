import { execFile } from "node:child_process";
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  unlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";

const execFileAsync = promisify(execFile);
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const calendarSourcePath = join(root, "shared", "calendar.ts");
const publishedMediaDirectory = join(
  root,
  "public",
  "assets",
  "calendar",
  "published",
);
const appOrigin = process.env.ECC_LOCAL_APP_ORIGIN ?? "http://localhost:3000";
const githubRepository = "tianshu-z/beiyongecc-landingpage";
const githubPushUrl = `git@github.com:${githubRepository}.git`;
const startMarker = "// <calendar-events>";
const endMarker = "// </calendar-events>";
const allowedPublishPaths = [
  "shared/calendar.ts",
  "public/assets/calendar/published/",
];

function safeFileSegment(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "event";
}

function extensionFor(contentType) {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";
  if (contentType.includes("svg")) return "svg";
  return "webp";
}

async function run(command, args, options = {}) {
  return execFileAsync(command, args, {
    cwd: root,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    maxBuffer: 20 * 1024 * 1024,
    timeout: 5 * 60 * 1000,
    ...options,
  });
}

async function ensureCleanSourceTree() {
  const { stdout } = await run("git", ["status", "--porcelain"]);
  const unexpected = stdout
    .split("\n")
    .filter(Boolean)
    .filter((line) => {
      const path = line.slice(3).replace(/^"|"$/g, "");
      return !allowedPublishPaths.some((allowed) =>
        allowed.endsWith("/") ? path.startsWith(allowed) : path === allowed,
      );
    });
  if (unexpected.length) {
    throw new Error(
      "检测到活动数据以外的代码尚未确认，已停止发布。请先让 Codex 检查并提交当前代码。",
    );
  }
}

async function fetchCalendarEvents() {
  const response = await fetch(`${appOrigin}/api/calendar/events`, {
    headers: { accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`无法读取本地活动资料（HTTP ${response.status}）。`);
  }
  const payload = await response.json();
  if (!Array.isArray(payload.events)) throw new Error("本地活动资料格式不正确。");
  return payload.events;
}

async function publishMedia(value, event, kind, keepFiles) {
  if (typeof value !== "string" || !value) return undefined;

  if (value.startsWith("/assets/calendar/published/")) {
    keepFiles.add(basename(value));
    return value;
  }
  if (!value.startsWith("/api/calendar/media/")) return value;

  const response = await fetch(`${appOrigin}${value}`);
  if (!response.ok) {
    throw new Error(`无法读取“${event.title}”的${kind === "poster" ? "海报" : "报名二维码"}。`);
  }
  const extension = extensionFor(response.headers.get("content-type") ?? "image/webp");
  const filename = `${safeFileSegment(event.slug || event.id)}-${kind}.${extension}`;
  await mkdir(publishedMediaDirectory, { recursive: true });
  await writeFile(join(publishedMediaDirectory, filename), Buffer.from(await response.arrayBuffer()));
  keepFiles.add(filename);
  return `/assets/calendar/published/${filename}`;
}

async function publishShareImage(cover, event, keepFiles) {
  if (typeof cover !== "string" || !cover.startsWith("/")) return undefined;

  const sourcePath = join(root, "public", cover.replace(/^\/+/, ""));
  const filename = `${safeFileSegment(event.slug || event.id)}-share.jpg`;
  const outputPath = join(publishedMediaDirectory, filename);
  await mkdir(publishedMediaDirectory, { recursive: true });

  const foreground = await sharp(sourcePath)
    .resize(1120, 570, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 247, g: 243, b: 235, alpha: 1 },
    },
  })
    .composite([{ input: foreground, gravity: "centre" }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outputPath);

  keepFiles.add(filename);
  return `/assets/calendar/published/${filename}`;
}

async function prepareStaticEvents(events) {
  const keepFiles = new Set();
  const result = [];
  for (const event of events) {
    const cover = await publishMedia(event.cover, event, "poster", keepFiles);
    const shareImage = await publishShareImage(cover, event, keepFiles);
    const registrationQrCode = await publishMedia(
      event.registrationQrCode,
      event,
      "registration-qr",
      keepFiles,
    );
    result.push({ ...event, cover, shareImage, registrationQrCode });
  }

  await mkdir(publishedMediaDirectory, { recursive: true });
  for (const entry of await readdir(publishedMediaDirectory, { withFileTypes: true })) {
    if (entry.isFile() && !keepFiles.has(entry.name)) {
      await unlink(join(publishedMediaDirectory, entry.name));
    }
  }
  return result;
}

async function writeCalendarSnapshot(events) {
  const source = await readFile(calendarSourcePath, "utf8");
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker);
  if (start < 0 || end < start) throw new Error("找不到官网活动数据区域。");

  const replacement = `${startMarker}\nexport const calendarEvents: CalendarEvent[] = ${JSON.stringify(events, null, 2)};\n${endMarker}`;
  const next = `${source.slice(0, start)}${replacement}${source.slice(end + endMarker.length)}`;
  await writeFile(calendarSourcePath, next);
  return source;
}

async function waitForGitHubPages(commitSha) {
  const deadline = Date.now() + 4 * 60 * 1000;
  const apiUrl = `https://api.github.com/repos/${githubRepository}/actions/runs?head_sha=${commitSha}&event=push&per_page=1`;
  while (Date.now() < deadline) {
    const response = await fetch(apiUrl, {
      headers: {
        accept: "application/vnd.github+json",
        "user-agent": "ECC-Calendar-Publisher",
      },
    });
    if (response.ok) {
      const payload = await response.json();
      const workflow = payload.workflow_runs?.[0];
      if (workflow?.status === "completed") {
        if (workflow.conclusion !== "success") {
          throw new Error("GitHub 已收到更新，但官网构建失败。请让 Codex 检查工作流。");
        }
        return;
      }
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 5_000));
  }
  throw new Error("GitHub 已收到更新，但等待官网上线超时。请稍后刷新官网查看。");
}

export async function publishCalendar({ dryRun = false, prepareOnly = false } = {}) {
  if (!dryRun && !prepareOnly) await ensureCleanSourceTree();
  const originalSource = await readFile(calendarSourcePath, "utf8");
  const backupRoot = await mkdtemp(join(tmpdir(), "ecc-calendar-publish-"));
  const mediaBackup = join(backupRoot, "published");
  await cp(publishedMediaDirectory, mediaBackup, {
    recursive: true,
    force: true,
  }).catch(() => undefined);

  try {
    const events = await fetchCalendarEvents();
    const staticEvents = await prepareStaticEvents(events);
    await writeCalendarSnapshot(staticEvents);
    await run("npm", ["run", "pages:build"]);

    if (dryRun) {
      await writeFile(calendarSourcePath, originalSource);
      await rm(publishedMediaDirectory, { recursive: true, force: true });
      await cp(mediaBackup, publishedMediaDirectory, {
        recursive: true,
        force: true,
      }).catch(() => undefined);
      return { ok: true, message: `已完成发布预检，共 ${events.length} 项活动。` };
    }

    if (prepareOnly) {
      return {
        ok: true,
        message: `已在本地生成官网活动快照与分享图，共 ${events.length} 项活动。`,
      };
    }

    await run("git", [
      "add",
      "-A",
      "--",
      "shared/calendar.ts",
      "public/assets/calendar/published",
    ]);
    let changed = true;
    try {
      await run("git", ["diff", "--cached", "--quiet"]);
      changed = false;
    } catch (error) {
      if (error?.code !== 1) throw error;
    }

    if (changed) {
      const timestamp = new Intl.DateTimeFormat("zh-CN", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "Asia/Shanghai",
      }).format(new Date());
      await run("git", ["commit", "-m", `Publish calendar update ${timestamp}`]);
    }

    await run("git", ["push", githubPushUrl, "main"]);
    const { stdout } = await run("git", ["rev-parse", "HEAD"]);
    const commitSha = stdout.trim();
    await waitForGitHubPages(commitSha);
    return {
      ok: true,
      commitSha,
      message: `官网已更新，共发布 ${events.length} 项活动。`,
    };
  } catch (error) {
    await writeFile(calendarSourcePath, originalSource).catch(() => undefined);
    await rm(publishedMediaDirectory, { recursive: true, force: true }).catch(() => undefined);
    await cp(mediaBackup, publishedMediaDirectory, {
      recursive: true,
      force: true,
    }).catch(() => undefined);
    throw error;
  } finally {
    await rm(backupRoot, { recursive: true, force: true }).catch(() => undefined);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await publishCalendar({
    dryRun: process.argv.includes("--dry-run"),
    prepareOnly: process.argv.includes("--prepare-only"),
  });
  console.log(result.message);
}
