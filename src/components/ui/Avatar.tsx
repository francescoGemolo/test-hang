const STACK_COLORS = [
  'bg-accent/20 text-accent',
  'bg-sky-400/20 text-sky-400',
  'bg-status-almost/20 text-status-almost',
  'bg-purple-400/20 text-purple-400',
];

const SIZES = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-9 w-9 text-base',
  lg: 'h-20 w-20 text-3xl',
};

interface AvatarProps {
  label: string;
  size?: keyof typeof SIZES;
  colorClassName?: string;
  className?: string;
}

export function Avatar({ label, size = 'md', colorClassName, className }: AvatarProps) {
  return (
    <div
      className={[
        'flex flex-shrink-0 items-center justify-center rounded-full border border-white/20 font-semibold',
        SIZES[size],
        colorClassName ?? 'bg-surface text-accent',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label.charAt(0).toUpperCase()}
    </div>
  );
}

export function stackColor(index: number): string {
  return STACK_COLORS[index % STACK_COLORS.length];
}