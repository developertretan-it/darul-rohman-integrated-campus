import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, GraduationCap, Calendar, ClipboardCheck, Award,
  Wallet, UserCog, FileText, Building2, BookOpen,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";
import logo from "@/assets/logo-yayasan.png";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Dashboard Yayasan", url: "/yayasan", icon: Building2 },
];

const akademikItems = [
  { title: "Siswa", url: "/siswa", icon: GraduationCap },
  { title: "Jadwal", url: "/jadwal", icon: Calendar },
  { title: "Absensi", url: "/absensi", icon: ClipboardCheck },
  { title: "Nilai", url: "/nilai", icon: Award },
  { title: "Mata Pelajaran", url: "/mapel", icon: BookOpen },
];

const lainItems = [
  { title: "Keuangan", url: "/keuangan", icon: Wallet },
  { title: "SDM / Guru", url: "/guru", icon: UserCog },
  { title: "PPDB", url: "/ppdb", icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const renderItem = (item: { title: string; url: string; icon: any }) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        className="h-10 hover:bg-transparent hover:text-white data-[active=true]:bg-transparent"
      >
        <NavLink
          to={item.url}
          end={item.url === "/"}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 font-semibold transition-smooth ${
              isActive
                ? "!bg-secondary !text-secondary-foreground shadow-gold"
                : "!text-white hover:!bg-sidebar-accent hover:!text-white"
            }`
          }
        >
          <item.icon className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="truncate">{item.title}</span>}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon" className="border-r-0 z-50">
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white p-1">
            <img src={logo} alt="Logo Yayasan Darul Rohman" className="h-full w-full object-contain" />
          </div>
          {!collapsed && (
            <div className="min-w-0 animate-fade-in">
              <p className="truncate text-sm font-bold text-white">Darul Rohman</p>
              <p className="truncate text-xs font-medium text-white/85">Morombuh Kwanyar</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar px-2 py-3">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="px-3 text-[11px] font-bold uppercase tracking-wider text-secondary">
              Utama
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>{mainItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="px-3 text-[11px] font-bold uppercase tracking-wider text-secondary">
              Akademik
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>{akademikItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="px-3 text-[11px] font-bold uppercase tracking-wider text-secondary">
              Manajemen
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>{lainItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="border-t border-sidebar-border bg-sidebar p-4">
          <div className="rounded-lg bg-sidebar-accent p-3 text-center">
            <p className="text-sm font-bold text-secondary">YDR v1.0</p>
            <p className="mt-1 text-xs font-medium text-white">Sistem Terpadu Pendidikan</p>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
