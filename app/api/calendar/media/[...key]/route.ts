import { readCalendarMedia } from "@/server/calendar-media";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  try {
    const { key } = await params;
    const object = await readCalendarMedia(key.join("/"));
    if (!object) return new Response("Not found", { status: 404 });

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "public, max-age=31536000, immutable");
    headers.set("x-content-type-options", "nosniff");
    return new Response(object.body, { headers });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
