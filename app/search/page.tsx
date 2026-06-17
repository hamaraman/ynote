import Link from "next/link";
import type { Metadata } from "next";
import { getPolicies, CATEGORY_TO_LCLSF } from "@/lib/youthApi";
import PolicyCard from "@/components/PolicyCard";
import SearchPolicyList from "@/components/SearchPolicyList";
import SearchFilters from "@/components/SearchFilters";
import { getAllPolicies } from "@/lib/posts";

export const metadata: Metadata = {
    title: "맞춤 정책 검색",
    description: "카테고리, 나이, 지역, 키워드로 나에게 딱 맞는 청년 정책을 찾아보세요.",
    openGraph: {
        title: "맞춤 정책 검색 | 청년노트",
        description: "카테고리, 나이, 지역, 키워드로 나에게 딱 맞는 청년 정책을 찾아보세요.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "맞춤 정책 검색 | 청년노트",
        description: "카테고리, 나이, 지역, 키워드로 나에게 딱 맞는 청년 정책을 찾아보세요.",
    },
    alternates: { canonical: "/search" },
};

interface SearchPageProps {
    searchParams: Promise<{ q?: string; age?: string; region?: string; cat?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q, age, region, cat } = await searchParams;
    const query = q?.trim() || "";
    const userAge = age ? Number(age) : undefined;
    const regionCode = region || "";
    const categorySlug = cat || "";

    let policies: Awaited<ReturnType<typeof getPolicies>>["result"]["youthPolicyList"] = [];
    let totalCount = 0;
    let localMatches: ReturnType<typeof getAllPolicies> = [];

    const hasFilters = query !== "" || regionCode !== "" || userAge !== undefined || categorySlug !== "";

    if (hasFilters) {
        // 로컬 마크다운 가이드 검색 (검색어 있을 때만)
        if (query) {
            try {
                localMatches = getAllPolicies().filter(
                    (p) =>
                        p.title.toLowerCase().includes(query.toLowerCase()) ||
                        (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
                );
                // 카테고리 필터도 적용
                if (categorySlug) {
                    localMatches = localMatches.filter((p) => p.categorySlug === categorySlug);
                }
            } catch {
                localMatches = [];
            }
        } else if (categorySlug) {
            // 검색어 없이 카테고리만 선택된 경우
            try {
                localMatches = getAllPolicies().filter((p) => p.categorySlug === categorySlug);
            } catch {
                localMatches = [];
            }
        }

        // 실시간 정부 정책 API 검색
        try {
            const lclsfNm = categorySlug ? CATEGORY_TO_LCLSF[categorySlug] : undefined;
            const data = await getPolicies(
                {
                    plcyNm: query || undefined,
                    srchPolyBizSecd: regionCode || undefined,
                    lclsfNm,
                    pageSize: 40,
                },
                60 * 30
            );

            let fetchedList = data.result?.youthPolicyList ?? [];
            totalCount = data.result?.pagging?.totCount ?? 0;

            // 만 나이 조건 클라이언트 필터링
            if (userAge !== undefined) {
                fetchedList = fetchedList.filter((p) => {
                    if (p.sprtTrgtAgeLmtYn !== "Y") return true;
                    const minAge = p.sprtTrgtMinAge ? Number(p.sprtTrgtMinAge) : 0;
                    const maxAge = p.sprtTrgtMaxAge ? Number(p.sprtTrgtMaxAge) : 99;
                    return userAge >= minAge && userAge <= maxAge;
                });
                totalCount = fetchedList.length;
            }

            policies = fetchedList.slice(0, 24);
        } catch {
            policies = [];
        }
    }

    const displayCount =
        userAge !== undefined
            ? policies.length + localMatches.length
            : totalCount + localMatches.length;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Link
                href="/"
                className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
                <span>←</span> 홈
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-8 text-gray-900 dark:text-gray-100 tracking-tight">
                맞춤 정책 찾기
            </h1>

            {/* 필터 (클라이언트 컴포넌트) */}
            <SearchFilters
                defaultQ={query}
                defaultAge={age ?? ""}
                defaultRegion={regionCode}
                defaultCat={categorySlug}
            />

            {/* 검색 결과 헤더 */}
            {hasFilters && (
                <div className="mb-8">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        조건에 맞는 정책:{" "}
                        <strong className="text-teal-600 dark:text-teal-400 font-bold">
                            {displayCount.toLocaleString()}건
                        </strong>
                    </p>
                </div>
            )}

            {/* 결과 영역 */}
            {localMatches.length > 0 || policies.length > 0 ? (
                <div className="space-y-12">
                    {localMatches.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold mb-6 pb-3 border-b border-teal-200 dark:border-teal-900/50 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                                <span>📖</span> 핵심 가이드 ({localMatches.length}건)
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {localMatches.map((p) => (
                                    <PolicyCard key={p.slug} policy={p} isMarkdown={true} />
                                ))}
                            </div>
                        </div>
                    )}

                    {policies.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold mb-6 pb-3 border-b border-teal-200 dark:border-teal-900/50 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                                <span>📋</span> 실시간 정부 정책 (
                                {userAge !== undefined
                                    ? `${policies.length}건 매칭`
                                    : `${totalCount.toLocaleString()}건`}
                                )
                            </h2>
                            <SearchPolicyList
                                initialPolicies={policies}
                                query={query}
                                region={regionCode}
                                age={userAge}
                                categorySlug={categorySlug}
                                initialTotalCount={totalCount}
                            />
                        </div>
                    )}

                    {policies.length === 0 && query && (
                        <div className="bg-gray-50 dark:bg-slate-900/30 rounded-3xl p-10 text-center border border-gray-100 dark:border-slate-800">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                실시간 정부 정책에서 추가 검색 결과가 없습니다.
                            </p>
                        </div>
                    )}
                </div>
            ) : hasFilters ? (
                <div className="bg-gray-50 dark:bg-slate-900/40 border border-dashed border-gray-200 dark:border-slate-800 rounded-3xl p-20 text-center">
                    <div className="text-5xl mb-6">🤷‍♂️</div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 font-bold text-lg">
                        조건에 매칭되는 결과가 없습니다.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 max-w-xs mx-auto">
                        나이나 지역 조건을 조정하거나 더 짧은 검색어를 입력해 보세요.
                    </p>
                </div>
            ) : (
                <div className="bg-gray-50 dark:bg-slate-900/40 border border-dashed border-gray-200 dark:border-slate-800 rounded-3xl p-20 text-center">
                    <div className="text-5xl mb-6">🎯</div>
                    <p className="text-gray-600 dark:text-gray-300 font-bold text-lg mb-2">
                        카테고리, 나이, 지역 또는 검색어를 선택하세요
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
                        자신에게 꼭 맞는 혜택을 쉽고 빠르게 찾을 수 있도록 필터를 사용해 보세요.
                    </p>
                </div>
            )}

            {/* 인기 검색 태그 */}
            <div className="mt-16 pt-10 border-t border-gray-150 dark:border-slate-800/80">
                <h3 className="font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <span>✨</span> 인기 검색 태그
                </h3>
                <div className="flex flex-wrap gap-2.5">
                    {["청년", "월세", "배움카드", "도약계좌", "대출", "교육", "주거", "지원금"].map((tag) => (
                        <Link
                            key={tag}
                            href={`/search?q=${encodeURIComponent(tag)}`}
                            className="px-4 py-2 bg-white dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-900/20 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-800 rounded-xl text-sm transition-all font-medium hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-200 dark:hover:border-teal-900/50"
                        >
                            #{tag}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
