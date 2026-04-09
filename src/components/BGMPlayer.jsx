import { useEffect, useRef, useState } from 'react';

// BotW 감성 펜타토닉 음표 (Hz) — D 장조 펜타토닉
const N = {
  D3: 146.83, A3: 220.00, B3: 246.94,
  D4: 293.66, E4: 329.63, Fs4: 369.99, A4: 440.00, B4: 493.88,
  D5: 587.33, E5: 659.25, Fs5: 739.99, A5: 880.00,
};

// BotW 메인 테마 감성 멜로디 시퀀스
// [음, 시작시간(초), 길이(초), 볼륨(0-1)]
const MELODY = [
  [N.Fs4, 0.0,  2.0, 0.5],
  [N.A4,  2.5,  1.5, 0.45],
  [N.B4,  4.5,  2.5, 0.55],
  [N.A4,  8.0,  1.2, 0.4],
  [N.Fs4, 10.0, 1.8, 0.45],
  [N.D4,  12.5, 3.0, 0.5],

  [N.E4,  17.0, 1.5, 0.4],
  [N.Fs4, 19.0, 1.2, 0.45],
  [N.A4,  21.0, 2.0, 0.5],
  [N.B4,  24.0, 1.5, 0.45],
  [N.A4,  26.5, 1.0, 0.35],
  [N.Fs4, 28.0, 1.5, 0.4],
  [N.E4,  30.5, 3.5, 0.5],

  [N.D5,  36.0, 2.0, 0.5],
  [N.B4,  39.0, 1.5, 0.4],
  [N.A4,  41.5, 1.2, 0.45],
  [N.Fs4, 43.5, 1.5, 0.4],
  [N.E4,  46.0, 2.5, 0.45],
  [N.D4,  50.0, 4.0, 0.4],
];

// 하프 아르페지오 (배경 하모니)
const HARP = [
  [N.D3,  1.0,  2.5, 0.18],
  [N.A3,  1.2,  2.5, 0.16],
  [N.D4,  1.4,  2.5, 0.14],

  [N.A3,  13.0, 3.0, 0.18],
  [N.D4,  13.2, 3.0, 0.15],
  [N.Fs4, 13.4, 3.0, 0.13],

  [N.D3,  31.0, 3.5, 0.18],
  [N.A3,  31.2, 3.5, 0.16],
  [N.D4,  31.4, 3.5, 0.14],

  [N.A3,  50.5, 4.0, 0.18],
  [N.D4,  50.7, 4.0, 0.15],
  [N.Fs4, 50.9, 4.0, 0.12],
];

const LOOP_DURATION = 56; // 초

function createReverb(ctx) {
  const convolver = ctx.createConvolver();
  const len = ctx.sampleRate * 2.5;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const ch = buf.getChannelData(c);
    for (let i = 0; i < len; i++) {
      ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
    }
  }
  convolver.buffer = buf;
  return convolver;
}

function playNote(ctx, freq, startTime, duration, volume, reverb, masterGain, type = 'sine') {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  const sendGain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  // 약간의 피아노/하프 느낌: 빠른 어택, 자연스러운 디케이
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.06);
  gain.gain.exponentialRampToValueAtTime(volume * 0.6, startTime + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  // 리버브 센드
  sendGain.gain.setValueAtTime(0.35, startTime);

  osc.connect(gain);
  gain.connect(masterGain);
  gain.connect(sendGain);
  sendGain.connect(reverb);
  reverb.connect(masterGain);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.1);
}

export default function BGMPlayer() {
  const ctxRef      = useRef(null);
  const masterRef   = useRef(null);
  const reverbRef   = useRef(null);
  const loopRef     = useRef(null);
  const startRef    = useRef(null);
  const [muted, setMuted]     = useState(() => localStorage.getItem('bgm-muted') === 'true');
  const [started, setStarted] = useState(false);

  function scheduleLoop(offset = 0) {
    const ctx     = ctxRef.current;
    const master  = masterRef.current;
    const reverb  = reverbRef.current;
    const now     = ctx.currentTime;
    const base    = now + 0.05 - offset;

    [...MELODY, ...HARP].forEach(([freq, t, dur, vol]) => {
      const absT = base + t;
      if (absT > now - 0.01) {
        playNote(ctx, freq, Math.max(absT, now + 0.01), dur, vol, reverb, master,
          HARP.some(h => h[0] === freq && h[1] === t) ? 'triangle' : 'sine');
      }
    });

    // 다음 루프 예약
    loopRef.current = setTimeout(() => {
      scheduleLoop(0);
    }, (LOOP_DURATION - offset) * 1000 - 200);
  }

  function startBGM() {
    if (ctxRef.current) return;

    const ctx    = new (window.AudioContext || window.webkitAudioContext)();
    const master = ctx.createGain();
    const reverb = createReverb(ctx);

    master.gain.setValueAtTime(muted ? 0 : 0.6, ctx.currentTime);
    master.connect(ctx.destination);

    ctxRef.current    = ctx;
    masterRef.current = master;
    reverbRef.current = reverb;
    startRef.current  = ctx.currentTime;

    scheduleLoop(0);
    setStarted(true);
  }

  // 첫 터치/클릭 시 자동 시작 (iOS 정책 대응)
  useEffect(() => {
    const handler = () => {
      if (!ctxRef.current) startBGM();
      document.removeEventListener('touchstart', handler);
      document.removeEventListener('click', handler);
    };
    document.addEventListener('touchstart', handler, { passive: true });
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('touchstart', handler);
      document.removeEventListener('click', handler);
    };
  }, []);

  // 음소거 상태 반영
  useEffect(() => {
    if (masterRef.current && ctxRef.current) {
      masterRef.current.gain.setTargetAtTime(
        muted ? 0 : 0.6,
        ctxRef.current.currentTime,
        0.3
      );
    }
    localStorage.setItem('bgm-muted', muted);
  }, [muted]);

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      clearTimeout(loopRef.current);
      ctxRef.current?.close();
    };
  }, []);

  function handleToggle() {
    setMuted(m => !m);
    if (!ctxRef.current) startBGM();
  }

  return (
    <button
      onClick={handleToggle}
      title={muted ? '음악 켜기' : '음악 끄기'}
      style={{
        width: 34, height: 34,
        borderRadius: '50%',
        border: '1.5px solid rgba(200,169,106,0.6)',
        background: muted
          ? 'rgba(200,190,170,0.6)'
          : 'linear-gradient(145deg, rgba(245,237,216,0.9), rgba(232,213,176,0.8))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(44,26,8,0.15)',
        flexShrink: 0,
        transition: 'all 0.2s',
        fontSize: 15,
      }}
    >
      {muted ? '🔇' : '🎵'}
    </button>
  );
}
