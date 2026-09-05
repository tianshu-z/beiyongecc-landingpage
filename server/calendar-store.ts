import { env } from "cloudflare:workers";
import {
  calendarEvents as bundledEvents,
  eventCategories,
  eventModes,
  type CalendarEvent,
} from "@/shared/calendar";

type CalendarEnvironment = {
  DB?: D1Database;
};

const migrationMetaKey = "legacy_local_storage_migrated_at";

function database() {
  const db = (env as unknown as CalendarEnvironment).DB;
  if (!db) throw new Error("活动数据库暂不可用。");
  return db;
}

export async function ensureCalendarSchema() {
  const db = database();
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS calendar_events (
      id TEXT PRIMARY KEY NOT NULL,
      slug TEXT NOT NULL,
      start_at TEXT NOT NULL,
      category TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_calendar_events_slug
      ON calendar_events(slug)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_calendar_events_start_at
      ON calendar_events(start_at)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS calendar_event_deletions (
      id TEXT PRIMARY KEY NOT NULL,
      deleted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS calendar_meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
  ]);
}

function requiredString(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field}不能为空。`);
  }
  return value.trim();
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function normalizeCalendarEvent(value: unknown): CalendarEvent {
  if (!value || typeof value !== "object") throw new Error("活动数据格式不正确。");
  const input = value as Partial<CalendarEvent>;
  const category = requiredString(input.category, "活动类型") as CalendarEvent["category"];
  const mode = requiredString(input.mode, "举办形式") as CalendarEvent["mode"];
  const priceType = requiredString(input.priceType, "收费方式") as CalendarEvent["priceType"];

  if (!eventCategories.includes(category)) throw new Error("活动类型不正确。");
  if (!eventModes.includes(mode)) throw new Error("举办形式不正确。");
  if (!["free", "paid", "invitation"].includes(priceType)) {
    throw new Error("收费方式不正确。");
  }

  const summary = requiredString(input.summary, "一句话简介");
  return {
    id: requiredString(input.id, "活动编号"),
    slug: requiredString(input.slug, "活动路径"),
    title: requiredString(input.title, "活动题目"),
    category,
    mode,
    startAt: requiredString(input.startAt, "开始时间"),
    endAt: requiredString(input.endAt, "结束时间"),
    city: optionalString(input.city),
    venue: requiredString(input.venue, "地点"),
    address: optionalString(input.address),
    organizer: optionalString(input.organizer) ?? "北雍文化商业智库",
    summary,
    description:
      Array.isArray(input.description) && input.description.length
        ? input.description.filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
        : [summary],
    highlights: Array.isArray(input.highlights)
      ? input.highlights.filter((item): item is string => typeof item === "string")
      : [],
    audience: optionalString(input.audience) ?? "",
    cover: optionalString(input.cover) ?? "/assets/chinese-armillary-sphere-transparent.svg",
    priceType,
    priceCny: optionalNumber(input.priceCny),
    capacity: optionalNumber(input.capacity),
    remainingSpots: optionalNumber(input.remainingSpots),
    registrationStatus: ["open", "coming-soon", "full"].includes(String(input.registrationStatus))
      ? (input.registrationStatus as CalendarEvent["registrationStatus"])
      : "open",
    registrationUrl: optionalString(input.registrationUrl),
    registrationQrCode: optionalString(input.registrationQrCode),
    demo: Boolean(input.demo),
  };
}

export async function listCalendarEvents() {
  if (process.env.ECC_STATIC_EXPORT === "1") {
    return {
      events: [...bundledEvents].sort((a, b) => a.startAt.localeCompare(b.startAt)),
      migrationCompleted: true,
    };
  }

  await ensureCalendarSchema();
  const db = database();
  const [stored, deleted, migration] = await Promise.all([
    db.prepare("SELECT payload FROM calendar_events ORDER BY start_at, id").all<{ payload: string }>(),
    db.prepare("SELECT id FROM calendar_event_deletions").all<{ id: string }>(),
    db.prepare("SELECT value FROM calendar_meta WHERE key = ? LIMIT 1").bind(migrationMetaKey).first<{ value: string }>(),
  ]);

  const merged = new Map(bundledEvents.map((event) => [event.id, event]));
  for (const row of stored.results) {
    try {
      const event = normalizeCalendarEvent(JSON.parse(row.payload));
      merged.set(event.id, event);
    } catch {
      // Ignore a malformed record rather than breaking the public calendar.
    }
  }
  for (const row of deleted.results) merged.delete(row.id);

  return {
    events: [...merged.values()].sort((a, b) => a.startAt.localeCompare(b.startAt)),
    migrationCompleted: Boolean(migration?.value),
  };
}

export async function findCalendarEventBySlug(slug: string) {
  const { events } = await listCalendarEvents();
  return events.find((event) => event.slug === slug);
}

export async function findCalendarEventById(id: string) {
  const { events } = await listCalendarEvents();
  return events.find((event) => event.id === id);
}

export async function saveCalendarEvent(event: CalendarEvent) {
  await ensureCalendarSchema();
  const db = database();
  await db.batch([
    db.prepare(`INSERT INTO calendar_events (id, slug, start_at, category, payload, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        slug = excluded.slug,
        start_at = excluded.start_at,
        category = excluded.category,
        payload = excluded.payload,
        updated_at = CURRENT_TIMESTAMP`)
      .bind(event.id, event.slug, event.startAt, event.category, JSON.stringify(event)),
    db.prepare("DELETE FROM calendar_event_deletions WHERE id = ?").bind(event.id),
  ]);
  return event;
}

export async function deleteCalendarEvent(id: string) {
  await ensureCalendarSchema();
  const db = database();
  await db.batch([
    db.prepare("DELETE FROM calendar_events WHERE id = ?").bind(id),
    db.prepare(`INSERT INTO calendar_event_deletions (id, deleted_at)
      VALUES (?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET deleted_at = CURRENT_TIMESTAMP`).bind(id),
  ]);
}

export async function migrateCalendarEvents(events: CalendarEvent[]) {
  await ensureCalendarSchema();
  const db = database();
  const currentIds = new Set(events.map((event) => event.id));
  const statements = events.map((event) =>
    db.prepare(`INSERT INTO calendar_events (id, slug, start_at, category, payload, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        slug = excluded.slug,
        start_at = excluded.start_at,
        category = excluded.category,
        payload = excluded.payload,
        updated_at = CURRENT_TIMESTAMP`)
      .bind(event.id, event.slug, event.startAt, event.category, JSON.stringify(event)),
  );

  for (const bundledEvent of bundledEvents) {
    if (!currentIds.has(bundledEvent.id)) {
      statements.push(
        db.prepare(`INSERT INTO calendar_event_deletions (id, deleted_at)
          VALUES (?, CURRENT_TIMESTAMP)
          ON CONFLICT(id) DO UPDATE SET deleted_at = CURRENT_TIMESTAMP`).bind(bundledEvent.id),
      );
    }
  }

  statements.push(
    db.prepare(`INSERT INTO calendar_meta (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`)
      .bind(migrationMetaKey, new Date().toISOString()),
  );
  await db.batch(statements);
  return listCalendarEvents();
}
