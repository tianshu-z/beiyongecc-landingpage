import type { Metadata } from "next";
import {
  audiences,
  collaborations,
  identities,
  methods,
  questions,
  themes,
} from "../content";
import { PageHero, SectionLabel, SiteFooter, SiteHeader } from "../site-chrome";

export const metadata: Metadata = {
  title: "关于北雍",
  description:
    "认识北雍文化商业智库的定位、核心文明问题、研究方向、方法与合作方式。",
};

export default function AboutPage() {
  return (
    <main>
      <SiteHeader active="about" />
      <PageHero
        index="01"
        kicker="ABOUT BEIYONG"
        title="关于北雍"
        intro="一家以历史、制度与文明研究为基础的人文社会智库。我们从真实问题出发，在历史纵深、制度机制与文明比较中寻找判断与行动的尺度。"
      />

      <div id="content">
        <section className="section section-who">
          <SectionLabel index="02">POSITIONING</SectionLabel>
          <div className="section-heading heading-split">
            <div>
              <p className="eyebrow">WHO WE ARE</p>
              <h2>我们是谁</h2>
            </div>
            <div className="heading-copy">
              <p className="lead">
                一家以历史、制度与文明研究为基础的人文社会智库
              </p>
              <p>
                北雍关注的，不只是某一项政策、一个行业或一种短期趋势，而是现代世界如何形成，以及个人、家庭和组织如何在其中理解自己的位置。
              </p>
            </div>
          </div>

          <div className="identity-grid">
            {identities.map((item, index) => (
              <article className="identity-card" key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>

          <p className="closing-note">
            北雍不拒绝政策、商业和现实议题，但对这些议题的介入，不从即时立场或工具方案开始，而从历史形成、制度机制、文明比较与责任结构开始。
          </p>
        </section>

        <section className="section section-questions">
          <SectionLabel index="05">CORE QUESTIONS</SectionLabel>
          <div className="section-heading">
            <p className="eyebrow">OUR INQUIRY</p>
            <h2>五个核心文明问题</h2>
            <p className="lead">用稳定的问题，组织不断扩展的研究</p>
          </div>

          <div className="question-list">
            {questions.map((item, index) => (
              <article className="question-row" key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <i aria-hidden="true">↗</i>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-themes">
          <SectionLabel index="08">REPRESENTATIVE THEMES</SectionLabel>
          <div className="section-heading heading-light">
            <p className="eyebrow">CURRENT FOCUS</p>
            <h2>当前重点内容方向</h2>
            <p className="lead">从商业与科学，到艺术、经典与家庭记忆</p>
          </div>

          <div className="theme-grid">
            {themes.map((item, index) => (
              <article className="theme-card" key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-method">
          <SectionLabel index="09">METHOD</SectionLabel>
          <div className="section-heading method-heading">
            <p className="eyebrow">HOW WE THINK</p>
            <h2>我们的方法</h2>
            <p className="lead">
              不从“要讲什么知识”开始，而从“什么问题值得被认真面对”开始
            </p>
          </div>

          <div className="method-grid">
            {methods.map((item, index) => (
              <article className="method-card" key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-audience" id="cooperation">
          <SectionLabel index="10—12">AUDIENCE & COOPERATION</SectionLabel>
          <div className="audience-layout">
            <div className="audience-column">
              <div className="section-heading">
                <p className="eyebrow">FOR WHOM</p>
                <h2>我们面向谁</h2>
                <p className="lead">
                  公共性面向所有人，深度服务面向需要长期判断与责任能力的个人和组织
                </p>
              </div>
              <div className="audience-cards">
                {audiences.map((item) => (
                  <article key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="cooperation-column">
              <div className="section-heading">
                <p className="eyebrow">WORK WITH US</p>
                <h2>合作方式</h2>
                <p className="lead">从一个值得认真面对的问题开始</p>
              </div>
              <p className="cooperation-intro">
                北雍愿意与研究者、企业、家庭、教育机构、文化机构和公共项目发起者建立长期合作。
              </p>
              <div className="cooperation-list">
                {collaborations.map((item, index) => (
                  <article key={item.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>
              <a className="button button-primary" href="/join">
                联系我们
              </a>
            </div>
          </div>
        </section>

        <section className="quote-break">
          <p>
            “我们不从固定的产品菜单开始，而从问题、对象、材料与希望形成的成果开始。”
          </p>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
