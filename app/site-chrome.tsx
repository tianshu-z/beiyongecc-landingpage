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
        <img className="brand-logo" src="/assets/ecc-seal.png" alt="" />
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
  index: string;
  kicker: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="page-hero" id="top">
      <div className="page-hero-index">
        <span>{index}</span>
        <i />
        <span>{kicker}</span>
      </div>
      <div className="page-hero-copy">
        <p className="eyebrow">{kicker}</p>
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
    <footer className="site-footer">
      <div className="footer-statement">
        <p>
          文明参与者，不只是欣赏文明、谈论文明的人，
          <br />
          而是在自己的生活、家庭、组织与公共世界中延续文明的人。
        </p>
        <h2>从理解世界，到参与世界。</h2>
      </div>
      <div className="footer-brand">
        <img src="/assets/ecc-seal.png" alt="" />
        <div>
          <strong>EURUS</strong>
          <strong>CULTURAL</strong>
          <strong>COLLECTIVE</strong>
        </div>
      </div>
      <div className="footer-bottom">
        <span>北雍文化商业智库 · 二〇二六年</span>
        <a href="#top">回到顶部 ↑</a>
      </div>
    </footer>
  );
}
