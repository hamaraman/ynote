// 카테고리 단일 소스(single source of truth).
// 카테고리를 추가/변경할 때 이 파일만 고치면 홈·내비·검색·사이트맵·카테고리 페이지에
// 모두 반영됩니다. (예전엔 5개 파일에 따로 하드코딩돼 자꾸 누락이 발생했음)
//
// 주의: color는 Tailwind가 스캔할 수 있도록 반드시 완전한 클래스 문자열로 둘 것.

export type CategoryMeta = {
    /** 전체 이름 — 홈 카드·카테고리 페이지 제목 */
    name: string;
    /** 짧은 라벨 — 헤더/모바일 내비, 검색 필터, 404 바로가기 */
    navLabel: string;
    icon: string;
    /** 카테고리 페이지 메타 설명(긴 문장) */
    description: string;
    /** 홈 카드 부제(대표 정책 예시) */
    examples: string;
    /** 홈 카드 배경/테두리 Tailwind 클래스 */
    color: string;
};

export const CATEGORIES: Record<string, CategoryMeta> = {
    finance: {
        name: "금융/자산",
        navLabel: "금융/자산",
        icon: "💰",
        description: "청년도약계좌, 청약통장, 소득공제펀드 등 자산 형성에 도움 되는 정책",
        examples: "청년도약계좌, 청약통장, 소득공제펀드",
        color: "bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 dark:border dark:border-amber-900/20 text-gray-900 dark:text-gray-100",
    },
    housing: {
        name: "주거",
        navLabel: "주거",
        icon: "🏠",
        description: "월세 지원, 전세 자금 대출, 청년 주택 등 주거 관련 혜택",
        examples: "월세지원, 전세대출, 청년주택",
        color: "bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 dark:border dark:border-rose-900/20 text-gray-900 dark:text-gray-100",
    },
    job: {
        name: "일자리",
        navLabel: "일자리",
        icon: "💼",
        description: "내일배움카드, 구직활동지원금, 채움공제 등 취업 지원",
        examples: "내일배움카드, 구직지원금, 채움공제",
        color: "bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/20 dark:hover:bg-sky-900/30 dark:border dark:border-sky-900/20 text-gray-900 dark:text-gray-100",
    },
    startup: {
        name: "창업",
        navLabel: "창업",
        icon: "🚀",
        description: "예비창업패키지, 청년 창업자금, 1인 창조기업 등 창업 지원",
        examples: "예비창업패키지, 창업자금, 1인 창조기업",
        color: "bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/20 dark:hover:bg-teal-900/30 dark:border dark:border-teal-900/20 text-gray-900 dark:text-gray-100",
    },
    edu: {
        name: "교육/문화",
        navLabel: "교육/문화",
        icon: "📚",
        description: "문화패스, 평생교육바우처, 학자금대출 등 교육·문화 지원",
        examples: "문화패스, 평생교육바우처, 학자금대출",
        color: "bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/20 dark:hover:bg-violet-900/30 dark:border dark:border-violet-900/20 text-gray-900 dark:text-gray-100",
    },
    transport: {
        name: "교통",
        navLabel: "교통",
        icon: "🚍",
        description: "K-패스, 기후동행카드, 지역 교통패스 등 교통비 지원",
        examples: "K-패스, 기후동행카드, 지역 교통패스",
        color: "bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/20 dark:hover:bg-cyan-900/30 dark:border dark:border-cyan-900/20 text-gray-900 dark:text-gray-100",
    },
    life: {
        name: "건강/생활",
        navLabel: "건강/생활",
        icon: "🏥",
        description: "마음건강바우처, 청년몽땅정보통 등 건강·생활 지원",
        examples: "마음건강바우처, 청년몽땅정보통",
        color: "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 dark:border dark:border-emerald-900/20 text-gray-900 dark:text-gray-100",
    },
    region: {
        name: "지역별 혜택",
        navLabel: "지역별",
        icon: "📍",
        description: "서울, 경기, 부산 등 지자체별 청년 사업",
        examples: "서울/경기/부산 등 지자체 지원",
        color: "bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-900/30 dark:border dark:border-orange-900/20 text-gray-900 dark:text-gray-100",
    },
};

export const CATEGORY_SLUGS = Object.keys(CATEGORIES);

/** 화면 노출 순서대로의 카테고리 배열 (slug·href 포함). */
export const CATEGORY_LIST = CATEGORY_SLUGS.map((slug) => ({
    slug,
    href: `/category/${slug}`,
    ...CATEGORIES[slug],
}));
