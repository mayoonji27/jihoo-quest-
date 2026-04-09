import { useMemo } from 'react';

// BotW 하이랄 평원 느낌의 풀잎 애니메이션
export default function GrassBackground() {
  const blades = useMemo(() => {
    const result = [];
    const count = 55;
    for (let i = 0; i < count; i++) {
      const left = (i / count) * 100 + (Math.random() * 1.8 - 0.9);
      const height = 28 + Math.random() * 42;
      const width = 3 + Math.random() * 3;
      const delay = Math.random() * 3;
      const duration = 2.2 + Math.random() * 1.8;
      const isR = Math.random() > 0.5;
      // 색상: 밝은 연두 ~ 진한 초록
      const hue = 105 + Math.random() * 25;
      const sat = 55 + Math.random() * 30;
      const lig1 = 22 + Math.random() * 12;
      const lig2 = 42 + Math.random() * 18;
      result.push({ left, height, width, delay, duration, isR, hue, sat, lig1, lig2 });
    }
    return result;
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 64, // 탭바 위
        left: 0,
        right: 0,
        height: 90,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {blades.map((b, i) => (
        <div
          key={i}
          className={`grass-blade ${b.isR ? 'sway-r' : 'sway'}`}
          style={{
            left: `${b.left}%`,
            height: b.height,
            width: b.width,
            background: `linear-gradient(to top, hsl(${b.hue},${b.sat}%,${b.lig1}%), hsl(${b.hue},${b.sat}%,${b.lig2}%), transparent)`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            opacity: 0.75,
          }}
        />
      ))}
    </div>
  );
}
