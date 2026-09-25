import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { pageMetadata } from "@/shared/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "北雍文章",
  description: "阅读北雍关于商业史、艺术与科学文明的文章。",
  path: "/essays/",
  image: "/share/essays.jpg",
});

export default function EssaysPage() {
  redirect("/");
}
