import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    alternates: { canonical: "/" },
};

const mainPolicies = [
    {
        slug: "youth-rent-support",
        title: "청년 월세 한시 특별지원",
        category: "주거",
        categoryColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
        description: "월 최대 20만원 · 최대 12개월",
        target: "만 19~34세 무주택 청년",
        dday: "D-12",
    },
    {
        slug: "youth-work-experience",
        title: "청년 일경험 지원사업",
        category: "취업",
        categoryColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
        description: "월 최대 234만원 지원",
        target: "만 15~34세 미취업 청년",
        dday: "D-3",
    },
    {
        slug: "learning-card",
        title: "국민내일배움카드",
        category: "교육",
        categoryColor: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
        description: "최대 500만원 교육비 지원",
        target: "취업준비생 · 직장인 등",
        dday: "D-25",
    },
    {
        slug: "pre-startup-package",
        title: "청년 창업 지원사업",
        category: "창업",
        categoryColor: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
        description: "사업화 자금 최대 1억원",
        target: "예비창업자 · 3년 이내 창업자",
        dday: "D-18",
    },
];

const categories = [
    { label: "주거", query: "주거", icon: "⌂", tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" },
    { label: "취업", query: "취업", icon: "↗", tone: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" },
    { label: "교육", query: "교육", icon: "✦", tone: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300" },
    { label: "창업", query: "창업", icon: "＋", tone: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" },
    { label: "생활", query: "생활", icon: "♡", tone: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300" },
];

export default function Home() {
    return (
        <div className="min-h-screen overflow-hidden bg-white dark:bg-slate-950">
            <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 md:pb-24 md:pt-10 lg:px-8">
                {/* Hero */}
                <section className="relative overflow-hidden rounded-[2rem] bg-[#f5f8ff] px-6 py-10 dark:bg-slate-900 sm:px-10 md:py-14 lg:px-16">
                    <div className="pointer-events-none absolute -right-28 -top-32 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/25" />
                    <div className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-900/20" />

                    <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
                        <div className="max-w-2xl">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm dark:border-blue-900/60 dark:bg-slate-800/80 dark:text-blue-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                공식 출처 기반 청년정책 가이드
                            </div>
                            <h1 className="text-[2.35rem] font-black leading-[1.12] tracking-[-0.055em] text-slate-950 dark:text-white sm:text-5xl md:text-[3.7rem]">
                                받을 수 있는 혜택,
                                <br />
                                <span className="text-blue-600 dark:text-blue-400">놓치지 않게</span> 찾아보세요
                            </h1>
                            <p className="mt-6 max-w-lg text-sm font-medium leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                                복잡하고 흩어진 청년정책을 한곳에 모았습니다.
                                <br className="hidden sm:block" />
                                나에게 맞는 지원정책을 빠르게 확인해보세요.
                            </p>

                            <form action="/search" method="get" className="mt-8 max-w-xl">
                                <label htmlFor="policy-search" className="sr-only">찾고 싶은 정책 검색</label>
                                <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_14px_40px_rgba(37,99,235,0.12)] transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none dark:focus-within:ring-blue-950">
                                    <svg aria-hidden="true" className="ml-3 h-5 w-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
                                    </svg>
                                    <input
                                        id="policy-search"
                                        type="text"
                                        name="q"
                                        placeholder="예: 청년 월세, 내일배움카드"
                                        className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 dark:text-white sm:text-base"
                                    />
                                    <button type="submit" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[.98]">
                                        검색
                                    </button>
                                </div>
                            </form>

                            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                <span className="mr-1 text-slate-400">많이 찾는 주제</span>
                                {categories.slice(0, 4).map((category) => (
                                    <Link key={category.label} href={`/search?q=${encodeURIComponent(category.query)}`} className="rounded-md px-1.5 py-1 transition hover:bg-white hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-300">
                                        #{category.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="relative hidden min-h-[330px] items-center justify-center lg:flex" aria-hidden="true">
                            <div className="absolute h-64 w-64 rounded-full bg-white/80 shadow-[0_20px_80px_rgba(59,130,246,0.14)] dark:bg-slate-800/70" />
                            <div className="relative w-64 -rotate-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 shadow-2xl shadow-blue-900/20">
                                <div className="mb-14 flex items-center justify-between text-blue-100">
                                    <span className="text-xs font-bold tracking-[.18em]">YOUTH NOTE</span>
                                    <span className="rounded-full bg-white/15 px-2 py-1 text-[10px]">2026</span>
                                </div>
                                <div className="text-5xl font-black tracking-[-.08em] text-white">청년</div>
                                <div className="mt-1 text-sm font-semibold text-blue-100">내게 필요한 정책 노트</div>
                                <div className="mt-8 h-1.5 w-20 rounded-full bg-white/30" />
                            </div>
                            <div className="absolute bottom-10 right-8 rotate-6 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-xl dark:border-slate-700 dark:bg-slate-800/90">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">✓</span> 맞춤 정책 찾기</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick actions */}
                <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Link href="/diagnosis" className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900">
                        <div className="mb-4 flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">✦</span><span className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500">→</span></div>
                        <h2 className="font-extrabold text-slate-900 dark:text-white">나에게 맞는 정책 찾기</h2>
                        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">3가지 질문으로 맞춤 추천받기</p>
                    </Link>
                    <Link href="/search?filter=closing" className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-red-900">
                        <div className="mb-4 flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-lg text-red-600 dark:bg-red-950/50 dark:text-red-300">⏱</span><span className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-red-500">→</span></div>
                        <h2 className="font-extrabold text-slate-900 dark:text-white">마감 임박 정책</h2>
                        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">신청 기간이 얼마 남지 않았어요</p>
                    </Link>
                    <Link href="/search" className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900">
                        <div className="mb-4 flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">⌕</span><span className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500">→</span></div>
                        <h2 className="font-extrabold text-slate-900 dark:text-white">전체 정책 둘러보기</h2>
                        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">주거·취업·교육·생활 한눈에</p>
                    </Link>
                </section>

                {/* Policy list */}
                <section className="mt-16" aria-labelledby="open-policies-title">
                    <div className="mb-6 flex items-end justify-between gap-4">
                        <div>
                            <div className="mb-2 text-xs font-extrabold uppercase tracking-[.18em] text-blue-600 dark:text-blue-400">JUST IN</div>
                            <h2 id="open-policies-title" className="text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">지금 신청할 수 있어요</h2>
                            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">오늘 확인하면 좋은 청년정책을 모았어요.</p>
                        </div>
                        <Link href="/search" className="shrink-0 rounded-lg px-2 py-2 text-sm font-bold text-slate-500 transition hover:bg-slate-50 hover:text-blue-600 dark:hover:bg-slate-900 dark:hover:text-blue-400">전체보기 <span aria-hidden="true">→</span></Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {mainPolicies.map((policy) => (
                            <Link key={policy.slug} href={`/policy/${policy.slug}`} className="group flex min-h-[220px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900 dark:hover:shadow-none">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${policy.categoryColor}`}>{policy.category}</span>
                                        <span className="rounded-md bg-red-50 px-2 py-1 text-[11px] font-black text-red-600 dark:bg-red-950/40 dark:text-red-300">{policy.dday}</span>
                                    </div>
                                    <h3 className="mt-5 line-clamp-2 text-[17px] font-extrabold leading-snug text-slate-900 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">{policy.title}</h3>
                                    <p className="mt-3 text-sm font-bold text-blue-600 dark:text-blue-400">{policy.description}</p>
                                </div>
                                <div className="mt-6 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-400 dark:border-slate-800 dark:text-slate-500">{policy.target}</div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Categories */}
                <section className="mt-16" aria-labelledby="category-title">
                    <div className="mb-5 flex items-center justify-between"><h2 id="category-title" className="text-xl font-black tracking-tight text-slate-950 dark:text-white">관심 있는 분야를 골라보세요</h2><span className="text-xs font-semibold text-slate-400">원하는 주제로 바로 검색</span></div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                        {categories.map((category) => (
                            <Link key={category.label} href={`/search?q=${encodeURIComponent(category.query)}`} className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                                <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg font-bold ${category.tone}`}>{category.icon}</span>
                                <span className="text-sm font-extrabold text-slate-700 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400">{category.label}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className="relative mt-16 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-9 text-white shadow-xl shadow-blue-900/15 sm:px-10 md:flex md:items-center md:justify-between md:gap-8">
                    <div className="pointer-events-none absolute -right-10 -top-20 h-60 w-60 rounded-full border-[32px] border-white/10" />
                    <div className="relative"><p className="text-xs font-bold uppercase tracking-[.18em] text-blue-200">YOUR NEXT STEP</p><h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">내가 받을 수 있는 정책,<br className="sm:hidden" /> 지금 확인해볼까요?</h2><p className="mt-3 text-sm font-medium text-blue-100">간단한 질문에 답하면 조건에 맞는 정책을 찾아드려요.</p></div>
                    <Link href="/diagnosis" className="relative mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-5 text-sm font-extrabold text-blue-700 shadow-lg transition hover:bg-blue-50 active:scale-[.98] md:mt-0">맞춤진단 시작하기 <span className="ml-2" aria-hidden="true">→</span></Link>
                </section>
            </main>
        </div>
    );
}
