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
            <Link href="/" className="text-sm text-teal-600 hover:underline">
                ← 홈
            </Link>
            <h1 className="text-3xl font-bold mt-4 mb-8 text-gray-900 dark:text-gray-100">맞춤 정책 찾기</h1>

            {/* 필터 폼 */}
            <form method="get" action="/search" className="bg-gray-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800/80 rounded-2xl p-5 md:p-6 mb-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 키워드 검색 */}
                    <div className="md:col-span-1">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">검색어</label>
                        <input
                            type="text"
                            name="q"
                            defaultValue={query}
                            placeholder="예: 청년, 월세, 대출"
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                        />
                    </div>
                    {/* 지역 선택 */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">거주 지역</label>
                        <select
                            name="region"
                            defaultValue={regionCode}
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-850 dark:text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer"
                        >
                            <option value="">전체 지역</option>
                            {REGIONS.map((r) => (
                                <option key={r.code} value={r.code}>{r.name}</option>
                            ))}
                        </select>
                    </div>
                    {/* 나이 입력 */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">만 나이 (숫자만)</label>
                        <input
                            type="number"
                            name="age"
                            defaultValue={userAge !== undefined ? userAge : ""}
                            placeholder="예: 25"
                            min="0"
                            max="100"
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                        />
                    </div>
                </div>
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition shadow-sm hover:shadow active:scale-95 text-sm w-full md:w-auto cursor-pointer"
                    >
                        조건 검색하기 🔍
                    </button>
                </div>
            </form>

            {hasFilters && (
                <div className="mb-6">
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                        조건에 따른 정책 검색 결과: <strong className="text-teal-600 dark:text-teal-400">{displayCount.toLocaleString()}건</strong>
                    </p>
                </div>
            )}

            {(localMatches.length > 0 || policies.length > 0) ? (
                <div className="space-y-10">
                    {/* 1. 로컬 추천 가이드 영역 */}
                    {localMatches.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-teal-200 dark:border-teal-900/50 flex items-center gap-1.5 text-gray-800 dark:text-gray-100">
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
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-teal-200 dark:border-teal-900/50 flex items-center gap-1.5 text-gray-800 dark:text-gray-100">
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
                            <div className="bg-gray-50 dark:bg-slate-800/30 rounded-2xl p-6 text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    실시간 정부 정책에 대한 추가 검색 결과가 없습니다.
                                </p>
                            </div>
                        )
                    )}
                </div>
            ) : hasFilters ? (
                <div className="bg-gray-50 dark:bg-slate-800/40 rounded-2xl p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">조건에 매칭되는 결과가 없습니다.</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        나이나 지역 조건을 조정하거나 다른 검색어를 입력해 보세요.
                      </p>
                </div>
            ) : (
                <div className="bg-gray-50 dark:bg-slate-800/40 rounded-2xl p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">나이, 지역 또는 검색어 조건을 선택하여 맞춤 정책을 찾아보세요.</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                        예: 경기도 거주, 만 25세 청년을 위한 일자리/주거 혜택 검색
                    </p>
                </div>
            )}

            <div className="mt-12 pt-8 border-t border-gray-150 dark:border-slate-800/80">
                <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">인기 검색 태그</h3>
                <div className="flex flex-wrap gap-2">
                    {["청년", "월세", "배움카드", "도약계좌", "대출", "교육", "주거"].map((tag) => (
                        <Link
                            key={tag}
                            href={`/search?q=${encodeURIComponent(tag)}`}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-sm transition font-medium"
                        >
                            #{tag}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}