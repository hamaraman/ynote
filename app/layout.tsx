import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

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
      <body className="antialiased min-h-screen flex flex-col bg-white text-gray-900">
      <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-teal-600">
              📒 청년노트
            </Link>
            <nav className="hidden md:flex gap-1">
              {categories.map((c) => (
                  <Link
                      key={c.href}
                      href={c.href}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition"
                  >
                    {c.name}
                  </Link>
              ))}
            </nav>
          </div>
          <nav className="md:hidden flex gap-1 overflow-x-auto pb-2">
            {categories.map((c) => (
                <Link
                    key={c.href}
                    href={c.href}
                    className="flex-shrink-0 px-3 py-1.5 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full"
                >
                  {c.icon} {c.name}
                </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

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