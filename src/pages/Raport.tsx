import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Download, FileText, Printer, Award } from "lucide-react";
import { useUnit } from "@/context/UnitContext";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/shared/StatCard";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const predikat = (n: number) =>
  n >= 90 ? { label: "A", desc: "Sangat Baik", color: "bg-success text-white" }
    : n >= 80 ? { label: "B", desc: "Baik", color: "bg-primary text-primary-foreground" }
      : n >= 70 ? { label: "C", desc: "Cukup", color: "bg-accent text-accent-foreground" }
        : { label: "D", desc: "Perlu Bimbingan", color: "bg-destructive text-white" };

export default function Raport() {
  const { data, info, unit } = useUnit();
  const { user } = useAuth();

  // Untuk siswa: kunci ke nama dirinya. Untuk staff: bisa pilih siswa.
  const isSiswaRole = user?.role === "siswa";
  const isWaliRole = user?.role === "wali";
  const namaTerkunci = isSiswaRole ? user?.nama : isWaliRole ? user?.anak : undefined;

  const siswaOptions = useMemo(() => {
    const namaUnik = Array.from(new Set(data.nilai.map((n) => n.siswa)));
    return namaUnik;
  }, [data.nilai]);

  const [selected, setSelected] = useState<string>(
    namaTerkunci && siswaOptions.includes(namaTerkunci) ? namaTerkunci : siswaOptions[0] ?? "",
  );

  const nilaiSiswa = data.nilai.filter((n) => n.siswa === selected);
  const rataRata = nilaiSiswa.length
    ? Math.round(nilaiSiswa.reduce((a, b) => a + b.akhir, 0) / nilaiSiswa.length)
    : 0;
  const tertinggi = nilaiSiswa.reduce((a, b) => (b.akhir > a ? b.akhir : a), 0);
  const terendah = nilaiSiswa.reduce((a, b) => (b.akhir < a ? b.akhir : a), 100);
  const pred = predikat(rataRata);

  const exportPdf = () => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(20, 83, 45);
    doc.rect(0, 0, pageW, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("YAYASAN DARUL ROHMAN", pageW / 2, 12, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Unit ${info.short} — ${info.name}`, pageW / 2, 19, { align: "center" });
    doc.setFontSize(8);
    doc.text("Morombuh, Kwanyar, Bangkalan", pageW / 2, 25, { align: "center" });

    // Title
    doc.setTextColor(20, 30, 20);
    doc.setFontSize(13);
    doc.text("LAPORAN HASIL BELAJAR SISWA", pageW / 2, 42, { align: "center" });

    // Identitas
    doc.setFontSize(10);
    let y = 55;
    const rows: [string, string][] = [
      ["Nama Siswa", selected],
      ["Unit", `${info.short} — ${info.name}`],
      ["Tahun Ajaran", "2025/2026"],
      ["Semester", "Ganjil"],
      ["Wali Kelas", data.guru[0]?.nama ?? "-"],
    ];
    rows.forEach(([k, v]) => {
      doc.text(k, 14, y);
      doc.text(":", 50, y);
      doc.text(v, 54, y);
      y += 6;
    });

    // Tabel nilai
    autoTable(doc, {
      startY: y + 4,
      head: [["No", "Mata Pelajaran", "Tugas", "UTS", "UAS", "Akhir", "Predikat"]],
      body: nilaiSiswa.map((n, i) => [
        String(i + 1),
        n.mapel,
        String(n.tugas),
        String(n.uts),
        String(n.uas),
        String(n.akhir),
        predikat(n.akhir).label,
      ]),
      headStyles: { fillColor: [20, 83, 45], textColor: 255, fontStyle: "bold" },
      styles: { fontSize: 9, cellPadding: 3 },
      alternateRowStyles: { fillColor: [240, 247, 240] },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text(`Rata-rata: ${rataRata}`, 14, finalY);
    doc.text(`Predikat: ${pred.label} (${pred.desc})`, 14, finalY + 6);

    // Tanda tangan
    doc.setFontSize(9);
    doc.text("Mengetahui,", pageW - 60, finalY + 20);
    doc.text("Kepala Sekolah", pageW - 60, finalY + 26);
    doc.text("(................................)", pageW - 70, finalY + 50);

    doc.save(`Raport_${selected.replace(/\s+/g, "_")}_${info.short}.pdf`);
    toast.success("Raport PDF berhasil diunduh");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Raport Akademik"
        subtitle={`Laporan hasil belajar siswa unit ${info.short}`}
      />

      {/* Filter */}
      <Card className="rounded-2xl border-border shadow-soft">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <label className="text-sm font-semibold text-foreground">Pilih Siswa:</label>
            <Select
              value={selected}
              onValueChange={setSelected}
              disabled={!!namaTerkunci}
            >
              <SelectTrigger className="w-full bg-card sm:w-72">
                <SelectValue placeholder="Pilih siswa..." />
              </SelectTrigger>
              <SelectContent className="z-[60]">
                {siswaOptions.map((n) => (
                  <SelectItem key={n} value={n}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {namaTerkunci && (
              <Badge variant="outline" className="border-primary text-primary">
                Terkunci ke akun
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" /> Cetak
            </Button>
            <Button onClick={exportPdf} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Identitas + Ringkasan */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-border shadow-soft md:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-lg">Identitas Siswa</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
            <Info label="Nama" value={selected} />
            <Info label="Unit" value={`${info.short} — ${info.name}`} />
            <Info label="Tahun Ajaran" value="2025/2026" />
            <Info label="Semester" value="Ganjil" />
            <Info label="Wali Kelas" value={data.guru[0]?.nama ?? "-"} />
            <Info label="Status" value="Aktif" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card shadow-soft">
          <CardHeader>
            <CardTitle className="font-display text-lg">Ringkasan Nilai</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl bg-primary p-4 text-center text-primary-foreground">
              <p className="text-xs font-medium opacity-90">Rata-rata Akhir</p>
              <p className="mt-1 text-4xl font-bold">{rataRata}</p>
              <Badge className={`mt-2 ${pred.color}`}>{pred.label} • {pred.desc}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg bg-success/10 p-2">
                <p className="text-xs text-muted-foreground">Tertinggi</p>
                <p className="text-lg font-bold text-success">{tertinggi}</p>
              </div>
              <div className="rounded-lg bg-warning/10 p-2">
                <p className="text-xs text-muted-foreground">Terendah</p>
                <p className="text-lg font-bold text-warning">{terendah}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabel nilai */}
      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-display text-lg">Nilai Mata Pelajaran</CardTitle>
            <p className="text-sm text-muted-foreground">{nilaiSiswa.length} mapel • Semester Ganjil</p>
          </div>
          <FileText className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>Mata Pelajaran</TableHead>
                  <TableHead className="text-center">Tugas</TableHead>
                  <TableHead className="text-center">UTS</TableHead>
                  <TableHead className="text-center">UAS</TableHead>
                  <TableHead className="text-center">Akhir</TableHead>
                  <TableHead className="text-center">Predikat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nilaiSiswa.map((n, i) => {
                  const p = predikat(n.akhir);
                  return (
                    <TableRow key={n.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="font-medium">{n.mapel}</TableCell>
                      <TableCell className="text-center">{n.tugas}</TableCell>
                      <TableCell className="text-center">{n.uts}</TableCell>
                      <TableCell className="text-center">{n.uas}</TableCell>
                      <TableCell className="text-center font-bold text-primary">{n.akhir}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={p.color}>{p.label}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {nilaiSiswa.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                      Belum ada nilai untuk siswa ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
    </div>
  );
}
