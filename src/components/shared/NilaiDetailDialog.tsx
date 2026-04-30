import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Award, BookOpen, ClipboardCheck, FileText, GraduationCap } from "lucide-react";
import type { Nilai } from "@/data/mockData";

export interface PredikatInfo {
  label: string;
  desc: string;
  color: string;
  /** Penjelasan naratif untuk ditampilkan di modal */
  detail: string;
}

export const predikatDetail = (n: number): PredikatInfo => {
  if (n >= 90)
    return {
      label: "A",
      desc: "Sangat Baik",
      color: "bg-success text-white",
      detail:
        "Siswa menunjukkan penguasaan kompetensi yang sangat baik, mampu menerapkan konsep secara mandiri dan konsisten di atas standar.",
    };
  if (n >= 80)
    return {
      label: "B",
      desc: "Baik",
      color: "bg-primary text-primary-foreground",
      detail:
        "Siswa telah memenuhi seluruh kompetensi dasar dengan baik dan mampu menyelesaikan tugas sesuai standar yang ditetapkan.",
    };
  if (n >= 70)
    return {
      label: "C",
      desc: "Cukup",
      color: "bg-accent text-accent-foreground",
      detail:
        "Siswa sudah mencapai standar minimal namun masih perlu latihan tambahan pada beberapa indikator untuk meningkatkan pemahaman.",
    };
  return {
    label: "D",
    desc: "Perlu Bimbingan",
    color: "bg-destructive text-white",
    detail:
      "Siswa belum mencapai standar minimal. Disarankan mengikuti program remedial dan pendampingan khusus dari guru mata pelajaran.",
  };
};

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Nama siswa yang dipilih */
  siswa: string | null;
  /** Mapel yang difokuskan (jika dibuka dari satu baris). Kosongkan untuk lihat semua. */
  fokusMapel?: string | null;
  /** Semua nilai siswa terpilih */
  nilai: Nilai[];
  unitShort: string;
  kelas?: string;
}

const Komponen = ({
  icon: Icon,
  label,
  bobot,
  nilai,
}: {
  icon: any;
  label: string;
  bobot: string;
  nilai: number;
}) => (
  <div className="rounded-xl border border-border bg-muted/40 p-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">{label}</span>
      </div>
      <Badge variant="outline" className="text-[10px]">
        Bobot {bobot}
      </Badge>
    </div>
    <div className="mt-2 flex items-end justify-between">
      <Progress value={nilai} className="mr-3 h-2" />
      <span className="min-w-[2.5rem] text-right text-lg font-bold text-primary">{nilai}</span>
    </div>
  </div>
);

export function NilaiDetailDialog({
  open, onOpenChange, siswa, fokusMapel, nilai, unitShort, kelas,
}: Props) {
  if (!siswa) return null;

  const list = fokusMapel ? nilai.filter((n) => n.mapel === fokusMapel) : nilai;
  const rata = list.length
    ? Math.round(list.reduce((a, b) => a + b.akhir, 0) / list.length)
    : 0;
  const pred = predikatDetail(rata);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[60] max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="font-display text-xl">{siswa}</DialogTitle>
              <DialogDescription className="mt-1">
                Detail nilai {fokusMapel ? `mata pelajaran ${fokusMapel}` : "seluruh mata pelajaran"}
                {kelas ? ` • Kelas ${kelas}` : ""} • Unit {unitShort}
              </DialogDescription>
            </div>
            <Badge className={`${pred.color} shrink-0`}>
              <Award className="mr-1 h-3.5 w-3.5" />
              {pred.label} • {rata}
            </Badge>
          </div>
        </DialogHeader>

        {/* Ringkasan predikat */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <GraduationCap className="h-4 w-4" />
            Predikat: {pred.label} ({pred.desc})
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{pred.detail}</p>
        </div>

        <Separator />

        {/* Daftar mapel + komponen */}
        <div className="space-y-4">
          {list.map((n) => {
            const p = predikatDetail(n.akhir);
            return (
              <div
                key={n.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-soft"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-display text-base font-bold text-foreground">{n.mapel}</h4>
                    <p className="text-xs text-muted-foreground">
                      Komponen penilaian: Tugas (30%) • UTS (30%) • UAS (40%)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-muted-foreground">Nilai Akhir</p>
                    <p className="text-2xl font-bold text-primary leading-none">{n.akhir}</p>
                    <Badge className={`${p.color} mt-1`}>{p.label} • {p.desc}</Badge>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Komponen icon={ClipboardCheck} label="Tugas" bobot="30%" nilai={n.tugas} />
                  <Komponen icon={FileText} label="UTS" bobot="30%" nilai={n.uts} />
                  <Komponen icon={BookOpen} label="UAS" bobot="40%" nilai={n.uas} />
                </div>

                <p className="mt-3 rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Deskripsi: </span>
                  {p.detail}
                </p>
              </div>
            );
          })}

          {list.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Belum ada data nilai.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
