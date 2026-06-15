"use client";

import { useState, useEffect } from "react";

export interface BookmarkedPolicy {
    id: string;
    type: "markdown" | "api";
    title: string;
    description: string;
    categorySlug: string;
    categoryName: string;
    aplyYmd?: string;
    sprvsnInstCdNm?: string;
}

export default function BookmarkButton({ policy, variant = "default" }: { policy: BookmarkedPolicy; variant?: "default" | "icon" }) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]") as BookmarkedPolicy[];
        setIsBookmarked(bookmarks.some((b) => b.id === policy.id));
    }, [policy.id]);

    const toggleBookmark = () => {
        const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]") as BookmarkedPolicy[];
        let newBookmarks: BookmarkedPolicy[];
        if (isBookmarked) {
            newBookmarks = bookmarks.filter((b) => b.id !== policy.id);
        } else {
            newBookmarks = [...bookmarks, policy];
        }
        localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
        setIsBookmarked(!isBookmarked);
        
        // Dispatch custom event to notify other components (e.g. bookmarks list)
        window.dispatchEvent(new Event("bookmarks-updated"));
    };

    if (!mounted) {
        if (variant === "icon") {
            return (
                <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-300 dark:border-slate-700 dark:bg-slate-800/50">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            );
        }
        return (
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-400 dark:border-slate-700 dark:bg-slate-800/50">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                저장하기
            </button>
        );
    }

    if (variant === "icon") {
        return (
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleBookmark();
                }}
                className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all ${
                    isBookmarked
                        ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-950 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50"
                        : "border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-gray-300"
                }`}
                title={isBookmarked ? "저장 해제" : "저장하기"}
            >
                <svg
                    className="w-4 h-4 transition-transform active:scale-125"
                    fill={isBookmarked ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
            </button>
        );
    }

    return (
        <button
            onClick={toggleBookmark}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-lg transition-all ${
                isBookmarked
                    ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-950 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white"
            }`}
        >
            <svg
                className="w-4 h-4 transition-transform active:scale-125"
                fill={isBookmarked ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
            {isBookmarked ? "저장됨" : "저장하기"}
        </button>
    );
}
