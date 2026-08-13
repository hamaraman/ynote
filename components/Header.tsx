"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useSyncExternalStore } from "react";
import { useMounted } from "@/lib/hooks";
import { useUser, logout } from "@/lib/auth";

function subscribe(callback: () => void): () => void {
    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
}

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const user = useUser();
    const mounted = useMounted();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isDark = useSyncExternalStore(
        subscribe,
        () => typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
        () => false
    );

    const toggleTheme = () => {
        const newDark = !isDark;
        document.documentElement.classList.toggle("dark", newDark);
        localStorage.setItem("theme", newDark ? "dark" : "light");
    };

    const navItems = [
        { label: "정책검색", href: "/search" },
        { label: "맞춤진단", href: "/diagnosis" },
        { label: "추천정책", href: "/#recommend" },
        { label: "마감임박", href: "/search?filter=closing" },
    ];

    return (
        <header className="border-b border-gray-150 dark:border-slate-800 sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md z-[80] transition-colors duration-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            {/* Blue note style icon */}
                            <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
                                청
                            </div>
                            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                청년노트
                            </span>
                        </Link>

                        {/* Desktop: Navigation menu */}
                        <nav className="hidden md:flex items-center gap-6">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || (item.href.startsWith("/search") && pathname === "/search");
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`text-sm font-semibold transition-colors duration-200 ${
                                            isActive
                                                ? "text-blue-600 dark:text-blue-400"
                                                : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle (Moon/Sun) */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            aria-label="테마 전환"
                        >
                            {isDark ? (
                                <svg className="w-5.5 h-5.5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>

                        {/* Heart Icon (Bookmarks) */}
                        <a
                            href="/bookmarks"
                            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
                            aria-label="저장한 정책"
                        >
                            <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </a>

                        {/* Auth Button or User Profile */}
                        {mounted && user ? (
                            <div className="flex items-center gap-2.5">
                                <a href="/bookmarks" className="flex items-center hover:opacity-85 transition-opacity" title="마이페이지">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={user.picture}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full border border-gray-200 dark:border-slate-700 object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://lh3.googleusercontent.com/a/default-user";
                                        }}
                                    />
                                </a>
                                <button
                                    onClick={() => {
                                        if (confirm("로그아웃 하시겠습니까?")) {
                                            logout();
                                            router.push("/");
                                        }
                                    }}
                                    className="hidden sm:inline-flex items-center justify-center border border-gray-250 dark:border-slate-800 text-gray-500 hover:text-red-500 hover:border-red-200 dark:hover:border-red-900/30 dark:text-gray-400 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    로그아웃
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden sm:inline-flex items-center justify-center border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-200 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                로그인
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            aria-label="메뉴 토글"
                        >
                            {isMobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-150 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-3 py-2.5 rounded-lg text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                    {mounted && user ? (
                        <div className="flex items-center justify-between px-3 py-2.5">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={user.picture}
                                    alt={user.name}
                                    className="w-6 h-6 rounded-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://lh3.googleusercontent.com/a/default-user";
                                    }}
                                />
                                {user.name}
                            </span>
                            <button
                                onClick={() => {
                                    logout();
                                    setIsMobileMenuOpen(false);
                                    router.push("/");
                                }}
                                className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
                            >
                                로그아웃
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-3 py-2.5 rounded-lg text-base font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                        >
                            로그인
                        </Link>
                    )}
                </div>
            )}
        </header>
    );
}
