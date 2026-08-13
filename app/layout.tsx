import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/Header";
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
  keywords: ["청년 정책", "청년노트", "청년도약계좌", "월세 지원", "내일배움카드", "청년 지원금", "정부 혜택", "청년 복지"],
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
        <Header />

        <main className="flex-1">{children}</main>
        <GoogleAnalytics />

        <footer className="border-t border-gray-200 dark:border-slate-800 mt-16 bg-gray-50 dark:bg-slate-950">
          <div className="max-w-5xl mx-auto px-4 py-12 text-sm text-gray-600 dark:text-gray-400">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <Link href="/" className="text-lg font-extrabold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-blue-500/25">
                    Y
                  </div>
                  청년노트
                </Link>
                <p className="max-w-xs leading-relaxed">
                  청년들에게 꼭 필요한 정부 정책과 혜택을 쉽고 친근하게 전달하는 정책 가이드 서비스입니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                <div className="flex flex-col gap-2">
                  <h4 className="font-bold text-gray-900 dark:text-gray-200 mb-1">서비스</h4>
                  <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400">사이트 소개</Link>
                  <Link href="/bookmarks" className="hover:text-blue-600 dark:hover:text-blue-400">저장한 정책</Link>
                  <Link href="/search" className="hover:text-blue-600 dark:hover:text-blue-400">정책 검색</Link>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="font-bold text-gray-900 dark:text-gray-200 mb-1">고객지원</h4>
                  <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">문의하기</Link>
                  <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">개인정보처리방침</Link>
                  <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">이용약관</Link>
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