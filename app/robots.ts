import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/bookmarks"],
            },
            {
                userAgent: "Mediapartners-Google",
                allow: "/",
            },
        ],
        sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ynote.kr"}/sitemap.xml`,
    };
}
