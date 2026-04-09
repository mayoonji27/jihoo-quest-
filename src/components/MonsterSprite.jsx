/**
 * 픽셀 스타일 몬스터 SVG 컴포넌트
 * viewBox="0 0 60 70"
 */

function Bokoblin() {
  return (
    <svg viewBox="0 0 60 70" width="80" height="80" style={{ imageRendering: 'pixelated' }}>
      {/* 귀 */}
      <ellipse cx="12" cy="22" rx="5" ry="7" fill="#2E7A1A" />
      <ellipse cx="48" cy="22" rx="5" ry="7" fill="#2E7A1A" />
      {/* 뿔 */}
      <polygon points="25,8 20,2 30,4" fill="#1A4A08" />
      <polygon points="35,8 30,2 40,4" fill="#1A4A08" />
      {/* 머리 */}
      <ellipse cx="30" cy="22" rx="16" ry="15" fill="#4AAA2A" />
      {/* 눈 (빨간 분노 눈) */}
      <ellipse cx="23" cy="18" rx="4" ry="4" fill="white" />
      <ellipse cx="37" cy="18" rx="4" ry="4" fill="white" />
      <ellipse cx="23" cy="19" rx="2.5" ry="2.5" fill="#CC1010" />
      <ellipse cx="37" cy="19" rx="2.5" ry="2.5" fill="#CC1010" />
      <circle cx="22" cy="18" r="1" fill="#800000" />
      <circle cx="36" cy="18" r="1" fill="#800000" />
      {/* 눈썹 (화남) */}
      <line x1="19" y1="14" x2="27" y2="16" stroke="#1A4A08" strokeWidth="2" strokeLinecap="round" />
      <line x1="41" y1="14" x2="33" y2="16" stroke="#1A4A08" strokeWidth="2" strokeLinecap="round" />
      {/* 코 */}
      <ellipse cx="30" cy="24" rx="3" ry="2" fill="#2E7A1A" />
      <circle cx="28.5" cy="24" r="1" fill="#1A4A08" />
      <circle cx="31.5" cy="24" r="1" fill="#1A4A08" />
      {/* 입 (이빨 드러냄) */}
      <path d="M22,28 Q30,33 38,28" stroke="#1A4A08" strokeWidth="1.5" fill="none" />
      <rect x="25" y="27" width="3" height="4" rx="1" fill="white" />
      <rect x="32" y="27" width="3" height="4" rx="1" fill="white" />
      {/* 몸통 */}
      <rect x="18" y="36" width="24" height="18" rx="4" fill="#3A8A1A" />
      {/* 가죽 띠 */}
      <rect x="18" y="42" width="24" height="3" fill="#5A3A10" />
      {/* 왼팔 */}
      <path d="M18,38 Q8,44 10,54" stroke="#3A8A1A" strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* 오른팔 (곤봉) */}
      <path d="M42,38 Q52,44 50,52" stroke="#3A8A1A" strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* 곤봉 */}
      <line x1="50" y1="52" x2="54" y2="42" stroke="#7A4A18" strokeWidth="4" strokeLinecap="round" />
      <circle cx="55" cy="40" r="6" fill="#5A3010" />
      <circle cx="55" cy="40" r="6" fill="none" stroke="#3A1A00" strokeWidth="1" />
      {/* 다리 */}
      <rect x="20" y="53" width="8" height="10" rx="3" fill="#2E7010" />
      <rect x="32" y="53" width="8" height="10" rx="3" fill="#2E7010" />
      {/* 발 */}
      <ellipse cx="24" cy="63" rx="6" ry="3" fill="#1A4A08" />
      <ellipse cx="36" cy="63" rx="6" ry="3" fill="#1A4A08" />
    </svg>
  );
}

function Stalfos() {
  return (
    <svg viewBox="0 0 60 70" width="80" height="80" style={{ imageRendering: 'pixelated' }}>
      {/* 방패 (왼쪽) */}
      <path d="M4,30 L4,50 Q7,55 10,55 Q13,55 14,50 L14,30 Q11,27 9,27 Q6,27 4,30 Z" fill="#2050A0" />
      <path d="M9,32 L9,48" stroke="#FFD700" strokeWidth="1.2" opacity="0.9" />
      <path d="M5.5,41 L12.5,41" stroke="#FFD700" strokeWidth="1.2" opacity="0.9" />
      {/* 두개골 */}
      <ellipse cx="30" cy="15" rx="13" ry="12" fill="#E8E0D0" />
      {/* 광대뼈 */}
      <ellipse cx="21" cy="18" rx="4" ry="3" fill="#D0C8B8" opacity="0.6" />
      <ellipse cx="39" cy="18" rx="4" ry="3" fill="#D0C8B8" opacity="0.6" />
      {/* 눈 (검은 구멍) */}
      <ellipse cx="24" cy="13" rx="4" ry="4.5" fill="#101010" />
      <ellipse cx="36" cy="13" rx="4" ry="4.5" fill="#101010" />
      {/* 눈 빛 */}
      <ellipse cx="24" cy="13" rx="2" ry="2" fill="#4060FF" opacity="0.7" />
      <ellipse cx="36" cy="13" rx="2" ry="2" fill="#4060FF" opacity="0.7" />
      {/* 코 (구멍) */}
      <ellipse cx="30" cy="19" rx="2" ry="1.5" fill="#303030" />
      {/* 치아 */}
      <rect x="23" y="23" width="3" height="4" rx="1" fill="white" />
      <rect x="28" y="23" width="3" height="4" rx="1" fill="white" />
      <rect x="33" y="23" width="3" height="4" rx="1" fill="white" />
      <line x1="20" y1="24" x2="39" y2="24" stroke="#C0B8A8" strokeWidth="1" />
      {/* 갈비뼈 / 몸통 */}
      <rect x="20" y="28" width="20" height="22" rx="2" fill="none" stroke="#D0C8B8" strokeWidth="1.5" />
      {/* 갈비뼈 선 */}
      {[32, 37, 42].map(y => (
        <line key={y} x1="20" y1={y} x2="40" y2={y} stroke="#D0C8B8" strokeWidth="1" opacity="0.7" />
      ))}
      <line x1="30" y1="28" x2="30" y2="50" stroke="#D0C8B8" strokeWidth="1" opacity="0.5" />
      {/* 왼팔 */}
      <path d="M20,30 L15,38 L14,50" stroke="#D0C8B8" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* 오른팔 + 검 */}
      <path d="M40,30 L45,38 L46,48" stroke="#D0C8B8" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* 검날 */}
      <line x1="46" y1="30" x2="52" y2="60" stroke="#B8C8D8" strokeWidth="3" strokeLinecap="round" />
      <line x1="46" y1="30" x2="51" y2="58" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      {/* 검 가드 */}
      <rect x="42" y="46" width="8" height="3" rx="1.5" fill="#7A4810" />
      {/* 다리뼈 */}
      <line x1="25" y1="50" x2="22" y2="65" stroke="#D0C8B8" strokeWidth="4" strokeLinecap="round" />
      <line x1="35" y1="50" x2="38" y2="65" stroke="#D0C8B8" strokeWidth="4" strokeLinecap="round" />
      {/* 발뼈 */}
      <ellipse cx="20" cy="66" rx="5" ry="2.5" fill="#C0B8A8" />
      <ellipse cx="40" cy="66" rx="5" ry="2.5" fill="#C0B8A8" />
    </svg>
  );
}

function Lizalfos() {
  return (
    <svg viewBox="0 0 60 70" width="80" height="80" style={{ imageRendering: 'pixelated' }}>
      {/* 꼬리 */}
      <path d="M30,55 Q50,58 56,50 Q60,44 52,40" stroke="#2A7A30" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M30,55 Q50,58 56,50 Q60,44 52,40" stroke="#3AAA40" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* 몸통 */}
      <ellipse cx="28" cy="44" rx="13" ry="16" fill="#2A7A30" />
      {/* 비늘 패턴 */}
      <ellipse cx="28" cy="35" rx="7" ry="4" fill="#3AAA40" opacity="0.6" />
      <ellipse cx="28" cy="43" rx="8" ry="4" fill="#3AAA40" opacity="0.5" />
      <ellipse cx="28" cy="51" rx="7" ry="4" fill="#3AAA40" opacity="0.5" />
      {/* 목 */}
      <rect x="24" y="26" width="8" height="10" rx="3" fill="#2A7A30" />
      {/* 머리 (뾰족한 도마뱀 머리) */}
      <path d="M14,20 Q16,12 28,10 Q40,12 44,20 Q42,30 28,30 Q14,30 14,20 Z" fill="#2A7A30" />
      {/* 눈 (노란 세로 동공) */}
      <ellipse cx="21" cy="19" rx="4" ry="4" fill="#F0D020" />
      <ellipse cx="35" cy="19" rx="4" ry="4" fill="#F0D020" />
      <ellipse cx="21" cy="19" rx="1.5" ry="3" fill="#101010" />
      <ellipse cx="35" cy="19" rx="1.5" ry="3" fill="#101010" />
      {/* 혀 */}
      <path d="M28,28 L28,34 L25,37 M28,34 L31,37" stroke="#DD2020" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* 볏 */}
      <path d="M22,10 L20,4 L25,9 L28,3 L31,9 L36,4 L34,10" fill="#1A5A20" />
      {/* 왼팔 (발톱) */}
      <path d="M16,36 Q8,40 6,50" stroke="#2A7A30" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M6,50 L3,54 M6,50 L6,55 M6,50 L9,54" stroke="#1A4A18" strokeWidth="1.5" strokeLinecap="round" />
      {/* 오른팔 + 무기 (단검) */}
      <path d="M40,36 Q48,40 50,48" stroke="#2A7A30" strokeWidth="6" fill="none" strokeLinecap="round" />
      <line x1="50" y1="34" x2="54" y2="58" stroke="#B0B8C0" strokeWidth="3" strokeLinecap="round" />
      <rect x="47" y="46" width="7" height="2.5" rx="1" fill="#7A4010" />
      {/* 다리 */}
      <path d="M20,58 Q17,64 15,68" stroke="#2A7A30" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M36,58 Q39,64 41,68" stroke="#2A7A30" strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function FireWizzrobe() {
  return (
    <svg viewBox="0 0 60 70" width="80" height="80" style={{ imageRendering: 'pixelated' }}>
      {/* 불꽃 후광 */}
      <ellipse cx="30" cy="35" rx="18" ry="22" fill="#FF6000" opacity="0.15" />
      {/* 뾰족한 모자 */}
      <polygon points="30,2 18,24 42,24" fill="#8B0000" />
      <polygon points="30,2 20,18 28,20" fill="#6A0000" opacity="0.5" />
      {/* 모자 챙 */}
      <rect x="14" y="23" width="32" height="4" rx="2" fill="#6A0000" />
      {/* 로브 몸통 */}
      <path d="M16,28 Q14,42 12,58 L48,58 Q46,42 44,28 Q38,26 30,26 Q22,26 16,28 Z" fill="#AA0000" />
      {/* 로브 주름 */}
      <line x1="22" y1="28" x2="18" y2="58" stroke="#880000" strokeWidth="1.5" opacity="0.7" />
      <line x1="38" y1="28" x2="42" y2="58" stroke="#880000" strokeWidth="1.5" opacity="0.7" />
      <line x1="30" y1="27" x2="30" y2="58" stroke="#880000" strokeWidth="1" opacity="0.5" />
      {/* 로브 하단 불꽃 장식 */}
      <path d="M12,58 L16,52 L20,58 L24,51 L28,58 L32,51 L36,58 L40,52 L44,58 L48,58"
        fill="#FF6000" opacity="0.8" />
      {/* 얼굴 (어둠 속에) */}
      <ellipse cx="30" cy="32" rx="8" ry="8" fill="#1A0000" />
      {/* 눈 (불꽃 빛) */}
      <ellipse cx="26" cy="30" rx="3" ry="3" fill="#FF4000" />
      <ellipse cx="34" cy="30" rx="3" ry="3" fill="#FF4000" />
      <ellipse cx="26" cy="30" rx="1.5" ry="1.5" fill="#FFD000" />
      <ellipse cx="34" cy="30" rx="1.5" ry="1.5" fill="#FFD000" />
      {/* 미소 (사악) */}
      <path d="M24,36 Q30,40 36,36" stroke="#FF4000" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* 왼손 (불꽃) */}
      <ellipse cx="11" cy="44" rx="5" ry="5" fill="#FF6000" opacity="0.8" />
      <ellipse cx="11" cy="44" rx="3" ry="3" fill="#FFD000" opacity="0.9" />
      <path d="M8,40 L6,35 M11,39 L11,34 M14,40 L16,35" stroke="#FF8000" strokeWidth="1.5" strokeLinecap="round" />
      {/* 오른손 (불꽃) */}
      <ellipse cx="49" cy="44" rx="5" ry="5" fill="#FF6000" opacity="0.8" />
      <ellipse cx="49" cy="44" rx="3" ry="3" fill="#FFD000" opacity="0.9" />
      <path d="M46,40 L44,35 M49,39 L49,34 M52,40 L54,35" stroke="#FF8000" strokeWidth="1.5" strokeLinecap="round" />
      {/* 팔 (로브 소매) */}
      <path d="M16,36 Q10,40 11,44" stroke="#AA0000" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M44,36 Q50,40 49,44" stroke="#AA0000" strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function WingedLynel() {
  return (
    <svg viewBox="0 0 60 70" width="80" height="80" style={{ imageRendering: 'pixelated' }}>
      {/* 날개 (왼쪽) */}
      <path d="M18,25 Q2,15 0,30 Q2,42 14,38 Q16,35 18,32" fill="#4A3020" />
      <path d="M18,25 Q5,18 3,28 Q5,38 15,35" fill="#6A4A30" opacity="0.6" />
      {/* 날개 (오른쪽) */}
      <path d="M42,25 Q58,15 60,30 Q58,42 46,38 Q44,35 42,32" fill="#4A3020" />
      <path d="M42,25 Q55,18 57,28 Q55,38 45,35" fill="#6A4A30" opacity="0.6" />
      {/* 말 몸통 */}
      <ellipse cx="30" cy="50" rx="18" ry="12" fill="#C8A870" />
      {/* 몸통 갈기 패턴 */}
      <ellipse cx="30" cy="45" rx="10" ry="5" fill="#D8C090" opacity="0.5" />
      {/* 사자 머리 */}
      <ellipse cx="30" cy="24" rx="13" ry="12" fill="#C8A060" />
      {/* 갈기 */}
      <path d="M17,18 Q14,12 18,8 Q22,4 27,6 Q30,3 33,6 Q38,4 42,8 Q46,12 43,18"
        fill="#8B4A10" />
      <path d="M17,24 Q13,20 14,16 Q16,12 20,14" fill="#7A3A08" opacity="0.7" />
      <path d="M43,24 Q47,20 46,16 Q44,12 40,14" fill="#7A3A08" opacity="0.7" />
      {/* 눈 */}
      <ellipse cx="23" cy="22" rx="3.5" ry="3.5" fill="#E0D020" />
      <ellipse cx="37" cy="22" rx="3.5" ry="3.5" fill="#E0D020" />
      <ellipse cx="23" cy="22" rx="1.5" ry="2" fill="#101010" />
      <ellipse cx="37" cy="22" rx="1.5" ry="2" fill="#101010" />
      {/* 코 */}
      <path d="M26,27 Q30,30 34,27" stroke="#9A7040" strokeWidth="1.5" fill="none" />
      <circle cx="27.5" cy="26.5" r="1.2" fill="#806030" />
      <circle cx="32.5" cy="26.5" r="1.2" fill="#806030" />
      {/* 입 + 이빨 */}
      <path d="M22,30 Q30,35 38,30" stroke="#9A7040" strokeWidth="1.5" fill="none" />
      <rect x="27" y="29" width="2.5" height="3" rx="0.5" fill="white" />
      <rect x="30.5" y="29" width="2.5" height="3" rx="0.5" fill="white" />
      {/* 다리 4개 */}
      <rect x="14" y="58" width="7" height="10" rx="2" fill="#B09060" />
      <rect x="22" y="58" width="7" height="10" rx="2" fill="#B09060" />
      <rect x="31" y="58" width="7" height="10" rx="2" fill="#B09060" />
      <rect x="39" y="58" width="7" height="10" rx="2" fill="#B09060" />
      {/* 발굽 */}
      <rect x="13" y="67" width="9" height="3" rx="1.5" fill="#5A3A10" />
      <rect x="21" y="67" width="9" height="3" rx="1.5" fill="#5A3A10" />
      <rect x="30" y="67" width="9" height="3" rx="1.5" fill="#5A3A10" />
      <rect x="38" y="67" width="9" height="3" rx="1.5" fill="#5A3A10" />
      {/* 꼬리 */}
      <path d="M45,52 Q54,50 56,56 Q54,62 48,60" stroke="#8B4A10" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Ganon() {
  return (
    <svg viewBox="0 0 60 70" width="80" height="80" style={{ imageRendering: 'pixelated' }}>
      {/* 어둠 후광 */}
      <ellipse cx="30" cy="38" rx="24" ry="26" fill="#200030" opacity="0.4" />
      {/* 망토 */}
      <path d="M10,28 Q6,45 8,65 L52,65 Q54,45 50,28 Q42,24 30,24 Q18,24 10,28 Z" fill="#300050" />
      {/* 망토 주름 */}
      <path d="M20,28 L14,65" stroke="#200040" strokeWidth="2" opacity="0.7" />
      <path d="M40,28 L46,65" stroke="#200040" strokeWidth="2" opacity="0.7" />
      <path d="M30,25 L30,65" stroke="#200040" strokeWidth="1.5" opacity="0.5" />
      {/* 뿔 (왼쪽) */}
      <path d="M18,14 Q8,4 10,0 Q14,4 16,10 Q20,6 22,12" fill="#501080" />
      {/* 뿔 (오른쪽) */}
      <path d="M42,14 Q52,4 50,0 Q46,4 44,10 Q40,6 38,12" fill="#501080" />
      {/* 머리 */}
      <ellipse cx="30" cy="18" rx="15" ry="14" fill="#3A0060" />
      {/* 보석 (이마) */}
      <polygon points="30,8 27,12 30,15 33,12" fill="#FF2060" />
      <polygon points="30,8 27,12 30,15 33,12" fill="none" stroke="#FF80A0" strokeWidth="0.8" />
      {/* 눈 (악마) */}
      <ellipse cx="23" cy="19" rx="4.5" ry="4" fill="#FF2000" />
      <ellipse cx="37" cy="19" rx="4.5" ry="4" fill="#FF2000" />
      <ellipse cx="23" cy="19" rx="2.5" ry="2.5" fill="#FF8000" />
      <ellipse cx="37" cy="19" rx="2.5" ry="2.5" fill="#FF8000" />
      <circle cx="22.5" cy="18.5" r="1" fill="white" opacity="0.8" />
      <circle cx="36.5" cy="18.5" r="1" fill="white" opacity="0.8" />
      {/* 입 (사악한 미소) */}
      <path d="M22,26 Q30,32 38,26" fill="#200040" />
      <path d="M22,26 Q30,30 38,26" stroke="#FF2000" strokeWidth="1.5" fill="none" />
      <rect x="26" y="25" width="2.5" height="3.5" rx="0.5" fill="#D0A0A0" />
      <rect x="31.5" y="25" width="2.5" height="3.5" rx="0.5" fill="#D0A0A0" />
      {/* 왼팔 */}
      <path d="M12,32 Q4,40 6,52" stroke="#3A0060" strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* 오른팔 + 삼지창 */}
      <path d="M48,32 Q56,40 54,52" stroke="#3A0060" strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* 삼지창 */}
      <line x1="56" y1="24" x2="52" y2="58" stroke="#8090A0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="26" x2="52" y2="34" stroke="#8090A0" strokeWidth="2" strokeLinecap="round" />
      <line x1="56" y1="24" x2="58" y2="32" stroke="#8090A0" strokeWidth="2" strokeLinecap="round" />
      {/* 삼지창 빛 */}
      <line x1="56" y1="24" x2="55" y2="56" stroke="rgba(150,200,255,0.3)" strokeWidth="1" />
      {/* 다리 */}
      <rect x="20" y="56" width="9" height="12" rx="2" fill="#2A0050" />
      <rect x="31" y="56" width="9" height="12" rx="2" fill="#2A0050" />
      {/* 발 */}
      <ellipse cx="24.5" cy="68" rx="7" ry="3" fill="#180030" />
      <ellipse cx="35.5" cy="68" rx="7" ry="3" fill="#180030" />
    </svg>
  );
}

export default function MonsterSprite({ type, size = 80 }) {
  const sprites = { bokoblin: Bokoblin, stalfos: Stalfos, lizalfos: Lizalfos,
                    fireWizzrobe: FireWizzrobe, wingedLynel: WingedLynel, ganon: Ganon };
  const Sprite = sprites[type];
  if (!Sprite) return <span style={{ fontSize: 40 }}>👾</span>;
  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Sprite />
    </div>
  );
}
