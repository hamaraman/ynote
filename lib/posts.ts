import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const policyDir = path.join(process.cwd(), "content/policy");

export type PolicyMeta = {
    slug: string;
    title: string;
    description: string;
    category: string;
    categorySlug: string;
    date: string;
    updated?: string;
};

export type Policy = PolicyMeta & { contentHtml: string };

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
    const processed = await remark().use(html).process(content);
    return {
        slug,
        ...(data as Omit<PolicyMeta, "slug">),
        contentHtml: processed.toString(),
    };
}