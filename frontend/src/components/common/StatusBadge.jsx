import { cn } from '@/utils/cn';
import { TONES, TONE_DOT, getTone } from '@/config/statusConfig';

export default function StatusBadge({ status, tone, size = 'md', className }) {
  const t = tone || getTone(status);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium ring-1 ring-inset',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        TONES[t], className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', TONE_DOT[t])} />
      {status}
    </span>
  );
}


