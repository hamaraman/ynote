import Link from "next/link";
import type { Metadata } from "next";
import { getPolicies } from "@/lib/youthApi";
import PolicyCard from "@/components/PolicyCard";
import SearchPolicyList from "@/components/SearchPolicyList";
import { getAllPolicies } from "@/lib/posts";

export const metadata: Metadata = {
    title: "정책 검색 및 필터",
    description: "나이와 지역, 키워드로 청년 정책 맞춤 검색하기",
};

const REGIONS = [
    { name: "전국/중앙부처", code: "003002018" },
    { name: "서울특별시", code: "003002001" },
    { name: "경기도", code: "003002009" },
    { name: "부산광역시", code: "003002002" },
    { name: "대구광역시", code: "003002003" },
    { name: "인천광역시", code: "003002004" },
    { name: "광주광역시", code: "003002005" },
    { name: "대전광역시", code: "003002006" },
    { name: "울산광역시", code: "003002007" },
    { name: "세종특별자치시", code: "003002008" },
    { name: "강원특별자치도", code: "003002010" },
    { name: "충청북도", code: "003002011" },
    { name: "충청남도", code: "003002012" },
    { name: "전북특별자치도", code: "003002013" },
    { name: "전라남도", code: "003002014" },
    { name: "경상북도", code: "003002015" },
    { name: "경상남도", code: "003002016" },
    { name: "제주특별자치도", code: "003002017" }
];

interface SearchPageProps {
    searchParams: Promise<{ q?: string; age?: string; region?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q, age, region } = await searchParams;
    const query = q?.trim() || "";
    const userAge = age ? Number(age) : undefined;
    const regionCode = region || "";

    let policies: Awaited<ReturnType<typeof getPolicies>>["result"]["youthPolicyList"] = [];
    let totalCount = 0;
    let localMatches: ReturnType<typeof getAllPolicies> = [];

    const hasFilters = query !== "" || regionCode !== "" || userAge !== undefined;

    if (hasFilters) {
        // 1. 로컬 마크다운 가이드 글 검색 (검색어가 있을 때만)
        if (query) {
            try {
                localMatches = getAllPolicies().filter(
                    (p) =>
                        p.title.toLowerCase().includes(query.toLowerCase()) ||
                        (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
                );
            } catch {
                localMatches = [];
            }
        }

        // 2. 실시간 정부 정책 API 검색
        try {
            const data = await getPolicies({
                plcyNm: query || undefined,
                srchPolyBizSecd: regionCode || undefined,
                pageSize: 40 // 나이 필터링을 감안하여 넉넉히 가져옴
            }, 60 * 30);
            
            let fetchedList = data.result?.youthPolicyList ?? [];
            totalCount = data.result?.pagging?.totCount ?? 0;

            // 만 나이 조건 필터링
            if (userAge !== undefined) {
                fetchedList = fetchedList.filter(p => {
                    const minAge = p.sprtTrgtMinAge ? Number(p.sprtTrgtMinAge) : 0;
                    const maxAge = p.sprtTrgtMaxAge ? Number(p.sprtTrgtMaxAge) : 99;
                    if (p.sprtTrgtAgeLmtYn === "Y") {
                        return userAge >= minAge && userAge <= maxAge;
                    }
                    return true;
                });
                
                // 만 나이 필터링 시 전체 개수는 대략 현재 리스트 수준으로 맞춤
                totalCount = fetchedList.length;
            }
            
            policies = fetchedList.slice(0, 24); // 화면에 보여줄 24개로 조절
        } catch {
            policies = [];
        }
    }

    const displayCount = userAge !== undefined 
        ? policies.length + localMatches.length 
        : totalCount + localMatches.length;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Link href="/" className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">
                <span>←</span> 홈
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-8 text-gray-900 dark:text-gray-100 tracking-tight">맞춤 정책 찾기</h1>

            {/* 필터 폼 */}
            <form method="get" action="/search" className="bg-gray-50 dark:bg-slate-900/50 border border-gray-150 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 mb-10 space-y-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 키워드 검색 */}
                    <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">검색어</label>
                        <input
                            type="text"
                            name="q"
                            defaultValue={query}
                            placeholder="예: 청년, 월세, 대출"
                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all"
                        />
                    </div>
                    {/* 지역 선택 */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">거주 지역</label>
                        <select
                            name="region"
                            defaultValue={regionCode}
                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer appearance-none transition-all"
                        >
                            <option value="">전체 지역</option>
                            {REGIONS.map((r) => (
                                <option key={r.code} value={r.code}>{r.name}</option>
                            ))}
                        </select>
                    </div>
                    {/* 나이 입력 */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">만 나이 (숫자만)</label>
                        <input
                            type="number"
                            name="age"
                            defaultValue={userAge !== undefined ? userAge : ""}
                            placeholder="예: 25"
                            min="0"
                            max="100"
                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all"
                        />
                    </div>
                </div>
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold transition shadow-md hover:shadow-lg active:scale-[0.98] text-sm w-full md:w-auto cursor-pointer flex items-center justify-center gap-2"
                    >
                        <span>조건 검색하기</span>
                        <span className="text-base">🔍</span>
                    </button>
                </div>
            </form>

            {hasFilters && (
                <div className="mb-8 flex items-center justify-between">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        조건에 따른 정책 검색 결과: <strong className="text-teal-600 dark:text-teal-400 font-bold">{displayCount.toLocaleString()}건</strong>
                    </p>
                    {displayCount > 0 && (
                        <button 
                            onClick={() => window.location.href = '/search'}
                            className="text-xs text-gray-500 hover:text-teal-600 dark:text-gray-500 dark:hover:text-teal-400 transition"
                        >
                            필터 초기화
                        </button>
                    )}
                </div>
            )}

            {(localMatches.length > 0 || policies.length > 0) ? (
                <div className="space-y-12">
                    {/* 1. 로컬 추천 가이드 영역 */}
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

                    {/* 2. 실시간 정부 정책 영역 */}
                    {policies.length > 0 ? (
                        <div>
                            <h2 className="text-lg font-bold mb-6 pb-3 border-b border-teal-200 dark:border-teal-900/50 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                                <span>📋</span> 실시간 정부 정책 ({userAge !== undefined ? `${policies.length}건 매칭` : `${totalCount.toLocaleString()}건`})
                            </h2>
                            <SearchPolicyList
                                initialPolicies={policies}
                                query={query}
                                region={regionCode}
                                age={userAge}
                                initialTotalCount={totalCount}
                            />
                        </div>
                    ) : (
                        query && (
                            <div className="bg-gray-50 dark:bg-slate-900/30 rounded-3xl p-10 text-center border border-gray-100 dark:border-slate-800">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    실시간 정부 정책에 대한 추가 검색 결과가 없습니다.
                                </p>
                            </div>
                        )
                    )}
                </div>
            ) : hasFilters ? (
                <div className="bg-gray-50 dark:bg-slate-900/40 border border-dashed border-gray-200 dark:border-slate-800 rounded-3xl p-20 text-center">
                    <div className="text-5xl mb-6">🤷‍♂️</div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 font-bold text-lg">조건에 매칭되는 결과가 없습니다.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 max-w-xs mx-auto">
                        나이나 지역 조건을 조정하거나 더 짧은 검색어를 입력해 보세요.
                      </p>
                </div>
            ) : (
                <div className="bg-gray-50 dark:bg-slate-900/40 border border-dashed border-gray-200 dark:border-slate-800 rounded-3xl p-20 text-center">
                    <div className="text-5xl mb-6">🎯</div>
                    <p className="text-gray-600 dark:text-gray-300 font-bold text-lg mb-2">나이, 지역 또는 검색어 조건을 선택하세요</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
                        자신에게 꼭 맞는 혜택을 쉽고 빠르게 찾을 수 있도록 필터를 사용해 보세요.
                    </p>
                </div>
            )}

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