import { listCalendarEvents } from "@/server/calendar-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json(await listCalendarEvents());
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "暂时无法读取活动。",
      },
      { status: 500 },
    );
  }
}
