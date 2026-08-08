'use client';

import React, { type HTMLAttributes, useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { buttonVariants } from './button';

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  id?: string;
  className?: string;
  variant?: 'rainbow' | 'normal';
  changeLayout?: boolean;
  message?: string;
  height?: string;
  children?: React.ReactNode;
}

export function Banner({
  id,
  variant = 'normal',
  changeLayout = true,
  message,
  height = '3rem',
  children,
  className,
  ...props
}: BannerProps): React.ReactElement {
  const [open, setOpen] = useState(true);
  const globalKey = id ? `banner-${id}` : undefined;

  useEffect(() => {
    if (globalKey) setOpen(localStorage.getItem(globalKey) !== 'true');
  }, [globalKey]);

  const onClick = useCallback(() => {
    setOpen(false);
    if (globalKey) localStorage.setItem(globalKey, 'true');
  }, [globalKey]);

  return (
    <div
      id={id}
      {...props}
      style={{ height: open ? height : '0' }}
      className={cn(
        'sticky top-0 z-40 flex flex-row items-center justify-center bg-[#07091C]/90 border-b border-[#536BFF]/30 px-4 text-center text-xs sm:text-sm font-medium transition-all duration-300 text-white backdrop-blur-md',
        variant === 'rainbow' && 'bg-background',
        !open && 'hidden',
        className,
      )}
    >
      {changeLayout && open ? (
        <style>{`
        :root:not(.${globalKey ?? 'banner-never'}) { --banner-height: ${height}; }
        `}</style>
      ) : null}
      {globalKey ? (
        <style>{`.${globalKey} #${id} { display: none; }`}</style>
      ) : null}

      {variant === 'rainbow' ? <RainbowLayer /> : null}
      {message || children}
      {id ? (
        <button
          type="button"
          aria-label="Close Banner"
          onClick={onClick}
          className={cn(
            buttonVariants({
              variant: 'ghost',
              className: 'absolute end-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white',
              size: 'icon',
            }),
          )}
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

const RainbowLayer = () => {
  return (
    <>
      <div className="absolute inset-0 z-[-1] rainbow-banner-gradient-1" />
      <div className="absolute inset-0 z-[-1] rainbow-banner-gradient-2" />
    </>
  );
};
