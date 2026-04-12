import { useState } from 'react';
import { useGame } from '../store/GameContext';
import SheikahEye from '../components/SheikahEye';

const COUPON_TYPES = [
  { id: 'game10', label: '게임시간 10분 추가', emoji: '🎮' },
  { id: 'pizza',  label: '피자 쿠폰',          emoji: '🍕' },
  { id: 'chips',  label: '포카칩 쿠폰',         emoji: '🍿' },
  { id: 'ramen',  label: '라면 쿠폰',           emoji: '🍜' },
];

// BotW 스타일 탭 버튼
function MenuTab({ active, onClick, emoji, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '8px 2px',
        borderRadius: 8,
        border: 'none',
        background: active
          ? 'linear-gradient(145deg, var(--cream) 0%, var(--parchment) 100%)'
          : 'transparent',
        boxShadow: active ? '0 2px 8px var(--shadow)' : 'none',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ fontSize: 16 }}>{emoji}</div>
      <div style={{ fontSize: 10, fontWeight: 700, color: active ? 'var(--brown-dark)' : 'var(--brown-light)', marginTop: 1 }}>
        {label}
      </div>
    </button>
  );
}

export default function ParentPage() {
  const { state, dispatch, todayQuests } = useGame();
  const [locked, setLocked]     = useState(true);
  const [pwInput, setPwInput]   = useState('');
  const [pwError, setPwError]   = useState(false);
  const [tab, setTab]           = useState('stats');
  const [cheerText, setCheerText] = useState('');
  const [newPw, setNewPw]       = useState('');

  function handleUnlock() {
    if (pwInput === state.parentPassword) {
      setLocked(false); setPwInput(''); setPwError(false);
    } else {
      setPwError(true); setPwInput('');
    }
  }

  function handleGiveCoupon(type) {
    dispatch({ type: 'ADD_COUPON', payload: { id: Date.now(), ...type, given: new Date().toLocaleDateString('ko-KR'), used: false } });
  }

  function handleCheer() {
    if (!cheerText.trim()) return;
    dispatch({ type: 'ADD_CHEER', payload: { message: cheerText.trim() } });
    setCheerText('');
  }

  function handleChangePassword() {
    if (newPw.length === 4 && /^\d{4}$/.test(newPw)) {
      dispatch({ type: 'CHANGE_PASSWORD', payload: { password: newPw } });
      setNewPw('');
      alert('비밀번호가 변경되었습니다!');
    }
  }

  const allToday  = [...todayQuests.morning, ...todayQuests.afternoon];
  const doneToday = allToday.filter(q => q.completed).length;
  const rateToday = Math.round((doneToday / allToday.length) * 100);
  const weekKey   = (() => {
    const d = new Date();
    const jan1 = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
  })();
  const weeklyExp = state.weeklyStats?.[weekKey]?.totalExp || 0;
  const coupons   = state.coupons || [];

  /* ── 잠금 화면 ──────────────────────────────── */
  if (locked) {
    return (
      <div className="px-8 py-10 flex flex-col items-center">
        {/* 쉐이카 슬레이트 느낌 잠금 패널 */}
        <div
          className="w-full max-w-xs p-6 rounded-2xl text-center mb-4"
          style={{
            background: 'linear-gradient(145deg, #1E2E3E 0%, #162030 100%)',
            border: '2px solid var(--blue-sheikah)',
            boxShadow: '0 8px 32px rgba(74,143,191,0.3), inset 0 1px 0 rgba(123,189,224,0.15)',
          }}
        >
          <div className="flex justify-center mb-3">
            <SheikahEye size={48} glow color="#7BBDE0" />
          </div>
          <div
            className="botw-title mb-1"
            style={{ fontSize: 16, color: '#C8E8FF', letterSpacing: '0.08em' }}
          >
            부모님 전용 화면
          </div>
          <div style={{ fontSize: 12, color: 'rgba(200,232,255,0.6)', marginBottom: 20 }}>
            비밀번호 4자리를 입력하세요
          </div>

          {/* 입력 표시 */}
          <div className="flex gap-3 justify-center mb-4">
            {[0,1,2,3].map(i => (
              <div
                key={i}
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  border: '1.5px solid var(--blue-sheikah)',
                  background: pwInput[i] ? 'rgba(74,143,191,0.3)' : 'rgba(30,46,62,0.8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, color: '#7BBDE0',
                }}
              >
                {pwInput[i] ? '●' : ''}
              </div>
            ))}
          </div>

          {pwError && (
            <div style={{ color: '#FF9090', fontSize: 12, marginBottom: 12 }}>
              비밀번호가 틀렸어요!
            </div>
          )}

          {/* 키패드 */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k, i) => (
              <button
                key={i}
                onClick={() => {
                  if (k === '⌫') setPwInput(p => p.slice(0,-1));
                  else if (k !== '' && pwInput.length < 4) setPwInput(p => p + k);
                }}
                style={{
                  height: 44, borderRadius: 8, fontWeight: 700, fontSize: 18,
                  border: '1px solid rgba(74,143,191,0.4)',
                  background: k === '' ? 'transparent' : 'rgba(74,143,191,0.15)',
                  color: '#C8E8FF', cursor: k === '' ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                  visibility: k === '' ? 'hidden' : 'visible',
                }}
              >
                {k}
              </button>
            ))}
          </div>

          <button
            onClick={handleUnlock}
            style={{
              width: '100%', padding: '12px',
              borderRadius: 10, border: '1.5px solid var(--blue-sheikah)',
              background: 'linear-gradient(145deg, rgba(74,143,191,0.4), rgba(42,80,160,0.5))',
              color: '#C8E8FF', fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}
          >
            입력
          </button>
        </div>
      </div>
    );
  }

  /* ── 메인 부모 화면 ──────────────────────────── */
  return (
    <div className="px-4 pb-8">
      {/* 잠금 버튼 */}
      <div className="flex justify-end mb-3">
        <button
          onClick={() => setLocked(true)}
          className="botw-btn px-3 py-1.5"
          style={{ fontSize: 12 }}
        >
          🔒 잠금
        </button>
      </div>

      {/* 탭 바 */}
      <div
        className="flex mb-4 p-1.5 rounded-xl"
        style={{ background: 'rgba(245,237,216,0.7)', border: '1.5px solid var(--cream-border)' }}
      >
        <MenuTab active={tab==='stats'}    onClick={() => setTab('stats')}    emoji="📊" label="현황" />
        <MenuTab active={tab==='coupon'}   onClick={() => setTab('coupon')}   emoji="🎟️" label="쿠폰" />
        <MenuTab active={tab==='recipe'}   onClick={() => setTab('recipe')}   emoji="🍲" label="요리" />
        <MenuTab active={tab==='room'}     onClick={() => setTab('room')}     emoji="🏠" label="방" />
        <MenuTab active={tab==='cheer'}    onClick={() => setTab('cheer')}    emoji="💌" label="응원" />
        <MenuTab active={tab==='settings'} onClick={() => setTab('settings')} emoji="⚙️" label="설정" />
      </div>

      {/* ─ 현황 탭 ─ */}
      {tab === 'stats' && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji:'📅', value: `${rateToday}%`, sub: `${doneToday}/${allToday.length}개 완료`, label: '오늘 완료율' },
              { emoji:'⚡', value: weeklyExp.toLocaleString(), sub: '이번 주 획득', label: '주간 EXP' },
            ].map(s => (
              <div key={s.label} className="botw-panel p-4 text-center">
                <div style={{ fontSize: 26 }}>{s.emoji}</div>
                <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 22, color: 'var(--amber)', margin: '4px 0' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: 'var(--brown-light)' }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--brown-mid)', fontWeight: 600 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {[
            { label: '☀️ 오전 퀘스트', quests: todayQuests.morning },
            { label: '🌙 오후 퀘스트', quests: todayQuests.afternoon },
          ].map(section => (
            <div key={section.label} className="botw-panel p-4">
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--brown-mid)', marginBottom: 10 }}>
                {section.label}
              </div>
              {section.quests.map(q => (
                <div
                  key={q.id}
                  className="flex items-center gap-2 py-2"
                  style={{ borderBottom: '1px solid var(--cream-dark)' }}
                >
                  <span style={{ fontSize: 16 }}>{q.completed ? '✅' : '⬜'}</span>
                  <span style={{ flex: 1, fontSize: 13, color: 'var(--brown-dark)' }}>{q.emoji} {q.title}</span>
                  <span style={{ fontSize: 11, color: 'var(--amber)', fontFamily: 'Cinzel, serif' }}>+{q.exp}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ─ 쿠폰 탭 ─ */}
      {tab === 'coupon' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {COUPON_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => handleGiveCoupon(type)}
                className="botw-btn p-4 text-center"
              >
                <div style={{ fontSize: 28, marginBottom: 4 }}>{type.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brown-dark)' }}>{type.label}</div>
                <div style={{ fontSize: 11, color: 'var(--green-hyrule)', fontWeight: 600, marginTop: 2 }}>지급하기</div>
              </button>
            ))}
          </div>

          <div className="botw-panel p-4">
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--brown-mid)', marginBottom: 10 }}>
              🎟️ 보유 쿠폰 ({coupons.filter(c => !c.used).length}장)
            </div>
            {coupons.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--brown-light)', fontSize: 13, padding: 16 }}>쿠폰이 없어요</div>
            ) : (
              <div className="flex flex-col gap-2">
                {coupons.map(c => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{
                      background: c.used ? 'rgba(200,169,106,0.1)' : 'rgba(245,237,216,0.7)',
                      border: '1px solid var(--cream-border)',
                      opacity: c.used ? 0.5 : 1,
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{c.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--brown-dark)' }}>{c.label}</div>
                      <div style={{ fontSize: 10, color: 'var(--brown-light)' }}>{c.given}</div>
                    </div>
                    {!c.used ? (
                      <button
                        onClick={() => dispatch({ type: 'USE_COUPON', payload: { id: c.id } })}
                        className="botw-btn px-3 py-1"
                        style={{ fontSize: 11, color: '#B06060', borderColor: '#D07070' }}
                      >
                        사용
                      </button>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--brown-light)' }}>사용됨</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─ 요리 승인 탭 ─ */}
      {tab === 'recipe' && (
        <div className="flex flex-col gap-4">
          <div className="botw-panel p-4">
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--brown-mid)', marginBottom: 4 }}>
              🍲 요리 승인 대기
            </div>
            <div style={{ fontSize: 12, color: 'var(--brown-light)', marginBottom: 12 }}>
              지후가 요청한 요리를 확인하고 승인하세요.
            </div>
            {(state.pendingRecipes || []).length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--brown-light)', fontSize: 13, padding: '16px 0' }}>
                승인 대기 중인 요리가 없어요
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {(state.pendingRecipes || []).map(pending => (
                  <div key={pending.pendingId}
                    style={{
                      background: 'rgba(200,140,60,0.1)', border: '1.5px solid rgba(200,140,60,0.4)',
                      borderRadius: 12, padding: '12px 14px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--brown-dark)' }}>
                        ❤️ 하트 회복 요리
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--brown-light)' }}>{pending.requestedAt}</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--brown-mid)', marginBottom: 10 }}>
                      미완료 퀘스트 1개를 자동으로 완료합니다.
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => dispatch({ type: 'APPROVE_RECIPE', payload: { pendingId: pending.pendingId } })}
                        className="botw-btn-amber botw-btn flex-1 py-2"
                        style={{ fontSize: 13 }}
                      >
                        ✓ 승인
                      </button>
                      <button
                        onClick={() => dispatch({ type: 'REJECT_RECIPE', payload: { pendingId: pending.pendingId } })}
                        style={{
                          flex: 1, padding: '8px', borderRadius: 10,
                          border: '1.5px solid #D07070', background: 'rgba(210,80,80,0.1)',
                          color: '#B06060', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                        }}
                      >
                        ✗ 거절
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─ 방 아이템 승인 탭 ─ */}
      {tab === 'room' && (
        <div className="flex flex-col gap-4">
          <div className="botw-panel p-4">
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--brown-mid)', marginBottom: 4 }}>
              📜 순간이동 주문서 승인 대기
            </div>
            <div style={{ fontSize: 12, color: 'var(--brown-light)', marginBottom: 12 }}>
              지후가 요청한 퀘스트 면제를 확인하고 승인하세요.
            </div>
            {(state.pendingConsumables || []).length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--brown-light)', fontSize: 13, padding: '16px 0' }}>
                승인 대기 중인 요청이 없어요
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {(state.pendingConsumables || []).map(pending => (
                  <div key={pending.id}
                    style={{
                      background: 'rgba(130,90,30,0.1)', border: '1.5px solid rgba(200,140,60,0.5)',
                      borderRadius: 12, padding: '12px 14px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--brown-dark)' }}>
                        📜 순간이동 주문서 — 퀘스트 1개 면제
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--brown-light)' }}>{pending.requestedAt}</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--brown-mid)', marginBottom: 10 }}>
                      오늘 미완료 퀘스트 1개를 자동으로 완료합니다.
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => dispatch({ type: 'APPROVE_CONSUMABLE', payload: { pendingId: pending.id } })}
                        className="botw-btn-amber botw-btn flex-1 py-2"
                        style={{ fontSize: 13 }}
                      >
                        ✓ 승인
                      </button>
                      <button
                        onClick={() => dispatch({ type: 'REJECT_CONSUMABLE', payload: { pendingId: pending.id } })}
                        style={{
                          flex: 1, padding: '8px', borderRadius: 10,
                          border: '1.5px solid #D07070', background: 'rgba(210,80,80,0.1)',
                          color: '#B06060', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                        }}
                      >
                        ✗ 거절 (아이템 환불)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─ 응원 탭 ─ */}
      {tab === 'cheer' && (
        <div className="flex flex-col gap-4">
          <div className="botw-panel p-4">
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--brown-mid)', marginBottom: 4 }}>
              💌 지후에게 응원 메시지
            </div>
            <div style={{ fontSize: 12, color: 'var(--brown-light)', marginBottom: 12 }}>
              앱에 팝업으로 나타납니다!
            </div>

            <div className="flex flex-col gap-2 mb-3">
              {[
                '지후야, 오늘도 정말 잘했어! 💪',
                '엄마/아빠가 지후 너무 자랑스러워! 🌟',
                '오늘 퀘스트 완료! 최고야! ⚔️',
                '지후는 진짜 용사야! 화이팅! 🦸',
              ].map(msg => (
                <button
                  key={msg}
                  onClick={() => setCheerText(msg)}
                  className="botw-btn p-3 text-left"
                  style={{ fontSize: 13 }}
                >
                  {msg}
                </button>
              ))}
            </div>

            <textarea
              value={cheerText}
              onChange={e => setCheerText(e.target.value)}
              placeholder="직접 입력하세요..."
              style={{
                width: '100%', padding: 12, borderRadius: 10, resize: 'none', height: 80,
                border: '1.5px solid var(--cream-border)',
                background: 'rgba(245,237,216,0.8)',
                color: 'var(--brown-dark)', fontSize: 13,
                outline: 'none', fontFamily: 'inherit',
              }}
            />

            <button
              onClick={handleCheer}
              disabled={!cheerText.trim()}
              className="botw-btn-amber botw-btn w-full py-3 mt-3"
              style={{ fontSize: 14, opacity: cheerText.trim() ? 1 : 0.5 }}
            >
              💌 응원 보내기
            </button>
          </div>
        </div>
      )}

      {/* ─ 설정 탭 ─ */}
      {tab === 'settings' && (
        <div className="flex flex-col gap-4">
          <div className="botw-panel p-4">
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--brown-mid)', marginBottom: 12 }}>
              🔑 비밀번호 변경
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={newPw}
                onChange={e => setNewPw(e.target.value.slice(0,4))}
                placeholder="새 4자리"
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: 10, textAlign: 'center',
                  border: '1.5px solid var(--cream-border)', fontSize: 20, letterSpacing: '0.2em',
                  background: 'rgba(245,237,216,0.8)', color: 'var(--brown-dark)', outline: 'none',
                }}
              />
              <button onClick={handleChangePassword} className="botw-btn-amber botw-btn px-4">
                변경
              </button>
            </div>
          </div>

          {/* 개발자 미리보기 */}
          <div
            className="p-4 rounded-2xl"
            style={{
              border: `1.5px solid ${state.devPreview ? '#70A070' : '#7090C0'}`,
              background: state.devPreview ? 'rgba(80,160,80,0.07)' : 'rgba(80,110,200,0.06)',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 14, color: state.devPreview ? '#508050' : '#6070A0', marginBottom: 6 }}>
              🧪 개발자 미리보기 {state.devPreview ? '(ON)' : '(OFF)'}
            </div>
            <div style={{ fontSize: 12, color: state.devPreview ? '#508050' : '#6070A0', opacity: 0.85, marginBottom: 10 }}>
              {state.devPreview
                ? '모든 지역·아이템·몬스터가 활성화된 상태입니다. 다시 누르면 초기화.'
                : '지도 테스트용: 모든 지역 오픈 + 전 아이템 지급 + 몬스터 전부 등장'}
            </div>
            <button
              onClick={() => dispatch({ type: state.devPreview ? 'DEV_PREVIEW_OFF' : 'DEV_PREVIEW_ON' })}
              style={{
                width: '100%', padding: '10px', borderRadius: 10,
                border: `1.5px solid ${state.devPreview ? '#70A070' : '#7090C0'}`,
                background: state.devPreview ? 'rgba(80,160,80,0.15)' : 'rgba(80,110,200,0.12)',
                color: state.devPreview ? '#508050' : '#6070A0',
                fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}
            >
              {state.devPreview ? '🔄 초기화 (OFF)' : '🧪 미리보기 ON'}
            </button>
          </div>

          <div
            className="p-4 rounded-2xl"
            style={{ border: '1.5px solid #D07070', background: 'rgba(210,80,80,0.06)' }}
          >
            <div style={{ fontWeight: 700, fontSize: 14, color: '#B06060', marginBottom: 6 }}>
              ⚠️ 오늘 퀘스트 초기화
            </div>
            <div style={{ fontSize: 12, color: '#B06060', opacity: 0.8, marginBottom: 10 }}>
              오늘 완료한 퀘스트가 모두 리셋됩니다.
            </div>
            <button
              onClick={() => {
                if (window.confirm('오늘 퀘스트를 초기화할까요?')) dispatch({ type: 'RESET_TODAY' });
              }}
              style={{
                width: '100%', padding: '10px', borderRadius: 10,
                border: '1.5px solid #D07070', background: 'rgba(210,80,80,0.12)',
                color: '#B06060', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}
            >
              초기화
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
