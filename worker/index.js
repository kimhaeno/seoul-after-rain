import { onRequestGet as weather } from "../functions/api/weather.js";

function json(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);

    if (url.pathname === "/api/weather") {
      if (request.method !== "GET") {
        return json({ error: "Method not allowed" }, 405);
      }

      return weather({
        request,
        env,
        waitUntil: context.waitUntil.bind(context),
      });
    }

    if (url.pathname.startsWith("/api/")) {
      return json({ error: "Not found" }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};
