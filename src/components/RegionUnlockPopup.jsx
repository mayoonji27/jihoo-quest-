import { useEffect, useState } from 'react';
import { useGame } from '../store/GameContext';
import { MAP_REGIONS } from '../store/gameData';

export default function RegionUnlockPopup() {
  const { state, dispatch } = useGame();
  const [visible, setVisible] = useState(false);
  const [anim, setAnim]       = useState(false);

  const pendingId = state.pendingUnlockPopup?.[0];
  const region    = pendingId ? MAP_REGIONS.find(r => r.id === pendingId) : null;

  useEffect(() => {
    if (region && !visible) {
      setVisible(true);
      setTimeout(() => setAnim(true), 50);
    }
  }, [pendingId]);

  function handleDismiss() {
    setAnim(false);
    setTimeout(() => {
      setVisible(false);
      dispatch({ type: 'DISMISS_REGION_POPUP' });
    }, 300);
  }

  if (!visible || !region) return null;

  const isMasterSword = region.item?.id === 'masterSword';

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(10,5,20,0.82)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'opacity 0.3s',
        opacity: anim ? 1 : 0,
      }}
      onClick={handleDismiss}
    >
      <div
        style={{
          transform: anim ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(40px)',
          transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          width: 280, padding: '28px 24px 24px',
          borderRadius: 20,
          background: isMasterSword
            ? 'linear-gradient(145deg, #0A1A2A, #102040)'
            : 'linear-gradient(145deg, #1C2A12, #2A3A18)',
          border: `2px solid ${isMasterSword ? '#4090FF' : '#6AB056'}`,
          boxShadow: `0 0 40px ${isMasterSword ? 'rgba(64,144,255,0.5)' : 'rgba(106,176,86,0.4)'}`,
          textAlign: 'center',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 반짝이는 별들 */}
        <div style={{ position: 'absolute', top: 12, left: 20, fontSize: 12,
                      animation: 'shimmer 1.5s ease-in-out infinite', color: '#FFD700' }}>✦</div>
        <div style={{ position: 'absolute', top: 16, right: 24, fontSize: 10,
                      animation: 'shimmer 2s ease-in-out infinite 0.5s', color: '#FFD700' }}>✦</div>
        <div style={{ position: 'absolute', bottom: 20, left: 16, fontSize: 8,
                      animation: 'shimmer 1.8s ease-in-out infinite 0.3s', color: '#FFD700' }}>✦</div>

        {/* 새 지역 발견 배너 */}
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.2em',
          color: isMasterSword ? '#4090FF' : '#6AB056',
          fontFamily: 'Cinzel, serif', marginBottom: 12,
        }}>
          ✦ NEW REGION DISCOVERED ✦
        </div>

        {/* 지역 이모지 */}
        <div style={{
          fontSize: 56, lineHeight: 1, marginBottom: 8,
          filter: `drop-shadow(0 0 12px ${isMasterSword ? 'rgba(64,144,255,0.8)' : 'rgba(106,176,86,0.6)'})`,
          animation: 'questPop 0.5s ease-out',
        }}>
          {region.emoji}
        </div>

        {/* 지역 이름 */}
        <div style={{
          fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 4,
          fontFamily: 'Cinzel, serif', textShadow: '0 0 20px rgba(255,255,255,0.3)',
        }}>
          {region.name}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>
          {region.desc}
        </div>

        {/* 구분선 */}
        <div style={{ height: 1, background: isMasterSword ? 'rgba(64,144,255,0.3)' : 'rgba(106,176,86,0.3)', marginBottom: 16 }} />

        {/* 아이템 획득 */}
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 8, letterSpacing: '0.1em' }}>
          아이템 획득!
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: isMasterSword ? 'rgba(64,144,255,0.15)' : 'rgba(106,176,86,0.15)',
          border: `1px solid ${isMasterSword ? 'rgba(64,144,255,0.4)' : 'rgba(106,176,86,0.4)'}`,
          borderRadius: 12, padding: '8px 16px', marginBottom: 20,
        }}>
          <span style={{ fontSize: 28 }}>{region.item.emoji}</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{region.item.name}</div>
            {region.bonus === 'fishing' && (
              <div style={{ fontSize: 10, color: '#6AB056' }}>🎣 낚시 미니게임 해제!</div>
            )}
            {isMasterSword && (
              <div style={{ fontSize: 10, color: '#4090FF' }}>⚔️ 마스터 소드 장착 완료!</div>
            )}
          </div>
        </div>

        {/* 몬스터 등장 알림 */}
        <div style={{
          fontSize: 12, color: 'rgba(255,100,100,0.9)', marginBottom: 20,
          background: 'rgba(200,50,50,0.1)', borderRadius: 8, padding: '6px 12px',
          border: '1px solid rgba(200,50,50,0.2)',
        }}>
          ⚠️ {region.monster.name} 출현! (HP {region.monster.maxHp})
        </div>

        <button
          onClick={handleDismiss}
          style={{
            width: '100%', padding: '12px',
            borderRadius: 12, border: `1.5px solid ${isMasterSword ? '#4090FF' : '#6AB056'}`,
            background: isMasterSword
              ? 'linear-gradient(145deg, rgba(64,144,255,0.3), rgba(32,80,200,0.4))'
              : 'linear-gradient(145deg, rgba(106,176,86,0.3), rgba(61,122,69,0.4))',
            color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            fontFamily: 'Cinzel, serif', letterSpacing: '0.05em',
          }}
        >
          ✦ 모험 계속하기 ✦
        </button>
      </div>
    </div>
  );
}
