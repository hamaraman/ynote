import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPolicies } from "@/lib/posts";
import { getPoliciesByCategory } from "@/lib/youthApi";
import { CATEGORIES as categories, CATEGORY_SLUGS } from "@/lib/categories";
import PolicyCard from "@/components/PolicyCard";
import CategoryPolicyList from "@/components/CategoryPolicyList";

export function generateStaticParams() {
    return CATEGORY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const cat = categories[slug as keyof typeof categories];
    if (!cat) return {};
    const title = `${cat.name} 청년 정책`;
    const description = `${cat.description} — 청년노트에서 한눈에 확인하세요.`;
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `/category/${slug}`,
        },
    };
}

export default async function CategoryPage({
                                               params,
                                           }: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const cat = categories[slug as keyof typeof categories];
    if (!cat) notFound();

    const markdownPolicies = getAllPolicies().filter((p) => p.categorySlug === slug);
    const apiData = await getPoliciesByCategory(slug, 1, 24);
    const apiPolicies = apiData.result?.youthPolicyList ?? [];
    const totalCount = apiData.result?.pagging?.totCount ?? apiPolicies.length;

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <Link href="/" className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">
                <span>←</span> 홈
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-3 text-gray-900 dark:text-gray-100 tracking-tight">
                {cat.icon} {cat.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-10 text-base md:text-lg max-w-2xl leading-relaxed">{cat.description}</p>

            {markdownPolicies.length === 0 && apiPolicies.length === 0 ? (
                <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-3xl p-16 text-center">
                    <div className="text-4xl mb-4">📭</div>
                    <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">아직 등록된 정책이 없습니다.</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        곧 새로운 정책 정보로 찾아뵙겠습니다.
                    </p>
                </div>
            ) : (
                <div className="space-y-16">
                    {markdownPolicies.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold mb-6 pb-3 border-b border-teal-200 dark:border-teal-900/50 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                                <span>📖</span> 핵심 가이드 ({markdownPolicies.length}개)
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {markdownPolicies.map((p) => (
                                    <PolicyCard key={p.slug} policy={p} isMarkdown={true} />
                                ))}
                            </div>
                        </section>
                    )}

                    {apiPolicies.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold mb-6 pb-3 border-b border-teal-200 dark:border-teal-900/50 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                                <span>📋</span> 실시간 정부 정책 ({totalCount.toLocaleString()}건)
                            </h2>
                            <CategoryPolicyList
                                initialPolicies={apiPolicies}
                                categorySlug={slug}
                                initialTotalCount={totalCount}
                                isRegion={slug === "region"}
                            />
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}