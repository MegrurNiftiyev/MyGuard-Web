import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
}) => {
  const variantClasses = {
    text: 'h-4 w-full rounded-md',
    circular: 'rounded-full shrink-0',
    rectangular: 'rounded-xl',
    card: 'rounded-2xl',
  };

  const style: React.CSSProperties = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
  };

  return (
    <div
      style={style}
      className={`animate-pulse bg-gradient-to-r from-surface-container-low via-surface-container-high to-surface-container-low bg-[length:200%_100%] animate-[shimmer_1.8s_infinite] ${variantClasses[variant]} ${className}`}
    />
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="divide-y divide-outline-variant/60 w-full">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="grid grid-cols-12 gap-4 px-6 py-4 items-center animate-pulse">
          <div className="col-span-5 flex items-center gap-3.5">
            <Skeleton variant="rectangular" className="w-10 h-10 rounded-xl shrink-0" />
            <div className="space-y-2 w-full max-w-[200px]">
              <Skeleton variant="text" className="h-4 w-3/4" />
              <Skeleton variant="text" className="h-3 w-1/2" />
            </div>
          </div>

          <div className="col-span-2 space-y-1.5">
            <Skeleton variant="text" className="h-3.5 w-24" />
            <Skeleton variant="text" className="h-3 w-16" />
          </div>

          <div className="col-span-2 space-y-1.5">
            <Skeleton variant="text" className="h-3.5 w-16" />
            <Skeleton variant="text" className="h-3 w-12" />
          </div>

          <div className="col-span-1 flex justify-center">
            <Skeleton variant="rectangular" className="h-5 w-12 rounded-md" />
          </div>

          <div className="col-span-2 flex justify-end">
            <Skeleton variant="rectangular" className="h-7 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-3xl border border-outline-variant/60 bg-surface-container-lowest shadow-sm space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton variant="text" className="h-4 w-28" />
        <Skeleton variant="circular" className="w-8 h-8" />
      </div>
      <Skeleton variant="text" className="h-8 w-20" />
      <Skeleton variant="rectangular" className="h-2 w-full rounded-full" />
    </div>
  );
};

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-5 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest shadow-xs flex items-center justify-between gap-4 animate-pulse"
        >
          <div className="flex items-center gap-4 flex-1">
            <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
            <div className="space-y-2 flex-1 max-w-sm">
              <Skeleton variant="text" className="h-4 w-2/3" />
              <Skeleton variant="text" className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton variant="rectangular" className="h-8 w-24 rounded-xl" />
        </div>
      ))}
    </div>
  );
};
