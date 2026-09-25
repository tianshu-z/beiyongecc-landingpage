import type { Metadata } from "next";
import { siteName, siteOrigin } from "@/shared/site-metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: siteName,
    template: `%s｜${siteName}`,
  },
  description:
    "以历史为方法、以文明为尺度，以公共判断力与文明参与能力为目标的研究型智库。",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/share/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/share/icon-192.png",
    apple: [
      { url: "/share/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
