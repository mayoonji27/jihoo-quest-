import { useGame } from '../store/GameContext';
import SheikahEye from './SheikahEye';

const BASE_GOAL = 50000;

export default function ExpBar() {
  const { state } = useGame();
  const { totalExp } = state;

  const ZELDA_GOAL = Math.max(BASE_GOAL - (state.goalExpBonus || 0), 1);
  const pct = Math.min((totalExp / ZELDA_GOAL) * 100, 100);
  const remaining = Math.max(ZELDA_GOAL - totalExp, 0);
  const done = totalExp >= ZELDA_GOAL;

  return (
    <div className="mx-4 mb-3">
      <div
        className="botw-panel px-4 py-3"
        style={{ borderColor: done ? '#7AAA60' : 'var(--cream-border)' }}
      >
        {/* 헤더 줄 */}
        <div className="flex items-center gap-2 mb-2">
          <SheikahEye size={20} color={done ? '#3D7A45' : '#4A8FBF'} />
          <span
            className="flex-1 text-sm font-bold"
            style={{ color: 'var(--brown-mid)', fontFamily: 'Cinzel, serif', letterSpacing: '0.04em' }}
          >
            {done
              ? '✦ 목표 달성! 젤다를 구하러 가자! ✦'
              : `젤다까지 ${remaining.toLocaleString()} EXP${state.goalExpBonus ? ` (-${state.goalExpBonus} 가논 토벌)` : ''}`}
          </span>
          <span className="text-xs font-bold" style={{ color: 'var(--amber)' }}>
            {totalExp.toLocaleString()}/{ZELDA_GOAL.toLocaleString()}
          </span>
        </div>

        {/* 진행 바 */}
        <div className="botw-bar-track" style={{ height: 14 }}>
          <div
            className="botw-bar-fill"
            style={{
              width: `${pct}%`,
              background: done
                ? 'linear-gradient(90deg, #3D7A45, #6AAB56, #A0D080)'
                : 'linear-gradient(90deg, #8B6008, #D4820A, #F0A830)',
              boxShadow: done
                ? '0 0 8px rgba(106,171,86,0.5)'
                : '0 0 8px rgba(212,130,10,0.4)',
            }}
          />
        </div>

        {/* 퍼센트 */}
        <div className="text-right mt-1">
          <span className="text-xs" style={{ color: 'var(--brown-light)' }}>
            {pct.toFixed(1)}% 완료
          </span>
        </div>
      </div>
    </div>
  );
}
