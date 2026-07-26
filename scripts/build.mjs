import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const siteUrl = "https://colorfit.pagecheckai.com";
const pages = [
  {
    slug: "personal-color-analysis-online",
    title: "Personal color analysis online",
    description: "Use a daylight selfie and confirmed color samples to build a private personal palette and practical shopping shortlist.",
    headline: "Run a personal color analysis in your browser.",
    intent: "People who want a useful starting palette before buying clothing, makeup, jewelry, or hair color.",
  },
  {
    slug: "seasonal-color-palette-finder",
    title: "Seasonal color palette finder",
    description: "Compare warm and cool signals, contrast, and clarity to create a working Spring, Summer, Autumn, or Winter palette.",
    headline: "Find a seasonal palette you can actually shop.",
    intent: "Shoppers who want the seasonal-color framework translated into named colors and hex references.",
  },
  {
    slug: "best-clothing-colors-for-me",
    title: "Best clothing colors for me",
    description: "Turn confirmed skin, hair, and eye color samples into a focused clothing palette and reliable neutral shortlist.",
    headline: "Choose clothing colors with a shorter, clearer list.",
    intent: "People reducing wardrobe mistakes or planning a capsule wardrobe.",
  },
  {
    slug: "warm-or-cool-undertone-photo-test",
    title: "Warm or cool undertone photo test",
    description: "Use a manually confirmed cheek sample to estimate warm, cool, or neutral color signals without uploading your photo.",
    headline: "Check warm, cool, and neutral signals from a photo.",
    intent: "Makeup and clothing shoppers who want a cautious undertone reference rather than a permanent label.",
  },
  {
    slug: "makeup-color-palette-from-selfie",
    title: "Makeup color palette from selfie",
    description: "Create blush, lip, and neutral makeup color references from a locally processed daylight selfie.",
    headline: "Build a makeup color shortlist from a daylight selfie.",
    intent: "People comparing lipstick and blush families before visiting a store or ordering samples.",
  },
  {
    slug: "lipstick-color-finder",
    title: "Lipstick color finder",
    description: "Narrow lipstick shopping to coral, rose, berry, brick, mauve, or blue-red references based on a working seasonal palette.",
    headline: "Reduce lipstick guesswork before checkout.",
    intent: "Shoppers who want color-family references, not promises about a specific product or screen rendering.",
  },
  {
    slug: "hair-color-palette-guide",
    title: "Hair color palette guide",
    description: "Translate warm, cool, soft, and clear color signals into practical hair-color reference families.",
    headline: "Bring clearer hair-color references to your consultation.",
    intent: "People preparing examples for a licensed colorist and avoiding vague requests such as simply asking for brown or blonde.",
  },
  {
    slug: "jewelry-metal-color-test",
    title: "Jewelry metal color test",
    description: "Compare yellow gold, rose gold, silver, platinum, bronze, and mixed-metal directions with a working palette.",
    headline: "Choose a jewelry metal direction without rigid rules.",
    intent: "Shoppers deciding which metal finish to test near their face in natural light.",
  },
  {
    slug: "capsule-wardrobe-color-palette",
    title: "Capsule wardrobe color palette",
    description: "Start a capsule wardrobe with reliable neutrals, accent colors, and repeatable outfit color formulas.",
    headline: "Give your capsule wardrobe a repeatable color system.",
    intent: "People who want fewer pieces to coordinate more easily.",
  },
  {
    slug: "color-analysis-photo-tips",
    title: "Color analysis photo tips",
    description: "Improve color-analysis consistency with indirect daylight, neutral surroundings, and careful manual sample placement.",
    headline: "Take a more reliable color-analysis photo.",
    intent: "Anyone comparing multiple color-analysis results or troubleshooting unstable seasonal classifications.",
  },
  {
    slug: "soft-summer-vs-clear-winter",
    title: "Soft Summer vs Clear Winter",
    description: "Use contrast and clarity signals to understand why two cool palettes can recommend very different color intensity.",
    headline: "Compare soft cool color with crisp cool contrast.",
    intent: "People whose cool undertone result sits between muted Summer references and high-contrast Winter references.",
  },
  {
    slug: "bright-spring-vs-deep-autumn",
    title: "Bright Spring vs Deep Autumn",
    description: "Use depth, clarity, and contrast to compare two warm seasonal color directions.",
    headline: "Compare lively warm color with grounded warm depth.",
    intent: "People whose warm undertone result needs a clearer decision between bright and deep color families.",
  },
  {
    slug: "eyeglass-frame-color-finder",
    title: "Eyeglass frame color finder",
    description: "Use a working personal palette to shortlist eyeglass frame colors, metals, transparency, and contrast before trying frames in person.",
    headline: "Shortlist eyeglass frame colors before your next fitting.",
    intent: "Glasses shoppers comparing neutral, colorful, metal, tortoiseshell, and translucent frame options near the face.",
  },
  {
    slug: "workwear-color-palette",
    title: "Workwear color palette",
    description: "Build a coordinated workwear palette with dependable neutrals, shirts, layers, shoes, and repeatable accent colors.",
    headline: "Give your work wardrobe a practical color system.",
    intent: "Professionals planning office, hybrid, interview, or client-facing outfits with fewer color mismatches.",
  },
  {
    slug: "wedding-guest-outfit-color-palette",
    title: "Wedding guest outfit color palette",
    description: "Create a personal shortlist for wedding guest clothing, accessories, makeup, and metal colors while respecting the event dress code.",
    headline: "Choose wedding guest colors that fit you and the dress code.",
    intent: "Wedding guests narrowing outfit colors without treating a seasonal palette as a rigid rule or ignoring host guidance.",
  },
  {
    slug: "interview-outfit-color-palette",
    title: "Interview outfit color palette",
    description: "Build a practical interview outfit color shortlist with dependable neutrals, shirt colors, accent pieces, and metal choices.",
    headline: "Choose interview colors that feel polished and practical.",
    intent: "Job seekers who want a simple color plan for interviews without turning style into a personal judgment.",
  },
  {
    slug: "travel-capsule-wardrobe-colors",
    title: "Travel capsule wardrobe colors",
    description: "Plan a travel capsule color palette with repeatable neutrals, accent colors, shoes, layers, and laundry-friendly combinations.",
    headline: "Pack fewer colors that combine more easily.",
    intent: "Travelers building a small wardrobe that still works across weather, photos, dinners, and casual days.",
  },
  {
    slug: "nail-polish-color-palette-finder",
    title: "Nail polish color palette finder",
    description: "Shortlist nail polish color families that coordinate with a working palette, jewelry metals, and wardrobe neutrals.",
    headline: "Narrow nail polish colors before buying another bottle.",
    intent: "Shoppers comparing nude, red, berry, coral, taupe, navy, and metallic polish families.",
  },
  {
    slug: "scarf-color-finder",
    title: "Scarf color finder",
    description: "Use a personal palette to choose scarf colors that sit near the face and coordinate with coats, knits, and accessories.",
    headline: "Pick scarf colors that do more work near your face.",
    intent: "Shoppers using scarves to test accent colors before committing to larger wardrobe pieces.",
  },
  {
    slug: "handbag-shoe-color-palette",
    title: "Handbag and shoe color palette",
    description: "Create a handbag and shoe color shortlist with core neutrals, accent options, metal hardware, and wardrobe fit notes.",
    headline: "Make bag and shoe colors easier to repeat.",
    intent: "Shoppers deciding which accessory colors will coordinate with the most outfits.",
  },
  {
    slug: "black-white-contrast-outfit-checker",
    title: "Black and white contrast outfit checker",
    description: "Decide whether sharp black-and-white contrast, softer charcoal, cream, navy, or taupe combinations fit a working palette better.",
    headline: "Compare sharp contrast with softer neutrals.",
    intent: "People who like black and white but want to test whether lower-contrast neutrals may be easier to wear.",
  },
  {
    slug: "closet-color-audit-checklist",
    title: "Closet color audit checklist",
    description: "Audit closet colors against a practical palette to find repeatable neutrals, lonely accent pieces, and smarter future purchases.",
    headline: "Turn a messy closet into a color map.",
    intent: "People who want to shop less randomly and reuse more of what they already own.",
  },
  {
    slug: "online-shopping-color-checklist",
    title: "Online shopping color checklist",
    description: "Use a color checklist before online checkout to compare product photos, return rules, fabric finish, lighting, and palette fit.",
    headline: "Check color risk before online checkout.",
    intent: "Online shoppers trying to reduce returns caused by screen color, lighting, fabric sheen, or vague product names.",
  },
  {
    slug: "mens-wardrobe-color-palette",
    title: "Men's wardrobe color palette",
    description: "Build a practical men's wardrobe palette with suits, shirts, knits, outerwear, shoes, accessories, and repeatable color formulas.",
    headline: "Create a men's wardrobe color system that repeats well.",
    intent: "Men shopping for office, casual, interview, or event outfits with fewer mismatched pieces.",
  },
  {
    slug: "bridesmaid-dress-color-palette",
    title: "Bridesmaid dress color palette",
    description: "Compare bridesmaid dress color families with event guidance, skin-adjacent color comfort, accessories, and photo-lighting checks.",
    headline: "Choose bridesmaid colors with palette and event context.",
    intent: "Wedding parties narrowing dress colors while respecting the couple's palette, venue, and dress-code decisions.",
  },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pageHtml(page) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(page.title)} - ColorFitAI</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <link rel="canonical" href="${siteUrl}/${page.slug}/" />
    <meta property="og:title" content="${escapeHtml(page.title)} - ColorFitAI" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:image" content="${siteUrl}/color-studio.png" />
    <link rel="stylesheet" href="/styles.css" />
    <link rel="icon" href="/favicon.svg" />
  </head>
  <body>
    <header class="topbar"><a class="brand" href="/"><span class="brand-mark">C</span><span>ColorFitAI</span></a><nav><a href="/#analyzer">Analyzer</a><a href="/support.html">Support</a></nav></header>
    <main class="legal">
      <p class="eyebrow">Private color planning</p>
      <h1>${escapeHtml(page.headline)}</h1>
      <p>${escapeHtml(page.description)}</p>
      <h2>Best fit</h2>
      <p>${escapeHtml(page.intent)}</p>
      <h2>Use the result well</h2>
      <ol>
        <li>Start with an unfiltered photo in indirect daylight.</li>
        <li>Confirm the cheek, natural hair, and iris sample points yourself.</li>
        <li>Use the output to shortlist color families, not to eliminate personal favorites.</li>
        <li>Compare the real fabric, makeup sample, or metal near your face before buying.</li>
      </ol>
      <p><a class="primary-button" href="/#analyzer">Build a free palette</a></p>
      <h2>Accuracy boundary</h2>
      <p>Camera white balance, screen calibration, makeup, hair dye, reflected wall color, and sample placement can change the result. ColorFitAI does not infer identity, ethnicity, health, age, or attractiveness.</p>
      <p><a href="/support.html">Support</a> · <a href="https://tools.pagecheckai.com">More PageCheckAI tools</a></p>
    </main>
  </body>
</html>`;
}

await rm("dist", { force: true, recursive: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });

for (const page of pages) {
  await mkdir(`dist/${page.slug}`, { recursive: true });
  await writeFile(`dist/${page.slug}/index.html`, pageHtml(page));
}

await writeFile("dist/robots.txt", `User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
`);

const staticUrls = ["/", "/privacy.html", "/terms.html", "/support.html"];
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...pages.map((page) => `/${page.slug}/`)]
  .map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`)
  .join("\n")}
</urlset>
`,
);

console.log(`Built ColorFitAI with ${pages.length} SEO pages.`);
