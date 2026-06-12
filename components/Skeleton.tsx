export function PolicyCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
            <div className="flex items-center gap-2 mb-3">
                <div className="h-5 w-16 bg-gray-200 rounded-full" />
                <div className="h-5 w-16 bg-gray-100 rounded-full" />
            </div>
            <div className="h-6 bg-gray-200 rounded mb-3 w-3/4" />
            <div className="space-y-2 mb-3">
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
            </div>
            <div className="bg-amber-50 rounded-lg p-2 mb-3">
                <div className="h-3 bg-amber-100 rounded w-4/5" />
            </div>
            <div className="flex items-center gap-3">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
        </div>
    );
}

export function PolicyListSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <PolicyCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function PolicyDetailSkeleton() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
            {/* 헤더 스켈레톤 */}
            <div className="h-4 w-20 bg-gray-200 rounded mb-6" />
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl p-6 md:p-8 mb-8">
                <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-white/20 rounded-full" />
                    <div className="h-6 w-20 bg-white/20 rounded-full" />
                </div>
                <div className="h-8 md:h-10 bg-white/20 rounded w-3/4 mb-4" />
                <div className="space-y-2 mb-6">
                    <div className="h-5 bg-white/20 rounded w-full" />
                    <div className="h-5 bg-white/20 rounded w-5/6" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white/10 rounded-xl p-4">
                            <div className="h-3 bg-white/20 rounded w-16 mb-2" />
                            <div className="h-4 bg-white/20 rounded w-24" />
                        </div>
                    ))}
                </div>
            </div>

            {/* 섹션 스켈레톤 */}
            <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                            <div className="h-5 w-32 bg-gray-200 rounded" />
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="h-4 bg-gray-100 rounded w-full" />
                            <div className="h-4 bg-gray-100 rounded w-5/6" />
                            <div className="h-4 bg-gray-100 rounded w-4/6" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CategoryPageSkeleton() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
            <div className="h-4 w-12 bg-gray-200 rounded mb-4" />
            <div className="h-9 w-40 bg-gray-200 rounded mb-2" />
            <div className="h-5 w-80 bg-gray-100 rounded mb-8" />

            <div className="mb-10">
                <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                            <div className="h-5 w-16 bg-gray-100 rounded-full mb-3" />
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                            <div className="h-4 bg-gray-100 rounded w-2/3" />
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
                <PolicyListSkeleton count={9} />
            </div>
        </div>
    );
}

export function HomePageSkeleton() {
    return (
        <div className="max-w-5xl mx-auto px-4 animate-pulse">
            <div className="py-12 md:py-20 text-center">
                <div className="h-12 md:h-14 bg-gray-200 rounded w-64 mx-auto mb-4" />
                <div className="h-6 bg-gray-100 rounded w-80 mx-auto mb-8" />
                <div className="h-12 bg-gray-100 rounded-full w-80 mx-auto" />
            </div>

            <div className="pb-12">
                <div className="h-6 w-24 bg-gray-200 rounded mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-gray-50 rounded-2xl p-5 h-24" />
                    ))}
                </div>
            </div>

            <div className="pb-10">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 h-16" />
                    ))}
                </div>
            </div>

            <div className="pb-16">
                <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 h-40" />
                    ))}
                </div>
            </div>
        </div>
    );
}