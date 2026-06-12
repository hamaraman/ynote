import Link from "next/link";
import type { Metadata } from "next";
import { getPolicies } from "@/lib/youthApi";
import { formatYmd } from "@/lib/youthApi";

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

    if (query) {
        try {
            const data = await getPolicies({ plcyNm: query }, 60 * 30);
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
                    <p className="text-gray-600">
                        <strong>"{query}"</strong> 검색 결과: {totalCount.toLocaleString()}건
                    </p>
                </div>
            )}

            {policies.length > 0 ? (
                <ul className="space-y-4">
                    {policies.map((p) => {
                        const keywords = p.plcyKywdNm?.split(",").filter(Boolean).slice(0, 3) || [];
                        return (
                            <li key={p.plcyNo}>
                                <Link
                                    href={`/policy/${p.plcyNo}`}
                                    className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition"
                                >
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded-full">
                                            {p.lclsfNm || "전체"}
                                        </span>
                                        {p.mclsfNm && (
                                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                                {p.mclsfNm}
                                            </span>
                                        )}
                                        {keywords.map((kw, i) => (
                                            <span key={i} className="text-xs px-2 py-1 bg-teal-50 text-teal-600 rounded-full">
                                                {kw.trim()}
                                            </span>
                                        ))}
                                    </div>
                                    <h2 className="text-lg font-semibold mb-2 line-clamp-2">{p.plcyNm}</h2>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                        {p.plcyExplnCn}
                                    </p>
                                    {p.plcySprtCn && (
                                        <div className="bg-amber-50 rounded-lg p-3 mb-3">
                                            <p className="text-xs text-amber-800 font-medium mb-1">💰 지원 내용</p>
                                            <p className="text-sm text-gray-700 line-clamp-2">{p.plcySprtCn}</p>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                        <span>📅 {p.aplyYmd || "상시 신청"}</span>
                                        {p.sprvsnInstCdNm && <span>🏛️ {p.sprvsnInstCdNm}</span>}
                                        {p.sprtTrgtAgeLmtYn === "Y" && p.sprtTrgtMinAge && (
                                            <span>👤 만 {p.sprtTrgtMinAge}{p.sprtTrgtMaxAge ? `~${p.sprtTrgtMaxAge}` : ""}세</span>
                                        )}
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            ) : query ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center">
                    <p className="text-gray-500 mb-4">검색 결과가 없습니다.</p>
                    <p className="text-sm text-gray-400">
                        다른 키워드로 검색하거나 카테고리를 확인해보세요.
                    </p>
                </div>
            ) : (
                <div className="bg-gray-50 rounded-xl p-12 text-center">
                    <p className="text-gray-500">검색어를 입력해주세요.</p>
                    <p className="text-sm text-gray-400 mt-2">
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