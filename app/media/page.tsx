import type { Metadata } from "next";
import { PageHero, SiteFooter, SiteHeader } from "../site-chrome";
import { MediaLibrary } from "./media-library";

export const metadata: Metadata = {
  title: "多媒体",
  description: "北雍的视频、播客、讲座与沙龙。",
};

export default function MediaPage() {
  return (
    <main>
      <SiteHeader active="media" />
      <PageHero
        kicker="VIDEO & PODCAST"
        title="多媒体"
        intro="把讲座、沙龙、视频与播客放在同一个知识脉络里，让一次观看或收听成为继续研究的入口。"
      />

      <section className="section section-media standalone-section" id="content">
        <MediaLibrary />
      </section>

      <SiteFooter />
    </main>
  );
}
