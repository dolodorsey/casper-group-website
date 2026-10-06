import type { MetadataRoute } from "next";

const baseUrl = "https://caspergroupworldwide.com";

const corporateRoutes = [
  "",
  "/about",
  "/brands",
  "/locations",
  "/franchise",
  "/careers",
  "/press",
  "/contact",
  "/privacy",
  "/terms",
];

const brandRoutes = [
  "/angel-wings",
  "/tha-morning-after",
  "/patty-daddy",
  "/espresso-co",
  "/mojo-juice",
  "/mr-oyster",
  "/sweet-tooth",
  "/taco-yaki",
  "/tossd",
  "/pasta-bish",
  "/peace-pizza",
  "/american-dragon",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...corporateRoutes.map((route, index) => ({
      url: `${baseUrl}${route}`,
      changeFrequency: index === 0 ? ("weekly" as const) : ("monthly" as const),
      priority: index === 0 ? 1 : route === "/franchise" || route === "/brands" ? 0.9 : 0.7,
    })),
    ...brandRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
