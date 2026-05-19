import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  label: string;
}

export default function FilterDropdown({ value, onChange, options, label }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="
          flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg
          bg-white dark:bg-night-1
          border border-brand-4 dark:border-night-3
          text-gray-700 dark:text-night-5
          hover:bg-brand-5/40 dark:hover:bg-night-2
          transition-colors whitespace-nowrap
        "
      >
        <span className="text-brand-2 dark:text-night-4">{label}:</span>
        <span className="font-medium">{selected?.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-brand-3 dark:text-night-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="
          absolute top-full mt-1 left-0 z-50 min-w-35
          bg-white dark:bg-night-2
          border border-brand-4 dark:border-night-3
          rounded-xl shadow-lg overflow-hidden
        ">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={[
                'w-full text-left px-4 py-2.5 text-sm transition-colors',
                opt.value === value
                  ? 'text-brand-1 bg-brand-5 dark:text-night-5 dark:bg-night-3/40'
                  : 'text-gray-700 dark:text-night-4 hover:bg-brand-5/50 dark:hover:bg-night-1',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
