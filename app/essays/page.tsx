import type { Metadata } from "next";
import { editorial } from "../content";
import { PageHero, SectionLabel, SiteFooter, SiteHeader } from "../site-chrome";

export const metadata: Metadata = {
  title: "文章",
  description: "北雍的商业史、艺术的背面与科学的神话。",
};

export default function EssaysPage() {
  return (
    <main>
      <SiteHeader active="essays" />
      <PageHero
        index="02"
        kicker="ESSAYS & IDEAS"
        title="文章"
        intro="以历史打开现实问题，以叙事承载复杂知识。这里汇聚北雍持续展开的三条内容线索。"
      />

      <section className="section section-editorial standalone-section" id="content">
        <SectionLabel index="JOURNAL">BEIYONG JOURNAL</SectionLabel>
        <div className="editorial-header">
          <div className="section-heading heading-light">
            <p className="eyebrow">THREE COLUMNS</p>
            <h2>持续展开的三条线索</h2>
            <p className="lead">从商业与制度，到观看、实验与公共知识</p>
          </div>
          <div className="category-nav" aria-label="文章分类">
            <a href="#commercial-history">商业史</a>
            <a href="#art-behind">艺术的背面</a>
            <a href="#science-myth">科学的神话</a>
          </div>
        </div>

        <div className="auto-source-note">
          <span>LINK PREVIEW</span>
          <p>
            后续只需录入微信公众号或其他平台链接，即可自动抓取封面、标题与开头摘要。
          </p>
        </div>

        <div className="editorial-grid">
          {editorial.map((item, index) => (
            <article
              className={`article-card ${item.className}`}
              id={
                index === 0
                  ? "commercial-history"
                  : index === 1
                    ? "art-behind"
                    : "science-myth"
              }
              key={item.title}
            >
              <div className="article-cover" aria-hidden="true">
                <span>{item.category}</span>
              </div>
              <div className="article-body">
                <div>
                  <span className="article-category">{item.category}</span>
                  <span className="article-source">外部链接 · 待接入</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
                <button type="button" aria-label={`${item.title}，链接待接入`}>
                  阅读文章 <span>↗</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
