import { Tick02Icon } from '@hugeicons/core-free-icons';
import { Icon } from './Icon';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-1.5 py-1 text-sm text-neutral-400">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span
        className={[
          'grid h-5 w-5 flex-shrink-0 place-items-center rounded-md border transition',
          checked ? 'border-accent bg-accent' : 'border-white/20',
        ].join(' ')}
      >
        <Icon
          icon={Tick02Icon}
          size={14}
          strokeWidth={2.5}
          className={[
            'text-bg transition',
            checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
          ].join(' ')}
        />
      </span>
      {label}
    </label>
  );
}