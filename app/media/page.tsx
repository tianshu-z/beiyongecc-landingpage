import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { pageMetadata } from "@/shared/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "北雍多媒体",
  description: "收听和观看北雍的视频、播客与其他多媒体内容。",
  path: "/media/",
  image: "/share/media.jpg",
});

export default function MediaPage() {
  redirect("/");
}
