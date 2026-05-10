import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import BadgeUnlockToast from '../ui/BadgeUnlockToast';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      <Outlet />
      <BottomNav />
      <BadgeUnlockToast />
    </div>
  );
}
