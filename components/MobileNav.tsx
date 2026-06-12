"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
    { name: "금융/자산", href: "/category/finance", icon: "💰" },
    { name: "주거", href: "/category/housing", icon: "🏠" },
    { name: "일자리", href: "/category/job", icon: "💼" },
    { name: "교육/문화", href: "/category/edu", icon: "📚" },
    { name: "건강/생활", href: "/category/life", icon: "🏥" },
    { name: "지역별", href: "/category/region", icon: "📍" },
];

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <>
            {/* Mobile Navigation Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition touch-manipulation"
                aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
                aria-expanded={isOpen}
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-100 z-[60]"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 md:hidden ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-teal-600">📒 메뉴</span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <nav className="p-4">
                    <Link
                        href="/"
                        className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                    >
                        🏠 홈
                    </Link>
                    <Link
                        href="/search"
                        className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                    >
                        🔍 정책 검색
                    </Link>
                    <div className="my-4 border-t border-gray-200" />
                    <div className="px-4 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                        카테고리
                    </div>
                    {categories.map((c) => (
                        <Link
                            key={c.href}
                            href={c.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                                pathname === c.href
                                    ? "bg-teal-50 text-teal-700 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <span>{c.icon}</span>
                            <span>{c.name}</span>
                        </Link>
                    ))}
                    <div className="my-4 border-t border-gray-200" />
                    <Link
                        href="/about"
                        className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                    >
                        ℹ️ 사이트 소개
                    </Link>
                    <Link
                        href="/contact"
                        className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                    >
                        ✉️ 문의하기
                    </Link>
                </nav>
            </div>
        </>
    );
}