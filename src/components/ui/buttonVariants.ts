export type ButtonVariant = 'primary' | 'outline' | 'secondary' | 'secondaryDanger' | 'danger' | 'cancel';

const base =
  'inline-flex items-center justify-center gap-1.5 font-sans transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<ButtonVariant, string> = {
  primary: `${base} rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-bg hover:bg-accent-hover`,
  outline: `${base} rounded-full border border-accent-hover bg-accent px-5 py-2.5 text-base text-bg hover:-translate-y-0.5 hover:bg-accent-hover`,
  secondary: `${base} rounded-full border border-white/20 px-5 py-2.5 text-sm text-neutral-50 hover:-translate-y-0.5 hover:border-white/30`,
  secondaryDanger: `${base} rounded-full border border-danger px-5 py-2.5 text-sm text-danger hover:-translate-y-0.5 hover:border-danger-hover hover:bg-danger/10 hover:text-danger-hover`,
  danger: `${base} rounded-full bg-danger px-6 py-3.5 text-base font-semibold text-bg hover:bg-red-500`,
  cancel: `${base} px-5 py-2.5 text-sm text-neutral-400 hover:text-neutral-50`,
};

export function buttonVariants(variant: ButtonVariant, className = ''): string {
  return [variants[variant], className].filter(Boolean).join(' ');
}