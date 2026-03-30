import { Sidebar } from '@/components/sidebar';
import { HomeDashboard } from '@/components/home-dashboard';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <HomeDashboard />
      </main>
    </div>
  );
}
