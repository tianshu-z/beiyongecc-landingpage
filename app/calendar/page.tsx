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
        <h1>ECC Calendar · 北雍日历</h1>
      </section>

      <section className="calendar-shell">
        <CalendarView />
      </section>

      <SiteFooter />
    </main>
  );
}
