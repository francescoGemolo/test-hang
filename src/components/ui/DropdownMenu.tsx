import { useRef, useState } from 'react';
import type { IconSvgElement } from '@hugeicons/react';
import { MoreVerticalIcon } from '@hugeicons/core-free-icons';
import { useClickOutside } from '../../hooks/useClickOutside';
import { Icon } from './Icon';

export interface DropdownMenuItem {
  label: string;
  icon: IconSvgElement;
  onClick: () => void;
  danger?: boolean;
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  className?: string;
}

export function DropdownMenu({ items, className }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useClickOutside(wrapperRef, () => setIsOpen(false));

  return (
    <div ref={wrapperRef} className={['absolute right-3 top-3 z-10', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        aria-label="Opzioni"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
        className={[
          'flex h-[30px] w-[30px] items-center justify-center rounded-full border text-lg transition',
          isOpen
            ? 'border-white/30 text-neutral-50'
            : 'border-transparent text-neutral-400 hover:border-white/20 hover:bg-white/5 hover:text-neutral-50',
        ].join(' ')}
      >
        <Icon icon={MoreVerticalIcon} size={18} />
      </button>

      <div
        role="menu"
        className={[
          'absolute right-0 top-[calc(100%+14px)] flex min-w-40 origin-top-right flex-col gap-0.5 rounded-xl border border-white/20 bg-neutral-800/80 p-1.5 backdrop-blur-sm transition',
          isOpen ? 'visible scale-100 opacity-100' : 'invisible pointer-events-none scale-95 opacity-0',
        ].join(' ')}
      >
        {items.map((item, index) => (
          <div key={item.label}>
            {index > 0 && item.danger && <div className="my-1 h-px bg-white/10" />}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                item.onClick();
              }}
              className={[
                'flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-base transition',
                item.danger
                  ? 'text-danger hover:bg-danger/10 hover:text-danger-hover'
                  : 'text-neutral-400 hover:bg-white/10 hover:text-neutral-50',
              ].join(' ')}
            >
              <Icon icon={item.icon} size={18} />
              {item.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}