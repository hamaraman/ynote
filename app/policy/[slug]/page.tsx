import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPolicySlugs, getPolicyBySlug } from "@/lib/posts";

export async function generateStaticParams() {
    return getAllPolicySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const policy = await getPolicyBySlug(slug);
    if (!policy) return {};
    return { title: policy.title, description: policy.description };
}

export default async function PolicyPage({
                                             params,
                                         }: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const policy = await getPolicyBySlug(slug);
    if (!policy) notFound();

    return (
        <article className="max-w-3xl mx-auto px-4 py-12">
            <div className="mb-4">
                <Link
                    href={`/category/${policy.categorySlug}`}
                    className="text-sm text-teal-600 hover:underline"
                >
                    ← {policy.category}
                </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {policy.title}
            </h1>
            <p className="text-gray-600 mb-2">{policy.description}</p>
            <p className="text-sm text-gray-400 mb-8 border-b border-gray-200 pb-6">
                작성: {policy.date}
                {policy.updated && policy.updated !== policy.date && ` · 업데이트: ${policy.updated}`}
            </p>
            <div
                className="prose prose-gray max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h3:text-xl prose-h3:mt-8 prose-a:text-teal-600 prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: policy.contentHtml }}
            />
        </article>
    );
}