import type { ReactNode } from "react";

type ActivePage = "about" | "essays" | "media" | "join";

const navigation: Array<{
  key: ActivePage;
  label: string;
  href: string;
}> = [
  { key: "about", label: "关于北雍", href: "/about" },
  { key: "essays", label: "文章", href: "/essays" },
  { key: "media", label: "多媒体", href: "/media" },
  { key: "join", label: "加入我们", href: "/join" },
];

export function SiteHeader({ active }: { active?: ActivePage }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="返回北雍首页">
        <img className="brand-logo" src="/assets/印章北大红.svg" alt="" />
        <span>
          北雍文化商业智库
          <small>EURUS CULTURAL COLLECTIVE</small>
        </span>
      </a>

      <nav className="desktop-nav" aria-label="主导航">
        {navigation.map((item) => (
          <a
            className={active === item.key ? "is-active" : undefined}
            href={item.href}
            key={item.key}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <a className="header-cta" href="/about#cooperation">
        发起合作 <span>↗</span>
      </a>

      <details className="mobile-menu">
        <summary>菜单</summary>
        <nav aria-label="移动端导航">
          {navigation.map((item) => (
            <a
              className={active === item.key ? "is-active" : undefined}
              href={item.href}
              key={item.key}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </details>
    </header>
  );
}

export function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  return (
    <div className="section-label" aria-hidden="true">
      <span>{index}</span>
      <span>{children}</span>
      <i />
    </div>
  );
}

export function PageHero({
  index,
  kicker,
  title,
  intro,
}: {
  index?: string;
  kicker?: string;
  title: string;
  intro: string;
}) {
  const hasMeta = Boolean(index && kicker);

  return (
    <section
      className={hasMeta ? "page-hero" : "page-hero page-hero-no-meta"}
      id="top"
    >
      {hasMeta ? (
        <div className="page-hero-index">
          <span>{index}</span>
          <i />
          <span>{kicker}</span>
        </div>
      ) : null}
      <div className="page-hero-copy">
        {kicker ? <p className="eyebrow">{kicker}</p> : null}
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
      <a className="page-scroll" href="#content">
        进入内容 <span>↓</span>
      </a>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-main">
        <div className="footer-statement">
          <p>
            文明参与者，不只是欣赏文明、谈论文明的人，而是在自己的生活、家庭、组织与公共世界中延续文明的人。
          </p>
          <h2>从理解世界，到参与世界。</h2>
        </div>

        <div className="footer-seal" aria-label="北雍印章">
          <img src="/assets/印章北大红.svg" alt="" />
        </div>

        <div className="footer-social">
          <p className="eyebrow">关注我们 FOLLOW US</p>
          <div className="footer-qr-grid">
            <figure>
              <div
                aria-label="微信公众号北雍文化二维码"
                className="footer-qr-image footer-qr-wechat-new"
                role="img"
              />
              <figcaption>公众号<br />北雍文化</figcaption>
            </figure>
            <figure>
              <div
                aria-label="微信公众号北雍文化商业智库二维码"
                className="footer-qr-image footer-qr-wechat-old"
                role="img"
              />
              <figcaption>公众号<br />北雍文化商业智库</figcaption>
            </figure>
            <figure>
              <div
                aria-label="小红书北雍ECC二维码"
                className="footer-qr-image footer-qr-rednote"
                role="img"
              />
              <figcaption>小红书<br />北雍ECC</figcaption>
            </figure>
            <figure>
              <div
                aria-label="小宇宙播客北雍ECC二维码"
                className="footer-qr-image footer-qr-podcast"
                role="img"
              />
              <figcaption>小宇宙播客<br />北雍ECC</figcaption>
            </figure>
          </div>
          <div className="footer-contact">
            <a href="mailto:team@beiyongecc.org">
              <span>邮箱 EMAIL</span>
              <strong>team@beiyongecc.org</strong>
            </a>
            <div>
              <span>微信 WECHAT</span>
              <strong>eurusccpk</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>北雍文化商业智库 · 二〇二六年</span>
        <a href="#top">回到顶部 ↑</a>
      </div>
    </footer>
  );
}
