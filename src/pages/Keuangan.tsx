import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUnit } from "@/context/UnitContext";
import { PageHeader, StatCard } from "@/components/shared/StatCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Wallet, TrendingUp } from "lucide-react";

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");

export default function Keuangan() {
  const { data, info } = useUnit();
  const lunas = data.tagihan.filter((t) => t.status === "Lunas");
  const belum = data.tagihan.filter((t) => t.status === "Belum");
  const totalLunas = lunas.reduce((s, t) => s + t.jumlah, 0);
  const totalBelum = belum.reduce((s, t) => s + t.jumlah, 0);

  return (
    <div className="space-y-6">
      <PageHeader title={`Keuangan ${info.short}`} subtitle="Tagihan SPP & status pembayaran siswa" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Tagihan" value={fmt(totalLunas + totalBelum)} icon={Wallet} variant="primary" />
        <StatCard label="Sudah Lunas" value={fmt(totalLunas)} icon={CheckCircle2} variant="secondary" hint={`${lunas.length} pembayaran`} />
        <StatCard label="Belum Bayar" value={fmt(totalBelum)} icon={Clock} variant="accent" hint={`${belum.length} tagihan`} />
        <StatCard label="Persentase Lunas" value={`${Math.round((lunas.length / data.tagihan.length) * 100)}%`} icon={TrendingUp} trend="On track" />
      </div>

      <Card className="rounded-2xl border-0 shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display">Daftar Tagihan SPP</CardTitle>
          <Button className="gradient-gold text-secondary-foreground shadow-gold">+ Buat Tagihan</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Bulan</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.tagihan.map((t) => (
                  <TableRow key={t.id} className="transition-smooth hover:bg-muted/40">
                    <TableCell className="font-semibold">{t.siswa}</TableCell>
                    <TableCell><Badge variant="outline">{t.kelas}</Badge></TableCell>
                    <TableCell>{t.bulan}</TableCell>
                    <TableCell className="font-mono">{fmt(t.jumlah)}</TableCell>
                    <TableCell className="text-muted-foreground">{t.tanggal}</TableCell>
                    <TableCell>
                      <Badge className={t.status === "Lunas" ? "bg-success text-primary-foreground" : "bg-warning text-secondary-foreground"}>
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="text-primary">
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
