import type { ResumeData } from "@/types/resume";

// 작성 예시용 가상 인물 이력서 (젠슨 황 모티브: 맘스터치 알바 → 네이버 개발자)
export const sampleResume: ResumeData = {
  personalInfo: {
    name: "황준선",
    email: "junsun.hwang@example.com",
    phone: "010-1234-5678",
    address: "경기도 성남시 분당구",
    github: "https://github.com/junsun-hwang",
    linkedin: "https://www.linkedin.com/in/junsun-hwang",
    website: "https://junsun.dev",
    summary:
      "맘스터치 주방에서 3년간 피크타임 주문을 쳐내며 '병목을 찾아 없애는 일'의 즐거움을 배웠고, 그 감각으로 개발자가 되었습니다. 현재 네이버에서 대규모 트래픽을 처리하는 검색·커머스 백엔드를 개발하고 있으며, GPU 기반 추론 서빙 최적화에 관심이 많습니다. 가죽 재킷과 병렬 처리를 좋아합니다.",
  },
  workExperience: [
    {
      id: "sample-work-naver",
      company: "네이버",
      position: "백엔드 개발자 (검색플랫폼)",
      startDate: "2022-07",
      isCurrent: true,
      description: [
        "네이버 쇼핑 검색 API 응답 캐싱 계층 재설계로 p99 지연 시간 420ms → 180ms 단축",
        "Kafka 기반 상품 색인 파이프라인 구축, 일 2억 건 변경 이벤트를 5분 이내 반영",
        "HyperCLOVA X 추론 서버 배치 스케줄러 개선으로 GPU 사용률 38% → 71% 향상",
        "신규 입사자 온보딩 가이드 및 사내 Spring Boot 성능 튜닝 스터디 운영",
      ],
    },
    {
      id: "sample-work-momstouch",
      company: "맘스터치 강남역점",
      position: "크루 (아르바이트) → 주방 리더",
      startDate: "2018-03",
      endDate: "2021-02",
      isCurrent: false,
      description: [
        "피크타임 주문 동선을 재배치해 평균 버거 조리 시간 7분 → 4분 30초로 단축",
        "신규 크루 15명 교육, 싸이버거 조립 체크리스트 직접 제작",
        "엑셀 매크로로 재고 발주 자동화 — 첫 '코딩' 경험이자 개발자 전향의 계기",
      ],
    },
  ],
  education: [
    {
      id: "sample-edu-ssafy",
      school: "삼성 청년 SW 아카데미 (SSAFY)",
      degree: "수료",
      field: "Java 전공반",
      startDate: "2021-07",
      endDate: "2022-06",
      isCurrent: false,
      description: "1학기 성적 우수 / 2학기 자율 프로젝트 우수상",
    },
    {
      id: "sample-edu-univ",
      school: "한국방송통신대학교",
      degree: "학사",
      field: "컴퓨터과학과",
      startDate: "2018-03",
      endDate: "2022-02",
      isCurrent: false,
      description: "아르바이트와 병행하며 학점 3.8/4.5로 졸업",
      minors: [{ degree: "부전공", field: "통계·데이터과학" }],
    },
  ],
  skills: [
    { id: "sample-skill-lang", category: "언어", items: ["Java", "Kotlin", "Python", "SQL"] },
    { id: "sample-skill-backend", category: "백엔드", items: ["Spring Boot", "JPA", "Kafka", "Redis", "Elasticsearch"] },
    { id: "sample-skill-infra", category: "인프라", items: ["Kubernetes", "Docker", "NAVER Cloud Platform", "CUDA", "Grafana"] },
    { id: "sample-skill-collab", category: "협업", items: ["Git", "GitHub Actions", "Jira", "Slack"] },
  ],
  projects: [
    {
      id: "sample-proj-gpu",
      name: "사내 LLM 추론 배치 스케줄러",
      role: "핵심 개발",
      startDate: "2024-03",
      endDate: "2024-11",
      isCurrent: false,
      description: [
        "요청 길이 기반 동적 배칭으로 NVIDIA H100 클러스터 처리량 1.9배 향상",
        "Kubernetes 커스텀 오퍼레이터로 GPU 노드 오토스케일링 구현",
      ],
      techStack: ["Kotlin", "Kubernetes", "CUDA", "Triton Inference Server"],
    },
    {
      id: "sample-proj-ssafy",
      name: "버거 주문 대기열 예측 서비스 '버거타임'",
      role: "백엔드 · 팀장",
      startDate: "2022-04",
      endDate: "2022-06",
      isCurrent: false,
      description: [
        "맘스터치 근무 경험을 바탕으로 매장별 주문 대기 시간을 예측하는 서비스 기획",
        "주문 로그 기반 대기 시간 회귀 모델 서빙 API 개발 (오차 평균 1.2분)",
        "SSAFY 자율 프로젝트 우수상 수상",
      ],
      techStack: ["Spring Boot", "MySQL", "Redis", "FastAPI", "AWS"],
      link: "https://github.com/junsun-hwang/burger-time",
    },
  ],
  certificates: [
    { id: "sample-cert-aws", name: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", date: "2023-05" },
    { id: "sample-cert-sqld", name: "SQLD", issuer: "한국데이터산업진흥원", date: "2021-12" },
    { id: "sample-cert-eip", name: "정보처리기사", issuer: "한국산업인력공단", date: "2021-08" },
    { id: "sample-cert-food", name: "한식조리기능사", issuer: "한국산업인력공단", date: "2019-06" },
  ],
  languages: [
    { id: "sample-lang-en", name: "영어", level: "OPIc IH / 비즈니스 회화" },
    { id: "sample-lang-zh", name: "중국어", level: "HSK 4급" },
  ],
  awards: [
    {
      id: "sample-award-naver",
      name: "NAVER DEVIEW 2024 우수 발표",
      issuer: "네이버",
      date: "2024-11",
      description: "\"주방 동선에서 배운 GPU 배칭\" 세션 발표",
    },
    {
      id: "sample-award-ssafy",
      name: "자율 프로젝트 우수상",
      issuer: "삼성전자 (SSAFY)",
      date: "2022-06",
      description: "버거 주문 대기열 예측 서비스 '버거타임'",
    },
    {
      id: "sample-award-momstouch",
      name: "우수 크루 표창",
      issuer: "맘스터치",
      date: "2020-12",
    },
  ],
  sections: [
    { id: "sec-personal", type: "personalInfo", title: "인적사항", visible: true, order: 0 },
    { id: "sec-work", type: "workExperience", title: "경력", visible: true, order: 1 },
    { id: "sec-projects", type: "projects", title: "프로젝트", visible: true, order: 2 },
    { id: "sec-skills", type: "skills", title: "기술", visible: true, order: 3 },
    { id: "sec-education", type: "education", title: "학력", visible: true, order: 4 },
    { id: "sec-certificates", type: "certificates", title: "자격증", visible: true, order: 5 },
    { id: "sec-languages", type: "languages", title: "어학", visible: true, order: 6 },
    { id: "sec-awards", type: "awards", title: "수상", visible: true, order: 7 },
    {
      id: "sample-sec-activities",
      type: "custom",
      title: "대외활동",
      visible: true,
      order: 8,
      fieldDefinitions: [
        { id: "act-name", name: "활동명", type: "text" },
        { id: "act-date", name: "기간", type: "date" },
        { id: "act-desc", name: "내용", type: "descriptionList" },
      ],
    },
    {
      id: "sample-sec-writing",
      type: "custom",
      title: "발표 · 글",
      visible: true,
      order: 9,
      fieldDefinitions: [
        { id: "wr-title", name: "제목", type: "text" },
        { id: "wr-date", name: "날짜", type: "date" },
        { id: "wr-link", name: "링크", type: "link" },
      ],
    },
  ],
  customSections: {
    "sample-sec-activities": [
      {
        id: "sample-act-mentor",
        fields: [
          { fieldId: "act-name", value: "부스트캠프 웹·모바일 리뷰어" },
          { fieldId: "act-date", value: "2023-07" },
          { fieldId: "act-desc", value: ["비전공자 캠퍼 20명 코드 리뷰 및 커리어 멘토링"] },
        ],
      },
      {
        id: "sample-act-oss",
        fields: [
          { fieldId: "act-name", value: "Spring Kafka 오픈소스 기여" },
          { fieldId: "act-date", value: "2023-02" },
          { fieldId: "act-desc", value: ["컨슈머 리밸런싱 로그 누락 버그 수정 PR 머지"] },
        ],
      },
    ],
    "sample-sec-writing": [
      {
        id: "sample-wr-deview",
        fields: [
          { fieldId: "wr-title", value: "DEVIEW 2024 — 주방 동선에서 배운 GPU 배칭" },
          { fieldId: "wr-date", value: "2024-11" },
          { fieldId: "wr-link", value: "https://deview.kr" },
        ],
      },
      {
        id: "sample-wr-blog",
        fields: [
          { fieldId: "wr-title", value: "맘스터치 알바생이 네이버 개발자가 되기까지" },
          { fieldId: "wr-date", value: "2022-09" },
          { fieldId: "wr-link", value: "https://velog.io/@junsun/from-momstouch-to-naver" },
        ],
      },
    ],
  },
};
