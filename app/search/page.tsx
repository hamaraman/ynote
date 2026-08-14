import type { Metadata } from "next";
import { Suspense } from "react";
import PolicySearchClient, { type SearchPolicy } from "@/components/PolicySearchClient";
import { getAllPolicies } from "@/lib/posts";

export const metadata: Metadata = {
    title: "정책 검색",
    description: "청년노트가 검수한 청년정책 가이드를 주거, 일자리, 교육, 금융, 창업 등 분야별로 찾아보세요.",
    alternates: { canonical: "/search" },
};

function getSearchPolicies(): SearchPolicy[] {
    return getAllPolicies().map((policy) => ({
        id: policy.slug,
        title: policy.title,
        description: policy.description,
        category: policy.category,
        categorySlug: policy.categorySlug,
        date: policy.updated || policy.date,
        tags: policy.tags ?? [],
    }));
}

export default function SearchPage() {
    const policies = getSearchPolicies();

    return (
        <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-16 text-center text-gray-400">정책 가이드를 불러오는 중...</div>}>
            <PolicySearchClient initialPolicies={policies} />
        </Suspense>
    );
}
