import { Link, type LinkProps } from 'react-router-dom';
import { buttonVariants, type ButtonVariant } from './buttonVariants';

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant;
}

export function LinkButton({ variant = 'primary', className, ...props }: LinkButtonProps) {
  return <Link className={buttonVariants(variant, className)} {...props} />;
}