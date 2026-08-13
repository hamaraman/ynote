"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMounted } from "@/lib/hooks";
import { useBookmarks, toggleBookmark, BookmarkedPolicy } from "@/lib/bookmarks";
import { useUser, logout } from "@/lib/auth";

// Standard mock bookmarks to initialize localStorage if empty, making the UI look exactly like Screen 4
const DEFAULT_BOOKMARKS: BookmarkedPolicy[] = [
    {
        id: "youth-rent-support",
        type: "markdown",
        title: "청년 월세 한시 특별지원",
        description: "월 최대 20만원씩 최대 12개월 지원",
        categorySlug: "housing",
        categoryName: "주거",
        aplyYmd: "2024.06.30",
    },
    {
        id: "youth-work-experience",
        type: "markdown",
        title: "청년 일경험 지원사업",
        description: "월 최대 234만원 지원",
        categorySlug: "job",
        categoryName: "취업",
        aplyYmd: "2024.06.21",
    },
    {
        id: "learning-card",
        type: "markdown",
        title: "국민내일배움카드",
        description: "최대 500만원 지원",
        categorySlug: "edu",
        categoryName: "교육",
        aplyYmd: "상시신청",
    }
];

export default function BookmarksPage() {
    const router = useRouter();
    const user = useUser();
    const mounted = useMounted();
    const realBookmarks = useBookmarks();

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<"all" | "available" | "closing" | "closed">("all");

    // Initialize default bookmarks on first visit if none exist
    useEffect(() => {
        if (mounted && typeof localStorage !== "undefined") {
            const raw = localStorage.getItem("bookmarks");
            if (!raw || JSON.parse(raw).length === 0) {
                localStorage.setItem("bookmarks", JSON.stringify(DEFAULT_BOOKMARKS));
                window.dispatchEvent(new Event("bookmarks-updated"));
            }
        }
    }, [mounted]);

    // Active categories icon map
    const categoryInfo = (cat: string) => {
        switch (cat) {
            case "주거": return { icon: "🏠", bg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" };
            case "취업": return { icon: "💼", bg: "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" };
            case "교육": return { icon: "💳", bg: "bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400" };
            default: return { icon: "🚀", bg: "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400" };
        }
    };

    // Calculate D-day for mock items easily or display appropriately
    const getDDayText = (id: string) => {
        if (id === "youth-rent-support") return { text: "D-12", isRed: true };
        if (id === "youth-work-experience") return { text: "D-3", isRed: true };
        if (id === "learning-card") return { text: "상시", isRed: false };
        return { text: "D-14", isRed: false };
    };

    // Filter bookmarks by tab
    const filteredBookmarks = useMemo(() => {
        return realBookmarks.filter((b) => {
            if (activeTab === "available") {
                // assume true for mock, or check deadline
                return b.aplyYmd !== "closed";
            }
            if (activeTab === "closing") {
                return b.id === "youth-work-experience" || b.id === "youth-rent-support";
            }
            if (activeTab === "closed") {
                return false;
            }
            return true;
        });
    }, [realBookmarks, activeTab]);

    // Handle Select All checkbox
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(filteredBookmarks.map(b => b.id));
        } else {
            setSelectedIds([]);
        }
    };

    // Handle single item checkbox change
    const handleCheckboxChange = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(item => item !== id));
        }
    };

    // Handle bulk delete
    const handleDeleteSelected = () => {
        if (selectedIds.length === 0) return;
        
        let current = [...realBookmarks];
        current = current.filter(b => !selectedIds.includes(b.id));
        
        localStorage.setItem("bookmarks", JSON.stringify(current));
        window.dispatchEvent(new Event("bookmarks-updated"));
        setSelectedIds([]);
    };

    // Handle single delete
    const handleDeleteSingle = (policy: BookmarkedPolicy) => {
        toggleBookmark(policy);
        setSelectedIds(prev => prev.filter(item => item !== policy.id));
    };

    if (!mounted) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-16 text-center text-gray-400">
                저장함 불러오는 중...
            </div>
        );
    }

    const isAllSelected = filteredBookmarks.length > 0 && selectedIds.length === filteredBookmarks.length;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: User Profile & Menu Sidebar */}
                <aside className="lg:col-span-3 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
                    {/* User Profile Card */}
                    <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-800 pb-5">
                        {/* Avatar */}
                        {user ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={user.picture}
                                alt={user.name}
                                className="w-12 h-12 rounded-full border border-gray-200 dark:border-slate-700 object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "https://lh3.googleusercontent.com/a/default-user";
                                }}
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center font-black text-lg">
                                홍
                            </div>
                        )}
                        <div className="text-left">
                            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">
                                {user ? user.name : "홍길동님"}
                            </h3>
                            <p className="text-xs text-gray-400 font-semibold truncate max-w-[130px]" title={user ? user.email : "hong@example.com"}>
                                {user ? user.email : "hong@example.com"}
                            </p>
                        </div>
                    </div>

                    {/* Menu Navigation list */}
                    <nav className="space-y-1">
                        {[
                            { label: "내 정보", href: "#", active: false },
                            { label: "맞춤 진단 결과", href: "/diagnosis", active: false },
                            { label: "추천 정책", href: "/#recommend", active: false },
                            { label: "저장한 정책", href: "/bookmarks", active: true },
                            { label: "신청 내역", href: "#", active: false },
                            { label: "알림 설정", href: "#", active: false },
                        ].map((menu) => (
                            <Link
                                key={menu.label}
                                href={menu.href}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                                    menu.active
                                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30"
                                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                                }`}
                            >
                                <span>{menu.label}</span>
                                <span className="opacity-60">&gt;</span>
                            </Link>
                        ))}

                        <button
                            onClick={() => {
                                if (confirm("로그아웃 하시겠습니까?")) {
                                    logout();
                                    router.push("/");
                                }
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 mt-4 border border-dashed border-red-200 dark:border-red-900/30 cursor-pointer text-left"
                        >
                            {/* Exit icon */}
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>로그아웃</span>
                        </button>
                    </nav>
                </aside>

                {/* Right: Main Content Panel */}
                <main className="lg:col-span-9 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
                    {/* Header */}
                    <div className="flex items-end justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                        <div className="text-left">
                            <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
                                저장한 정책
                            </h1>
                            <p className="text-xs font-bold text-gray-400 mt-1">
                                전체 {realBookmarks.length}개
                            </p>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-1.5">
                        {[
                            { id: "all", label: "전체" },
                            { id: "available", label: "신청가능" },
                            { id: "closing", label: "마감임박" },
                            { id: "closed", label: "마감" }
                        ].map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer inline-flex items-center justify-center ${
                                        isActive
                                            ? "bg-blue-600 text-white shadow-sm shadow-blue-500/10"
                                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Toolbar actions */}
                    {filteredBookmarks.length > 0 && (
                        <div className="flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/20 border border-gray-100 dark:border-slate-800 rounded-xl px-4 py-3">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>전체 선택</span>
                            </label>
                            
                            <button
                                onClick={handleDeleteSelected}
                                disabled={selectedIds.length === 0}
                                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer inline-flex items-center justify-center ${
                                    selectedIds.length > 0
                                        ? "text-red-500 border-red-200 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:border-red-900/30"
                                        : "text-gray-300 border-gray-100 bg-gray-50/50 dark:border-slate-800 dark:text-gray-600 dark:bg-transparent"
                                }`}
                            >
                                선택 삭제
                            </button>
                        </div>
                    )}

                    {/* Saved Bookmark List */}
                    {filteredBookmarks.length > 0 ? (
                        <div className="divide-y divide-gray-100 dark:divide-slate-800 space-y-4">
                            {filteredBookmarks.map((b) => {
                                const info = categoryInfo(b.categoryName);
                                const ddayInfo = getDDayText(b.id);
                                const isChecked = selectedIds.includes(b.id);
                                
                                return (
                                    <div
                                        key={b.id}
                                        className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 group"
                                    >
                                        {/* Checkbox */}
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => handleCheckboxChange(b.id, e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />

                                        {/* Category Icon */}
                                        <div className={`w-10 h-10 rounded-full ${info.bg} flex items-center justify-center text-lg flex-shrink-0 shadow-sm`}>
                                            {info.icon}
                                        </div>

                                        {/* Policy content */}
                                        <Link href={`/policy/${b.id}`} className="flex-1 min-w-0 text-left space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug truncate">
                                                    {b.title}
                                                </h3>
                                                {b.id === "youth-rent-support" && (
                                                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30 px-1.5 py-0.2 rounded">
                                                        주거
                                                    </span>
                                                )}
                                                {b.id === "youth-work-experience" && (
                                                    <span className="text-[10px] font-black text-blue-500 bg-blue-50 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30 px-1.5 py-0.2 rounded">
                                                        취업
                                                    </span>
                                                )}
                                                {b.id === "learning-card" && (
                                                    <span className="text-[10px] font-black text-purple-500 bg-purple-50 border border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30 px-1.5 py-0.2 rounded">
                                                        교육
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 truncate">
                                                {b.description}
                                            </p>
                                        </Link>

                                        {/* Date and D-day status */}
                                        <div className="flex items-center gap-4 flex-shrink-0">
                                            <div className="text-right hidden sm:block">
                                                <span className={`text-xs font-black ${ddayInfo.isRed ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}>
                                                    {ddayInfo.text}
                                                </span>
                                                <p className="text-[10px] text-gray-400 font-semibold">
                                                    {b.aplyYmd}
                                                </p>
                                            </div>
                                            
                                            {/* Action dropdown or delete */}
                                            <button
                                                onClick={() => handleDeleteSingle(b)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                                                title="저장 해제"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-gray-50 dark:bg-slate-900/40 border border-dashed border-gray-200 dark:border-slate-800 rounded-3xl p-16 text-center">
                            <div className="text-4xl mb-4">⭐</div>
                            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">저장한 정책이 없습니다.</h2>
                            <p className="text-xs text-gray-400 mt-2">마음에 드는 청년 정책을 탐색하고 저장해보세요!</p>
                            <div className="pt-4">
                                <Link
                                    href="/search"
                                    className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                                >
                                    정책 탐색하기
                                </Link>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
