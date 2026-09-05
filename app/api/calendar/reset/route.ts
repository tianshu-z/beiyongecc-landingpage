import {
  clearManagedCalendarMedia,
  storeCalendarBackup,
} from "@/server/calendar-media";
import {
  listCalendarEvents,
  resetCalendarEventsToBundled,
} from "@/server/calendar-store";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const current = await listCalendarEvents();
    await storeCalendarBackup(
      JSON.stringify(
        { exportedAt: new Date().toISOString(), events: current.events },
        null,
        2,
      ),
      "before-official-reset",
    );
    const payload = await resetCalendarEventsToBundled();
    await clearManagedCalendarMedia();
    return Response.json(payload);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "无法把本地活动重置为官网版本。",
      },
      { status: 500 },
    );
  }
}
