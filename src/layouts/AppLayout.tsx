import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-brand-5/25 dark:bg-night-1">
      <main className="max-w-350 mx-auto px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
