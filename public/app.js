import { analyzePalette, computeImageStats, rgbToHex } from "./color-engine.js";

const fileInput = document.querySelector("#photoInput");
const canvas = document.querySelector("#photoCanvas");
const context = canvas.getContext("2d", { willReadFrequently: true });
const emptyCanvas = document.querySelector("#emptyCanvas");
const photoStatus = document.querySelector("#photoStatus");
const qualityDetails = document.querySelector("#qualityDetails");
const sampleButtons = [...document.querySelectorAll("[data-sample]")];
const sampleSwatches = {
  skin: document.querySelector("#skinSwatch"),
  hair: document.querySelector("#hairSwatch"),
  eyes: document.querySelector("#eyeSwatch"),
};
const analyzeButton = document.querySelector("#analyzeButton");
const resetButton = document.querySelector("#resetButton");
const resultPanel = document.querySelector("#resultPanel");
const exportButton = document.querySelector("#exportButton");
const copyButton = document.querySelector("#copyButton");
const proCode = document.querySelector("#proCode");
const proStatus = document.querySelector("#proStatus");
const activatePack = document.querySelector("#activatePack");
const downloadPack = document.querySelector("#downloadPack");

const LICENSE_VERIFY_URL = "https://namebatch.pagecheckai.com/api/licenses/verify";
const STORAGE_KEY = "colorfitai-paid-code";

let sourceImage = null;
let sourceUrl = "";
let photoStats = null;
let activeSample = "skin";
let result = null;
let paidPackActive = false;
let paidPackEntitlement = "";
let samples = {
  skin: { r: 194, g: 139, b: 112, x: 0.5, y: 0.5 },
  hair: { r: 67, g: 47, b: 40, x: 0.5, y: 0.24 },
  eyes: { r: 83, g: 76, b: 67, x: 0.4, y: 0.43 },
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sampleRegion(x, y, radius = 7) {
  const startX = Math.max(0, Math.round(x - radius));
  const startY = Math.max(0, Math.round(y - radius));
  const width = Math.min(canvas.width - startX, radius * 2 + 1);
  const height = Math.min(canvas.height - startY, radius * 2 + 1);
  const pixels = context.getImageData(startX, startY, width, height).data;
  const colors = [];
  for (let index = 0; index < pixels.length; index += 4) {
    const rgb = { r: pixels[index], g: pixels[index + 1], b: pixels[index + 2] };
    const max = Math.max(rgb.r, rgb.g, rgb.b);
    const min = Math.min(rgb.r, rgb.g, rgb.b);
    if (max > 248 || min < 7) continue;
    colors.push(rgb);
  }
  const usable = colors.length ? colors : [{ r: 128, g: 128, b: 128 }];
  return {
    r: Math.round(usable.reduce((sum, color) => sum + color.r, 0) / usable.length),
    g: Math.round(usable.reduce((sum, color) => sum + color.g, 0) / usable.length),
    b: Math.round(usable.reduce((sum, color) => sum + color.b, 0) / usable.length),
  };
}

function drawPhoto() {
  if (!sourceImage) return;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
  Object.entries(samples).forEach(([key, sample]) => {
    const x = sample.x * canvas.width;
    const y = sample.y * canvas.height;
    context.beginPath();
    context.arc(x, y, key === activeSample ? 10 : 7, 0, Math.PI * 2);
    context.strokeStyle = key === activeSample ? "#FFFFFF" : "rgba(255,255,255,.78)";
    context.lineWidth = key === activeSample ? 4 : 2;
    context.stroke();
    context.beginPath();
    context.arc(x, y, key === activeSample ? 13 : 10, 0, Math.PI * 2);
    context.strokeStyle = key === "skin" ? "#E86854" : key === "hair" ? "#17394A" : "#438472";
    context.lineWidth = 3;
    context.stroke();
  });
}

function updateSampleDisplay() {
  Object.entries(samples).forEach(([key, sample]) => {
    const swatch = sampleSwatches[key];
    swatch.style.backgroundColor = rgbToHex(sample);
    swatch.nextElementSibling.textContent = rgbToHex(sample);
  });
  sampleButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.sample === activeSample));
  drawPhoto();
}

function estimateSamples() {
  const points = {
    skin: { x: 0.5, y: 0.55 },
    hair: { x: 0.5, y: 0.2 },
    eyes: { x: 0.39, y: 0.43 },
  };
  Object.entries(points).forEach(([key, point]) => {
    samples[key] = {
      ...sampleRegion(point.x * canvas.width, point.y * canvas.height, key === "skin" ? 10 : 6),
      ...point,
    };
  });
  updateSampleDisplay();
}

async function loadPhoto(file) {
  if (!file) return;
  const fileType = file.type || "";
  const hasImageExtension = /\.(jpe?g|png|webp)$/i.test(file.name || "");
  if (!fileType.startsWith("image/") && !hasImageExtension) {
    photoStatus.textContent = "Choose a JPEG, PNG, or WebP image.";
    return;
  }
  if (file.size > 12 * 1024 * 1024) {
    photoStatus.textContent = "Choose an image smaller than 12 MB.";
    return;
  }
  invalidateResult("Loading a new photo. Analyze again after confirming the sample points.");
  if (sourceUrl) URL.revokeObjectURL(sourceUrl);
  sourceUrl = URL.createObjectURL(file);
  sourceImage = new Image();
  sourceImage.onload = () => {
    const scale = Math.min(1, 960 / Math.max(sourceImage.naturalWidth, sourceImage.naturalHeight));
    canvas.width = Math.max(320, Math.round(sourceImage.naturalWidth * scale));
    canvas.height = Math.max(320, Math.round(sourceImage.naturalHeight * scale));
    canvas.hidden = false;
    emptyCanvas.hidden = true;
    context.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
    photoStats = computeImageStats(context.getImageData(0, 0, canvas.width, canvas.height).data);
    estimateSamples();
    const warningText = photoStats.warnings.length ? photoStats.warnings.join(" ") : "Lighting looks usable for a first pass.";
    photoStatus.textContent = `${file.name} loaded locally.`;
    qualityDetails.innerHTML = `<strong>Photo quality ${photoStats.quality}/100</strong><span>${escapeHtml(warningText)}</span>`;
    analyzeButton.disabled = false;
  };
  sourceImage.src = sourceUrl;
}

function swatchList(colors) {
  return colors
    .map(([name, hex]) => `<li><span style="background:${hex}"></span><strong>${escapeHtml(name)}</strong><small>${hex}</small></li>`)
    .join("");
}

function resultText() {
  if (!result) return "";
  return [
    `ColorFitAI palette: ${result.name}`,
    `${result.summary}`,
    `Undertone signal: ${result.undertone}`,
    `Contrast: ${result.contrast}`,
    `Clarity: ${result.clarity}`,
    `Confidence: ${result.confidence}%`,
    "",
    `Clothing: ${result.clothing.map(([name, hex]) => `${name} ${hex}`).join(", ")}`,
    `Neutrals: ${result.neutrals.map(([name, hex]) => `${name} ${hex}`).join(", ")}`,
    `Makeup references: ${result.makeup.map(([name, hex]) => `${name} ${hex}`).join(", ")}`,
    `Jewelry: ${result.jewelry}`,
    `Hair color references: ${result.hair}`,
    "",
    "Use this as a shopping shortlist, not a rule. Lighting, camera processing, hair dye, makeup, and manual sample placement can change the result.",
  ].join("\n");
}

function currentSampleText() {
  return Object.entries(samples)
    .map(([label, sample]) => `${label}: ${rgbToHex(sample)}`)
    .join("\n");
}

function paidPackText() {
  const paletteText = resultText();
  const packName = paidPackEntitlement === "wardrobe_color_review_pack"
    ? "Wardrobe Color Review"
    : "Personal Palette Pack";
  const wardrobeSection = paidPackEntitlement === "wardrobe_color_review_pack"
    ? [
        "Wardrobe review workbook",
        "- Review up to 12 outfit or clothing photos on your own device.",
        "- Mark each item as keep, retest in daylight, tailor/style differently, or pause before replacing.",
        "- Note where color concerns are really fit, fabric, lighting, occasion, comfort, or styling concerns.",
        "- Build a gap list only after checking existing outfits and return policies.",
        "",
      ].join("\n")
    : [
        "Shopping checklist",
        "- Put the reliable neutrals first and add one accent color at a time.",
        "- Test fabric, makeup, and metal near your face in daylight before buying.",
        "- Keep favorites that work for your life even when they sit outside the palette.",
        "- Use product photos only as a starting point; dyes, screens, and lighting vary.",
        "",
      ].join("\n");

  return [
    `ColorFitAI paid download: ${packName}`,
    "Generated locally in this browser from the current palette result. The license check sends only an activation code and product name. Your photo, sampled colors, palette result, and wardrobe notes stay on this device unless you choose to share them.",
    "",
    "Confirmed samples",
    currentSampleText(),
    "",
    paletteText,
    "",
    wardrobeSection,
    "Boundaries",
    "- This is a practical color-shopping aid, not a professional certification.",
    "- It does not infer identity, ethnicity, health, age, body value, or attractiveness.",
    "- It does not guarantee that a color will flatter, fit, photograph well, sell, rank, or create revenue.",
    "- Compare real items in suitable light and follow merchant return policies before buying.",
  ].join("\n");
}

function updatePaidDownloadState(message) {
  if (downloadPack) downloadPack.disabled = !paidPackActive || !result;
  if (proStatus && message) proStatus.textContent = message;
}

function invalidateResult(message) {
  result = null;
  resultPanel.hidden = true;
  document.querySelector("#resultActions").hidden = true;
  updatePaidDownloadState(paidPackActive ? "Palette inputs changed. Analyze again before downloading the paid pack." : "Palette inputs changed. Analyze again before exporting.");
  if (message) photoStatus.textContent = message;
}

function setPaidPackActive(active, message, entitlement = "") {
  paidPackActive = active;
  paidPackEntitlement = active ? entitlement : "";
  updatePaidDownloadState(message);
}

function productFromCode(rawCode) {
  const code = rawCode.trim().toUpperCase();
  if (code.startsWith("CP-")) return { product: "colorfitai", entitlement: "personal_palette_pack" };
  if (code.startsWith("CW-")) return { product: "colorfitwardrobe", entitlement: "wardrobe_color_review_pack" };
  return null;
}

async function verifyPaidPackCode(rawCode, { quiet = false } = {}) {
  const code = rawCode.trim().toUpperCase();
  const product = productFromCode(code);
  if (!product) {
    setPaidPackActive(false, quiet ? "Enter a valid CP- or CW- code to unlock a color pack." : "That activation code format is not valid.");
    return false;
  }
  if (!quiet) proStatus.textContent = "Checking activation code...";
  try {
    const response = await fetch(LICENSE_VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code, product: product.product }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.valid || data.entitlement !== product.entitlement) {
      setPaidPackActive(false, "That activation code was not accepted for this ColorFitAI pack.");
      return false;
    }
    localStorage.setItem(STORAGE_KEY, code);
    const ready = result ? "Activation verified. Download your paid pack when ready." : "Activation verified. Build a palette, then download your paid pack.";
    setPaidPackActive(true, quiet ? ready : ready, product.entitlement);
    return true;
  } catch {
    setPaidPackActive(false, "Could not reach the license service. Try again, or use support with your PayPal receipt.");
    return false;
  }
}

function downloadPaidPack() {
  if (!paidPackActive) {
    setPaidPackActive(false, "Activate a color pack before downloading.");
    return;
  }
  if (!result) {
    updatePaidDownloadState("Build a palette before downloading the paid pack.");
    return;
  }
  const blob = new Blob([paidPackText()], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = paidPackEntitlement === "wardrobe_color_review_pack"
    ? "colorfitai-wardrobe-color-review.txt"
    : "colorfitai-personal-palette-pack.txt";
  link.click();
  URL.revokeObjectURL(link.href);
  updatePaidDownloadState("Paid pack downloaded locally.");
}

function renderResult() {
  result = analyzePalette(samples, photoStats?.quality ?? 60);
  resultPanel.hidden = false;
  resultPanel.innerHTML = `
    <div class="result-heading">
      <div>
        <p class="eyebrow">Your working palette</p>
        <h2>${escapeHtml(result.name)}</h2>
        <p>${escapeHtml(result.summary)}</p>
      </div>
      <div class="confidence"><strong>${result.confidence}%</strong><span>signal confidence</span></div>
    </div>
    <div class="signal-row">
      <div><span>Undertone</span><strong>${result.undertone}</strong></div>
      <div><span>Contrast</span><strong>${result.contrast}</strong></div>
      <div><span>Clarity</span><strong>${result.clarity}</strong></div>
    </div>
    <section class="palette-section">
      <h3>Start with these clothing colors</h3>
      <ul class="palette-grid">${swatchList(result.clothing)}</ul>
    </section>
    <div class="recommendation-grid">
      <section>
        <h3>Reliable neutrals</h3>
        <ul class="mini-palette">${swatchList(result.neutrals)}</ul>
      </section>
      <section>
        <h3>Makeup references</h3>
        <ul class="mini-palette">${swatchList(result.makeup)}</ul>
      </section>
      <section>
        <h3>Jewelry direction</h3>
        <p>${escapeHtml(result.jewelry)}</p>
      </section>
      <section>
        <h3>Hair color references</h3>
        <p>${escapeHtml(result.hair)}</p>
      </section>
    </div>
    <div class="boundary-note"><strong>Use this as a shortlist, not a rule.</strong> Lighting, camera processing, makeup, hair dye, and sample placement can change the result. Compare colors near your face in daylight before buying.</div>
  `;
  document.querySelector("#resultActions").hidden = false;
  updatePaidDownloadState(paidPackActive ? "Palette ready. Download your paid pack when ready." : "Palette ready. Enter a CP- or CW- code to unlock a paid pack.");
  resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function exportPalette() {
  if (!result) return;
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = 1200;
  exportCanvas.height = 920;
  const ctx = exportCanvas.getContext("2d");
  ctx.fillStyle = "#F7F5F0";
  ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
  ctx.fillStyle = "#17394A";
  ctx.font = "700 34px Arial";
  ctx.fillText("ColorFitAI", 72, 80);
  ctx.font = "700 66px Georgia";
  ctx.fillText(result.name, 72, 158);
  ctx.font = "28px Arial";
  ctx.fillStyle = "#44525A";
  ctx.fillText(`${result.undertone} undertone · ${result.contrast} contrast · ${result.clarity} clarity`, 72, 210);
  const colors = [...result.clothing, ...result.neutrals];
  colors.forEach(([name, hex], index) => {
    const column = index % 4;
    const row = Math.floor(index / 4);
    const x = 72 + column * 270;
    const y = 280 + row * 180;
    ctx.fillStyle = hex;
    ctx.fillRect(x, y, 220, 112);
    ctx.fillStyle = "#17394A";
    ctx.font = "700 24px Arial";
    ctx.fillText(name, x, y + 145);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#5F6B70";
    ctx.fillText(hex, x, y + 172);
  });
  ctx.fillStyle = "#44525A";
  ctx.font = "22px Arial";
  ctx.fillText("Daylight check recommended before buying. colorfit.pagecheckai.com", 72, 875);
  const link = document.createElement("a");
  link.href = exportCanvas.toDataURL("image/png");
  link.download = `colorfitai-${result.seasonKey}-palette.png`;
  link.click();
}

fileInput.addEventListener("change", () => loadPhoto(fileInput.files?.[0]));
sampleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeSample = button.dataset.sample;
    updateSampleDisplay();
  });
});
canvas.addEventListener("click", (event) => {
  if (!sourceImage) return;
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
  context.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
  samples[activeSample] = { ...sampleRegion(x, y), x: x / canvas.width, y: y / canvas.height };
  updateSampleDisplay();
  invalidateResult(`${activeSample[0].toUpperCase()}${activeSample.slice(1)} sample changed. Analyze again before exporting.`);
});
analyzeButton.addEventListener("click", renderResult);
resetButton.addEventListener("click", () => {
  fileInput.value = "";
  canvas.hidden = true;
  emptyCanvas.hidden = false;
  resultPanel.hidden = true;
  document.querySelector("#resultActions").hidden = true;
  qualityDetails.innerHTML = "<strong>Photo quality</strong><span>Waiting for a photo.</span>";
  photoStatus.textContent = "No photo selected.";
  analyzeButton.disabled = true;
  if (sourceUrl) URL.revokeObjectURL(sourceUrl);
  sourceUrl = "";
  sourceImage = null;
  photoStats = null;
  invalidateResult();
  updatePaidDownloadState(paidPackActive ? "Build a palette before downloading the paid pack." : "Build a palette, then enter the code from your PayPal confirmation.");
});
exportButton.addEventListener("click", exportPalette);
copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(resultText());
  copyButton.textContent = "Copied";
  setTimeout(() => {
    copyButton.textContent = "Copy shopping list";
  }, 1200);
});
activatePack?.addEventListener("click", () => verifyPaidPackCode(proCode.value));
downloadPack?.addEventListener("click", downloadPaidPack);

const savedCode = localStorage.getItem(STORAGE_KEY);
if (savedCode) {
  proCode.value = savedCode;
  verifyPaidPackCode(savedCode, { quiet: true });
}
