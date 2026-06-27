// 카테고리 단일 소스(single source of truth).
// 카테고리를 추가/변경할 때 이 파일만 고치면 카테고리 페이지·사이트맵에 함께 반영됩니다.

export type CategoryMeta = {
    name: string;
    icon: string;
    description: string;
};

export const CATEGORIES: Record<string, CategoryMeta> = {
    finance: { name: "금융/자산", icon: "💰", description: "청년도약계좌, 청약통장, 소득공제펀드 등 자산 형성에 도움 되는 정책" },
    housing: { name: "주거", icon: "🏠", description: "월세 지원, 전세 자금 대출, 청년 주택 등 주거 관련 혜택" },
    job: { name: "일자리", icon: "💼", description: "내일배움카드, 구직활동지원금, 채움공제 등 취업 지원" },
    startup: { name: "창업", icon: "🚀", description: "예비창업패키지, 청년 창업자금, 1인 창조기업 등 창업 지원" },
    edu: { name: "교육/문화", icon: "📚", description: "문화패스, 평생교육바우처, 학자금대출 등 교육·문화 지원" },
    transport: { name: "교통", icon: "🚍", description: "K-패스, 기후동행카드, 지역 교통패스 등 교통비 지원" },
    life: { name: "건강/생활", icon: "🏥", description: "마음건강바우처, 청년몽땅정보통 등 건강·생활 지원" },
    region: { name: "지역별 혜택", icon: "📍", description: "서울, 경기, 부산 등 지자체별 청년 사업" },
};

export const CATEGORY_SLUGS = Object.keys(CATEGORIES);
