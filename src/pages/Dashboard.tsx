import { useState, useMemo } from 'react';
import { Sun, Moon, Printer, Wifi, WifiOff } from 'lucide-react';
import type { Printer as PrinterType } from '../types/printer';
import { usePrinters } from '../hooks/usePrinters';
import { useNetworkDetection } from '../hooks/useNetworkDetection';
import { useTheme } from '../contexts/ThemeContext';
import DashboardStats from '../components/dashboard/DashboardStats';
import PrinterCard from '../components/dashboard/PrinterCard';
import PrinterModal from '../components/dashboard/PrinterModal';
import SearchBar from '../components/ui/SearchBar';
import FilterDropdown from '../components/ui/FilterDropdown';

const TYPE_OPTIONS = [
  { value: 'all',   label: 'Todos'         },
  { value: 'laser', label: 'Laser'         },
  { value: 'ink',   label: 'Jato de Tinta' },
];

export default function Dashboard() {
  const { isDark, toggle } = useTheme();
  const { onCorporateNetwork, toggleNetwork } = useNetworkDetection();

  const {
    printers,
    search, setSearch,
    filterStatus, toggleFilter,
    filterType, setFilterType,
    filterUnit, setFilterUnit,
    units,
    stats,
    updatePrinter,
  } = usePrinters();

  const [selected, setSelected] = useState<PrinterType | null>(null);

  const grouped = useMemo(() => {
    const map: Record<string, PrinterType[]> = {};
    for (const p of printers) {
      (map[p.model] ??= []).push(p);
    }
    return Object.entries(map);
  }, [printers]);

  const hasFilters = search !== '' || filterStatus !== 'all' || filterType !== 'all' || filterUnit !== 'all';

  return (
    <div className="space-y-5">

      {/* Page title + theme toggle */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-brand-1 dark:text-night-5">
            Monitoramento de Impressoras
          </h1>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <p className="text-sm text-brand-2 dark:text-night-4">
              {stats.total} impressoras · clique para editar
            </p>
            {!onCorporateNetwork && (
              <button
                onClick={toggleNetwork}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/25 dark:text-amber-400 dark:border-amber-700/40 hover:bg-amber-200 dark:hover:bg-amber-900/40 transition-colors"
                title="Clique para marcar como dentro da rede corporativa"
              >
                <WifiOff className="w-3 h-3 shrink-0" />
                Fora da rede corporativa
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleNetwork}
            className={[
              'w-8 h-8 flex items-center justify-center rounded-lg border transition-colors',
              onCorporateNetwork
                ? 'border-brand-4 dark:border-night-3 text-brand-2 dark:text-night-4 hover:bg-brand-5 dark:hover:bg-night-2'
                : 'border-amber-300 dark:border-amber-700/50 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20',
            ].join(' ')}
            aria-label="Alternar status de rede"
            title={onCorporateNetwork ? 'Rede corporativa ativa — clique para desativar' : 'Fora da rede corporativa — clique para ativar'}
          >
            {onCorporateNetwork
              ? <Wifi className="w-4 h-4" />
              : <WifiOff className="w-4 h-4" />}
          </button>
          <button
            onClick={toggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-brand-4 dark:border-night-3 text-brand-2 dark:text-night-4 hover:bg-brand-5 dark:hover:bg-night-2 transition-colors"
            aria-label="Alternar tema"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Stats */}
      <DashboardStats
        stats={stats}
        activeFilter={filterStatus}
        onFilter={toggleFilter}
      />

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <FilterDropdown
          value={filterUnit}
          onChange={setFilterUnit}
          options={units}
          label="Unidade"
        />
        <FilterDropdown
          value={filterType}
          onChange={v => setFilterType(v as 'all' | 'laser' | 'ink')}
          options={TYPE_OPTIONS}
          label="Tipo"
        />
      </div>

      {/* Results info + clear */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-brand-2 dark:text-night-4">
          <span className="font-semibold text-brand-1 dark:text-night-5">{printers.length}</span>
          {' '}de{' '}
          <span className="font-semibold text-brand-1 dark:text-night-5">{stats.total}</span>
          {' '}impressoras
        </p>
        {hasFilters && (
          <button
            onClick={() => { setSearch(''); toggleFilter('all'); setFilterType('all'); setFilterUnit('all'); }}
            className="text-xs text-brand-2 dark:text-night-4 hover:text-brand-1 dark:hover:text-night-5 transition-colors"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Grouped grid */}
      {grouped.length > 0 ? (
        <div className="space-y-6">
          {grouped.map(([model, list]) => (
            <section key={model}>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Printer className="w-3.5 h-3.5 text-brand-2 dark:text-night-4" />
                  <h2 className="text-sm font-semibold text-brand-1 dark:text-night-5">{model}</h2>
                </div>
                <span className="text-xs text-brand-3 dark:text-night-4 bg-brand-5 dark:bg-night-2 border border-brand-4 dark:border-night-3 rounded-full px-2 py-0.5">
                  {list.length}
                </span>
                <div className="flex-1 h-px bg-brand-4/40 dark:bg-night-3/40" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {list.map(p => (
                  <PrinterCard
                    key={p.id}
                    printer={p}
                    onClick={() => setSelected(p)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-full bg-brand-5 dark:bg-night-2 flex items-center justify-center mb-3">
            <Printer className="w-5 h-5 text-brand-3 dark:text-night-4" />
          </div>
          <p className="text-sm font-medium text-brand-1 dark:text-night-5">
            Nenhuma impressora encontrada
          </p>
          <p className="text-xs text-brand-3 dark:text-night-4 mt-1">
            Ajuste os filtros ou o termo de busca
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {selected && (
        <PrinterModal
          printer={selected}
          onClose={() => setSelected(null)}
          onSave={updated => {
            updatePrinter(updated);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
