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
  ["calendar.jpg", "assets/calendar/published/science-myth-uk-france-transition-poster.webp"],
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

await mkdir(outputRoot, { recursive: true });
for (const legacy of ["home", "about", "calendar", "join", "essays", "media"]) {
  await unlink(join(outputRoot, `${legacy}.png`)).catch(() => undefined);
}
for (const card of cards) await renderCard(...card);
await renderIcon(192);
await renderIcon(512);
console.log("已生成全站分享卡片与方形网站图标。");
