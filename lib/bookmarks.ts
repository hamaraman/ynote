import { useSyncExternalStore } from "react";

export interface BookmarkedPolicy {
    id: string;
    type: "markdown" | "api";
    title: string;
    description: string;
    categorySlug: string;
    categoryName: string;
    aplyYmd?: string;
    sprvsnInstCdNm?: string;
}

const KEY = "bookmarks";
const EVENT = "bookmarks-updated";
const EMPTY: BookmarkedPolicy[] = [];

// getSnapshot은 동일 입력에 대해 같은 참조를 돌려줘야 무한 렌더를 막는다.
// localStorage 원본 문자열이 그대로면 파싱 결과를 캐시해 재사용한다.
let cache: BookmarkedPolicy[] = EMPTY;
let cacheRaw: string | null = null;

function read(): BookmarkedPolicy[] {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(KEY) : null;
    if (raw === cacheRaw) return cache;
    cacheRaw = raw;
    try {
        cache = raw ? (JSON.parse(raw) as BookmarkedPolicy[]) : EMPTY;
    } catch {
        cache = EMPTY;
    }
    return cache;
}

function subscribe(callback: () => void): () => void {
    window.addEventListener(EVENT, callback);
    window.addEventListener("storage", callback); // 다른 탭과 동기화
    return () => {
        window.removeEventListener(EVENT, callback);
        window.removeEventListener("storage", callback);
    };
}

/** 저장한 정책 목록을 구독한다. localStorage 변경 시 자동으로 다시 렌더된다. */
export function useBookmarks(): BookmarkedPolicy[] {
    return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/** 특정 정책이 저장되어 있는지 구독한다. */
export function useIsBookmarked(id: string): boolean {
    return useBookmarks().some((b) => b.id === id);
}

/** 저장/해제를 토글하고 구독 중인 컴포넌트에 변경을 알린다. */
export function toggleBookmark(policy: BookmarkedPolicy): void {
    const current = read();
    const exists = current.some((b) => b.id === policy.id);
    const next = exists ? current.filter((b) => b.id !== policy.id) : [...current, policy];
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
}
