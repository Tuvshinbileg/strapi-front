'use client';

import { usePageLoading } from '@/contexts/PageLoadingContext';

export function PageLoader() {
  const { isLoading } = usePageLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner Animation */}
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 border-4 border-muted rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
