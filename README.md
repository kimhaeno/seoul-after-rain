# Seoul After Rain

비 오는 날 서울의 장면을 시민의 문장과 사진으로 보관하는 정적 아카이브 프로토타입입니다.

## Cloudflare Workers

- Production branch: `main`
- Build command: 비워두기
- Deploy command: `npx wrangler deploy`
- Non-production branch deploy command: `npx wrangler versions upload`
- Root directory: `/`

Worker의 `Settings > Variables and Secrets`에서 공공데이터포털의 Decoding 인증키를 `KMA_SERVICE_KEY`라는 암호화된 런타임 Secret으로 등록합니다. Workers Builds의 빌드 변수 입력란에는 이 키를 넣지 않습니다. 키를 저장소에 커밋하지 마세요.

`worker/index.js`가 정적 자산과 `/api/weather` 요청을 나누고, `functions/api/weather.js`는 기상청 초단기실황과 초단기예보를 읽어 `rain`, `approaching`, `dry` 가운데 하나를 반환합니다. API 호출에 실패하면 사이트는 `dry` 상태로 조용히 돌아갑니다.

## Local preview

배포 전 문구 전환은 아래 쿼리로 확인할 수 있습니다.

- `public/index.html?weather=rain`
- `public/index.html?weather=approaching`
- `public/index.html?weather=dry`

실제 API 연동을 로컬에서 확인하려면 Wrangler와 로컬 `.dev.vars` 파일을 사용하세요. `.dev.vars`와 `.env` 파일은 Git에서 제외됩니다.

## Data source

날씨 데이터는 기상청 단기예보 조회서비스를 사용합니다. 공공누리 제1유형 조건에 따라 출처를 표시합니다.
