import React, { FunctionComponent } from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'shimmer' | 'none';
}

export const Skeleton: FunctionComponent<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-surface-200 dark:bg-surface-700';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    shimmer: 'relative overflow-hidden',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={clsx(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    >
      {animation === 'shimmer' && (
        <div className="absolute inset-0 skeleton-shimmer" />
      )}
    </div>
  );
};

// Grid item skeleton
export const GridItemSkeleton: FunctionComponent = () => {
  return (
    <div className="w-40 pb-4 animate-fade-in">
      <Skeleton variant="rounded" width={160} height={240} />
      <div className="mt-3 space-y-2">
        <Skeleton variant="text" width="60%" height={16} />
        <Skeleton variant="text" width="90%" height={20} />
        <Skeleton variant="text" width="40%" height={14} />
      </div>
    </div>
  );
};

// Multiple grid item skeletons
export const GridItemsSkeleton: FunctionComponent<{ count?: number }> = ({
  count = 5,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="mr-5">
          <GridItemSkeleton />
        </div>
      ))}
    </>
  );
};

// Card skeleton
export const CardSkeleton: FunctionComponent = () => {
  return (
    <div className="card p-4 animate-fade-in">
      <div className="flex gap-4">
        <Skeleton variant="rounded" width={120} height={180} />
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" width="70%" height={24} />
          <Skeleton variant="text" width="40%" height={16} />
          <Skeleton variant="text" width="90%" height={14} />
          <Skeleton variant="text" width="80%" height={14} />
          <div className="pt-4 flex gap-2">
            <Skeleton variant="rounded" width={80} height={32} />
            <Skeleton variant="rounded" width={80} height={32} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Detail page skeleton
export const DetailPageSkeleton: FunctionComponent = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col mt-2 mb-4 md:flex-row">
        <div className="self-center w-64 shrink-0 md:self-start">
          <Skeleton variant="rounded" width={256} height={384} />
        </div>
        <div className="flex-1 mt-4 space-y-3 md:mt-0 md:ml-6">
          <Skeleton variant="text" width="80%" height={40} />
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="text" width="50%" height={16} />
          <Skeleton variant="text" width="90%" height={16} />
          <Skeleton variant="text" width="85%" height={16} />
          <Skeleton variant="text" width="60%" height={16} />
          <div className="pt-4 flex gap-3">
            <Skeleton variant="rounded" width={120} height={40} />
            <Skeleton variant="rounded" width={120} height={40} />
            <Skeleton variant="rounded" width={120} height={40} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
