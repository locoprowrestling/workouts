import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, Trophy, Swords } from 'lucide-react';

const tabs = [
  { to: '/',            icon: LayoutDashboard, label: 'Home'    },
  { to: '/log',         icon: PlusCircle,      label: 'Log'     },
  { to: '/history',     icon: History,         label: 'History' },
  { to: '/quests',      icon: Swords,          label: 'Quests'  },
  { to: '/achievements',icon: Trophy,          label: 'Badges'  },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex z-40">
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-2 gap-0.5 text-xs transition-colors ${
              isActive ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'
            }`
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
