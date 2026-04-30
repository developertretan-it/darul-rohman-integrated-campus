import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, GraduationCap, Calendar, ClipboardCheck, Award,
  Wallet, UserCog, FileText, Building2, BookOpen, Newspaper, Image as ImageIcon, FilePen, ScrollText,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuItem, useSidebar, SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";
import logo from "@/assets/logo-yayasan.png";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABEL, Role } from "@/data/authMock";

interface NavItem { title: string; url: string; icon: any; roles: Role[]; }

const ALL: Role[] = ["super_admin", "admin_mi", "admin_smp", "admin_smk", "guru", "siswa", "wali"];
const STAFF: Role[] = ["super_admin", "admin_mi", "admin_smp", "admin_smk", "guru"];
const ADMIN: Role[] = ["super_admin", "admin_mi", "admin_smp", "admin_smk"];

const mainItems: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, roles: ALL },
  { title: "Dashboard Yayasan", url: "/yayasan", icon: Building2, roles: ["super_admin"] },
];

const akademikItems: NavItem[] = [
  { title: "Siswa", url: "/siswa", icon: GraduationCap, roles: STAFF },
  { title: "Jadwal", url: "/jadwal", icon: Calendar, roles: ALL },
  { title: "Absensi", url: "/absensi", icon: ClipboardCheck, roles: ALL },
  { title: "Nilai", url: "/nilai", icon: Award, roles: ALL },
  { title: "Raport", url: "/raport", icon: ScrollText, roles: ALL },
  { title: "Mata Pelajaran", url: "/mapel", icon: BookOpen, roles: STAFF },
];

const lainItems: NavItem[] = [
  { title: "Keuangan", url: "/keuangan", icon: Wallet, roles: [...ADMIN, "siswa", "wali"] },
  { title: "SDM / Guru", url: "/guru", icon: UserCog, roles: ADMIN },
  { title: "PPDB", url: "/ppdb", icon: FileText, roles: ALL },
];

const cmsItems: NavItem[] = [
  { title: "Pengumuman & Berita", url: "/cms/posts", icon: Newspaper, roles: ["super_admin"] },
  { title: "Banner Homepage", url: "/cms/banners", icon: ImageIcon, roles: ["super_admin"] },
  { title: "Halaman Konten", url: "/cms/pages", icon: FilePen, roles: ["super_admin"] },
];

export function AppSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const { user } = useAuth();
  // Only collapse to icon-mode on desktop. On mobile the Sheet is always full width.
  const collapsed = !isMobile && state === "collapsed";
  const role = user?.role;

  const visible = (items: NavItem[]) => items.filter((i) => role && i.roles.includes(role));

  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  const renderItem = (item: NavItem) => (
    <SidebarMenuItem key={item.title}>
      <NavLink
        to={item.url}
        end={item.url === "/"}
        title={item.title}
        onClick={handleNavClick}
        className={({ isActive }) =>
          `flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-smooth ${
            isActive
              ? "bg-secondary text-secondary-foreground shadow-gold"
              : "text-white hover:bg-sidebar-accent"
          }`
        }
      >
        <item.icon className="h-5 w-5 shrink-0" />
        {!collapsed && <span className="truncate">{item.title}</span>}
      </NavLink>
    </SidebarMenuItem>
  );

  const main = visible(mainItems);
  const akademik = visible(akademikItems);
  const lain = visible(lainItems);
  const cms = visible(cmsItems);

  return (
    <Sidebar collapsible="icon" className="border-r-0 z-50">
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white p-1">
            <img src={logo} alt="Logo Yayasan" className="h-full w-full object-contain" />
          </div>
          {!collapsed && (
            <div className="min-w-0 animate-fade-in">
              <p className="truncate text-sm font-bold text-white">Darul Rohman</p>
              <p className="truncate text-xs font-medium text-white/85">
                {role ? ROLE_LABEL[role] : "Morombuh Kwanyar"}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar px-2 py-3">
        {main.length > 0 && (
          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="px-3 text-[11px] font-bold uppercase tracking-wider text-secondary">
                Utama
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>{main.map(renderItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {akademik.length > 0 && (
          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="px-3 text-[11px] font-bold uppercase tracking-wider text-secondary">
                Akademik
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>{akademik.map(renderItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {lain.length > 0 && (
          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="px-3 text-[11px] font-bold uppercase tracking-wider text-secondary">
                Manajemen
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>{lain.map(renderItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {cms.length > 0 && (
          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="px-3 text-[11px] font-bold uppercase tracking-wider text-secondary">
                CMS Yayasan
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>{cms.map(renderItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
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
