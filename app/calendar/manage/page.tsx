import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../../site-chrome";
import EventManager from "./event-manager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "活动管理 · 北雍日历",
  description: "录入和管理北雍日历中的活动。",
};

export default function CalendarManagePage() {
  return (
    <main id="top">
      <SiteHeader active="calendar" />
      <section className="calendar-manage-header">
        <p className="eyebrow">ECC CALENDAR · INTERNAL</p>
        <h1>活动管理</h1>
        <p>填写一次活动信息，同时为网页版和未来的微信小程序准备数据。</p>
      </section>
      <section className="calendar-manage-shell">
        <EventManager />
      </section>
      <SiteFooter />
    </main>
  );
}
