import { useState, useEffect, useRef } from 'react';
import { useGame } from '../store/GameContext';
import {
  MC_ROOM_ITEMS, ROOM_TIERS, ROOM_FLOORS, ROOM_WALLPAPERS, getRoomTier,
} from '../store/gameData';

// ── 마인크래프트 픽셀 강아지 SVG ────────────────────────────────
function PixelDog({ isHungry = false }) {
  const G = '#9B9B9B', D = '#555555', W = '#EEEEEE', K = '#111111';
  return (
    <svg viewBox="0 0 32 22" width="64" height="44"
      style={{ imageRendering: 'pixelated', display: 'block', overflow: 'visible' }}>
      {/* 귀 */}
      <rect x="6"  y="0" width="3" height="3" fill={D}/>
      <rect x="13" y="0" width="3" height="3" fill={D}/>
      {/* 머리 */}
      <rect x="5"  y="3" width="13" height="7" fill={G}/>
      {/* 주둥이 */}
      <rect x="5"  y="6" width="5"  height="4" fill={W}/>
      {/* 코 */}
      <rect x="5"  y="6" width="3"  height="2" fill={K}/>
      {/* 눈 */}
      <rect x="8"  y="4" width="2"  height="2" fill={K}/>
      <rect x="12" y="4" width="2"  height="2" fill={K}/>
      {/* 입 — 행복/슬픔 */}
      {isHungry
        ? <rect x="6" y="9" width="4" height="1" fill={K}/>
        : <><rect x="7" y="9" width="1" height="1" fill={K}/><rect x="9" y="9" width="1" height="1" fill={K}/></>
      }
      {/* 몸통 */}
      <rect x="5"  y="10" width="16" height="7" fill={G}/>
      {/* 배 */}
      <rect x="7"  y="11" width="10" height="5" fill={W}/>
      {/* 꼬리 */}
      <rect x="21" y="8"  width="7"  height="3" fill={G}/>
      <rect x="24" y="6"  width="4"  height="2" fill={D}/>
      {/* 다리 */}
      <rect x="6"  y="17" width="3"  height="4" fill={G}/>
      <rect x="10" y="17" width="3"  height="4" fill={G}/>
      <rect x="14" y="17" width="3"  height="4" fill={G}/>
      <rect x="18" y="17" width="3"  height="4" fill={G}/>
    </svg>
  );
}

// ── 펫 섹션 (걷기 애니메이션 + 먹이주기) ───────────────────────
function PetSection({ pet, dispatch }) {
  const hunger   = pet?.hunger   ?? 3;
  const treats   = pet?.treats   ?? 0;
  const isHungry = hunger === 0;
  const isSad    = hunger <= 1;

  const [petX,   setPetX]   = useState(20);
  const [facing, setFacing] = useState(1);
  const dirRef = useRef(1);

  useEffect(() => {
    if (isHungry) return;
    const id = setInterval(() => {
      setPetX(prev => {
        const next = prev + dirRef.current * 2;
        if (next >= 155) { dirRef.current = -1; setFacing(-1); return 155; }
        if (next <= 5)   { dirRef.current =  1; setFacing(1);  return 5;   }
        return next;
      });
    }, 80);
    return () => clearInterval(id);
  }, [isHungry]);

  const moodLabel = isHungry ? '😢 배고파요...' : isSad ? '😕 배고파요' : '😊 행복해요!';
  const hungerColor = isHungry ? '#E05050' : isSad ? '#D09030' : '#4A9A50';

  return (
    <div style={{ margin: '12px 0', padding: '10px 12px', borderRadius: 6, border: '3px solid #222',
        background: '#2D2D1A', position: 'relative', overflow: 'hidden' }}>
      {/* 잔디 바닥 */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 20,
          background: 'linear-gradient(#5D8A3C, #4A7030)', borderTop: '2px solid #222' }}/>

      {/* 강아지 */}
      <div style={{
        position: 'relative', height: 70, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', bottom: 16, left: petX,
          transform: `scaleX(${facing})`,
          transformOrigin: 'center center',
          transition: 'left 0.08s linear',
        }}>
          <div className={isHungry ? '' : isSad ? 'pet-bob' : 'pet-bob-fast'}>
            <PixelDog isHungry={isSad}/>
          </div>
        </div>
      </div>

      {/* 배고픔 + 먹이주기 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: hungerColor, fontWeight: 700, fontFamily: 'monospace', marginBottom: 3 }}>
            🐶 {moodLabel}
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{
                width: 18, height: 18, borderRadius: 3,
                background: i <= hunger ? '#D09030' : '#555',
                border: '2px solid #222',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10,
              }}>
                {i <= hunger ? '🦴' : ''}
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#C8A050', fontFamily: 'monospace', marginBottom: 4 }}>
            먹이 🦴×{treats}
          </div>
          <button
            onClick={() => dispatch({ type: 'FEED_PET' })}
            disabled={treats <= 0 || hunger >= 5}
            style={{
              padding: '6px 12px', borderRadius: 4, border: '2px solid #555',
              background: treats > 0 && hunger < 5 ? '#8B6030' : '#444',
              color: treats > 0 && hunger < 5 ? '#FFD060' : '#888',
              fontWeight: 700, fontSize: 12, fontFamily: 'monospace',
              cursor: treats > 0 && hunger < 5 ? 'pointer' : 'default',
            }}
          >
            먹이주기
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 방 그리드 ─────────────────────────────────────────────────
function RoomGrid({ grid, cols, rows, floorId, wallpaperId, selectedItemId, onCellTap }) {
  const floorData     = ROOM_FLOORS.find(f => f.id === floorId)     || ROOM_FLOORS[0];
  const wallpaperData = ROOM_WALLPAPERS.find(w => w.id === wallpaperId) || ROOM_WALLPAPERS[0];

  const hasLighting = Object.values(grid).some(id => {
    const item = MC_ROOM_ITEMS.find(i => i.id === id);
    return item?.effect === 'lighting';
  });
  const hasWindow = Object.values(grid).includes('window');

  const floorStyle = {
    background: `linear-gradient(145deg, ${floorData.color1}, ${floorData.color2})`,
    borderColor: '#111',
  };

  return (
    <div style={{
      position: 'relative',
      border: '3px solid #111',
      borderRadius: 4,
      overflow: 'hidden',
      background: wallpaperData.color,
      backgroundImage: `repeating-linear-gradient(
        0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 2px, transparent 2px, transparent 18px
      ), repeating-linear-gradient(
        90deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 2px, transparent 2px, transparent 18px
      )`,
    }}>
      {/* 조명 오버레이 */}
      {hasLighting && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 60% 30%, rgba(255,200,80,0.18) 0%, transparent 70%)',
          zIndex: 1,
        }}/>
      )}
      {/* 햇살 오버레이 */}
      {hasWindow && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 80% 20%, rgba(200,240,255,0.12) 0%, transparent 55%)',
          zIndex: 1,
        }}/>
      )}

      {/* 그리드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 2, padding: 6, position: 'relative', zIndex: 2,
      }}>
        {Array.from({ length: cols * rows }, (_, idx) => {
          const col = idx % cols;
          const row = Math.floor(idx / cols);
          const cellKey = `${col},${row}`;
          const itemId  = grid[cellKey];
          const item    = itemId ? MC_ROOM_ITEMS.find(i => i.id === itemId) : null;
          const isSelected = selectedItemId && !itemId; // 빈 셀에 배치 가능 표시

          return (
            <button
              key={cellKey}
              onClick={() => onCellTap(cellKey)}
              style={{
                aspectRatio: '1',
                ...floorStyle,
                border: isSelected
                  ? '2px solid #FFD060'
                  : itemId ? '2px solid rgba(255,255,255,0.25)' : '2px solid rgba(0,0,0,0.35)',
                borderRadius: 3,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
                background: itemId
                  ? `linear-gradient(145deg, rgba(255,255,255,0.12), rgba(0,0,0,0.1)), linear-gradient(145deg, ${floorData.color1}, ${floorData.color2})`
                  : `linear-gradient(145deg, ${floorData.color1}, ${floorData.color2})`,
                boxShadow: itemId ? 'inset 0 2px 0 rgba(255,255,255,0.15), inset 0 -2px 0 rgba(0,0,0,0.2)' : 'inset 0 2px 0 rgba(255,255,255,0.1)',
                transition: 'border-color 0.15s',
              }}
            >
              {item && (
                <span
                  className={
                    item.effect === 'lighting' ? 'torch-flicker' :
                    item.effect === 'plantAnim' ? 'plant-sway-room' : ''
                  }
                  style={{ fontSize: 'clamp(18px, 4vw, 28px)', lineHeight: 1, userSelect: 'none' }}
                >
                  {item.emoji}
                </span>
              )}
              {isSelected && (
                <span style={{ fontSize: 'clamp(12px, 3vw, 18px)', opacity: 0.4 }}>+</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── 인벤토리 바 (배치할 아이템 선택) ───────────────────────────
function InventoryBar({ roomInventory, selectedItemId, onSelect }) {
  const ownedItems = MC_ROOM_ITEMS.filter(i => i.category === 'placeable' && (roomInventory[i.id] || 0) > 0);
  if (ownedItems.length === 0) return null;

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontSize: 11, color: '#8B6030', fontFamily: 'monospace', fontWeight: 700, marginBottom: 4 }}>
        ▶ 배치할 아이템 선택 (탭 → 그리드에 배치)
      </div>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
        {ownedItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSelect(selectedItemId === item.id ? null : item.id)}
            style={{
              flexShrink: 0,
              width: 56, height: 56,
              border: selectedItemId === item.id ? '3px solid #FFD060' : '2px solid #555',
              borderRadius: 4,
              background: selectedItemId === item.id ? '#3A3010' : '#2A2A1A',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>{item.emoji}</span>
            <span style={{
              position: 'absolute', bottom: 2, right: 4,
              fontSize: 10, color: '#FFD060', fontFamily: 'monospace', fontWeight: 700,
            }}>
              ×{roomInventory[item.id]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── 탭 버튼 ───────────────────────────────────────────────────
function MCTab({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '8px 4px',
      background: active ? '#3A3010' : '#1A1A0A',
      border: `2px solid ${active ? '#FFD060' : '#444'}`,
      borderRadius: 4,
      color: active ? '#FFD060' : '#888',
      fontWeight: 700, fontSize: 12,
      fontFamily: 'monospace',
      cursor: 'pointer',
      transition: 'all 0.15s',
    }}>
      <div style={{ fontSize: 16 }}>{icon}</div>
      <div>{label}</div>
    </button>
  );
}

// ── 상점 패널 ─────────────────────────────────────────────────
function ShopPanel({ state, dispatch, showMsg }) {
  const [shopCat, setShopCat] = useState('placeable');
  const items = MC_ROOM_ITEMS.filter(i => i.category === shopCat);
  const inv   = state.roomInventory   || {};
  const cons  = state.roomConsumables || {};
  const grid  = state.roomGrid        || {};

  function getCount(item) {
    if (item.category === 'placeable') {
      const inGrid = Object.values(grid).filter(id => id === item.id).length;
      return (inv[item.id] || 0) + inGrid;
    }
    return cons[item.id] || 0;
  }

  function handleBuy(item) {
    if (state.totalExp < item.price) {
      showMsg(`EXP 부족! ${(item.price - state.totalExp).toLocaleString()} EXP 더 필요`, false);
      return;
    }
    dispatch({ type: 'BUY_MC_ITEM', payload: { itemId: item.id } });
    showMsg(`${item.emoji} ${item.name} 구매!`, true);
  }

  return (
    <div>
      {/* 카테고리 탭 */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {[
          { id: 'placeable', label: '🏗️ 설치형' },
          { id: 'consumable', label: '⚗️ 소모형' },
        ].map(c => (
          <button key={c.id} onClick={() => setShopCat(c.id)} style={{
            flex: 1, padding: '8px 4px',
            background: shopCat === c.id ? '#3A3010' : '#2A2A1A',
            border: `2px solid ${shopCat === c.id ? '#FFD060' : '#444'}`,
            borderRadius: 4, color: shopCat === c.id ? '#FFD060' : '#888',
            fontWeight: 700, fontSize: 13, fontFamily: 'monospace', cursor: 'pointer',
          }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* 아이템 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {items.map(item => {
          const count     = getCount(item);
          const canAfford = state.totalExp >= item.price;
          return (
            <div key={item.id} style={{
              background: '#1E1E0E', border: `2px solid ${count > 0 ? '#4A8030' : '#444'}`,
              borderRadius: 6, padding: '12px 10px',
            }}>
              <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 6 }}>{item.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#E8D0A0', fontFamily: 'monospace', marginBottom: 2 }}>
                {item.name}
              </div>
              <div style={{ fontSize: 10, color: '#7A7A5A', marginBottom: 6 }}>{item.desc}</div>
              {count > 0 && (
                <div style={{ fontSize: 10, color: '#6AAB56', fontFamily: 'monospace', marginBottom: 4 }}>
                  보유: {count}개
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: 12, fontWeight: 700, fontFamily: 'monospace',
                  color: canAfford ? '#FFD060' : '#805030',
                }}>
                  {item.price.toLocaleString()} EXP
                </span>
                <button onClick={() => handleBuy(item)} style={{
                  padding: '4px 10px', borderRadius: 3, border: '2px solid',
                  borderColor: canAfford ? '#888' : '#444',
                  background: canAfford ? '#3A3010' : '#2A2A1A',
                  color: canAfford ? '#FFD060' : '#555',
                  fontWeight: 700, fontSize: 12, fontFamily: 'monospace',
                  cursor: canAfford ? 'pointer' : 'default',
                }}>
                  구매
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 소모형 사용 패널 ─────────────────────────────────────────
function ConsumableUsePanel({ state, dispatch, showMsg }) {
  const cons  = state.roomConsumables || {};
  const owned = MC_ROOM_ITEMS.filter(i => i.category === 'consumable' && (cons[i.id] || 0) > 0);

  if (owned.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#7A7A5A', fontSize: 13, padding: '16px 0', fontFamily: 'monospace' }}>
        소모형 아이템이 없어요
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {owned.map(item => (
        <div key={item.id} style={{
          background: '#1E1E0E', border: '2px solid #4A4A2A',
          borderRadius: 6, padding: '10px 12px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 28 }}>{item.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#E8D0A0', fontFamily: 'monospace' }}>
              {item.name} ×{cons[item.id]}
            </div>
            <div style={{ fontSize: 11, color: '#7A7A5A', marginTop: 2 }}>{item.desc}</div>
            {item.requiresApproval && (
              <div style={{ fontSize: 10, color: '#C89030', marginTop: 2 }}>⚠️ 부모님 승인 필요</div>
            )}
          </div>
          <button
            onClick={() => {
              dispatch({ type: 'USE_CONSUMABLE', payload: { itemId: item.id } });
              showMsg(`${item.emoji} ${item.name} 사용!`, true);
            }}
            style={{
              padding: '6px 12px', borderRadius: 4, border: '2px solid #888',
              background: '#3A3010', color: '#FFD060',
              fontWeight: 700, fontSize: 12, fontFamily: 'monospace', cursor: 'pointer',
            }}
          >
            사용
          </button>
        </div>
      ))}
    </div>
  );
}

// ── 꾸미기 패널 ───────────────────────────────────────────────
function CustomizePanel({ state, dispatch, roomTier }) {
  const currentFloor     = state.roomFloor     || 'grass';
  const currentWallpaper = state.roomWallpaper || 'oak';

  const nextTier = ROOM_TIERS.find(t => t.tier === roomTier.tier + 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 방 등급 진행 */}
      <div style={{ background: '#1E1E0E', border: '2px solid #444', borderRadius: 6, padding: 12 }}>
        <div style={{ fontSize: 12, color: '#FFD060', fontFamily: 'monospace', fontWeight: 700, marginBottom: 8 }}>
          🏠 방 등급
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {ROOM_TIERS.map(t => {
            const unlocked = state.totalExp >= t.minExp;
            return (
              <div key={t.tier} style={{
                flex: 1, padding: '6px 4px', borderRadius: 4, textAlign: 'center',
                background: t.tier === roomTier.tier ? '#3A3010' : unlocked ? '#1A2A1A' : '#1A1A1A',
                border: `2px solid ${t.tier === roomTier.tier ? '#FFD060' : unlocked ? '#4A8030' : '#333'}`,
              }}>
                <div style={{ fontSize: 16 }}>{t.emoji}</div>
                <div style={{ fontSize: 9, fontFamily: 'monospace', color: t.tier === roomTier.tier ? '#FFD060' : unlocked ? '#6AAB56' : '#555', marginTop: 2 }}>
                  {t.name}
                </div>
                {!unlocked && (
                  <div style={{ fontSize: 8, color: '#805030', fontFamily: 'monospace' }}>
                    {t.minExp.toLocaleString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {nextTier && (
          <div style={{ marginTop: 8, fontSize: 11, color: '#7A7A5A', fontFamily: 'monospace' }}>
            다음: {nextTier.emoji} {nextTier.name} — {nextTier.minExp.toLocaleString()} EXP 필요
            <div style={{ marginTop: 4, background: '#333', borderRadius: 2, height: 8, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: 'linear-gradient(90deg, #8B6030, #FFD060)',
                width: `${Math.min(100, (state.totalExp / nextTier.minExp) * 100)}%`,
                transition: 'width 0.5s',
              }}/>
            </div>
          </div>
        )}
      </div>

      {/* 바닥 선택 */}
      <div style={{ background: '#1E1E0E', border: '2px solid #444', borderRadius: 6, padding: 12 }}>
        <div style={{ fontSize: 12, color: '#FFD060', fontFamily: 'monospace', fontWeight: 700, marginBottom: 8 }}>
          🧱 바닥 타일
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {ROOM_FLOORS.map(floor => {
            const unlocked = roomTier.tier >= floor.unlockTier;
            const active   = currentFloor === floor.id;
            return (
              <button
                key={floor.id}
                disabled={!unlocked}
                onClick={() => dispatch({ type: 'SET_ROOM_FLOOR', payload: { id: floor.id } })}
                style={{
                  flex: 1, padding: '8px 4px', borderRadius: 4,
                  background: active ? `linear-gradient(135deg, ${floor.color1}, ${floor.color2})` : '#2A2A1A',
                  border: `2px solid ${active ? '#FFD060' : unlocked ? '#555' : '#333'}`,
                  cursor: unlocked ? 'pointer' : 'default',
                  opacity: unlocked ? 1 : 0.4,
                }}
              >
                <div style={{ width: 24, height: 24, borderRadius: 3, margin: '0 auto 4px',
                    background: `linear-gradient(135deg, ${floor.color1}, ${floor.color2})`,
                    border: '2px solid rgba(0,0,0,0.4)' }}/>
                <div style={{ fontSize: 9, fontFamily: 'monospace', color: active ? '#FFD060' : '#888' }}>
                  {floor.name}
                </div>
                {!unlocked && (
                  <div style={{ fontSize: 8, color: '#805030', fontFamily: 'monospace' }}>
                    {ROOM_TIERS[floor.unlockTier - 1].name}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 벽지 선택 */}
      <div style={{ background: '#1E1E0E', border: '2px solid #444', borderRadius: 6, padding: 12 }}>
        <div style={{ fontSize: 12, color: '#FFD060', fontFamily: 'monospace', fontWeight: 700, marginBottom: 8 }}>
          🎨 벽지
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {ROOM_WALLPAPERS.map(wp => {
            const unlocked = roomTier.tier >= wp.unlockTier;
            const active   = currentWallpaper === wp.id;
            return (
              <button
                key={wp.id}
                disabled={!unlocked}
                onClick={() => dispatch({ type: 'SET_ROOM_WALLPAPER', payload: { id: wp.id } })}
                style={{
                  flex: 1, padding: '8px 4px', borderRadius: 4,
                  background: active ? wp.color : '#2A2A1A',
                  border: `2px solid ${active ? '#FFD060' : unlocked ? '#555' : '#333'}`,
                  cursor: unlocked ? 'pointer' : 'default',
                  opacity: unlocked ? 1 : 0.4,
                }}
              >
                <div style={{ width: 24, height: 24, borderRadius: 3, margin: '0 auto 4px',
                    background: wp.color, border: '2px solid rgba(0,0,0,0.4)' }}/>
                <div style={{ fontSize: 9, fontFamily: 'monospace', color: active ? '#111' : '#888' }}>
                  {wp.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── 메인 RoomPage ─────────────────────────────────────────────
export default function RoomPage() {
  const { state, dispatch } = useGame();
  const [tab, setTab]               = useState('room');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [shopView, setShopView]     = useState('buy'); // 'buy' | 'use'
  const [flash, setFlash]           = useState({ text: '', ok: true });

  // 펫 배고픔 일일 감소 체크
  useEffect(() => {
    const pet   = state.pet || {};
    const today = new Date().toISOString().split('T')[0];
    if (pet.lastHungerCheck === today) return;
    const last  = pet.lastHungerCheck ? new Date(pet.lastHungerCheck) : null;
    const days  = last ? Math.max(0, Math.floor((new Date(today) - last) / 86400000)) : 0;
    dispatch({ type: 'PET_DAILY_UPDATE', payload: { today, daysElapsed: days } });
  }, []);

  const roomTier     = getRoomTier(state.totalExp);
  const roomGrid     = state.roomGrid     || {};
  const roomInv      = state.roomInventory || {};
  const pet          = state.pet           || { hunger: 3, treats: 0 };

  function showMsg(text, ok = true) {
    setFlash({ text, ok });
    setTimeout(() => setFlash({ text: '' }), 2200);
  }

  function handleCellTap(cellKey) {
    if (selectedItemId) {
      dispatch({ type: 'PLACE_ROOM_ITEM', payload: { cellKey, itemId: selectedItemId } });
      const item = MC_ROOM_ITEMS.find(i => i.id === selectedItemId);
      showMsg(`${item?.emoji} 배치 완료!`, true);
      setSelectedItemId(null);
    } else if (roomGrid[cellKey]) {
      const item = MC_ROOM_ITEMS.find(i => i.id === roomGrid[cellKey]);
      dispatch({ type: 'REMOVE_ROOM_ITEM', payload: { cellKey } });
      showMsg(`${item?.emoji} 회수했어요`, true);
    }
  }

  const gridInfo     = { cols: roomTier.cols, rows: roomTier.rows };
  const placedCount  = Object.keys(roomGrid).length;
  const maxCells     = gridInfo.cols * gridInfo.rows;
  const hasConsumables = MC_ROOM_ITEMS.some(i => i.category === 'consumable' && (state.roomConsumables?.[i.id] || 0) > 0);

  return (
    <div style={{ padding: '0 12px 24px', background: 'transparent' }}>
      {/* 플래시 메시지 */}
      {flash.text && (
        <div className="mc-item-pop" style={{
          margin: '0 0 10px', padding: '8px 12px', borderRadius: 4,
          border: `2px solid ${flash.ok ? '#4A8030' : '#803020'}`,
          background: flash.ok ? '#1A2A1A' : '#2A1A1A',
          color: flash.ok ? '#6AAB56' : '#D07060',
          fontFamily: 'monospace', fontWeight: 700, fontSize: 13,
          textAlign: 'center',
        }}>
          {flash.text}
        </div>
      )}

      {/* EXP 표시 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', marginBottom: 10,
        background: '#1E1E0E', border: '2px solid #444', borderRadius: 4,
      }}>
        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: '#E8D0A0' }}>
          {roomTier.emoji} {roomTier.name}
        </span>
        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: '#FFD060' }}>
          {state.totalExp.toLocaleString()} EXP
        </span>
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
        <MCTab active={tab==='room'}      onClick={() => setTab('room')}      icon="🏠" label="방" />
        <MCTab active={tab==='shop'}      onClick={() => setTab('shop')}      icon="🛒" label="상점" />
        <MCTab active={tab==='customize'} onClick={() => setTab('customize')} icon="🎨" label="꾸미기" />
      </div>

      {/* ── 방 탭 ── */}
      {tab === 'room' && (
        <div>
          {/* 그리드 */}
          <div style={{ marginBottom: 4 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 6, fontSize: 11, fontFamily: 'monospace',
            }}>
              <span style={{ color: '#8B6030' }}>
                {selectedItemId
                  ? `▶ 빈 칸을 탭해서 ${MC_ROOM_ITEMS.find(i=>i.id===selectedItemId)?.emoji} 배치`
                  : '탭: 배치 | 아이템 탭: 회수'}
              </span>
              <span style={{ color: '#6AAB56' }}>{placedCount}/{maxCells}</span>
            </div>
            <RoomGrid
              grid={roomGrid}
              cols={gridInfo.cols}
              rows={gridInfo.rows}
              floorId={state.roomFloor || 'grass'}
              wallpaperId={state.roomWallpaper || 'oak'}
              selectedItemId={selectedItemId}
              onCellTap={handleCellTap}
            />
          </div>

          {/* 강아지 펫 */}
          <PetSection pet={pet} dispatch={dispatch} />

          {/* 인벤토리 바 */}
          <InventoryBar
            roomInventory={roomInv}
            selectedItemId={selectedItemId}
            onSelect={id => setSelectedItemId(id)}
          />

          {/* 선택 해제 버튼 */}
          {selectedItemId && (
            <button
              onClick={() => setSelectedItemId(null)}
              style={{
                marginTop: 6, width: '100%', padding: '8px',
                background: '#2A2A1A', border: '2px solid #666',
                borderRadius: 4, color: '#AAA',
                fontFamily: 'monospace', fontWeight: 700, fontSize: 12, cursor: 'pointer',
              }}
            >
              ✕ 선택 취소
            </button>
          )}

          {/* 소모형 소지 알림 */}
          {hasConsumables && (
            <button
              onClick={() => { setTab('shop'); setShopView('use'); }}
              style={{
                marginTop: 8, width: '100%', padding: '8px 12px',
                background: '#2A1A0A', border: '2px solid #8B6030',
                borderRadius: 4, color: '#C89030',
                fontFamily: 'monospace', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              ⚗️ 사용 가능한 소모 아이템 있음 → 사용하기
            </button>
          )}
        </div>
      )}

      {/* ── 상점 탭 ── */}
      {tab === 'shop' && (
        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {[
              { id: 'buy',  label: '🛒 구매'  },
              { id: 'use',  label: '⚗️ 사용'  },
            ].map(v => (
              <button key={v.id} onClick={() => setShopView(v.id)} style={{
                flex: 1, padding: '7px 4px',
                background: shopView === v.id ? '#3A3010' : '#1A1A0A',
                border: `2px solid ${shopView === v.id ? '#FFD060' : '#444'}`,
                borderRadius: 4, color: shopView === v.id ? '#FFD060' : '#888',
                fontWeight: 700, fontSize: 12, fontFamily: 'monospace', cursor: 'pointer',
              }}>
                {v.label}
              </button>
            ))}
          </div>
          {shopView === 'buy'
            ? <ShopPanel state={state} dispatch={dispatch} showMsg={showMsg}/>
            : <ConsumableUsePanel state={state} dispatch={dispatch} showMsg={showMsg}/>
          }
        </div>
      )}

      {/* ── 꾸미기 탭 ── */}
      {tab === 'customize' && (
        <CustomizePanel state={state} dispatch={dispatch} roomTier={roomTier}/>
      )}
    </div>
  );
}
