'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface PageLoadingContextType {
  isLoading: boolean;
}

const PageLoadingContext = createContext<PageLoadingContextType>({
  isLoading: false,
});

export function PageLoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Start loading when route changes
    setIsLoading(true);
    
    // Stop loading after a short delay (Next.js handles the actual page render)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <PageLoadingContext.Provider value={{ isLoading }}>
      {children}
    </PageLoadingContext.Provider>
  );
}

export function usePageLoading() {
  return useContext(PageLoadingContext);
}
