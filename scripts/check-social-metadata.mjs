import { access, readFile, readdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const output = join(root, "pages-dist");
const requiredOpenGraph = [
  "og:title",
  "og:description",
  "og:type",
  "og:url",
  "og:site_name",
  "og:image",
];

async function htmlFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await htmlFiles(absolute));
    if (entry.isFile() && entry.name === "index.html") result.push(absolute);
  }
  return result;
}

for (const file of await htmlFiles(output)) {
  const html = await readFile(file, "utf8");
  const missing = requiredOpenGraph.filter(
    (property) => !html.includes(`property="${property}"`),
  );
  if (!html.includes('rel="canonical"')) missing.push("canonical");
  if (missing.length) {
    throw new Error(`${file} 缺少分享信息：${missing.join("、")}`);
  }

  const imageUrl = html.match(
    /<meta[^>]*property="og:image"[^>]*content="([^"]+)"/,
  )?.[1];
  if (!imageUrl || !/\.(?:png|jpe?g)$/i.test(imageUrl)) {
    throw new Error(`${file} 的分享图必须是 PNG 或 JPG。`);
  }

  const imagePath = join(output, new URL(imageUrl).pathname.replace(/^\/+/, ""));
  await access(imagePath);
  if ((await stat(imagePath)).size > 500 * 1024) {
    throw new Error(`${file} 的分享图超过 500 KB。`);
  }
}

const home = await readFile(join(output, "index.html"), "utf8");
if (!home.includes('rel="apple-touch-icon"')) {
  throw new Error("首页缺少微信可读取的 PNG 方形图标。");
}

console.log("分享卡片检查通过：所有公开页面均包含完整元数据和兼容图片。");
