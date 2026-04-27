import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUnit } from "@/context/UnitContext";
import { PENGUMUMAN } from "@/data/mockData";
import { StatCard, PageHeader } from "@/components/shared/StatCard";
import {
  Users, GraduationCap, BookOpen, ClipboardCheck, Calendar, Award,
  Wallet, FileText, Megaphone, ChevronRight, Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-yayasan.png";

const QUICK_MENU = [
  { label: "Jadwal", icon: Calendar, to: "/jadwal", color: "gradient-primary" },
  { label: "Nilai", icon: Award, to: "/nilai", color: "gradient-gold" },
  { label: "Absensi", icon: ClipboardCheck, to: "/absensi", color: "gradient-sky" },
  { label: "Keuangan", icon: Wallet, to: "/keuangan", color: "gradient-primary" },
  { label: "PPDB", icon: FileText, to: "/ppdb", color: "gradient-gold" },
];

export default function Dashboard() {
  const { data, info, unit } = useUnit();
  const persenHadir = Math.round((data.absensi.hadir / (data.absensi.hadir + data.absensi.izin + data.absensi.sakit + data.absensi.alpha)) * 100);
  const pengumuman = PENGUMUMAN.filter((p) => p.unit === "all" || p.unit === unit).slice(0, 3);
  const nilaiTerbaru = data.nilai.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl gradient-hero p-6 shadow-md-soft md:p-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white p-1 shadow-md-soft md:h-20 md:w-20">
              <img src={logo} alt="Logo Yayasan" className="h-full w-full object-contain" />
            </div>
            <div className="text-white">
              <Badge className="mb-2 border-0 bg-secondary text-secondary-foreground hover:bg-secondary">
                <Sparkles className="mr-1 h-3 w-3" />
                Unit {info.short} • {info.level}
              </Badge>
              <h1 className="font-display text-2xl font-bold leading-tight md:text-3xl">Assalamu'alaikum, K.H. Admin 👋</h1>
              <p className="mt-1 text-sm text-white/90 md:text-base">
                Dashboard {info.name} — Yayasan Darul Rohman Morombuh Kwanyar
              </p>
            </div>
          </div>
          <Button size="lg" className="bg-secondary text-secondary-foreground shadow-gold hover:bg-secondary/90">
            <Calendar className="mr-2 h-4 w-4" />
            Jadwal Hari Ini
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Siswa" value={data.ringkasan.totalSiswa} icon={GraduationCap} variant="primary" trend="+12 tahun ini" />
        <StatCard label="Total Guru" value={data.ringkasan.totalGuru} icon={Users} variant="secondary" hint="Aktif mengajar" />
        <StatCard label="Total Kelas" value={data.ringkasan.totalKelas} icon={BookOpen} variant="accent" hint={`${data.mapel.length} mata pelajaran`} />
        <StatCard label="Hadir Hari Ini" value={`${persenHadir}%`} icon={ClipboardCheck} hint={`${data.ringkasan.hadirHariIni} dari ${data.ringkasan.totalSiswa}`} trend="Baik" />
      </div>

      {/* Quick menu */}
      <div>
        <h2 className="mb-3 font-display text-lg font-bold">Menu Utama</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {QUICK_MENU.map((m) => (
            <Link
              key={m.label}
              to={m.to}
              className="group rounded-2xl bg-card p-4 text-center shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-md-soft"
            >
              <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${m.color} text-primary-foreground transition-smooth group-hover:scale-110`}>
                <m.icon className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-semibold">{m.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Jadwal hari ini */}
        <Card className="rounded-2xl border-0 shadow-soft lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display">Jadwal Hari Ini</CardTitle>
              <p className="mt-0.5 text-sm text-muted-foreground">{data.jadwalHariIni[0]?.hari} • {data.jadwalHariIni.length} mata pelajaran</p>
            </div>
            <Link to="/jadwal">
              <Button variant="ghost" size="sm" className="text-primary">
                Semua <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.jadwalHariIni.map((j, i) => (
              <div
                key={j.id}
                className="flex items-center gap-4 rounded-xl border border-border/60 bg-muted/30 p-3 transition-smooth hover:border-primary/40 hover:bg-primary/5"
                style={{ animation: `slideUp 0.3s ease-out ${i * 0.05}s both` }}
              >
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg gradient-primary text-xs font-bold text-primary-foreground">
                  <span>{j.jam.split(" ")[0]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{j.mapel}</p>
                  <p className="truncate text-xs text-muted-foreground">{j.guru} • {j.ruang}</p>
                </div>
                <Badge variant="outline" className="hidden border-accent/40 text-accent sm:inline-flex">
                  {j.jam}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Absensi widget */}
        <Card className="rounded-2xl border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="font-display">Statistik Absensi</CardTitle>
            <p className="text-sm text-muted-foreground">Ringkasan bulan ini</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">Hadir</span>
                <span className="text-success">{data.absensi.hadir}%</span>
              </div>
              <Progress value={data.absensi.hadir} className="h-2 [&>div]:bg-success" />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">Izin</span>
                <span className="text-accent">{data.absensi.izin}%</span>
              </div>
              <Progress value={data.absensi.izin} className="h-2 [&>div]:bg-accent" />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">Sakit</span>
                <span className="text-warning">{data.absensi.sakit}%</span>
              </div>
              <Progress value={data.absensi.sakit} className="h-2 [&>div]:bg-warning" />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">Alpha</span>
                <span className="text-destructive">{data.absensi.alpha}%</span>
              </div>
              <Progress value={data.absensi.alpha} className="h-2 [&>div]:bg-destructive" />
            </div>
          </CardContent>
        </Card>

        {/* Nilai terbaru */}
        <Card className="rounded-2xl border-0 shadow-soft lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display">Nilai Terbaru</CardTitle>
              <p className="text-sm text-muted-foreground">Hasil penilaian akhir</p>
            </div>
            <Link to="/nilai">
              <Button variant="ghost" size="sm" className="text-primary">
                Lihat semua <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {nilaiTerbaru.map((n) => (
                <div key={n.id} className="flex items-center gap-3 rounded-xl border border-border/60 p-3 transition-smooth hover:bg-muted/40">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20 text-sm font-bold text-secondary-foreground">
                    {n.akhir}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{n.siswa}</p>
                    <p className="truncate text-xs text-muted-foreground">{n.mapel}</p>
                  </div>
                  <Badge className={
                    n.akhir >= 85 ? "bg-success text-primary-foreground"
                      : n.akhir >= 75 ? "bg-accent text-accent-foreground"
                        : "bg-warning text-secondary-foreground"
                  }>
                    {n.akhir >= 85 ? "Sangat Baik" : n.akhir >= 75 ? "Baik" : "Cukup"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pengumuman */}
        <Card className="rounded-2xl border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Megaphone className="h-5 w-5 text-secondary" />
              Pengumuman
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pengumuman.map((p) => (
              <div key={p.id} className="rounded-xl border-l-4 border-secondary bg-secondary/5 p-3">
                <p className="text-sm font-semibold">{p.judul}</p>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.isi}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">{p.tanggal}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
