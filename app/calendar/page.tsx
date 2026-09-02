import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../site-chrome";
import CalendarView from "./calendar-view";

export const metadata: Metadata = {
  title: "北雍日历 · ECC Calendar",
  description: "查看北雍的长风沙龙、长风论坛、课程与其他活动。",
};

export default function CalendarPage() {
  return (
    <main id="top">
      <SiteHeader active="calendar" />

      <section className="calendar-intro">
        <div>
          <p className="eyebrow">ECC CALENDAR · 北雍日历</p>
          <h1>在时间中相遇</h1>
        </div>
        <p>
          集中查看北雍的沙龙、论坛、课程与其他活动。选择日期，进入活动详情与报名。
        </p>
      </section>

      <section className="calendar-demo-notice" aria-label="版本说明">
        <span>VERSION 0.1</span>
        <p>目前展示的是第一版体验数据；正式排期、报名与微信支付将在活动确认后接入。</p>
      </section>

      <section className="calendar-shell">
        <CalendarView />
      </section>

      <SiteFooter />
    </main>
  );
}

