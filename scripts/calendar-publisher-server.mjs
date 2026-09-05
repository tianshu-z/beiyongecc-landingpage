import { createServer } from "node:http";
import { publishCalendar } from "./publish-calendar.mjs";

const host = "127.0.0.1";
const port = Number(process.env.ECC_PUBLISHER_PORT || 4318);
const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);
let activePublish = null;

function responseHeaders(origin) {
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  };
  if (allowedOrigins.has(origin)) {
    headers["access-control-allow-origin"] = origin;
    headers.vary = "Origin";
  }
  return headers;
}

function send(response, status, payload, origin = "") {
  response.writeHead(status, responseHeaders(origin));
  response.end(JSON.stringify(payload));
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin ?? "";
  const url = new URL(request.url ?? "/", `http://${host}:${port}`);

  if (request.method === "OPTIONS") {
    if (!allowedOrigins.has(origin)) {
      send(response, 403, { error: "不允许从这个页面调用发布服务。" }, origin);
      return;
    }
    response.writeHead(204, {
      ...responseHeaders(origin),
      "access-control-allow-methods": "POST, GET, OPTIONS",
    });
    response.end();
    return;
  }

  if (request.method === "GET" && url.pathname === "/status") {
    send(response, 200, { ok: true, publishing: Boolean(activePublish) }, origin);
    return;
  }

  if (request.method !== "POST" || url.pathname !== "/publish") {
    send(response, 404, { error: "Not found" }, origin);
    return;
  }
  if (!allowedOrigins.has(origin)) {
    send(response, 403, { error: "请从本地活动管理页面发起发布。" }, origin);
    return;
  }
  if (activePublish) {
    send(response, 409, { error: "已有一次发布正在进行，请稍候。" }, origin);
    return;
  }

  activePublish = publishCalendar();
  try {
    send(response, 200, await activePublish, origin);
  } catch (error) {
    send(
      response,
      500,
      {
        error:
          error instanceof Error
            ? error.message
            : "官网发布失败，请让 Codex 检查。",
      },
      origin,
    );
  } finally {
    activePublish = null;
  }
});

server.listen(port, host, () => {
  console.log(`  ➜  Publisher: http://${host}:${port}/`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
