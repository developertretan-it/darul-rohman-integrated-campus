import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUnit } from "@/context/UnitContext";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABEL } from "@/lib/units";
import { Sparkles } from "lucide-react";
import logo from "@/assets/logo-yayasan.png";

export default function Dashboard() {
  const { info } = useUnit();
  const { profile, role } = useAuth();

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl gradient-hero p-6 shadow-md-soft md:p-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white p-1 shadow-md-soft md:h-20 md:w-20">
              <img src={logo} alt="Logo Yayasan" className="h-full w-full object-contain" />
            </div>
            <div className="text-white">
              <Badge className="mb-2 border-0 bg-secondary text-secondary-foreground hover:bg-secondary">
                <Sparkles className="mr-1 h-3 w-3" />
                Unit {info.short} • {role ? ROLE_LABEL[role] : info.level}
              </Badge>
              <h1 className="font-display text-2xl font-bold leading-tight md:text-3xl">
                Assalamu'alaikum, {profile?.nama ?? "Admin"} 👋
              </h1>
              <p className="mt-1 text-sm text-white/90 md:text-base">
                Dashboard {info.name} — Yayasan Darul Rohman Morombuh Kwanyar
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card className="rounded-2xl border-dashed border-border bg-muted/30">
        <CardHeader>
          <CardTitle className="font-display">Data real-time akan tampil di sini</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Statistik siswa, guru, kelas, absensi, dan pengumuman akan disambungkan ke Supabase
            pada tahap berikutnya. Tidak ada data dummy yang ditampilkan.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
