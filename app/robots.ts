import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
            },
            {
                userAgent: "Mediapartners-Google",
                allow: "/",
            }
        ],
        sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ynote.kr"}/sitemap.xml`,
    };
}
