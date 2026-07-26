import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { analyzePalette, computeImageStats, rgbToHex } from "../public/color-engine.js";

const seoRoutes = [
  "personal-color-analysis-online",
  "seasonal-color-palette-finder",
  "best-clothing-colors-for-me",
  "warm-or-cool-undertone-photo-test",
  "makeup-color-palette-from-selfie",
  "lipstick-color-finder",
  "hair-color-palette-guide",
  "jewelry-metal-color-test",
  "capsule-wardrobe-color-palette",
  "color-analysis-photo-tips",
  "soft-summer-vs-clear-winter",
  "bright-spring-vs-deep-autumn",
  "eyeglass-frame-color-finder",
  "workwear-color-palette",
  "wedding-guest-outfit-color-palette",
  "interview-outfit-color-palette",
  "travel-capsule-wardrobe-colors",
  "nail-polish-color-palette-finder",
  "scarf-color-finder",
  "handbag-shoe-color-palette",
  "black-white-contrast-outfit-checker",
  "closet-color-audit-checklist",
  "online-shopping-color-checklist",
  "mens-wardrobe-color-palette",
  "bridesmaid-dress-color-palette",
];

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
  assert.match(home, /Eyeglass frames/);
  assert.match(home, /Wedding guest colors/);
  assert.match(home, /Interview outfit/);
  assert.match(home, /Online shopping/);
  assert.match(privacy, /not uploaded/i);
  assert.match(terms, /not a professional certification/i);
  assert.match(support, /Photo checklist/);
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(sitemapUrls.length, 29);
  for (const route of seoRoutes) {
    assert.ok(sitemapUrls.includes(`https://colorfit.pagecheckai.com/${route}/`), `missing sitemap route: ${route}`);
  }
});

test("renders all shopping pages with privacy and accuracy boundaries", async () => {
  for (const route of seoRoutes) {
    const html = await readFile(`dist/${route}/index.html`, "utf8");
    assert.match(html, /ColorFitAI/);
    assert.match(html, /Confirm the cheek, natural hair, and iris sample points yourself/);
    assert.match(html, /compare the real fabric, makeup sample, or metal near your face before buying/i);
    assert.match(html, /does not infer identity, ethnicity, health, age, or attractiveness/);
  }
});

test("hosts the IndexNow key and visual asset", async () => {
  const key = await readFile("dist/62434faa91efd58495e0d767e9fd2575.txt", "utf8");
  const image = await readFile("dist/color-studio.png");
  assert.equal(key.trim(), "62434faa91efd58495e0d767e9fd2575");
  assert.ok(image.byteLength > 100000);
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
