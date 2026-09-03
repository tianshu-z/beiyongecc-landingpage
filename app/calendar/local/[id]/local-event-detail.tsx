"use client";

import { useEffect, useState } from "react";
import type { CalendarEvent } from "@/shared/calendar";
import RegistrationActions from "../../registration-actions";

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
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

function priceLabel(event: CalendarEvent) {
  if (event.priceType === "free") return "免费活动";
  if (event.priceType === "invitation") return "邀请制";
  return `¥${event.priceCny} / 人`;
}

export default function LocalEventDetail({ id }: { id: string }) {
  const [event, setEvent] = useState<CalendarEvent | null | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/calendar/events", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("活动读取失败");
        return response.json() as Promise<{ events: CalendarEvent[] }>;
      })
      .then((payload) => {
        setEvent(payload.events.find((item) => item.id === id) ?? null);
      })
      .catch(() => setEvent(null));
    return () => controller.abort();
  }, [id]);

  if (event === undefined) {
    return <p className="local-event-state">正在读取活动信息……</p>;
  }

  if (event === null) {
    return <p className="local-event-state">没有找到这项活动。</p>;
  }

  const start = new Date(event.startAt);
  const end = new Date(event.endAt);

  return (
    <>
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
          <p className="event-price">{priceLabel(event)}</p>
          <dl>
            <div>
              <dt>日期</dt>
              <dd>{dateFormatter.format(start)}</dd>
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
    </>
  );
}
