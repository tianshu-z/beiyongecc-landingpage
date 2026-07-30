import type { Metadata } from "next";
import { PageHero, SectionLabel, SiteFooter, SiteHeader } from "../site-chrome";

export const metadata: Metadata = {
  title: "加入我们",
  description: "关注北雍、联系我们，或与北雍共同工作。",
};

export default function JoinPage() {
  return (
    <main>
      <SiteHeader active="join" />
      <PageHero
        index="04"
        kicker="CONTACT & CAREERS"
        title="加入我们"
        intro="与认真面对问题的人同行。关注北雍的内容、发起合作，或成为我们的一员。"
      />

      <section className="section section-join standalone-section" id="content">
        <SectionLabel index="JOIN">THE COLLECTIVE</SectionLabel>
        <div className="join-hero join-hero-compact">
          <p className="eyebrow">JOIN THE COLLECTIVE</p>
          <h2>从关注，到同行</h2>
          <p>在内容、研究、教育与项目中，与北雍建立长期关系。</p>
        </div>

        <div className="join-grid">
          <div className="join-panel">
            <span className="panel-index">01</span>
            <h3>关注北雍</h3>
            <p>社交媒体账号与外部平台将在这里统一接入。</p>
            <div className="social-list">
              {["微信公众号", "视频号", "小红书", "Bilibili", "播客平台"].map(
                (item) => (
                  <div key={item}>
                    <span>{item}</span>
                    <small>账号待接入</small>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="join-panel">
            <span className="panel-index">02</span>
            <h3>联系我们</h3>
            <p>
              研究合作、内容共创、课程讲座与定制项目，欢迎从一个清晰的问题开始来信。
            </p>
            <div className="contact-placeholder">
              <span>EMAIL</span>
              <strong>联系邮箱待补充</strong>
            </div>
            <div className="contact-placeholder">
              <span>WECHAT</span>
              <strong>联系微信待补充</strong>
            </div>
          </div>

          <div className="join-panel careers">
            <span className="panel-index">03</span>
            <h3>与我们共事</h3>
            <p>招聘信息将按研究、内容与项目方向在此更新。</p>
            <div className="career-list">
              {["研究助理", "内容编辑", "项目合作伙伴"].map((item) => (
                <div key={item}>
                  <span>{item}</span>
                  <small>信息待发布</small>
                  <i>↗</i>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
