import { env } from "cloudflare:workers";

type CalendarEnvironment = {
  CALENDAR_ADMIN_USER_IDS?: string;
  CALENDAR_ADMIN_EMAILS?: string;
};

function allowlist(value: string | undefined) {
  return new Set(
    (value ?? "")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function canManageCalendar(request: Request) {
  const hostname = new URL(request.url).hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") return true;

  const runtime = env as unknown as CalendarEnvironment;
  const allowedIds = allowlist(runtime.CALENDAR_ADMIN_USER_IDS);
  const allowedEmails = allowlist(runtime.CALENDAR_ADMIN_EMAILS);
  const userId = request.headers.get("oai-authenticated-user-id")?.toLowerCase();
  const email = request.headers.get("oai-authenticated-user-email")?.toLowerCase();

  return Boolean(
    (userId && allowedIds.has(userId)) ||
      (email && allowedEmails.has(email)),
  );
}

export function requireCalendarManager(request: Request) {
  if (canManageCalendar(request)) return null;

  const signedIn = Boolean(
    request.headers.get("oai-authenticated-user-id") ||
      request.headers.get("oai-authenticated-user-email"),
  );

  return Response.json(
    {
      error: signedIn
        ? "当前账号没有活动管理权限。"
        : "请先登录管理账号，再进行活动修改。",
      code: signedIn ? "forbidden" : "authentication_required",
    },
    { status: signedIn ? 403 : 401 },
  );
}
