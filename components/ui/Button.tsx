import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'whatsapp' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  target?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  href,
  target,
  leftIcon,
  rightIcon,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-accent text-primary hover:bg-opacity-90',
    secondary: 'bg-primary text-white hover:bg-opacity-90',
    whatsapp: 'bg-[#25D366] text-white hover:bg-opacity-90',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-primary hover:bg-black/5',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg font-semibold',
  };

  const classes = clsx(baseStyles, variants[variant], sizes[size], className);

  const innerContent = (
    <>
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </>
  );

  if (href) {
    const isExternal = target === '_blank' || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
    return (
      <Link 
        href={href} 
        className={classes}
        target={target || (isExternal ? '_blank' : undefined)}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {innerContent}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {innerContent}
    </button>
  );
}
