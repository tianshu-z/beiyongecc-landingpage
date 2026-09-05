import { env } from "cloudflare:workers";

type CalendarEnvironment = {
  CALENDAR_MEDIA?: R2Bucket;
};

function mediaBucket() {
  const bucket = (env as unknown as CalendarEnvironment).CALENDAR_MEDIA;
  if (!bucket) throw new Error("活动图片存储暂不可用。");
  return bucket;
}

function safeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 100) || "event";
}

function extensionFor(contentType: string) {
  if (contentType === "image/png") return "png";
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/svg+xml") return "svg";
  return "webp";
}

function mediaUrl(key: string) {
  return `/api/calendar/media/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export function mediaKeyFromUrl(value: string | undefined) {
  if (!value?.startsWith("/api/calendar/media/")) return null;
  return value
    .slice("/api/calendar/media/".length)
    .split("/")
    .map(decodeURIComponent)
    .join("/");
}

export async function storeCalendarImage(
  eventId: string,
  kind: "poster" | "registration-qr",
  bytes: ArrayBuffer,
  contentType: string,
) {
  if (!contentType.startsWith("image/")) {
    throw new Error("只支持图片文件。");
  }

  const key = `calendar/${safeSegment(eventId)}/${kind}-${Date.now()}-${crypto.randomUUID()}.${extensionFor(contentType)}`;
  await mediaBucket().put(key, bytes, {
    httpMetadata: { contentType },
    customMetadata: { eventId, kind },
  });
  return mediaUrl(key);
}

export async function storeCalendarFile(
  eventId: string,
  kind: "poster" | "registration-qr",
  file: File,
) {
  return storeCalendarImage(eventId, kind, await file.arrayBuffer(), file.type);
}

export async function storeDataUrl(
  eventId: string,
  kind: "poster" | "registration-qr",
  value: string,
) {
  const match = /^data:([^;,]+);base64,(.+)$/s.exec(value);
  if (!match) throw new Error("图片数据格式不正确。");

  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return storeCalendarImage(eventId, kind, bytes.buffer, match[1]);
}

export async function storeCalendarBackup(value: string, label = "backup") {
  const safeLabel = safeSegment(label);
  const key = `calendar-backups/${safeLabel}-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  await mediaBucket().put(key, value, {
    httpMetadata: { contentType: "application/json; charset=utf-8" },
  });
  return key;
}

export async function storeMigrationBackup(value: string) {
  return storeCalendarBackup(value, "legacy");
}

export async function readCalendarMedia(key: string) {
  return mediaBucket().get(key);
}

export async function removeCalendarMedia(value: string | undefined) {
  const key = mediaKeyFromUrl(value);
  if (key) await mediaBucket().delete(key);
}

export async function clearManagedCalendarMedia() {
  const bucket = mediaBucket();
  let cursor: string | undefined;
  do {
    const page = await bucket.list({ prefix: "calendar/", cursor });
    if (page.objects.length) {
      await bucket.delete(page.objects.map((object) => object.key));
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
}
