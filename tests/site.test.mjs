import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { analyzePalette, computeImageStats, rgbToHex } from "../public/color-engine.js";

test("build includes the product, legal pages, and sitemap", async () => {
  const [home, privacy, terms, support, sitemap] = await Promise.all([
    readFile("dist/index.html", "utf8"),
    readFile("dist/privacy.html", "utf8"),
    readFile("dist/terms.html", "utf8"),
    readFile("dist/support.html", "utf8"),
    readFile("dist/sitemap.xml", "utf8"),
  ]);
  assert.match(home, /ColorFitAI/);
  assert.match(home, /photo stays in this browser/i);
  assert.match(home, /https:\/\/www\.paypal\.com\/ncp\/payment\/7P6JNH86HJRNU/);
  assert.match(home, /https:\/\/www\.paypal\.com\/ncp\/payment\/MXDJV5SYXTR9W/);
  assert.match(privacy, /not uploaded/i);
  assert.match(terms, /not a professional certification/i);
  assert.match(support, /Photo checklist/);
  assert.equal((sitemap.match(/<url>/g) || []).length, 16);
});

test("color helpers clamp and format RGB values", () => {
  assert.equal(rgbToHex({ r: 255, g: 128, b: 0 }), "#FF8000");
  assert.equal(rgbToHex({ r: 300, g: -4, b: 15.4 }), "#FF000F");
});

test("palette analysis returns actionable seasonal output", () => {
  const result = analyzePalette(
    {
      skin: { r: 206, g: 154, b: 121 },
      hair: { r: 54, g: 37, b: 28 },
      eyes: { r: 70, g: 85, b: 62 },
    },
    82,
  );
  assert.ok(["spring", "summer", "autumn", "winter"].includes(result.seasonKey));
  assert.equal(result.clothing.length, 8);
  assert.equal(result.neutrals.length, 4);
  assert.ok(result.confidence >= 38 && result.confidence <= 88);
});

test("photo quality catches severe lighting problems", () => {
  const dark = new Uint8ClampedArray(400);
  for (let index = 0; index < dark.length; index += 4) {
    dark[index] = 18;
    dark[index + 1] = 18;
    dark[index + 2] = 18;
    dark[index + 3] = 255;
  }
  const stats = computeImageStats(dark);
  assert.ok(stats.warnings.some((warning) => /dark/i.test(warning)));
});
