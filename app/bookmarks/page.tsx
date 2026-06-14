"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { type BookmarkedPolicy } from "@/components/BookmarkButton";

export default function BookmarksPage() {
    const [bookmarks, setBookmarks] = useState<BookmarkedPolicy[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]") as BookmarkedPolicy[];
        setBookmarks(saved);
    }, []);

    const removeBookmark = (id: string) => {
        const updated = bookmarks.filter((b) => b.id !== id);
        localStorage.setItem("bookmarks", JSON.stringify(updated));
        setBookmarks(updated);
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event("bookmarks-updated"));
    };

    if (!mounted) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-48 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-slate-800">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                        <span>🔖</span> 저장한 정책
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">
                        나중에 잊지 않고 신청하기 위해 저장해둔 청년 정책 목록입니다.
                    </p>
                </div>
                {bookmarks.length > 0 && (
                    <span className="text-sm px-3 py-1 bg-teal-50 text-teal-700 rounded-full font-medium mt-3 md:mt-0 self-start md:self-center dark:bg-teal-900/40 dark:text-teal-300">
                        총 {bookmarks.length}개 저장됨
                    </span>
                )}
            </div>

            {bookmarks.length === 0 ? (
                <div className="bg-gray-50 dark:bg-slate-800/40 border border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-16 text-center max-w-xl mx-auto my-8">
                    <div className="text-4xl mb-4">⭐</div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                        저장한 정책이 없습니다
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                        자신에게 꼭 맞는 혜택과 정책을 찾아보고 마음에 드는 정책을 보관함에 추가해보세요.
                    </p>
                    <Link
                        href="/search"
                        className="inline-block px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition"
                    >
                        정책 탐색하러 가기
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarks.map((policy) => (
                        <div
                            key={policy.id}
                            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition flex flex-col justify-between h-full dark:bg-slate-800 dark:border-slate-700"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full font-medium dark:bg-teal-900/50 dark:text-teal-300">
                                        {policy.categoryName}
                                    </span>
                                    <button
                                        onClick={() => removeBookmark(policy.id)}
                                        className="text-gray-400 hover:text-rose-500 p-1.5 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                                        title="북마크 해제"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <Link href={`/policy/${policy.id}`} className="block group mb-4">
                                    <h2 className="font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition line-clamp-2 mb-2">
                                        {policy.title}
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                                        {policy.description}
                                    </p>
                                </Link>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto pt-3 border-t border-gray-100 dark:border-slate-700">
                                <span>📅 {policy.aplyYmd}</span>
                                {policy.sprvsnInstCdNm && (
                                    <span className="line-clamp-1 max-w-[120px]">
                                        🏛️ {policy.sprvsnInstCdNm}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
