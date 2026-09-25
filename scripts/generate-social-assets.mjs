import { mkdir, unlink } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const publicRoot = join(root, "public");
const outputRoot = join(publicRoot, "share");
const paper = { r: 247, g: 243, b: 235, alpha: 1 };

const cards = [
  ["home.jpg", "og.png"],
  ["about.jpg", "assets/chinese-armillary-sphere-transparent.svg"],
  ["join.jpg", "assets/zhaozhou-dragon-lockstone-closing-transparent.svg"],
  ["essays.jpg", "assets/ming-bookshelf-transparent-lineart.svg"],
  ["media.jpg", "assets/bianzhong-transparent-lineart.svg"],
];

async function renderCard(outputName, sourceName) {
  const source = join(publicRoot, sourceName);
  const output = join(outputRoot, outputName);

  if (sourceName === "og.png") {
    await sharp(source)
      .resize(1200, 630, { fit: "cover" })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(output);
    return;
  }

  const foreground = await sharp(source)
    .resize(980, 520, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: paper,
    },
  })
    .composite([{ input: foreground, gravity: "centre" }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(output);
}

async function renderIcon(size) {
  const seal = await sharp(join(publicRoot, "assets", "印章北大红.svg"))
    .resize(Math.round(size * 0.68), Math.round(size * 0.78), {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: paper,
    },
  })
    .composite([{ input: seal, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toFile(join(outputRoot, `icon-${size}.png`));
}

async function renderCalendarCard() {
  const columns = Array.from({ length: 8 }, (_, index) => {
    const x = 80 + index * (1040 / 7);
    return `<path d="M ${x} 318 V 560" />`;
  }).join("");
  const rows = [318, 368, 432, 496, 560]
    .map((y) => `<path d="M 80 ${y} H 1120" />`)
    .join("");
  const dates = [
    [101, 405, "1"], [250, 405, "2"], [398, 405, "3"],
    [547, 405, "4"], [696, 405, "5"], [844, 405, "6"],
    [993, 405, "7"], [101, 469, "8"], [250, 469, "9"],
    [390, 469, "10"], [539, 469, "11"], [688, 469, "12"],
    [836, 469, "13"], [985, 469, "14"],
  ].map(([x, y, value]) => `<text x="${x}" y="${y}">${value}</text>`).join("");

  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#f7f3eb"/>
      <path d="M 80 72 H 1120" stroke="#a80000" stroke-width="3"/>
      <text x="80" y="173" fill="#1e1d1a" font-family="Georgia, serif" font-size="78" letter-spacing="8">ECC CALENDAR</text>
      <text x="82" y="248" fill="#a80000" font-family="Songti SC, Noto Serif CJK SC, STSong, serif" font-size="48" letter-spacing="10">北雍日历</text>
      <g fill="none" stroke="#d0c5b7" stroke-width="2">${columns}${rows}</g>
      <g fill="#81796f" font-family="Georgia, serif" font-size="23">${dates}</g>
      <rect x="825" y="386" width="275" height="48" fill="#a80000"/>
      <text x="846" y="418" fill="#fffaf2" font-family="Songti SC, Noto Serif CJK SC, STSong, serif" font-size="20" letter-spacing="3">活动 · 课程 · 论坛</text>
      <path d="M 80 590 H 1120" stroke="#a80000" stroke-width="1"/>
    </svg>`;

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(join(outputRoot, "calendar.jpg"));
}

await mkdir(outputRoot, { recursive: true });
for (const legacy of ["home", "about", "calendar", "join", "essays", "media"]) {
  await unlink(join(outputRoot, `${legacy}.png`)).catch(() => undefined);
}
for (const card of cards) await renderCard(...card);
await renderCalendarCard();
await renderIcon(192);
await renderIcon(512);
console.log("已生成全站分享卡片与方形网站图标。");
