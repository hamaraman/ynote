/**
 * aplyYmd (예: "20260101 ~ 20261231") 또는 bizPrdEndYmd (예: "20261231") 에서
 * 종료일을 파싱해 오늘 기준 남은 일수를 반환합니다.
 * 이미 마감됐으면 null, 날짜를 파싱할 수 없으면 null.
 */
export function getDDay(
    aplyYmd?: string | null,
    bizPrdEndYmd?: string | null
): number | null {
    let endDateStr: string | undefined;

    if (aplyYmd) {
        // "20261231" 형식 8자리 숫자 중 마지막 값이 종료일
        const matches = aplyYmd.match(/\d{8}/g);
        if (matches?.length) endDateStr = matches[matches.length - 1];
    }

    if (!endDateStr && bizPrdEndYmd && bizPrdEndYmd.length >= 8) {
        endDateStr = bizPrdEndYmd;
    }

    if (!endDateStr) return null;

    const y = +endDateStr.slice(0, 4);
    const m = +endDateStr.slice(4, 6) - 1;
    const d = +endDateStr.slice(6, 8);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;

    const endDate = new Date(y, m, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const diff = Math.ceil((endDate.getTime() - today.getTime()) / 86_400_000);
    return diff < 0 ? null : diff;
}
