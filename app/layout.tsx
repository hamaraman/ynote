import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import MobileNav from "@/components/MobileNav";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ynote.kr"),
  other: {
    "naver-site-verification": "1322dcfaecf54c24fee4e8fd8e1bb6e388ad551b",
    "google-site-verification": "jVPUlrt-xzLYl_RFJtsTtYd-w36x0MXUWcRecMJ7B58",
    ...(adsenseClientId && { "google-adsense-account": adsenseClientId }),
  },
  title: {
    default: "청년노트 - 청년 정책 한눈에",
    template: "%s | 청년노트",
  },
  description:
    "청년도약계좌, 월세지원, 내일배움카드까지 — 청년이 받을 수 있는 모든 정부 지원금과 혜택을 친근하게 정리합니다.",
  keywords: ["청년 정책", "청년도약계좌", "월세 지원", "내일배움카드", "청년 지원금", "정부 혜택", "청년 복지"],
  authors: [{ name: "청년노트" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "청년노트",
    title: "청년노트 - 청년 정책 한눈에",
    description:
      "청년도약계좌, 월세지원, 내일배움카드까지 — 청년이 받을 수 있는 모든 정부 지원금과 혜택을 친근하게 정리합니다.",
  },
  twitter: {
    card: "summary_large_image",
    title: "청년노트 - 청년 정책 한눈에",
    description:
      "청년도약계좌, 월세지원, 내일배움카드까지 — 청년이 받을 수 있는 모든 정부 지원금과 혜택을 친근하게 정리합니다.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/favicon.png", sizes: "512x512" },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const categories = [
  { name: "금융/자산", href: "/category/finance", icon: "💰" },
  { name: "주거", href: "/category/housing", icon: "🏠" },
  { name: "일자리", href: "/category/job", icon: "💼" },
  { name: "창업", href: "/category/startup", icon: "🚀" },
  { name: "교육/문화", href: "/category/edu", icon: "📚" },
  { name: "교통", href: "/category/transport", icon: "🚍" },
  { name: "건강/생활", href: "/category/life", icon: "🏥" },
  { name: "지역별", href: "/category/region", icon: "📍" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        {/* 페인트 전에 테마를 적용해 다크모드 깜빡임(FOUC)을 막는다. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var d=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
        {adsenseClientId && (
          // 네이티브 <script>로 렌더링해 서버 HTML <head>에 그대로 포함시킨다.
          // (next/script의 afterInteractive는 런타임 주입이라 AdSense 인증
          //  크롤러가 스니펫을 찾지 못함)
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100">
        <header className="border-b border-gray-200 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur z-[85]">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4 lg:gap-6">
                <Link href="/" className="text-xl font-bold text-teal-600 dark:text-teal-400 flex-shrink-0 flex items-center gap-1.5">
                  <Image src="/favicon.png" alt="" width={36} height={36} className="w-9 h-9 flex-shrink-0" priority />
                  청년노트
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
                      className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition whitespace-nowrap flex-shrink-0"
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
        <GoogleAnalytics />

        <footer className="border-t border-gray-200 dark:border-slate-800 mt-16 bg-gray-50 dark:bg-slate-950">
          <div className="max-w-5xl mx-auto px-4 py-12 text-sm text-gray-600 dark:text-gray-400">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <Link href="/" className="text-lg font-bold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-1.5">
                  <Image src="/favicon.png" alt="" width={44} height={44} className="w-11 h-11 flex-shrink-0" />
                  청년노트
                </Link>
                <p className="max-w-xs leading-relaxed">
                  청년들에게 꼭 필요한 정부 정책과 혜택을 쉽고 친근하게 전달하는 정책 가이드 서비스입니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                <div className="flex flex-col gap-2">
                  <h4 className="font-bold text-gray-900 dark:text-gray-200 mb-1">서비스</h4>
                  <Link href="/about" className="hover:text-teal-600 dark:hover:text-teal-400">사이트 소개</Link>
                  <Link href="/bookmarks" className="hover:text-teal-600 dark:hover:text-teal-400">저장한 정책</Link>
                  <Link href="/search" className="hover:text-teal-600 dark:hover:text-teal-400">정책 검색</Link>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="font-bold text-gray-900 dark:text-gray-200 mb-1">고객지원</h4>
                  <Link href="/contact" className="hover:text-teal-600 dark:hover:text-teal-400">문의하기</Link>
                  <Link href="/privacy" className="hover:text-teal-600 dark:hover:text-teal-400">개인정보처리방침</Link>
                  <Link href="/terms" className="hover:text-teal-600 dark:hover:text-teal-400">이용약관</Link>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-gray-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
              <p>© 2026 청년노트. 정책 정보는 공식 출처 기반이며, 정확한 내용은 해당 기관에서 확인하세요.</p>
              <div className="flex gap-4">
                <span className="text-gray-400">Powered by 온통청년 API</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}