import type { Metadata } from "next";
import { PageHero, SiteFooter, SiteHeader } from "../site-chrome";
import { ArticleDirectory } from "./article-directory";

export const metadata: Metadata = {
  title: "文章",
  description: "北雍围绕商业、科学、艺术、制度与家庭责任持续展开的文章。",
};

export default function EssaysPage() {
  return (
    <main>
      <SiteHeader active="essays" />
      <PageHero
        kicker="ESSAYS & IDEAS"
        title="文章"
        intro="以历史打开现实问题，以叙事承载复杂知识。文章围绕五个主题持续更新。"
      />

      <section className="section section-editorial article-directory-section" id="content">
        <ArticleDirectory />
      </section>

      <SiteFooter />
    </main>
  );
}
