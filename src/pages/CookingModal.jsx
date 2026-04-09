import { useState } from 'react';
import { useGame } from '../store/GameContext';
import { RECIPES } from '../store/gameData';

const ITEM_LABELS = {
  korogSeed:   { name: '코로그 씨앗', emoji: '🌰' },
  hyruleApple: { name: '하이랄 사과', emoji: '🍎' },
  hyrulePike:  { name: '하이랄 농어', emoji: '🐟' },
  ruby:        { name: '루비 광석',   emoji: '💎' },
  eagleFeather:{ name: '독수리 깃털', emoji: '🪶' },
  masterSword: { name: '마스터 소드', emoji: '⚔️' },
};

export default function CookingModal({ onClose }) {
  const { state, dispatch } = useGame();
  const inventory = state.inventory || {};
  const [cooking, setCooking] = useState(null);
  const [done, setDone]       = useState(null);

  function canCook(recipe) {
    return recipe.ingredients.every(ing => (inventory[ing.id] || 0) >= ing.count);
  }

  function handleCook(recipe) {
    if (!canCook(recipe)) return;
    setCooking(recipe.id);
    setTimeout(() => {
      dispatch({ type: 'COOK_RECIPE', payload: { recipeId: recipe.id } });
      setDone(recipe.id);
      setCooking(null);
    }, 1200);
  }

  // 인벤토리 아이템 목록
  const inventoryItems = Object.entries(inventory)
    .filter(([k, v]) => k !== 'masterSword' && v > 0)
    .map(([k, v]) => ({ ...ITEM_LABELS[k], id: k, count: v }));

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 90,
        background: 'rgba(10,5,0,0.75)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: 430,
          borderRadius: '20px 20px 0 0',
          background: 'linear-gradient(180deg, #2A1808 0%, #1A0E04 100%)',
          border: '2px solid rgba(200,140,60,0.5)',
          borderBottom: 'none',
          boxShadow: '0 -8px 32px rgba(200,140,60,0.25)',
          padding: '20px 16px 32px',
          maxHeight: '85vh', overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 32, marginBottom: 4 }}>🍲</div>
          <div style={{
            fontSize: 18, fontWeight: 700, color: '#E8C060',
            fontFamily: 'Cinzel, serif', letterSpacing: '0.06em',
          }}>
            요리 냄비
          </div>
          <div style={{ fontSize: 11, color: 'rgba(232,192,96,0.6)', marginTop: 2 }}>
            재료를 넣고 요리를 만들어요!
          </div>
        </div>

        {/* 인벤토리 */}
        <div style={{
          background: 'rgba(255,200,100,0.08)', borderRadius: 12,
          border: '1px solid rgba(200,140,60,0.3)', padding: 12, marginBottom: 16,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#C8A060', marginBottom: 8 }}>
            📦 보유 재료
          </div>
          {inventoryItems.length === 0 ? (
            <div style={{ fontSize: 12, color: 'rgba(200,160,80,0.5)', textAlign: 'center', padding: '8px 0' }}>
              재료가 없어요. 지역을 탐험해서 모아보세요!
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {inventoryItems.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'rgba(200,140,60,0.15)', borderRadius: 8,
                    border: '1px solid rgba(200,140,60,0.3)', padding: '5px 10px',
                  }}
                >
                  <span style={{ fontSize: 18 }}>{item.emoji}</span>
                  <div>
                    <div style={{ fontSize: 10, color: '#D0A060', fontWeight: 700 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#FFD080', fontFamily: 'Cinzel, serif', fontWeight: 700 }}>×{item.count}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 루비 전환 버튼 */}
        {(inventory.ruby || 0) > 0 && (
          <button
            onClick={() => dispatch({ type: 'CONVERT_RUBY' })}
            style={{
              width: '100%', padding: '10px', marginBottom: 12,
              borderRadius: 10, border: '1.5px solid rgba(220,80,80,0.6)',
              background: 'rgba(180,50,50,0.2)',
              color: '#FF9090', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            💎 루비 광석 1개 → +100 EXP 전환
            <span style={{ fontSize: 10, opacity: 0.7 }}>({inventory.ruby}개 보유)</span>
          </button>
        )}

        {/* 레시피 목록 */}
        <div style={{ fontSize: 12, fontWeight: 700, color: '#C8A060', marginBottom: 10 }}>
          🍳 레시피
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {RECIPES.map(recipe => {
            const available = canCook(recipe);
            const isCooking = cooking === recipe.id;
            const isDone    = done === recipe.id;
            return (
              <div
                key={recipe.id}
                style={{
                  borderRadius: 12,
                  border: `1.5px solid ${available ? 'rgba(200,140,60,0.6)' : 'rgba(100,80,40,0.3)'}`,
                  background: available
                    ? 'rgba(200,140,60,0.12)'
                    : 'rgba(50,30,10,0.3)',
                  padding: '12px 14px',
                  opacity: available ? 1 : 0.6,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{recipe.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#E8C060' }}>{recipe.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(232,192,96,0.7)', marginTop: 2 }}>{recipe.desc}</div>
                    {recipe.note && (
                      <div style={{ fontSize: 10, color: '#FF9090', marginTop: 2 }}>⚠️ {recipe.note}</div>
                    )}
                  </div>
                </div>

                {/* 필요 재료 */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {recipe.ingredients.map(ing => {
                    const have = inventory[ing.id] || 0;
                    const ok   = have >= ing.count;
                    return (
                      <div
                        key={ing.id}
                        style={{
                          fontSize: 11, padding: '3px 8px', borderRadius: 6,
                          background: ok ? 'rgba(106,176,86,0.2)' : 'rgba(200,50,50,0.15)',
                          border: `1px solid ${ok ? 'rgba(106,176,86,0.4)' : 'rgba(200,50,50,0.3)'}`,
                          color: ok ? '#80D060' : '#FF8080',
                          fontWeight: 600,
                        }}
                      >
                        {ing.emoji} {ing.name} ×{ing.count} ({have}/{ing.count})
                      </div>
                    );
                  })}
                </div>

                <button
                  disabled={!available || isCooking}
                  onClick={() => handleCook(recipe)}
                  style={{
                    width: '100%', padding: '9px',
                    borderRadius: 9, border: 'none',
                    background: available
                      ? 'linear-gradient(145deg, #C87820, #E09030)'
                      : 'rgba(80,60,20,0.3)',
                    color: available ? 'white' : 'rgba(200,160,80,0.4)',
                    fontWeight: 700, fontSize: 13, cursor: available ? 'pointer' : 'default',
                  }}
                >
                  {isCooking ? '🍲 요리 중...'
                   : isDone    ? '✓ 완료!'
                   : available ? '🍳 요리하기'
                               : '재료 부족'}
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%', marginTop: 16, padding: '12px',
            borderRadius: 12, border: '1.5px solid rgba(200,140,60,0.4)',
            background: 'transparent',
            color: 'rgba(200,140,60,0.7)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
