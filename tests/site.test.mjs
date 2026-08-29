import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
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
  "teacher-wardrobe-color-palette",
  "conference-capsule-color-checklist",
  "date-night-color-checklist",
  "job-fair-outfit-color-checklist",
  "retail-uniform-color-coordination",
  "stage-performance-outfit-color-plan",
  "minimalist-wardrobe-color-ratio",
  "seasonal-sale-color-shopping-checklist",
  "outerwear-accessory-color-map",
  "color-palette-after-weight-change",
  "remote-work-capsule-color-plan",
  "vacation-capsule-color-palette",
  "wedding-family-photo-color-plan",
  "postpartum-wardrobe-color-checklist",
  "silver-hair-wardrobe-color-checklist",
  "glasses-frame-color-wardrobe-map",
  "formal-event-color-checklist",
  "small-closet-color-system",
  "thrift-store-color-filter-checklist",
  "makeup-and-wardrobe-color-handoff",
  "color-analysis-photo-consistency-checklist",
  "color-analysis-white-balance-capture-log",
  "screen-to-fabric-color-verification-checklist",
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
  assert.match(home, /Build a free color shortlist before buying another maybe/);
  assert.match(home, /Build free palette/);
  assert.match(home, /Compare \$19 and \$49 packs/);
  assert.match(home, /Free shortlist first/);
  assert.match(home, /Buy after the free palette exposes a costly repeat pattern/);
  assert.match(home, /Good fit for \$19/);
  assert.match(home, /Good fit for \$49/);
  assert.match(home, /Skip payment when/);
  assert.match(home, /photo stays in this browser/i);
  assert.match(home, /id="checkoutPalette"[^>]*aria-disabled="true"/);
  assert.match(home, /id="checkoutWardrobe"[^>]*aria-disabled="true"/);
  assert.match(home, /id="photoSource"[^>]*minlength="30"[^>]*required/);
  assert.match(home, /id="photoCheckedDate"[^>]*required/);
  assert.match(home, /id="humanReviewer"[^>]*minlength="3"[^>]*required/);
  assert.match(home, /id="shoppingDecision"[^>]*minlength="20"[^>]*required/);
  assert.match(home, /id="reviewNotes"[^>]*minlength="80"[^>]*required/);
  assert.match(home, /id="reviewConfirmed"[^>]*required/);
  assert.doesNotMatch(home, /namebatch\.pagecheckai\.com\/api\/checkout|paypal\.com\/ncp\/payment/);
  assert.match(home, /Enter a CP- or CW- code/);
  assert.match(home, /After payment, enter the CP- or CW- activation code here/);
  assert.match(home, /open support/);
  assert.match(home, /sends only the activation code and product name/);
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
  assert.match(support, /generated locally from the palette result/);
  assert.match(support, /Prepare the free current palette report before payment/);
  assert.match(support, /Prepare the free current palette/);
  assert.match(support, /mailto:support@pagecheckai\.com\?subject=ColorFitAI%20support/);
  assert.match(support, /Do not email photos, sampled colors, palette results/);
  assert.doesNotMatch(support, /namebatch\.pagecheckai\.com\/api\/checkout|paypal\.com\/ncp\/payment/);
  assert.match(privacy, /does not send the photo, sampled colors, or palette text/);
  assert.match(terms, /browser-generated planning files/);
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(sitemapUrls.length, 82);
  for (const route of seoRoutes) {
    assert.ok(sitemapUrls.includes(`https://colorfit.pagecheckai.com/${route}/`), `missing sitemap route: ${route}`);
  }
});

test("renders a screen-to-fabric verification checklist without claiming color equivalence", async () => {
  const html = await readFile("dist/screen-to-fabric-color-verification-checklist/index.html", "utf8");
  assert.match(html, /retailer color name, product URL, device, display brightness, and reference palette/i);
  assert.match(html, /compare the physical fabric in consistent indirect daylight/i);
  assert.match(html, /screen swatch is not proof of the fabric color/i);
  assert.match(html, /return window/i);
});

test("renders a white-balance capture log without promising photo accuracy", async () => {
  const html = await readFile("dist/color-analysis-white-balance-capture-log/index.html", "utf8");
  assert.match(html, /device, lens, camera mode, white-balance setting, exposure, light source, time, background, and reference neutral/i);
  assert.match(html, /does not calibrate a camera, correct a photo, recover true skin color, or prove undertone/i);
  assert.match(html, /compare only captures made under the same documented conditions/i);
  assert.match(html, /utm_content=seo_color-analysis-white-balance-capture-log_free_palette#analyzer/);
});

test("renders a photo consistency gate instead of a permanent classification", async () => {
  const html = await readFile("dist/color-analysis-photo-consistency-checklist/index.html", "utf8");
  assert.match(html, /lighting, camera processing, exposure, background reflection, filters, makeup, hair color, and sample placement/i);
  assert.match(html, /pause analysis, keep only comparable captures/i);
  assert.match(html, /real fabric in consistent daylight rather than force a permanent season label/i);
  assert.match(html, /utm_content=seo_color-analysis-photo-consistency-checklist_free_palette#analyzer/);
  assert.doesNotMatch(html, /definitely a (spring|summer|autumn|winter)|guaranteed accurate|identity detection/i);
});

test("paid pack activation stays product-scoped and browser-local", async () => {
  const app = await readFile("dist/app.js", "utf8");

  assert.match(app, /LICENSE_VERIFY_URL = "https:\/\/namebatch\.pagecheckai\.com\/api\/licenses\/verify"/);
  assert.match(app, /product: "colorfitai"/);
  assert.match(app, /product: "colorfitwardrobe"/);
  assert.match(app, /entitlement: "personal_palette_pack"/);
  assert.match(app, /entitlement: "wardrobe_color_review_pack"/);
  assert.match(app, /JSON\.stringify\(\{ code, product: product\.product \}\)/);
  assert.match(app, /new AbortController\(\)/);
  assert.match(app, /controller\.abort\(\), 10000/);
  assert.match(app, /signal: controller\.signal/);
  assert.match(app, /window\.clearTimeout\(timeout\)/);
  assert.match(app, /activatePack\.disabled = false/);
  assert.match(app, /Activation timed out or is temporarily unavailable/);
  assert.match(app, /if \(!qualifiedPaletteReady\(\)\) return/);
  assert.match(app, /if \(!navigator\.clipboard\?\.writeText\) throw new Error\("Clipboard unavailable"\)/);
  assert.match(app, /Copy failed - retry/);
  assert.match(app, /copyButton\.disabled = !qualifiedPaletteReady\(\)/);
  assert.match(app, /Generated locally in this browser/);
  assert.match(app, /function invalidateResult/);
  assert.match(app, /Palette inputs changed\. Analyze again before downloading the paid pack/);
  assert.match(app, /sample changed\. Analyze again before exporting/);
  assert.match(app, /if \(sourceUrl\) URL\.revokeObjectURL\(sourceUrl\)/);
  assert.match(app, /photoStats = null/);
  assert.match(app, /MIN_PAID_PHOTO_QUALITY = 70/);
  assert.match(app, /photoStats\.quality >= MIN_PAID_PHOTO_QUALITY/);
  assert.match(app, /Build a current qualified palette for this pack before downloading/);
  assert.match(app, /Photo quality: \$\{photoStats\.quality\}\/100/);
  assert.match(app, /function currentPaletteSignature/);
  assert.match(app, /function qualifiedPaletteReady/);
  assert.match(app, /function updatePaymentGate/);
  assert.match(app, /qualified_palette_report/);
  assert.match(app, /qualified_wardrobe_report/);
  assert.match(app, /photoCheckedDate\.value <= today/);
  assert.match(app, /Review inputs changed\. Build the palette again before copying, downloading, or paying/);
  assert.match(app, /window\.setTimeout\(\(\) => URL\.revokeObjectURL\(url\), 1000\)/);
  assert.match(app, /Paid pack download started\. Wait for your browser to confirm the file\./);
  assert.match(app, /Your current qualified palette and activation are still available; try again\./);
  assert.doesNotMatch(app, /Paid pack downloaded locally\./);
  assert.doesNotMatch(app, /link\.click\(\);\s*URL\.revokeObjectURL\(link\.href\);/);
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
    assert.match(html, /When a paid palette pack is worth it/);
    assert.match(html, /Review paid-pack boundaries in the analyzer only after/);
    assert.match(html, /Skip payment if you need an appearance rating/);
    assert.match(html, /compare the real fabric, makeup sample, or metal near your face before buying/i);
    assert.match(html, /does not infer identity, ethnicity, health, age, or attractiveness/);
    assert.match(html, new RegExp(`utm_content=seo_${route}_free_palette#analyzer`));
    assert.doesNotMatch(html, /namebatch\.pagecheckai\.com\/api\/checkout|paypal\.com\/ncp\/payment/);
  }
});

test("all static HTML stays free-first without direct payment destinations", async () => {
  const files = await readdir("dist", { recursive: true });
  const htmlFiles = files.filter((file) => file.endsWith(".html"));
  assert.ok(htmlFiles.length >= 79);
  for (const file of htmlFiles) {
    const html = await readFile(`dist/${file}`, "utf8");
    assert.doesNotMatch(html, /namebatch\.pagecheckai\.com\/api\/checkout|paypal\.com\/ncp\/payment/, file);
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

test("third-pass wardrobe pages keep body, identity, and outcome boundaries", async () => {
  const teacher = await readFile("dist/teacher-wardrobe-color-palette/index.html", "utf8");
  const stage = await readFile("dist/stage-performance-outfit-color-plan/index.html", "utf8");
  const sale = await readFile("dist/seasonal-sale-color-shopping-checklist/index.html", "utf8");
  const weight = await readFile("dist/color-palette-after-weight-change/index.html", "utf8");
  const combined = `${teacher}\n${stage}\n${sale}\n${weight}`;

  assert.match(combined, /does not infer identity, ethnicity, health, age, or attractiveness/);
  assert.match(combined, /Use the output to shortlist color families/);
  assert.match(combined, /not to eliminate personal favorites/);
  assert.match(weight, /without judgment/);
  assert.doesNotMatch(combined.toLowerCase(), /guaranteed flattering|beauty score|ethnicity detection|health diagnosis|age estimate|guaranteed slimming/);
});

test("fourth-pass wardrobe pages keep comfort, identity, and buying boundaries", async () => {
  const remote = await readFile("dist/remote-work-capsule-color-plan/index.html", "utf8");
  const postpartum = await readFile("dist/postpartum-wardrobe-color-checklist/index.html", "utf8");
  const silver = await readFile("dist/silver-hair-wardrobe-color-checklist/index.html", "utf8");
  const thrift = await readFile("dist/thrift-store-color-filter-checklist/index.html", "utf8");
  const makeup = await readFile("dist/makeup-and-wardrobe-color-handoff/index.html", "utf8");
  const combined = `${remote}\n${postpartum}\n${silver}\n${thrift}\n${makeup}`;

  assert.match(combined, /does not infer identity, ethnicity, health, age, or attractiveness/);
  assert.match(combined, /Use the output to shortlist color families/);
  assert.match(combined, /not to eliminate personal favorites/);
  assert.match(postpartum, /comfort first/);
  assert.match(silver, /without age, attractiveness, or identity assumptions/);
  assert.match(thrift, /avoiding pressure, scarcity, and unrealistic alterations/);
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
