const STORAGE_KEY = "seoul-after-rain-entries-v2";
const RETIRED_STORAGE_KEY = "seoul-after-rain-entries-v1";
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const SEOUL_TIME_ZONE = "Asia/Seoul";
const DAY_MS = 24 * 60 * 60 * 1000;
const MOBILE_ENTRY_STATE = "seoulAfterRainEntry";
const MOBILE_MAP_STATE = "seoulAfterRainDistrict";
const mobileViewport = window.matchMedia("(max-width: 44rem)");

const districts = [
  "강남구",
  "강동구",
  "강북구",
  "강서구",
  "관악구",
  "광진구",
  "구로구",
  "금천구",
  "노원구",
  "도봉구",
  "동대문구",
  "동작구",
  "마포구",
  "서대문구",
  "서초구",
  "성동구",
  "성북구",
  "송파구",
  "양천구",
  "영등포구",
  "용산구",
  "은평구",
  "종로구",
  "중구",
  "중랑구",
];

const sampleEntries = [
  {
    id: "archive-001",
    district: "마포구",
    place: "망원한강공원 물빛광장",
    title: "젖은 자전거길",
    excerpt:
      "퇴근길에 우산을 접고 강 쪽으로 걸었다. 자전거길의 작은 웅덩이마다 가로등이 길게 흔들렸고, 지나가는 사람들의 발소리는 평소보다 조심스러웠다.",
    time: "21:14",
    rain: "비 갠 뒤",
    tag: "산책",
    sample: true,
    photo: null,
  },
  {
    id: "archive-002",
    district: "종로구",
    place: "청계천 광교 아래",
    title: "광교의 빗소리",
    excerpt:
      "광교 아래에서 잠시 비를 피했다. 물길 위로 떨어지는 빗방울보다 난간을 두드리는 소리가 더 또렷했고, 신호를 기다리는 사람들은 모두 고개를 숙이고 있었다.",
    time: "18:42",
    rain: "보통비",
    tag: "대기",
    sample: true,
    photo: null,
  },
  {
    id: "archive-003",
    district: "성동구",
    place: "서울숲 은행나무길",
    title: "나무 아래의 틈",
    excerpt:
      "갑작스러운 소나기에 은행나무 아래로 들어갔다. 잎 끝에서 물이 한꺼번에 떨어질 때마다 운동화 앞코가 젖었지만, 흙 냄새 때문에 발걸음을 바로 떼지 못했다.",
    time: "16:07",
    rain: "소나기",
    tag: "나무",
    sample: true,
    photo: null,
  },
  {
    id: "archive-004",
    district: "용산구",
    place: "이태원로 녹사평역 인근",
    title: "버스 창의 선",
    excerpt:
      "버스 창문에 맺힌 물방울 사이로 녹사평역 입구가 번졌다. 와이퍼가 한 번 지나갈 때마다 사람들의 우산 색이 잠깐 또렷해졌다가 다시 흐려졌다.",
    time: "19:26",
    rain: "보통비",
    tag: "창문",
    sample: true,
    photo: null,
  },
  {
    id: "archive-005",
    district: "서대문구",
    place: "연세로 보행자길",
    title: "닫히지 않은 우산",
    excerpt:
      "비가 거의 멎었는데도 아무도 우산을 접지 않았다. 젖은 보도블록을 피해 걷는 대신, 서로의 우산 끝을 피하려는 걸음이 좁은 길을 천천히 움직이게 했다.",
    time: "20:03",
    rain: "이슬비",
    tag: "우산",
    sample: true,
    photo: null,
  },
  {
    id: "archive-006",
    district: "동작구",
    place: "노들섬 잔디마당",
    title: "강물 쪽 바람",
    excerpt:
      "노들섬 잔디마당은 비 때문에 비어 있었다. 강물 쪽에서 불어온 바람이 우산 안쪽까지 들어왔고, 멀리 철교를 지나는 전철 소리만 낮게 이어졌다.",
    time: "14:35",
    rain: "폭우",
    tag: "바람",
    sample: true,
    photo: null,
  },
  {
    id: "archive-007",
    district: "강북구",
    place: "북한산우이역 앞 우이천 산책로",
    title: "우이천의 물결",
    excerpt:
      "우이천 물이 평소보다 빠르게 흘렀다. 산책로 가장자리 풀들은 모두 한 방향으로 눕고, 다리 밑에 서 있던 나는 빗물이 바지 끝까지 닿는 것을 지켜봤다.",
    time: "11:18",
    rain: "폭우",
    tag: "물결",
    sample: true,
    photo: null,
  },
  {
    id: "archive-008",
    district: "송파구",
    place: "석촌호수 동호 산책로",
    title: "호수의 빈 의자",
    excerpt:
      "호숫가 벤치에는 물기가 고여 앉을 자리가 없었다. 대신 난 천천히 한 바퀴를 돌며 젖은 벚나무 가지와, 물 위에 퍼지는 작은 원들을 오래 바라봤다.",
    time: "07:51",
    rain: "이슬비",
    tag: "호수",
    sample: true,
    photo: null,
  },
];

const illustrationChoices = [
  "assets/rain-illustration-bus-window-v1.webp",
  "assets/rain-illustration-crosswalk-v1.webp",
  "assets/rain-illustration-alley-v1.webp",
  "assets/rain-illustration-river-bench-v1.webp",
];

const sampleIllustrations = {
  "archive-001": illustrationChoices[3],
  "archive-002": illustrationChoices[1],
  "archive-003": illustrationChoices[2],
  "archive-004": illustrationChoices[0],
  "archive-005": illustrationChoices[1],
  "archive-006": illustrationChoices[3],
  "archive-007": illustrationChoices[2],
  "archive-008": illustrationChoices[3],
};

const sampleDayOffsets = [0, 1, 2, 4, 6, 8, 10, 16];

sampleEntries.forEach((entry) => {
  entry.illustration = sampleIllustrations[entry.id];
});
sampleEntries.length = 0;

const VIEW_KEY = "seoul-after-rain-view-v2";
const archiveGrid = document.querySelector("#archive-grid");
const deskWorkspace = document.querySelector("#desk-view");
const deskReader = document.querySelector("#desk-reader");
const rainMap = document.querySelector("#rain-map");
const mapReader = document.querySelector("#map-reader");
const mapSheet = document.querySelector("#map-sheet");
const mapSheetContent = document.querySelector("#map-sheet-content");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const districtFilter = document.querySelector("#district-filter");
const rainFilterButtons = [...document.querySelectorAll("[data-rain]")];
const viewButtons = [...document.querySelectorAll("[data-view]")];
const viewPanels = [...document.querySelectorAll("[data-view-panel]")];
const composeDialog = document.querySelector("#compose-dialog");
const composeForm = document.querySelector("#compose-form");
const saveEntryButton = document.querySelector("#save-entry");
const formStatus = document.querySelector("#form-status");
const photoInput = document.querySelector("#entry-photo");
const photoPreview = document.querySelector("#photo-preview");
const photoDrop = photoInput.closest(".photo-drop");
const illustrationPicker = document.querySelector("#illustration-picker");
const weatherMessage = document.querySelector("#weather-message");
const weatherCredit = document.querySelector("#weather-credit");
const composeLabels = [...document.querySelectorAll("[data-compose-label]")];
const weatherFormTitle = document.querySelector("[data-weather-form-title]");
const weatherFormDescription = document.querySelector("[data-weather-form-description]");
const pageRegions = [document.querySelector("main"), document.querySelector("header"), document.querySelector("footer")];

const weatherCopy = {
  rain: {
    message: "지금 서울에 비가 옵니다. 이 순간의 장면을 시민의 문장으로 남겨주세요.",
    action: "지금 장면 남기기",
    formTitle: "비의 기록 남기기",
    formDescription: "오늘 비 속에서 지나친 한 장면을 적어주세요.",
  },
  approaching: {
    message: "서울에 비가 가까워지고 있습니다. 지난 비의 장면을 먼저 읽어보세요.",
    action: "장면 남기기",
    formTitle: "비의 기록 남기기",
    formDescription: "오늘 또는 지난 비에서 기억에 남은 한 장면을 적어주세요.",
  },
  dry: {
    message: "지난 비를 읽는 시간입니다. 서울에 남은 장면을 천천히 골라보세요.",
    action: "지난 비 남기기",
    formTitle: "지난 비의 기록 남기기",
    formDescription: "기억에 남은 비 오는 날의 한 장면을 적어주세요.",
  },
};

const districtMapLayout = {
  "도봉구": [4, 1],
  "노원구": [5, 1],
  "은평구": [2, 2],
  "강북구": [4, 2],
  "성북구": [5, 2],
  "중랑구": [6, 2],
  "서대문구": [2, 3],
  "종로구": [3, 3],
  "동대문구": [5, 3],
  "광진구": [6, 3],
  "마포구": [1, 4],
  "중구": [4, 4],
  "성동구": [5, 4],
  "강동구": [7, 4],
  "강서구": [1, 5],
  "양천구": [2, 5],
  "영등포구": [3, 5],
  "용산구": [4, 5],
  "송파구": [6, 5],
  "구로구": [2, 6],
  "동작구": [4, 6],
  "서초구": [5, 6],
  "강남구": [6, 6],
  "금천구": [3, 7],
  "관악구": [4, 7],
};

clearRetiredEntries();
let userEntries = loadUserEntries();
let activeRain = "all";
let activeView = loadView();
let selectedEntryId = "archive-004";
let selectedMapDistrict = mobileViewport.matches ? null : "용산구";
let pendingPhoto = null;

const seoulDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SEOUL_TIME_ZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

const seoulTimeFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: SEOUL_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function seoulDateParts(value) {
  const parts = Object.fromEntries(
    seoulDateFormatter
      .formatToParts(new Date(value))
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );
  return { year: parts.year, month: parts.month, day: parts.day };
}

function seoulCalendarDay(value) {
  const { year, month, day } = seoulDateParts(value);
  return Date.UTC(year, month - 1, day) / DAY_MS;
}

function sampleCreatedAt(daysAgo, time) {
  const { year, month, day } = seoulDateParts(Date.now());
  const [hour, minute] = time.split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day - daysAgo, hour - 9, minute)).toISOString();
}

function formatEntryDate(entry, now = Date.now()) {
  const timestamp = Date.parse(entry.createdAt);
  if (!Number.isFinite(timestamp)) {
    return `날짜 미상 · ${entry.time || "시각 미상"}`;
  }

  const entryParts = seoulDateParts(timestamp);
  const nowParts = seoulDateParts(now);
  const daysAgo = Math.max(0, seoulCalendarDay(now) - seoulCalendarDay(timestamp));
  let dateLabel;

  if (daysAgo === 0) dateLabel = "오늘";
  else if (daysAgo === 1) dateLabel = "어제";
  else if (daysAgo < 7) dateLabel = `${daysAgo}일 전`;
  else if (daysAgo < 14) dateLabel = "저번 주";
  else if (entryParts.year === nowParts.year) dateLabel = `${entryParts.month}월 ${entryParts.day}일`;
  else dateLabel = `${entryParts.year}년 ${entryParts.month}월 ${entryParts.day}일`;

  return `${dateLabel} · ${seoulTimeFormatter.format(timestamp)}`;
}

sampleEntries.forEach((entry, index) => {
  entry.createdAt = sampleCreatedAt(sampleDayOffsets[index], entry.time);
});

function loadUserEntries() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(stored)) return [];
    return stored.map((entry) => {
      if (entry.createdAt) return entry;
      const legacyTimestamp = Number(String(entry.id || "").replace(/^local-/, ""));
      return Number.isFinite(legacyTimestamp) && legacyTimestamp > 0
        ? { ...entry, createdAt: new Date(legacyTimestamp).toISOString() }
        : entry;
    });
  } catch {
    return [];
  }
}

function clearRetiredEntries() {
  try {
    localStorage.removeItem(RETIRED_STORAGE_KEY);
  } catch {
    // The archive still starts empty when browser storage is unavailable.
  }
}

function loadView() {
  try {
    return localStorage.getItem(VIEW_KEY) === "desk" ? "desk" : "map";
  } catch {
    return "map";
  }
}

function applyWeatherState(payload = {}) {
  const state = Object.hasOwn(weatherCopy, payload.state) ? payload.state : "dry";
  document.body.dataset.weatherState = state;
  weatherMessage.textContent = weatherCopy[state].message;
  composeLabels.forEach((label) => {
    label.textContent = weatherCopy[state].action;
  });
  weatherFormTitle.textContent = weatherCopy[state].formTitle;
  weatherFormDescription.textContent = weatherCopy[state].formDescription;
  weatherCredit.hidden = payload.source !== "KMA";
}

async function loadWeatherState() {
  const previewState = new URLSearchParams(window.location.search).get("weather");
  const localPreview = window.location.protocol === "file:"
    || window.location.hostname === "localhost"
    || window.location.hostname === "127.0.0.1";
  if (localPreview && Object.hasOwn(weatherCopy, previewState)) {
    applyWeatherState({ state: previewState });
    return;
  }

  if (window.location.protocol === "file:") {
    applyWeatherState({ state: "dry" });
    return;
  }

  try {
    const response = await fetch("/api/weather", {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error("weather unavailable");
    applyWeatherState(await response.json());
  } catch {
    applyWeatherState({ state: "dry" });
  }
}

function allEntries() {
  return [...userEntries, ...sampleEntries];
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function makeMeta(entry) {
  const meta = makeElement("p", "entry-meta");
  [entry.district, entry.place || "장소 미기재", formatEntryDate(entry), entry.rain].forEach((value) => {
    meta.append(makeElement("span", "", value));
  });
  if (entry.sample) meta.append(makeElement("span", "sample-mark", "샘플 기록"));
  if (entry.status === "pending") meta.append(makeElement("span", "pending-mark", "검수 대기"));
  return meta;
}

function makePhoto(entry, className = "archive-photo") {
  const figure = makeElement("figure", className);
  if (entry.photo || entry.illustration) {
    const image = document.createElement("img");
    image.src = entry.photo || entry.illustration;
    image.alt = entry.photo
      ? `${entry.place || entry.district}에서 기록과 함께 올린 사진`
      : `${entry.place || entry.district} 기록에 선택한 기록용 삽화`;
    image.loading = "lazy";
    figure.append(image);
    if (entry.illustration && !entry.photo) figure.classList.add("archive-photo--illustration");
  } else {
    figure.classList.add("archive-photo--placeholder");
    figure.setAttribute("aria-label", "사진 없이 남긴 기록");
  }
  return figure;
}

function makeEntryRow(entry) {
  const button = makeElement("button", "entry-row");
  button.type = "button";
  button.id = entry.id;
  button.dataset.entryId = entry.id;
  button.setAttribute("aria-pressed", String(entry.id === selectedEntryId));

  const top = makeElement("span", "entry-row__top");
  const stateText = entry.status === "pending"
    ? `${formatEntryDate(entry)} · 검수 대기`
    : `${formatEntryDate(entry)} · ${entry.rain}`;
  top.append(makeElement("span", "entry-row__district", entry.district), makeElement("span", "", stateText));
  button.append(top, makeElement("strong", "", entry.title), makeElement("span", "entry-row__place", entry.place || "장소 미기재"));
  return button;
}

function makeReaderVisual(entry) {
  const figure = makeElement("figure", "reader-visual");
  if (entry.photo || entry.illustration) {
    const image = document.createElement("img");
    image.src = entry.photo || entry.illustration;
    image.alt = entry.photo
      ? `${entry.place || entry.district}에서 기록과 함께 올린 사진`
      : `${entry.place || entry.district} 기록에 선택한 과슈 삽화`;
    figure.append(image);
    if (entry.illustration && !entry.photo) {
      figure.classList.add("reader-visual--illustration");
    }
  } else {
    figure.classList.add("reader-visual--empty");
    figure.setAttribute("aria-label", "사진 없이 남긴 기록");
    figure.append(makeElement("span", "", "사진 없이 남긴 기록"));
  }
  return figure;
}

function renderDeskReader(entry) {
  deskReader.replaceChildren();
  if (!entry) {
    const empty = makeElement("div", "reader-empty");
    empty.append(makeElement("p", "", "선택한 조건에 기록이 없습니다."));
    const action = makeElement("button", "text-action", "첫 장면 남기기 ↗");
    action.type = "button";
    action.dataset.openCompose = "";
    action.addEventListener("click", openCompose);
    empty.append(action);
    deskReader.append(empty);
    return;
  }

  const copy = makeElement("div", "reader-copy");
  const backButton = makeElement("button", "mobile-reader-back", "← 목록");
  backButton.type = "button";
  backButton.addEventListener("click", closeMobileReader);
  copy.append(backButton);
  copy.append(makeMeta(entry));
  copy.append(makeElement("h2", "", entry.title));
  copy.append(makeElement("p", "reader-story", entry.excerpt));
  const readerTag = entry.status === "pending" ? "관리자 검수 대기 · 이 브라우저에만 저장됨" : entry.tag || "시민 기록";
  copy.append(makeElement("p", "reader-tag", readerTag));
  deskReader.append(makeReaderVisual(entry), copy);
}

function filteredEntries() {
  const selectedDistrict = districtFilter.value;
  return allEntries().filter((entry) => {
    const matchesRain = activeRain === "all" || entry.rain === activeRain;
    const matchesDistrict = selectedDistrict === "all" || entry.district === selectedDistrict;
    return matchesRain && matchesDistrict;
  });
}

function renderArchive() {
  const entries = filteredEntries();
  if (entries.length > 0 && !entries.some((entry) => entry.id === selectedEntryId)) {
    selectedEntryId = entries[0].id;
  }
  archiveGrid.replaceChildren(...entries.map(makeEntryRow));
  archiveGrid.hidden = entries.length === 0;
  emptyState.hidden = entries.length !== 0;
  resultCount.textContent = `${entries.length}개의 기록`;
  renderDeskReader(entries.find((entry) => entry.id === selectedEntryId));
}

function districtCounts() {
  const counts = allEntries().reduce((result, entry) => {
    result[entry.district] = (result[entry.district] || 0) + 1;
    return result;
  }, {});
  return counts;
}

function renderRainMap() {
  const counts = districtCounts();
  const riverLabel = rainMap.querySelector(".river-label");
  const districtButtons = districts.map((district) => {
    const button = makeElement("button", "map-district");
    const [column, row] = districtMapLayout[district];
    const count = counts[district] || 0;
    button.type = "button";
    button.dataset.mapDistrict = district;
    button.style.setProperty("--map-column", column);
    button.style.setProperty("--map-row", row);
    button.setAttribute("aria-pressed", String(district === selectedMapDistrict));
    button.setAttribute("aria-label", `${district}, 기록 ${count}개`);
    const shortDistrict = district.endsWith("구") ? district.slice(0, -1) : district;
    button.append(makeElement("span", "", shortDistrict), makeElement("strong", "", String(count)));
    return button;
  });
  rainMap.replaceChildren(riverLabel, ...districtButtons);
}

function renderMapReaderInto(target, options = {}) {
  target.replaceChildren();
  if (!selectedMapDistrict) return;

  const entries = allEntries().filter((entry) => entry.district === selectedMapDistrict);
  const head = makeElement("div", "map-reader__head");
  head.append(makeElement("p", "", "선택한 지역"), makeElement("h2", "", selectedMapDistrict), makeElement("span", "", `${entries.length}개의 기록`));
  if (options.mobile) {
    const closeButton = makeElement("button", "map-sheet__close", "닫기");
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "지역 기록 닫기");
    closeButton.addEventListener("click", closeMobileMapSheet);
    head.append(closeButton);
  }
  target.append(head);

  if (entries.length === 0) {
    const empty = makeElement("div", "map-reader__empty");
    empty.append(makeElement("p", "", "아직 이 지역에서 도착한 기록이 없습니다."));
    const action = makeElement("button", "text-action", "첫 기록 남기기 ↗");
    action.type = "button";
    action.addEventListener("click", () => {
      if (options.mobile) dismissMapSheetForCompose();
      openCompose();
    });
    empty.append(action);
    target.append(empty);
    return;
  }

  const list = makeElement("div", "map-entry-list");
  entries.forEach((entry) => {
    const article = makeElement("article", "map-entry");
    const button = makeElement("button", "map-entry__action", "데스크에서 읽기 →");
    button.type = "button";
    button.dataset.mapEntryId = entry.id;
    article.append(makeElement("span", "", `${formatEntryDate(entry)} · ${entry.rain}`), makeElement("strong", "", entry.title), makeElement("p", "", entry.excerpt), button);
    list.append(article);
  });
  target.append(list);
}

function renderMapReader() {
  renderMapReaderInto(mapReader);
  renderMapReaderInto(mapSheetContent, { mobile: true });
}

function replaceMobileMapState(district = null) {
  const state = { ...(window.history.state || {}), archiveView: "map" };
  delete state[MOBILE_ENTRY_STATE];
  if (district) state[MOBILE_MAP_STATE] = district;
  else delete state[MOBILE_MAP_STATE];
  window.history.replaceState(state, "");
}

function openMobileMapSheet(district, options = {}) {
  if (!mobileViewport.matches || !districts.includes(district)) return;
  selectedMapDistrict = district;
  renderRainMap();
  renderMapReader();

  if (options.pushHistory !== false) {
    replaceMobileMapState();
    window.history.pushState({ ...(window.history.state || {}), archiveView: "map", [MOBILE_MAP_STATE]: district }, "");
  }

  if (!mapSheet.open) mapSheet.showModal();
  requestAnimationFrame(() => {
    const focusTarget = mapSheetContent.querySelector(".map-entry__action")
      || mapSheetContent.querySelector(".map-reader__empty .text-action")
      || mapSheetContent.querySelector(".map-sheet__close");
    focusTarget?.focus({ preventScroll: true });
  });
}

function closeMobileMapSheet(options = {}) {
  if (options.history !== false && window.history.state?.[MOBILE_MAP_STATE]) {
    window.history.back();
    return;
  }
  if (mapSheet.open) mapSheet.close();
  selectedMapDistrict = null;
  renderRainMap();
  renderMapReader();
}

function dismissMapSheetForCompose() {
  replaceMobileMapState();
  closeMobileMapSheet({ history: false });
}

function setMobileDeskPanel(panel, options = {}) {
  const target = panel === "detail" ? "detail" : "list";
  deskWorkspace.dataset.mobilePanel = target;
  if (!mobileViewport.matches || !options.focus) return;

  requestAnimationFrame(() => {
    const focusTarget = target === "detail"
      ? deskReader.querySelector(".mobile-reader-back")
      : document.getElementById(selectedEntryId);
    focusTarget?.focus({ preventScroll: true });
  });
}

function pushMobileEntryState(entryId, originView) {
  if (!mobileViewport.matches) return;
  const baseState = { ...(window.history.state || {}), archiveView: originView };
  delete baseState[MOBILE_ENTRY_STATE];
  window.history.replaceState(baseState, "");
  window.history.pushState({ ...baseState, archiveView: "desk", [MOBILE_ENTRY_STATE]: entryId }, "");
}

function replaceMobileViewState(view) {
  if (!mobileViewport.matches) return;
  const state = { ...(window.history.state || {}), archiveView: view };
  delete state[MOBILE_ENTRY_STATE];
  delete state[MOBILE_MAP_STATE];
  window.history.replaceState(state, "");
}

function closeMobileReader() {
  if (mobileViewport.matches && window.history.state?.[MOBILE_ENTRY_STATE]) {
    window.history.back();
    return;
  }
  setMobileDeskPanel("list", { focus: true });
}

function setView(view, options = {}) {
  activeView = view === "map" ? "map" : "desk";
  if (activeView !== "map" && mapSheet.open) mapSheet.close();
  if (mobileViewport.matches && activeView === "map" && options.resetMapSelection) {
    selectedMapDistrict = null;
  }
  viewPanels.forEach((panel) => {
    panel.hidden = panel.dataset.viewPanel !== activeView;
  });
  viewButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.view === activeView));
  });
  if (options.persist !== false) {
    try {
      localStorage.setItem(VIEW_KEY, activeView);
    } catch {
      // The view still changes when browser storage is unavailable.
    }
  }

  if (mobileViewport.matches) {
    setMobileDeskPanel(activeView === "desk" ? options.mobilePanel : "list", {
      focus: options.focusMobile,
    });
  }

  if (activeView === "map") {
    renderRainMap();
    renderMapReader();
  }
}

function populateDistrictSelects() {
  districts.forEach((district) => {
    const filterOption = makeElement("option", "", district);
    filterOption.value = district;
    districtFilter.append(filterOption);

    const formOption = makeElement("option", "", district);
    formOption.value = district;
    document.querySelector("#entry-district").append(formOption);
  });
}

function setPageInert(value) {
  pageRegions.forEach((region) => {
    if (region) region.inert = value;
  });
}

function openCompose() {
  setPageInert(true);
  composeDialog.showModal();
  requestAnimationFrame(() => document.querySelector("#entry-title").focus());
}

function closeCompose() {
  composeDialog.close();
  setPageInert(false);
}

function helperFor(field) {
  return field.closest(".field")?.querySelector(".field-help");
}

function fieldError(field) {
  if (field.validity.valueMissing) {
    const messages = {
      title: "제목이 비어 있습니다. 장면을 떠올릴 짧은 제목을 적어주세요.",
      district: "서울의 구가 선택되지 않았습니다. 기록이 머문 구를 골라주세요.",
      rain: "비의 상태가 선택되지 않았습니다. 가장 가까운 상태를 골라주세요.",
      story: "장면이 비어 있습니다. 기억에 남은 순간을 20자 이상 적어주세요.",
    };
    return messages[field.name] || "필수 항목이 비어 있습니다. 내용을 확인해주세요.";
  }
  if (field.validity.tooShort) {
    return "장면이 너무 짧습니다. 기억에 남은 순간을 20자 이상 적어주세요.";
  }
  return "";
}

function validateField(field) {
  const helper = helperFor(field);
  const error = fieldError(field);
  field.setAttribute("aria-invalid", String(Boolean(error)));
  if (helper) {
    if (!helper.dataset.original) helper.dataset.original = helper.textContent;
    helper.textContent = error || helper.dataset.original;
    helper.dataset.state = error ? "error" : "default";
  }
  field.dataset.state = error ? "error" : field.value ? "success" : "default";
  return !error;
}

function clearValidation() {
  composeForm.querySelectorAll("input, select, textarea").forEach((field) => {
    field.removeAttribute("aria-invalid");
    field.dataset.state = "default";
    field.dataset.touched = "false";
    const helper = helperFor(field);
    if (helper?.dataset.original) helper.textContent = helper.dataset.original;
    if (helper) helper.dataset.state = "default";
  });
}

function setIllustrationAvailability(suppressed) {
  illustrationPicker.dataset.state = suppressed ? "suppressed" : "active";
  illustrationPicker.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.disabled = suppressed;
  });
}

function compressPhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("사진을 읽지 못했습니다."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("지원하지 않는 사진입니다."));
      image.onload = () => {
        const maxSide = 1200;
        const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.naturalWidth * scale);
        canvas.height = Math.round(image.naturalHeight * scale);
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", 0.78));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function resetComposer() {
  composeForm.reset();
  pendingPhoto = null;
  photoPreview.hidden = true;
  photoPreview.removeAttribute("src");
  photoDrop.dataset.state = "default";
  setIllustrationAvailability(false);
  formStatus.textContent = "";
  formStatus.dataset.state = "default";
  saveEntryButton.dataset.state = "default";
  saveEntryButton.disabled = false;
  clearValidation();
}

document.querySelectorAll("[data-open-compose]").forEach((button) => {
  button.addEventListener("click", openCompose);
});

document.querySelector("#close-dialog").addEventListener("click", closeCompose);
document.querySelector("#cancel-dialog").addEventListener("click", closeCompose);

composeDialog.addEventListener("click", (event) => {
  if (event.target === composeDialog) closeCompose();
});

composeDialog.addEventListener("close", () => setPageInert(false));

rainFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeRain = button.dataset.rain;
    rainFilterButtons.forEach((candidate) => {
      candidate.setAttribute("aria-pressed", String(candidate === button));
    });
    renderArchive();
  });
});

districtFilter.addEventListener("change", renderArchive);

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    replaceMobileViewState(button.dataset.view);
    setView(button.dataset.view, { mobilePanel: "list", resetMapSelection: true });
  });
});

archiveGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-entry-id]");
  if (!button) return;
  selectedEntryId = button.dataset.entryId;
  renderArchive();
  if (mobileViewport.matches) {
    pushMobileEntryState(selectedEntryId, "desk");
    setMobileDeskPanel("detail", { focus: true });
  }
});

rainMap.addEventListener("click", (event) => {
  const button = event.target.closest("[data-map-district]");
  if (!button) return;
  if (mobileViewport.matches) {
    openMobileMapSheet(button.dataset.mapDistrict);
    return;
  }
  selectedMapDistrict = button.dataset.mapDistrict;
  renderRainMap();
  renderMapReader();
});

function handleMapReaderClick(event) {
  const button = event.target.closest("[data-map-entry-id]");
  if (!button) return;
  selectedEntryId = button.dataset.mapEntryId;
  activeRain = "all";
  districtFilter.value = selectedMapDistrict;
  rainFilterButtons.forEach((candidate) => {
    candidate.setAttribute("aria-pressed", String(candidate.dataset.rain === "all"));
  });
  renderArchive();
  if (mobileViewport.matches) {
    if (mapSheet.open) mapSheet.close();
    pushMobileEntryState(selectedEntryId, "map");
    setView("desk", { mobilePanel: "detail", focusMobile: true });
  } else {
    setView("desk");
    document.getElementById(selectedEntryId)?.focus({ preventScroll: true });
  }
}

mapReader.addEventListener("click", handleMapReaderClick);
mapSheetContent.addEventListener("click", handleMapReaderClick);

mapSheet.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeMobileMapSheet();
});

mapSheet.addEventListener("click", (event) => {
  if (event.target === mapSheet) closeMobileMapSheet();
});

window.addEventListener("popstate", (event) => {
  if (!mobileViewport.matches) return;
  const entryId = event.state?.[MOBILE_ENTRY_STATE];

  if (entryId && allEntries().some((entry) => entry.id === entryId)) {
    selectedEntryId = entryId;
    renderArchive();
    setView("desk", { mobilePanel: "detail", focusMobile: true, persist: false });
    return;
  }

  const mapDistrict = event.state?.[MOBILE_MAP_STATE];
  if (mapDistrict && districts.includes(mapDistrict)) {
    setView("map", { persist: false });
    openMobileMapSheet(mapDistrict, { pushHistory: false });
    return;
  }

  const previousView = event.state?.archiveView === "map" ? "map" : "desk";
  if (previousView === "map") closeMobileMapSheet({ history: false });
  setView(previousView, { mobilePanel: "list", persist: false });
  if (previousView === "desk") setMobileDeskPanel("list", { focus: true });
});

mobileViewport.addEventListener("change", (event) => {
  if (event.matches) {
    closeMobileMapSheet({ history: false });
  } else {
    if (mapSheet.open) mapSheet.close();
    if (!selectedMapDistrict) selectedMapDistrict = "용산구";
    renderRainMap();
    renderMapReader();
  }
});

composeForm.querySelectorAll("input[required], select[required], textarea[required]").forEach((field) => {
  field.addEventListener("blur", () => {
    field.dataset.touched = "true";
    validateField(field);
  });
  field.addEventListener("input", () => {
    if (field.dataset.touched === "true") validateField(field);
  });
  field.addEventListener("change", () => {
    if (field.dataset.touched === "true") validateField(field);
  });
});

photoInput.addEventListener("change", async () => {
  const file = photoInput.files?.[0];
  pendingPhoto = null;
  photoDrop.dataset.state = "default";
  setIllustrationAvailability(false);
  photoPreview.hidden = true;
  formStatus.textContent = "";
  formStatus.dataset.state = "default";
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    formStatus.textContent = "사진 형식이 아닙니다. JPG, PNG 또는 WEBP 파일을 골라주세요.";
    formStatus.dataset.state = "error";
    photoDrop.dataset.state = "error";
    photoInput.value = "";
    return;
  }

  if (file.size > MAX_PHOTO_BYTES) {
    formStatus.textContent = "사진이 8 MB보다 큽니다. 더 작은 파일을 골라주세요.";
    formStatus.dataset.state = "error";
    photoDrop.dataset.state = "error";
    photoInput.value = "";
    return;
  }

  try {
    photoDrop.dataset.state = "loading";
    pendingPhoto = await compressPhoto(file);
    photoPreview.src = pendingPhoto;
    photoPreview.hidden = false;
    photoDrop.dataset.state = "success";
    setIllustrationAvailability(true);
  } catch (error) {
    formStatus.textContent = `${error.message} 다른 사진을 골라주세요.`;
    formStatus.dataset.state = "error";
    photoDrop.dataset.state = "error";
    photoInput.value = "";
  }
});

composeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const requiredFields = [...composeForm.querySelectorAll("input[required], select[required], textarea[required]")];
  const validations = requiredFields.map((field) => {
    field.dataset.touched = "true";
    return validateField(field);
  });
  const valid = validations.every(Boolean);

  if (!valid) {
    formStatus.textContent = "비어 있거나 짧은 항목이 있습니다. 표시된 내용을 확인해주세요.";
    formStatus.dataset.state = "error";
    requiredFields.find((field) => field.getAttribute("aria-invalid") === "true")?.focus();
    return;
  }

  saveEntryButton.disabled = true;
  saveEntryButton.dataset.state = "loading";
  const data = new FormData(composeForm);
  const now = new Date();
  const entry = {
    id: `local-${now.getTime()}`,
    district: data.get("district"),
    place: String(data.get("place") || "").trim(),
    title: String(data.get("title")).trim(),
    excerpt: String(data.get("story")).trim(),
    time: new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(now),
    createdAt: now.toISOString(),
    rain: data.get("rain"),
    tag: "시민 기록",
    sample: false,
    photo: pendingPhoto,
    illustration: pendingPhoto ? null : data.get("illustration"),
    status: "pending",
  };

  userEntries.unshift(entry);
  let storageWarning = "";
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userEntries));
  } catch {
    storageWarning = "사진 용량 때문에 이 기록은 새로고침 후 유지되지 않을 수 있습니다.";
  }

  activeRain = "all";
  selectedEntryId = entry.id;
  selectedMapDistrict = entry.district;
  districtFilter.value = "all";
  rainFilterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.rain === "all"));
  });
  renderArchive();
  renderRainMap();
  renderMapReader();
  if (mobileViewport.matches) {
    pushMobileEntryState(entry.id, "desk");
    setView("desk", { mobilePanel: "detail", focusMobile: true });
  } else {
    setView("desk");
  }
  closeCompose();

  const savedCard = document.getElementById(entry.id);
  if (!mobileViewport.matches) {
    savedCard?.focus({ preventScroll: true });
    savedCard?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
    });
  }
  resultCount.textContent = storageWarning || "검수 대기함에 저장되었습니다. 이 브라우저에만 보관됩니다.";
  resetComposer();
});

populateDistrictSelects();
renderArchive();
renderRainMap();
renderMapReader();
setView(activeView);
replaceMobileViewState(activeView);
loadWeatherState();
