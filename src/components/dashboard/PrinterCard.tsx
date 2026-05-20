import { useState } from 'react';
import { Printer, Copy, Check } from 'lucide-react';
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

function needsChamado(p: PrinterType): boolean {
  if (p.type === 'laser') return p.toner < 15;
  return p.black < 15 || p.cyan < 15 || p.magenta < 15 || p.yellow < 15;
}

interface Props {
  printer: PrinterType;
  onClick: () => void;
  onChamado: () => void;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-1 shrink-0 text-brand-4 dark:text-night-3 hover:text-brand-2 dark:hover:text-night-5 transition-colors"
      title={`Copiar "${value}"`}
    >
      {copied
        ? <Check className="w-3 h-3 text-green-500" />
        : <Copy className="w-3 h-3" />}
    </button>
  );
}

export default function PrinterCard({ printer, onClick, onChamado }: Props) {
  return (
    <div className={`rounded-xl border ${CARD_STYLE[printer.status]} transition-all duration-200`}>

      {/* Main clickable area */}
      <button
        onClick={onClick}
        className="w-full text-left p-4 hover:brightness-95 dark:hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-brand-3/40 dark:focus:ring-night-4/30 rounded-t-xl transition-all"
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
            <span className="text-brand-3 dark:text-night-4 w-9 shrink-0">REP</span>
            <span className="text-gray-700 dark:text-night-5 font-semibold">{printer.rep}</span>
            <CopyButton value={printer.rep} />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-brand-3 dark:text-night-4 w-9 shrink-0">Setor</span>
            <span className="text-gray-700 dark:text-night-5 font-medium truncate">{printer.sector}</span>
            <CopyButton value={printer.sector} />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-brand-3 dark:text-night-4 w-9 shrink-0">IP</span>
            <span className="font-mono text-brand-2 dark:text-night-4">{printer.ip}</span>
            <CopyButton value={printer.ip} />
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

      {/* Chamado button — only when supplies are critical (< 15%) */}
      {needsChamado(printer) && (
        <div className="px-4 pb-4">
          <button
            onClick={onChamado}
            className="w-full py-1.5 text-xs font-semibold bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-lg transition-colors"
          >
            Abrir Chamado
          </button>
        </div>
      )}
    </div>
  );
}
