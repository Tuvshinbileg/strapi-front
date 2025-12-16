/**
 * components/Sidebar.tsx - Навигацийн sidebar
 * 
 * 📝 Үүрэг:
 * - Strapi-аас ирсэн pages-ыг menu болгон харуулах
 * - Хуудас бүр дээр дарах үед /[slug] руу redirect хийх
 * - Одоо байгаа хуудсыг highlight хийх
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PageResponse } from '@/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  pages: PageResponse[];
}

export default function Sidebar({ pages }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-sidebar border-r min-h-screen sticky top-0">
      {/* Logo/Header */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Strapi Dynamic Zone
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {/* Нүүр хуудас */}
        <Link
          href="/"
          className={cn(
            'block px-4 py-2 rounded-lg transition-colors',
            pathname === '/' || pathname === ''
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'hover:bg-muted text-foreground'
          )}
        >
          🏠 Нүүр Хуудас
        </Link>

        {/* Pages Menu */}
        {pages.length > 0 && (
          <div className="mt-6">
            <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
              Хуудаснууд
            </p>
            <div className="space-y-1">
              {pages.map((page) => {
                const isActive = pathname === `/${page.slug}`;
                return (
                  <Link
                    key={page.id}
                    href={`/${page.slug}`}
                    className={cn(
                      'block px-4 py-2 rounded-lg transition-colors text-sm',
                      isActive
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'hover:bg-muted text-foreground'
                    )}
                  >
                    📄 {page.title}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-muted/20">
        <p className="text-xs text-muted-foreground">
          Нийт хуудас: <span className="font-bold">{pages.length}</span>
        </p>
      </div>
    </div>
  );
}
