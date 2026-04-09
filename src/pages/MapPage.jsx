import { useState } from 'react';
import { useGame } from '../store/GameContext';
import { MAP_REGIONS, getTodayKey, getCurrentAppWeek, getWeeklyCompletionRates } from '../store/gameData';
import CharacterSprite from '../components/CharacterSprite';
import MonsterSprite from '../components/MonsterSprite';
import CookingModal from './CookingModal';

/* ══════════════════════════════════════════════
   마커 좌표 & 안개 반경
══════════════════════════════════════════════ */
const MARKERS = {
  rito:     { x: 60,  y: 168, fogR: 75 },
  goron:    { x: 185, y: 80,  fogR: 68 },
  kakariko: { x: 248, y: 134, fogR: 63 },
  zora:     { x: 303, y: 106, fogR: 65 },
  hestou:   { x: 316, y: 228, fogR: 72 },
  hyrule:   { x: 183, y: 196, fogR: 85 },
};

function getRegionFogOpacity(region, unlockedRegions, devPreview, weekRates, currentWeek) {
  if (devPreview || unlockedRegions.includes(region.id)) return 0;
  if (region.unlockCondition === 'fullMonth') return 0.92;
  const [w1, w2] = region.unlockWeeks;
  if (currentWeek >= w1 && currentWeek <= w2) {
    const r1 = weekRates[w1] ?? 0;
    const r2 = currentWeek > w1 ? (weekRates[w2] ?? 0) : 0;
    const progress = currentWeek === w1 ? r1 : (r1 + r2) / 2;
    return Math.max(0.92 - (Math.min(progress, 0.7) / 0.7) * 0.70, 0.22);
  }
  return 0.92;
}

/* ══════════════════════════════════════════════
   낚시 미니게임
══════════════════════════════════════════════ */
function FishingModal({ onClose }) {
  const { dispatch, state } = useGame();
  const [phase, setPhase] = useState('idle');
  const [caught, setCaught] = useState(null);
  const todayKey = getTodayKey();
  const alreadyFished = state.lastFishingDate === todayKey;

  function handleCast() {
    setPhase('casting');
    setTimeout(() => setPhase('wait'), 800);
    setTimeout(() => setPhase('bite'), 800 + 1500 + Math.random() * 2500);
  }
  function handlePull() {
    if (phase !== 'bite') return;
    const ok = Math.random() > 0.3;
    setCaught(ok);
    setPhase('result');
    if (ok) dispatch({ type: 'CATCH_FISH' });
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:90,
                  background:'rgba(0,14,32,0.93)',
                  display:'flex', alignItems:'center', justifyContent:'center' }}
         onClick={phase === 'result' ? onClose : undefined}>
      <div style={{ width:290, borderRadius:20, padding:'24px 20px 20px',
                    background:'linear-gradient(180deg,#081828,#030C14)',
                    border:'2px solid rgba(74,143,191,0.6)',
                    boxShadow:'0 0 40px rgba(74,143,191,0.3),inset 0 0 30px rgba(0,0,0,0.5)',
                    textAlign:'center' }}
           onClick={e => e.stopPropagation()}>
        <div style={{ fontSize:13, fontWeight:700, color:'#7BBDE0',
                      fontFamily:'Cinzel,serif', marginBottom:16, letterSpacing:'0.1em' }}>
          ✦ 조라의 영역 낚시터 ✦
        </div>
        {alreadyFished && phase === 'idle' ? (
          <div style={{ color:'#7BBDE0', fontSize:13, padding:'20px 0' }}>
            <div style={{ fontSize:36, marginBottom:8 }}>🐟</div>
            오늘은 이미 낚시했어요!<br/>내일 다시 도전해봐요.
          </div>
        ) : (
          <>
            <div style={{ height:120, background:'linear-gradient(180deg,#092840,#041820)',
                          borderRadius:12, marginBottom:14, position:'relative',
                          border:'1px solid rgba(74,143,191,0.3)', overflow:'hidden' }}>
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:55,
                            background:'rgba(30,80,140,0.35)',
                            borderTop:'1px solid rgba(74,143,191,0.2)' }}/>
              {[20,60,120,180,240].map((x,i) => (
                <div key={i} style={{ position:'absolute', left:x, top:90+i%2*4,
                                      width:20, height:2,
                                      background:'rgba(100,180,240,0.25)', borderRadius:1 }}/>
              ))}
              {phase !== 'idle' && (
                <div style={{ position:'absolute', top: phase==='bite' ? 58 : 44, left:'50%',
                              transform:'translateX(-50%)', fontSize:16, transition:'top 0.3s' }}>
                  {phase==='bite' ? '🔴' : '⚪'}
                </div>
              )}
              {phase !== 'idle' && (
                <div style={{ position:'absolute', top:0, left:'50%', width:2,
                              height: phase==='bite' ? 60 : 46,
                              background:'rgba(200,200,200,0.45)', transition:'height 0.3s' }}/>
              )}
              {(phase==='wait'||phase==='bite') && (
                <div style={{ position:'absolute', bottom:14, left:'42%', fontSize:20,
                              transform: phase==='bite' ? 'translateX(12px)' : 'none',
                              transition:'transform 0.3s' }}>🐟</div>
              )}
            </div>
            <div style={{ fontSize:13, color:'#7BBDE0', marginBottom:14, minHeight:36,
                          display:'flex', alignItems:'center', justifyContent:'center' }}>
              {phase==='idle'    && '낚싯대를 던져보세요!'}
              {phase==='casting' && '낚싯대 던지는 중...'}
              {phase==='wait'    && '물고기를 기다리는 중...'}
              {phase==='bite'    && <span style={{ color:'#FFD060', fontWeight:700, fontSize:14 }}>🐠 물었다! 지금 당겨!</span>}
              {phase==='result'  && (caught
                ? <span style={{ color:'#80FF80', fontWeight:700 }}>🎉 하이랄 농어 획득!</span>
                : <span style={{ color:'#FF8080' }}>아쉽! 놓쳤어요...</span>)}
            </div>
            {phase==='idle' && !alreadyFished && (
              <button onClick={handleCast}
                style={{ width:'100%', padding:'12px', borderRadius:12, cursor:'pointer',
                          background:'linear-gradient(145deg,#1A6090,#0A4060)',
                          border:'1.5px solid rgba(74,143,191,0.5)',
                          color:'white', fontWeight:700, fontSize:14 }}>
                🎣 낚싯대 던지기
              </button>
            )}
            {phase==='bite' && (
              <button onClick={handlePull}
                style={{ width:'100%', padding:'12px', borderRadius:12, cursor:'pointer',
                          background:'linear-gradient(145deg,#D4820A,#F0A830)',
                          border:'none', color:'white', fontWeight:700, fontSize:14 }}>
                ⬆️ 당기기!
              </button>
            )}
            {phase==='result' && (
              <button onClick={onClose}
                style={{ width:'100%', padding:'12px', borderRadius:12, cursor:'pointer',
                          background:'rgba(74,143,191,0.2)',
                          border:'1.5px solid rgba(74,143,191,0.4)',
                          color:'#7BBDE0', fontWeight:700, fontSize:14 }}>
                돌아가기
              </button>
            )}
          </>
        )}
        {(phase==='idle' || alreadyFished) && (
          <button onClick={onClose}
            style={{ width:'100%', marginTop:10, padding:'10px', borderRadius:12, cursor:'pointer',
                      background:'transparent', border:'1px solid rgba(74,143,191,0.3)',
                      color:'rgba(74,143,191,0.6)', fontSize:13 }}>
            닫기
          </button>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   지역 상세 팝업
══════════════════════════════════════════════ */
function RegionPopup({ regionId, onClose }) {
  const { state } = useGame();
  const region    = MAP_REGIONS.find(r => r.id === regionId);
  const monsters  = state.monsters || {};
  const inventory = state.inventory || {};
  const unlocked  = (state.unlockedRegions || []).includes(regionId) || state.devPreview;
  const ms        = monsters[regionId];
  const itemId    = region.item?.id;
  const hasItem   = itemId === 'masterSword' ? inventory.masterSword : (inventory[itemId] || 0) > 0;
  const hpPct     = ms ? Math.max((ms.currentHp / region.monster.maxHp) * 100, 0) : 100;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:80, background:'rgba(0,0,0,0.65)',
                  display:'flex', alignItems:'flex-end', justifyContent:'center' }}
         onClick={onClose}>
      <div style={{ width:'100%', maxWidth:430, borderRadius:'20px 20px 0 0',
                    background:'linear-gradient(180deg,#0C1A2E,#07101C)',
                    border:'2px solid rgba(74,143,191,0.55)', borderBottom:'none',
                    boxShadow:'0 -10px 40px rgba(74,143,191,0.2)',
                    padding:'20px 18px 36px' }}
           onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
          <div style={{ width:52, height:52, borderRadius:12,
                        background:'rgba(74,143,191,0.1)',
                        border:'1px solid rgba(74,143,191,0.3)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:30,
                        filter: unlocked ? 'none' : 'grayscale(1) brightness(0.28)' }}>
            {region.emoji}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:17, fontWeight:700, fontFamily:'Cinzel,serif',
                          color: unlocked ? '#A8D8F0' : '#3A4A5A', letterSpacing:'0.04em' }}>
              {unlocked ? region.name : '??? 미발견 지역'}
            </div>
            <div style={{ fontSize:11, color:'rgba(123,189,224,0.55)', marginTop:3, lineHeight:1.5 }}>
              {unlocked ? region.desc : (
                region.unlockCondition === 'fullMonth'
                  ? '30일 개근 달성 시 해제'
                  : `${region.unlockWeeks[0]}~${region.unlockWeeks[1]}주차 70% 이상 달성 시 해제`
              )}
            </div>
          </div>
          <button onClick={onClose}
            style={{ background:'none', border:'none', color:'rgba(123,189,224,0.5)',
                      fontSize:22, cursor:'pointer', padding:4, lineHeight:1 }}>✕</button>
        </div>
        <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(74,143,191,0.4),transparent)',
                      marginBottom:14 }}/>
        {unlocked ? (
          <>
            <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
                          background:'rgba(74,143,191,0.08)',
                          border:'1px solid rgba(74,143,191,0.28)', borderRadius:12, marginBottom:10 }}>
              <span style={{ fontSize:30 }}>{region.item.emoji}</span>
              <div>
                <div style={{ fontSize:10, color:'rgba(123,189,224,0.55)', letterSpacing:'0.08em' }}>획득 아이템</div>
                <div style={{ fontSize:15, fontWeight:700, color:'#C8E4FF', marginTop:2 }}>{region.item.name}</div>
              </div>
              {hasItem && (
                <div style={{ marginLeft:'auto', padding:'4px 10px', borderRadius:20,
                              background:'rgba(60,160,80,0.2)', border:'1px solid rgba(60,160,80,0.4)',
                              fontSize:10, color:'#6AC070', fontWeight:700 }}>
                  ✦ 보유
                </div>
              )}
            </div>
            {ms && (
              <div style={{ background: ms.defeated ? 'rgba(60,130,60,0.08)' : 'rgba(180,50,50,0.08)',
                            border:`1px solid ${ms.defeated ? 'rgba(100,180,80,0.35)' : 'rgba(180,60,60,0.3)'}`,
                            borderRadius:12, padding:'12px 14px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10,
                              marginBottom: ms.defeated ? 0 : 10 }}>
                  <MonsterSprite type={region.monster.type} size={56}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700,
                                  color: ms.defeated ? '#70C070' : '#FF9898' }}>
                      {ms.defeated ? `✦ ${region.monster.name} 처치 완료!` : region.monster.name}
                    </div>
                    <div style={{ fontSize:11, color:'rgba(200,120,120,0.7)', marginTop:2 }}>
                      {ms.defeated ? `+${region.monster.defeatExp} EXP 획득` : `처치 시 +${region.monster.defeatExp} EXP`}
                    </div>
                  </div>
                </div>
                {!ms.defeated && (
                  <>
                    <div style={{ display:'flex', justifyContent:'space-between',
                                  fontSize:10, color:'rgba(200,100,100,0.7)', marginBottom:5 }}>
                      <span>HP</span>
                      <span style={{ fontWeight:700, fontFamily:'Cinzel,serif' }}>
                        {ms.currentHp} / {region.monster.maxHp}
                      </span>
                    </div>
                    <div style={{ height:8, borderRadius:4, background:'rgba(0,0,0,0.4)', overflow:'hidden' }}>
                      <div style={{ height:'100%', borderRadius:4, width:`${hpPct}%`,
                                    transition:'width 0.6s ease',
                                    background: hpPct > 50 ? '#3D7A45' : hpPct > 25 ? '#D4820A' : '#D44040' }}/>
                    </div>
                    <div style={{ fontSize:10, color:'rgba(200,100,100,0.45)', marginTop:6, textAlign:'center' }}>
                      ⚔️ 퀘스트 1개 완료 = -1 HP &nbsp;•&nbsp; 연속 3일 완료 = -3 추가
                    </div>
                  </>
                )}
              </div>
            )}
            {region.bonus === 'fishing' && (
              <div style={{ marginTop:10, fontSize:12, color:'#7BBDE0', textAlign:'center',
                            padding:'8px', background:'rgba(74,143,191,0.1)',
                            borderRadius:8, border:'1px solid rgba(74,143,191,0.3)' }}>
                🎣 낚시 미니게임 해제!
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign:'center', padding:'28px 0 12px',
                        color:'rgba(123,189,224,0.4)', fontSize:13, lineHeight:1.8 }}>
            <div style={{ fontSize:32, marginBottom:12, opacity:0.25 }}>🌫️</div>
            이 지역은 아직 안개 속에 잠겨 있습니다.<br/>
            <span style={{ color:'rgba(123,189,224,0.65)', fontWeight:700 }}>
              퀘스트를 완료해서 지역을 해제하세요!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   하이랄 SVG 지형 — BotW 양피지 지도 스타일
══════════════════════════════════════════════ */
function HyruleTerrain({ unlockedRegions, devPreview, weekRates, currentWeek }) {
  const FOG = '#2A2010'; // 짙은 세피아 안개

  return (
    <svg viewBox="0 0 360 460" style={{ width:'100%', display:'block' }}>
      <defs>
        {/* ── 필터 ── */}
        <filter id="fog-blur" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15"/>
        </filter>
        <filter id="castle-halo" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="lava-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* ── 양피지 배경 ── */}
        <linearGradient id="parchment-bg" x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0%" stopColor="#E2C97A"/>
          <stop offset="40%" stopColor="#D9BC68"/>
          <stop offset="100%" stopColor="#C9A850"/>
        </linearGradient>

        {/* ── 지형 그라디언트 ── */}
        <radialGradient id="plains-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9FC458" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#7AA038" stopOpacity="0.6"/>
        </radialGradient>
        <radialGradient id="volcano-glow" cx="50%" cy="75%" r="55%">
          <stop offset="0%" stopColor="#FF5500" stopOpacity="0.88"/>
          <stop offset="55%" stopColor="#CC2200" stopOpacity="0.36"/>
          <stop offset="100%" stopColor="#880000" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="castle-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7AC8FF" stopOpacity="0.58"/>
          <stop offset="100%" stopColor="#4488CC" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="lake-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3890E8" stopOpacity="0.72"/>
          <stop offset="100%" stopColor="#0E50A0" stopOpacity="0"/>
        </radialGradient>

        {/* ── 비네팅 (따뜻한 세피아) ── */}
        <radialGradient id="vignette" cx="50%" cy="46%" r="66%">
          <stop offset="46%" stopColor="rgba(180,138,50,0)"/>
          <stop offset="100%" stopColor="rgba(50,28,5,0.88)"/>
        </radialGradient>
      </defs>

      {/* ══ L1: 양피지 기본 배경 ══ */}
      <rect width="360" height="460" fill="url(#parchment-bg)"/>

      {/* 양피지 노화 반점 */}
      {[
        [38,76,18],[118,28,22],[278,48,20],[322,116,16],[348,198,24],[328,338,20],
        [276,418,22],[138,438,18],[58,376,21],[18,258,19],[198,18,24],[148,458,16],
        [80,200,14],[260,310,16],[180,420,12]
      ].map(([x,y,r],i) => (
        <circle key={i} cx={x} cy={y} r={r}
          fill="#9A7230" opacity={0.04 + i%4*0.015}/>
      ))}

      {/* 양피지 가장자리 잉크 얼룩 */}
      <rect width="360" height="460" fill="#8A6020" opacity="0.07"/>

      {/* ══ L2: 바다 영역 (대륙 외부, 살짝 어두운 양피지) ══ */}
      {/* 바다는 양피지보다 약간 어두운 청회색 잉크 워시 */}
      <path d="M 0 0 L 360 0 L 360 460 L 0 460 Z" fill="#A89050" opacity="0.18"/>

      {/* 바다 잔물결 (잉크 선) */}
      {[
        [14,20],[52,14],[108,18],[168,12],[228,16],[290,12],[336,18],
        [8,52],[66,46],[142,50],[210,44],[278,48],[340,52],
        [10,326],[50,338],[106,330],[164,342],[224,334],[302,340],
        [16,392],[74,402],[138,394],[200,404],[268,396],[330,404],
        [20,446],[84,452],[168,448],[252,454],[320,448],
      ].map(([x,y],i) => (
        <path key={i} d={`M${x},${y} Q${x+12},${y-3} ${x+24},${y}`}
          stroke="#8A6C20" strokeWidth="1.2" fill="none" opacity="0.3"/>
      ))}

      {/* ══ L3: 주 대륙 기반 ══ */}
      <path d="
        M 44 432 Q 18 386 10 310 Q 2 244 18 176
        Q 34 116 72 74 Q 104 46 152 32
        Q 200 22 246 40 Q 284 54 310 86
        Q 336 116 346 158 Q 356 202 352 258
        Q 350 320 328 368 Q 304 416 274 442
        Q 244 462 196 464 Q 148 464 106 448
        Q 66 434 44 432 Z
      " fill="#D4B862"/>

      {/* 대륙 테두리 (잉크) */}
      <path d="
        M 44 432 Q 18 386 10 310 Q 2 244 18 176
        Q 34 116 72 74 Q 104 46 152 32
        Q 200 22 246 40 Q 284 54 310 86
        Q 336 116 346 158 Q 356 202 352 258
        Q 350 320 328 368 Q 304 416 274 442
        Q 244 462 196 464 Q 148 464 106 448
        Q 66 434 44 432 Z
      " fill="none" stroke="#7A5818" strokeWidth="1.8" opacity="0.55"/>

      {/* 대륙 내부 등고선 */}
      <path d="M 70 390 Q 48 360 36 312 Q 24 264 36 210 Q 52 158 88 118 Q 120 84 158 66 Q 196 50 238 62 Q 272 72 296 98 Q 322 128 334 168 Q 344 206 342 252 Q 340 308 322 352"
        fill="none" stroke="#8A6820" strokeWidth="1.2" opacity="0.22"/>
      <path d="M 90 408 Q 68 376 58 330 Q 48 284 58 238 Q 74 186 108 148 Q 140 112 178 94 Q 214 76 248 88 Q 280 100 302 124 Q 326 152 336 188 Q 346 224 344 268"
        fill="none" stroke="#8A6820" strokeWidth="0.8" opacity="0.14"/>

      {/* ══ L4: 헤브라 산맥 / 리토 마을 (NW) - 회색 산악 ══ */}
      <path d="
        M 10 314 Q 6 252 18 178 Q 34 116 70 76
        Q 90 54 118 48 L 116 92
        Q 96 118 70 152 Q 48 186 28 224
        Q 12 254 10 286 Z
      " fill="#9898A4" opacity="0.82"/>

      {/* 산맥 음영 */}
      <path d="M 22 206 Q 38 186 62 174 Q 76 168 84 180 Q 88 194 74 208" fill="#7878848" opacity="0.75"/>
      <path d="M 30 244 Q 46 226 66 216 Q 80 212 84 224 Q 86 238 72 248" fill="#7878848" opacity="0.7"/>
      <path d="M 22 206 Q 38 186 62 174 Q 76 168 84 180 Q 88 194 74 208" fill="#7A7A88"/>
      <path d="M 30 244 Q 46 226 66 216 Q 80 212 84 224 Q 86 238 72 248" fill="#7A7A88" opacity="0.8"/>
      <path d="M 20 270 Q 36 256 54 250 Q 66 248 68 258 Q 70 268 58 276" fill="#7A7A88" opacity="0.65"/>

      {/* 눈 덮인 봉우리 */}
      {[
        [56,68,15],[78,52,17],[100,62,14],[48,94,12],[76,86,13],[42,80,11],[64,104,10]
      ].map(([x,y,s],i) => (
        <g key={i}>
          <polygon points={`${x},${y-s} ${x-s*0.88},${y+5} ${x+s*0.88},${y+5}`}
            fill="#848490" opacity="0.9"/>
          <polygon points={`${x},${y-s} ${x-s*0.5},${y-s*0.32} ${x+s*0.5},${y-s*0.32}`}
            fill="#DFF0F8" opacity="0.96"/>
          <polygon points={`${x},${y-s} ${x-s*0.2},${y-s*0.7} ${x+s*0.2},${y-s*0.7}`}
            fill="#F4FAFF" opacity="0.99"/>
          <polygon points={`${x-s*0.08},${y-s*0.96} ${x-s*0.88},${y+5} ${x-s*0.08},${y+5}`}
            fill="#606068" opacity="0.22"/>
        </g>
      ))}

      {/* 빙하 선 (잉크 느낌) */}
      <path d="M 24 198 Q 44 180 64 176" stroke="#8080A0" strokeWidth="0.9" fill="none" opacity="0.38"/>
      <path d="M 30 232 Q 50 214 72 210" stroke="#8080A0" strokeWidth="0.9" fill="none" opacity="0.3"/>
      <path d="M 34 262 Q 54 250 70 248" stroke="#8080A0" strokeWidth="0.9" fill="none" opacity="0.24"/>

      {/* 리토 마을 탑 */}
      <rect x="54" y="156" width="5" height="16" rx="1.2" fill="#A0A8B0" opacity="0.6"/>
      <ellipse cx="56.5" cy="155" rx="8" ry="4.5" fill="#B8C8D0" opacity="0.5"/>
      <polygon points="56.5,149 53,157 60,157" fill="#D0E0E8" opacity="0.45"/>

      {/* ══ L5: 엘딘 화산 / 거론 시티 (N) - 검붉은 화산 ══ */}
      <path d="
        M 118 82 Q 152 52 190 44 Q 226 38 252 54
        Q 272 68 268 114 Q 250 140 216 146
        Q 182 150 154 132 Q 130 114 118 84 Z
      " fill="#6A2010" opacity="0.92"/>

      <path d="
        M 136 112 Q 154 92 174 82 Q 188 76 200 82
        Q 214 90 212 114 Q 202 130 184 134
        Q 164 136 148 122 Z
      " fill="#7C2818" opacity="0.8"/>

      {/* 용암 웅덩이 */}
      <ellipse cx="155" cy="118" rx="8" ry="4" fill="#CC4420" opacity="0.55"/>
      <ellipse cx="210" cy="112" rx="6" ry="3" fill="#CC4420" opacity="0.48"/>

      {/* 화산 원뿔 */}
      <polygon points="185,44 162,106 208,106" fill="#8C2C1A"/>
      <polygon points="185,48 173,94 197,94" fill="#A83E28" opacity="0.9"/>
      <polygon points="185,54 179,82 191,82" fill="#CC5030" opacity="0.82"/>

      {/* 분화구 */}
      <ellipse cx="185" cy="48" rx="10" ry="5.5" fill="#FF5500" opacity="0.88"/>
      <ellipse cx="185" cy="48" rx="6.5" ry="3.8" fill="#FFAA00" opacity="0.94"/>
      <ellipse cx="185" cy="48" rx="3.5" ry="2" fill="#FFF0C0" opacity="0.78"/>

      {/* 용암 흘러내림 */}
      <path d="M 181 58 Q 177 76 179 96" stroke="#FF4400" strokeWidth="2.8" fill="none" opacity="0.65" strokeLinecap="round"/>
      <path d="M 189 58 Q 194 79 192 98" stroke="#FF3300" strokeWidth="2.2" fill="none" opacity="0.5" strokeLinecap="round"/>
      <path d="M 184 57 Q 170 82 162 106" stroke="#DD2200" strokeWidth="1.8" fill="none" opacity="0.38" strokeLinecap="round"/>
      <path d="M 186 57 Q 198 84 206 102" stroke="#DD2200" strokeWidth="1.8" fill="none" opacity="0.3" strokeLinecap="round"/>

      {/* 화산 글로우 */}
      <ellipse cx="185" cy="96" rx="50" ry="32" fill="url(#volcano-glow)"/>

      {/* 연기 (애니메이션) */}
      {[[183,40,4],[178,32,4.5],[187,29,3.5],[174,37,3.2]].map(([x,y,r],i) => (
        <ellipse key={i} cx={x} cy={y} rx={r+i*0.6} ry={r*1.4} fill="#504038">
          <animate attributeName="opacity" values={`${0.32-i*0.05};${0.14-i*0.02};${0.32-i*0.05}`}
            dur={`${2+i*0.6}s`} repeatCount="indefinite"/>
          <animate attributeName="cy" values={`${y};${y-5};${y}`}
            dur={`${2.8+i*0.4}s`} repeatCount="indefinite"/>
        </ellipse>
      ))}

      {/* ══ L6: 라나유 / 조라의 영역 (NE) - 파란 잉크 워시 ══ */}
      <path d="
        M 248 44 Q 286 60 312 92 Q 338 120 348 160
        Q 352 196 340 210 Q 314 204 288 184
        Q 264 162 252 136 Q 244 112 246 86 Z
      " fill="#4878A8" opacity="0.72"/>

      <path d="
        M 272 88 Q 298 96 316 118 Q 334 144 334 172
        Q 328 188 314 196 Q 296 190 282 176
        Q 266 158 262 138 Q 254 116 264 98 Z
      " fill="#3868A0" opacity="0.62"/>

      {/* 수면 반짝임 */}
      {[
        [283,110,-18,9,2.2],[308,130,-12,7,2],[276,152,15,8,2.2],
        [320,160,8,6,2],[298,174,-20,9,2],[260,122,5,6,2]
      ].map(([x,y,rot,rx,ry],i) => (
        <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry}
          fill="#90C8F0" transform={`rotate(${rot},${x},${y})`}>
          <animate attributeName="opacity"
            values={`${0.28+i*0.04};${0.58+i*0.04};${0.28+i*0.04}`}
            dur={`${1.6+i*0.25}s`} repeatCount="indefinite"/>
        </ellipse>
      ))}

      {/* 조라 폭포 */}
      <path d="M 276 76 Q 279 93 278 110" stroke="#6AB8E8" strokeWidth="5" fill="none" opacity="0.7" strokeLinecap="round"/>
      <path d="M 276 76 Q 283 97 280 114" stroke="#A0D8F8" strokeWidth="2" fill="none" opacity="0.45" strokeLinecap="round"/>

      {/* 조라 결정 구조물 (잉크 드로잉 느낌) */}
      {[[300,102],[306,97],[302,112],[312,104]].map(([x,y],i) => (
        <polygon key={i} points={`${x},${y-10} ${x-4},${y+5} ${x+4},${y+5}`}
          fill="#6AB0D8" opacity={0.58}/>
      ))}

      {/* ══ L7: 헤스투 숲 (E) - 짙은 초록 ══ */}
      <path d="
        M 340 210 Q 358 206 358 262 Q 358 322 344 366
        Q 326 392 304 390 Q 282 364 274 308
        Q 268 262 278 222 Q 286 198 318 190 Z
      " fill="#2A5420" opacity="0.9"/>

      <path d="
        M 326 218 Q 346 224 348 266 Q 348 314 336 354
        Q 324 376 310 374 Q 294 354 290 306
        Q 284 264 294 234 Z
      " fill="#1E3E16" opacity="0.72"/>

      {/* 나무 클러스터 */}
      {[
        [296,202,14],[316,220,13],[336,242,13],[310,258,12],[332,278,13],
        [298,296,12],[320,318,12],[307,342,12],[326,304,11],[288,324,11],
        [346,258,10],[302,278,11],[344,284,10],[286,264,10],[318,362,10],
        [300,370,9],[332,340,11],[308,320,11],[342,310,9],[296,350,10]
      ].map(([x,y,r],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#1A3C10"/>
          <circle cx={x-2} cy={y-3} r={r*0.65} fill="#244E18" opacity="0.65"/>
          <circle cx={x+2} cy={y-1} r={r*0.38} fill="#305C20" opacity="0.5"/>
          <circle cx={x} cy={y-r*0.65} r={r*0.22} fill="#3C6828" opacity="0.35"/>
        </g>
      ))}

      {/* ══ L8: 게루도 사막 (W) - 황토/모래색 ══ */}
      <path d="
        M 10 290 Q 10 256 22 226 Q 36 206 60 208
        Q 76 246 70 300 Q 60 356 38 394
        Q 14 368 10 318 Z
      " fill="#C8A030" opacity="0.92"/>

      {/* 모래 언덕 */}
      {[
        [28,246,18,6],[36,280,16,5.5],[24,320,20,6.5],[32,358,17,5],
        [46,254,13,4.5],[40,292,11,4],[20,342,14,5],[50,310,10,3.5]
      ].map(([x,y,rx,ry],i) => (
        <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry}
          fill="#E0C050" opacity={0.45} transform={`rotate(-12,${x},${y})`}/>
      ))}

      {/* 사막 바람 선 (잉크) */}
      {[[16,244],[20,274],[18,306],[20,340],[16,370]].map(([x,y],i) => (
        <path key={i} d={`M${x},${y} Q${x+14},${y-4} ${x+28},${y}`}
          stroke="#9A7018" strokeWidth="0.9" fill="none" opacity={0.38-i*0.04}/>
      ))}

      {/* 게루도 유적 */}
      <rect x="16" y="298" width="6" height="12" fill="#8A6018" opacity="0.5"/>
      <polygon points="19,296 16,300 22,300" fill="#A07828" opacity="0.55"/>
      <rect x="44" y="268" width="5" height="9" fill="#8A6018" opacity="0.42"/>

      {/* ══ L9: 파론 남쪽 숲 ══ */}
      <path d="
        M 88 450 Q 126 422 166 412 Q 198 404 234 406
        Q 270 410 300 426 Q 322 440 332 454
        Q 304 466 272 468 Q 240 470 196 468
        Q 152 468 112 458 Z
      " fill="#3A6028" opacity="0.9"/>
      {[108,150,190,230,270,300].map((x,i) => (
        <circle key={i} cx={x} cy={434+i%2*7} r={11-i%3*1.5}
          fill="#284818" opacity={0.75}/>
      ))}

      {/* ══ L10: 중앙 하이랄 평원 - 연한 초록 ══ */}
      <ellipse cx="183" cy="260" rx="126" ry="118" fill="url(#plains-grad)"/>
      <ellipse cx="168" cy="250" rx="72" ry="54" fill="#A0C860" opacity="0.38"/>
      <ellipse cx="212" cy="286" rx="60" ry="46" fill="#A0C860" opacity="0.3"/>

      {/* 풀숲 점묘 */}
      {[
        [126,236,7.5],[148,274,6],[194,256,6.5],[228,300,5.5],
        [142,316,5.5],[206,334,5.5],[164,348,6],[238,270,5.5],
        [120,298,5],[174,286,5],[220,318,4.5],[144,260,5.5],[200,280,5]
      ].map(([x,y,r],i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#5A8828" opacity={0.28}/>
      ))}

      {/* ══ L11: 하이랄 호수 - 파란 잉크 워시 ══ */}
      <ellipse cx="186" cy="378" rx="62" ry="44" fill="#1C5AAA"/>
      <ellipse cx="186" cy="378" rx="50" ry="34" fill="#2870CC" opacity="0.5"/>
      <ellipse cx="186" cy="378" rx="64" ry="46" fill="url(#lake-glow)" opacity="0.82"/>

      {/* 호수 반짝임 */}
      {[[172,370,-15,10,2],[200,382,10,8,2],[184,376,-8,6,2],[194,368,12,5,2],[168,382,5,8,2]].map(([x,y,rot,rx,ry],i) => (
        <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry}
          fill="#70C0F8" transform={`rotate(${rot},${x},${y})`}>
          <animate attributeName="opacity"
            values={`${0.2+i*0.04};${0.48+i*0.04};${0.2+i*0.04}`}
            dur={`${2.2+i*0.4}s`} repeatCount="indefinite"/>
        </ellipse>
      ))}

      {/* 호수 섬 */}
      <ellipse cx="192" cy="370" rx="8" ry="5" fill="#4A7830" opacity="0.55"/>

      {/* ══ L12: 강과 수로 - 파란 잉크선 ══ */}
      {/* 조라 강 */}
      <path d="M 288 184 Q 272 216 258 254 Q 242 292 226 326 Q 214 354 204 370"
        stroke="#1050A0" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.72"/>
      <path d="M 288 184 Q 272 216 258 254 Q 242 292 226 326 Q 214 354 204 370"
        stroke="#4090D8" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M 288 184 Q 272 216 258 254 Q 242 292 226 326 Q 214 354 204 370"
        stroke="#A0D0F8" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.28"/>

      {/* 하이랄 강 */}
      <path d="M 184 222 Q 183 264 184 312 Q 185 346 186 374"
        stroke="#1050A0" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.65"/>
      <path d="M 184 222 Q 183 264 184 312 Q 185 346 186 374"
        stroke="#4090D8" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.42"/>

      {/* 산악 개울 */}
      <path d="M 56 174 Q 72 192 88 214 Q 102 234 114 252"
        stroke="#4880C0" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.4"/>

      {/* ══ L13: 도로 (점선, 갈색 잉크) ══ */}
      <path d="M 184 222 Q 181 180 181 144" stroke="#7A5018" strokeWidth="2" fill="none" strokeDasharray="7,4" opacity="0.52"/>
      <path d="M 190 216 Q 220 224 252 208 Q 272 196 284 176" stroke="#7A5018" strokeWidth="2" fill="none" strokeDasharray="7,4" opacity="0.52"/>
      <path d="M 178 216 Q 148 216 110 210 Q 84 206 70 192" stroke="#7A5018" strokeWidth="2" fill="none" strokeDasharray="7,4" opacity="0.52"/>
      <path d="M 186 224 Q 188 286 188 346 Q 188 364 188 376" stroke="#7A5018" strokeWidth="2" fill="none" strokeDasharray="7,4" opacity="0.44"/>
      <path d="M 68 166 Q 98 134 136 112" stroke="#7A5018" strokeWidth="1.6" fill="none" strokeDasharray="5,5" opacity="0.4"/>
      <path d="M 202 106 Q 224 118 240 132" stroke="#7A5018" strokeWidth="1.6" fill="none" strokeDasharray="5,5" opacity="0.4"/>

      {/* ══ L14: 카카리코 마을 ══ */}
      {[[242,130],[248,126],[254,132],[248,136],[242,136]].map(([x,y],i) => (
        <polygon key={i} points={`${x},${y-5} ${x-6},${y+3} ${x+6},${y+3}`}
          fill="#9A7030" opacity={0.65}/>
      ))}
      <rect x="238" y="128" width="22" height="14" rx="1" fill="#886020" opacity="0.25"/>

      {/* ══ L15: 하이랄 성 (상세) ══ */}
      {/* 절벽 기단 */}
      <ellipse cx="183" cy="205" rx="30" ry="10" fill="#7A8898" opacity="0.65"/>

      {/* 외벽 */}
      <rect x="163" y="195" width="40" height="23" rx="2" fill="#8898A8"/>
      {[164,168,172,176,180,184,188,192,196,200].map((x,i) => (
        <rect key={i} x={x} y={193} width={2.5} height={4.5} rx={0.5} fill="#98A8BA"/>
      ))}

      {/* 내부 성채 */}
      <rect x="172" y="186" width="22" height="14" rx="1.5" fill="#98A8BA"/>
      {[173,177,181,185,189].map((x,i) => (
        <rect key={i} x={x} y={184} width={2.2} height={3.5} rx={0.4} fill="#A8B8CA"/>
      ))}

      {/* 주탑 */}
      <rect x="177" y="175" width="12" height="15" rx="1" fill="#A8B8CA"/>
      {[178,181,184,187].map((x,i) => (
        <rect key={i} x={x} y={173} width={2} height={3.5} rx={0.4} fill="#B8C8D8"/>
      ))}

      {/* 중앙 첨탑 */}
      <polygon points="183,158 178,176 188,176" fill="#B8C8D8"/>
      <rect x="182" y="152" width="2.5" height="8" rx="0.5" fill="#C0C8D8"/>
      <polygon points="183.5,148 183.5,154 188,151" fill="#FFD700" opacity="0.95"/>

      {/* 좌측 탑 */}
      <rect x="161" y="190" width="9" height="12" rx="1" fill="#8898A8"/>
      <polygon points="165.5,183 161,192 170,192" fill="#A0B0C0"/>
      <rect x="164" y="179" width="2.5" height="5.5" rx="0.5" fill="#A8A8BC"/>
      <polygon points="165.5,175 165.5,181 170,178.5" fill="#7820BE" opacity="0.88"/>

      {/* 우측 탑 */}
      <rect x="196" y="190" width="9" height="12" rx="1" fill="#8898A8"/>
      <polygon points="200.5,183 196,192 205,192" fill="#A0B0C0"/>
      <rect x="199" y="179" width="2.5" height="5.5" rx="0.5" fill="#A8A8BC"/>
      <polygon points="200.5,175 200.5,181 205,178.5" fill="#7820BE" opacity="0.88"/>

      {/* 모서리 소탑 */}
      <rect x="162" y="193" width="7" height="8" rx="0.5" fill="#7888A0"/>
      <rect x="197" y="193" width="7" height="8" rx="0.5" fill="#7888A0"/>

      {/* 성문 */}
      <path d="M 179,218 L 179,210 Q 183,207 187,210 L 187,218 Z" fill="#1A1408"/>
      {[180,182,184,186].map((x,i) => (
        <line key={i} x1={x} y1={210} x2={x} y2={218} stroke="#383020" strokeWidth="0.6" opacity="0.55"/>
      ))}
      <line x1="179" y1="212" x2="187" y2="212" stroke="#383020" strokeWidth="0.6" opacity="0.4"/>
      <line x1="179" y1="215" x2="187" y2="215" stroke="#383020" strokeWidth="0.5" opacity="0.3"/>

      {/* 창문 */}
      <rect x="169" y="199" width="7" height="8" rx="1.5" fill="#B8D8F8" opacity="0.72">
        <animate attributeName="opacity" values="0.72;0.96;0.72" dur="3.5s" repeatCount="indefinite"/>
      </rect>
      <rect x="190" y="199" width="7" height="8" rx="1.5" fill="#B8D8F8" opacity="0.72">
        <animate attributeName="opacity" values="0.72;0.96;0.72" dur="4.2s" repeatCount="indefinite"/>
      </rect>
      <rect x="179" y="190" width="4.5" height="6" rx="1" fill="#B8D8F8" opacity="0.62"/>
      <rect x="184" y="190" width="4.5" height="6" rx="1" fill="#B8D8F8" opacity="0.62"/>

      {/* 성 마법 후광 */}
      <ellipse cx="183" cy="200" rx="34" ry="26" fill="url(#castle-glow)" opacity="0.9"
        filter="url(#castle-halo)"/>

      {/* 해자 (파란 잉크) */}
      <ellipse cx="183" cy="220" rx="38" ry="10" fill="#1858A8" opacity="0.55"/>
      <ellipse cx="183" cy="220" rx="30" ry="7" fill="#3880D0" opacity="0.32"/>
      <rect x="181" y="218" width="4" height="6" fill="#8A6828" opacity="0.62"/>

      {/* ══ L16: 나침반 (따뜻한 세피아 톤) ══ */}
      <g transform="translate(322, 408)">
        <circle cx="0" cy="0" r="21" fill="rgba(180,138,48,0.78)" stroke="#6A4818" strokeWidth="0.9" opacity="0.85"/>
        <circle cx="0" cy="0" r="14" fill="none" stroke="#8A6028" strokeWidth="0.5" opacity="0.55"/>

        <polygon points="0,-19 -3.5,-7 3.5,-7" fill="#3A2008" opacity="0.9"/>
        <polygon points="0,19 -3.5,7 3.5,7" fill="#6A4820" opacity="0.7"/>
        <polygon points="-19,0 -7,-3.5 -7,3.5" fill="#6A4820" opacity="0.7"/>
        <polygon points="19,0 7,-3.5 7,3.5" fill="#6A4820" opacity="0.7"/>

        {[[10,-10],[10,10],[-10,10],[-10,-10]].map(([x,y],i) => (
          <polygon key={i}
            points={`${x*1.2},${y*1.2} ${x*0.4},${y*0.92} ${x*0.92},${y*0.4}`}
            fill="#8A6030" opacity="0.55"/>
        ))}

        <circle cx="0" cy="0" r="2.8" fill="#5A3810" opacity="0.92"/>
        <circle cx="0" cy="0" r="1.2" fill="#C8A050" opacity="0.98"/>

        <text x="0" y="-24" textAnchor="middle" fill="#3A2008" fontSize="7"
          fontFamily="Cinzel, serif" fontWeight="bold" opacity="0.88">N</text>
      </g>

      {/* ══ L17: 전체 오버레이 (얕은 양피지 틴트) ══ */}
      <rect width="360" height="460" fill="#C09040"
        style={{ opacity: devPreview ? 0 : 0.05, transition:'opacity 1.5s ease' }}/>

      {/* ══ L18: 지역별 안개 (짙은 회색-세피아) ══ */}
      {MAP_REGIONS.map(region => {
        const m = MARKERS[region.id];
        const fogOp = getRegionFogOpacity(region, unlockedRegions, devPreview, weekRates, currentWeek);
        return (
          <g key={`fog-${region.id}`}>
            <circle cx={m.x} cy={m.y} r={m.fogR + 12}
              fill={FOG}
              filter="url(#fog-blur)"
              style={{ opacity: fogOp * 0.9, transition:'opacity 3.5s ease-in-out' }}/>
            <circle cx={m.x} cy={m.y} r={m.fogR + 50}
              fill="none" stroke={FOG} strokeWidth="100"
              style={{ opacity: fogOp * 0.42, transition:'opacity 3.5s ease-in-out' }}/>
          </g>
        );
      })}

      {/* ══ L19: 외곽 비네팅 (따뜻한 세피아) ══ */}
      <rect width="360" height="460" fill="url(#vignette)"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════
   쉐이카 장식 테두리 — 강화판
══════════════════════════════════════════════ */
function SheikahBorder() {
  const diamond = (style) => (
    <div style={{
      ...style,
      width:14, height:14,
      background:'linear-gradient(135deg,#5AC8F0,#3A90CC)',
      transform:'rotate(45deg)',
      boxShadow:'0 0 14px rgba(74,180,230,1),0 0 28px rgba(74,143,191,0.6)',
      position:'absolute', zIndex:12,
    }}>
      <div style={{ position:'absolute', inset:3, background:'#0A1C2E' }}/>
    </div>
  );

  return (
    <>
      {diamond({ top:-7, left:-7 })}
      {diamond({ top:-7, right:-7 })}
      {diamond({ bottom:-7, left:-7 })}
      {diamond({ bottom:-7, right:-7 })}

      {/* 상단 중앙 — 쉐이카 눈 + 라벨 */}
      <div style={{
        position:'absolute', top:-1, left:'50%', transform:'translateX(-50%)',
        zIndex:13, display:'flex', alignItems:'center', gap:7,
        background:'#060E1C', padding:'4px 16px 4px 12px',
        border:'1.5px solid rgba(74,180,220,0.6)',
        borderTop:'none', borderRadius:'0 0 12px 12px',
      }}>
        <svg width="22" height="13" viewBox="0 0 22 13">
          <path d="M 0 6.5 Q 11 -1.5 22 6.5 Q 11 14.5 0 6.5 Z"
            fill="none" stroke="#4AA8D8" strokeWidth="1.3"/>
          <circle cx="11" cy="6.5" r="4" fill="#4AA8D8" opacity="0.78"/>
          <circle cx="11" cy="6.5" r="2.2" fill="#B0E4FF"/>
          <circle cx="11" cy="6.5" r="0.9" fill="white"/>
          <path d="M 11 2.5 L 11 0.5" stroke="#4AA8D8" strokeWidth="1.1"/>
          <path d="M 15 4 L 16.5 2.3" stroke="#4AA8D8" strokeWidth="0.9"/>
          <path d="M 7 4 L 5.5 2.3" stroke="#4AA8D8" strokeWidth="0.9"/>
        </svg>
        <span style={{
          fontSize:8, color:'rgba(74,190,230,0.82)',
          fontFamily:'Cinzel,serif', letterSpacing:'0.18em', fontWeight:700,
        }}>SHEIKAH</span>
      </div>

      {/* 좌측 다이아 */}
      <div style={{
        position:'absolute', top:'50%', left:-3, transform:'translateY(-50%)',
        display:'flex', flexDirection:'column', gap:6, zIndex:12,
      }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width:6, height:6, background:'#4AA8D8', transform:'rotate(45deg)',
            boxShadow:'0 0 8px rgba(74,168,216,0.9)', opacity:0.65+i*0.12,
          }}/>
        ))}
      </div>

      {/* 우측 다이아 */}
      <div style={{
        position:'absolute', top:'50%', right:-3, transform:'translateY(-50%)',
        display:'flex', flexDirection:'column', gap:6, zIndex:12,
      }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width:6, height:6, background:'#4AA8D8', transform:'rotate(45deg)',
            boxShadow:'0 0 8px rgba(74,168,216,0.9)', opacity:0.65+i*0.12,
          }}/>
        ))}
      </div>

      {/* 내부 얇은 라인 */}
      <div style={{
        position:'absolute', inset:5,
        border:'1px solid rgba(74,168,216,0.16)',
        borderRadius:8, pointerEvents:'none', zIndex:3,
      }}/>
    </>
  );
}

/* ══════════════════════════════════════════════
   하트 컨테이너
══════════════════════════════════════════════ */
function HeartsDisplay({ totalExp }) {
  const count = totalExp < 200  ? 3
              : totalExp < 1400 ? 5
              : totalExp < 5400 ? 8
              : totalExp < 22000 ? 10 : 13;
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:2, maxWidth:100 }}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} style={{
          fontSize:13, color:'#E03030', lineHeight:1,
          textShadow:'0 0 6px rgba(240,60,60,0.9),0 0 16px rgba(240,60,60,0.45)',
        }}>♥</span>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   인벤토리 미니 표시
══════════════════════════════════════════════ */
function MiniInventory({ inventory }) {
  const items = [
    { id:'korogSeed', e:'🌰' }, { id:'hyruleApple', e:'🍎' },
    { id:'hyrulePike', e:'🐟' }, { id:'ruby', e:'💎' }, { id:'eagleFeather', e:'🪶' },
  ].filter(it => (inventory[it.id] || 0) > 0);

  if (items.length === 0 && !inventory.masterSword) return null;
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:4, justifyContent:'flex-end', maxWidth:116 }}>
      {items.map(it => (
        <div key={it.id} style={{
          display:'flex', flexDirection:'column', alignItems:'center',
          background:'rgba(74,143,191,0.14)',
          border:'1px solid rgba(74,143,191,0.3)',
          borderRadius:6, padding:'3px 5px', minWidth:28,
        }}>
          <span style={{ fontSize:14, lineHeight:1 }}>{it.e}</span>
          <span style={{ fontSize:9, color:'#FFD700', fontFamily:'Cinzel,serif', lineHeight:1.3 }}>
            {inventory[it.id]}
          </span>
        </div>
      ))}
      {inventory.masterSword && (
        <div style={{
          display:'flex', flexDirection:'column', alignItems:'center',
          background:'rgba(74,100,255,0.14)',
          border:'1px solid rgba(80,110,255,0.35)',
          borderRadius:6, padding:'3px 5px', minWidth:28,
        }}>
          <span style={{ fontSize:14, lineHeight:1 }}>⚔️</span>
          <span style={{ fontSize:8, color:'#8090FF', lineHeight:1.3 }}>MAX</span>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   메인 MapPage
══════════════════════════════════════════════ */
export default function MapPage() {
  const { state, levelInfo } = useGame();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [showCooking, setShowCooking]       = useState(false);
  const [showFishing, setShowFishing]       = useState(false);

  const unlockedRegions = state.unlockedRegions || [];
  const devPreview      = state.devPreview || false;
  const inventory       = state.inventory || {};
  const fishingUnlocked = state.fishingUnlocked;
  const activeRegionId  = unlockedRegions[unlockedRegions.length - 1] || null;

  const currentWeek = getCurrentAppWeek(state.gameStartDate);
  const weekRates   = getWeeklyCompletionRates(state.questsLog, state.gameStartDate);
  const thisWeekPct = Math.round((weekRates[currentWeek] ?? 0) * 100);

  return (
    <div style={{ paddingBottom:100 }}>
      {/* 외부 글로우 래퍼 */}
      <div style={{ margin:'0 8px', position:'relative' }}>
        <div style={{
          position:'absolute', inset:-4, borderRadius:16, pointerEvents:'none', zIndex:0,
          boxShadow:'0 0 40px rgba(74,168,216,0.32),0 0 80px rgba(74,143,191,0.12)',
        }}/>

        {/* 지도 메인 컨테이너 */}
        <div style={{
          position:'relative', borderRadius:13, overflow:'visible',
          border:'2.5px solid rgba(74,168,216,0.92)',
          boxShadow:'0 0 26px rgba(74,168,216,0.5),0 0 60px rgba(74,143,191,0.14),inset 0 0 40px rgba(0,0,0,0.7)',
          background:'#0A1520',
        }}>
          <SheikahBorder/>

          {/* SVG 지형 */}
          <div style={{ overflow:'hidden', borderRadius:'10px 10px 0 0' }}>
            <HyruleTerrain
              unlockedRegions={unlockedRegions}
              devPreview={devPreview}
              weekRates={weekRates}
              currentWeek={currentWeek}
            />
          </div>

          {/* HTML 오버레이: 마커 + 캐릭터 + HUD */}
          <div style={{
            position:'absolute', inset:0,
            pointerEvents:'none',
            borderRadius:'10px 10px 0 0', overflow:'hidden',
          }}>
            {/* 상단 타이틀 */}
            <div style={{ position:'absolute', top:16, left:0, right:0, textAlign:'center' }}>
              <div style={{
                display:'inline-block',
                background:'rgba(5,10,22,0.85)',
                border:'1px solid rgba(74,168,216,0.55)',
                borderRadius:999, padding:'6px 24px',
                backdropFilter:'blur(8px)',
                boxShadow:'0 0 20px rgba(74,168,216,0.2)',
              }}>
                <span style={{
                  fontSize:11, fontWeight:700, color:'#8AD4E8',
                  fontFamily:'Cinzel,serif', letterSpacing:'0.18em',
                }}>
                  ✦ HYRULE ✦ MAP ✦
                </span>
              </div>
            </div>

            {/* 지역 마커 */}
            {MAP_REGIONS.map(region => {
              const m       = MARKERS[region.id];
              const unlocked = unlockedRegions.includes(region.id) || devPreview;
              return (
                <div
                  key={region.id}
                  style={{
                    position:'absolute',
                    left:`${(m.x / 360) * 100}%`,
                    top:`${(m.y / 460) * 100}%`,
                    transform:'translate(-50%,-50%)',
                    pointerEvents:'all', cursor:'pointer', zIndex:5,
                  }}
                  onClick={() => setSelectedRegion(region.id)}
                >
                  {/* 펄스 링 */}
                  {unlocked && (
                    <>
                      <div style={{
                        position:'absolute', top:'50%', left:'50%',
                        width:42, height:42, transform:'translate(-50%,-50%)',
                        borderRadius:'50%',
                        background:'rgba(74,168,216,0.14)',
                        animation:'shimmer 2.2s ease-in-out infinite',
                      }}/>
                      <div style={{
                        position:'absolute', top:'50%', left:'50%',
                        width:26, height:26, transform:'translate(-50%,-50%)',
                        borderRadius:'50%',
                        background:'rgba(74,168,216,0.1)',
                        animation:'shimmer 1.6s ease-in-out infinite 0.5s',
                      }}/>
                    </>
                  )}

                  {/* 이모지 */}
                  <div style={{
                    position:'absolute', top:-28, left:'50%',
                    transform:'translateX(-50%)',
                    fontSize:17, lineHeight:1, whiteSpace:'nowrap',
                    filter: unlocked
                      ? 'drop-shadow(0 0 6px rgba(74,168,216,0.8))'
                      : 'grayscale(1) brightness(0.2)',
                  }}>
                    {region.emoji}
                  </div>

                  {/* ◆ 다이아몬드 마커 */}
                  <div style={{
                    width:17, height:17,
                    background: unlocked
                      ? 'linear-gradient(135deg,#5AC8F0,#3A90CC)'
                      : '#192838',
                    transform:'rotate(45deg)',
                    border:`1.5px solid ${unlocked ? '#90D8F8' : '#2A3848'}`,
                    boxShadow: unlocked
                      ? '0 0 14px rgba(74,180,230,1),0 0 28px rgba(74,143,191,0.6)'
                      : 'none',
                    transition:'all 0.8s ease',
                    position:'relative',
                  }}>
                    {unlocked && (
                      <div style={{
                        position:'absolute', inset:3.5,
                        background:'rgba(210,245,255,0.5)',
                      }}/>
                    )}
                  </div>

                  {/* 지역 이름 */}
                  {unlocked && (
                    <div style={{
                      position:'absolute', bottom:-24, left:'50%',
                      transform:'translateX(-50%)',
                      fontSize:8, whiteSpace:'nowrap',
                      color:'#8ACCE0', fontWeight:700,
                      fontFamily:'Cinzel,serif', letterSpacing:'0.05em',
                      textShadow:'0 0 8px #050A12,0 0 18px #050A12',
                    }}>
                      {region.name}
                    </div>
                  )}
                </div>
              );
            })}

            {/* 링크 캐릭터 — 현재 위치 */}
            {activeRegionId && MARKERS[activeRegionId] && (() => {
              const m = MARKERS[activeRegionId];
              return (
                <div style={{
                  position:'absolute',
                  left:`${(m.x / 360) * 100}%`,
                  top:`${(m.y / 460) * 100}%`,
                  transform:'translate(-50%,-205%)',
                  pointerEvents:'none', zIndex:8,
                  filter:'drop-shadow(0 0 10px rgba(74,180,230,0.95))',
                }}>
                  <CharacterSprite equipment={levelInfo.equipment} size={32} animate/>
                </div>
              );
            })()}

            {/* 하단 HUD */}
            <div style={{
              position:'absolute', bottom:0, left:0, right:0,
              background:'linear-gradient(0deg,rgba(4,8,20,0.97) 0%,rgba(4,8,20,0.7) 65%,transparent 100%)',
              padding:'36px 16px 14px',
              display:'flex', justifyContent:'space-between', alignItems:'flex-end',
              pointerEvents:'none',
            }}>
              <div>
                <div style={{
                  fontSize:7, color:'rgba(123,189,224,0.44)', marginBottom:5,
                  fontFamily:'Cinzel,serif', letterSpacing:'0.14em',
                }}>♥ LIFE</div>
                <HeartsDisplay totalExp={state.totalExp}/>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{
                  fontSize:7, color:'rgba(123,189,224,0.44)', marginBottom:5,
                  fontFamily:'Cinzel,serif', letterSpacing:'0.14em',
                }}>ITEMS ✦</div>
                <MiniInventory inventory={inventory}/>
              </div>
            </div>
          </div>
        </div>

        {/* 지도 하단 정보 바 */}
        <div style={{
          background:'linear-gradient(145deg,rgba(5,9,20,0.98),rgba(8,14,26,0.96))',
          border:'1px solid rgba(74,143,191,0.32)',
          borderTop:'none', borderRadius:'0 0 11px 11px',
          padding:'11px 16px',
          display:'flex', justifyContent:'space-between', alignItems:'center',
        }}>
          <div>
            <div style={{
              fontSize:9, color:'rgba(123,189,224,0.44)',
              fontFamily:'Cinzel,serif', letterSpacing:'0.08em', marginBottom:6,
            }}>
              WEEK {currentWeek} PROGRESS
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:9 }}>
              <div style={{
                width:116, height:5,
                background:'rgba(74,143,191,0.14)', borderRadius:3, overflow:'hidden',
              }}>
                <div style={{
                  height:'100%', width:`${thisWeekPct}%`, borderRadius:3,
                  background: thisWeekPct >= 70
                    ? 'linear-gradient(90deg,#3D7A45,#6AAB56)'
                    : 'linear-gradient(90deg,#3A7FAF,#5ABDE0)',
                  transition:'width 1.2s ease',
                  boxShadow: thisWeekPct >= 70
                    ? '0 0 8px rgba(100,200,80,0.7)' : '0 0 8px rgba(74,168,216,0.7)',
                }}/>
              </div>
              <span style={{
                fontSize:11, fontWeight:700, fontFamily:'Cinzel,serif',
                color: thisWeekPct >= 70 ? '#70BB50' : '#7BBDE0',
              }}>{thisWeekPct}%</span>
              {thisWeekPct >= 70 && <span style={{ fontSize:10, color:'#70BB50' }}>✦</span>}
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
            <div style={{
              fontSize:9, color:'rgba(123,189,224,0.4)',
              fontFamily:'Cinzel,serif', letterSpacing:'0.05em',
            }}>
              {unlockedRegions.length} / {MAP_REGIONS.length} REGIONS
            </div>
            <div style={{ display:'flex', gap:5 }}>
              {MAP_REGIONS.map(r => (
                <div key={r.id} style={{
                  width:6, height:6, borderRadius:'50%',
                  background: (unlockedRegions.includes(r.id) || devPreview) ? '#4AA8D8' : '#1A2A3A',
                  boxShadow: (unlockedRegions.includes(r.id) || devPreview)
                    ? '0 0 7px rgba(74,168,216,0.9)' : 'none',
                  transition:'all 0.6s ease',
                }}/>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div style={{ display:'flex', gap:8, margin:'10px 8px 0' }}>
        <button onClick={() => setShowCooking(true)} style={{
          flex:1, padding:'12px', borderRadius:12, cursor:'pointer',
          background:'linear-gradient(145deg,rgba(140,70,8,0.3),rgba(100,42,0,0.2))',
          border:'1.5px solid rgba(200,140,60,0.56)',
          color:'#C8A060', fontWeight:700, fontSize:13,
          fontFamily:'Cinzel,serif',
          boxShadow:'0 0 14px rgba(200,120,30,0.15)',
        }}>
          🍲 요리 냄비
        </button>
        {fishingUnlocked && (
          <button onClick={() => setShowFishing(true)} style={{
            flex:1, padding:'12px', borderRadius:12, cursor:'pointer',
            background:'linear-gradient(145deg,rgba(8,52,100,0.3),rgba(4,36,76,0.2))',
            border:'1.5px solid rgba(74,143,191,0.56)',
            color:'#7BBDE0', fontWeight:700, fontSize:13,
            fontFamily:'Cinzel,serif',
            boxShadow:'0 0 14px rgba(74,143,191,0.15)',
          }}>
            🎣 낚시터
          </button>
        )}
      </div>

      {devPreview && (
        <div style={{
          textAlign:'center', marginTop:8,
          fontSize:10, color:'#508050',
          fontFamily:'Cinzel,serif', letterSpacing:'0.08em',
        }}>
          ✦ 개발자 미리보기 모드 ✦
        </div>
      )}

      {selectedRegion && <RegionPopup regionId={selectedRegion} onClose={() => setSelectedRegion(null)}/>}
      {showCooking    && <CookingModal onClose={() => setShowCooking(false)}/>}
      {showFishing    && <FishingModal onClose={() => setShowFishing(false)}/>}
    </div>
  );
}
