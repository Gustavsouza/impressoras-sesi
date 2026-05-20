import { useState } from 'react';
import { X, Save, PencilLine } from 'lucide-react';
import type { Printer as PrinterType, PrinterStatusType } from '../../types/printer';
import TonerBar from '../ui/TonerBar';
import InkLevels from '../ui/InkLevels';
import StatusBadge from '../ui/StatusBadge';

interface Props {
  printer: PrinterType;
  onClose: () => void;
  onSave: (updated: PrinterType) => void;
}

const FIELD = 'w-full px-3 py-2 text-sm bg-brand-5/30 dark:bg-night-1 border border-brand-4 dark:border-night-3 rounded-lg text-gray-800 dark:text-night-5 focus:outline-none focus:ring-2 focus:ring-brand-3/40 dark:focus:ring-night-4/30 transition-shadow';
const LABEL = 'text-xs font-medium text-brand-2 dark:text-night-4 mb-1.5 block';
const READONLY = 'w-full px-3 py-2 text-sm bg-brand-5/20 dark:bg-night-1/50 border border-brand-4/50 dark:border-night-3/40 rounded-lg text-gray-500 dark:text-night-4 cursor-not-allowed select-none';

function clampPct(v: string) { return Math.min(100, Math.max(0, parseInt(v) || 0)); }

const STATUS_OPTIONS: { value: PrinterStatusType; label: string }[] = [
  { value: 'online',   label: 'Online'            },
  { value: 'warning',  label: 'Atenção'           },
  { value: 'critical', label: 'Intervenção'       },
  { value: 'offline',  label: 'Offline'           },
];

export default function PrinterModal({ printer, onClose, onSave }: Props) {
  const [ip,     setIp]     = useState(printer.ip);
  const [sector, setSector] = useState(printer.sector);
  const [status, setStatus] = useState<PrinterStatusType>(printer.status);

  const [toner,          setToner]          = useState(printer.type === 'laser' ? printer.toner          : 0);
  const [pagesRemaining, setPagesRemaining] = useState(printer.type === 'laser' ? printer.pagesRemaining : 0);
  const [black,   setBlack]   = useState(printer.type === 'ink' ? printer.black   : 0);
  const [cyan,    setCyan]    = useState(printer.type === 'ink' ? printer.cyan    : 0);
  const [magenta, setMagenta] = useState(printer.type === 'ink' ? printer.magenta : 0);
  const [yellow,  setYellow]  = useState(printer.type === 'ink' ? printer.yellow  : 0);

  const handleSave = () => {
    const base = { ...printer, ip: ip.trim(), sector: sector.trim(), status };
    const updated: PrinterType = printer.type === 'laser'
      ? { ...base, type: 'laser', toner, pagesRemaining }
      : { ...base, type: 'ink', black, cyan, magenta, yellow };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onMouseDown={onClose}>
      <div className="absolute inset-0 bg-brand-1/20 dark:bg-night-1/70 backdrop-blur-sm" />

      <div
        className="relative bg-white dark:bg-night-2 rounded-2xl border border-brand-4 dark:border-night-3 w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col"
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-4/40 dark:border-night-3/60 shrink-0">
          <div>
            <p className="font-semibold text-sm text-brand-1 dark:text-night-5">{printer.model}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-brand-2 dark:text-night-4">{printer.unit}</span>
              <StatusBadge status={status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-brand-3 dark:text-night-4 hover:bg-brand-5 dark:hover:bg-night-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

          {/* Identificação */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs font-semibold text-brand-1 dark:text-night-4 uppercase tracking-wider">
                Identificação
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <label className={LABEL}>Modelo</label>
                <div className={READONLY}>{printer.model}</div>
              </div>
              <div>
                <label className={LABEL}>Nome / Setor</label>
                <input type="text" value={sector} onChange={e => setSector(e.target.value)}
                  className={FIELD} placeholder="Ex: SECRETARIA" />
              </div>
              <div>
                <label className={LABEL}>Endereço IP</label>
                <input type="text" value={ip} onChange={e => setIp(e.target.value)}
                  className={`${FIELD} font-mono`} placeholder="Ex: 10.50.8.11" />
              </div>
              <div>
                <label className={LABEL}>Status</label>
                <select value={status} onChange={e => setStatus(e.target.value as PrinterStatusType)}
                  className={FIELD}>
                  {STATUS_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Suprimentos */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs font-semibold text-brand-1 dark:text-night-4 uppercase tracking-wider">
                Suprimentos
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] text-brand-3 dark:text-night-4/60 bg-brand-5/50 dark:bg-night-1/60 border border-brand-4/50 dark:border-night-3/40 rounded px-1.5 py-0.5">
                <PencilLine className="w-2.5 h-2.5" />
                manual
              </span>
            </div>

            {printer.type === 'laser' ? (
              <div className="space-y-3">
                <div>
                  <label className={LABEL}>Toner (%)</label>
                  <input type="number" min={0} max={100} value={toner}
                    onChange={e => setToner(clampPct(e.target.value))}
                    className={FIELD} />
                  <div className="mt-2">
                    <TonerBar level={toner} />
                  </div>
                </div>
                <div>
                  <label className={LABEL}>Páginas restantes</label>
                  <input type="number" min={0} value={pagesRemaining}
                    onChange={e => setPagesRemaining(Math.max(0, parseInt(e.target.value) || 0))}
                    className={FIELD} />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { label: 'Preto (%)',   value: black,   set: setBlack   },
                    { label: 'Ciano (%)',   value: cyan,    set: setCyan    },
                    { label: 'Magenta (%)', value: magenta, set: setMagenta },
                    { label: 'Amarelo (%)', value: yellow,  set: setYellow  },
                  ] as const).map(({ label, value, set }) => (
                    <div key={label}>
                      <label className={LABEL}>{label}</label>
                      <input type="number" min={0} max={100} value={value}
                        onChange={e => set(clampPct(e.target.value))}
                        className={FIELD} />
                    </div>
                  ))}
                </div>
                <div className="bg-brand-5/20 dark:bg-night-1/50 border border-brand-4/50 dark:border-night-3/40 rounded-lg px-3 py-3">
                  <InkLevels black={black} cyan={cyan} magenta={magenta} yellow={yellow} />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-brand-4/40 dark:border-night-3/60 shrink-0">
          <button onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-brand-2 dark:text-night-4 hover:text-brand-1 dark:hover:text-night-5 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-brand-1 hover:bg-brand-2 text-white rounded-lg transition-colors dark:bg-night-3 dark:hover:bg-night-4 dark:text-night-5">
            <Save className="w-3.5 h-3.5" />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
