import type { InputHTMLAttributes } from 'react';
import type { IconSvgElement } from '@hugeicons/react';
import { Icon } from './Icon';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: IconSvgElement;
  optional?: boolean;
  error?: string;
  containerClassName?: string;
}

export function Input({
  label,
  icon,
  optional,
  error,
  containerClassName,
  className,
  id,
  type,
  ...props
}: InputProps) {
  const isDateOrTime = type === 'date' || type === 'time';

  return (
    <div className={['flex w-full flex-col gap-2', containerClassName].filter(Boolean).join(' ')}>
      <div className="flex items-center gap-1.5">
        <span className="flex items-center justify-center text-lg text-neutral-400">
          <Icon icon={icon} size={18} />
        </span>
        <label htmlFor={id} className="text-sm text-neutral-400">
          {label}
          {optional && <span className="ml-0.5 text-xs text-neutral-500">(opzionale)</span>}
        </label>
      </div>
      <input
        id={id}
        type={type}
        className={[
          'w-full appearance-none rounded-xl border bg-surface px-3.5 py-3.5 text-base text-neutral-50 outline-none transition placeholder:text-neutral-500',
          isDateOrTime ? 'flex min-h-12 items-center' : '',
          error
            ? 'border-danger hover:border-danger-hover focus:border-danger-hover'
            : 'border-white/20 hover:border-accent focus:border-accent',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && <span className="text-sm text-danger">{error}</span>}
    </div>
  );
}