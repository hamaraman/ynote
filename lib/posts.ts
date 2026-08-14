import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const policyDir = path.join(process.cwd(), "content/policy");

export type ApplicationLinkKind = "direct" | "official";

export type PolicyMeta = {
    slug: string;
    title: string;
    description: string;
    category: string;
    categorySlug: string;
    date: string;
    updated?: string;
    tags?: string[];
    /** 직접 신청 화면으로 연결되는 검증된 URL. 콘텐츠 작성 시 최우선으로 사용됩니다. */
    applyUrl?: string;
    /** 신청 포털·공고 페이지 등 공식 안내 링크. 직접 신청 URL이 없을 때 사용합니다. */
    officialUrl?: string;
    /** 버튼에 표시할 보조 문구. 예: "복지로에서 신청하기" */
    applyLinkLabel?: string;
};

export type Policy = PolicyMeta & {
    contentHtml: string;
    applicationUrl?: string;
    applicationLinkKind?: ApplicationLinkKind;
    applicationLinkLabel?: string;
};

function normalizeExternalUrl(value: unknown): string | undefined {
    if (typeof value !== "string") return undefined;

    const url = value.trim();
    if (!url) return undefined;

    try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : undefined;
    } catch {
        return undefined;
    }
}

/**
 * 기존 가이드의 "신청 방법" 또는 "신청처" 섹션에 있는 공식 링크를 읽습니다.
 * 신규 콘텐츠는 자동 탐색에 의존하지 말고 frontmatter의 applyUrl/officialUrl을 명시해야 합니다.
 */
function extractOfficialApplicationUrl(content: string): string | undefined {
    const sectionPattern = /^#{1,4}\s*[^\n]*(?:신청|접수|온라인)[^\n]*\n([\s\S]*?)(?=^#{1,4}\s|(?![\s\S]))/gmu;
    const linkPattern = /\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/g;

    for (const section of content.matchAll(sectionPattern)) {
        const sectionContent = section[1] ?? "";
        const link = linkPattern.exec(sectionContent)?.[1];
        const normalized = normalizeExternalUrl(link);
        if (normalized) return normalized;
    }

    return undefined;
}

function getApplicationLink(data: Omit<PolicyMeta, "slug">, content: string) {
    const directUrl = normalizeExternalUrl(data.applyUrl);
    if (directUrl) {
        return {
            applicationUrl: directUrl,
            applicationLinkKind: "direct" as const,
            applicationLinkLabel: data.applyLinkLabel || "바로 신청하기",
        };
    }

    const officialUrl = normalizeExternalUrl(data.officialUrl) || extractOfficialApplicationUrl(content);
    if (officialUrl) {
        return {
            applicationUrl: officialUrl,
            applicationLinkKind: "official" as const,
            applicationLinkLabel: data.applyLinkLabel || "공식 신청처로 이동",
        };
    }

    return {};
}

export function getAllPolicySlugs(): string[] {
    if (!fs.existsSync(policyDir)) return [];
    return fs
        .readdirSync(policyDir)
        .filter((f) => f.endsWith(".md"))
        .map((f) => f.replace(/\.md$/, ""));
}

export function getAllPolicies(): PolicyMeta[] {
    return getAllPolicySlugs()
        .map((slug) => {
            const file = fs.readFileSync(path.join(policyDir, `${slug}.md`), "utf8");
            const { data } = matter(file);
            return { slug, ...(data as Omit<PolicyMeta, "slug">) };
        })
        .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getPolicyBySlug(slug: string): Promise<Policy | null> {
    const filePath = path.join(policyDir, `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;

    const file = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(file);
    const policyData = data as Omit<PolicyMeta, "slug">;
    const processed = await remark().use(html).process(content);

    return {
        slug,
        ...policyData,
        contentHtml: processed.toString(),
        ...getApplicationLink(policyData, content),
    };
}
