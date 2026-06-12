import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPolicies } from "@/lib/posts";
import { getPoliciesByCategory, type YouthPolicy } from "@/lib/youthApi";
import { formatYmd } from "@/lib/youthApi";

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

function ApiPolicyItem({ policy }: { policy: YouthPolicy }) {
    return (
        <li className="py-5 hover:text-teal-600 transition">
            <Link href={`/policy/${policy.plcyNo}`} className="block">
                <h2 className="font-semibold mb-1">{policy.plcyNm}</h2>
                <p className="text-sm text-gray-600 line-clamp-2">{policy.plcyExplnCn}</p>
                <p className="text-xs text-gray-400 mt-2">
                    {policy.aplyYmd ? `신청: ${policy.aplyYmd}` : "상시 신청"}
                    {policy.sprvsnInstCdNm && ` · ${policy.sprvsnInstCdNm}`}
                </p>
            </Link>
        </li>
    );
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

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <Link href="/" className="text-sm text-teal-600 hover:underline">
                ← 홈
            </Link>
            <h1 className="text-3xl font-bold mt-4 mb-2">
                {cat.icon} {cat.name}
            </h1>
            <p className="text-gray-600 mb-8">{cat.description}</p>

            {markdownPolicies.length === 0 && apiPolicies.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500">
                    <p>이 카테고리에 해당하는 글이 곧 추가됩니다.</p>
                </div>
            ) : (
                <>
                    {markdownPolicies.length > 0 && (
                        <section className="mb-10">
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-teal-200">📖 읽어보기</h2>
                            <ul className="divide-y divide-gray-200 border-y border-gray-200">
                                {markdownPolicies.map((p) => (
                                    <li key={p.slug}>
                                        <Link
                                            href={`/policy/${p.slug}`}
                                            className="block py-5 hover:text-teal-600 transition"
                                        >
                                            <h2 className="font-semibold mb-1">{p.title}</h2>
                                            <p className="text-sm text-gray-600">{p.description}</p>
                                            <p className="text-xs text-gray-400 mt-2">{p.date}</p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {apiPolicies.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-teal-200">
                                📋 정부 정책 ({apiData.result?.pagging?.totCount?.toLocaleString() ?? apiPolicies.length}건)
                            </h2>
                            <ul className="divide-y divide-gray-200 border-y border-gray-200">
                                {apiPolicies.map((p) => (
                                    <ApiPolicyItem key={p.plcyNo} policy={p} />
                                ))}
                            </ul>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}