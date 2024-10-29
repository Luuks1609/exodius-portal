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

export default function DashboardSidebar() {
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
      title: "Settings",
      url: "/dashboard/",
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel className="text-lg font-semibold tracking-wider text-green-700">
              Exodius
            </SidebarGroupLabel>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="p-5">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <span className="text-base font-semibold tracking-wider">
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
