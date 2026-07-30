import type { Metadata } from "next";
import { PageHero, SectionLabel, SiteFooter, SiteHeader } from "../site-chrome";

export const metadata: Metadata = {
  title: "多媒体",
  description: "北雍的视频、播客、讲座与沙龙。",
};

export default function MediaPage() {
  return (
    <main>
      <SiteHeader active="media" />
      <PageHero
        index="03"
        kicker="VIDEO & PODCAST"
        title="多媒体"
        intro="把讲座、沙龙、视频与播客放在同一个知识脉络里，让一次观看或收听成为继续研究的入口。"
      />

      <section className="section section-media standalone-section" id="content">
        <SectionLabel index="MEDIA">WATCH & LISTEN</SectionLabel>
        <div className="section-heading heading-split">
          <div>
            <p className="eyebrow">OPEN ARCHIVE</p>
            <h2>观看与聆听</h2>
          </div>
          <p className="heading-copy lead">
            每一种媒介，都通向同一个问题现场。外部平台内容将在这里形成统一、连续的知识档案。
          </p>
        </div>

        <div className="media-grid">
          <article className="media-feature">
            <div className="media-feature-image">
              <span className="media-type">线下沙龙 · 视频回看</span>
              <button type="button" aria-label="视频链接待接入">
                <span>▶</span>
              </button>
            </div>
            <div className="media-copy">
              <p>科学的神话 · 第二章</p>
              <h3>从科尔贝尔到卡西尼：绝对主义国家如何组织科学</h3>
              <span>视频链接待接入 ↗</span>
            </div>
          </article>

          <article className="podcast-card">
            <div className="podcast-topline">
              <span>PODCAST</span>
              <span>EP. 001</span>
            </div>
            <div className="waveform" aria-hidden="true">
              {Array.from({ length: 30 }).map((_, index) => (
                <i key={index} />
              ))}
            </div>
            <div>
              <p>北雍声场</p>
              <h3>历史不是答案，而是问题被看见的方式</h3>
              <button type="button" aria-label="播客链接待接入">
                收听节目 <span>↗</span>
              </button>
            </div>
          </article>

          <article className="media-note">
            <p className="eyebrow">LINK PREVIEW</p>
            <h3>在一个页面里，建立跨平台的内容秩序</h3>
            <p>
              视频与播客条目将与文章一样，以外部链接接入并自动显示封面、标题、平台与简介。
            </p>
            <div>
              <span>视频</span>
              <span>播客</span>
              <span>讲座</span>
              <span>沙龙</span>
            </div>
          </article>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
