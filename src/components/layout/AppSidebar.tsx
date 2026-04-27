import { NavLink, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const renderItem = (item: { title: string; url: string; icon: any }) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild tooltip={item.title}>
        <NavLink
          to={item.url}
          end={item.url === "/"}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg transition-smooth ${
              isActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-gold"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-secondary/30 blur-md" />
            <img src={logo} alt="Logo Yayasan Darul Rohman" className="relative h-10 w-10 object-contain" />
          </div>
          {!collapsed && (
            <div className="min-w-0 animate-fade-in">
              <p className="truncate text-sm font-bold text-sidebar-foreground">Darul Rohman</p>
              <p className="truncate text-xs text-sidebar-foreground/70">Morombuh Kwanyar</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/60">Utama</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{mainItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/60">Akademik</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{akademikItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/60">Manajemen</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{lainItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="border-t border-sidebar-border p-4">
          <div className="rounded-xl bg-sidebar-accent p-3 text-center text-xs text-sidebar-foreground/80">
            <p className="font-semibold text-secondary">YDR v1.0</p>
            <p className="mt-1 opacity-70">Sistem Terpadu Pendidikan</p>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
