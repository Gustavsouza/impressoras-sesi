import type { PrinterStatusType } from '../types/printer';

export const statusConfig: Record<
  PrinterStatusType,
  { label: string; color: string; bgColor: string; borderColor: string; dotColor: string }
> = {
  online: {
    label: 'Online',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/20',
    dotColor: 'bg-emerald-400',
  },
  warning: {
    label: 'Atenção',
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/20',
    dotColor: 'bg-amber-400',
  },
  critical: {
    label: 'Crítico',
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/20',
    dotColor: 'bg-red-400',
  },
  offline: {
    label: 'Offline',
    color: 'text-slate-400',
    bgColor: 'bg-slate-400/10',
    borderColor: 'border-slate-400/20',
    dotColor: 'bg-slate-500',
  },
};

export function getTonerGradient(level: number): string {
  if (level > 50) return 'from-emerald-500 to-emerald-400';
  if (level > 25) return 'from-amber-500 to-amber-400';
  return 'from-red-500 to-red-400';
}

export function getTonerTextColor(level: number): string {
  if (level > 50) return 'text-emerald-400';
  if (level > 25) return 'text-amber-400';
  return 'text-red-400';
}
