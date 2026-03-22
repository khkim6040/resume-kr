# resume-kr

한국어 이력서를 웹에서 작성하고 PDF로 다운로드할 수 있는 이력서 빌더입니다.

## 주요 기능

- 실시간 미리보기가 가능한 에디터/프리뷰 분할 화면
- 드래그 앤 드롭으로 섹션 순서 변경
- PDF 다운로드
- A4 규격 미리보기

## 사용법

```bash
# 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 테스트
npm test
```

`http://localhost:3000`에서 이력서를 작성할 수 있습니다.

## 기술 스택

- **Framework**: Next.js 16, React 19, TypeScript
- **스타일링**: Tailwind CSS 4
- **상태 관리**: Zustand
- **PDF 생성**: @react-pdf/renderer
- **드래그 앤 드롭**: @dnd-kit
- **테스트**: Vitest, Testing Library
