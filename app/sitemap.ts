import { MetadataRoute } from "next";
import { getAllPolicySlugs } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ynote.kr";

    // 메인 정적 페이지들
    const routes = ["", "/about", "/contact", "/privacy", "/terms", "/search", "/bookmarks"].map(
        (route) => ({
            url: `${baseUrl}${route}`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 1.0,
        })
    );

    // 카테고리 페이지들
    const categories = ["finance", "housing", "job", "edu", "life", "region"].map((cat) => ({
        url: `${baseUrl}/category/${cat}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
    }));

    // 로컬 마크다운 글 상세 페이지들
    const slugs = getAllPolicySlugs();
    const policyRoutes = slugs.map((slug) => ({
        url: `${baseUrl}/policy/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
    }));

    return [...routes, ...categories, ...policyRoutes];
}
