import test from "node:test";
import assert from "node:assert/strict";
import { __test } from "../functions/api/weather.js";

test("recognizes KMA rain types and numeric rainfall", () => {
  assert.equal(__test.isRain("1", "0"), true);
  assert.equal(__test.isRain("0", "1.2"), true);
  assert.equal(__test.isRain("3", "0"), false);
  assert.equal(__test.rainAmount("1.0mm 미만"), 1);
  assert.equal(__test.rainAmount("강수없음"), 0);
});

test("recognizes rain in the first three forecast periods", () => {
  const items = [
    { fcstDate: "20260815", fcstTime: "1200", category: "PTY", fcstValue: "0" },
    { fcstDate: "20260815", fcstTime: "1200", category: "RN1", fcstValue: "강수없음" },
    { fcstDate: "20260815", fcstTime: "1300", category: "PTY", fcstValue: "1" },
  ];
  assert.equal(__test.forecastIsRain(items), true);
});

test("uses the previous KST hour before observations are released", () => {
  const timestamp = Date.parse("2026-08-14T15:20:00.000Z");
  assert.deepEqual(__test.baseDateTime(timestamp, 40), { date: "20260814", time: "2300" });
});
