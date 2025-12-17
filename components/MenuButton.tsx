/**
 * components/MenuButton.tsx - Active menu highlighting component
 *
 * usePathname hook ашиглан current route дээр үндэслэн active state үзүүлнэ
 */

'use client';

import { usePathname } from 'next/navigation';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import Link from 'next/link';
import { LayoutDashboard, FileText, Database, LucideIcon } from 'lucide-react';

interface MenuButtonProps {
  href: string;
  title: string;
  icon?: string;
  isExternalLink?: boolean;
}

const iconMap: { [key: string]: LucideIcon } = {
  'layout-dashboard': LayoutDashboard,
  'file-text': FileText,
  database: Database,
};

export function MenuButton({
  href,
  title,
  icon,
  isExternalLink = false,
}: MenuButtonProps) {
  const pathname = usePathname();

  // Current route нь menu href-тай тэнцүү эсэх шалгана
  const isActive = pathname === href || pathname.startsWith(href + '/');

  const IconComponent = icon ? iconMap[icon] : undefined;

  if (isExternalLink) {
    return (
      <SidebarMenuButton asChild isActive={isActive}>
        <a href={href} target='_blank' rel='noopener noreferrer'>
          {IconComponent && <IconComponent className='w-4 h-4' />}
          <span>{title}</span>
        </a>
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuButton asChild isActive={isActive}>
      <Link href={href != null ? href : '#'}>
        {IconComponent && <IconComponent className='w-4 h-4' />}
        <span>{title}</span>
      </Link>
    </SidebarMenuButton>
  );
}
