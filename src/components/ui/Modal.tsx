import type { ReactNode } from 'react';
import type { IconSvgElement } from '@hugeicons/react';
import { Icon } from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon: IconSvgElement;
  title: string;
  description: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, icon, title, description, children }: ModalProps) {
  return (
    <div
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={[
        'fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm transition-opacity',
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
      ].join(' ')}
    >
      <div
        className={[
          'flex w-full max-w-sm flex-col items-center gap-3 rounded-3xl border border-white/20 bg-surface p-5 text-center transition-transform',
          isOpen ? 'translate-y-0' : 'translate-y-2.5',
        ].join(' ')}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-danger/25 bg-danger/10 text-danger">
          <Icon icon={icon} size={24} />
        </div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm leading-relaxed text-neutral-400">{description}</p>
        <div className="mt-1 flex w-full flex-col gap-2">{children}</div>
      </div>
    </div>
  );
}