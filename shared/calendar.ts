export const eventCategories = [
  "长风沙龙",
  "长风论坛",
  "北雍课程",
  "其他活动",
] as const;

export const eventModes = ["线上", "线下"] as const;

export type EventCategory = (typeof eventCategories)[number];
export type EventMode = (typeof eventModes)[number];
export type RegistrationStatus = "open" | "coming-soon" | "full";

export type CalendarEvent = {
  id: string;
  slug: string;
  title: string;
  category: EventCategory;
  mode: EventMode;
  startAt: string;
  endAt: string;
  city?: string;
  venue: string;
  address?: string;
  organizer: string;
  summary: string;
  description: string[];
  highlights: string[];
  audience: string;
  cover: string;
  priceType: "free" | "paid" | "invitation";
  priceCny?: number;
  capacity?: number;
  remainingSpots?: number;
  registrationStatus: RegistrationStatus;
  registrationUrl?: string;
  registrationQrCode?: string;
  demo: boolean;
};

// Static snapshot exported from the production calendar on 2026-09-05.
// GitHub Pages reads this list directly; the local management page may overlay
// it with records stored by the local development database.
export const calendarEvents: CalendarEvent[] = [
  {
    id: "local-1788515142947",
    slug: "local-1788515142947",
    title: "科学的神话·英法篇·过渡讲",
    category: "长风沙龙",
    mode: "线下",
    startAt: "2026-08-02T10:00:00+08:00",
    endAt: "2026-08-02T12:00:00+08:00",
    city: "北京",
    venue: "长风空间（海淀）",
    address: "融科资讯中心A座9层·昆仑巢",
    organizer: "北雍文化商业智库",
    summary: "从书信共和国到科学机构：知识如何摆脱\"关键人物风险\"",
    description: ["略"],
    highlights: [],
    audience: "",
    cover: "/assets/calendar/science-transition-poster.png",
    priceType: "invitation",
    capacity: 10,
    registrationStatus: "open",
    registrationUrl: "https://bvtqlziq.jsjform.com/f/y6TmhH",
    registrationQrCode: "/assets/calendar/science-series-registration-qr.png",
    demo: false,
  },
  {
    id: "evt-2026-09-12-science-transition",
    slug: "science-myth-uk-france-transition",
    title: "科学的神话·英法篇·英国讲",
    category: "长风沙龙",
    mode: "线下",
    startAt: "2026-08-16T10:00:00+08:00",
    endAt: "2026-08-16T12:00:00+08:00",
    city: "北京",
    venue: "长风空间（海淀）",
    address: "融科资讯中心A座9层·昆仑巢",
    organizer: "北雍文化商业智库",
    summary: "从内战到皇家学会：商业都市、公共舆论与实验事实",
    description: [
      "从皇家学会到法国科学院，科学共同体面对的是两套不同的政治、财政与城市环境。",
      "这场沙龙将连接课程的英国篇与法国篇，也把历史讨论带回今天的科研组织与公共判断。",
    ],
    highlights: ["小型线下讨论", "英法制度比较", "课程内容延伸"],
    audience: "适合已参加课程的学员，也向对相关议题感兴趣的新朋友开放。",
    cover: "/assets/science-myth-uk.jpg",
    priceType: "invitation",
    capacity: 20,
    registrationStatus: "open",
    registrationUrl: "https://bvtqlziq.jsjform.com/f/y6TmhH",
    registrationQrCode: "/assets/calendar/science-series-registration-qr.png",
    demo: false,
  },
  {
    id: "evt-2026-09-26-art-of-looking",
    slug: "art-of-looking-online",
    title: "艺术体验课｜谁制造了现代艺术？",
    category: "北雍课程",
    mode: "线下",
    startAt: "2026-08-23T10:00:00+08:00",
    endAt: "2026-08-23T12:00:00+08:00",
    city: "北京",
    venue: "北雍空间（顺义）",
    address: "报名通过后发送",
    organizer: "北雍文化商业智库",
    summary: "当名字、价格与历史暂时消失，你会如何判断一件作品？",
    description: [
      "当名字、价格与历史暂时消失，你会如何判断一件作品？",
      "课程借用经典桌游《现代艺术》的市场机制，围绕五组共 70 件真实作品展开四轮。前两轮隐藏作者姓",
      "名，让判断先于知识发生。",
      "推演与历史讲解交替展开：每轮都把现场的选择带回展览、画商、收藏、博物馆与研究。",
      "约120分钟，8-10人，亲子优先。",
    ],
    highlights: ["慢观看练习", "作品背后的制度", "适合零基础参与"],
    audience: "面向希望重新建立观看能力的公众，无需艺术史基础。",
    cover: "/assets/calendar/art-modern-experience-poster.png",
    priceType: "invitation",
    capacity: 10,
    registrationStatus: "open",
    demo: false,
  },
  {
    id: "evt-2026-09-06-science-france",
    slug: "science-myth-france",
    title: "科学的神话·英法篇·法国讲",
    category: "北雍课程",
    mode: "线上",
    startAt: "2026-08-30T10:00:00+08:00",
    endAt: "2026-08-30T12:00:00+08:00",
    city: "线上",
    venue: "腾讯会议",
    organizer: "北雍文化商业智库",
    summary: "从科尔贝尔到卡西尼，讨论绝对主义国家如何组织科学、测量与知识生产。",
    description: [
      "近代科学从来不只发生在实验室。它也发生在国家财政、科学院、测量工程和跨国竞争之中。",
      "本次课程以十七世纪法国为中心，理解科学制度如何在国家能力与公共知识之间建立新的关系。",
    ],
    highlights: ["法国科学院与国家治理", "测量、地图与基础设施", "赞助制度与知识权威"],
    audience: "适合对科学史、制度史、法国史与技术文明感兴趣的公众。",
    cover: "/assets/science-myth-france.jpg",
    priceType: "invitation",
    capacity: 20,
    registrationStatus: "open",
    registrationUrl: "https://bvtqlziq.jsjform.com/f/y6TmhH",
    registrationQrCode: "/assets/calendar/science-series-registration-qr.png",
    demo: false,
  },
  {
    id: "evt-2026-09-20-ai-industry",
    slug: "ai-industry-civilization-forum",
    title: "当人工智能进入产业深水区",
    category: "长风论坛",
    mode: "线下",
    startAt: "2026-09-06T18:30:00+08:00",
    endAt: "2026-09-06T21:00:00+08:00",
    city: "北京",
    venue: "长风空间（海淀）",
    address: "北京海淀中关村·融科资讯中心·B座B2层会议中心",
    organizer: "北雍文化商业智库",
    summary: "从农业、制造、能源、医疗、教育与交通出发，观察人工智能如何进入真实产业。",
    description: [
      "模型能力不断提升之后，真正决定下一阶段发展的，已经不只是参数、算力和技术演示，而是能否进入真实产业、解决真实问题，并形成可持续的商业模式。",
      "它将如何改变创业机会与投资逻辑？",
      "如何进入农业、企业服务等具体场景？",
      "如何重塑企业组织、人才需求和就业结构？",
      "技术进步带来的效率提升，又能否转化为新的收入、需求与经济循环？",
      "2026年9月6日晚，长风论坛将邀请来自人工智能产业、科技创业与投资领域的嘉宾，在北京中关村融科资讯中心展开一场面向现实问题的深入讨论",
    ],
    highlights: ["六个产业现场", "研究者与实践者对谈", "文明尺度下的技术判断"],
    audience: "面向企业管理者、产业研究者、技术从业者与长期主义者。",
    cover: "/assets/calendar/ai-industry-forum-poster.webp",
    priceType: "paid",
    priceCny: 30,
    capacity: 100,
    registrationStatus: "coming-soon",
    registrationUrl: "https://bvtqlziq.jsjform.com/f/i9Xf4T",
    registrationQrCode: "/assets/calendar/ai-industry-forum-registration-qr.png",
    demo: false,
  },
];

export function getCalendarEvent(slug: string) {
  return calendarEvents.find((event) => event.slug === slug);
}

export function eventMonthKey(event: CalendarEvent) {
  return event.startAt.slice(0, 7);
}
