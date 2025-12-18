'use client';

import { useEffect, useRef, useState } from 'react';
import { embedDashboard } from '@superset-ui/embedded-sdk';
import { getCachedGuestToken } from '@/lib/superset-token-cache';

export default function OptimizedSupersetDashboard({ dashboardId }: { dashboardId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    embedDashboard({
      id: dashboardId,
      supersetDomain: process.env.NEXT_PUBLIC_SUPERSET_URL!,
      mountPoint: containerRef.current,
      fetchGuestToken: () => getCachedGuestToken(dashboardId),
      dashboardUiConfig: {
        hideTitle: false,
      },
    });
  }, [dashboardId]);

  return <div ref={containerRef} className="w-full h-[800px]" />;
}