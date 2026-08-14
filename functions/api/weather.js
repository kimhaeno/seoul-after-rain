const KMA_ENDPOINT = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0";
const SEOUL_GRID = { nx: 60, ny: 127 };
const RAIN_TYPES = new Set(["1", "2", "5", "6"]);
const CACHE_SECONDS = 600;

function kstParts(timestamp) {
  const date = new Date(timestamp + 9 * 60 * 60 * 1000);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
  };
}

function pad(value, length = 2) {
  return String(value).padStart(length, "0");
}

function baseDateTime(now, releaseMinute) {
  const current = kstParts(now);
  const selected = current.minute >= releaseMinute ? now : now - 60 * 60 * 1000;
  const parts = kstParts(selected);
  return {
    date: `${parts.year}${pad(parts.month)}${pad(parts.day)}`,
    time: `${pad(parts.hour)}${releaseMinute === 40 ? "00" : "30"}`,
  };
}

function buildUrl(path, serviceKey, base) {
  const url = new URL(`${KMA_ENDPOINT}/${path}`);
  url.searchParams.set("serviceKey", serviceKey);
  url.searchParams.set("pageNo", "1");
  url.searchParams.set("numOfRows", "1000");
  url.searchParams.set("dataType", "JSON");
  url.searchParams.set("base_date", base.date);
  url.searchParams.set("base_time", base.time);
  url.searchParams.set("nx", String(SEOUL_GRID.nx));
  url.searchParams.set("ny", String(SEOUL_GRID.ny));
  return url;
}

function rainAmount(value) {
  if (typeof value !== "string" && typeof value !== "number") return 0;
  const match = String(value).match(/[0-9]+(?:\.[0-9]+)?/);
  return match ? Number(match[0]) : 0;
}

function category(items, name) {
  return items.find((item) => item.category === name)?.obsrValue ?? null;
}

function isRain(precipitationType, amount) {
  return RAIN_TYPES.has(String(precipitationType)) || rainAmount(amount) > 0;
}

function forecastIsRain(items) {
  const periods = new Map();
  items.forEach((item) => {
    const key = `${item.fcstDate}-${item.fcstTime}`;
    if (!periods.has(key)) periods.set(key, {});
    periods.get(key)[item.category] = item.fcstValue;
  });

  return [...periods.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(0, 3)
    .some(([, period]) => isRain(period.PTY, period.RN1));
}

async function fetchItems(path, serviceKey, base) {
  const response = await fetch(buildUrl(path, serviceKey, base), {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`KMA upstream responded ${response.status}`);

  const payload = await response.json();
  const header = payload?.response?.header;
  if (header?.resultCode !== "00") throw new Error("KMA upstream returned an error");
  const items = payload?.response?.body?.items?.item;
  if (!Array.isArray(items)) throw new Error("KMA upstream returned no observations");
  return items;
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": `public, max-age=300, s-maxage=${CACHE_SECONDS}`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function onRequestGet(context) {
  if (!context.env.KMA_SERVICE_KEY) {
    return json({ state: "dry", source: "fallback" }, 503);
  }

  const cache = caches.default;
  const cacheKey = new Request(new URL("/api/weather", context.request.url), { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const now = Date.now();
    const [observations, forecast] = await Promise.all([
      fetchItems("getUltraSrtNcst", context.env.KMA_SERVICE_KEY, baseDateTime(now, 40)),
      fetchItems("getUltraSrtFcst", context.env.KMA_SERVICE_KEY, baseDateTime(now, 45)),
    ]);
    const precipitationType = category(observations, "PTY");
    const amount = category(observations, "RN1");
    const state = isRain(precipitationType, amount)
      ? "rain"
      : forecastIsRain(forecast)
        ? "approaching"
        : "dry";
    const response = json({
      state,
      source: "KMA",
      measuredAt: new Date(now).toISOString(),
      precipitationType,
      rainAmount: amount,
      grid: SEOUL_GRID,
    });
    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch {
    return json({ state: "dry", source: "fallback" }, 502);
  }
}

export const __test = {
  baseDateTime,
  forecastIsRain,
  isRain,
  rainAmount,
};
