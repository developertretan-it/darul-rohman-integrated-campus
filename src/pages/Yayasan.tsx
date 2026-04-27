import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_DATA, UNITS, UnitKey, PENDAFTAR } from "@/data/mockData";
import { PageHeader, StatCard } from "@/components/shared/StatCard";
import { Building2, Users, GraduationCap, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo-yayasan.png";

export default function Yayasan() {
  const units = (Object.keys(MOCK_DATA) as UnitKey[]);
  const totalSiswa = units.reduce((s, k) => s + MOCK_DATA[k].ringkasan.totalSiswa, 0);
  const totalGuru = units.reduce((s, k) => s + MOCK_DATA[k].ringkasan.totalGuru, 0);
  const totalKelas = units.reduce((s, k) => s + MOCK_DATA[k].ringkasan.totalKelas, 0);
  const max = Math.max(...units.map((k) => MOCK_DATA[k].ringkasan.totalSiswa));

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 pattern-islamic shadow-md-soft">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-secondary/30 blur-3xl" />
        <div className="absolute -bottom-10 left-1/3 h-40 w-40 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-secondary/40 blur-xl" />
            <img src={logo} alt="Logo" className="relative h-20 w-20 object-contain" />
          </div>
          <div className="text-primary-foreground">
            <Badge className="mb-2 border-0 bg-secondary text-secondary-foreground">Dashboard Yayasan</Badge>
            <h1 className="font-display text-3xl font-bold">Yayasan Darul Rohman</h1>
            <p className="mt-1 opacity-90">Morombuh, Kwanyar — Sistem Pendidikan Terpadu Multi Unit</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Siswa" value={totalSiswa} icon={GraduationCap} variant="primary" hint="Seluruh unit" />
        <StatCard label="Total Guru" value={totalGuru} icon={Users} variant="secondary" />
        <StatCard label="Total Kelas" value={totalKelas} icon={Building2} variant="accent" />
        <StatCard label="PPDB Aktif" value={PENDAFTAR.length} icon={FileText} hint="Tahun ini" />
      </div>

      {/* Bar chart */}
      <Card className="rounded-2xl border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="font-display">Distribusi Siswa per Unit</CardTitle>
          <p className="text-sm text-muted-foreground">Perbandingan jumlah siswa antar unit pendidikan</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {units.map((k) => {
              const u = UNITS[k];
              const total = MOCK_DATA[k].ringkasan.totalSiswa;
              const pct = (total / max) * 100;
              return (
                <div key={k}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className="gradient-primary text-primary-foreground">{u.short}</Badge>
                      <span className="font-semibold">{u.name}</span>
                    </div>
                    <span className="font-mono font-bold text-primary">{total} siswa</span>
                  </div>
                  <div className="h-6 overflow-hidden rounded-xl bg-muted">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        k === "mi" ? "gradient-primary" : k === "smp" ? "gradient-sky" : "gradient-gold"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Per-unit cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {units.map((k) => {
          const u = UNITS[k];
          const d = MOCK_DATA[k];
          return (
            <Card key={k} className="overflow-hidden rounded-2xl border-0 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-md-soft">
              <div className={`h-2 ${k === "mi" ? "gradient-primary" : k === "smp" ? "gradient-sky" : "gradient-gold"}`} />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display">{u.short}</CardTitle>
                  <Badge variant="outline">{u.level}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{u.name}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">Siswa</p>
                    <p className="text-xl font-bold text-primary">{d.ringkasan.totalSiswa}</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">Guru</p>
                    <p className="text-xl font-bold text-accent">{d.ringkasan.totalGuru}</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">Kelas</p>
                    <p className="text-xl font-bold text-secondary-foreground">{d.ringkasan.totalKelas}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs">
                    <span>Kehadiran</span>
                    <span className="font-bold text-success">{d.absensi.hadir}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-success transition-all duration-700" style={{ width: `${d.absensi.hadir}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
