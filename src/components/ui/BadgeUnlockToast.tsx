import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BADGE_DEFINITIONS } from '../../constants/badges';

export default function BadgeUnlockToast() {
  const { state, dismissBadge } = useApp();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const currentId = state.badgeQueue[0];
  const def = currentId ? BADGE_DEFINITIONS.find((b) => b.id === currentId) : null;

  useEffect(() => {
    if (!def) { setVisible(false); setLeaving(false); return; }
    setLeaving(false);
    setVisible(true);
    const timer = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => {
        dismissBadge();
        setLeaving(false);
      }, 400);
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentId, def, dismissBadge]);

  if (!def || !visible) return null;

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-800 border border-indigo-600 rounded-2xl px-6 py-4 shadow-2xl flex flex-col items-center gap-2 min-w-48 ${
        leaving ? 'animate-slide-down' : 'animate-slide-up'
      }`}
    >
      <div className="text-xs text-indigo-400 font-semibold uppercase tracking-widest">Badge Unlocked!</div>
      <div className="text-4xl">{def.icon}</div>
      <div className="font-bold text-white text-center">{def.name}</div>
      <div className="text-xs text-gray-400 text-center">{def.description}</div>
    </div>
  );
}
