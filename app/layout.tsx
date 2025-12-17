import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import Appheader from './layout/Header';

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
        <Toaster position="top-right" />
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Appheader />
            <div className='flex flex-1 flex-col gap-4 p-4 bg-muted/50'>
              <div className=' min-h-[100vh] flex-1 rounded-xl md:min-h-min container mx-auto p-6'>
                {children}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
