# AI 프로젝트 프로필

> 저장소에서 확인한 사실만 기록합니다. 확인하지 못한 세부사항은 추측하지 않습니다.

## 프로젝트

- 목적: 퇴직금 1,000만 원으로 가상 주식 시장에 투자하는 브라우저 픽셀 아트 게임입니다. 제품명은 STOCK SIMULATION이며 픽셀은 시각 스타일로 사용합니다.
- 언어 / 프레임워크 / 런타임: TypeScript, Vue 3, Vue Router, Vite, 브라우저.
- 패키지 관리자 / 버전: pnpm `11.17.0` (`package.json`의 `packageManager` 기준), Node.js 24 이상.
- 주요 디렉터리:
  - `src/components/screens/`: 화면 단위 UI
  - `src/components/shared/`: 재사용 표시 UI
  - `src/composables/useInvestmentGame.ts`: 반응형 게임 흐름
  - `src/game/marketModel.ts`: 시장 계산
  - `src/game/gamePersistence.ts`: 브라우저 저장과 복원
  - `src/data/gameData.ts`, `src/types/game.ts`: 게임 데이터와 타입
  - `src/styles/`: 공통 기반, 픽셀 테마, 증권 단말 스타일, 반응형 규칙
  - `.codex/agents/`: Codex 역할별 지침
  - `serene-harness/`: 공통 작업 규칙·리뷰·리뉴얼 기준 템플릿
- 아키텍처와 데이터 흐름: Vue Router의 hash history가 화면 URL과 화면 흐름을 관리합니다. 게임 진행과 관심 종목은 브라우저 `localStorage`에 저장됩니다. 외부 시장 데이터는 사용하지 않습니다.

## 소유권과 경계

- 자동 생성 파일 및 원본 정의: 확인된 생성 코드 절차는 없습니다. `dist/`는 Vite 빌드 산출물이므로 직접 수정하지 말고 소스와 Vite 설정을 수정합니다.
- 재생성 시 보존할 수동·외부 보강 데이터와 보존 절차: 해당 없음으로 확인됨.
- API / DB 스키마 / 마이그레이션 규칙: 백엔드 DB와 외부 API는 확인되지 않았습니다. 게임 진행 호환성을 바꾸는 경우 브라우저 저장 키와 기존 데이터 보존을 확인합니다.
- 인증·권한·민감 데이터 경계: 외부 서비스 키나 빌드 환경 변수는 필요하지 않습니다. 비밀값을 소스·로그·커밋에 넣지 않습니다.
- 배포: `.github/workflows/deploy-pages.yml`이 GitHub Pages에 배포합니다. Vite production build의 base 경로는 `/stockSimulation/`이며 개발 서버 base는 `/`입니다.
- 이 저장소에서 금지하거나 주의할 작업: 기존 게임 세이브와 관심 종목을 보존합니다. 사용자 요청 없이 커밋·푸시·배포하거나 외부 시스템을 변경하지 않습니다.

## 에이전트 설정

- 공통 설정: `.codex/config.toml`; 동시 실행 설정은 세션당 최대 3개입니다.
- Planner: `.codex/agents/planner.toml`, `gpt-6-luna`, 높은 추론 수준. 읽기 전용으로 요구사항·구조를 조사하고 수용 기준과 미결정 사항을 전달합니다.
- Developer: `.codex/agents/developer.toml`, `gpt-6-luna`, 높은 추론 수준. 확정 요구사항과 할당 범위를 구현하고 리뷰 차단 항목을 수정합니다.
- Reviewer: `.codex/agents/reviewer.toml`, `gpt-6.1-sol`, 높은 추론 수준. 읽기 전용으로 변경을 검토하고 수정 결과를 재확인합니다.
- 호출 순서와 범위: 역할 분담 시 메인이 Planner → Developer → Reviewer 순서를 조율합니다. 작은 작업은 단일 담당이 처리합니다. Planner와 Reviewer는 파일 수정 금지 지침을 따르며, 이는 권한 격리가 아닙니다. 설정 파일만으로 역할이 자동 호출된다고 가정하지 않습니다.
- 작업 격리: 설정에서 worktree 기반 격리는 확인되지 않았습니다. 같은 파일의 동시 수정은 피하고 병렬 구현이 필요하면 파일·인터페이스를 분리합니다.

## 게임 규칙과 데이터 계약

- 화면: `/` 시작, `/game/practice` 시세 (`/game/practice/market` 별칭), `/game/practice/companies` 기업 정보, `/game/practice/stocks/:code` 상세, `/game/practice/stocks/:code/order` 주문, `/game/practice/portfolio` 내 주식, `/summary` 장 마감 요약, `/result` 종료 결과.
- 시작 자금 1,000만 원, 최대 30거래일. 정규장 09:00–15:30, 정비 시간 15:30–16:00, 애프터마켓 16:00–20:00입니다.
- 기본 1배속에서 초당 게임 시간 1분이 흐르고 1·2·4·8배속을 지원합니다. 게임 시간 5분마다 장이 열린 구간에서 가격과 차트를 갱신합니다. 정비 시간에도 시계는 흐르며 한 거래일은 기본 속도 기준 660초입니다.
- 가상 종목 24개의 기준가는 5,000원부터 2,480,000원까지입니다. 기업별 시가총액은 현재가와 발행 주식 수로 계산합니다.
- 종목별 일 마감 가격은 최근 30거래일을 저장하고 상세 차트에서 당일·일별·5거래일 단위 주별로 확인합니다.
- 종목은 전일 종가 대비 ±30% 가격 제한에 도달하면 그날 거래와 예약 주문 체결을 중단하며, 다음 거래일에 제한 상태를 해제합니다.
- 투자 관심도/인기도는 종목별 평균 거래량을 뜻하며 정보용 지표입니다. 주가 흐름에는 직접 영향을 주지 않습니다.
- 종합지수는 종목별 시가총액 비중을 반영해 누적 계산합니다. 이전 세이브에는 기준 시가총액을 보정해 적용합니다.
- 정규장과 애프터마켓에 즉시 매수·매도 및 지정가 예약이 가능합니다. 정비 시간에는 거래와 시세 갱신이 멈춥니다. 애프터마켓은 낮은 변동성을 사용하고 미체결 주문은 20:00에 취소합니다.
- 총 자산이 10만 원 이하가 되면 파산으로 종료합니다. 가격은 가상 이벤트·변동성으로 생성하며 외부 주가를 사용하지 않습니다.
- 저장 키는 `simulated-investment-game-state`, `simulated-investment-watchlist`입니다. 저장 데이터의 누락 필드는 기본값으로 보정하며, 라우트 변경 시 거래 내역과 보유 자산을 유지합니다.

## 검증 명령

| 범위 | 명령 | 비고 |
| --- | --- | --- |
| 전체 검증 | `pnpm verify` | `pnpm lint` 및 `pnpm build` 실행 |
| 린트 | `pnpm lint` | ESLint |
| 타입 검사 및 빌드 | `pnpm build` | `vue-tsc --noEmit` 후 Vite production build |
| 개발 서버 | `pnpm dev` | Vite 개발 서버 |
| 프로덕션 미리보기 | `pnpm preview` | 기존 production build를 수동 확인 |
| 단위 / 통합 / E2E | 없음 | 저장소에 자동화된 테스트/E2E 스크립트 없음 |

## 완료 기준

- 변경과 관련된 가장 좁은 검증을 실행하고 결과를 사실대로 보고합니다. 전체 검증이 필요한 변경은 `pnpm verify`를 사용합니다.
- 브라우저 흐름을 바꾸면 라우트 이동과 뒤로·앞으로 복원, 관련 게임 루프 및 저장 복원을 확인합니다. 자동화된 브라우저 검사는 현재 확인되지 않았습니다.
- 게임 규칙·저장 계약 변경은 기존 세이브 호환성 및 영향을 받는 화면 흐름을 확인합니다.
- 미실행 검사, 사용자 확인이 필요한 동작, 남은 위험을 완료 보고에 구분해 기록합니다.
- 코드 리뷰는 `serene-harness/review-checklist.md`의 절차·심각도·보고 순서를 따릅니다.

## 참고 문서

- `AGENTS.md`: 저장소 작업 지침과 에이전트 조율 규칙
- `serene-harness/renewal-migration.md`: 제품 흐름·게임 루프·시각 기준
- `serene-harness/review-checklist.md`: 읽기 전용 코드 리뷰 절차
- `.github/workflows/deploy-pages.yml`: GitHub Pages 빌드와 배포
