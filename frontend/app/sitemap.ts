import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://aariz-weld.vercel.app/",
      lastModified: new Date(),
    },
    {
      url: "https://aariz-weld.vercel.app/products",
      lastModified: new Date(),
    },
  ];
}
