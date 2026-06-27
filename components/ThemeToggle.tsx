"use client";

import { useSyncExternalStore } from "react";
import { useMounted } from "@/lib/hooks";

// <html>의 dark 클래스가 현재 테마의 단일 소스.
// (초기값은 layout의 인라인 스크립트가 페인트 전에 설정한다)
function subscribe(callback: () => void): () => void {
    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
}

export default function ThemeToggle() {
    const mounted = useMounted();
    const isDark = useSyncExternalStore(
        subscribe,
        () => document.documentElement.classList.contains("dark"),
        () => false,
    );

    const toggle = () => {
        const newDark = !isDark;
        document.documentElement.classList.toggle("dark", newDark);
        localStorage.setItem("theme", newDark ? "dark" : "light");
    };

    if (!mounted) {
        return (
            <button className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-lg dark:bg-slate-800 dark:border-slate-700">
                <span className="sr-only">테마 전환</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="4" strokeWidth={2} />
                </svg>
            </button>
        );
    }

    return (
        <button
            onClick={toggle}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-100 shadow-lg transition-all hover:shadow-xl active:scale-95 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700"
            aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
        >
            {isDark ? (
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ) : (
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </button>
    );
}