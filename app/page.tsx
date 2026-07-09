import type { Metadata } from "next";
import Link from "next/link";
import { getPolicies } from "@/lib/youthApi";
import { CATEGORY_LIST } from "@/lib/categories";
import { getAllPolicies, type PolicyMeta } from "@/lib/posts";
import PolicyCard from "@/components/PolicyCard";
import { getDDay } from "@/lib/utils";

export const metadata: Metadata = {
    alternates: { canonical: "/" },
};

const categories = CATEGORY_LIST;

// 큐레이션은 슬러그로만 지정한다. 제목·카테고리·설명은 실제 마크다운에서 가져와
// 콘텐츠와 어긋나거나(드리프트) 파일 삭제 시 깨진 링크가 생기지 않게 한다.
const FEATURED_SLUG = "youth-leap-account";
const POPULAR_SLUGS = ["youth-leap-account", "youth-rent-support", "learning-card"];

export default async function Home() {
    const apiData = await getPolicies({ pageSize: 24 }, 60 * 30);
    const recentPolicies = apiData.result?.youthPolicyList ?? [];
    const totalCount = apiData.result?.pagging?.totCount ?? 0;

    // 큐레이션 슬러그 → 실제 콘텐츠 메타 (존재하는 글만 남김)
    const metaBySlug = new Map(getAllPolicies().map((p) => [p.slug, p]));
    const featured = metaBySlug.get(FEATURED_SLUG);
    const popular = POPULAR_SLUGS
        .map((slug) => metaBySlug.get(slug))
        .filter((p): p is PolicyMeta => Boolean(p));

    // D-14 이내 마감 정책 추출 (사용 가능한 정책 중 마감이 임박한 순)
    const urgentPolicies = recentPolicies
        .map((p) => ({ policy: p, dday: getDDay(p.aplyYmd, p.bizPrdEndYmd) }))
        .filter(({ dday }) => dday !== null && dday <= 14)
        .sort((a, b) => a.dday! - b.dday!)
        .slice(0, 3)
        .map(({ policy }) => policy);

    return (
        <div className="max-w-5xl mx-auto px-4">
            {/* 메인 히어로 영역 */}
            <section className="py-12 md:py-16 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900 dark:text-gray-100">
                    청년 정책, <span className="text-teal-600 dark:text-teal-400">한눈에</span>
                </h1>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
                    청년도약계좌부터 월세지원까지 — 받을 수 있는 모든 혜택을 친근하게 정리합니다.
                </p>

                <form action="/search" method="get" className="max-w-xl mx-auto">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="q"
                            placeholder="정책을 검색해보세요 (예: 청년도약계좌, 월세지원)"
                            className="flex-1 px-5 py-3.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm text-sm"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-bold transition shadow-sm hover:shadow cursor-pointer text-sm"
                        >
                            검색
                        </button>
                    </div>
                </form>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    온통청년 API 기반 총 {totalCount.toLocaleString()}개 정책 지원
                </p>
            </section>

            {/* 오늘의 추천 정책 배너 */}
            {featured && (
            <section className="mb-12">
                <div className="bg-gradient-to-r from-teal-500/10 via-teal-50/50 to-teal-500/10 dark:from-teal-950/20 dark:via-slate-900 dark:to-teal-950/20 border border-teal-100/50 dark:border-teal-900/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="space-y-3 relative z-10 text-left">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-600 text-white dark:bg-teal-500/20 dark:text-teal-300">
                            🌟 오늘의 추천 정책
                        </span>
                        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
                            {featured.title}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
                            {featured.description}
                        </p>
                    </div>
                    <div className="flex-shrink-0 w-full md:w-auto relative z-10">
                        <Link
                            href={`/policy/${featured.slug}`}
                            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3.5 rounded-2xl font-bold transition shadow-md hover:shadow-lg active:scale-95 text-sm cursor-pointer"
                        >
                            혜택 확인하기
                            <span>→</span>
                        </Link>
                    </div>
                </div>
            </section>
            )}

            {/* 신청 마감 임박 정책 */}
            {urgentPolicies.length > 0 && (
                <section className="pb-12">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <span>⏰</span> 신청 마감 임박
                        </h2>
                        <Link href="/search" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
                            전체 검색 →
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {urgentPolicies.map((p) => (
                            <PolicyCard key={p.plcyNo} policy={p} />
                        ))}
                    </div>
                </section>
            )}

            {/* 카테고리 영역 */}
            <section className="pb-12">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">분야별 정책 찾기</h2>
                    <Link href="/search" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
                        전체 검색 →
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((c) => (
                        <Link
                            key={c.href}
                            href={c.href}
                            className={`${c.color} p-5 rounded-2xl transition border border-transparent hover:border-gray-200 dark:hover:border-slate-800/80 hover:shadow-md flex flex-col justify-between h-36`}
                        >
                            <div>
                                <div className="text-3xl mb-2">{c.icon}</div>
                                <div className="font-bold mb-1">{c.name}</div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{c.examples}</div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 실시간 트렌드 정책 TOP 3 */}
            {popular.length > 0 && (
            <section className="pb-12">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <span>🔥</span> 실시간 트렌드 정책 TOP 3
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {popular.map((p, idx) => {
                        const rankColors = [
                            "text-amber-500 bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/30",
                            "text-slate-600 bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 dark:text-slate-200",
                            "text-amber-700 bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900/30",
                        ];
                        const icons = ["🥇", "🥈", "🥉"];
                        return (
                            <Link
                                key={p.slug}
                                href={`/policy/${p.slug}`}
                                className="group relative flex flex-col justify-between p-6 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800/80 rounded-2xl transition hover:-translate-y-1 hover:shadow-md hover:border-teal-500/20"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-extrabold ${rankColors[idx]}`}>
                                            {idx + 1}
                                        </span>
                                        <span className="text-xs px-2.5 py-1 bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400 font-semibold rounded-lg">
                                            {p.category}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug line-clamp-2 mb-8">
                                        {p.title}
                                    </h3>
                                </div>
                                <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                                    가이드 및 신청방법 확인 {icons[idx]}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>
            )}

            {/* 정부 정책 목록 */}
            {recentPolicies.length > 0 && (
                <section className="pb-16">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">📋 최신 정부 정책</h2>
                        <Link href="/search" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
                            더 많은 정책 보기 →
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentPolicies.map((p) => (
                            <PolicyCard key={p.plcyNo} policy={p} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}