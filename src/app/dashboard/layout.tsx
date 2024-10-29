import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { getServerAuthSession } from "~/server/auth";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "./_components/DashboardSidebar";

interface Props {
  children: ReactNode;
}

const DashboardLayout = async ({ children }: Props) => {
  const session = await getServerAuthSession();

  if (!session) redirect("/");

  return (
    <SidebarProvider>
      <DashboardSidebar />

      <main className="flex-1">
        <SidebarTrigger className="md:hidden" />
        <div className="p-10">{children}</div>
      </main>
      <footer className="">{/* footer? */}</footer>
    </SidebarProvider>
  );
};

export default DashboardLayout;
