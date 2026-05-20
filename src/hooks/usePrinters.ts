import { useState, useMemo, useEffect, useCallback } from 'react';
import { printers as initialData } from '../data/printers';
import type { Printer, PrinterStatusData } from '../types/printer';
import { getPrinterStatus } from '../services/printers/parserManager';

export type FilterStatus = 'all' | 'online' | 'attention' | 'offline';
export type FilterType = 'laser' | 'ink' | 'all';

function applyLiveData(printer: Printer, live: PrinterStatusData): Printer {
  const base = { ...printer, status: live.status };
  if (base.type === 'laser') {
    return { ...base, toner: live.toner ?? base.toner, pagesRemaining: live.pagesRemaining ?? base.pagesRemaining };
  }
  const ink = base as Extract<Printer, { type: 'ink' }>;
  return { ...base, black: live.black ?? ink.black, cyan: live.cyan ?? ink.cyan, magenta: live.magenta ?? ink.magenta, yellow: live.yellow ?? ink.yellow };
}

export function usePrinters() {
  const [all, setAll] = useState<Printer[]>(initialData);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterUnit, setFilterUnit] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [proxyAvailable, setProxyAvailable] = useState<boolean | null>(null);

  const runFetch = useCallback(async () => {
    setRefreshing(true);
    const results = await Promise.allSettled(
      initialData.map(p => getPrinterStatus(p).then(data => ({ id: p.id, data }))),
    );
    const liveMap: Record<number, PrinterStatusData> = {};
    for (const r of results) {
      if (r.status === 'fulfilled') liveMap[r.value.id] = r.value.data;
    }
    const anyLive = Object.keys(liveMap).length > 0;
    setProxyAvailable(anyLive);
    if (anyLive) {
      setAll(prev => prev.map(p => {
        const live = liveMap[p.id];
        return live ? applyLiveData(p, live) : p;
      }));
    }
    setRefreshing(false);
  }, []);

  useEffect(() => { runFetch(); }, [runFetch]);

  const units = useMemo(() => {
    const unique = Array.from(new Set(all.map(p => p.unit))).sort();
    return [{ value: 'all', label: 'Todas' }, ...unique.map(u => ({ value: u, label: u }))];
  }, [all]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return all.filter(p => {
      const matchSearch = !q || p.model.toLowerCase().includes(q) || p.sector.toLowerCase().includes(q) || p.ip.includes(q);
      const matchStatus =
        filterStatus === 'all' ? true :
        filterStatus === 'attention' ? (p.status === 'warning' || p.status === 'critical') :
        p.status === filterStatus;
      const matchType = filterType === 'all' || p.type === filterType;
      const matchUnit = filterUnit === 'all' || p.unit === filterUnit;
      return matchSearch && matchStatus && matchType && matchUnit;
    });
  }, [all, search, filterStatus, filterType, filterUnit]);

  const stats = useMemo(() => {
    const scope = filterUnit === 'all' ? all : all.filter(p => p.unit === filterUnit);
    return {
      total:     scope.length,
      online:    scope.filter(p => p.status !== 'offline').length,
      attention: scope.filter(p => p.status === 'warning' || p.status === 'critical').length,
      offline:   scope.filter(p => p.status === 'offline').length,
    };
  }, [all, filterUnit]);

  const updatePrinter = (updated: Printer) =>
    setAll(prev => prev.map(p => p.id === updated.id ? updated : p));

  const toggleFilter = (status: FilterStatus) =>
    setFilterStatus(prev => prev === status ? 'all' : status);

  return {
    printers: filtered,
    search, setSearch,
    filterStatus, setFilterStatus, toggleFilter,
    filterType, setFilterType,
    filterUnit, setFilterUnit,
    units, stats, updatePrinter,
    refresh: runFetch, refreshing, proxyAvailable,
  };
}
