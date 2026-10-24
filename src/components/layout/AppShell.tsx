import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

function AppShell() {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Main content area */}
      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>
      
      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}

export default AppShell;
