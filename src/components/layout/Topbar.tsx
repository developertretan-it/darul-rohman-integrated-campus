import { Bell, Moon, Search, Sun, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/context/ThemeContext";
import { UnitSwitcher } from "./UnitSwitcher";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md md:px-6">
      <SidebarTrigger className="text-foreground" />

      <div className="hidden flex-1 md:block">
        <UnitSwitcher />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari siswa, guru..."
              className="h-10 w-64 rounded-xl border-border/60 bg-muted/40 pl-10"
            />
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme" className="rounded-xl">
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-xl">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full bg-secondary px-1 text-[10px] text-secondary-foreground">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex-col items-start gap-1 py-3">
              <span className="font-semibold">PPDB baru</span>
              <span className="text-xs text-muted-foreground">2 pendaftar baru hari ini</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-col items-start gap-1 py-3">
              <span className="font-semibold">Tagihan SPP</span>
              <span className="text-xs text-muted-foreground">5 siswa belum membayar bulan ini</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-col items-start gap-1 py-3">
              <span className="font-semibold">Pengumuman baru</span>
              <span className="text-xs text-muted-foreground">UTS akan dimulai minggu depan</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 rounded-xl px-2 sm:px-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold leading-none">K.H. Admin</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Pengaturan</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Keluar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
