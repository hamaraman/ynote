import Link from "next/link";
import type { Metadata } from "next";
import { getPolicies } from "@/lib/youthApi";
import PolicyCard from "@/components/PolicyCard";
import SearchPolicyList from "@/components/SearchPolicyList";
import { getAllPolicies } from "@/lib/posts";

export const metadata: Metadata = {
    title: "정책 검색",
    description: "청년 정책 키워드로 검색하기",
};

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = q?.trim() || "";

    let policies: Awaited<ReturnType<typeof getPolicies>>["result"]["youthPolicyList"] = [];
    let totalCount = 0;
    let localMatches: ReturnType<typeof getAllPolicies> = [];

    if (query) {
        // 1. 로컬 마크다운 가이드 글 검색
        try {
            localMatches = getAllPolicies().filter(
                (p) =>
                    p.title.toLowerCase().includes(query.toLowerCase()) ||
                    (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
            );
        } catch {
            localMatches = [];
        }

        // 2. 실시간 정부 정책 API 검색
        try {
            const data = await getPolicies({ plcyNm: query, pageSize: 24 }, 60 * 30);
            policies = data.result?.youthPolicyList ?? [];
            totalCount = data.result?.pagging?.totCount ?? 0;
        } catch {
            policies = [];
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <Link href="/" className="text-sm text-teal-600 hover:underline">
                ← 홈
            </Link>
            <h1 className="text-3xl font-bold mt-4 mb-8">정책 검색</h1>

            <form method="get" action="/search" className="mb-8">
                <div className="flex gap-2">
                    <input
                        type="text"
                        name="q"
                        defaultValue={query}
                        placeholder="정책명을 입력하세요 (예: 청년, 월세, 배움카드)"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
                    >
                        검색
                    </button>
                </div>
            </form>

            {query && (
                <div className="mb-6">
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                        <strong>&ldquo;{query}&rdquo;</strong> 검색 결과: {(totalCount + localMatches.length).toLocaleString()}건
                    </p>
                </div>
            )}

            {(localMatches.length > 0 || policies.length > 0) ? (
                <div className="space-y-10">
                    {/* 1. 로컬 추천 가이드 영역 */}
                    {localMatches.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-teal-200 dark:border-teal-900/50 flex items-center gap-1.5">
                                <span>📖</span> 추천 읽어보기 ({localMatches.length}건)
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {localMatches.map((p) => (
                                    <PolicyCard key={p.slug} policy={p} isMarkdown={true} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 2. 실시간 정부 정책 영역 */}
                    {policies.length > 0 ? (
                        <div>
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-teal-200 dark:border-teal-900/50 flex items-center gap-1.5">
                                <span>📋</span> 실시간 정부 정책 ({totalCount.toLocaleString()}건)
                            </h2>
                            <SearchPolicyList
                                initialPolicies={policies}
                                query={query}
                                initialTotalCount={totalCount}
                            />
                        </div>
                    ) : (
                        query && (
                            <div className="bg-gray-50 dark:bg-slate-800/30 rounded-2xl p-6 text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    실시간 정부 정책에 대한 추가 검색 결과가 없습니다.
                                </p>
                            </div>
                        )
                    )}
                </div>
            ) : query ? (
                <div className="bg-gray-50 dark:bg-slate-800/40 rounded-2xl p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">검색 결과가 없습니다.</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        다른 키워드로 검색하거나 카테고리를 확인해보세요.
                    </p>
                </div>
            ) : (
                <div className="bg-gray-50 dark:bg-slate-800/40 rounded-2xl p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">검색어를 입력해주세요.</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                        예: 청년도약계좌, 월세지원, 내일배움카드, 문화패스
                    </p>
                </div>
            )}

            <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="font-semibold mb-4">인기 검색어</h3>
                <div className="flex flex-wrap gap-2">
                    {["청년", "월세", "배움카드", "도약계좌", "대출", "교육", "의료", "주거"].map((tag) => (
                        <Link
                            key={tag}
                            href={`/search?q=${encodeURIComponent(tag)}`}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition"
                        >
                            {tag}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}