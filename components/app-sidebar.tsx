import * as React from "react"

import { VersionSwitcher } from "@/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: "layout-dashboard",
      items: [
        {
          title: "Project Structure",
          url: "#",
        },
        {
          title: "Daily dashboard",
          url: "dashboard",
        },
      ],
    },
    {
      title: "Building Your Application",
      url: "#",
      icon: "file-text",
      items: [
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
        },
      ],
    }
  ],
}

import { nocoDbApiService } from '@/lib/noco_api';
import { MenuButton } from '@/components/MenuButton';

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const ncMenu = await nocoDbApiService.getMenus();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <MenuButton 
                      href={subItem.url} 
                      title={subItem.title}
                      icon={item.icon}
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
          <SidebarGroup>
            <SidebarGroupLabel>NOCODB</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
               {ncMenu.map((menu) => (
                  <SidebarMenuItem key={menu.Id}>
                    <MenuButton 
                      href={menu.slug} 
                      title={menu.title}
                      icon="database"
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
