"use client";

import { useMemo, useState } from "react";
import {
  calendarEvents,
  eventCategories,
  eventModes,
  eventMonthKey,
  type CalendarEvent,
  type EventCategory,
  type EventMode,
} from "@/shared/calendar";

const weekDays = ["一", "二", "三", "四", "五", "六", "日"];
const monthFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  timeZone: "Asia/Shanghai",
});
const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  month: "long",
  day: "numeric",
  weekday: "short",
  timeZone: "Asia/Shanghai",
});
const timeFormatter = new Intl.DateTimeFormat("zh-CN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Shanghai",
});

type CategoryFilter = EventCategory | "全部";
type ModeFilter = EventMode | "全部";

function monthDate(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1));
}

function shiftMonth(monthKey: string, offset: number) {
  const date = monthDate(monthKey);
  date.setUTCMonth(date.getUTCMonth() + offset);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthDays(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const mondayOffset = (firstDay.getUTCDay() + 6) % 7;

  return [
    ...Array.from({ length: mondayOffset }, () => null),
    ...Array.from({ length: count }, (_, index) => index + 1),
  ];
}

function localDay(event: CalendarEvent) {
  return Number(event.startAt.slice(8, 10));
}

function eventTime(event: CalendarEvent) {
  return timeFormatter.format(new Date(event.startAt));
}

function eventDateTime(event: CalendarEvent) {
  const start = new Date(event.startAt);
  const end = new Date(event.endAt);
  return `${dateFormatter.format(start)} · ${timeFormatter.format(start)}–${timeFormatter.format(end)}`;
}

function priceLabel(event: CalendarEvent) {
  if (event.priceType === "free") return "免费";
  if (event.priceType === "invitation") return "邀请制";
  return `¥${event.priceCny}`;
}

export default function CalendarView() {
  const [monthKey, setMonthKey] = useState("2026-09");
  const [category, setCategory] = useState<CategoryFilter>("全部");
  const [mode, setMode] = useState<ModeFilter>("全部");
  const [selectedSlug, setSelectedSlug] = useState(calendarEvents[0].slug);

  const filteredEvents = useMemo(
    () =>
      calendarEvents.filter(
        (event) =>
          eventMonthKey(event) === monthKey &&
          (category === "全部" || event.category === category) &&
          (mode === "全部" || event.mode === mode),
      ),
    [category, mode, monthKey],
  );

  const selectedEvent =
    filteredEvents.find((event) => event.slug === selectedSlug) ??
    filteredEvents[0] ??
    null;

  const days = monthDays(monthKey);

  function updateMonth(offset: number) {
    const nextMonth = shiftMonth(monthKey, offset);
    const firstEvent = calendarEvents.find(
      (event) => eventMonthKey(event) === nextMonth,
    );
    setMonthKey(nextMonth);
    if (firstEvent) setSelectedSlug(firstEvent.slug);
  }

  return (
    <div className="calendar-experience">
      <div className="calendar-filter-row" aria-label="活动筛选">
        <div className="calendar-filter-group">
          <span>活动类型</span>
          <div className="calendar-pills">
            {(["全部", ...eventCategories] as CategoryFilter[]).map((item) => (
              <button
                className={category === item ? "is-active" : undefined}
                key={item}
                onClick={() => setCategory(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="calendar-filter-group calendar-mode-filter">
          <span>举办方式</span>
          <div className="calendar-pills">
            {(["全部", ...eventModes] as ModeFilter[]).map((item) => (
              <button
                className={mode === item ? "is-active" : undefined}
                key={item}
                onClick={() => setMode(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="calendar-workspace">
        <section className="calendar-board" aria-label="活动月历">
          <header className="calendar-board-header">
            <div>
              <p>ECC CALENDAR</p>
              <h2>{monthFormatter.format(monthDate(monthKey))}</h2>
            </div>
            <div className="calendar-month-controls">
              <button
                aria-label="上一个月"
                onClick={() => updateMonth(-1)}
                type="button"
              >
                ←
              </button>
              <button
                aria-label="下一个月"
                onClick={() => updateMonth(1)}
                type="button"
              >
                →
              </button>
            </div>
          </header>

          <div className="calendar-weekdays" aria-hidden="true">
            {weekDays.map((day) => (
              <span key={day}>星期{day}</span>
            ))}
          </div>

          <div className="calendar-grid">
            {days.map((day, index) => {
              if (day === null) {
                return <div className="calendar-day is-empty" key={`empty-${index}`} />;
              }

              const dayEvents = filteredEvents.filter(
                (event) => localDay(event) === day,
              );

              return (
                <div
                  className={`calendar-day${dayEvents.length ? " has-events" : ""}`}
                  key={day}
                >
                  <span className="calendar-day-number">{day}</span>
                  <div className="calendar-day-events">
                    {dayEvents.map((event) => (
                      <button
                        className={`calendar-event-chip category-${event.category}${
                          selectedEvent?.slug === event.slug ? " is-selected" : ""
                        }`}
                        key={event.id}
                        onClick={() => setSelectedSlug(event.slug)}
                        type="button"
                      >
                        <span>{eventTime(event)}</span>
                        <strong>{event.title}</strong>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {!filteredEvents.length ? (
            <div className="calendar-empty-state">
              <p>这个月份暂时没有符合条件的活动。</p>
              <button
                onClick={() => {
                  setCategory("全部");
                  setMode("全部");
                }}
                type="button"
              >
                清除筛选
              </button>
            </div>
          ) : null}
        </section>

        <aside className="calendar-selection" aria-live="polite">
          {selectedEvent ? (
            <article>
              <div className="calendar-selection-cover">
                <img src={selectedEvent.cover} alt="" />
                <span>{selectedEvent.demo ? "体验活动数据" : selectedEvent.category}</span>
              </div>
              <div className="calendar-selection-body">
                <div className="event-badges">
                  <span>{selectedEvent.category}</span>
                  <span>{selectedEvent.mode}</span>
                </div>
                <h3>{selectedEvent.title}</h3>
                <p className="calendar-selection-summary">{selectedEvent.summary}</p>
                <dl className="event-facts">
                  <div>
                    <dt>时间</dt>
                    <dd>{eventDateTime(selectedEvent)}</dd>
                  </div>
                  <div>
                    <dt>地点</dt>
                    <dd>
                      {selectedEvent.city ? `${selectedEvent.city} · ` : ""}
                      {selectedEvent.venue}
                    </dd>
                  </div>
                  <div>
                    <dt>费用</dt>
                    <dd>{priceLabel(selectedEvent)}</dd>
                  </div>
                </dl>
                <a className="button button-primary calendar-detail-link" href={`/calendar/${selectedEvent.slug}`}>
                  查看活动与报名
                </a>
              </div>
            </article>
          ) : (
            <div className="calendar-selection-empty">
              <span>ECC</span>
              <p>选择一个有活动的日期，查看完整信息。</p>
            </div>
          )}
        </aside>
      </div>

      <div className="calendar-mobile-list" aria-label="本月活动列表">
        {filteredEvents.map((event) => (
          <a href={`/calendar/${event.slug}`} key={event.id}>
            <time dateTime={event.startAt}>
              <strong>{String(localDay(event)).padStart(2, "0")}</strong>
              <span>{eventTime(event)}</span>
            </time>
            <div>
              <p>{event.category} · {event.mode}</p>
              <h3>{event.title}</h3>
              <span>{event.city ? `${event.city} · ` : ""}{event.venue}</span>
            </div>
            <i aria-hidden="true">↗</i>
          </a>
        ))}
      </div>
    </div>
  );
}

