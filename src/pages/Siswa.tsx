import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUnit } from "@/context/UnitContext";
import { PageHeader } from "@/components/shared/StatCard";
import { Search, UserPlus } from "lucide-react";
import { useState } from "react";

export default function Siswa() {
  const { data, info } = useUnit();
  const [q, setQ] = useState("");
  const filtered = data.siswa.filter((s) =>
    s.nama.toLowerCase().includes(q.toLowerCase()) || s.nis.includes(q) || s.kelas.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Data Siswa ${info.short}`}
        subtitle={`Total ${data.ringkasan.totalSiswa} siswa aktif di ${info.name}`}
        action={
          <Button className="gradient-primary text-primary-foreground shadow-md-soft">
            <UserPlus className="mr-2 h-4 w-4" />
            Tambah Siswa
          </Button>
        }
      />

      <Card className="rounded-2xl border-0 shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="font-display">Daftar Siswa</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari..." className="w-64 rounded-xl pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIS</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>L/P</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id} className="transition-smooth hover:bg-muted/40">
                    <TableCell className="font-mono text-xs">{s.nis}</TableCell>
                    <TableCell className="font-semibold">{s.nama}</TableCell>
                    <TableCell><Badge variant="outline" className="border-primary/40 text-primary">{s.kelas}</Badge></TableCell>
                    <TableCell>{s.jenisKelamin}</TableCell>
                    <TableCell className="text-muted-foreground">{s.alamat}</TableCell>
                    <TableCell><Badge className="bg-success text-primary-foreground">{s.status}</Badge></TableCell>
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
