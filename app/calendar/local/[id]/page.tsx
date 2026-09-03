import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../../../site-chrome";
import LocalEventDetail from "./local-event-detail";

export const metadata: Metadata = {
  title: "本地活动预览 · 北雍日历",
  robots: { index: false, follow: false },
};

export default async function LocalEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main id="top">
      <SiteHeader active="calendar" />
      <article className="event-detail">
        <a className="event-back-link" href="/calendar">← 返回北雍日历</a>
        <LocalEventDetail id={id} />
      </article>
      <SiteFooter />
    </main>
  );
}

