import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * 클라이언트 마운트 여부.
 * 서버/하이드레이션 시점엔 false, 클라이언트에선 true를 반환한다.
 * effect 안에서 setState 하던 `mounted` 플래그 패턴을 대체한다.
 */
export function useMounted(): boolean {
    return useSyncExternalStore(emptySubscribe, () => true, () => false);
}
