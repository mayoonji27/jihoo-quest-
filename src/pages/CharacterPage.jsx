import { useGame } from '../store/GameContext';
import { LEVEL_CONFIG, getNextLevel } from '../store/gameData';
import CharacterSprite from '../components/CharacterSprite';
import SheikahEye from '../components/SheikahEye';

const EQUIPMENT_LABELS = {
  none:      '견습생의 평복',
  shield:    '방패를 든 초보 용사',
  sword:     '쌍검의 용사',
  armor:     '철갑 기사',
  fullarmor: '강철 전사',
  legend:    '하이랄의 전설 영웅',
};

// BotW 스타일 스탯 행
function StatRow({ icon, label, value, color = 'var(--brown-dark)' }) {
  return (
    <div
      className="flex items-center gap-3 py-2.5"
      style={{ borderBottom: '1px solid var(--cream-border)' }}
    >
      <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 14, color: 'var(--brown-mid)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color, fontFamily: 'Cinzel, serif' }}>{value}</span>
    </div>
  );
}

export default function CharacterPage() {
  const { state, levelInfo } = useGame();
  const { totalExp } = state;
  const nextLevel   = getNextLevel(totalExp);
  const fromCurrent = nextLevel.minExp - levelInfo.minExp;
  const progress    = levelInfo.level >= 30 ? 100 : Math.max(0, Math.min(
    ((totalExp - levelInfo.minExp) / fromCurrent) * 100, 100
  ));
  const toNext = Math.max(nextLevel.minExp - totalExp, 0);

  const weekKey = (() => {
    const d = new Date();
    const jan1 = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
  })();
  const weeklyExp = state.weeklyStats?.[weekKey]?.totalExp || 0;

  // 레벨에 따른 하트 수 (기본 3 + 레벨업마다 증가)
  const heartCount = Math.min(3 + Math.floor(levelInfo.level / 3), 10);

  return (
    <div className="px-4 pb-8">
      {/* 캐릭터 메인 카드 */}
      <div
        className="botw-panel mb-4 overflow-hidden"
        style={{ borderColor: levelInfo.equipment === 'legend' ? '#C8A020' : 'var(--cream-border)' }}
      >
        {/* 배경 — 하이랄 하늘 느낌 */}
        <div
          style={{
            background: 'linear-gradient(180deg, #A0D8EF 0%, #C4E8B0 60%, #8AB870 100%)',
            borderRadius: '10px 10px 0 0',
            padding: '24px 0 12px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* 쉐이카 문양 장식 */}
          <div style={{ position: 'absolute', top: 8, right: 12, opacity: 0.35 }}>
            <SheikahEye size={28} color="#2060A0" />
          </div>

          <CharacterSprite equipment={levelInfo.equipment} size={110} animate={false} />

          {/* 하트 컨테이너 */}
          <div className="flex justify-center gap-1 mt-2 flex-wrap px-8">
            {Array.from({ length: heartCount }).map((_, i) => (
              <svg key={i} width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="#D44040"
                  stroke="#A02020"
                  strokeWidth="0.5"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(212,64,64,0.4))' }}
                />
              </svg>
            ))}
          </div>
        </div>

        {/* 이름 & 레벨 */}
        <div className="px-5 py-4">
          <div className="text-center mb-3">
            <div
              className="botw-title"
              style={{ fontSize: 22, color: 'var(--brown-dark)', fontWeight: 700 }}
            >
              지후의 용사
            </div>
            <div style={{ fontSize: 13, color: 'var(--brown-mid)', marginTop: 2 }}>
              {EQUIPMENT_LABELS[levelInfo.equipment]}
            </div>
          </div>

          {/* 레벨 배지 */}
          <div
            className="flex items-center justify-center gap-3 py-2 px-4 rounded-xl mb-4"
            style={{ background: 'var(--amber-pale)', border: '1.5px solid var(--cream-border)' }}
          >
            <span style={{ fontSize: 20 }}>⚔️</span>
            <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 18, color: 'var(--amber)' }}>
              Lv. {levelInfo.level}
            </span>
            <span style={{ fontSize: 14, color: 'var(--brown-mid)', fontWeight: 600 }}>
              {levelInfo.title}
            </span>
          </div>

          {/* EXP 바 */}
          <div className="mb-1">
            <div
              className="flex justify-between mb-1"
              style={{ fontSize: 11, color: 'var(--brown-light)', fontFamily: 'Cinzel, serif' }}
            >
              <span>EXPERIENCE</span>
              <span>{levelInfo.level < 30 ? `${toNext.toLocaleString()} to next` : 'MAX LEVEL'}</span>
            </div>
            <div className="botw-bar-track" style={{ height: 10 }}>
              <div
                className="botw-bar-fill"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #8B6008, var(--amber), var(--amber-light))',
                }}
              />
            </div>
          </div>

          {/* 스탯 */}
          <div className="mt-4">
            <StatRow icon="✨" label="총 경험치"   value={`${totalExp.toLocaleString()} EXP`} color="var(--amber)" />
            <StatRow icon="📅" label="이번 주 EXP" value={`${weeklyExp.toLocaleString()} EXP`} color="var(--blue-sheikah)" />
            <StatRow icon="❤️" label="하트 컨테이너" value={`${heartCount}개`} color="var(--red-heart)" />
          </div>
        </div>
      </div>

      {/* 성장 로드맵 */}
      <div className="botw-panel p-4">
        <div
          className="botw-title text-center mb-4"
          style={{ fontSize: 15, color: 'var(--brown-mid)', letterSpacing: '0.06em' }}
        >
          ✦ 용사 성장 로드맵 ✦
        </div>
        <div className="flex flex-col gap-1.5">
          {LEVEL_CONFIG.map((cfg) => {
            const reached   = totalExp >= cfg.minExp;
            const isCurrent = cfg.level === levelInfo.level;
            return (
              <div
                key={cfg.level}
                className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all"
                style={{
                  background: isCurrent
                    ? 'linear-gradient(135deg, var(--amber-pale), rgba(212,130,10,0.12))'
                    : reached
                      ? 'rgba(106,171,86,0.08)'
                      : 'rgba(200,169,106,0.08)',
                  border: `1.5px solid ${isCurrent ? 'var(--amber)' : reached ? 'var(--green-light)' : 'transparent'}`,
                  opacity: !reached ? 0.5 : 1,
                }}
              >
                <span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>
                  {reached ? (isCurrent ? '▶' : '✓') : '○'}
                </span>
                <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 12, color: 'var(--amber)', width: 40 }}>
                  Lv.{cfg.level}
                </span>
                <span style={{ flex: 1, fontSize: 13, color: 'var(--brown-mid)', fontWeight: isCurrent ? 700 : 500 }}>
                  {cfg.title}
                </span>
                <span style={{ fontSize: 11, color: 'var(--brown-light)', fontFamily: 'Cinzel, serif' }}>
                  {cfg.minExp.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
