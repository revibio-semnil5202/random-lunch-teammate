"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, Utensils, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  { title: "대시보드", href: "/", icon: LayoutDashboard },
  { title: "회사 근처 식당", href: "/restaurants", icon: UtensilsCrossed },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname.startsWith("/groups");
    }
    return pathname.startsWith(href);
  };

  return (
    <Sidebar>
      {/* 로고 영역 */}
      <SidebarHeader className="px-4 py-4">
        <Link
          href="/"
          onClick={() => setOpenMobile(false)}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Utensils className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight">랜덤 점심</span>
            <span className="text-[11px] text-muted-foreground leading-tight">팀메이트</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      {/* 내비게이션 */}
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={isActive(item.href)}
                    onClick={() => setOpenMobile(false)}
                    className="h-10 text-[15px] rounded-lg"
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 푸터 */}
      <SidebarFooter className="px-2 pb-4">
        <SidebarSeparator className="mb-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-9 text-sm text-muted-foreground rounded-lg">
              <Settings className="h-4 w-4" />
              <span>설정</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
