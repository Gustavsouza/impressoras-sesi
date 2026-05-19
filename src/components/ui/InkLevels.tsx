interface Props {
  black: number;
  cyan: number;
  magenta: number;
  yellow: number;
}

const CHANNELS = [
  { key: 'black'   as const, label: 'BK', bar: 'bg-gray-700 dark:bg-gray-400',   text: 'text-gray-600 dark:text-gray-400' },
  { key: 'cyan'    as const, label: 'C',  bar: 'bg-cyan-500',                    text: 'text-cyan-600 dark:text-cyan-400' },
  { key: 'magenta' as const, label: 'M',  bar: 'bg-pink-500',                    text: 'text-pink-600 dark:text-pink-400' },
  { key: 'yellow'  as const, label: 'Y',  bar: 'bg-yellow-400',                  text: 'text-yellow-600 dark:text-yellow-400' },
];

export default function InkLevels({ black, cyan, magenta, yellow }: Props) {
  const values = { black, cyan, magenta, yellow };

  return (
    <div className="space-y-2">
      {CHANNELS.map(({ key, label, bar, text }) => (
        <div key={key} className="flex items-center gap-2.5">
          <span className={`text-xs font-mono font-bold w-4 shrink-0 ${text}`}>{label}</span>
          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${bar}`}
              style={{ width: `${values[key]}%` }}
            />
          </div>
          <span className={`text-xs font-semibold tabular-nums w-7 text-right ${text}`}>
            {values[key]}%
          </span>
        </div>
      ))}
    </div>
  );
}
