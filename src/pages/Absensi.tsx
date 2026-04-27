import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUnit } from "@/context/UnitContext";
import { PageHeader, StatCard } from "@/components/shared/StatCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Heart, XCircle } from "lucide-react";

export default function Absensi() {
  const { data, info } = useUnit();
  const a = data.absensi;

  return (
    <div className="space-y-6">
      <PageHeader title={`Absensi ${info.short}`} subtitle="Rekap kehadiran siswa periode ini" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Hadir" value={`${a.hadir}%`} icon={CheckCircle2} variant="primary" />
        <StatCard label="Izin" value={`${a.izin}%`} icon={AlertCircle} variant="accent" />
        <StatCard label="Sakit" value={`${a.sakit}%`} icon={Heart} variant="secondary" />
        <StatCard label="Alpha" value={`${a.alpha}%`} icon={XCircle} hint="Tanpa keterangan" />
      </div>

      <Card className="rounded-2xl border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="font-display">Distribusi Kehadiran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Hadir", v: a.hadir, color: "bg-success" },
            { label: "Izin", v: a.izin, color: "bg-accent" },
            { label: "Sakit", v: a.sakit, color: "bg-warning" },
            { label: "Alpha", v: a.alpha, color: "bg-destructive" },
          ].map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">{row.label}</span>
                <span className="text-muted-foreground">{row.v}%</span>
              </div>
              <Progress value={row.v} className={`h-3 [&>div]:${row.color}`} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="font-display">Absensi Hari Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIS</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Jam Masuk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.siswa.map((s, i) => {
                  const statuses = [
                    { label: "Hadir", class: "bg-success text-primary-foreground" },
                    { label: "Hadir", class: "bg-success text-primary-foreground" },
                    { label: "Izin", class: "bg-accent text-accent-foreground" },
                    { label: "Hadir", class: "bg-success text-primary-foreground" },
                    { label: "Sakit", class: "bg-warning text-secondary-foreground" },
                  ];
                  const st = statuses[i % statuses.length];
                  return (
                    <TableRow key={s.id} className="transition-smooth hover:bg-muted/40">
                      <TableCell className="font-mono text-xs">{s.nis}</TableCell>
                      <TableCell className="font-semibold">{s.nama}</TableCell>
                      <TableCell><Badge variant="outline">{s.kelas}</Badge></TableCell>
                      <TableCell><Badge className={st.class}>{st.label}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{st.label === "Hadir" ? "07:0" + ((i % 5) + 1) : "—"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
