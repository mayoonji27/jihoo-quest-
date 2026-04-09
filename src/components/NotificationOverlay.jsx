import { useEffect } from 'react';
import { useGame } from '../store/GameContext';
import SheikahEye from './SheikahEye';

export default function NotificationOverlay() {
  const { state, dispatch } = useGame();
  const notifications = state.notifications || [];

  useEffect(() => {
    if (notifications.length === 0) return;
    const timer = setTimeout(() => {
      dispatch({ type: 'DISMISS_NOTIFICATION', payload: { id: notifications[0].id } });
    }, 3500);
    return () => clearTimeout(timer);
  }, [notifications, dispatch]);

  if (notifications.length === 0) return null;
  const n = notifications[0];

  const isSonic = n.type === 'sonic';
  const isCheer = n.type === 'cheer';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 pointer-events-none"
      style={{ background: 'rgba(0,0,0,0.15)' }}
    >
      <div
        className="pointer-events-auto text-center cursor-pointer"
        style={{
          background: isSonic
            ? 'linear-gradient(145deg, #1A3060 0%, #2A50A0 100%)'
            : isCheer
              ? 'linear-gradient(145deg, var(--cream) 0%, var(--parchment) 100%)'
              : 'linear-gradient(145deg, var(--green-hyrule) 0%, #2A5830 100%)',
          border: `2px solid ${isSonic ? '#6A9FDF' : isCheer ? 'var(--cream-border)' : '#4A8840'}`,
          borderRadius: 16,
          padding: '20px 32px',
          boxShadow: isSonic
            ? '0 8px 32px rgba(74,143,191,0.5), 0 0 60px rgba(74,143,191,0.2)'
            : '0 8px 24px rgba(44,26,8,0.25)',
          animation: 'questPop 0.4s ease-out',
          maxWidth: 300,
        }}
        onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', payload: { id: n.id } })}
      >
        {isSonic && (
          <div className="flex justify-center mb-2">
            <SheikahEye size={36} glow color="#7BBDE0" />
          </div>
        )}
        <div style={{ fontSize: 32, marginBottom: 6 }}>
          {isSonic ? '⚡' : isCheer ? '💌' : '🎉'}
        </div>
        <div
          style={{
            color: isSonic ? '#C8E8FF' : isCheer ? 'var(--brown-dark)' : '#E0FFE0',
            fontWeight: 700,
            fontSize: 16,
            fontFamily: isSonic ? 'Cinzel, serif' : 'inherit',
            letterSpacing: isSonic ? '0.05em' : 'normal',
          }}
        >
          {n.message}
        </div>
        <div style={{ color: isSonic ? 'rgba(200,232,255,0.6)' : 'var(--brown-light)', fontSize: 11, marginTop: 8 }}>
          탭하면 닫혀요
        </div>
      </div>
    </div>
  );
}
