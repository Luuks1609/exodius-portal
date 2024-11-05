"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { usePathname } from "next/navigation";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
    },
    {
      title: "Clients",
      url: "/dashboard/clients",
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
    },
    {
      title: "Payments",
      url: "/dashboard/payments",
    },
    {
      title: "Logs",
      url: "/dashboard/logs",
    },
    {
      title: "Settings",
      url: "/dashboard/",
    },
  ];

  return (
    <Sidebar>
      <SidebarContent className="px-2">
        <SidebarGroup className="border-b">
          <SidebarGroupContent>
            <SidebarGroupLabel className="text-lg font-light tracking-wider text-white">
              Exodius
            </SidebarGroupLabel>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <span
                        className={`font-light tracking-wider hover:text-white ${pathname === item.url ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
