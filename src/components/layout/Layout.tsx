import { Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import BottomNav from './BottomNav';
import BadgeUnlockToast from '../ui/BadgeUnlockToast';
import { useAuth } from '../../context/AuthContext';

export default function Layout() {
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      <div className="flex justify-end items-center px-4 pt-3 pb-1">
        <button
          onClick={signOut}
          title={`Signed in as ${user?.email}`}
          className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          <span className="hidden sm:block truncate max-w-[180px]">{user?.email}</span>
          <LogOut size={14} />
        </button>
      </div>
      <Outlet />
      <BottomNav />
      <BadgeUnlockToast />
    </div>
  );
}
