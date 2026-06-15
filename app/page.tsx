import Link from "next/link";
import { getPolicies } from "@/lib/youthApi";
import PolicyCard from "@/components/PolicyCard";

const categories = [
    { name: "금융/자산", href: "/category/finance", icon: "💰", desc: "청년도약계좌, 청약통장, 소득공제펀드", color: "bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 dark:border dark:border-amber-900/20 text-gray-900 dark:text-gray-100" },
    { name: "주거", href: "/category/housing", icon: "🏠", desc: "월세지원, 전세대출, 청년주택", color: "bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 dark:border dark:border-rose-900/20 text-gray-900 dark:text-gray-100" },
    { name: "일자리", href: "/category/job", icon: "💼", desc: "내일배움카드, 구직지원금, 채움공제", color: "bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/20 dark:hover:bg-sky-900/30 dark:border dark:border-sky-900/20 text-gray-900 dark:text-gray-100" },
    { name: "교육/문화", href: "/category/edu", icon: "📚", desc: "문화패스, K-패스, 평생교육바우처", color: "bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/20 dark:hover:bg-violet-900/30 dark:border dark:border-violet-900/20 text-gray-900 dark:text-gray-100" },
    { name: "건강/생활", href: "/category/life", icon: "🏥", desc: "마음건강바우처, 청년몽땅정보통", color: "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 dark:border dark:border-emerald-900/20 text-gray-900 dark:text-gray-100" },
    { name: "지역별 혜택", href: "/category/region", icon: "📍", desc: "서울/경기/부산 등 지자체 지원", color: "bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-900/30 dark:border dark:border-orange-900/20 text-gray-900 dark:text-gray-100" },
];

const popular = [
    { title: "청년도약계좌 신청 방법과 조건 총정리", href: "/policy/youth-leap-account", cat: "금융" },
    { title: "청년 월세 지원금, 지역별로 다 모았다", href: "/policy/youth-rent-support", cat: "주거" },
    { title: "국민내일배움카드 신청부터 사용까지", href: "/policy/learning-card", cat: "일자리" },
];

export default async function Home() {
    const apiData = await getPolicies({ pageSize: 24 }, 60 * 30);
    const recentPolicies = apiData.result?.youthPolicyList ?? [];
    const totalCount = apiData.result?.pagging?.totCount ?? 0;

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
            <section className="mb-12">
                <div className="bg-gradient-to-r from-teal-500/10 via-teal-50/50 to-teal-500/10 dark:from-teal-950/20 dark:via-slate-900 dark:to-teal-950/20 border border-teal-100/50 dark:border-teal-900/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="space-y-3 relative z-10 text-left">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-600 text-white dark:bg-teal-500/20 dark:text-teal-300">
                            🌟 오늘의 추천 정책
                        </span>
                        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
                            청년도약계좌 신청 방법과 조건 총정리
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
                            매월 최대 70만원씩 5년간 납입하면 비과세 혜택과 정부 기여금까지 더해 약 5천만원의 목돈을 모을 수 있는 청년 대표 자산 형성 정책입니다.
                        </p>
                    </div>
                    <div className="flex-shrink-0 w-full md:w-auto relative z-10">
                        <Link
                            href="/policy/youth-leap-account"
                            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3.5 rounded-2xl font-bold transition shadow-md hover:shadow-lg active:scale-95 text-sm cursor-pointer"
                        >
                            혜택 확인하기
                            <span>→</span>
                        </Link>
                    </div>
                </div>
            </section>

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
                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{c.desc}</div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 실시간 트렌드 정책 TOP 3 */}
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
                                key={p.href}
                                href={p.href}
                                className="group relative flex flex-col justify-between p-6 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800/80 rounded-2xl transition hover:-translate-y-1 hover:shadow-md hover:border-teal-500/20"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-extrabold ${rankColors[idx]}`}>
                                            {idx + 1}
                                        </span>
                                        <span className="text-xs px-2.5 py-1 bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400 font-semibold rounded-lg">
                                            {p.cat}
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