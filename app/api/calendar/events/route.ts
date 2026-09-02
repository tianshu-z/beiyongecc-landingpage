import { calendarEvents } from "@/shared/calendar";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const category = searchParams.get("category");
  const mode = searchParams.get("mode");

  const events = calendarEvents.filter(
    (event) =>
      (!month || event.startAt.startsWith(month)) &&
      (!category || event.category === category) &&
      (!mode || event.mode === mode),
  );

  return Response.json({ events });
}

