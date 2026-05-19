interface Props {
  level: number;
  showLabel?: boolean;
}

function barColor(level: number) {
  if (level > 50) return 'bg-brand-2 dark:bg-night-4';
  if (level > 25) return 'bg-amber-500';
  return 'bg-red-500';
}

function textColor(level: number) {
  if (level > 50) return 'text-brand-1 dark:text-night-4';
  if (level > 25) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

export default function TonerBar({ level, showLabel = true }: Props) {
  return (
    <div className="space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-night-4">Toner</span>
          <span className={`text-xs font-semibold tabular-nums ${textColor(level)}`}>{level}%</span>
        </div>
      )}
      <div className="h-1.5 bg-brand-5/50 dark:bg-night-1 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor(level)}`}
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}
