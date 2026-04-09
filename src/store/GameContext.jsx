import { createContext, useContext, useReducer, useEffect } from 'react';
import {
  loadState, saveState, getTodayKey, getWeekKey,
  INITIAL_QUESTS, INITIAL_BONUS_QUESTS, getLevel,
  MAP_REGIONS, RECIPES, checkRegionUnlocks, getActiveMonster,
} from './gameData';

const GameContext = createContext(null);

// ── 헬퍼: 오늘 expMultiplier 버프 활성 여부 ──────────────────
function getExpMultiplier(activeBuffs, todayKey) {
  return activeBuffs?.some(b => b.effect === 'expMultiplier' && b.date === todayKey) ? 1.5 : 1;
}

// ── 헬퍼: sonicEase 버프 활성 여부 ──────────────────────────
function hasSonicEase(activeBuffs, todayKey) {
  return activeBuffs?.some(b => b.effect === 'sonicEase' && b.date === todayKey);
}

// ── 헬퍼: 연속 N일 전체 완료 체크 ───────────────────────────
function getPrevDayFullCount(questsLog, days) {
  const today = new Date();
  let streak = 0;
  for (let i = 1; i <= days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const log = questsLog[key];
    if (!log) break;
    const mFull = (log.morning  || []).every(q => q.completed) && (log.morning  || []).length > 0;
    const aFull = (log.afternoon || []).every(q => q.completed) && (log.afternoon || []).length > 0;
    if (mFull && aFull) streak++;
    else break;
  }
  return streak;
}

// ── 헬퍼: 활성 몬스터 HP 감소 처리 ──────────────────────────
function applyMonsterDamage(state, damage, newLog, todayKey) {
  const active = getActiveMonster({ ...state, questsLog: newLog });
  if (!active) return { monsters: {}, extraExp: 0, goalBonus: 0, defeatNote: [] };

  const currentHp   = Math.max((state.monsters[active.regionId]?.currentHp ?? active.maxHp) - damage, 0);
  const defeated    = currentHp <= 0;
  const monsters    = {
    ...state.monsters,
    [active.regionId]: { currentHp, defeated, streakBonusDate: state.monsters[active.regionId]?.streakBonusDate },
  };

  const extraExp   = defeated ? active.defeatExp : 0;
  const goalBonus  = defeated && active.special === 'reduceGoal' ? 500 : 0;
  const defeatNote = defeated
    ? [{ id: Date.now(), type: 'monster', message: `⚔️ ${active.name} 처치! +${active.defeatExp} EXP`, timestamp: Date.now() }]
    : [];

  return { monsters, extraExp, goalBonus, defeatNote };
}

function gameReducer(state, action) {
  switch (action.type) {

    // ── 퀘스트 완료 ──────────────────────────────────────────
    case 'COMPLETE_QUEST': {
      const { period, questId, exp } = action.payload;
      const todayKey = getTodayKey();
      const weekKey  = getWeekKey();

      const todayLog = state.questsLog[todayKey] || {
        morning:   INITIAL_QUESTS.morning.map(q => ({ ...q })),
        afternoon: INITIAL_QUESTS.afternoon.map(q => ({ ...q })),
        bonus:     INITIAL_BONUS_QUESTS.map(q => ({ ...q })),
      };

      const alreadyDone = todayLog[period].find(q => q.id === questId)?.completed;
      if (alreadyDone) return state;

      const updatedPeriod = todayLog[period].map(q =>
        q.id === questId ? { ...q, completed: true } : q
      );

      // EXP 배율 버프 적용
      const multiplier    = getExpMultiplier(state.activeBuffs, todayKey);
      const earnedExp     = Math.round(exp * multiplier);

      // 소닉 보너스
      let bonusExp    = 0;
      let sonicBonus  = false;
      if (period === 'morning') {
        const threshold   = hasSonicEase(state.activeBuffs, todayKey) ? 4 : updatedPeriod.length;
        const doneCnt     = updatedPeriod.filter(q => q.completed).length;
        const alreadyBonused = todayLog.sonicBonus;
        if (doneCnt >= threshold && !alreadyBonused) {
          // 독수리 깃털 보유 시 소닉 보너스 +10 EXP
          const featherBoost = (state.inventory?.eagleFeather || 0) > 0 ? 10 : 0;
          bonusExp   = 50 + featherBoost;
          sonicBonus = true;
        }
      }

      const newLog = {
        ...state.questsLog,
        [todayKey]: {
          ...todayLog,
          [period]: updatedPeriod,
          sonicBonus: sonicBonus || todayLog.sonicBonus,
        },
      };

      // 몬스터 데미지 (-1, 연속 3일 시 -3 추가)
      let monsterDmg = 1;
      const morningNowFull   = newLog[todayKey].morning.every(q => q.completed);
      const afternoonNowFull = newLog[todayKey].afternoon.every(q => q.completed);
      const activeMonster    = getActiveMonster({ ...state, questsLog: newLog });
      let streakBonusApplied = false;

      if (activeMonster && morningNowFull && afternoonNowFull) {
        const lastStreakDate = state.monsters[activeMonster.regionId]?.streakBonusDate;
        if (lastStreakDate !== todayKey) {
          const streak = getPrevDayFullCount(newLog, 2);
          if (streak >= 2) {
            monsterDmg += 3;
            streakBonusApplied = true;
          }
        }
      }

      const { monsters, extraExp = 0, goalBonus = 0, defeatNote = [] } =
        applyMonsterDamage(state, monsterDmg, newLog, todayKey);

      if (streakBonusApplied && activeMonster && monsters) {
        monsters[activeMonster.regionId] = {
          ...monsters[activeMonster.regionId],
          streakBonusDate: todayKey,
        };
      }

      // 안개 오픈
      const totalCompleted = Object.values(newLog).reduce((acc, day) => {
        if (!day || typeof day !== 'object') return acc;
        return acc + [...(day.morning || []), ...(day.afternoon || []), ...(day.bonus || [])].filter(q => q.completed).length;
      }, 0);
      const newMapFog = [...state.mapFog];
      const toReveal  = Math.min(Math.floor(totalCompleted / 3), 25);
      for (let i = 0; i < toReveal; i++) newMapFog[i] = false;

      // 주간 통계
      const weeklyStats = { ...state.weeklyStats };
      if (!weeklyStats[weekKey]) weeklyStats[weekKey] = { totalExp: 0 };
      weeklyStats[weekKey].totalExp += earnedExp + bonusExp + extraExp;

      const totalGain    = earnedExp + bonusExp + extraExp;
      const sonicNotes   = sonicBonus
        ? [{ id: Date.now() + 1, type: 'sonic', message: `⚡ SONIC BONUS! +${bonusExp} EXP`, timestamp: Date.now() }]
        : [];
      const streakNotes  = streakBonusApplied
        ? [{ id: Date.now() + 2, type: 'streak', message: '🔥 연속 3일 완주! 몬스터 추가 -3 HP!', timestamp: Date.now() }]
        : [];

      return {
        ...state,
        totalExp:    state.totalExp + totalGain,
        weeklyExp:   (state.weeklyExp || 0) + totalGain,
        questsLog:   newLog,
        mapFog:      newMapFog,
        weeklyStats,
        goalExpBonus: state.goalExpBonus + goalBonus,
        monsters:    (monsters && Object.keys(monsters).length) ? monsters : state.monsters,
        lastSonicBonus: sonicBonus ? todayKey : state.lastSonicBonus,
        notifications: [...(state.notifications || []), ...sonicNotes, ...defeatNote, ...streakNotes],
      };
    }

    // ── 보너스 퀘스트 완료 ───────────────────────────────────
    case 'COMPLETE_BONUS_QUEST': {
      const { questId, exp } = action.payload;
      const todayKey = getTodayKey();
      const weekKey  = getWeekKey();

      const todayLog = state.questsLog[todayKey] || {
        morning:   INITIAL_QUESTS.morning.map(q => ({ ...q })),
        afternoon: INITIAL_QUESTS.afternoon.map(q => ({ ...q })),
        bonus:     INITIAL_BONUS_QUESTS.map(q => ({ ...q })),
      };

      const alreadyDone = (todayLog.bonus || []).find(q => q.id === questId)?.completed;
      if (alreadyDone) return state;

      const multiplier  = getExpMultiplier(state.activeBuffs, todayKey);
      const earnedExp   = Math.round(exp * multiplier);

      const updatedBonus = (todayLog.bonus || INITIAL_BONUS_QUESTS.map(q => ({ ...q }))).map(q =>
        q.id === questId ? { ...q, completed: true } : q
      );

      const newLog = {
        ...state.questsLog,
        [todayKey]: { ...todayLog, bonus: updatedBonus },
      };

      // 몬스터 데미지 -1
      const { monsters, extraExp = 0, goalBonus = 0, defeatNote = [] } =
        applyMonsterDamage(state, 1, newLog, todayKey);

      const weeklyStats = { ...state.weeklyStats };
      if (!weeklyStats[weekKey]) weeklyStats[weekKey] = { totalExp: 0 };
      weeklyStats[weekKey].totalExp += earnedExp + extraExp;

      const totalCompleted = Object.values(newLog).reduce((acc, day) => {
        if (!day || typeof day !== 'object') return acc;
        return acc + [...(day.morning || []), ...(day.afternoon || []), ...(day.bonus || [])].filter(q => q.completed).length;
      }, 0);
      const newMapFog = [...state.mapFog];
      const toReveal  = Math.min(Math.floor(totalCompleted / 3), 25);
      for (let i = 0; i < toReveal; i++) newMapFog[i] = false;

      return {
        ...state,
        totalExp:    state.totalExp + earnedExp + extraExp,
        weeklyExp:   (state.weeklyExp || 0) + earnedExp + extraExp,
        questsLog:   newLog,
        mapFog:      newMapFog,
        weeklyStats,
        goalExpBonus: state.goalExpBonus + goalBonus,
        monsters:    (monsters && Object.keys(monsters).length) ? monsters : state.monsters,
        notifications: [...(state.notifications || []), ...defeatNote],
      };
    }

    // ── 지역 잠금 해제 ───────────────────────────────────────
    case 'UNLOCK_REGIONS': {
      const { regionIds } = action.payload;
      if (!regionIds.length) return state;

      const newMonsters = { ...state.monsters };
      const newInventory = { ...state.inventory };
      let newFishingUnlocked = state.fishingUnlocked;

      for (const rid of regionIds) {
        const region = MAP_REGIONS.find(r => r.id === rid);
        if (!region) continue;
        // 몬스터 초기화
        if (!newMonsters[rid]) {
          newMonsters[rid] = { currentHp: region.monster.maxHp, defeated: false, streakBonusDate: null };
        }
        // 아이템 지급
        const itemId = region.item?.id;
        if (itemId && itemId !== 'masterSword') {
          newInventory[itemId] = (newInventory[itemId] || 0) + 1;
        } else if (itemId === 'masterSword') {
          newInventory.masterSword = true;
        }
        // 낚시 잠금 해제
        if (region.bonus === 'fishing') newFishingUnlocked = true;
      }

      return {
        ...state,
        unlockedRegions:    [...state.unlockedRegions, ...regionIds],
        pendingUnlockPopup: [...(state.pendingUnlockPopup || []), ...regionIds],
        monsters:           newMonsters,
        inventory:          newInventory,
        fishingUnlocked:    newFishingUnlocked,
      };
    }

    // ── 지역 오픈 팝업 닫기 ──────────────────────────────────
    case 'DISMISS_REGION_POPUP': {
      return {
        ...state,
        pendingUnlockPopup: (state.pendingUnlockPopup || []).slice(1),
      };
    }

    // ── 요리 제작 ────────────────────────────────────────────
    case 'COOK_RECIPE': {
      const { recipeId } = action.payload;
      const recipe = RECIPES.find(r => r.id === recipeId);
      if (!recipe) return state;

      // 재료 보유 확인
      const inv = { ...state.inventory };
      for (const ing of recipe.ingredients) {
        if ((inv[ing.id] || 0) < ing.count) return state; // 재료 부족
        inv[ing.id] = (inv[ing.id] || 0) - ing.count;
      }

      // 부모 승인 필요한 레시피
      if (recipe.requiresApproval) {
        return {
          ...state,
          inventory:      inv,
          pendingRecipes: [...(state.pendingRecipes || []), {
            pendingId: Date.now().toString(),
            recipeId,
            requestedAt: new Date().toLocaleString('ko-KR'),
          }],
        };
      }

      // 즉시 적용 효과
      const todayKey = getTodayKey();
      const tomorrow = (() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
      })();

      let expGain   = 0;
      let newBuffs  = [...(state.activeBuffs || [])];
      let newNotes  = [...(state.notifications || [])];

      if (recipe.effect === 'sonicEase') {
        newBuffs = [...newBuffs.filter(b => !(b.effect === 'sonicEase' && b.date === todayKey)),
                    { effect: 'sonicEase', date: todayKey }];
        newNotes.push({ id: Date.now(), type: 'buff', message: '💚 스태미나 요리! 소닉 보너스 조건 완화 (오늘)', timestamp: Date.now() });
      } else if (recipe.effect === 'bonusExp') {
        expGain = recipe.effectValue || 20;
        newNotes.push({ id: Date.now(), type: 'buff', message: `🛡️ 방어력 요리! +${expGain} EXP 획득`, timestamp: Date.now() });
      } else if (recipe.effect === 'expMultiplier') {
        newBuffs = [...newBuffs.filter(b => !(b.effect === 'expMultiplier' && b.date === tomorrow)),
                    { effect: 'expMultiplier', date: tomorrow }];
        newNotes.push({ id: Date.now(), type: 'buff', message: '🌬️ 바람의 요리! 내일 EXP 1.5배!', timestamp: Date.now() });
      }

      return {
        ...state,
        inventory:     inv,
        totalExp:      state.totalExp + expGain,
        weeklyExp:     (state.weeklyExp || 0) + expGain,
        activeBuffs:   newBuffs,
        notifications: newNotes,
      };
    }

    // ── 부모 승인 요리 처리 ──────────────────────────────────
    case 'APPROVE_RECIPE': {
      const { pendingId } = action.payload;
      const pending = (state.pendingRecipes || []).find(p => p.pendingId === pendingId);
      if (!pending) return state;

      const todayKey = getTodayKey();
      const todayLog = state.questsLog[todayKey] || {
        morning:   INITIAL_QUESTS.morning.map(q => ({ ...q })),
        afternoon: INITIAL_QUESTS.afternoon.map(q => ({ ...q })),
        bonus:     INITIAL_BONUS_QUESTS.map(q => ({ ...q })),
      };

      // 첫 번째 미완료 퀘스트 자동 완료 (morning 우선)
      let targetPeriod = null;
      let targetId     = null;
      let targetExp    = 0;

      for (const q of todayLog.morning) {
        if (!q.completed) { targetPeriod = 'morning'; targetId = q.id; targetExp = q.exp; break; }
      }
      if (!targetId) {
        for (const q of todayLog.afternoon) {
          if (!q.completed) { targetPeriod = 'afternoon'; targetId = q.id; targetExp = q.exp; break; }
        }
      }

      const newPending = (state.pendingRecipes || []).filter(p => p.pendingId !== pendingId);

      if (!targetId) {
        return { ...state, pendingRecipes: newPending };
      }

      const updatedPeriod = todayLog[targetPeriod].map(q =>
        q.id === targetId ? { ...q, completed: true } : q
      );
      const newLog = {
        ...state.questsLog,
        [todayKey]: { ...todayLog, [targetPeriod]: updatedPeriod },
      };

      return {
        ...state,
        totalExp:      state.totalExp + targetExp,
        weeklyExp:     (state.weeklyExp || 0) + targetExp,
        questsLog:     newLog,
        pendingRecipes: newPending,
        notifications: [...(state.notifications || []),
          { id: Date.now(), type: 'buff', message: '❤️ 하트 회복 요리! 퀘스트 1개 완료!', timestamp: Date.now() }],
      };
    }

    // ── 요리 요청 거절 ───────────────────────────────────────
    case 'REJECT_RECIPE': {
      const { pendingId } = action.payload;
      const pending = (state.pendingRecipes || []).find(p => p.pendingId === pendingId);
      if (!pending) return state;
      // 재료 환불
      const recipe = RECIPES.find(r => r.id === pending.recipeId);
      const inv    = { ...state.inventory };
      if (recipe) {
        for (const ing of recipe.ingredients) {
          inv[ing.id] = (inv[ing.id] || 0) + ing.count;
        }
      }
      return {
        ...state,
        inventory:      inv,
        pendingRecipes: (state.pendingRecipes || []).filter(p => p.pendingId !== pendingId),
      };
    }

    // ── 루비 → EXP 전환 ─────────────────────────────────────
    case 'CONVERT_RUBY': {
      const ruby = state.inventory?.ruby || 0;
      if (ruby <= 0) return state;
      const gain = 100;
      return {
        ...state,
        totalExp:  state.totalExp + gain,
        weeklyExp: (state.weeklyExp || 0) + gain,
        inventory: { ...state.inventory, ruby: ruby - 1 },
        notifications: [...(state.notifications || []),
          { id: Date.now(), type: 'buff', message: '💎 루비 → +100 EXP 전환!', timestamp: Date.now() }],
      };
    }

    // ── 낚시 성공 ────────────────────────────────────────────
    case 'CATCH_FISH': {
      const todayKey = getTodayKey();
      return {
        ...state,
        inventory:    { ...state.inventory, hyrulePike: (state.inventory?.hyrulePike || 0) + 1 },
        lastFishingDate: todayKey,
        notifications: [...(state.notifications || []),
          { id: Date.now(), type: 'buff', message: '🎣 하이랄 농어 획득! 인벤토리에 추가됐어요', timestamp: Date.now() }],
      };
    }

    // ── 기존 액션들 ──────────────────────────────────────────
    case 'BUY_ROOM_ITEM': {
      const { item } = action.payload;
      if (state.totalExp < item.price) return state;
      return { ...state, totalExp: state.totalExp - item.price, roomItems: [...state.roomItems, item.id] };
    }

    case 'ADD_COUPON':
      return { ...state, coupons: [...state.coupons, action.payload] };

    case 'USE_COUPON': {
      const idx = state.coupons.findIndex(c => c.id === action.payload.id && !c.used);
      if (idx === -1) return state;
      const newCoupons = [...state.coupons];
      newCoupons[idx] = { ...newCoupons[idx], used: true };
      return { ...state, coupons: newCoupons };
    }

    case 'ADD_CHEER':
      return {
        ...state,
        notifications: [...(state.notifications || []),
          { id: Date.now(), type: 'cheer', message: action.payload.message, timestamp: Date.now() }],
      };

    case 'DISMISS_NOTIFICATION':
      return { ...state, notifications: (state.notifications || []).filter(n => n.id !== action.payload.id) };

    case 'CHANGE_PASSWORD':
      return { ...state, parentPassword: action.payload.password };

    case 'RESET_TODAY': {
      const todayKey = getTodayKey();
      const newLog = { ...state.questsLog };
      delete newLog[todayKey];
      return { ...state, questsLog: newLog };
    }

    // ── 개발자 미리보기: 모든 지역 오픈 ─────────────────────
    case 'DEV_PREVIEW_ON': {
      const allRegionIds = MAP_REGIONS.map(r => r.id);
      const monsters = {};
      const inventory = {
        korogSeed: 3, hyruleApple: 3, hyrulePike: 3,
        ruby: 3, eagleFeather: 3, masterSword: true,
      };
      for (const r of MAP_REGIONS) {
        monsters[r.id] = { currentHp: r.monster.maxHp, defeated: false, streakBonusDate: null };
      }
      return {
        ...state,
        unlockedRegions:    allRegionIds,
        pendingUnlockPopup: [],
        monsters,
        inventory,
        fishingUnlocked: true,
        devPreview: true,
      };
    }

    case 'DEV_PREVIEW_OFF': {
      return {
        ...state,
        unlockedRegions:    [],
        pendingUnlockPopup: [],
        monsters:           {},
        inventory:          { korogSeed: 0, hyruleApple: 0, hyrulePike: 0, ruby: 0, eagleFeather: 0, masterSword: false },
        fishingUnlocked:    false,
        devPreview:         false,
      };
    }

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, null, () => {
    const loaded = loadState();
    // gameStartDate 초기화
    if (!loaded.gameStartDate) {
      loaded.gameStartDate = new Date().toISOString().split('T')[0];
    }
    return loaded;
  });

  useEffect(() => { saveState(state); }, [state]);

  // 지역 잠금 해제 체크
  useEffect(() => {
    const toUnlock = checkRegionUnlocks(state);
    if (toUnlock.length > 0) {
      dispatch({ type: 'UNLOCK_REGIONS', payload: { regionIds: toUnlock } });
    }
  }, [state.questsLog, state.gameStartDate]);

  const todayKey = getTodayKey();
  const todayQuests = state.questsLog[todayKey] || {
    morning:   INITIAL_QUESTS.morning.map(q => ({ ...q })),
    afternoon: INITIAL_QUESTS.afternoon.map(q => ({ ...q })),
    bonus:     INITIAL_BONUS_QUESTS.map(q => ({ ...q })),
  };

  const levelInfo    = getLevel(state.totalExp);
  const activeMonster = getActiveMonster(state);

  return (
    <GameContext.Provider value={{ state, dispatch, todayQuests, levelInfo, activeMonster }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
