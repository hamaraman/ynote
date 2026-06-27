import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORY_LIST } from "@/lib/categories";

export const metadata: Metadata = {
    title: "페이지를 찾을 수 없습니다",
    description: "요청하신 페이지가 존재하지 않거나 이동되었습니다.",
    robots: { index: false, follow: false },
};

const QUICK_LINKS = CATEGORY_LIST.map((c) => ({
    href: c.href,
    label: `${c.icon} ${c.navLabel}`,
}));

export default function NotFound() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
            {/* 상태 코드 */}
            <div className="relative inline-block mb-8">
                <span className="text-[120px] md:text-[160px] font-black text-gray-100 dark:text-slate-800 leading-none select-none">
                    404
                </span>
                <span className="absolute inset-0 flex items-center justify-center text-5xl md:text-6xl">
                    📭
                </span>
            </div>

            {/* 메시지 */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
                페이지를 찾을 수 없어요
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed mb-10 max-w-sm mx-auto">
                주소가 잘못됐거나, 정책 정보가 업데이트되어 이동되었을 수 있습니다.
                아래에서 원하는 정책을 찾아보세요.
            </p>

            {/* CTA 버튼 */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
                <Link
                    href="/"
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl transition shadow-md hover:shadow-lg active:scale-[0.98] text-sm"
                >
                    홈으로 돌아가기
                </Link>
                <Link
                    href="/search"
                    className="px-6 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-teal-400 dark:hover:border-teal-600 font-semibold rounded-2xl transition text-sm"
                >
                    🔍 정책 검색하기
                </Link>
            </div>

            {/* 카테고리 바로가기 */}
            <div className="border-t border-gray-100 dark:border-slate-800 pt-10">
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5">
                    카테고리 바로가기
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {QUICK_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="px-4 py-2 bg-gray-50 dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-950/30 border border-gray-200 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-900/50 text-gray-700 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-400 rounded-xl text-sm font-medium transition"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
