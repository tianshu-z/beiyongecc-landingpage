import type { Metadata } from "next";
import { PageHero, SiteFooter, SiteHeader } from "../site-chrome";

export const metadata: Metadata = {
  title: "加入我们",
  description: "关注北雍、联系我们，或与北雍共同工作。",
};

export default function JoinPage() {
  return (
    <main>
      <SiteHeader active="join" />
      <PageHero
        kicker="CONTACT & CAREERS"
        title="加入我们"
        intro="与认真面对问题的人同行。关注北雍的内容、发起合作，或成为我们的一员。"
      />

      <section className="section section-join standalone-section" id="content">
        <div className="join-hero join-hero-compact">
          <p className="eyebrow">JOIN THE COLLECTIVE</p>
          <h2>从关注，到同行</h2>
          <p>在内容、研究、教育与项目中，与北雍建立长期关系。</p>
        </div>

        <div className="join-grid">
          <article className="join-panel join-role-card">
            <span className="panel-index">01</span>
            <h3>研究伙伴</h3>
            <p>
              围绕北雍的五个研究主题，与我们共同推进长期、严谨且能够进入公共表达的研究。
            </p>
            <div className="join-jd">
              <h4>主要工作</h4>
              <ul>
                <li>参与选题、文献与案例研究，整理档案、访谈和相关材料。</li>
                <li>协助形成文章、讲座、课程、播客与专题研究成果。</li>
                <li>在项目中校核事实、梳理机制，并推动复杂知识的清晰表达。</li>
              </ul>
              <h4>我们期待</h4>
              <p>具有人文社会科学或跨学科训练，能够独立阅读和写作；尊重材料与事实，对长期研究保持耐心。</p>
            </div>
          </article>

          <article className="join-panel join-role-card">
            <span className="panel-index">02</span>
            <h3>内容和运营伙伴</h3>
            <p>让北雍的文章、视频、播客、活动与合作项目形成稳定、连贯的内容秩序。</p>
            <div className="join-jd">
              <h4>主要工作</h4>
              <ul>
                <li>参与文章、视频、播客及社交平台内容的策划、编辑与发布。</li>
                <li>管理内容排期、素材、外部平台链接与持续更新的内容档案。</li>
                <li>协助活动执行、用户沟通、合作对接与传播复盘。</li>
              </ul>
              <h4>我们期待</h4>
              <p>具有编辑、内容制作或平台运营经验；细致可靠，具备清晰沟通和多任务推进能力。</p>
            </div>
          </article>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
