const identities = [
  {
    title: "研究机构",
    text: "积累专题研究、历史材料、原始文献、制度案例与概念框架，形成可持续的知识资产。",
  },
  {
    title: "公共知识机构",
    text: "通过文章、视频、讲座、播客与沙龙，让具有历史深度的知识进入公共讨论。",
  },
  {
    title: "文明教育机构",
    text: "把研究转化为课程、工作坊与研学，使知识进一步形成感受、理解、判断与责任。",
  },
  {
    title: "研究咨询与文明项目机构",
    text: "面向企业、家庭与文化机构，提供历史研究、制度分析、组织叙事与项目设计。",
  },
];

const questions = [
  {
    title: "人如何感受世界？",
    text: "艺术、审美、身体、感官、音乐、园林、建筑、器物与日常生活，如何塑造人的注意力和经验。",
  },
  {
    title: "人如何理解自身所处的历史？",
    text: "中国文明、世界史、经典、传统、宗教、帝国、民族国家与全球秩序，如何构成我们的历史坐标。",
  },
  {
    title: "知识与制度如何形成？",
    text: "科学、技术、大学、实验室、国家、官僚制、组织与基础设施，如何生产权威并改变社会。",
  },
  {
    title: "资源、权力与责任如何结合？",
    text: "企业、市场、金融、财政、战争、信用与公共权力，如何共同塑造现代世界。",
  },
  {
    title: "个人、家庭和组织如何参与文明？",
    text: "判断、行动、家庭传承、组织治理、收藏赞助与公共项目，如何形成可被继承的文明成果。",
  },
];

const themes = [
  {
    title: "商业史与金融史",
    text: "公司、市场、货币、信用、债务、金融机构、国家财政、战争融资与全球商业秩序。",
  },
  {
    title: "科学社会学与技术文明",
    text: "知识生产、通信网络、实验制度、大学与实验室、工业系统、数字基础设施与人工智能。",
  },
  {
    title: "艺术史与生活美学",
    text: "绘画、音乐、建筑、园林、器物、身体与注意力，以及“美学正念·四季”等教育实践。",
  },
  {
    title: "文明史、制度史与中国经典",
    text: "中国文明、世界历史、政治制度、宗教、礼仪、经典及《诗经》进入现代生活的方式。",
  },
  {
    title: "家庭史、地方史与公共责任",
    text: "故乡、迁徙、职业、代际记忆、家庭档案、口述史，以及私人资源与公共文化的关系。",
  },
];

const methods = [
  {
    title: "问题先于学科",
    text: "跨学科不是自由联想，而是让不同知识服务于同一个真实问题。",
  },
  {
    title: "历史语境优先",
    text: "把人物、制度、作品和事件放回其时代的资源、观念、技术与约束之中。",
  },
  {
    title: "区分事实、机制、价值与行动",
    text: "先说明发生了什么和为何发生，再讨论何者值得维护以及现实中如何行动。",
  },
  {
    title: "重视原始材料",
    text: "尽可能进入文献、档案、图像、地图、器物、数据、访谈与历史现场。",
  },
  {
    title: "从历史回到当下",
    text: "借历史看见今天的问题结构，同时明确类比的边界。",
  },
  {
    title: "清晰表达而不牺牲复杂性",
    text: "通过叙事、结构、案例与概念设计，让复杂问题能够被理解而不被简化。",
  },
];

const audiences = [
  {
    title: "公众与知识共同体",
    text: "通过文章、视频、讲座、出版与沙龙，建立开放而持续的文明讨论。",
  },
  {
    title: "企业家与管理者",
    text: "提供商业史、金融史、科技文明、制度环境、组织判断与治理责任相关的研究和教育。",
  },
  {
    title: "家庭与下一代",
    text: "帮助家庭建立历史意识、代际对话、文化能力与公共责任，形成能够保存的共同成果。",
  },
  {
    title: "企业、教育与文化机构",
    text: "提供专题研究、课程系统、白皮书、机构史、内容策划、研学与公共项目。",
  },
];

const collaborations = [
  {
    title: "研究合作",
    text: "共同开展专题研究、案例整理、报告与出版，连接学术资源与现实问题。",
  },
  {
    title: "内容共创",
    text: "围绕商业史、金融史、科学史、艺术史、经典与制度议题，共同开发文章、视频、播客与讲座。",
  },
  {
    title: "课程与讲座",
    text: "根据对象与场景，设计公开讲座、系列课程、工作坊、研学与组织学习项目。",
  },
  {
    title: "定制研究与文明项目",
    text: "围绕企业、家庭或机构的具体问题，形成研究、档案、叙事、教育与公共项目成果。",
  },
];

const editorial = [
  {
    category: "商业史",
    title: "公司如何成为现代世界的基本组织",
    excerpt:
      "从特许公司、远洋贸易到现代治理，重新理解公司并不只是一种商业工具。",
    className: "commerce",
  },
  {
    category: "艺术的背面",
    title: "被观看的画，与观看它的人",
    excerpt:
      "艺术的背面，是材料、制度、空间、权力，也是我们观看世界时不曾察觉的习惯。",
    className: "art",
  },
  {
    category: "科学的神话",
    title: "从内战到皇家学会：商业都市、公共舆论与实验事实",
    excerpt:
      "科学不仅发生在实验室，也发生在制度、城市、赞助网络与公共判断之中。",
    className: "science",
  },
];

function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-label" aria-hidden="true">
      <span>{index}</span>
      <span>{children}</span>
      <i />
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="返回北雍首页">
          <span className="brand-seal">北</span>
          <span>
            北雍文化商业智库
            <small>EURUS CULTURAL COLLECTIVE</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="主导航">
          <a href="#about">关于北雍</a>
          <a href="#essays">文章</a>
          <a href="#media">多媒体</a>
          <a href="#join">加入我们</a>
        </nav>

        <a className="header-cta" href="#cooperation">
          发起合作 <span>↗</span>
        </a>

        <details className="mobile-menu">
          <summary>菜单</summary>
          <nav aria-label="移动端导航">
            <a href="#about">关于北雍</a>
            <a href="#essays">文章</a>
            <a href="#media">多媒体</a>
            <a href="#join">加入我们</a>
          </nav>
        </details>
      </header>

      <section className="hero" id="top">
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
            src="/assets/beiyong-mark.png"
            alt="北雍"
          />
          <h1>北雍文化商业智库</h1>
          <p className="hero-intro">
            以公共判断力与文明参与能力为目标的研究型智库
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#about">
              认识北雍
            </a>
            <a className="text-link" href="#essays">
              阅读我们的内容 <span>↘</span>
            </a>
          </div>
        </div>

        <div className="hero-corner">
          <span>ANNO · 2026</span>
          <span>文明研究 · 公共表达 · 教育实践 · 现实项目</span>
        </div>

        <a className="scroll-cue" href="#manifesto" aria-label="向下浏览">
          <span>SCROLL</span>
          <i />
        </a>
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

      <section className="section section-who" id="about">
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
            <a className="button button-primary" href="#join">
              联系我们
            </a>
          </div>
        </div>
      </section>

      <section className="quote-break">
        <p>“我们不从固定的产品菜单开始，而从问题、对象、材料与希望形成的成果开始。”</p>
      </section>

      <section className="section section-editorial" id="essays">
        <SectionLabel index="JOURNAL">ESSAYS & IDEAS</SectionLabel>
        <div className="editorial-header">
          <div className="section-heading heading-light">
            <p className="eyebrow">BEIYONG JOURNAL</p>
            <h2>文章</h2>
            <p className="lead">从外部发布平台，汇聚北雍持续展开的三条内容线索</p>
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

      <section className="section section-media" id="media">
        <SectionLabel index="MEDIA">VIDEO & PODCAST</SectionLabel>
        <div className="section-heading heading-split">
          <div>
            <p className="eyebrow">WATCH & LISTEN</p>
            <h2>多媒体</h2>
          </div>
          <p className="heading-copy lead">
            把讲座、沙龙、视频与播客放在同一个知识脉络里，让一次观看或收听成为继续研究的入口。
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
            <p className="eyebrow">OPEN ARCHIVE</p>
            <h3>每一种媒介，都通向同一个问题现场</h3>
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

      <section className="section section-join" id="join">
        <SectionLabel index="JOIN">CONTACT & CAREERS</SectionLabel>
        <div className="join-hero">
          <p className="eyebrow">JOIN THE COLLECTIVE</p>
          <h2>加入我们</h2>
          <p>
            与认真面对问题的人同行。
            <br />
            关注北雍的内容、发起合作，或成为我们的一员。
          </p>
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
          <img src="/assets/beiyong-mark.png" alt="" />
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
    </main>
  );
}
