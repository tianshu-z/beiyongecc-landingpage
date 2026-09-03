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

export const calendarEvents: CalendarEvent[] = [
  {
    id: "evt-2026-09-06-science-france",
    slug: "science-myth-france",
    title: "科学的神话·第二章：法国讲",
    category: "北雍课程",
    mode: "线上",
    startAt: "2026-09-06T19:30:00+08:00",
    endAt: "2026-09-06T21:30:00+08:00",
    venue: "腾讯会议",
    organizer: "北雍文化商业智库",
    summary:
      "从科尔贝尔到卡西尼，讨论绝对主义国家如何组织科学、测量与知识生产。",
    description: [
      "近代科学从来不只发生在实验室。它也发生在国家财政、科学院、测量工程和跨国竞争之中。",
      "本次课程以十七世纪法国为中心，理解科学制度如何在国家能力与公共知识之间建立新的关系。",
    ],
    highlights: ["法国科学院与国家治理", "测量、地图与基础设施", "赞助制度与知识权威"],
    audience: "适合对科学史、制度史、法国史与技术文明感兴趣的公众。",
    cover: "/assets/science-myth-france.jpg",
    priceType: "paid",
    priceCny: 199,
    capacity: 120,
    remainingSpots: 38,
    registrationStatus: "open",
    demo: true,
  },
  {
    id: "evt-2026-09-12-science-transition",
    slug: "science-myth-uk-france-transition",
    title: "科学的神话Ⅱ：从英国到法国",
    category: "长风沙龙",
    mode: "线下",
    startAt: "2026-09-12T14:30:00+08:00",
    endAt: "2026-09-12T17:00:00+08:00",
    city: "北京",
    venue: "北雍空间",
    address: "具体地址将在报名确认后发送",
    organizer: "北雍文化商业智库",
    summary:
      "在实验事实、商业都市与国家组织之间，比较英法两条不同的科学制度路径。",
    description: [
      "从皇家学会到法国科学院，科学共同体面对的是两套不同的政治、财政与城市环境。",
      "这场沙龙将连接课程的英国篇与法国篇，也把历史讨论带回今天的科研组织与公共判断。",
    ],
    highlights: ["小型线下讨论", "英法制度比较", "课程内容延伸"],
    audience: "适合已参加课程的学员，也向对相关议题感兴趣的新朋友开放。",
    cover: "/assets/science-myth-uk.jpg",
    priceType: "paid",
    priceCny: 168,
    capacity: 36,
    remainingSpots: 12,
    registrationStatus: "open",
    demo: true,
  },
  {
    id: "evt-2026-09-20-ai-industry",
    slug: "ai-industry-civilization-forum",
    title: "人工智能产业：一次新的工业革命？",
    category: "长风论坛",
    mode: "线下",
    startAt: "2026-09-20T13:30:00+08:00",
    endAt: "2026-09-20T17:30:00+08:00",
    city: "北京",
    venue: "场地待公布",
    organizer: "北雍文化商业智库",
    summary:
      "从农业、制造、能源、医疗、教育与交通出发，观察人工智能如何进入真实产业。",
    description: [
      "关于人工智能的讨论，需要从模型能力继续走向产业结构、基础设施和组织变化。",
      "长风论坛邀请研究者与实践者，讨论技术扩散真正发生的条件、边界与长期影响。",
    ],
    highlights: ["六个产业现场", "研究者与实践者对谈", "文明尺度下的技术判断"],
    audience: "面向企业管理者、产业研究者、技术从业者与长期主义者。",
    cover: "/assets/chinese-armillary-sphere-transparent.svg",
    priceType: "invitation",
    capacity: 80,
    remainingSpots: 24,
    registrationStatus: "coming-soon",
    demo: true,
  },
  {
    id: "evt-2026-09-26-art-of-looking",
    slug: "art-of-looking-online",
    title: "艺术的背面：观看如何成为一种历史方法",
    category: "长风沙龙",
    mode: "线上",
    startAt: "2026-09-26T19:30:00+08:00",
    endAt: "2026-09-26T21:00:00+08:00",
    venue: "视频号直播",
    organizer: "北雍文化商业智库",
    summary:
      "从材料、空间与制度进入作品，练习一种不急于判断、但不放弃历史深度的观看。",
    description: [
      "观看并不是自然发生的动作。博物馆、收藏、复制技术和艺术教育，都在塑造我们看见什么。",
      "这场线上沙龙将通过具体作品，示范如何把感受、材料与历史语境放在同一幅图景中。",
    ],
    highlights: ["慢观看练习", "作品背后的制度", "适合零基础参与"],
    audience: "面向希望重新建立观看能力的公众，无需艺术史基础。",
    cover: "/assets/bianzhong-transparent-lineart.svg",
    priceType: "free",
    capacity: 300,
    remainingSpots: 186,
    registrationStatus: "open",
    demo: true,
  },
  {
    id: "evt-2026-10-17-open-day",
    slug: "beiyong-open-day-autumn",
    title: "北雍开放日·秋",
    category: "其他活动",
    mode: "线下",
    startAt: "2026-10-17T14:00:00+08:00",
    endAt: "2026-10-17T17:00:00+08:00",
    city: "北京",
    venue: "北雍空间",
    address: "具体地址将在报名确认后发送",
    organizer: "北雍文化商业智库",
    summary: "认识北雍正在推进的研究、课程与公共项目，也认识可能同行的人。",
    description: [
      "开放日不是一次机构宣讲，而是把研究现场、内容方法与未来计划打开。",
      "你可以带着问题前来，也可以只用一个下午感受北雍如何工作。",
    ],
    highlights: ["年度方向分享", "研究项目展示", "开放交流"],
    audience: "面向所有希望了解北雍、参与合作或加入我们的朋友。",
    cover: "/assets/zhaozhou-dragon-lockstone-closing-transparent.svg",
    priceType: "free",
    capacity: 50,
    remainingSpots: 41,
    registrationStatus: "coming-soon",
    demo: true,
  },
];

export function getCalendarEvent(slug: string) {
  return calendarEvents.find((event) => event.slug === slug);
}

export function eventMonthKey(event: CalendarEvent) {
  return event.startAt.slice(0, 7);
}
