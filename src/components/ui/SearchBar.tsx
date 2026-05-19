import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Buscar por modelo, setor ou IP...' }: Props) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-3 dark:text-night-4 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full bg-white dark:bg-night-1
          border border-brand-4 dark:border-night-3
          text-gray-800 dark:text-night-5
          placeholder-brand-3 dark:placeholder-night-4/60
          text-sm rounded-lg pl-9 pr-9 py-2.5
          focus:outline-none focus:ring-2 focus:ring-brand-3/40 dark:focus:ring-night-4/30
          transition-shadow
        "
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-3 dark:text-night-4 hover:text-brand-1 dark:hover:text-night-5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
