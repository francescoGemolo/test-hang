import type { ButtonHTMLAttributes } from 'react';
import { buttonVariants, type ButtonVariant } from './buttonVariants';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonVariants(variant, className)} {...props} />;
}