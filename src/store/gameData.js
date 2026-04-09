// 초기 퀘스트 데이터
export const INITIAL_QUESTS = {
  morning: [
    { id: 'wake', title: '일어나서 아침인사', exp: 10, emoji: '☀️', completed: false },
    { id: 'eat', title: '밥 먹기', exp: 15, emoji: '🍚', completed: false },
    { id: 'wash', title: '세수하고 양치질하기', exp: 15, emoji: '🪥', completed: false },
    { id: 'dress', title: '스스로 옷 입기', exp: 20, emoji: '👕', completed: false },
    { id: 'bottle', title: '물병 챙기기', exp: 10, emoji: '💧', completed: false },
  ],
  afternoon: [
    { id: 'shower', title: '집에 오면 바로 샤워하기', exp: 35, emoji: '🚿', completed: false, priority: true },
    { id: 'laundry', title: '옷 빨래통에 넣기', exp: 25, emoji: '🧺', completed: false },
    { id: 'math', title: '수학 숙제하기', exp: 25, emoji: '📐', completed: false },
    { id: 'english', title: '영어 숙제하기', exp: 25, emoji: '📚', completed: false },
    { id: 'read', title: '책 읽기', exp: 35, emoji: '📖', completed: false, priority: true },
    { id: 'shot', title: '주사 맞기', exp: 25, emoji: '💉', completed: false },
    { id: 'brush', title: '자기 전 양치질', exp: 15, emoji: '🦷', completed: false },
    { id: 'bag', title: '내일 등교 가방 싸기', exp: 20, emoji: '🎒', completed: false },
    { id: 'sleep', title: '10시에 자러가기', exp: 30, emoji: '🌙', completed: false },
  ],
};

// 레벨 시스템
export const LEVEL_CONFIG = [
  { level: 1, minExp: 0, title: '견습 용사', equipment: 'none' },
  { level: 2, minExp: 200, title: '초보 용사', equipment: 'none' },
  { level: 3, minExp: 500, title: '방패 용사', equipment: 'shield' },
  { level: 4, minExp: 900, title: '방패 용사', equipment: 'shield' },
  { level: 5, minExp: 1400, title: '검사', equipment: 'sword' },
  { level: 6, minExp: 2000, title: '검사', equipment: 'sword' },
  { level: 7, minExp: 2700, title: '철갑 용사', equipment: 'armor' },
  { level: 8, minExp: 3500, title: '철갑 용사', equipment: 'armor' },
  { level: 9, minExp: 4400, title: '철갑 용사', equipment: 'armor' },
  { level: 10, minExp: 5400, title: '강철 기사', equipment: 'armor' },
  { level: 15, minExp: 12000, title: '용맹한 기사', equipment: 'fullarmor' },
  { level: 20, minExp: 22000, title: '전설의 용사', equipment: 'legend' },
  { level: 25, minExp: 35000, title: '빛의 수호자', equipment: 'legend' },
  { level: 30, minExp: 50000, title: '전설의 영웅', equipment: 'legend' },
];

export function getLevel(totalExp) {
  let currentLevel = LEVEL_CONFIG[0];
  for (const config of LEVEL_CONFIG) {
    if (totalExp >= config.minExp) {
      currentLevel = config;
    } else {
      break;
    }
  }
  return currentLevel;
}

export function getNextLevel(totalExp) {
  for (let i = 0; i < LEVEL_CONFIG.length - 1; i++) {
    if (totalExp < LEVEL_CONFIG[i + 1].minExp) {
      return LEVEL_CONFIG[i + 1];
    }
  }
  return LEVEL_CONFIG[LEVEL_CONFIG.length - 1];
}

// 상시(보너스) 퀘스트 — 매일 리셋, 언제든 완료 가능
export const INITIAL_BONUS_QUESTS = [
  { id: 'play_sibling', title: '동생이랑 놀아주기',           exp: 40, emoji: '🧸', completed: false },
  { id: 'clean_room',   title: '방 정리하기',                 exp: 40, emoji: '🧹', completed: false },
  { id: 'help_meal',    title: '식사 준비 도와주기',           exp: 25, emoji: '🍳', completed: false },
  { id: 'dish',         title: '다 먹은 그릇 싱크대에 갖다놓기', exp: 25, emoji: '🍽️', completed: false },
];

// === 특별 지역 시스템 ===
export const MAP_REGIONS = [
  {
    id: 'hestou', name: '헤스투 숲', emoji: '🌲',
    desc: '코로그들이 사는 신비한 숲',
    unlockWeeks: [1, 2], unlockRate: 0.7,
    item: { id: 'korogSeed', name: '코로그 씨앗', emoji: '🌰' },
    monster: { name: '복블린', type: 'bokoblin', maxHp: 5, defeatExp: 20 },
  },
  {
    id: 'kakariko', name: '카카리코 마을', emoji: '🏘️',
    desc: '쉐이카족이 사는 조용한 마을',
    unlockWeeks: [3, 4], unlockRate: 0.7,
    item: { id: 'hyruleApple', name: '하이랄 사과', emoji: '🍎' },
    monster: { name: '스탈포스', type: 'stalfos', maxHp: 8, defeatExp: 35 },
  },
  {
    id: 'zora', name: '조라의 영역', emoji: '💧',
    desc: '조라족이 사는 물의 도시',
    unlockWeeks: [5, 6], unlockRate: 0.7,
    item: { id: 'hyrulePike', name: '하이랄 농어', emoji: '🐟' },
    bonus: 'fishing',
    monster: { name: '리자포스', type: 'lizalfos', maxHp: 10, defeatExp: 50 },
  },
  {
    id: 'goron', name: '거론 시티', emoji: '🔥',
    desc: '거론족이 사는 화산 도시',
    unlockWeeks: [7, 8], unlockRate: 0.7,
    item: { id: 'ruby', name: '루비 광석', emoji: '💎' },
    monster: { name: '파이어 와이조바', type: 'fireWizzrobe', maxHp: 12, defeatExp: 70 },
  },
  {
    id: 'rito', name: '리토 마을', emoji: '🪶',
    desc: '리토족이 사는 하늘 마을',
    unlockWeeks: [9, 10], unlockRate: 0.7,
    item: { id: 'eagleFeather', name: '독수리 깃털', emoji: '🪶' },
    monster: { name: '윙드 라이넬', type: 'wingedLynel', maxHp: 15, defeatExp: 100 },
  },
  {
    id: 'hyrule', name: '하이랄 성', emoji: '⚔️',
    desc: '최후의 결전이 펼쳐지는 하이랄 성',
    unlockCondition: 'fullMonth',
    item: { id: 'masterSword', name: '마스터 소드', emoji: '⚔️' },
    monster: { name: '가논', type: 'ganon', maxHp: 30, defeatExp: 300, special: 'reduceGoal' },
  },
];

// === 요리 레시피 ===
export const RECIPES = [
  {
    id: 'heartRecovery', name: '하트 회복 요리', emoji: '❤️',
    desc: '미완료 퀘스트 1개 자동 완료',
    note: '부모님 승인 필요',
    ingredients: [{ id: 'hyruleApple', emoji: '🍎', name: '하이랄 사과', count: 2 }],
    requiresApproval: true, effect: 'questSkip',
  },
  {
    id: 'staminaDish', name: '스태미나 요리', emoji: '💚',
    desc: '오전 4/5 완료해도 소닉 보너스 적용 (당일)',
    ingredients: [
      { id: 'hyrulePike', emoji: '🐟', name: '하이랄 농어', count: 1 },
      { id: 'korogSeed', emoji: '🌰', name: '코로그 씨앗', count: 1 },
    ],
    requiresApproval: false, effect: 'sonicEase',
  },
  {
    id: 'defenseDish', name: '방어력 요리', emoji: '🛡️',
    desc: '즉시 +20 EXP 획득',
    ingredients: [{ id: 'ruby', emoji: '💎', name: '루비 광석', count: 1 }],
    requiresApproval: false, effect: 'bonusExp', effectValue: 20,
  },
  {
    id: 'windDish', name: '바람의 요리', emoji: '🌬️',
    desc: '내일 모든 퀘스트 EXP 1.5배',
    ingredients: [{ id: 'eagleFeather', emoji: '🪶', name: '독수리 깃털', count: 2 }],
    requiresApproval: false, effect: 'expMultiplier',
  },
];

// 초기 게임 상태
export const INITIAL_STATE = {
  totalExp: 0,
  weeklyExp: 0,
  lastWeekExp: 0,
  questsLog: {},
  weeklyStats: {},
  roomItems: [],
  coupons: [],
  mapFog: Array(25).fill(true),
  parentPassword: '1234',
  cheerMessages: [],
  notifications: [],
  // === 지역/몬스터/인벤토리 ===
  gameStartDate: null,
  unlockedRegions: [],
  pendingUnlockPopup: [],
  monsters: {},           // { regionId: { currentHp, defeated, streakBonusDate } }
  inventory: { korogSeed: 0, hyruleApple: 0, hyrulePike: 0, ruby: 0, eagleFeather: 0, masterSword: false },
  activeBuffs: [],        // [{ effect, date }]
  pendingRecipes: [],     // 부모 승인 대기 [{ pendingId, recipeId, requestedAt }]
  fishingUnlocked: false,
  lastFishingDate: null,
  goalExpBonus: 0,        // 가논 처치 시 목표 EXP 감소
};

// localStorage 키
const STORAGE_KEY = 'jihoo-quest-v1';

export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { ...INITIAL_STATE };
    const parsed = JSON.parse(saved);
    return {
      ...INITIAL_STATE,
      ...parsed,
      // 중첩 객체는 깊은 머지: 새 필드가 누락된 경우 초기값으로 보완
      inventory: { ...INITIAL_STATE.inventory, ...(parsed.inventory || {}) },
      monsters:  { ...(parsed.monsters  || {}) },
      weeklyStats: { ...(parsed.weeklyStats || {}) },
      // 배열 필드는 저장된 값 우선, 없으면 초기값
      mapFog:           Array.isArray(parsed.mapFog)           ? parsed.mapFog           : [...INITIAL_STATE.mapFog],
      roomItems:        Array.isArray(parsed.roomItems)        ? parsed.roomItems        : [],
      coupons:          Array.isArray(parsed.coupons)          ? parsed.coupons          : [],
      notifications:    Array.isArray(parsed.notifications)    ? parsed.notifications    : [],
      unlockedRegions:  Array.isArray(parsed.unlockedRegions)  ? parsed.unlockedRegions  : [],
      pendingUnlockPopup: Array.isArray(parsed.pendingUnlockPopup) ? parsed.pendingUnlockPopup : [],
      activeBuffs:      Array.isArray(parsed.activeBuffs)      ? parsed.activeBuffs      : [],
      pendingRecipes:   Array.isArray(parsed.pendingRecipes)   ? parsed.pendingRecipes   : [],
      cheerMessages:    Array.isArray(parsed.cheerMessages)    ? parsed.cheerMessages    : [],
    };
  } catch {
    return { ...INITIAL_STATE };
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('저장 실패:', e);
  }
}

// 오늘 날짜 키 반환
export function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

// 이번 주 키 반환
export function getWeekKey() {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

// 앱 사용 주차 (gameStartDate 기준)
export function getCurrentAppWeek(gameStartDate) {
  if (!gameStartDate) return 1;
  const start = new Date(gameStartDate);
  start.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((now - start) / 86400000);
  return Math.floor(diffDays / 7) + 1;
}

// 주차별 퀘스트 달성률 계산
export function getWeeklyCompletionRates(questsLog, gameStartDate) {
  if (!gameStartDate || !questsLog || typeof questsLog !== 'object') return {};
  const startDate = new Date(gameStartDate);
  startDate.setHours(0, 0, 0, 0);
  const weekData = {};

  for (const [dateStr, dayLog] of Object.entries(questsLog)) {
    if (!dayLog || typeof dayLog !== 'object') continue;
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((date - startDate) / 86400000);
    if (diffDays < 0) continue;
    const appWeek = Math.floor(diffDays / 7) + 1;

    const morning   = dayLog.morning   || [];
    const afternoon = dayLog.afternoon || [];
    const total     = morning.length + afternoon.length;
    if (total === 0) continue;
    const completed = morning.filter(q => q.completed).length + afternoon.filter(q => q.completed).length;

    if (!weekData[appWeek]) weekData[appWeek] = { total: 0, completed: 0 };
    weekData[appWeek].total     += total;
    weekData[appWeek].completed += completed;
  }

  const rates = {};
  for (const [week, data] of Object.entries(weekData)) {
    rates[Number(week)] = data.total > 0 ? data.completed / data.total : 0;
  }
  return rates;
}

// 지난 30일 개근 여부
export function checkFullMonthAttendance(questsLog) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayLog = questsLog[dateStr];
    if (!dayLog) return false;
    const done = [...(dayLog.morning || []), ...(dayLog.afternoon || [])].filter(q => q.completed).length;
    if (done === 0) return false;
  }
  return true;
}

// 잠금 해제 가능한 지역 목록 반환
export function checkRegionUnlocks(state) {
  const { unlockedRegions = [], questsLog, gameStartDate } = state;
  if (!gameStartDate) return [];
  const weekRates   = getWeeklyCompletionRates(questsLog, gameStartDate);
  const currentWeek = getCurrentAppWeek(gameStartDate);
  const toUnlock    = [];

  for (const region of MAP_REGIONS) {
    if (unlockedRegions.includes(region.id)) continue;
    if (region.unlockCondition === 'fullMonth') {
      if (checkFullMonthAttendance(questsLog)) toUnlock.push(region.id);
    } else if (region.unlockWeeks) {
      const [w1, w2] = region.unlockWeeks;
      if (currentWeek < w2) continue;
      const rate1 = weekRates[w1] ?? 0;
      const rate2 = weekRates[w2] ?? 0;
      if (rate1 >= region.unlockRate && rate2 >= region.unlockRate) toUnlock.push(region.id);
    }
  }
  return toUnlock;
}

// 현재 활성 몬스터 반환 (가장 최근 언락된 미처치 몬스터)
export function getActiveMonster(state) {
  const { unlockedRegions = [], monsters = {} } = state;
  for (let i = unlockedRegions.length - 1; i >= 0; i--) {
    const regionId = unlockedRegions[i];
    const region   = MAP_REGIONS.find(r => r.id === regionId);
    if (!region?.monster) continue;
    const ms = monsters[regionId];
    if (ms?.defeated) continue;
    const currentHp = ms?.currentHp ?? region.monster.maxHp;
    return { regionId, region, currentHp, ...region.monster };
  }
  return null;
}
