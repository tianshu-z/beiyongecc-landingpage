import { requireCalendarManager } from "@/server/calendar-auth";
import {
  storeDataUrl,
  storeMigrationBackup,
} from "@/server/calendar-media";
import {
  migrateCalendarEvents,
  normalizeCalendarEvent,
} from "@/server/calendar-store";
import type { CalendarEvent } from "@/shared/calendar";

export const dynamic = "force-dynamic";

async function migrateEventMedia(event: CalendarEvent) {
  let migrated = event;
  if (event.cover.startsWith("data:")) {
    migrated = {
      ...migrated,
      cover: await storeDataUrl(event.id, "poster", event.cover),
    };
  }
  if (event.registrationQrCode?.startsWith("data:")) {
    migrated = {
      ...migrated,
      registrationQrCode: await storeDataUrl(
        event.id,
        "registration-qr",
        event.registrationQrCode,
      ),
    };
  }
  return migrated;
}

export async function POST(request: Request) {
  const unauthorized = requireCalendarManager(request);
  if (unauthorized) return unauthorized;

  try {
    const rawBody = await request.text();
    if (rawBody.length > 12_000_000) {
      throw new Error("本地活动备份超过迁移上限，请联系技术人员处理。");
    }
    const payload = JSON.parse(rawBody) as { events?: unknown[] };
    if (!Array.isArray(payload.events) || !payload.events.length) {
      throw new Error("没有找到可以迁移的本地活动。");
    }

    await storeMigrationBackup(rawBody);
    const normalized = payload.events.map(normalizeCalendarEvent);
    const migrated: CalendarEvent[] = [];
    for (const event of normalized) {
      migrated.push(await migrateEventMedia(event));
    }

    return Response.json(await migrateCalendarEvents(migrated));
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "活动迁移失败。" },
      { status: 400 },
    );
  }
}
