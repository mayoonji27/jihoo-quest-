import { useState } from 'react';
import { useGame } from '../store/GameContext';
import { INITIAL_QUESTS, INITIAL_BONUS_QUESTS } from '../store/gameData';

function QuestCard({ quest, onComplete, isPast = false }) {
  const [popping, setPopping] = useState(false);

  function handleTap() {
    if (quest.completed && !isPast) return;
    setPopping(true);
    setTimeout(() => setPopping(false), 450);
    onComplete(quest.id, quest.exp);
  }

  return (
    <button
      onClick={handleTap}
      disabled={quest.completed && !isPast}
      className={`quest-card w-full text-left flex items-center gap-3 px-4 py-3.5
        ${quest.completed ? 'completed' : ''}
        ${quest.priority && !quest.completed ? 'priority' : ''}
        ${popping ? 'quest-pop' : ''}
      `}
    >
      {/* 이모지 */}
      <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{quest.emoji}</span>

      <div className="flex-1 min-w-0">
        {/* 제목 */}
        <div
          style={{
            fontWeight: 700,
            fontSize: 15,
            lineHeight: 1.3,
            color: quest.completed ? 'var(--green-hyrule)' : 'var(--brown-dark)',
            textDecoration: quest.completed ? 'line-through' : 'none',
            opacity: quest.completed ? 0.8 : 1,
          }}
        >
          {quest.priority && !quest.completed && (
            <span style={{ color: 'var(--amber)', marginRight: 4 }}>★</span>
          )}
          {quest.title}
        </div>

        {/* EXP */}
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            marginTop: 2,
            color: quest.completed ? 'var(--green-light)' : 'var(--amber)',
            fontFamily: 'Cinzel, serif',
          }}
        >
          {quest.completed
            ? (isPast ? '✦ 완료 · 탭하면 취소' : '✦ 완료')
            : `+${quest.exp} EXP`}
        </div>
      </div>

      {/* 체크 영역 — BotW 스타일 원형 */}
      <div
        style={{
          width: 32, height: 32,
          borderRadius: '50%',
          border: quest.completed ? 'none' : '2px solid var(--cream-border)',
          background: quest.completed
            ? 'linear-gradient(135deg, var(--green-light), var(--green-hyrule))'
            : 'rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: quest.completed ? '0 2px 8px rgba(61,122,69,0.4)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {quest.completed && (
          isPast
            ? <span style={{ color: 'white', fontSize: 14, lineHeight: 1 }}>↩</span>
            : (
              <svg width="16" height="16" viewBox="0 0 16 16">
                <polyline points="2,8 6,12 14,4" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )
        )}
      </div>
    </button>
  );
}

// BotW 어드벤처 로그 탭 버튼
function LogTab({ active, onClick, icon, label, count, total, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '10px 4px',
        borderRadius: 10,
        border: `2px solid ${active ? color : 'var(--cream-border)'}`,
        background: active
          ? `linear-gradient(145deg, ${color}22, ${color}44)`
          : 'rgba(245,237,216,0.6)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
    >
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 13, color: active ? color : 'var(--brown-mid)', marginTop: 2 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 11, fontWeight: 600, fontFamily: 'Cinzel, serif',
          color: count === total ? 'var(--green-hyrule)' : 'var(--brown-light)',
        }}
      >
        {count}/{total}
      </div>
    </button>
  );
}

// 날짜 옵션 생성 (오늘 포함 4일)
function getDateOptions() {
  const today = new Date();
  return [0, 1, 2, 3].map(daysAgo => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    const key = d.toISOString().split('T')[0];
    const label = daysAgo === 0 ? '오늘' : daysAgo === 1 ? '어제' : `${daysAgo}일전`;
    const shortDate = `${d.getMonth() + 1}/${d.getDate()}`;
    return { daysAgo, key, label, shortDate };
  });
}

export default function QuestPage() {
  const { dispatch, state } = useGame();
  const [tab, setTab] = useState('morning');
  const [completing, setCompleting] = useState(false);
  const [selectedDaysAgo, setSelectedDaysAgo] = useState(0);

  const dateOptions = getDateOptions();
  const selectedDate = dateOptions[selectedDaysAgo];
  const isToday = selectedDaysAgo === 0;

  // 선택한 날짜의 퀘스트 데이터
  const dayLog = state.questsLog[selectedDate.key] || {
    morning:   INITIAL_QUESTS.morning.map(q => ({ ...q })),
    afternoon: INITIAL_QUESTS.afternoon.map(q => ({ ...q })),
    bonus:     INITIAL_BONUS_QUESTS.map(q => ({ ...q })),
  };

  const sonicBonus = dayLog.sonicBonus;

  function handleComplete(period, questId, exp) {
    if (isToday) {
      dispatch({ type: 'COMPLETE_QUEST', payload: { period, questId, exp } });
    } else {
      dispatch({ type: 'TOGGLE_QUEST_DATE', payload: { period, questId, exp, dateKey: selectedDate.key } });
    }
    setCompleting(true);
    setTimeout(() => setCompleting(false), 800);
  }

  function handleBonusComplete(questId, exp) {
    if (isToday) {
      dispatch({ type: 'COMPLETE_BONUS_QUEST', payload: { questId, exp } });
    } else {
      dispatch({ type: 'TOGGLE_BONUS_QUEST_DATE', payload: { questId, exp, dateKey: selectedDate.key } });
    }
    setCompleting(true);
    setTimeout(() => setCompleting(false), 800);
  }

  const morningQuests   = dayLog.morning   || INITIAL_QUESTS.morning.map(q => ({ ...q }));
  const afternoonQuests = dayLog.afternoon || INITIAL_QUESTS.afternoon.map(q => ({ ...q }));
  const bonusQuests     = dayLog.bonus     || INITIAL_BONUS_QUESTS.map(q => ({ ...q }));

  const morningDone   = morningQuests.filter(q => q.completed).length;
  const afternoonDone = afternoonQuests.filter(q => q.completed).length;
  const bonusDone     = bonusQuests.filter(q => q.completed).length;

  const currentQuests = tab === 'morning' ? morningQuests : tab === 'afternoon' ? afternoonQuests : bonusQuests;
  const currentDone   = tab === 'morning' ? morningDone   : tab === 'afternoon' ? afternoonDone   : bonusDone;
  const currentTotal  = currentQuests.length;
  const pct = currentTotal > 0 ? (currentDone / currentTotal) * 100 : 0;

  const tabColor = tab === 'morning' ? 'var(--amber)'
                 : tab === 'afternoon' ? 'var(--blue-sheikah)'
                 : 'var(--green-hyrule)';

  return (
    <div className="relative px-4 pb-6">
      {/* 완료 이펙트 */}
      {completing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div style={{ fontSize: 56, animation: 'questPop 0.5s ease-out' }}>✨</div>
        </div>
      )}

      {/* 날짜 선택 */}
      <div className="flex gap-1.5 mb-4">
        {dateOptions.map(opt => (
          <button
            key={opt.daysAgo}
            onClick={() => setSelectedDaysAgo(opt.daysAgo)}
            style={{
              flex: 1,
              padding: '7px 4px',
              borderRadius: 10,
              border: `2px solid ${selectedDaysAgo === opt.daysAgo ? 'var(--blue-sheikah)' : 'var(--cream-border)'}`,
              background: selectedDaysAgo === opt.daysAgo
                ? 'linear-gradient(145deg, rgba(74,143,191,0.2), rgba(123,189,224,0.15))'
                : 'rgba(245,237,216,0.6)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{
              fontWeight: 700,
              fontSize: 13,
              color: selectedDaysAgo === opt.daysAgo ? 'var(--blue-sheikah)' : 'var(--brown-mid)',
            }}>
              {opt.label}
            </div>
            <div style={{
              fontSize: 10,
              fontFamily: 'Cinzel, serif',
              color: selectedDaysAgo === opt.daysAgo ? 'var(--blue-sheikah)' : 'var(--brown-light)',
              opacity: 0.8,
              marginTop: 1,
            }}>
              {opt.shortDate}
            </div>
          </button>
        ))}
      </div>

      {/* 소급 편집 안내 배너 */}
      {!isToday && (
        <div
          className="mb-3 px-3 py-2 rounded-xl"
          style={{
            border: '1.5px solid rgba(74,143,191,0.4)',
            background: 'linear-gradient(135deg, rgba(74,143,191,0.08), rgba(123,189,224,0.05))',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--blue-sheikah)', fontWeight: 600 }}>
            ✏️ {selectedDate.label} ({selectedDate.key}) 퀘스트 — 완료된 항목을 탭하면 취소됩니다
          </span>
        </div>
      )}

      {/* 탭 선택 */}
      <div className="flex gap-1.5 mb-4">
        <LogTab active={tab==='morning'}   onClick={() => setTab('morning')}
          icon="☀️" label="오전" count={morningDone}   total={morningQuests.length}   color="var(--amber)" />
        <LogTab active={tab==='afternoon'} onClick={() => setTab('afternoon')}
          icon="🌙" label="오후" count={afternoonDone} total={afternoonQuests.length} color="var(--blue-sheikah)" />
        <LogTab active={tab==='bonus'}     onClick={() => setTab('bonus')}
          icon="⭐" label="보너스" count={bonusDone}   total={bonusQuests.length}     color="var(--green-hyrule)" />
      </div>

      {/* 진행 바 */}
      <div className="mb-4">
        <div className="flex justify-between mb-1" style={{ fontSize: 12, color: 'var(--brown-light)' }}>
          <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 600 }}>
            {isToday ? '오늘의 진행' : `${selectedDate.label} 진행`}
          </span>
          <span style={{ color: pct === 100 ? 'var(--green-hyrule)' : 'var(--brown-mid)', fontWeight: 700 }}>
            {currentDone}/{currentTotal}
          </span>
        </div>
        <div className="botw-bar-track" style={{ height: 12 }}>
          <div
            className="botw-bar-fill"
            style={{
              width: `${pct}%`,
              background: pct === 100
                ? 'linear-gradient(90deg, var(--green-hyrule), var(--green-light), #A0D080)'
                : tab === 'morning'
                  ? 'linear-gradient(90deg, #8B6008, var(--amber), var(--amber-light))'
                  : tab === 'afternoon'
                    ? 'linear-gradient(90deg, #2A4A80, var(--blue-sheikah), var(--blue-light))'
                    : 'linear-gradient(90deg, #2A6A30, var(--green-hyrule), var(--green-light))',
            }}
          />
        </div>
      </div>

      {/* 소닉 보너스 배너 (오전 탭) */}
      {tab === 'morning' && (
        <div
          className="mb-4 px-4 py-3 rounded-xl text-center"
          style={{
            border: `1.5px solid ${sonicBonus ? 'var(--blue-sheikah)' : morningDone === morningQuests.length ? 'var(--green-hyrule)' : 'var(--cream-border)'}`,
            background: sonicBonus
              ? 'linear-gradient(135deg, rgba(74,143,191,0.15), rgba(123,189,224,0.1))'
              : morningDone === morningQuests.length
                ? 'linear-gradient(135deg, rgba(106,171,86,0.15), rgba(160,208,128,0.1))'
                : 'rgba(245,237,216,0.7)',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700,
            color: sonicBonus ? 'var(--blue-sheikah)' : morningDone === morningQuests.length ? 'var(--green-hyrule)' : 'var(--brown-light)',
            fontFamily: sonicBonus ? 'Cinzel, serif' : 'inherit',
          }}>
            {sonicBonus
              ? '⚡ SONIC BONUS 획득! +50 EXP'
              : morningDone === morningQuests.length
                ? '✦ 오전 퀘스트 완료! 훌륭해요! ✦'
                : isToday
                  ? '⚡ 오전 퀘스트 모두 완료하면 SONIC BONUS +50 EXP!'
                  : '오전 퀘스트 현황'}
          </span>
        </div>
      )}

      {/* 보너스 탭 안내 */}
      {tab === 'bonus' && (
        <div
          className="mb-4 px-4 py-3 rounded-xl"
          style={{
            border: '1.5px solid var(--green-light)',
            background: 'linear-gradient(135deg, rgba(106,171,86,0.12), rgba(61,122,69,0.08))',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green-hyrule)', marginBottom: 2 }}>
            ⭐ 상시 보너스 퀘스트
          </div>
          <div style={{ fontSize: 11, color: 'var(--brown-light)' }}>
            언제든지 완료할 수 있어요! 매일 새로 리셋됩니다.
          </div>
        </div>
      )}

      {/* 퀘스트 카드 목록 */}
      <div className="flex flex-col gap-2.5">
        {tab === 'bonus'
          ? bonusQuests.map(quest => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isPast={!isToday}
                onComplete={(id, exp) => handleBonusComplete(id, exp)}
              />
            ))
          : currentQuests.map(quest => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isPast={!isToday}
                onComplete={(id, exp) => handleComplete(tab, id, exp)}
              />
            ))
        }
      </div>
    </div>
  );
}
