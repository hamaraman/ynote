import type { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
    alternates: { canonical: "/" },
};

export default function Home() {
    const mainPolicies = [
        {
            slug: "youth-rent-support",
            title: "청년 월세 한시 특별지원",
            category: "주거",
            categoryColor: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
            borderColor: "hover:border-emerald-500 hover:shadow-emerald-500/5",
            description: "월 최대 20만원씩 최대 12개월 지원",
            target: "만 19~34세 무주택 청년",
            dday: "D-12",
        },
        {
            slug: "youth-work-experience",
            title: "청년 일경험 지원사업",
            category: "취업",
            categoryColor: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border-blue-100 dark:border-blue-900/30",
            borderColor: "hover:border-blue-500 hover:shadow-blue-500/5",
            description: "월 최대 234만원 지원",
            target: "만 15~34세 미취업 청년",
            dday: "D-3",
        },
        {
            slug: "learning-card",
            title: "국민내일배움카드",
            category: "교육",
            categoryColor: "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400 border-purple-100 dark:border-purple-900/30",
            borderColor: "hover:border-purple-500 hover:shadow-purple-500/5",
            description: "최대 500만원 지원",
            target: "취업준비생, 직장인 등",
            dday: "D-25",
        },
        {
            slug: "pre-startup-package",
            title: "청년 창업 지원사업",
            category: "창업",
            categoryColor: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/30",
            borderColor: "hover:border-amber-500 hover:shadow-amber-500/5",
            description: "최대 1억원 지원",
            target: "예비창업자, 3년 이내 창업자",
            dday: "D-18",
        },
    ];

    const tags = [
        { label: "주거지원", query: "주거" },
        { label: "취업지원", query: "취업" },
        { label: "교육지원", query: "교육" },
        { label: "창업지원", query: "창업" },
        { label: "생활지원", query: "생활" },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
            {/* 1. 메인 히어로 영역 */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gray-50/50 dark:bg-slate-900/20 rounded-3xl p-6 md:p-10 border border-gray-100 dark:border-slate-800">
                <div className="lg:col-span-7 space-y-6 text-left">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
                        청년에게 필요한 정책을<br />
                        <span className="text-blue-600 dark:text-blue-400">한눈에</span> 찾아보세요
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm md:text-lg font-medium leading-relaxed">
                        나에게 맞는 정책을 검색하고<br className="hidden sm:inline" />
                        지원 혜택을 놓치지 마세요!
                    </p>

                    {/* 검색 바 */}
                    <form action="/search" method="get" className="max-w-xl">
                        <div className="relative flex items-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-1.5 shadow-lg shadow-gray-100/50 dark:shadow-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-300">
                            <input
                                type="text"
                                name="q"
                                placeholder="어떤 정책을 찾고 있나요?"
                                className="flex-1 px-4 py-3 bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none text-sm md:text-base"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all duration-200 shadow-md shadow-blue-500/25 active:scale-95 cursor-pointer flex items-center justify-center"
                                aria-label="검색"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </form>

                    {/* 추천 태그 */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        {tags.map((tag) => (
                            <Link
                                key={tag.label}
                                href={`/search?q=${encodeURIComponent(tag.query)}`}
                                className="px-3 py-1.5 bg-white hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-slate-700 rounded-xl text-xs md:text-sm font-semibold transition-all shadow-sm inline-flex items-center justify-center"
                            >
                                #{tag.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 우측 일러스트레이션 (SVG) */}
                <div className="lg:col-span-5 flex justify-center items-center">
                    <svg className="w-full max-w-[360px] h-auto drop-shadow-xl" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="bookGrad" x1="50" y1="50" x2="350" y2="350" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#7C3AED" />
                                <stop offset="100%" stopColor="#4F46E5" />
                            </linearGradient>
                            <linearGradient id="bookCoverGrad" x1="120" y1="120" x2="330" y2="330" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#6D28D9" />
                                <stop offset="100%" stopColor="#3730A3" />
                            </linearGradient>
                            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                                <feDropShadow dx="0" dy="15" stdDeviation="15" floodColor="#4F46E5" floodOpacity="0.15" />
                            </filter>
                        </defs>

                        {/* Background subtle circle */}
                        <circle cx="200" cy="200" r="160" fill="#EEF2FF" className="dark:hidden" />
                        <circle cx="200" cy="200" r="160" fill="#1E1B4B" fillOpacity="0.2" className="hidden dark:block" />

                        {/* Isometric Book Group */}
                        <g filter="url(#shadow)" transform="translate(10, 10)">
                            {/* Pages shadow/depth */}
                            <path d="M120 180 L280 200 L260 300 L100 280 Z" fill="#E2E8F0" />
                            <path d="M125 185 L285 205 L280 215 L120 195 Z" fill="#FFFFFF" />
                            <path d="M120 195 L280 215 L275 225 L115 205 Z" fill="#F1F5F9" />
                            <path d="M115 205 L275 225 L270 235 L110 215 Z" fill="#E2E8F0" />

                            {/* Book Main Body */}
                            <rect x="90" y="160" width="180" height="120" rx="16" transform="rotate(-10, 180, 220)" fill="url(#bookGrad)" />
                            
                            {/* Inner Accent Cover */}
                            <rect x="100" y="170" width="160" height="100" rx="10" transform="rotate(-10, 180, 220)" fill="url(#bookCoverGrad)" />

                            {/* Logo on the book */}
                            <text x="180" y="240" fill="#FFFFFF" fontSize="56" fontWeight="900" fontFamily="Pretendard, system-ui" textAnchor="middle" transform="rotate(-10, 180, 220)">청</text>
                        </g>

                        {/* Person Silhouette working on laptop */}
                        <g transform="translate(200, 180)">
                            {/* Head */}
                            <circle cx="60" cy="-20" r="14" fill="#3B82F6" />
                            {/* Body */}
                            <path d="M40 0 C40 -10, 80 -10, 80 0 L80 50 C80 50, 75 60, 60 60 C45 60, 40 50, 40 50 Z" fill="#1E3A8A" />
                            {/* Laptop */}
                            <path d="M40 45 L5 40 L10 25 L45 30 Z" fill="#94A3B8" />
                            <path d="M5 40 L-20 42 L-22 47 L7 45 Z" fill="#CBD5E1" />
                            {/* Arms */}
                            <path d="M50 5 L20 25 L35 32" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                            {/* Table/Pants detail */}
                            <path d="M60 60 L75 100 L45 100 Z" fill="#1D4ED8" />
                        </g>
                    </svg>
                </div>
            </section>

            {/* 2. 지금 신청 가능한 정책 섹션 */}
            <section className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
                        지금 신청 가능한 정책
                    </h2>
                    <Link href="/search" className="text-sm font-semibold text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        전체보기 &gt;
                    </Link>
                </div>

                {/* 4 Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mainPolicies.map((p) => (
                        <Link
                            key={p.slug}
                            href={`/policy/${p.slug}`}
                            className={`flex flex-col justify-between p-6 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-150/20 dark:hover:shadow-none ${p.borderColor}`}
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    {/* Category tag */}
                                    <span className={`text-xs px-2.5 py-1 rounded-lg font-bold border ${p.categoryColor}`}>
                                        {p.category}
                                    </span>
                                    {/* D-Day badge */}
                                    <span className="text-xs font-black text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded">
                                        {p.dday}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-extrabold text-base text-gray-900 dark:text-white leading-snug line-clamp-1">
                                        {p.title}
                                    </h3>
                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                        {p.description}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-400 dark:text-gray-500 font-semibold truncate">
                                {p.target}
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 3. 맞춤 진단 배너 */}
            <section id="recommend">
                <Link
                    href="/diagnosis"
                    className="block overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 text-white p-6 md:p-10 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 relative group"
                >
                    {/* Decorative Background SVG Elements */}
                    <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none group-hover:scale-105 transition-transform duration-500">
                        <svg className="h-full w-full" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <circle cx="80" cy="50" r="40" />
                        </svg>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                        <div className="space-y-3 text-left">
                            <h3 className="text-lg md:text-2xl font-black leading-snug">
                                나에게 딱 맞는 정책을 찾고 싶다면?
                            </h3>
                            <p className="text-xs md:text-base text-blue-100 font-semibold leading-relaxed">
                                간편한 질문으로 맞춤 정책을 추천받아보세요!
                            </p>
                        </div>

                        {/* Button and Checklist design */}
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl group-hover:bg-white/20 transition-all duration-300">
                            {/* Checklist icon */}
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            <span className="text-sm font-bold text-white">진단 시작하기</span>
                            <span className="text-white group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </div>
                    </div>
                </Link>
            </section>
        </div>
    );
}