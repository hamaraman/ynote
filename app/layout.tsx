import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import MobileNav from "@/components/MobileNav";

export const metadata: Metadata = {
  title: {
    default: "청년노트 - 청년 정책 한눈에",
    template: "%s | 청년노트",
  },
  description:
    "청년도약계좌, 월세지원, 내일배움카드까지 — 청년이 받을 수 있는 모든 정부 지원금과 혜택을 친근하게 정리합니다.",
};

const categories = [
  { name: "금융/자산", href: "/category/finance", icon: "💰" },
  { name: "주거", href: "/category/housing", icon: "🏠" },
  { name: "일자리", href: "/category/job", icon: "💼" },
  { name: "교육/문화", href: "/category/edu", icon: "📚" },
  { name: "건강/생활", href: "/category/life", icon: "🏥" },
  { name: "지역별", href: "/category/region", icon: "📍" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-white text-gray-900">
        <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-[85]">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4 lg:gap-6">
                <Link href="/" className="text-xl font-bold text-teal-600 flex-shrink-0">
                  📒 청년노트
                </Link>
                {/* Desktop Global Search Bar */}
                <form action="/search" method="get" className="hidden lg:block">
                  <div className="relative">
                    <input
                      type="text"
                      name="q"
                      placeholder="정책 검색..."
                      className="w-36 focus:w-48 px-3.5 py-1.5 pl-8 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all duration-300 text-gray-800 dark:text-gray-100"
                    />
                    <svg className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </form>
              </div>
              <div className="flex items-center gap-2 lg:gap-3">
                {/* Mobile Global Search Icon */}
                <Link
                  href="/search"
                  className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 transition"
                  aria-label="정책 검색"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </Link>
                <MobileNav />
                <nav className="hidden lg:flex gap-1 items-center">
                  <Link
                    href="/bookmarks"
                    className="px-3 py-2 text-sm text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/30 rounded-md transition font-semibold mr-1.5 flex items-center gap-1 border border-teal-100 dark:border-teal-950/50 whitespace-nowrap flex-shrink-0"
                  >
                    🔖 저장함
                  </Link>
                  {categories.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition whitespace-nowrap flex-shrink-0"
                    >
                      {c.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <div className="fixed bottom-6 right-6 z-50">
          <ThemeToggle />
        </div>

        <footer className="border-t border-gray-200 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-gray-600">
            <div className="flex flex-wrap gap-4 mb-4">
              <Link href="/about" className="hover:text-teal-600">사이트 소개</Link>
              <Link href="/contact" className="hover:text-teal-600">문의</Link>
              <Link href="/privacy" className="hover:text-teal-600">개인정보처리방침</Link>
              <Link href="/terms" className="hover:text-teal-600">이용약관</Link>
            </div>
            <p className="text-gray-500">
              © 2026 청년노트. 정책 정보는 공식 출처 기반이며, 정확한 내용은 해당 기관에서 확인하세요.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}