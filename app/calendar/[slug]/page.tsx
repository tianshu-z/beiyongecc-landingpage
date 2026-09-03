import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findCalendarEventBySlug } from "@/server/calendar-store";
import { SiteFooter, SiteHeader } from "../../site-chrome";
import RegistrationActions from "../registration-actions";

export const dynamic = "force-dynamic";

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await findCalendarEventBySlug(slug);

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
  const event = await findCalendarEventBySlug(slug);
  if (!event) notFound();

  const start = new Date(event.startAt);
  const end = new Date(event.endAt);

  return (
    <main id="top">
      <SiteHeader active="calendar" />

      <article className="event-detail">
        <Link className="event-back-link" href="/calendar">← 返回北雍日历</Link>

        <header className="event-detail-hero">
          <div className="event-detail-copy">
            <h1>{event.title}</h1>
          </div>
          <section className="event-detail-intro">
            <p className="eyebrow">ABOUT THE EVENT</p>
            <h2>活动简介</h2>
            {event.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        </header>

        <section className="event-booking-section" aria-label="活动报名信息">
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
              {event.capacity !== undefined ? (
                <div>
                  <dt>人数限制</dt>
                  <dd>{event.capacity} 人</dd>
                </div>
              ) : null}
            </dl>
            <RegistrationActions
              registrationQrCode={event.registrationQrCode}
              registrationUrl={event.registrationUrl}
            />
          </aside>
        </section>

        <section className="event-poster-section" aria-label="活动海报">
          <figure className="event-detail-poster">
            <img src={event.cover} alt={`${event.title}活动海报`} />
          </figure>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
