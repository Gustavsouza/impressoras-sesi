import { Bell, RefreshCw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { printers } from '../../data/printers';

const PAGE_TITLES: Record<string, string> = {
  '/':          'Dashboard',
  '/printers':  'Impressoras',
  '/alerts':    'Alertas',
  '/settings':  'Configurações',
};

export default function Topbar() {
  const { pathname } = useLocation();

  const title = PAGE_TITLES[pathname] ?? 'Impressora';

  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const alerts = printers.filter(p => p.status === 'critical' || p.status === 'warning').length;

  return (
    <header className="h-14 flex-shrink-0 flex items-center justify-between px-6 border-b border-white/[0.05] bg-[#0b0b18]/80 backdrop-blur-sm">
      <div>
        <h1 className="text-base font-semibold text-slate-100 leading-none">{title}</h1>
        <p className="text-[11px] text-slate-500 mt-0.5 capitalize">
          {dateStr} · {timeStr}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="
            flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg
            bg-slate-800/60 hover:bg-slate-800 border border-white/[0.05] hover:border-white/10
            text-slate-400 hover:text-slate-200 transition-all duration-200
          "
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Atualizar
        </button>

        <button
          className="
            relative w-9 h-9 flex items-center justify-center rounded-lg
            bg-slate-800/60 hover:bg-slate-800 border border-white/[0.05] hover:border-white/10
            text-slate-400 hover:text-slate-200 transition-all duration-200
          "
          aria-label="Notificações"
        >
          <Bell className="w-4 h-4" />
          {alerts > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
          )}
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-violet-500/20 cursor-pointer">
          GS
        </div>
      </div>
    </header>
  );
}
