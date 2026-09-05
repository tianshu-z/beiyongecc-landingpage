# 北雍文化商业智库官网

北雍官网与 ECC Calendar 的源代码。公开网站通过 GitHub Pages 发布；活动管理页面只在本地开发环境使用。

## 本地预览与管理

需要 Node.js 22 或更高版本。

```bash
npm install
npm run dev
```

打开：

- 官网：`http://localhost:3000/`
- 北雍日历：`http://localhost:3000/calendar`
- 本地活动管理：`http://localhost:3000/calendar/manage`

本地管理页使用本机的开发数据库与图片空间。编辑和保存只改变本地内容；点击“一键发布到官网”并再次确认后，才会更新 GitHub Pages。

## GitHub Pages 发布方式

公开活动快照维护在 `shared/calendar.ts`，活动图片保存在 `public/assets/calendar/`。生成静态网站：

```bash
npm run pages:build
```

结果会写入 `pages-dist/`。这里仅包含：

- 主页
- 关于北雍
- 北雍日历及活动详情
- 加入我们

`/calendar/manage` 不会进入静态发布结果。

推送到 `main` 后，`.github/workflows/deploy-pages.yml` 会自动重新构建并部署 GitHub Pages。

## 更新活动的日常流程

1. 运行 `npm run dev`，打开本地活动管理页面。
2. 新增、修改或删除活动，并在本地日历确认效果。
3. 点击“一键发布到官网”并确认。
4. 本地发布服务会自动整理活动与图片、完成静态构建检查、提交到 GitHub，并等待 GitHub Pages 更新成功。

这个流程刻意把“编辑”和“发布”分开，避免本地试改直接影响官网。

如需让本地管理页完全恢复为当前代码中保存的官网活动快照，可运行：

```bash
npm run calendar:reset-local
```
