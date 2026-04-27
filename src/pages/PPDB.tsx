import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, StatCard } from "@/components/shared/StatCard";
import { PENDAFTAR, UNITS, UnitKey } from "@/data/mockData";
import { FileText, CheckCircle2, Clock, XCircle, Upload, Send } from "lucide-react";
import { toast } from "sonner";

export default function PPDB() {
  const [unit, setUnit] = useState<UnitKey>("mi");
  const total = PENDAFTAR.length;
  const diterima = PENDAFTAR.filter((p) => p.status === "Diterima").length;
  const pending = PENDAFTAR.filter((p) => p.status === "Pending").length;
  const ditolak = PENDAFTAR.filter((p) => p.status === "Ditolak").length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pendaftaran berhasil dikirim! Status: Pending verifikasi.");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="PPDB — Pendaftaran Peserta Didik Baru" subtitle="Tahun Ajaran 2025/2026 • Yayasan Darul Rohman" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Pendaftar" value={total} icon={FileText} variant="primary" />
        <StatCard label="Diterima" value={diterima} icon={CheckCircle2} variant="secondary" />
        <StatCard label="Pending" value={pending} icon={Clock} variant="accent" />
        <StatCard label="Ditolak" value={ditolak} icon={XCircle} hint="Setelah verifikasi" />
      </div>

      <Tabs defaultValue="form" className="w-full">
        <TabsList className="rounded-2xl bg-muted/40 p-1.5">
          <TabsTrigger value="form" className="rounded-xl data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">Form Pendaftaran</TabsTrigger>
          <TabsTrigger value="list" className="rounded-xl data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">Daftar Pendaftar</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <Card className="rounded-2xl border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="font-display">Formulir Pendaftaran Online</CardTitle>
              <p className="text-sm text-muted-foreground">Isi data dengan benar, semua field wajib diisi.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input id="nama" required placeholder="Nama sesuai akta" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nik">NIK</Label>
                  <Input id="nik" required placeholder="16 digit NIK" maxLength={16} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Pilih Unit</Label>
                  <Select value={unit} onValueChange={(v) => setUnit(v as UnitKey)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.values(UNITS).map((u) => (
                        <SelectItem key={u.key} value={u.key}>{u.short} — {u.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asal">Sekolah Asal</Label>
                  <Input id="asal" required placeholder="Nama sekolah sebelumnya" className="rounded-xl" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="alamat">Alamat Lengkap</Label>
                  <Textarea id="alamat" required placeholder="Desa, Kecamatan, Kabupaten" className="rounded-xl" rows={3} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Upload Berkas (Akta, KK, Ijazah)</Label>
                  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 py-8 text-center transition-smooth hover:border-primary/40 hover:bg-primary/5">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Klik untuk upload atau drag & drop</p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, PNG (maks 5MB)</p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" size="lg" className="w-full gradient-primary text-primary-foreground shadow-md-soft">
                    <Send className="mr-2 h-4 w-4" />
                    Kirim Pendaftaran
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card className="rounded-2xl border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="font-display">Daftar Pendaftar PPDB</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>NIK</TableHead>
                      <TableHead>Asal Sekolah</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PENDAFTAR.map((p) => (
                      <TableRow key={p.id} className="transition-smooth hover:bg-muted/40">
                        <TableCell className="font-semibold">{p.nama}</TableCell>
                        <TableCell className="font-mono text-xs">{p.nik}</TableCell>
                        <TableCell className="text-muted-foreground">{p.asal}</TableCell>
                        <TableCell><Badge className="gradient-primary text-primary-foreground">{UNITS[p.unit].short}</Badge></TableCell>
                        <TableCell>{p.tanggal}</TableCell>
                        <TableCell>
                          <Badge className={
                            p.status === "Diterima" ? "bg-success text-primary-foreground"
                              : p.status === "Pending" ? "bg-warning text-secondary-foreground"
                                : "bg-destructive text-destructive-foreground"
                          }>
                            {p.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
