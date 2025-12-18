'use client';

import { useEffect, useRef, useState } from 'react';
import { embedDashboard } from '@superset-ui/embedded-sdk';

interface SupersetDashboardProps {
  dashboardId: string;
  height?: string;
  hideTitle?: boolean;
  hideChartControls?: boolean;
  hideTab?: boolean;
}

export default function SupersetDashboard({
  dashboardId,
  height = '800px',
  hideTitle = false,
  hideChartControls = false,
  hideTab = false,
}: SupersetDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchGuestToken = async () => {
      try {
        const response = await fetch('/api/superset/guest-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dashboardId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch guest token');
        }

        const data = await response.json();
        return data.token;
      } catch (err) {
        console.error('Error fetching guest token:', err);
        throw err;
      }
    };

    const embedSupersetDashboard = async () => {
      if (!containerRef.current || !isMounted) return;

      try {
        setLoading(true);
        setError(null);

        await embedDashboard({
          id: dashboardId,
          supersetDomain: process.env.NEXT_PUBLIC_SUPERSET_URL!,
          mountPoint: containerRef.current,
          fetchGuestToken,
          dashboardUiConfig: {
            hideTitle,
            hideChartControls,
            hideTab,
            filters: {
              expanded: true,
            },
          },
        });

        if (isMounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error embedding dashboard:', err);
        if (isMounted) {
          setError('Dashboard ачаалахад алдаа гарлаа');
          setLoading(false);
        }
      }
    };

    embedSupersetDashboard();

    return () => {
      isMounted = false;
    };
  }, [dashboardId, hideTitle, hideChartControls, hideTab]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 border border-red-200 rounded-lg p-8">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Алдаа гарлаа</p>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Dashboard ачааллаж байна...</p>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
