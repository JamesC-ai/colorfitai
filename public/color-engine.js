export const seasonalPalettes = {
  spring: {
    name: "Bright Spring",
    summary: "Warm, lively color with a clear finish.",
    clothing: [
      ["Coral", "#F16F61"],
      ["Warm turquoise", "#20A6A2"],
      ["Daffodil", "#F3C745"],
      ["Leaf green", "#68A84F"],
      ["Tomato red", "#D94A3A"],
      ["Peach", "#F5A47F"],
      ["Clear navy", "#244B73"],
      ["Ivory", "#FFF3D8"],
    ],
    neutrals: [["Ivory", "#FFF3D8"], ["Camel", "#BE9161"], ["Warm navy", "#294A66"], ["Cocoa", "#6B4A3D"]],
    makeup: [["Peach blush", "#E99072"], ["Coral lip", "#CF5A50"], ["Warm rose", "#B96566"], ["Apricot", "#E9A06E"]],
    jewelry: "Yellow gold, warm rose gold, and bright mixed metals usually echo this palette.",
    hair: "Warm chestnut, honey, caramel, and softly golden tones are the most harmonious starting points.",
  },
  summer: {
    name: "Soft Summer",
    summary: "Cool, calm color with a softened finish.",
    clothing: [
      ["Dusty rose", "#B97886"],
      ["Soft teal", "#478C8D"],
      ["Lavender", "#8E82A7"],
      ["Denim blue", "#56789B"],
      ["Raspberry", "#A44562"],
      ["Sage", "#849780"],
      ["Soft navy", "#344A66"],
      ["Pearl", "#F1EDEF"],
    ],
    neutrals: [["Pearl", "#F1EDEF"], ["Mushroom", "#9A8E8B"], ["Soft navy", "#344A66"], ["Charcoal", "#4D5159"]],
    makeup: [["Rose blush", "#B66F7C"], ["Berry lip", "#934C61"], ["Mauve", "#8E667D"], ["Cool pink", "#C9849B"]],
    jewelry: "Silver, white gold, platinum, and softly brushed metals usually sit naturally here.",
    hair: "Ash brown, mushroom brown, cool beige, and softly blended highlights are practical references.",
  },
  autumn: {
    name: "Deep Autumn",
    summary: "Warm, grounded color with rich depth.",
    clothing: [
      ["Rust", "#A94F32"],
      ["Olive", "#66733C"],
      ["Petrol teal", "#176B68"],
      ["Mustard", "#C28B24"],
      ["Brick", "#8F3E32"],
      ["Aubergine", "#623B50"],
      ["Forest", "#28513E"],
      ["Oatmeal", "#D7C2A2"],
    ],
    neutrals: [["Oatmeal", "#D7C2A2"], ["Camel", "#A8794F"], ["Espresso", "#3C2922"], ["Warm charcoal", "#484541"]],
    makeup: [["Terracotta", "#A95D48"], ["Brick lip", "#883F3C"], ["Cinnamon", "#9B654E"], ["Warm berry", "#7A3F4A"]],
    jewelry: "Antique gold, bronze, copper, and textured mixed metals reinforce the grounded depth.",
    hair: "Espresso, deep chestnut, copper brown, and dimensional caramel are useful references.",
  },
  winter: {
    name: "Clear Winter",
    summary: "Cool, crisp color with decisive contrast.",
    clothing: [
      ["Cobalt", "#2358B8"],
      ["Fuchsia", "#C92F77"],
      ["Emerald", "#008267"],
      ["True red", "#C92835"],
      ["Icy blue", "#B9DDF1"],
      ["Royal purple", "#60449A"],
      ["Black", "#17191D"],
      ["Optic white", "#FFFFFF"],
    ],
    neutrals: [["Optic white", "#FFFFFF"], ["Cool gray", "#7B828A"], ["Ink navy", "#162B4D"], ["Black", "#17191D"]],
    makeup: [["Blue-red lip", "#A82139"], ["Berry", "#862C5A"], ["Cool rose", "#B45D79"], ["Plum", "#6D3C61"]],
    jewelry: "Silver, white gold, platinum, and bright polished metals match the clean contrast.",
    hair: "Cool espresso, neutral black-brown, blue-black, and cool-toned dimension are useful references.",
  },
};

function linearize(channel) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function rgbToHex({ r, g, b }) {
  return `#${[r, g, b]
    .map((channel) => Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

export function relativeLuminance({ r, g, b }) {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

export function rgbToHsl({ r, g, b }) {
  const values = [r, g, b].map((channel) => channel / 255);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const lightness = (max + min) / 2;
  const delta = max - min;
  if (!delta) return { h: 0, s: 0, l: lightness * 100 };
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue;
  if (max === values[0]) hue = ((values[1] - values[2]) / delta) % 6;
  else if (max === values[1]) hue = (values[2] - values[0]) / delta + 2;
  else hue = (values[0] - values[1]) / delta + 4;
  return { h: ((hue * 60) + 360) % 360, s: saturation * 100, l: lightness * 100 };
}

export function rgbToLab(rgb) {
  const r = linearize(rgb.r);
  const g = linearize(rgb.g);
  const b = linearize(rgb.b);
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const pivot = (value) => (value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116);
  const fx = pivot(x);
  const fy = pivot(y);
  const fz = pivot(z);
  return { l: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

export function computeImageStats(data) {
  let count = 0;
  let sum = 0;
  let squareSum = 0;
  let red = 0;
  let green = 0;
  let blue = 0;
  const step = Math.max(4, Math.floor(data.length / 16000 / 4) * 4);

  for (let index = 0; index < data.length; index += step) {
    const alpha = data[index + 3];
    if (alpha < 200) continue;
    const luminance = 0.2126 * data[index] + 0.7152 * data[index + 1] + 0.0722 * data[index + 2];
    count += 1;
    sum += luminance;
    squareSum += luminance ** 2;
    red += data[index];
    green += data[index + 1];
    blue += data[index + 2];
  }

  if (!count) return { brightness: 0, contrast: 0, colorCast: 255, quality: 0, warnings: ["Photo could not be sampled."] };
  const brightness = sum / count;
  const contrast = Math.sqrt(Math.max(0, squareSum / count - brightness ** 2));
  const channels = [red / count, green / count, blue / count];
  const colorCast = Math.max(...channels) - Math.min(...channels);
  const warnings = [];
  if (brightness < 58) warnings.push("The photo is dark. Try even window light.");
  if (brightness > 218) warnings.push("Highlights look overexposed. Move away from direct sun.");
  if (contrast < 22) warnings.push("The photo has low contrast or haze.");
  if (colorCast > 48) warnings.push("A strong color cast may shift the palette.");
  const quality = Math.max(20, Math.round(100 - warnings.length * 18 - Math.max(0, colorCast - 28) * 0.3));
  return { brightness: Math.round(brightness), contrast: Math.round(contrast), colorCast: Math.round(colorCast), quality, warnings };
}

export function analyzePalette(samples, photoQuality = 80) {
  const skinLab = rgbToLab(samples.skin);
  const skinHsl = rgbToHsl(samples.skin);
  const hairHsl = rgbToHsl(samples.hair);
  const eyeHsl = rgbToHsl(samples.eyes);
  const warmthScore = skinLab.b - skinLab.a * 0.42 - 8;
  const undertone = warmthScore > 3 ? "Warm" : warmthScore < -1.5 ? "Cool" : "Neutral";
  const contrastValue = Math.abs(relativeLuminance(samples.skin) - relativeLuminance(samples.hair));
  const contrast = contrastValue > 0.43 ? "High" : contrastValue > 0.22 ? "Medium" : "Low";
  const clarityValue = (hairHsl.s + eyeHsl.s) / 2;
  const clarity = clarityValue > 43 ? "Clear" : clarityValue < 23 ? "Soft" : "Balanced";
  const deep = skinHsl.l < 58 || contrast === "High";
  const clear = clarity === "Clear" || contrast === "High";

  let seasonKey;
  if (undertone === "Warm") seasonKey = deep && !clear ? "autumn" : deep ? "autumn" : "spring";
  else if (undertone === "Cool") seasonKey = deep || clear ? "winter" : "summer";
  else if (deep || clear) seasonKey = warmthScore >= 0.5 ? "autumn" : "winter";
  else seasonKey = warmthScore >= 0.5 ? "spring" : "summer";

  const signalStrength = Math.min(16, Math.abs(warmthScore) * 2.2);
  const confidence = Math.max(38, Math.min(88, Math.round(photoQuality * 0.55 + 27 + signalStrength)));
  return {
    seasonKey,
    ...seasonalPalettes[seasonKey],
    undertone,
    contrast,
    clarity,
    confidence,
    sampleHex: {
      skin: rgbToHex(samples.skin),
      hair: rgbToHex(samples.hair),
      eyes: rgbToHex(samples.eyes),
    },
  };
}
