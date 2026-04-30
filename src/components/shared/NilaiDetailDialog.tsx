import { useEffect, useMemo, useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ToggleGroup, ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  Award, BookOpen, ChevronLeft, ChevronRight, ClipboardCheck, FileText,
  Filter, GraduationCap,
} from "lucide-react";
import type { Nilai } from "@/data/mockData";

export interface PredikatInfo {
  label: string;
  desc: string;
  color: string;
  detail: string;
}

export const predikatDetail = (n: number): PredikatInfo => {
  if (n >= 90)
    return {
      label: "A", desc: "Sangat Baik", color: "bg-success text-white",
      detail:
        "Siswa menunjukkan penguasaan kompetensi yang sangat baik, mampu menerapkan konsep secara mandiri dan konsisten di atas standar.",
    };
  if (n >= 80)
    return {
      label: "B", desc: "Baik", color: "bg-primary text-primary-foreground",
      detail:
        "Siswa telah memenuhi seluruh kompetensi dasar dengan baik dan mampu menyelesaikan tugas sesuai standar yang ditetapkan.",
    };
  if (n >= 70)
    return {
      label: "C", desc: "Cukup", color: "bg-accent text-accent-foreground",
      detail:
        "Siswa sudah mencapai standar minimal namun masih perlu latihan tambahan pada beberapa indikator untuk meningkatkan pemahaman.",
    };
  return {
    label: "D", desc: "Perlu Bimbingan", color: "bg-destructive text-white",
    detail:
      "Siswa belum mencapai standar minimal. Disarankan mengikuti program remedial dan pendampingan khusus dari guru mata pelajaran.",
  };
};

type Komponen = "all" | "tugas" | "uts" | "uas";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Daftar nama siswa yang dapat dinavigasi (untuk Prev/Next). */
  siswaList: string[];
  /** Nama siswa aktif. */
  siswa: string | null;
  /** Setter eksternal untuk berpindah siswa via Prev/Next. */
  onSiswaChange?: (nama: string) => void;
  /** Mapel yang difokuskan saat dialog dibuka. */
  fokusMapel?: string | null;
  /** Semua nilai (di unit aktif) – akan difilter berdasarkan siswa terpilih. */
  nilai: Nilai[];
  unitShort: string;
  kelas?: string;
}

const KomponenCard = ({
  icon: Icon, label, bobot, nilai, highlight,
}: {
  icon: any; label: string; bobot: string; nilai: number; highlight?: boolean;
}) => (
  <div
    className={`rounded-xl border p-3 transition-smooth ${
      highlight
        ? "border-primary/50 bg-primary/5 shadow-soft"
        : "border-border bg-muted/40"
    }`}
  >
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-primary" />
        <span className="truncate text-sm font-semibold text-foreground">{label}</span>
      </div>
      <Badge variant="outline" className="shrink-0 text-[10px]">Bobot {bobot}</Badge>
    </div>
    <div className="mt-2 flex items-end justify-between gap-3">
      <Progress value={nilai} className="h-2 flex-1" />
      <span className="min-w-[2.25rem] text-right text-base font-bold text-primary sm:text-lg">
        {nilai}
      </span>
    </div>
  </div>
);

export function NilaiDetailDialog({
  open, onOpenChange, siswaList, siswa, onSiswaChange,
  fokusMapel, nilai, unitShort, kelas,
}: Props) {
  // Filter komponen yang ingin difokuskan (Tugas / UTS / UAS / semua).
  const [komponen, setKomponen] = useState<Komponen>("all");
  // Filter mapel: ikut fokus saat pertama dibuka, user dapat reset ke semua.
  const [mapelFilter, setMapelFilter] = useState<string | null>(fokusMapel ?? null);

  // Sinkron ulang saat dialog dibuka/ siswa berganti / fokus berubah.
  useEffect(() => {
    if (open) {
      setMapelFilter(fokusMapel ?? null);
      setKomponen("all");
    }
  }, [open, siswa, fokusMapel]);

  // Keyboard shortcut: ← → untuk pindah siswa.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, siswa, siswaList]);

  const idx = siswa ? siswaList.indexOf(siswa) : -1;
  const goPrev = () => {
    if (!onSiswaChange || siswaList.length === 0) return;
    const next = idx <= 0 ? siswaList[siswaList.length - 1] : siswaList[idx - 1];
    onSiswaChange(next);
  };
  const goNext = () => {
    if (!onSiswaChange || siswaList.length === 0) return;
    const next = idx >= siswaList.length - 1 ? siswaList[0] : siswaList[idx + 1];
    onSiswaChange(next);
  };

  const nilaiSiswa = useMemo(
    () => (siswa ? nilai.filter((n) => n.siswa === siswa) : []),
    [nilai, siswa],
  );
  const list = useMemo(
    () => (mapelFilter ? nilaiSiswa.filter((n) => n.mapel === mapelFilter) : nilaiSiswa),
    [nilaiSiswa, mapelFilter],
  );

  const rata = list.length
    ? Math.round(list.reduce((a, b) => a + b.akhir, 0) / list.length)
    : 0;
  const pred = predikatDetail(rata);

  if (!siswa) return null;

  const showTugas = komponen === "all" || komponen === "tugas";
  const showUts   = komponen === "all" || komponen === "uts";
  const showUas   = komponen === "all" || komponen === "uas";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[60] flex max-h-[92vh] w-[calc(100vw-1rem)] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:w-full">
        {/* HEADER tetap, tidak ikut scroll */}
        <DialogHeader className="border-b border-border bg-card px-4 pb-3 pt-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <DialogTitle className="font-display text-lg sm:text-xl">
                {siswa}
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs sm:text-sm">
                {kelas ? `Kelas ${kelas} • ` : ""}Unit {unitShort}
                {siswaList.length > 1 && (
                  <span className="ml-1 text-muted-foreground">
                    • Siswa {idx + 1} dari {siswaList.length}
                  </span>
                )}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Badge className={`${pred.color} shrink-0`}>
                <Award className="mr-1 h-3.5 w-3.5" />
                {pred.label} • {rata}
              </Badge>
              {siswaList.length > 1 && onSiswaChange && (
                <div className="flex items-center gap-1">
                  <Button
                    type="button" variant="outline" size="icon"
                    className="h-8 w-8" onClick={goPrev}
                    aria-label="Siswa sebelumnya"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button" variant="outline" size="icon"
                    className="h-8 w-8" onClick={goNext}
                    aria-label="Siswa berikutnya"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* TOOLBAR FILTER */}
        <div className="flex flex-col gap-3 border-b border-border bg-muted/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <Filter className="h-3.5 w-3.5" /> Komponen
            </span>
            <ToggleGroup
              type="single"
              value={komponen}
              onValueChange={(v) => v && setKomponen(v as Komponen)}
              className="flex-wrap justify-start"
            >
              <ToggleGroupItem value="all"   className="h-8 px-2 text-xs">Semua</ToggleGroupItem>
              <ToggleGroupItem value="tugas" className="h-8 px-2 text-xs">Tugas</ToggleGroupItem>
              <ToggleGroupItem value="uts"   className="h-8 px-2 text-xs">UTS</ToggleGroupItem>
              <ToggleGroupItem value="uas"   className="h-8 px-2 text-xs">UAS</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {fokusMapel && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[11px]">
                {mapelFilter ? `Fokus: ${mapelFilter}` : "Semua Mapel"}
              </Badge>
              <Button
                type="button" variant="ghost" size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setMapelFilter(mapelFilter ? null : fokusMapel)}
              >
                {mapelFilter ? "Lihat semua" : "Fokus mapel"}
              </Button>
            </div>
          )}
        </div>

        {/* AREA SCROLL */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {/* Ringkasan predikat */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 sm:p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <GraduationCap className="h-4 w-4" />
              Predikat: {pred.label} ({pred.desc})
            </div>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{pred.detail}</p>
          </div>

          <Separator className="my-4" />

          {/* Daftar mapel + komponen */}
          <div className="space-y-3 sm:space-y-4">
            {list.map((n) => {
              const p = predikatDetail(n.akhir);
              return (
                <div
                  key={n.id}
                  className="rounded-2xl border border-border bg-card p-3 shadow-soft sm:p-4"
                >
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h4 className="font-display text-sm font-bold text-foreground sm:text-base">
                        {n.mapel}
                      </h4>
                      <p className="text-[11px] text-muted-foreground sm:text-xs">
                        Tugas (30%) • UTS (30%) • UAS (40%)
                      </p>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
                      <div className="text-left sm:text-right">
                        <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">
                          Nilai Akhir
                        </p>
                        <p className="text-xl font-bold leading-none text-primary sm:text-2xl">
                          {n.akhir}
                        </p>
                      </div>
                      <Badge className={`${p.color}`}>{p.label} • {p.desc}</Badge>
                    </div>
                  </div>

                  <div
                    className={`grid gap-2 sm:gap-3 ${
                      komponen === "all" ? "sm:grid-cols-3" : "sm:grid-cols-1"
                    }`}
                  >
                    {showTugas && (
                      <KomponenCard
                        icon={ClipboardCheck} label="Tugas" bobot="30%"
                        nilai={n.tugas} highlight={komponen === "tugas"}
                      />
                    )}
                    {showUts && (
                      <KomponenCard
                        icon={FileText} label="UTS" bobot="30%"
                        nilai={n.uts} highlight={komponen === "uts"}
                      />
                    )}
                    {showUas && (
                      <KomponenCard
                        icon={BookOpen} label="UAS" bobot="40%"
                        nilai={n.uas} highlight={komponen === "uas"}
                      />
                    )}
                  </div>

                  <p className="mt-3 rounded-lg bg-muted/50 p-2 text-[11px] text-muted-foreground sm:text-xs">
                    <span className="font-semibold text-foreground">Deskripsi: </span>
                    {p.detail}
                  </p>
                </div>
              );
            })}

            {list.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Belum ada data nilai untuk filter ini.
              </p>
            )}
          </div>
        </div>

        {/* FOOTER navigasi mobile-friendly */}
        {siswaList.length > 1 && onSiswaChange && (
          <div className="flex items-center justify-between gap-2 border-t border-border bg-card px-4 py-3 sm:px-6">
            <Button
              type="button" variant="outline" size="sm"
              onClick={goPrev} className="flex-1 sm:flex-none"
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Sebelumnya
            </Button>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Gunakan ← / → untuk berpindah
            </span>
            <Button
              type="button" variant="outline" size="sm"
              onClick={goNext} className="flex-1 sm:flex-none"
            >
              Berikutnya <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
