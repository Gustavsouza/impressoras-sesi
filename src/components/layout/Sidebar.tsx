import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Printer, AlertTriangle, Settings, Activity, Zap } from 'lucide-react';
import { printers } from '../../data/printers';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',      path: '/',        end: true  },
  { icon: Printer,         label: 'Impressoras',    path: '/printers', end: false },
  { icon: AlertTriangle,   label: 'Alertas',        path: '/alerts',   end: false },
  { icon: Settings,        label: 'Configurações',  path: '/settings', end: false },
] as const;

export default function Sidebar() {
  const critical = printers.filter(p => p.status === 'critical').length;
  const warning  = printers.filter(p => p.status === 'warning').length;
  const alerts   = critical + warning;

  return (
    <aside className="w-[220px] flex-shrink-0 h-screen flex flex-col bg-[#0b0b18] border-r border-white/[0.05]">
      {/* Brand */}
      <div className="p-5 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 flex-shrink-0">
            <Printer className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-100 leading-none tracking-tight">PrintSys</p>
            <p className="text-[10px] text-slate-500 mt-0.5 tracking-wide">Monitor</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 px-3 py-2.5">
          Principal
        </p>
        {NAV.map(({ icon: Icon, label, path, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                'transition-all duration-200 group border',
                isActive
                  ? 'bg-violet-500/10 text-violet-300 border-violet-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-transparent',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={[
                    'w-4 h-4 flex-shrink-0 transition-colors',
                    isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300',
                  ].join(' ')}
                />
                <span className="flex-1">{label}</span>
                {label === 'Alertas' && alerts > 0 && (
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                    {alerts}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* System status panel */}
      <div className="p-3 border-t border-white/[0.05]">
        <div className="bg-slate-900/50 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">Sistema</span>
            <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
              <Zap className="w-3 h-3" /> Ativo
            </span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>Monitorando</span>
              <span className="font-semibold text-slate-300">{printers.length} imp.</span>
            </div>
            {critical > 0 && (
              <div className="flex items-center justify-between text-slate-500">
                <span>Crítico</span>
                <span className="font-bold text-red-400">{critical}</span>
              </div>
            )}
            {warning > 0 && (
              <div className="flex items-center justify-between text-slate-500">
                <span>Atenção</span>
                <span className="font-bold text-amber-400">{warning}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
