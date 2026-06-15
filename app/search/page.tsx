import Link from "next/link";
import type { Metadata } from "next";
import { getPolicies } from "@/lib/youthApi";
import PolicyCard from "@/components/PolicyCard";

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
                <div className="grid md:grid-cols-2 gap-6">
                    {policies.map((p) => (
                        <PolicyCard key={p.plcyNo} policy={p} />
                    ))}
                </div>
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