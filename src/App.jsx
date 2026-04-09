import { useState } from 'react';
import { GameProvider, useGame } from './store/GameContext';
import ExpBar from './components/ExpBar';
import CharacterSprite from './components/CharacterSprite';
import NotificationOverlay from './components/NotificationOverlay';
import GrassBackground from './components/GrassBackground';
import SheikahEye from './components/SheikahEye';
import BGMPlayer from './components/BGMPlayer';
import RegionUnlockPopup from './components/RegionUnlockPopup';
import QuestPage from './pages/QuestPage';
import CharacterPage from './pages/CharacterPage';
import MapPage from './pages/MapPage';
import RoomPage from './pages/RoomPage';
import ParentPage from './pages/ParentPage';

const TABS = [
  { key: 'quest',     label: '퀘스트', emoji: '⚔️' },
  { key: 'character', label: '용사',   emoji: '🧝' },
  { key: 'map',       label: '지도',   emoji: '🗺️' },
  { key: 'room',      label: '내 방',  emoji: '🏠' },
  { key: 'parent',    label: '부모님', emoji: '🔒' },
];

function Header() {
  const { state, levelInfo } = useGame();
  const { totalExp } = state;

  return (
    <div className="safe-top" style={{ position: 'relative', zIndex: 10 }}>
      {/* 메인 헤더 */}
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(91,184,212,0.92) 0%, rgba(141,212,200,0.88) 100%)',
          backdropFilter: 'blur(8px)',
          borderBottom: '2px solid rgba(200,169,106,0.4)',
          padding: '10px 16px 8px',
        }}
      >
        {/* 타이틀 줄 */}
        <div className="flex items-center gap-2 mb-1">
          {/* 왼쪽: 쉐이카 문양 */}
          <SheikahEye size={24} color="rgba(44,26,8,0.5)" />

          {/* 타이틀 */}
          <div className="flex-1 text-center">
            <div
              className="botw-title"
              style={{
                fontSize: 19,
                color: 'var(--brown-dark)',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textShadow: '0 1px 3px rgba(255,255,255,0.5), 0 0 20px rgba(212,130,10,0.15)',
              }}
            >
              지후의 전설
            </div>
            <div
              style={{
                fontSize: 9,
                color: 'var(--brown-mid)',
                letterSpacing: '0.18em',
                fontFamily: 'Cinzel, serif',
                opacity: 0.75,
                marginTop: 1,
              }}
            >
              THE LEGEND OF JIHOO
            </div>
          </div>

          {/* 오른쪽: BGM + 캐릭터 + EXP */}
          <div className="flex items-center gap-2">
            <BGMPlayer />
            <div className="text-right">
              <div
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontWeight: 700,
                  fontSize: 13,
                  color: 'var(--amber)',
                }}
              >
                {totalExp.toLocaleString()}
              </div>
              <div style={{ fontSize: 9, color: 'var(--brown-mid)', letterSpacing: '0.1em' }}>
                EXP
              </div>
            </div>
            <CharacterSprite equipment={levelInfo.equipment} size={40} />
          </div>
        </div>

        {/* 레벨 배지 줄 */}
        <div className="flex items-center justify-center gap-2">
          <div
            style={{
              background: 'rgba(245,237,216,0.75)',
              border: '1px solid rgba(200,169,106,0.6)',
              borderRadius: 999,
              padding: '2px 12px',
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--brown-mid)',
              fontFamily: 'Cinzel, serif',
            }}
          >
            Lv.{levelInfo.level}  {levelInfo.title}
          </div>
        </div>
      </div>

      {/* 젤다 목표 프로그레스바 */}
      <div
        style={{
          background: 'rgba(245,237,216,0.88)',
          backdropFilter: 'blur(6px)',
          borderBottom: '1px solid rgba(200,169,106,0.35)',
          paddingTop: 6,
          paddingBottom: 2,
        }}
      >
        <ExpBar />
      </div>
    </div>
  );
}

function BottomNav({ tab, setTab }) {
  return (
    <div
      className="safe-bottom"
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        zIndex: 30,
        background: 'rgba(245,237,216,0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '2px solid var(--cream-border)',
        boxShadow: '0 -4px 16px var(--shadow)',
      }}
    >
      <div className="flex">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1,
              padding: '8px 2px 6px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: 20, lineHeight: 1 }}>{t.emoji}</div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                marginTop: 2,
                color: tab === t.key ? 'var(--amber)' : 'var(--brown-light)',
                fontFamily: tab === t.key ? 'Cinzel, serif' : 'inherit',
                transition: 'color 0.2s',
              }}
            >
              {t.label}
            </div>
            {tab === t.key && <div className="tab-active-dot" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function AppContent() {
  const [tab, setTab] = useState('quest');

  // 페이지 타이틀
  const PAGE_TITLES = {
    quest:     '모험 일지',
    character: '용사 현황',
    map:       '세계 지도',
    room:      '나의 방',
    parent:    '부모님 화면',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* 고정 헤더 */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20 }}>
        <Header />
      </div>

      {/* 풀잎 배경 */}
      <GrassBackground />

      {/* 페이지 타이틀 바 */}
      <div
        style={{
          textAlign: 'center',
          padding: '10px 0 8px',
          position: 'relative',
          zIndex: 5,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            background: 'rgba(245,237,216,0.82)',
            border: '1.5px solid var(--cream-border)',
            borderRadius: 999,
            padding: '4px 20px',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--brown-mid)',
            fontFamily: 'Cinzel, serif',
            letterSpacing: '0.06em',
            boxShadow: '0 2px 8px var(--shadow)',
          }}
        >
          ✦ {PAGE_TITLES[tab]} ✦
        </span>
      </div>

      {/* 페이지 컨텐츠 */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 96,
          position: 'relative',
          zIndex: 5,
        }}
      >
        {tab === 'quest'     && <QuestPage />}
        {tab === 'character' && <CharacterPage />}
        {tab === 'map'       && <MapPage />}
        {tab === 'room'      && <RoomPage />}
        {tab === 'parent'    && <ParentPage />}
      </div>

      {/* 하단 탭바 */}
      <BottomNav tab={tab} setTab={setTab} />

      {/* 알림 오버레이 */}
      <NotificationOverlay />

      {/* 지역 잠금 해제 팝업 */}
      <RegionUnlockPopup />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
