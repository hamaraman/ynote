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
        applyUrl?: string;
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
        { id: "FAQ", label: "FAQ" }
    ];

    const categoryTheme = {
        bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
        btn: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25",
        text: "text-emerald-600 dark:text-emerald-400"
    };

    if (policy.category === "취업") {
        categoryTheme.bg = "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border-blue-100 dark:border-blue-900/30";
        categoryTheme.btn = "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25";
        categoryTheme.text = "text-blue-600 dark:text-blue-400";
    } else if (policy.category === "교육") {
        categoryTheme.bg = "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400 border-purple-100 dark:border-purple-900/30";
        categoryTheme.btn = "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25";
        categoryTheme.text = "text-purple-600 dark:text-purple-400";
    } else if (policy.category === "창업") {
        categoryTheme.bg = "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/30";
        categoryTheme.btn = "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/25";
        categoryTheme.text = "text-amber-600 dark:text-amber-400";
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            {/* Breadcrumbs */}
            <nav className="text-xs md:text-sm font-semibold text-gray-400 flex items-center gap-2">
                <Link href="/" className="hover:text-blue-600 transition-colors">홈</Link>
                <span>&gt;</span>
                <Link href={`/search?cat=${policy.categorySlug}`} className="hover:text-blue-600 transition-colors">{policy.category}</Link>
                <span>&gt;</span>
                <span className="text-gray-600 dark:text-gray-300 truncate max-w-[200px]">{policy.title}</span>
            </nav>

            {/* Main Header Card with Quick Info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
                
                {/* Left Header info */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-xs px-2.5 py-1 rounded-lg font-bold border ${categoryTheme.bg}`}>
                            {policy.category}
                        </span>
                        <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 font-bold rounded-lg border border-blue-100 dark:border-blue-900/30">
                            신청가능
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">
                        {policy.title}
                    </h1>

                    <p className="text-base font-bold text-gray-500 dark:text-gray-400">
                        {policy.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                        {policy.targetTags.map((tag) => (
                            <span key={tag} className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800/40 px-2.5 py-1 rounded-lg">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-4">
                        <a
                            href={policy.applyUrl || "https://www.bokjiro.go.kr"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-black transition-all duration-200 shadow-md active:scale-98 text-sm cursor-pointer ${categoryTheme.btn}`}
                        >
                            신청하기
                        </a>
                        <BookmarkButton
                            policy={{
                                id: policy.id,
                                type: "markdown",
                                title: policy.title,
                                description: policy.description,
                                categorySlug: policy.categorySlug,
                                categoryName: policy.category,
                                aplyYmd: policy.deadline
                            }}
                        />
                    </div>
                </div>

                {/* Right Quick Info Box */}
                <div className="lg:col-span-5 w-full bg-gray-50/50 dark:bg-slate-800/30 border border-gray-150 dark:border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-slate-800/80 pb-3">
                        <span className="font-bold text-gray-400">마감일</span>
                        <span className="font-black text-red-500 dark:text-red-400">
                            {policy.deadline} ({policy.dday})
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-slate-800/80 pb-3">
                        <span className="font-bold text-gray-400">지원금액</span>
                        <span className="font-black text-gray-700 dark:text-gray-200">
                            {policy.amount}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm pb-1">
                        <span className="font-bold text-gray-400">지원대상</span>
                        <span className="font-black text-gray-700 dark:text-gray-200 text-right truncate max-w-[200px]" title={policy.targetDesc}>
                            {policy.targetDesc}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Tabs Navigation */}
            <div className="border-b border-gray-150 dark:border-slate-800">
                <nav className="flex flex-wrap -mb-px gap-6">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-bold text-sm transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                                        : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Dynamic Content Panel */}
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden min-h-[300px]">
                
                {activeTab === "개요" && (
                    <div className="space-y-6 text-left relative z-10 max-w-3xl">
                        <p className="text-base font-extrabold text-gray-800 dark:text-gray-200 leading-relaxed">
                            {policy.details.intro}
                        </p>
                        
                        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800 text-sm">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-gray-400 w-24">• 사업기간:</span>
                                <span className="font-black text-gray-800 dark:text-gray-200">{policy.details.projectPeriod}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-gray-400 w-24">• 신청기간:</span>
                                <span className="font-black text-gray-800 dark:text-gray-200">{policy.details.applyPeriod}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-gray-400 w-24">• 소관기관:</span>
                                <span className="font-black text-gray-800 dark:text-gray-200">{policy.details.agency}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-gray-400 w-24">• 문의처:</span>
                                <span className="font-black text-gray-800 dark:text-gray-200">{policy.details.contact}</span>
                            </div>
                        </div>

                        {/* House Illustration on bottom right */}
                        <div className="absolute right-0 bottom-0 opacity-10 md:opacity-20 pointer-events-none transform translate-y-6 translate-x-6">
                            <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 50 L50 20 L90 50 L90 90 L10 90 Z" fill="#E2E8F0" />
                                <path d="M35 90 L35 60 L65 60 L65 90" fill="#CBD5E1" />
                                <circle cx="50" cy="40" r="10" fill="#3B82F6" />
                            </svg>
                        </div>
                    </div>
                )}

                {activeTab === "대상" && (
                    <div className="space-y-4 text-left">
                        <h3 className="text-base font-extrabold text-gray-800 dark:text-gray-200">지원 조건 및 자격</h3>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                            {policy.details.eligibility}
                        </p>
                    </div>
                )}

                {activeTab === "내용" && (
                    <div className="space-y-4 text-left">
                        <h3 className="text-base font-extrabold text-gray-800 dark:text-gray-200">지원 세부내용</h3>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                            {policy.details.supportDetails}
                        </p>
                    </div>
                )}

                {activeTab === "방법" && (
                    <div className="space-y-4 text-left">
                        <h3 className="text-base font-extrabold text-gray-800 dark:text-gray-200">신청 방법 및 경로</h3>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                            {policy.details.applyMethod}
                        </p>
                    </div>
                )}

                {activeTab === "서류" && (
                    <div className="space-y-4 text-left">
                        <h3 className="text-base font-extrabold text-gray-800 dark:text-gray-200">구비 서류 안내</h3>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                            {policy.details.documents}
                        </p>
                    </div>
                )}

                {activeTab === "FAQ" && (
                    <div className="space-y-4 text-left">
                        <h3 className="text-base font-extrabold text-gray-800 dark:text-gray-200">자주 묻는 질문 (FAQ)</h3>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                            {policy.details.faq}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
