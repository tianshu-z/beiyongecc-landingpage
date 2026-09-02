import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { calendarEvents, getCalendarEvent } from "@/shared/calendar";
import { SiteFooter, SiteHeader } from "../../site-chrome";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const fullDateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
  timeZone: "Asia/Shanghai",
});

const timeFormatter = new Intl.DateTimeFormat("zh-CN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Shanghai",
});

export function generateStaticParams() {
  return calendarEvents.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getCalendarEvent(slug);

  if (!event) return { title: "活动未找到" };

  return {
    title: `${event.title} · 北雍日历`,
    description: event.summary,
    openGraph: {
      title: event.title,
      description: event.summary,
      images: [{ url: event.cover }],
    },
  };
}

function priceLabel(priceType: "free" | "paid" | "invitation", priceCny?: number) {
  if (priceType === "free") return "免费活动";
  if (priceType === "invitation") return "邀请制";
  return `¥${priceCny} / 人`;
}

export default async function CalendarEventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = getCalendarEvent(slug);
  if (!event) notFound();

  const start = new Date(event.startAt);
  const end = new Date(event.endAt);
  const mailSubject = encodeURIComponent(`咨询报名：${event.title}`);

  return (
    <main id="top">
      <SiteHeader active="calendar" />

      <article className="event-detail">
        <a className="event-back-link" href="/calendar">← 返回北雍日历</a>

        <header className="event-detail-hero">
          <div className="event-detail-copy">
            <div className="event-badges">
              <span>{event.category}</span>
              <span>{event.mode}</span>
              {event.demo ? <span>体验数据</span> : null}
            </div>
            <h1>{event.title}</h1>
            <p>{event.summary}</p>
          </div>
          <figure className="event-detail-cover">
            <img src={event.cover} alt="" />
          </figure>
        </header>

        <div className="event-detail-layout">
          <div className="event-detail-main">
            <section>
              <p className="eyebrow">ABOUT THE EVENT</p>
              <h2>活动介绍</h2>
              {event.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>

            <section>
              <p className="eyebrow">WHAT TO EXPECT</p>
              <h2>你将在这里经历什么</h2>
              <ol className="event-highlight-list">
                {event.highlights.map((highlight, index) => (
                  <li key={highlight}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{highlight}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <p className="eyebrow">FOR WHOM</p>
              <h2>适合谁参加</h2>
              <p>{event.audience}</p>
            </section>
          </div>

          <aside className="event-booking-card">
            <p className="event-price">{priceLabel(event.priceType, event.priceCny)}</p>
            <dl>
              <div>
                <dt>日期</dt>
                <dd>{fullDateFormatter.format(start)}</dd>
              </div>
              <div>
                <dt>时间</dt>
                <dd>{timeFormatter.format(start)}–{timeFormatter.format(end)}</dd>
              </div>
              <div>
                <dt>形式</dt>
                <dd>{event.mode}</dd>
              </div>
              <div>
                <dt>地点</dt>
                <dd>{event.city ? `${event.city} · ` : ""}{event.venue}</dd>
              </div>
              {event.remainingSpots !== undefined ? (
                <div>
                  <dt>余位</dt>
                  <dd>{event.remainingSpots} / {event.capacity}</dd>
                </div>
              ) : null}
            </dl>
            <a
              className="button button-primary event-booking-button"
              href={`mailto:team@beiyongecc.org?subject=${mailSubject}`}
            >
              咨询报名
            </a>
            <p className="event-booking-note">
              当前版本暂以邮件承接咨询。微信小程序上线后，这里将替换为预约、订单和微信支付流程。
            </p>
          </aside>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}

