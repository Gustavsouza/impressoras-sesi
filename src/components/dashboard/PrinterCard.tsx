import { Printer } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import TonerBar from '../ui/TonerBar';
import InkLevels from '../ui/InkLevels';
import type { Printer as PrinterType } from '../../types/printer';

const CARD_STYLE: Record<string, string> = {
  online:   'bg-white dark:bg-night-2 border-brand-4 dark:border-night-3',
  warning:  'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700/55',
  critical: 'bg-orange-200 dark:bg-orange-900/45 border-orange-400 dark:border-orange-600/65',
  offline:  'bg-gray-50 dark:bg-night-1/60 border-brand-4/50 dark:border-night-3/40 opacity-70',
};

interface Props {
  printer: PrinterType;
  onClick: () => void;
}

export default function PrinterCard({ printer, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={[
        'w-full text-left rounded-xl border p-4',
        'transition-all duration-200 hover:shadow-md hover:-translate-y-px',
        'focus:outline-none focus:ring-2 focus:ring-brand-3/40 dark:focus:ring-night-4/30',
        CARD_STYLE[printer.status],
      ].join(' ')}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-brand-5 dark:bg-night-1 flex items-center justify-center shrink-0">
            <Printer className="w-3.5 h-3.5 text-brand-2 dark:text-night-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-brand-1 dark:text-night-5 leading-tight truncate">
              {printer.model}
            </p>
            <p className="text-xs text-brand-3 dark:text-night-4 mt-0.5">
              {printer.type === 'laser' ? 'Laser' : 'Jato de Tinta'}
            </p>
          </div>
        </div>
        <StatusBadge status={printer.status} />
      </div>

      {/* Info */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-brand-3 dark:text-night-4 w-9 shrink-0">Setor</span>
          <span className="text-gray-700 dark:text-night-5 font-medium truncate">{printer.sector}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-brand-3 dark:text-night-4 w-9 shrink-0">IP</span>
          <span className="font-mono text-brand-2 dark:text-night-4">{printer.ip}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-brand-4/40 dark:bg-night-3/40 mb-3" />

      {/* Supplies */}
      {printer.type === 'laser' ? (
        <div className="space-y-2">
          <TonerBar level={printer.toner} />
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-3 dark:text-night-4">Págs. restantes</span>
            <span className="text-xs font-semibold text-brand-1 dark:text-night-4 tabular-nums">
              {printer.pagesRemaining.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      ) : (
        <InkLevels
          black={printer.black}
          cyan={printer.cyan}
          magenta={printer.magenta}
          yellow={printer.yellow}
        />
      )}
    </button>
  );
}
