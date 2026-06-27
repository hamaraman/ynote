# 청년노트 (ynote)

청년이 받을 수 있는 정부 지원금·정책을 한눈에 정리해 보여주는 정책 가이드 서비스입니다.
직접 작성한 **큐레이션 가이드(마크다운)** 와 **온통청년 공공 API의 실시간 정책**을 함께 제공합니다.

## 주요 기능

- **분야별 카테고리** — 금융/주거/일자리/창업/교육/교통/건강·생활/지역별 (단일 소스: `lib/categories.ts`)
- **맞춤 검색** — 키워드·카테고리·나이·지역 필터 (`/search`)
- **정책 상세** — 마크다운 가이드 + API 정책 상세 (`/policy/[slug]`)
- **저장함** — localStorage 기반 북마크, 탭 간 동기화 (`/bookmarks`)
- **다크 모드** — 페인트 전 인라인 스크립트로 FOUC 없이 적용
- **SEO** — 동적 `sitemap.xml`·`robots.txt`, 카테고리/정책별 메타데이터, JSON-LD

## 기술 스택

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) · React 19
- TypeScript
- Tailwind CSS v4 (`@tailwindcss/postcss`, `@tailwindcss/typography`)
- 마크다운 처리: `gray-matter` + `remark` / `remark-html`
- 배포: Vercel

## 데이터 소스

| 소스 | 위치 | 설명 |
| --- | --- | --- |
| 큐레이션 가이드 | `content/policy/*.md` | 직접 작성한 정책 해설. `lib/posts.ts`가 읽음 |
| 온통청년 API | `lib/youthApi.ts` | 실시간 정부 정책 목록·상세 (서버에서만 호출) |

## 프로젝트 구조

```
app/              # App Router 페이지 (home, search, category, policy, bookmarks 등)
  api/policies/   # 클라이언트 인터랙션용 프록시 라우트 (인증키 서버 보호)
components/       # UI 컴포넌트 (PolicyCard, SearchFilters, ThemeToggle 등)
content/policy/   # 마크다운 정책 가이드
lib/              # categories(단일 소스), posts(마크다운), youthApi(공공 API), hooks, bookmarks
public/           # 정적 자산
```

## 환경 변수

`.env.local`에 설정합니다.

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `YOUTH_API_KEY` | ✅ | 온통청년 API 인증키 (서버 전용, 클라이언트 노출 안 됨) |
| `NEXT_PUBLIC_SITE_URL` | 선택 | 사이트 절대 URL (메타데이터·사이트맵 기준, 기본값 `https://ynote.kr`) |
| `NEXT_PUBLIC_GA_ID` | 선택 | Google Analytics 측정 ID |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | 선택 | Google AdSense 클라이언트 ID |

## 로컬 실행

요구 사항: Node.js 20 이상 (개발 환경 기준 v22).

```bash
npm install
npm run dev      # http://localhost:3000
```

기타 스크립트:

```bash
npm run build    # 프로덕션 빌드
npm run start    # 빌드 결과 실행
npm run lint     # ESLint
```

## 콘텐츠(정책 가이드) 추가

`content/policy/`에 `<slug>.md` 파일을 만들고 frontmatter를 채웁니다.

```markdown
---
title: "정책 제목"
description: "검색·메타데이터에 쓰일 한 줄 요약"
category: "금융/자산"        # 표시용 카테고리 이름
categorySlug: "finance"      # lib/categories.ts의 키와 일치해야 함
date: "2026-01-01"
updated: "2026-02-01"        # 선택
---

본문 (마크다운)
```

파일을 추가하면 사이트맵·카테고리 페이지·정책 상세에 자동 반영됩니다.
`categorySlug`는 반드시 `lib/categories.ts`에 정의된 키여야 합니다.

## 배포

Vercel에 연결되어 있으며, 위 환경 변수를 프로젝트 설정에 등록해야 합니다.
