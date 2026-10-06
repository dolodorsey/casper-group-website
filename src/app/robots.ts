import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/forms/nda"],
      },
    ],
    sitemap: "https://caspergroupworldwide.com/sitemap.xml",
    host: "https://caspergroupworldwide.com",
  };
}
