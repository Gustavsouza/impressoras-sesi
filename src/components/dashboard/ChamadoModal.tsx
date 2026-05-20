import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import type { Printer } from '../../types/printer';

function saudacao() {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return 'bom dia';
  if (h >= 12 && h < 18) return 'boa tarde';
  return 'boa noite';
}

function buildMessage(printer: Printer): string {
  const saud = saudacao();
  const info = [
    `• Modelo: ${printer.model}`,
    `• REP: ${printer.rep}`,
    `• Serial: ${printer.serial}`,
    printer.pin ? `• PIN: ${printer.pin}` : null,
    `• IP: ${printer.ip}`,
    `• Setor: ${printer.sector} — ${printer.unit}`,
  ].filter(Boolean).join('\n');

  if (printer.type === 'laser') {
    return `Prezados, ${saud}!\n\nPor favor, nos enviar toner para a impressora de REP ${printer.rep}, localizada no setor ${printer.sector} (${printer.unit}), pois o suprimento está em nível crítico.\n\n• Toner atual: ${printer.toner}%\n\nDados do equipamento:\n${info}`;
  }

  const baixos = [
    printer.black < 15   && `• Tinta Preta: ${printer.black}%`,
    printer.cyan < 15    && `• Tinta Ciano: ${printer.cyan}%`,
    printer.magenta < 15 && `• Tinta Magenta: ${printer.magenta}%`,
    printer.yellow < 15  && `• Tinta Amarela: ${printer.yellow}%`,
  ].filter(Boolean).join('\n');

  return `Prezados, ${saud}!\n\nPor favor, nos enviar toner(s) para a impressora de REP ${printer.rep}, localizada no setor ${printer.sector} (${printer.unit}), pois as tintas abaixo estão em nível crítico:\n\n${baixos}\n\nDados do equipamento:\n${info}`;
}

interface Props {
  printer: Printer;
  onClose: () => void;
}

export default function ChamadoModal({ printer, onClose }: Props) {
  const [message, setMessage] = useState(() => buildMessage(printer));
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onMouseDown={onClose}>
      <div className="absolute inset-0 bg-brand-1/20 dark:bg-night-1/70 backdrop-blur-sm" />

      <div
        className="relative bg-white dark:bg-night-2 rounded-2xl border border-brand-4 dark:border-night-3 w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col"
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-4/40 dark:border-night-3/60 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <p className="font-semibold text-sm text-brand-1 dark:text-night-5">Abrir Chamado</p>
            </div>
            <p className="text-xs text-brand-2 dark:text-night-4 mt-0.5">
              REP {printer.rep} · {printer.sector}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-brand-3 dark:text-night-4 hover:bg-brand-5 dark:hover:bg-night-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="text-xs text-brand-2 dark:text-night-4 mb-2">
            Mensagem gerada automaticamente — edite se necessário antes de copiar.
          </p>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={14}
            className="w-full px-3 py-2.5 text-sm bg-brand-5/30 dark:bg-night-1 border border-brand-4 dark:border-night-3 rounded-lg text-gray-800 dark:text-night-5 focus:outline-none focus:ring-2 focus:ring-brand-3/40 dark:focus:ring-night-4/30 resize-none font-mono leading-relaxed"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-brand-4/40 dark:border-night-3/60 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-brand-2 dark:text-night-4 hover:text-brand-1 dark:hover:text-night-5 transition-colors"
          >
            Fechar
          </button>
          <button
            onClick={handleCopy}
            className={[
              'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              copied
                ? 'bg-green-500 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white',
            ].join(' ')}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado!' : 'Copiar mensagem'}
          </button>
        </div>
      </div>
    </div>
  );
}
