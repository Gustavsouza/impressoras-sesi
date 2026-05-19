import type { PrinterStatusType } from '../../types/printer';

interface Props {
  status: PrinterStatusType;
}

export default function StatusBadge({ status }: Props) {
  const isOnline = status !== 'offline';

  if (isOnline) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-brand-5 text-brand-1 border border-brand-4 dark:bg-night-1 dark:text-night-5 dark:border-night-3">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-1 dark:bg-night-4" />
        Online
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200 dark:bg-night-1 dark:text-night-4/60 dark:border-night-3/50">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-night-3" />
      Offline
    </span>
  );
}
