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
import { Download, FileText, Printer, Award, Users, Eye } from "lucide-react";
import { useUnit } from "@/context/UnitContext";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/shared/StatCard";
import { NilaiDetailDialog } from "@/components/shared/NilaiDetailDialog";
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

  // Semua role kini adalah admin — bisa pilih siswa bebas.
  const namaTerkunci: string | undefined = undefined;

  const siswaOptions = useMemo(() => {
    const namaUnik = Array.from(new Set(data.nilai.map((n) => n.siswa)));
    return namaUnik;
  }, [data.nilai]);

  const [selected, setSelected] = useState<string>(
    namaTerkunci && siswaOptions.includes(namaTerkunci) ? namaTerkunci : siswaOptions[0] ?? "",
  );

  const [detailOpen, setDetailOpen] = useState(false);
  const [fokusMapel, setFokusMapel] = useState<string | null>(null);

  const openDetail = (mapel: string | null) => {
    setFokusMapel(mapel);
    setDetailOpen(true);
  };

  const kelasSiswa = useMemo(
    () => data.siswa.find((s) => s.nama === selected)?.kelas,
    [data.siswa, selected],
  );

  const nilaiSiswa = data.nilai.filter((n) => n.siswa === selected);
  const rataRata = nilaiSiswa.length
    ? Math.round(nilaiSiswa.reduce((a, b) => a + b.akhir, 0) / nilaiSiswa.length)
    : 0;
  const tertinggi = nilaiSiswa.reduce((a, b) => (b.akhir > a ? b.akhir : a), 0);
  const terendah = nilaiSiswa.reduce((a, b) => (b.akhir < a ? b.akhir : a), 100);
  const pred = predikat(rataRata);

  // ====== PDF helpers (konsisten di semua halaman & siswa) ======
  const HEADER_H = 30;
  const FOOTER_H = 12;
  const MARGIN_X = 14;

  const drawHeader = (doc: jsPDF) => {
    const pageW = doc.internal.pageSize.getWidth();
    doc.setFillColor(20, 83, 45);
    doc.rect(0, 0, pageW, HEADER_H, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("YAYASAN DARUL ROHMAN", pageW / 2, 12, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Unit ${info.short} — ${info.name}`, pageW / 2, 19, { align: "center" });
    doc.setFontSize(8);
    doc.text("Morombuh, Kwanyar, Bangkalan", pageW / 2, 25, { align: "center" });
    // garis emas tipis
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.6);
    doc.line(0, HEADER_H, pageW, HEADER_H);
    doc.setTextColor(20, 30, 20);
  };

  const drawFooter = (doc: jsPDF, pageNum: number, totalPages: number) => {
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(MARGIN_X, pageH - FOOTER_H, pageW - MARGIN_X, pageH - FOOTER_H);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Sistem Informasi Akademik — Yayasan Darul Rohman", MARGIN_X, pageH - 5);
    doc.text(`Hal ${pageNum} / ${totalPages}`, pageW - MARGIN_X, pageH - 5, { align: "right" });
    doc.setTextColor(20, 30, 20);
  };

  const drawIdentity = (doc: jsPDF, namaSiswa: string, startY: number) => {
    const pageW = doc.internal.pageSize.getWidth();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("LAPORAN HASIL BELAJAR SISWA", pageW / 2, startY, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    let y = startY + 10;
    const rows: [string, string][] = [
      ["Nama Siswa", namaSiswa],
      ["Unit", `${info.short} — ${info.name}`],
      ["Tahun Ajaran", "2025/2026"],
      ["Semester", "Ganjil"],
      ["Wali Kelas", data.guru[0]?.nama ?? "-"],
    ];
    rows.forEach(([k, v]) => {
      doc.text(k, MARGIN_X, y);
      doc.text(":", MARGIN_X + 36, y);
      doc.text(v, MARGIN_X + 40, y);
      y += 6;
    });
    return y;
  };

  /**
   * Blok tanda tangan rapi: dua kolom (Wali Kelas kiri, Kepala Sekolah kanan),
   * tinggi total ~50mm. Jika tidak muat di halaman saat ini, pindah ke halaman baru
   * (dengan header tetap) supaya tidak pernah terpotong.
   */
  const SIG_BLOCK_H = 55;
  const drawSignatureBlock = (doc: jsPDF, startY: number, tanggal: string) => {
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    let y = startY;
    if (y + SIG_BLOCK_H > pageH - FOOTER_H - 5) {
      doc.addPage();
      drawHeader(doc);
      y = HEADER_H + 12;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Bangkalan, ${tanggal}`, pageW - MARGIN_X, y, { align: "right" });

    const colW = (pageW - MARGIN_X * 2) / 2;
    const leftX = MARGIN_X + colW / 2;
    const rightX = MARGIN_X + colW + colW / 2;
    const labelY = y + 10;
    const nameY = labelY + 28;
    const lineY = nameY - 2;

    doc.text("Wali Kelas,", leftX, labelY, { align: "center" });
    doc.text("Kepala Sekolah,", rightX, labelY, { align: "center" });

    // garis tanda tangan
    doc.setDrawColor(60, 60, 60);
    doc.setLineWidth(0.3);
    doc.line(leftX - 30, lineY, leftX + 30, lineY);
    doc.line(rightX - 30, lineY, rightX + 30, lineY);

    doc.setFont("helvetica", "bold");
    doc.text(data.guru[0]?.nama ?? "(...........................)", leftX, nameY, { align: "center" });
    doc.text("H. Abd. Rohman, S.Pd.I", rightX, nameY, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("NIP. -", leftX, nameY + 5, { align: "center" });
    doc.text("NIP. -", rightX, nameY + 5, { align: "center" });
  };

  /** Render satu siswa ke `doc` mulai dari halaman aktif. */
  const renderSiswa = (doc: jsPDF, nama: string) => {
    drawHeader(doc);
    const idEndY = drawIdentity(doc, nama, HEADER_H + 12);

    const rowsNilai = data.nilai.filter((n) => n.siswa === nama);
    const avg = rowsNilai.length
      ? Math.round(rowsNilai.reduce((a, b) => a + b.akhir, 0) / rowsNilai.length)
      : 0;
    const p = predikat(avg);

    autoTable(doc, {
      startY: idEndY + 4,
      head: [["No", "Mata Pelajaran", "Tugas", "UTS", "UAS", "Akhir", "Predikat"]],
      body: rowsNilai.map((n, i) => [
        String(i + 1),
        n.mapel,
        String(n.tugas),
        String(n.uts),
        String(n.uas),
        String(n.akhir),
        predikat(n.akhir).label,
      ]),
      headStyles: { fillColor: [20, 83, 45], textColor: 255, fontStyle: "bold", halign: "center" },
      bodyStyles: { halign: "center" },
      columnStyles: { 1: { halign: "left" } },
      styles: { fontSize: 9, cellPadding: 3 },
      alternateRowStyles: { fillColor: [240, 247, 240] },
      margin: { top: HEADER_H + 8, bottom: FOOTER_H + 6, left: MARGIN_X, right: MARGIN_X },
      // Header tetap di setiap halaman saat tabel paginasi.
      didDrawPage: () => drawHeader(doc),
    });

    const finalY = (doc as any).lastAutoTable.finalY + 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`Rata-rata: ${avg}`, MARGIN_X, finalY);
    doc.text(`Predikat: ${p.label} (${p.desc})`, MARGIN_X, finalY + 6);
    doc.setFont("helvetica", "normal");

    const today = new Date().toLocaleDateString("id-ID", {
      day: "2-digit", month: "long", year: "numeric",
    });
    drawSignatureBlock(doc, finalY + 16, today);
  };

  const stampFooters = (doc: jsPDF) => {
    const total = doc.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      drawFooter(doc, i, total);
    }
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    renderSiswa(doc, selected);
    stampFooters(doc);
    doc.save(`Raport_${selected.replace(/\s+/g, "_")}_${info.short}.pdf`);
    toast.success("Raport PDF berhasil diunduh");
  };

  const exportPdfAll = () => {
    if (siswaOptions.length === 0) {
      toast.error("Tidak ada data siswa");
      return;
    }
    const doc = new jsPDF();
    siswaOptions.forEach((nama, idx) => {
      if (idx > 0) doc.addPage();
      renderSiswa(doc, nama);
    });
    stampFooters(doc);
    doc.save(`Raport_Semua_Siswa_${info.short}.pdf`);
    toast.success(`Raport ${siswaOptions.length} siswa berhasil diunduh`);
  };

  const canExportAll = !namaTerkunci;

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
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" /> Cetak
            </Button>
            <Button onClick={exportPdf} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
            {canExportAll && (
              <Button
                variant="secondary"
                onClick={exportPdfAll}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <Users className="mr-2 h-4 w-4" /> Export Semua ({siswaOptions.length})
              </Button>
            )}
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDetail(null)}
            disabled={nilaiSiswa.length === 0}
          >
            <Eye className="mr-2 h-4 w-4" /> Detail Lengkap
          </Button>
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
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nilaiSiswa.map((n, i) => {
                  const p = predikat(n.akhir);
                  return (
                    <TableRow
                      key={n.id}
                      className="cursor-pointer transition-smooth hover:bg-muted/60"
                      onClick={() => openDetail(n.mapel)}
                    >
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="font-medium">{n.mapel}</TableCell>
                      <TableCell className="text-center">{n.tugas}</TableCell>
                      <TableCell className="text-center">{n.uts}</TableCell>
                      <TableCell className="text-center">{n.uas}</TableCell>
                      <TableCell className="text-center font-bold text-primary">{n.akhir}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={p.color}>{p.label}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetail(n.mapel);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {nilaiSiswa.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                      Belum ada nilai untuk siswa ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <NilaiDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        siswaList={namaTerkunci ? [selected] : siswaOptions}
        siswa={selected}
        onSiswaChange={namaTerkunci ? undefined : (n) => setSelected(n)}
        fokusMapel={fokusMapel}
        nilai={data.nilai}
        unitShort={info.short}
        kelas={kelasSiswa}
      />
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
