import { useState } from 'react';
import { useGame } from '../store/GameContext';

const ROOM_ITEMS = [
  { id: 'bed',        name: '나무 침대',     emoji: '🛏️', price: 100,  desc: '편안한 나무 침대' },
  { id: 'torch',      name: '횃불',          emoji: '🔥', price: 50,   desc: '방을 밝히는 횃불' },
  { id: 'chest',      name: '보물 상자',     emoji: '📦', price: 150,  desc: '보물을 담는 상자' },
  { id: 'bookshelf',  name: '책장',          emoji: '📚', price: 200,  desc: '지식의 책장' },
  { id: 'sword_wall', name: '벽걸이 명검',   emoji: '⚔️', price: 300,  desc: '용사의 명검 장식' },
  { id: 'diamond',    name: '다이아몬드',    emoji: '💎', price: 500,  desc: '희귀한 다이아몬드' },
  { id: 'shield_wall',name: '방패 장식',     emoji: '🛡️', price: 250,  desc: '용사의 방패' },
  { id: 'map',        name: '세계 지도',     emoji: '🗺️', price: 200,  desc: '벽에 거는 지도' },
  { id: 'plant',      name: '화분',          emoji: '🪴', price: 80,   desc: '초록 식물' },
  { id: 'window',     name: '창문',          emoji: '🪟', price: 120,  desc: '햇살 들어오는 창문' },
  { id: 'candle',     name: '황금 촛대',     emoji: '🕯️', price: 180,  desc: '고급 황금 촛대' },
  { id: 'trophy',     name: '트로피',        emoji: '🏆', price: 400,  desc: '승리의 상징' },
  { id: 'gold_block', name: '황금 블록',     emoji: '🟡', price: 600,  desc: '부의 황금 블록' },
  { id: 'dragon_egg', name: '드래곤 알',     emoji: '🥚', price: 1000, desc: '전설의 드래곤 알' },
  { id: 'crown',      name: '황금 왕관',     emoji: '👑', price: 800,  desc: '왕의 황금 왕관' },
];

function RoomPreview({ ownedItems }) {
  const hasWindow = ownedItems.includes('window');
  const hasTorch  = ownedItems.includes('torch');
  const hasCandle = ownedItems.includes('candle');

  return (
    <div
      className="rounded-2xl mb-4 relative overflow-hidden"
      style={{
        border: '2px solid var(--cream-border)',
        background: hasWindow
          ? 'linear-gradient(160deg, #C8E8F8 0%, #E8F8E8 40%, #F5EDD8 100%)'
          : 'linear-gradient(160deg, #D8C8A8 0%, #E8D8B0 100%)',
        minHeight: 160,
        boxShadow: '0 4px 16px var(--shadow), inset 0 1px 0 rgba(255,255,255,0.6)',
      }}
    >
      {/* 조명 효과 */}
      {(hasTorch || hasCandle) && (
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'radial-gradient(ellipse at 80% 20%, rgba(255,200,80,0.25) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* 창문 효과 */}
      {hasWindow && (
        <div
          style={{
            position: 'absolute',
            top: 10, right: 12,
            width: 40, height: 40,
            background: 'linear-gradient(135deg, rgba(180,230,255,0.8), rgba(140,210,255,0.6))',
            border: '2px solid rgba(100,160,200,0.5)',
            borderRadius: 4,
          }}
        />
      )}

      <div style={{ padding: 16, position: 'relative', zIndex: 1 }}>
        <div
          className="botw-title text-center mb-3"
          style={{ fontSize: 13, color: 'var(--brown-mid)' }}
        >
          ✦ 지후의 방 ✦
        </div>
        {ownedItems.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--brown-light)', fontSize: 13, padding: '20px 0' }}>
            아이템을 구매해서 방을 꾸며보세요!
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 justify-center">
            {ownedItems.map(itemId => {
              const item = ROOM_ITEMS.find(i => i.id === itemId);
              return item ? (
                <div key={itemId} className="text-center">
                  <div style={{ fontSize: 28 }}>{item.emoji}</div>
                  <div style={{ fontSize: 9, color: 'var(--brown-mid)', fontWeight: 600, marginTop: 2 }}>
                    {item.name}
                  </div>
                </div>
              ) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RoomPage() {
  const { state, dispatch } = useGame();
  const ownedItems = state.roomItems || [];
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('ok');

  function handleBuy(item) {
    if (ownedItems.includes(item.id)) return;
    if (state.totalExp < item.price) {
      setMsg(`EXP가 부족해요! (${(item.price - state.totalExp).toLocaleString()} EXP 더 필요)`);
      setMsgType('err');
      setTimeout(() => setMsg(''), 2500);
      return;
    }
    dispatch({ type: 'BUY_ROOM_ITEM', payload: { item } });
    setMsg(`${item.emoji} ${item.name} 구매 완료!`);
    setMsgType('ok');
    setTimeout(() => setMsg(''), 2000);
  }

  return (
    <div className="px-4 pb-8">
      {/* EXP 표시 */}
      <div
        className="botw-panel px-4 py-2.5 mb-4 flex items-center justify-between"
      >
        <span style={{ fontSize: 14, color: 'var(--brown-mid)', fontWeight: 600 }}>보유 EXP</span>
        <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 16, color: 'var(--amber)' }}>
          {state.totalExp.toLocaleString()} EXP
        </span>
      </div>

      {/* 알림 */}
      {msg && (
        <div
          className="mb-4 px-4 py-3 rounded-xl text-center font-bold"
          style={{
            background: msgType === 'ok'
              ? 'linear-gradient(135deg, rgba(106,171,86,0.15), rgba(61,122,69,0.1))'
              : 'linear-gradient(135deg, rgba(212,130,10,0.15), rgba(212,130,10,0.08))',
            border: `1.5px solid ${msgType === 'ok' ? 'var(--green-light)' : 'var(--amber)'}`,
            color: msgType === 'ok' ? 'var(--green-hyrule)' : 'var(--amber)',
            fontSize: 14,
            animation: 'questPop 0.3s ease-out',
          }}
        >
          {msg}
        </div>
      )}

      {/* 방 미리보기 */}
      <RoomPreview ownedItems={ownedItems} />

      {/* 아이템 상점 */}
      <div
        className="botw-title mb-3"
        style={{ fontSize: 15, color: 'var(--brown-mid)', textAlign: 'center', letterSpacing: '0.05em' }}
      >
        ✦ 아이템 상점 ✦
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ROOM_ITEMS.map(item => {
          const owned    = ownedItems.includes(item.id);
          const canAfford = state.totalExp >= item.price;
          return (
            <button
              key={item.id}
              onClick={() => handleBuy(item)}
              disabled={owned}
              className="botw-btn text-left p-3 transition-all"
              style={{
                opacity: !owned && !canAfford ? 0.55 : 1,
                background: owned
                  ? 'linear-gradient(135deg, rgba(106,171,86,0.2), rgba(61,122,69,0.12))'
                  : undefined,
                borderColor: owned ? 'var(--green-light)' : undefined,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 4 }}>{item.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--brown-dark)', marginBottom: 2 }}>
                {item.name}
              </div>
              <div style={{ fontSize: 10, color: 'var(--brown-light)', marginBottom: 4 }}>
                {item.desc}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'Cinzel, serif',
                  color: owned ? 'var(--green-hyrule)' : canAfford ? 'var(--amber)' : '#B06060',
                }}
              >
                {owned ? '✓ 보유중' : `${item.price.toLocaleString()} EXP`}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
