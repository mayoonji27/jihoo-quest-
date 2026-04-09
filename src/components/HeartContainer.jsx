// BotW 스타일 하트 컨테이너
function Heart({ filled, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={filled ? 'heart-full' : 'heart-empty'}>
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={filled ? '#D44040' : 'none'}
        stroke={filled ? '#A03030' : '#8B6B3D'}
        strokeWidth={filled ? 0.5 : 1.5}
      />
    </svg>
  );
}

// 하트 최대 개수 표시 (레벨 기반)
export default function HeartContainer({ current, max = 3 }) {
  return (
    <div className="flex gap-0.5 flex-wrap">
      {Array.from({ length: max }).map((_, i) => (
        <Heart key={i} filled={i < current} />
      ))}
    </div>
  );
}
