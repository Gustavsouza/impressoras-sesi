import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Printer, Wifi, WifiOff, RefreshCw, Clock, FileText } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { printers } from '../data/printers';
import { generateTonerHistory, generateWeeklyUsage, generateInkHistory } from '../data/mockHistory';
import StatusBadge from '../components/ui/StatusBadge';
import TonerBar from '../components/ui/TonerBar';
import InkLevels from '../components/ui/InkLevels';

const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#0e0e1c',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    fontSize: '12px',
    color: '#94a3b8',
  },
  labelStyle: { color: '#64748b', marginBottom: '4px' },
};

export default function PrinterDetail() {
  const { id } = useParams<{ id: string }>();
  const printer = printers.find(p => p.id === Number(id));

  if (!printer) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-800/60 flex items-center justify-center mb-4">
          <Printer className="w-6 h-6 text-slate-600" />
        </div>
        <p className="text-slate-300 font-semibold">Impressora não encontrada</p>
        <Link to="/" className="mt-4 text-sm text-violet-400 hover:text-violet-300 transition-colors">
          ← Voltar ao Dashboard
        </Link>
      </div>
    );
  }

  const isLaser = printer.type === 'laser';
  const lastUpdate = new Date().toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const tonerHistory = isLaser ? generateTonerHistory(printer.toner) : null;
  const inkHistory   = !isLaser
    ? generateInkHistory({ black: printer.black, cyan: printer.cyan, magenta: printer.magenta, yellow: printer.yellow })
    : null;
  const weeklyUsage = generateWeeklyUsage();

  const statusLabel = { online: 'Operando', warning: 'Atenção', critical: 'Crítico', offline: 'Offline' }[printer.status];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-5"
        >
          <ChevronLeft className="w-4 h-4" />
          Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800/70 border border-white/6 flex items-center justify-center shrink-0">
              <Printer className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-slate-100">{printer.model}</h2>
                <StatusBadge status={printer.status} />
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                {printer.sector} · {printer.ip}
              </p>
            </div>
          </div>

          <button className="
            inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
            bg-slate-800/60 hover:bg-slate-800 border border-white/6 hover:border-white/10
            text-slate-300 hover:text-slate-100 transition-all duration-200 self-start sm:self-auto
          ">
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Status */}
        <div className="bg-slate-950/60 border border-white/6 rounded-xl p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-3">Status</p>
          <div className="flex items-center gap-2.5 mb-4">
            {printer.status !== 'offline'
              ? <Wifi className="w-5 h-5 text-emerald-400 shrink-0" />
              : <WifiOff className="w-5 h-5 text-slate-500 shrink-0" />
            }
            <span className="text-lg font-bold text-slate-100">{statusLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{lastUpdate}</span>
          </div>
        </div>

        {/* Supply */}
        <div className="bg-slate-950/60 border border-white/6 rounded-xl p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-3">
            {isLaser ? 'Toner' : 'Suprimentos'}
          </p>
          {isLaser ? (
            <>
              <p className="text-3xl font-bold text-slate-100 tabular-nums mb-3">{printer.toner}%</p>
              <TonerBar level={printer.toner} showLabel={false} />
            </>
          ) : (
            <InkLevels
              black={printer.black}
              cyan={printer.cyan}
              magenta={printer.magenta}
              yellow={printer.yellow}
            />
          )}
        </div>

        {/* Pages / Paper */}
        <div className="bg-slate-950/60 border border-white/6 rounded-xl p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-3">
            {isLaser ? 'Páginas Restantes' : 'Status do Papel'}
          </p>
          {isLaser ? (
            <>
              <div className="flex items-end gap-2 mb-1">
                <p className="text-3xl font-bold text-slate-100 tabular-nums leading-none">
                  {printer.pagesRemaining.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                <FileText className="w-3.5 h-3.5" />
                <span>páginas estimadas</span>
              </div>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-emerald-400 mb-2">Restante</p>
              <p className="text-xs text-slate-500">nível de papel</p>
            </>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Supply history */}
        <div className="bg-slate-950/60 border border-white/6 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-0.5">
            {isLaser ? 'Histórico de Toner' : 'Histórico de Tinta'}
          </h3>
          <p className="text-xs text-slate-500 mb-5">Últimos 7 dias</p>

          <ResponsiveContainer width="100%" height={180}>
            {isLaser ? (
              <AreaChart data={tonerHistory!} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
                <defs>
                  <linearGradient id="tonerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${Number(v)}%`, 'Toner']} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#tonerGrad)"
                  dot={{ r: 3, fill: '#8b5cf6', strokeWidth: 0 }}
                  activeDot={{ r: 4, fill: '#a78bfa', strokeWidth: 0 }}
                />
              </AreaChart>
            ) : (
              <AreaChart data={inkHistory!} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v, name) => [`${Number(v)}%`, String(name).toUpperCase()]} />
                <Area type="monotone" dataKey="black"   stroke="#94a3b8" strokeWidth={1.5} fill="rgba(148,163,184,0.06)" />
                <Area type="monotone" dataKey="cyan"    stroke="#22d3ee" strokeWidth={1.5} fill="rgba(34,211,238,0.06)"  />
                <Area type="monotone" dataKey="magenta" stroke="#f472b6" strokeWidth={1.5} fill="rgba(244,114,182,0.06)" />
                <Area type="monotone" dataKey="yellow"  stroke="#fbbf24" strokeWidth={1.5} fill="rgba(251,191,36,0.06)"  />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Weekly usage */}
        <div className="bg-slate-950/60 border border-white/6 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-0.5">Páginas Impressas</h3>
          <p className="text-xs text-slate-500 mb-5">Por dia — últimos 7 dias</p>

          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyUsage} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [Number(v), 'Páginas']} />
              <Bar
                dataKey="pages"
                fill="#6366f1"
                fillOpacity={0.8}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Device info */}
      <div className="bg-slate-950/60 border border-white/6 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-5">Informações do Dispositivo</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5">
          {[
            { label: 'Modelo',        value: printer.model },
            { label: 'Tipo',          value: printer.type === 'laser' ? 'Laser' : 'Jato de Tinta' },
            { label: 'Endereço IP',   value: printer.ip },
            { label: 'Setor',         value: printer.sector },
            { label: 'Serial (mock)', value: '16908309' },
            { label: 'Firmware',      value: printer.type === 'laser' ? '2.41.0' : '07.67.DB15OA' },
            { label: 'Protocolo',     value: 'HTTPS' },
            { label: 'Última sync',   value: lastUpdate },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-1">{label}</p>
              <p className="text-sm text-slate-300 font-medium truncate">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
