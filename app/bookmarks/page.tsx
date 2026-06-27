"use client";

import Link from "next/link";
import { useMounted } from "@/lib/hooks";
import { useBookmarks } from "@/lib/bookmarks";
import PolicyCard from "@/components/PolicyCard";

export default function BookmarksPage() {
    const mounted = useMounted();
    const bookmarks = useBookmarks();

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
                        <PolicyCard key={policy.id} policy={policy} />
                    ))}
                </div>
            )}
        </div>
    );
}
