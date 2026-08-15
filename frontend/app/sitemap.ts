import type { MetadataRoute } from "next";

const API_URL =
  "https://zarrishkhan12.pythonanywhere.com/api/products/";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await fetch(API_URL, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json();

    const productUrls = products.map((product: { id: number }) => ({
      url: `https://aariz-weld.vercel.app/product/${product.id}`,
      lastModified: new Date(),
    }));

    return [
      {
        url: "https://aariz-weld.vercel.app/",
        lastModified: new Date(),
      },
      {
        url: "https://aariz-weld.vercel.app/products",
        lastModified: new Date(),
      },
      ...productUrls,
    ];
  } catch (error) {
    console.error("Sitemap error:", error);

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
}