import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPolicies } from "@/lib/posts";
import { getPoliciesByCategory } from "@/lib/youthApi";
import PolicyCard from "@/components/PolicyCard";
import CategoryPolicyList from "@/components/CategoryPolicyList";

const categories = {
    finance: { name: "금융/자산", icon: "💰", description: "청년도약계좌, 청약통장, 소득공제펀드 등 자산 형성에 도움 되는 정책" },
    housing: { name: "주거", icon: "🏠", description: "월세 지원, 전세 자금 대출, 청년 주택 등 주거 관련 혜택" },
    job: { name: "일자리", icon: "💼", description: "내일배움카드, 구직활동지원금, 채움공제 등 취업·창업 지원" },
    edu: { name: "교육/문화", icon: "📚", description: "문화패스, K-패스, 평생교육바우처 등 교육·문화 지원" },
    life: { name: "건강/생활", icon: "🏥", description: "마음건강바우처, 청년몽땅정보통 등 건강·생활 지원" },
    region: { name: "지역별 혜택", icon: "📍", description: "서울, 경기, 부산 등 지자체별 청년 사업" },
};

export function generateStaticParams() {
    return Object.keys(categories).map((slug) => ({ slug }));
}

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const cat = categories[slug as keyof typeof categories];
    if (!cat) return {};
    return {
        title: cat.name,
        description: `${cat.name} 카테고리 - ${cat.description}`,
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
    const apiData = await getPoliciesByCategory(slug, 1, 12);
    const apiPolicies = apiData.result?.youthPolicyList ?? [];
    const totalCount = apiData.result?.pagging?.totCount ?? apiPolicies.length;

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <Link href="/" className="text-sm text-teal-600 hover:underline">
                ← 홈
            </Link>
            <h1 className="text-3xl font-bold mt-4 mb-2">
                {cat.icon} {cat.name}
            </h1>
            <p className="text-gray-600 mb-8">{cat.description}</p>

            {markdownPolicies.length === 0 && apiPolicies.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-12 text-center">
                    <p className="text-gray-500 mb-2">아직 정책이 없습니다.</p>
                    <p className="text-sm text-gray-400">
                        곧 새로운 정책이 추가될 예정입니다.
                    </p>
                </div>
            ) : (
                <>
                    {markdownPolicies.length > 0 && (
                        <section className="mb-10">
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-teal-200">
                                📖 읽어보기 ({markdownPolicies.length}개)
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
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-teal-200">
                                📋 정부 정책 ({totalCount.toLocaleString()}건)
                            </h2>
                            <CategoryPolicyList
                                initialPolicies={apiPolicies}
                                categorySlug={slug}
                                initialTotalCount={totalCount}
                            />
                        </section>
                    )}
                </>
            )}
        </div>
    );
}