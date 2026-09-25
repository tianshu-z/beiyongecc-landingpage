import type { Metadata } from "next";

export const siteOrigin = "https://beiyongecc.org";
export const siteName = "北雍文化商业智库";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image: string;
  type?: "website" | "article";
  imageWidth?: number;
  imageHeight?: number;
};

function absoluteUrl(path: string) {
  return new URL(path, siteOrigin).toString();
}

function imageType(path: string) {
  return /\.jpe?g(?:$|\?)/i.test(path) ? "image/jpeg" : "image/png";
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  imageWidth = 1200,
  imageHeight = 630,
}: PageMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const socialImage = absoluteUrl(image);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type,
      url: canonical,
      siteName,
      locale: "zh_CN",
      images: [
        {
          url: socialImage,
          width: imageWidth,
          height: imageHeight,
          type: imageType(image),
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}
