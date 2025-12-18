import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import Appheader from './layout/Header';
import { PageLoadingProvider } from '@/contexts/PageLoadingContext';
import { PageLoader } from '@/components/PageLoader';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Strapi CMS - Dynamic Zone Frontend',
  description: 'Config-Driven UI бүхий Next.js App Router frontend',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='mn'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <PageLoadingProvider>
          <PageLoader />
          <Toaster position="top-right" />
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <Appheader />
              <div className='flex flex-1 flex-col gap-4 p-4 bg-muted/50'>
                <div className='min-h-[100vh] flex-1 rounded-xl md:min-h-min w-full mx-auto p-6'>
                  <div className='flex w-full flex-col items-start gap-x-4 gap-y-3 xl:grid xl:grid-cols-[minmax(0,_1fr)_440px]'>
                    {children}
                  </div>
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </PageLoadingProvider>
      </body>
    </html>
  );
}
