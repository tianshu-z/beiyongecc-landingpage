import {
  removeCalendarMedia,
  storeCalendarFile,
  storeDataUrl,
} from "@/server/calendar-media";
import {
  deleteCalendarEvent,
  listCalendarEvents,
  normalizeCalendarEvent,
  saveCalendarEvent,
} from "@/server/calendar-store";

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  return Response.json(
    { error: error instanceof Error ? error.message : "活动保存失败。" },
    { status: 400 },
  );
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const form = await request.formData();
    const rawEvent = JSON.parse(String(form.get("event")));
    let event = normalizeCalendarEvent({ ...rawEvent, id });
    const posterFile = form.get("poster");
    const qrFile = form.get("registrationQrCode");
    const previousCover = typeof rawEvent.previousCover === "string" ? rawEvent.previousCover : undefined;
    const previousQrCode = typeof rawEvent.previousQrCode === "string" ? rawEvent.previousQrCode : undefined;

    if (posterFile instanceof File && posterFile.size > 0) {
      if (posterFile.size > 5_000_000) throw new Error("活动海报请控制在 5 MB 以内。");
      event = { ...event, cover: await storeCalendarFile(id, "poster", posterFile) };
    } else if (event.cover.startsWith("data:")) {
      event = { ...event, cover: await storeDataUrl(id, "poster", event.cover) };
    }

    if (qrFile instanceof File && qrFile.size > 0) {
      if (qrFile.size > 1_500_000) throw new Error("报名二维码请控制在 1.5 MB 以内。");
      event = {
        ...event,
        registrationQrCode: await storeCalendarFile(id, "registration-qr", qrFile),
      };
    } else if (event.registrationQrCode?.startsWith("data:")) {
      event = {
        ...event,
        registrationQrCode: await storeDataUrl(
          id,
          "registration-qr",
          event.registrationQrCode,
        ),
      };
    }

    await saveCalendarEvent(event);
    if (event.cover !== previousCover) await removeCalendarMedia(previousCover);
    if (event.registrationQrCode !== previousQrCode) await removeCalendarMedia(previousQrCode);

    return Response.json({ event });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { events } = await listCalendarEvents();
    const existing = events.find((event) => event.id === id);
    await deleteCalendarEvent(id);
    if (existing) {
      await Promise.all([
        removeCalendarMedia(existing.cover),
        removeCalendarMedia(existing.registrationQrCode),
      ]);
    }
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
