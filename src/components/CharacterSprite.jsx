/**
 * BotW 링크 스타일 캐릭터 SVG
 * 초록 튜닉 + 뾰족한 모자 + 금발 + 파란 눈
 * 레벨별 장비: none → shield → sword → armor → fullarmor → legend
 */
export default function CharacterSprite({ equipment = 'none', size = 120, animate = false }) {
  // 튜닉 색상
  const tunicColor  = equipment === 'fullarmor' ? '#3A6A8A'
                    : equipment === 'legend'    ? '#2A5A7A'
                    : equipment === 'armor'     ? '#4A7A4A'
                    : '#4E8A3A'; // 기본 초록 튜닉

  const armorDetail = equipment === 'fullarmor' ? '#5A9ABF'
                    : equipment === 'legend'    ? '#4A8AAF'
                    : equipment === 'armor'     ? '#6AAA6A'
                    : null;

  const hasShield   = ['shield','sword','armor','fullarmor','legend'].includes(equipment);
  const hasSword    = ['sword','armor','fullarmor','legend'].includes(equipment);
  const isLegend    = equipment === 'legend';

  return (
    <div
      className={animate ? 'animate-bounce' : ''}
      style={{ display: 'inline-block', width: size, height: size, flexShrink: 0 }}
    >
      <svg
        viewBox="0 0 40 60"
        width={size}
        height={size}
        style={{ imageRendering: 'pixelated', overflow: 'visible' }}
      >
        {/* ── 전설 글로우 ── */}
        {isLegend && (
          <ellipse cx="20" cy="30" rx="14" ry="22" fill="#FFD700" opacity="0.08" />
        )}

        {/* ══════════════════════════════
            모자 (뒤쪽 — 얼굴 위에 그림)
        ══════════════════════════════ */}
        {/* 모자 메인 */}
        <path
          d="M8,18 L8,10 Q10,2 20,1 Q24,1 28,6 L32,4 L30,10 L32,12 L28,12 L28,18 Z"
          fill="#3E8A2A"
        />
        {/* 모자 뾰족한 끝 (오른쪽 위로) */}
        <path d="M26,8 L36,2 L32,10 Z" fill="#3E8A2A" />
        {/* 모자 챙 */}
        <rect x="6" y="17" width="26" height="3" rx="1.5" fill="#2E6E1E" />
        {/* 모자 밴드 (금색) */}
        <rect x="8" y="17" width="22" height="1.5" rx="0.5" fill="#E8C030" opacity="0.85" />
        {/* 모자 하이라이트 */}
        <path d="M10,10 Q14,4 20,3" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" fill="none" />

        {/* ══════════════════════════════
            금발 머리카락
        ══════════════════════════════ */}
        {/* 양 옆 머리카락 */}
        <path d="M8,18 Q5,20 6,26 Q8,28 10,25 L10,20 Z" fill="#F0C020" />
        <path d="M32,18 Q35,20 34,26 Q32,28 30,25 L30,20 Z" fill="#F0C020" />
        {/* 앞머리 (모자 아래) */}
        <rect x="10" y="19" width="20" height="3" rx="1" fill="#E8B818" />

        {/* ══════════════════════════════
            얼굴
        ══════════════════════════════ */}
        {/* 얼굴 윤곽 */}
        <path
          d="M10,20 Q9,30 12,35 Q15,38 20,38 Q25,38 28,35 Q31,30 30,20 Z"
          fill="#F5C8A0"
        />
        {/* 귀 (뾰족한 엘프 귀) */}
        <path d="M10,22 Q6,24 7,28 Q9,30 10,28 L10,22 Z" fill="#F5C8A0" />
        <path d="M30,22 Q34,24 33,28 Q31,30 30,28 L30,22 Z" fill="#F5C8A0" />
        {/* 귀 그림자 */}
        <path d="M10,24 Q7.5,26 8,28" stroke="#D4A070" strokeWidth="0.7" fill="none" />
        <path d="M30,24 Q32.5,26 32,28" stroke="#D4A070" strokeWidth="0.7" fill="none" />

        {/* 파란 눈 */}
        <ellipse cx="14.5" cy="27" rx="2.2" ry="2.5" fill="white" />
        <ellipse cx="25.5" cy="27" rx="2.2" ry="2.5" fill="white" />
        <ellipse cx="14.5" cy="27.5" rx="1.5" ry="1.8" fill="#5090D8" />
        <ellipse cx="25.5" cy="27.5" rx="1.5" ry="1.8" fill="#5090D8" />
        <ellipse cx="14.3" cy="27.3" rx="0.8" ry="1.0" fill="#2060A8" />
        <ellipse cx="25.3" cy="27.3" rx="0.8" ry="1.0" fill="#2060A8" />
        {/* 눈 하이라이트 */}
        <circle cx="15.1" cy="26.8" r="0.5" fill="white" opacity="0.9" />
        <circle cx="26.1" cy="26.8" r="0.5" fill="white" opacity="0.9" />
        {/* 눈썹 */}
        <path d="M12.5,24.5 Q14.5,23.5 16.5,24.5" stroke="#C89040" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        <path d="M23.5,24.5 Q25.5,23.5 27.5,24.5" stroke="#C89040" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        {/* 코 */}
        <path d="M19,31 Q20,32.5 21,31" stroke="#D4A070" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        {/* 입 */}
        <path d="M16.5,34 Q18,35.5 20,35 Q22,34.5 23.5,34" stroke="#D07850" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        {/* 볼 홍조 */}
        <ellipse cx="13" cy="31" rx="2" ry="1.2" fill="#F0A090" opacity="0.35" />
        <ellipse cx="27" cy="31" rx="2" ry="1.2" fill="#F0A090" opacity="0.35" />

        {/* ══════════════════════════════
            몸통 (튜닉)
        ══════════════════════════════ */}
        {/* 속옷 (흰색 셔츠) */}
        <rect x="12" y="37" width="16" height="14" rx="2" fill="#F0EDE0" />
        {/* 튜닉 메인 */}
        <path d="M10,38 Q10,50 12,54 L28,54 Q30,50 30,38 Q25,36 20,36 Q15,36 10,38 Z" fill={tunicColor} />
        {/* 튜닉 칼라 */}
        <path d="M14,37 Q17,35 20,35.5 Q23,35 26,37 Q23,39 20,38.5 Q17,39 14,37 Z" fill="#F0EDE0" />
        {/* 튜닉 장식선 */}
        <line x1="20" y1="38" x2="20" y2="53" stroke={armorDetail || 'rgba(0,0,0,0.12)'} strokeWidth="0.8" />
        {/* 벨트 */}
        <rect x="11" y="48" width="18" height="3" rx="1" fill="#7A4A20" />
        <rect x="18.5" y="47.5" width="3" height="4" rx="0.5" fill="#D4A020" />

        {/* 갑옷 디테일 */}
        {armorDetail && (
          <>
            <path d="M12,40 Q16,38 20,38.5 Q24,38 28,40 L28,44 Q24,42 20,42.5 Q16,42 12,44 Z"
              fill={armorDetail} opacity="0.5" />
            <path d="M13,38 L13,48" stroke={armorDetail} strokeWidth="1" opacity="0.6" />
            <path d="M27,38 L27,48" stroke={armorDetail} strokeWidth="1" opacity="0.6" />
          </>
        )}

        {/* ══════════════════════════════
            팔
        ══════════════════════════════ */}
        {/* 왼팔 */}
        <path d="M10,38 Q6,42 7,50 Q9,52 11,50 L12,44 L12,38 Z" fill={tunicColor} />
        {/* 오른팔 */}
        <path d="M30,38 Q34,42 33,50 Q31,52 29,50 L28,44 L28,38 Z" fill={tunicColor} />
        {/* 왼손 */}
        <ellipse cx="8.5" cy="51" rx="2.5" ry="2" fill="#F5C8A0" />
        {/* 오른손 */}
        <ellipse cx="31.5" cy="51" rx="2.5" ry="2" fill="#F5C8A0" />

        {/* ══════════════════════════════
            다리 & 부츠
        ══════════════════════════════ */}
        {/* 왼다리 */}
        <rect x="12" y="53" width="7" height="10" rx="1" fill="#E8D8B0" />
        {/* 오른다리 */}
        <rect x="21" y="53" width="7" height="10" rx="1" fill="#E8D8B0" />
        {/* 왼부츠 */}
        <path d="M11,61 Q11,64 15,64 Q18,64 19,61 L19,57 L12,57 Z" fill="#5A3018" />
        {/* 오른부츠 */}
        <path d="M21,61 Q21,64 25,64 Q28,64 29,61 L29,57 L21,57 Z" fill="#5A3018" />
        {/* 부츠 하이라이트 */}
        <path d="M12,60 Q14,58 18,60" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" fill="none" />
        <path d="M22,60 Q24,58 28,60" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" fill="none" />

        {/* ══════════════════════════════
            방패 (왼팔에)
        ══════════════════════════════ */}
        {hasShield && (
          <g>
            {/* 방패 몸체 */}
            <path d="M2,40 L2,52 Q5,56 7,56 Q9,56 10,52 L10,40 Q8,38 6,38 Q4,38 2,40 Z"
              fill="#2850A8" />
            {/* 방패 테두리 */}
            <path d="M2,40 L2,52 Q5,56 7,56 Q9,56 10,52 L10,40 Q8,38 6,38 Q4,38 2,40 Z"
              fill="none" stroke="#1A3880" strokeWidth="0.8" />
            {/* 방패 문양 */}
            <path d="M3,43 L6,40 L9,43 L9,52 Q7,55 6,54 Q5,55 3,52 Z"
              fill="#6080D0" opacity="0.5" />
            <path d="M6,42 L6,53" stroke="#FFD700" strokeWidth="0.8" opacity="0.8" />
            <path d="M3.5,47 L8.5,47" stroke="#FFD700" strokeWidth="0.8" opacity="0.8" />
            {/* 트라이포스 */}
            <polygon points="6,43 5,45 7,45" fill="#FFD700" opacity="0.9" />
            <polygon points="5,45 4,47 6,47" fill="#FFD700" opacity="0.9" />
            <polygon points="7,45 6,47 8,47" fill="#FFD700" opacity="0.9" />
          </g>
        )}

        {/* ══════════════════════════════
            검 (오른쪽 등에)
        ══════════════════════════════ */}
        {hasSword && (
          <g>
            {/* 칼날 */}
            <path d="M33,15 L35,50 L32,50 L34,15 Z" fill="#C8D8E8" />
            {/* 칼날 중앙 홈 */}
            <line x1="34" y1="17" x2="33.5" y2="48" stroke="#A0B8D0" strokeWidth="0.6" />
            {/* 칼날 하이라이트 */}
            <line x1="34.5" y1="17" x2="35" y2="48" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
            {/* 칼끝 */}
            <path d="M32,50 L33.5,55 L35,50 Z" fill="#A0B8D0" />
            {/* 가드 */}
            <rect x="29.5" y="47" width="9" height="3.5" rx="1.5" fill="#7A5018" />
            <circle cx="29.5" cy="48.75" r="1.5" fill="#C08030" />
            <circle cx="38.5" cy="48.75" r="1.5" fill="#C08030" />
            {/* 손잡이 */}
            <rect x="32.5" y="50.5" width="3" height="7" rx="1" fill="#5A3010" />
            {/* 손잡이 감는 선 */}
            <line x1="32.5" y1="52" x2="35.5" y2="52" stroke="#8A5020" strokeWidth="0.6" />
            <line x1="32.5" y1="54" x2="35.5" y2="54" stroke="#8A5020" strokeWidth="0.6" />
            <line x1="32.5" y1="56" x2="35.5" y2="56" stroke="#8A5020" strokeWidth="0.6" />
            {/* 포멜 */}
            <ellipse cx="34" cy="58" rx="2.2" ry="1.5" fill="#C09030" />
            {/* 마스터소드 돌 (전설급) */}
            {isLegend && (
              <>
                <ellipse cx="34" cy="31" rx="1.5" ry="1.5" fill="#6090FF" opacity="0.9" />
                <ellipse cx="34" cy="31" rx="0.8" ry="0.8" fill="white" opacity="0.7" />
                <line x1="34" y1="15" x2="34" y2="50" stroke="rgba(100,180,255,0.3)" strokeWidth="1.5" />
              </>
            )}
          </g>
        )}

        {/* 전설 이펙트 */}
        {isLegend && (
          <>
            <circle cx="20" cy="28" r="12" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.3"
              style={{ animation: 'shimmer 2s ease-in-out infinite' }} />
            <circle cx="34" cy="31" r="6" fill="#FFD700" opacity="0.06" />
          </>
        )}
      </svg>
    </div>
  );
}
