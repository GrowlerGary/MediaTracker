import React, { FunctionComponent, ReactNode } from 'react';
import clsx from 'clsx';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'subtle';
  onClick?: () => void;
}

export const GlassCard: FunctionComponent<GlassCardProps> = ({
  children,
  className,
  hover = false,
  interactive = false,
  padding = 'md',
  variant = 'default',
  onClick,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const variantClasses = {
    default: 'glass',
    elevated: 'glass-strong shadow-glass',
    subtle: 'bg-white/60 dark:bg-surface-900/60 backdrop-blur-sm',
  };

  return (
    <div
      className={clsx(
        'rounded-xl border border-white/20 dark:border-white/10 transition-all duration-200',
        variantClasses[variant],
        paddingClasses[padding],
        hover && 'hover:shadow-soft-lg hover:-translate-y-0.5',
        interactive && 'cursor-pointer hover:shadow-soft-lg',
        onClick && 'cursor-pointer active:scale-[0.98]',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Badge component for media metadata
interface MediaBadgeProps {
  icon?: string;
  text: ReactNode;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
}

export const MediaBadge: FunctionComponent<MediaBadgeProps> = ({
  icon,
  text,
  variant = 'default',
  size = 'sm',
  className,
}) => {
  const variantClasses = {
    default: 'bg-surface-100/80 dark:bg-surface-800/80 text-surface-700 dark:text-surface-300',
    primary: 'bg-primary-500/90 text-white',
    accent: 'bg-accent-500/90 text-white',
    success: 'bg-success-500/90 text-white',
    warning: 'bg-warning-500/90 text-white',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full font-medium backdrop-blur-sm',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {icon && <span className="material-icons text-[1em]">{icon}</span>}
      {text}
    </span>
  );
};

// Progress bar component
interface ProgressBarProps {
  progress: number; // 0 to 1
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'accent' | 'success';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: FunctionComponent<ProgressBarProps> = ({
  progress,
  size = 'sm',
  variant = 'default',
  showLabel = false,
  className,
}) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const percentage = Math.round(clampedProgress * 100);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantClasses = {
    default: 'bg-surface-300 dark:bg-surface-600',
    primary: 'bg-primary-500',
    accent: 'bg-accent-500',
    success: 'bg-success-500',
  };

  return (
    <div className={clsx('w-full', className)} title={`${percentage}%`}>
      <div
        className={clsx(
          'w-full rounded-full overflow-hidden bg-surface-200 dark:bg-surface-700',
          sizeClasses[size]
        )}
      >
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500 ease-out',
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-surface-500 dark:text-surface-400 mt-1">
          {percentage}%
        </span>
      )}
    </div>
  );
};

// Tooltip component
interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: FunctionComponent<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 200,
}) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-surface-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-surface-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-surface-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-surface-800',
  };

  return (
    <div className="relative group">
      {children}
      <div
        className={clsx(
          'absolute z-50 px-2.5 py-1.5 text-sm text-white bg-surface-800 rounded-lg shadow-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150',
          'pointer-events-none',
          positionClasses[position]
        )}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {content}
        <span
          className={clsx(
            'absolute w-0 h-0 border-4 border-transparent',
            arrowClasses[position]
          )}
        />
      </div>
    </div>
  );
};

export default GlassCard;
