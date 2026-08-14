"use client";

import { useState } from "react";
import Link from "next/link";
import BookmarkButton from "@/components/BookmarkButton";

interface PolicyDetailClientProps {
    policy: {
        id: string;
        title: string;
        category: string;
        categorySlug: string;
        description: string;
        targetTags: string[];
        deadline: string;
        dday: string;
        amount: string;
        targetDesc: string;
        details: {
            intro: string;
            projectPeriod: string;
            applyPeriod: string;
            agency: string;
            contact: string;
            eligibility: string;
            supportDetails: string;
            applyMethod: string;
            documents: string;
            faq: string;
        };
        application: {
            url?: string;
            kind: "direct" | "official" | "unavailable";
            label?: string;
        };
    };
}

export default function PolicyDetailClient({ policy }: PolicyDetailClientProps) {
    const [activeTab, setActiveTab] = useState<"개요" | "대상" | "내용" | "방법" | "서류" | "FAQ">("개요");

    const tabs: { id: typeof activeTab; label: string }[] = [
        { id: "개요", label: "정책개요" },
        { id: "대상", label: "지원대상" },
        { id: "내용", label: "지원내용" },
        { id: "방법", label: "신청방법" },
        { id: "서류", label: "제출서류" },
        { id: "FAQ", label: "FAQ" },
    ];

    const categoryTheme = {
        bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
        btn: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25",
        text: "text-emerald-600 dark:text-emerald-400",
    };

    if (policy.category === "취업" || policy.category === "일자리") {
        categoryTheme.bg = "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border-blue-100 dark:border-blue-900/30";
        categoryTheme.btn = "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25";
        categoryTheme.text = "text-blue-600 dark:text-blue-400";
    } else if (policy.category === "교육" || policy.category === "교육/문화") {
        categoryTheme.bg = "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400 border-purple-100 dark:border-purple-900/30";
        categoryTheme.btn = "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25";
        categoryTheme.text = "text-purple-600 dark:text-purple-400";
    } else if (policy.category === "창업") {
        categoryTheme.bg = "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/30";
        categoryTheme.btn = "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/25";
        categoryTheme.text = "text-amber-600 dark:text-amber-400";
    }

    const handleApplicationGuide = () => {
        setActiveTab("방법");
        document.getElementById("application-method")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <nav aria-label="현재 위치" className="text-xs md:text-sm font-semibold text-gray-400 flex items-center gap-2">
                <Link href="/" className="hover:text-blue-600 transition-colors">홈</Link>
                <span aria-hidden="true">&gt;</span>
                <Link href={`/search?cat=${policy.categorySlug}`} className="hover:text-blue-600 transition-colors">{policy.category}</Link>
                <span aria-hidden="true">&gt;</span>
                <span className="text-gray-600 dark:text-gray-300 truncate max-w-[200px]">{policy.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
                <div className="min-w-0 lg:col-span-7 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-xs px-2.5 py-1 rounded-lg font-bold border ${categoryTheme.bg}`}>{policy.category}</span>
                        <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 font-bold rounded-lg border border-blue-100 dark:border-blue-900/30">신청 정보 확인</span>
                    </div>

                    <h1 className="break-keep text-balance text-2xl font-black leading-tight text-gray-900 dark:text-white sm:text-[1.75rem] lg:text-3xl">{policy.title}</h1>
                    <p className="break-keep text-base font-bold leading-relaxed text-gray-500 dark:text-gray-400">{policy.description}</p>

                    <div className="flex flex-wrap gap-2 pt-1">
                        {policy.targetTags.map((tag) => (
                            <span key={tag} className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800/40 px-2.5 py-1 rounded-lg">#{tag}</span>
                        ))}
                    </div>

                    <div className="pt-4 space-y-2">
                        <div className="flex flex-wrap gap-3">
                            {policy.application.url ? (
                                <a
                                    href={policy.application.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex min-h-11 items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black transition-all duration-200 shadow-md active:scale-[0.97] text-sm ${categoryTheme.btn}`}
                                >
                                    {policy.application.label || "공식 신청처로 이동"}
                                    <span aria-hidden="true">↗</span>
                                </a>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleApplicationGuide}
                                    className="inline-flex min-h-11 items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black transition-all duration-200 shadow-md active:scale-[0.97] text-sm bg-slate-700 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900"
                                >
                                    신청 방법 확인하기
                                </button>
                            )}
                            <BookmarkButton
                                policy={{
                                    id: policy.id,
                                    type: "markdown",
                                    title: policy.title,
                                    description: policy.description,
                                    categorySlug: policy.categorySlug,
                                    categoryName: policy.category,
                                    aplyYmd: policy.deadline,
                                }}
                            />
                        </div>
                        {policy.application.kind === "direct" && (
                            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">공식 신청 페이지로 새 창에서 이동합니다.</p>
                        )}
                        {policy.application.kind === "official" && (
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">공식 포털 또는 공고 페이지에서 신청 메뉴와 최신 접수 일정을 확인하세요.</p>
                        )}
                        {policy.application.kind === "unavailable" && (
                            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">검증된 온라인 신청 링크가 아직 등록되지 않았습니다. 아래 신청 방법을 확인해 주세요.</p>
                        )}
                    </div>
                </div>

                <div className="min-w-0 lg:col-span-5 w-full bg-gray-50/50 dark:bg-slate-800/30 border border-gray-150 dark:border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between gap-4 text-sm border-b border-gray-100 dark:border-slate-800/80 pb-3">
                        <span className="shrink-0 font-bold text-gray-400">마감일</span>
                        <span className="min-w-0 break-keep text-right font-black text-red-500 dark:text-red-400">{policy.deadline} ({policy.dday})</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-sm border-b border-gray-100 dark:border-slate-800/80 pb-3">
                        <span className="shrink-0 font-bold text-gray-400">지원금액</span>
                        <span className="min-w-0 break-keep text-right font-black text-gray-700 dark:text-gray-200">{policy.amount}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-sm pb-1">
                        <span className="shrink-0 font-bold text-gray-400">지원대상</span>
                        <span className="min-w-0 max-w-[min(62vw,20rem)] truncate text-right font-black text-gray-700 dark:text-gray-200" title={policy.targetDesc}>{policy.targetDesc}</span>
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-150 dark:border-slate-800">
                <nav aria-label="정책 상세 정보" className="flex flex-wrap -mb-px gap-x-5 gap-y-0 sm:gap-x-6">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                type="button"
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-bold text-sm transition-all duration-200 ${isActive ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400" : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden min-h-[300px]">
                {activeTab === "개요" && (
                    <div className="space-y-6 text-left relative z-10 max-w-3xl">
                        <p className="break-keep text-base font-extrabold leading-relaxed text-gray-800 dark:text-gray-200">{policy.details.intro}</p>
                        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800 text-sm">
                            <div className="flex flex-wrap items-center gap-2"><span className="font-bold text-gray-400 w-24">• 사업기간:</span><span className="font-black text-gray-800 dark:text-gray-200">{policy.details.projectPeriod}</span></div>
                            <div className="flex flex-wrap items-center gap-2"><span className="font-bold text-gray-400 w-24">• 신청기간:</span><span className="font-black text-gray-800 dark:text-gray-200">{policy.details.applyPeriod}</span></div>
                            <div className="flex flex-wrap items-center gap-2"><span className="font-bold text-gray-400 w-24">• 소관기관:</span><span className="font-black text-gray-800 dark:text-gray-200">{policy.details.agency}</span></div>
                            <div className="flex flex-wrap items-center gap-2"><span className="font-bold text-gray-400 w-24">• 문의처:</span><span className="font-black text-gray-800 dark:text-gray-200">{policy.details.contact}</span></div>
                        </div>
                    </div>
                )}
                {activeTab === "대상" && <div className="space-y-4 text-left"><h2 className="text-base font-extrabold text-gray-800 dark:text-gray-200">지원 조건 및 자격</h2><p className="text-sm font-semibold text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{policy.details.eligibility}</p></div>}
                {activeTab === "내용" && <div className="space-y-4 text-left"><h2 className="text-base font-extrabold text-gray-800 dark:text-gray-200">지원 세부내용</h2><p className="text-sm font-semibold text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{policy.details.supportDetails}</p></div>}
                {activeTab === "방법" && <div id="application-method" className="space-y-4 text-left scroll-mt-8"><h2 className="text-base font-extrabold text-gray-800 dark:text-gray-200">신청 방법 및 경로</h2><p className="text-sm font-semibold text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{policy.details.applyMethod}</p></div>}
                {activeTab === "서류" && <div className="space-y-4 text-left"><h2 className="text-base font-extrabold text-gray-800 dark:text-gray-200">구비 서류 안내</h2><p className="text-sm font-semibold text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{policy.details.documents}</p></div>}
                {activeTab === "FAQ" && <div className="space-y-4 text-left"><h2 className="text-base font-extrabold text-gray-800 dark:text-gray-200">자주 묻는 질문 (FAQ)</h2><p className="text-sm font-semibold text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{policy.details.faq}</p></div>}
            </div>
        </div>
    );
}
