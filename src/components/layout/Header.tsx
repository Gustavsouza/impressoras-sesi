import { Printer, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function Header() {
  const { isDark, toggle } = useTheme();

  return (
    <header className="h-14 bg-white dark:bg-night-2 border-b border-brand-4 dark:border-night-3 sticky top-0 z-40">
      <div className="max-w-350 mx-auto px-6 h-full flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-1 flex items-center justify-center shrink-0">
            <Printer className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-brand-1 dark:text-night-5 text-sm tracking-tight">
            PrintSys
          </span>
          <span className="hidden sm:inline-block text-[11px] font-medium text-brand-2 dark:text-night-4 border border-brand-4 dark:border-night-3 rounded px-1.5 py-0.5">
            Monitor
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-brand-2 dark:text-night-4 hover:bg-brand-5 dark:hover:bg-night-1 transition-colors"
            aria-label="Alternar tema"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="w-8 h-8 rounded-full bg-brand-1 flex items-center justify-center text-xs font-bold text-white cursor-pointer select-none">
            GS
          </div>
        </div>

      </div>
    </header>
  );
}
