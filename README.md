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

本地管理页使用本机的开发数据库与图片空间，不会直接改动 GitHub Pages 上的公开数据。

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

1. 在本地管理页新增或修改活动，确认页面效果。
2. 将最终活动资料同步到 `shared/calendar.ts`，并将海报、二维码放入 `public/assets/calendar/`。
3. 运行 `npm run pages:build` 做本地静态构建检查。
4. 确认无误后再提交并推送到 GitHub；GitHub Actions 会更新公开网站。

这个流程刻意把“编辑”和“发布”分开，避免本地试改直接影响官网。
