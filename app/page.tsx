import { SectionLabel, SiteFooter, SiteHeader } from "./site-chrome";

const portals = [
  {
    index: "01",
    title: "关于北雍",
    english: "ABOUT BEIYONG",
    text: "认识我们是谁、面对什么问题，以及如何从历史走向现实行动。",
    href: "/about",
    className: "portal-about",
    image: "/assets/chinese-armillary-sphere-transparent.svg",
  },
  {
    index: "02",
    title: "文章",
    english: "ESSAYS & IDEAS",
    text: "进入商业史与金融史、艺术的B面与生活美学、文明史与制度史、技术文明等内容线索。",
    href: "/essays",
    className: "portal-essays",
    image: "/assets/ming-bookshelf-transparent-lineart.svg",
  },
  {
    index: "03",
    title: "多媒体",
    english: "VIDEO & PODCAST",
    text: "观看讲座、沙龙与视频，收听北雍播客。",
    href: "/media",
    className: "portal-media",
    image: "/assets/bianzhong-transparent-lineart.svg",
  },
  {
    index: "04",
    title: "加入我们",
    english: "CONTACT & CAREERS",
    text: "关注北雍、发起合作，或成为共同研究与行动的一员。",
    href: "/join",
    className: "portal-join",
    image: "/assets/zhaozhou-dragon-lockstone-closing-transparent.svg",
  },
];

export default function Home() {
  return (
    <main id="top">
      <SiteHeader />

      <section className="hero">
        <div className="hero-rail" aria-hidden="true">
          <span>HISTORY</span>
          <i />
          <span>INSTITUTION</span>
          <i />
          <span>CIVILIZATION</span>
        </div>

        <div className="hero-content">
          <p className="eyebrow">以历史为方法 · 以文明为尺度</p>
          <img
            className="hero-mark"
            src="/assets/北雍两个字北大红.svg"
            alt="北雍"
          />
          <img
            className="hero-seal"
            src="/assets/印章北大红.svg"
            alt=""
            aria-hidden="true"
          />
          <h1>北雍文化商业智库</h1>
          <p className="hero-intro">
            以公共判断力与文明参与能力为目标的研究型智库
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/about">
              认识北雍
            </a>
            <a className="text-link" href="/essays">
              阅读我们的内容 <span>↗</span>
            </a>
          </div>
        </div>

        <div className="hero-corner">
          <span>文明研究 · 公共表达 · 教育实践 · 现实项目</span>
        </div>
      </section>

      <section className="manifesto" id="manifesto">
        <p className="manifesto-kicker">OUR POSITION</p>
        <h2>
          为现实建立历史坐标
          <br />
          为行动提供文明尺度
        </h2>
        <p>
          北雍文化商业智库是一家以历史为方法、以文明为尺度，
          <br />
          以公共判断力与文明参与能力为目标的研究型智库。
        </p>
      </section>

      <section className="section homepage-portals">
        <div className="section-heading heading-split">
          <div>
            <p className="eyebrow">EXPLORE BEIYONG</p>
            <h2>从这里进入北雍</h2>
          </div>
        </div>

        <div className="portal-grid">
          {portals.map((portal) => (
            <a
              className={`portal-card ${portal.className}`}
              href={portal.href}
              key={portal.title}
            >
              <img
                className="portal-art"
                src={portal.image}
                alt=""
                aria-hidden="true"
              />
              <span className="portal-art-tint" aria-hidden="true" />
              <span className="portal-index">{portal.index}</span>
              <div>
                <small>{portal.english}</small>
                <h3>{portal.title}</h3>
                <p>{portal.text}</p>
              </div>
              <i>↗</i>
            </a>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
