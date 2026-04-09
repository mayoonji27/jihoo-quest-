// 쉐이카 문명 눈 문양 SVG
export default function SheikahEye({ size = 32, glow = false, color = '#4A8FBF' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={glow ? 'sheikah-glow' : ''}
    >
      {/* 외부 다이아몬드 */}
      <polygon
        points="20,2 38,20 20,38 2,20"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* 눈꺼풀 곡선 */}
      <path
        d="M6,20 Q20,8 34,20 Q20,32 6,20 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
      />
      {/* 눈동자 */}
      <circle cx="20" cy="20" r="5.5" fill={color} opacity="0.9" />
      {/* 눈동자 하이라이트 */}
      <circle cx="21.5" cy="18.5" r="1.8" fill="white" opacity="0.7" />
      {/* 위 속눈썹 선 */}
      <line x1="20" y1="2"  x2="20" y2="10" stroke={color} strokeWidth="1.2" opacity="0.5" />
      {/* 아래 눈물 삼각형 */}
      <polygon
        points="20,30 23,36 17,36"
        fill={color}
        opacity="0.5"
      />
    </svg>
  );
}
