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
  "mother-of-bride-outfit-color-palette",
  "graduation-outfit-color-palette",
  "holiday-party-outfit-color-palette",
  "video-call-outfit-color-palette",
  "red-lipstick-undertone-checker",
  "neutral-wardrobe-color-palette",
  "plus-size-outfit-color-palette",
  "maternity-outfit-color-palette",
  "thrift-shopping-color-checklist",
  "jewelry-capsule-color-palette",
  "winter-coat-color-checklist",
  "summer-wedding-guest-color-checklist",
  "job-interview-blazer-color-checklist",
  "capsule-wardrobe-accent-color-checklist",
  "hair-color-wardrobe-checklist",
  "foundation-undertone-shopping-checklist",
  "shoe-and-bag-color-checklist",
  "travel-photo-outfit-color-checklist",
  "presentation-outfit-color-checklist",
  "athleisure-color-palette-checklist",
  "denim-wash-color-checklist",
  "office-capsule-color-plan",
  "family-photo-outfit-color-palette",
  "concert-outfit-color-checklist",
  "vacation-swimwear-color-checklist",
  "handbag-hardware-metal-checklist",
  "bridesmaid-accessory-color-checklist",
  "color-analysis-before-shopping-checklist",
  "wardrobe-color-declutter-checklist",
  "makeup-bag-color-audit-checklist",
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
  assert.match(home, /Video calls/);
  assert.match(home, /Thrift shopping/);
  assert.match(home, /Jewelry capsule/);
  assert.match(home, /Winter coats/);
  assert.match(home, /Summer weddings/);
  assert.match(home, /Interview blazers/);
  assert.match(home, /Foundation undertones/);
  assert.match(home, /Presentation outfit/);
  assert.match(privacy, /not uploaded/i);
  assert.match(terms, /not a professional certification/i);
  assert.match(support, /Photo checklist/);
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(sitemapUrls.length, 59);
  for (const route of seoRoutes) {
    assert.ok(sitemapUrls.includes(`https://colorfit.pagecheckai.com/${route}/`), `missing sitemap route: ${route}`);
  }
});

test("new shopping pages avoid identity and outcome claims", async () => {
  const video = await readFile("dist/video-call-outfit-color-palette/index.html", "utf8");
  const red = await readFile("dist/red-lipstick-undertone-checker/index.html", "utf8");
  const plus = await readFile("dist/plus-size-outfit-color-palette/index.html", "utf8");
  const maternity = await readFile("dist/maternity-outfit-color-palette/index.html", "utf8");
  const foundation = await readFile("dist/foundation-undertone-shopping-checklist/index.html", "utf8");
  const presentation = await readFile("dist/presentation-outfit-color-checklist/index.html", "utf8");
  const combined = `${video}\n${red}\n${plus}\n${maternity}\n${foundation}\n${presentation}`;

  assert.match(combined, /does not infer identity, ethnicity, health, age, or attractiveness/);
  assert.match(combined, /Use the output to shortlist color families/);
  assert.match(combined, /not to eliminate personal favorites/);
  assert.match(combined, /compare the real fabric, makeup sample, or metal near your face before buying/i);
  assert.doesNotMatch(combined.toLowerCase(), /guaranteed flattering|beauty score|ethnicity detection|health diagnosis|age estimate/);
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

test("second-pass shopping pages keep private reference and no-outcome boundaries", async () => {
  const denim = await readFile("dist/denim-wash-color-checklist/index.html", "utf8");
  const family = await readFile("dist/family-photo-outfit-color-palette/index.html", "utf8");
  const swimwear = await readFile("dist/vacation-swimwear-color-checklist/index.html", "utf8");
  const declutter = await readFile("dist/wardrobe-color-declutter-checklist/index.html", "utf8");
  const makeup = await readFile("dist/makeup-bag-color-audit-checklist/index.html", "utf8");
  const combined = `${denim}\n${family}\n${swimwear}\n${declutter}\n${makeup}`;

  assert.match(combined, /does not infer identity, ethnicity, health, age, or attractiveness/);
  assert.match(combined, /Use the output to shortlist color families/);
  assert.match(combined, /not to eliminate personal favorites/);
  assert.match(combined, /compare the real fabric, makeup sample, or metal near your face before buying/i);
  assert.match(declutter, /without letting a palette override personal favorites/);
  assert.match(makeup, /testing real formulas on skin/);
  assert.doesNotMatch(combined.toLowerCase(), /guaranteed flattering|beauty score|ethnicity detection|health diagnosis|age estimate|guaranteed slimming/);
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
