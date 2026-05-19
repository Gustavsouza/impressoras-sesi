import { Monitor, Wifi, AlertTriangle, WifiOff } from 'lucide-react';
import type { FilterStatus } from '../../hooks/usePrinters';

interface Stats {
  total: number;
  online: number;
  attention: number;
  offline: number;
}

interface Props {
  stats: Stats;
  activeFilter: FilterStatus;
  onFilter: (status: FilterStatus) => void;
}

export default function DashboardStats({ stats, activeFilter, onFilter }: Props) {
  const onlinePct = stats.total ? Math.round((stats.online / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

      {/* Total */}
      <div className="bg-white dark:bg-night-2 border border-brand-4 dark:border-night-3 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-lg bg-brand-5 dark:bg-night-1 flex items-center justify-center">
            <Monitor className="w-4 h-4 text-brand-1 dark:text-night-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-brand-1 dark:text-night-5 tabular-nums">{stats.total}</p>
        <p className="text-xs text-gray-500 dark:text-night-4 mt-0.5">Monitoradas</p>
      </div>

      {/* Online */}
      <div className="bg-white dark:bg-night-2 border border-brand-4 dark:border-night-3 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-lg bg-brand-5 dark:bg-night-1 flex items-center justify-center">
            <Wifi className="w-4 h-4 text-brand-1 dark:text-night-4" />
          </div>
          <span className="text-xs font-semibold text-brand-2 dark:text-night-4">{onlinePct}%</span>
        </div>
        <p className="text-2xl font-bold text-brand-1 dark:text-night-5 tabular-nums">{stats.online}</p>
        <p className="text-xs text-gray-500 dark:text-night-4 mt-0.5">Online</p>
      </div>

      {/* Atenção — filtrável */}
      <button
        onClick={() => onFilter('attention')}
        className={[
          'text-left rounded-xl p-4 border transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-amber-400/40',
          activeFilter === 'attention'
            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700/50 ring-1 ring-amber-300 dark:ring-amber-700/50'
            : 'bg-white dark:bg-night-2 border-brand-4 dark:border-night-3 hover:bg-brand-5/30 dark:hover:bg-night-1',
        ].join(' ')}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          {activeFilter === 'attention' && (
            <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
              Filtrado
            </span>
          )}
        </div>
        <p className={`text-2xl font-bold tabular-nums ${stats.attention > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-brand-1 dark:text-night-5'}`}>
          {stats.attention}
        </p>
        <p className="text-xs text-gray-500 dark:text-night-4 mt-0.5">Requer Atenção</p>
      </button>

      {/* Offline — filtrável */}
      <button
        onClick={() => onFilter('offline')}
        className={[
          'text-left rounded-xl p-4 border transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-red-400/40',
          activeFilter === 'offline'
            ? 'bg-red-50 dark:bg-red-900/15 border-red-300 dark:border-red-700/50 ring-1 ring-red-300 dark:ring-red-700/50'
            : 'bg-white dark:bg-night-2 border-brand-4 dark:border-night-3 hover:bg-brand-5/30 dark:hover:bg-night-1',
        ].join(' ')}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
            <WifiOff className="w-4 h-4 text-red-500 dark:text-red-400" />
          </div>
          {activeFilter === 'offline' && (
            <span className="text-[10px] font-semibold text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded">
              Filtrado
            </span>
          )}
        </div>
        <p className={`text-2xl font-bold tabular-nums ${stats.offline > 0 ? 'text-red-600 dark:text-red-400' : 'text-brand-1 dark:text-night-5'}`}>
          {stats.offline}
        </p>
        <p className="text-xs text-gray-500 dark:text-night-4 mt-0.5">Offline</p>
      </button>

    </div>
  );
}
