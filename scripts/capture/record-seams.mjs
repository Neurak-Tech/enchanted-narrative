import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "output");
fs.mkdirSync(outDir, { recursive: true });

const url = "http://localhost:8080/enchanted-narrative/";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  recordVideo: { dir: outDir, size: { width: 390, height: 844 } },
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForSelector("h1", { timeout: 15000 });
await page.waitForTimeout(1200);

const seams = await page.evaluate(() =>
  [...document.querySelectorAll("section")]
    .map((s, i, all) => ({
      id: s.id || `section-${i}`,
      join: all[i + 1] ? s.offsetTop + s.offsetHeight : null,
    }))
    .filter((s) => s.join != null),
);

const shots = [];
for (const seam of seams) {
  const y = Math.max(0, seam.join - 422);
  await page.evaluate((scrollY) => {
    const lenis = window.__smoothScroll;
    if (lenis?.scrollTo) lenis.scrollTo(scrollY, { immediate: true });
    else window.scrollTo(0, scrollY);
  }, y);
  await page.waitForTimeout(850);
  const file = path.join(outDir, `seam-${seam.id}.png`);
  await page.screenshot({ path: file });
  shots.push({ id: seam.id, y, file });
}

const maxY = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
for (let i = 0; i <= 160; i++) {
  const y = Math.round((maxY * i) / 160);
  await page.evaluate((scrollY) => {
    const lenis = window.__smoothScroll;
    if (lenis?.scrollTo) lenis.scrollTo(scrollY, { immediate: true });
    else window.scrollTo(0, scrollY);
  }, y);
  await page.waitForTimeout(55);
}

await page.waitForTimeout(600);
const video = page.video();
await context.close();
await browser.close();

const webmPath = path.join(outDir, "section-seams-scroll.webm");
await video.saveAs(webmPath);

const mp4Path = path.join(outDir, "section-seams-scroll.mp4");
const ff = spawnSync(
  "ffmpeg",
  ["-y", "-i", webmPath, "-c:v", "libx264", "-pix_fmt", "yuv420p", mp4Path],
  { stdio: "pipe" },
);

const result = {
  video: ff.status === 0 ? mp4Path : webmPath,
  webm: webmPath,
  shots,
  seams,
};
fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
