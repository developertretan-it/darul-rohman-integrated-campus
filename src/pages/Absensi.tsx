import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, StatCard } from "@/components/shared/StatCard";
import { useUnit } from "@/context/UnitContext";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { dbInsert, dbUpdate, dbDelete } from "@/lib/db";
import { Plus, Pencil, Trash2, CheckCircle2, AlertCircle, Heart, XCircle } from "lucide-react";
import { toast } from "sonner";

const STATUSES = ["hadir", "izin", "sakit", "alpha"] as const;
const empty = (unit: string) => ({ student_id: "", tanggal: new Date().toISOString().slice(0, 10), status: "hadir", catatan: "", unit });

export default function Absensi() {
  const { unit, info } = useUnit();
  const { data, refetch } = useSupabaseTable<any>("attendance", { unit });
  const { data: students } = useSupabaseTable<any>("students", { unit });
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<any>(empty(unit));

  const stat = (s: string) => data.filter((x) => x.status === s).length;
  const submit = async () => {
    if (!draft.student_id) return toast.error("Pilih siswa");
    const payload = { ...draft, unit };
    if (draft.id) await dbUpdate("attendance", draft.id, payload);
    else await dbInsert("attendance", payload);
    toast.success("Tersimpan"); setOpen(false); refetch();
  };

  return (
    <div className="space-y-6">
      <PageHeader title={`Absensi ${info.short}`} subtitle={`${data.length} catatan`} action={
        <Button onClick={() => { setDraft(empty(unit)); setOpen(true); }} className="gradient-primary text-primary-foreground"><Plus className="mr-2 h-4 w-4" /> Catat Kehadiran</Button>
      } />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Hadir" value={stat("hadir")} icon={CheckCircle2} variant="primary" />
        <StatCard label="Izin" value={stat("izin")} icon={AlertCircle} variant="accent" />
        <StatCard label="Sakit" value={stat("sakit")} icon={Heart} variant="secondary" />
        <StatCard label="Alpha" value={stat("alpha")} icon={XCircle} />
      </div>

      <Card className="rounded-2xl border-0 shadow-soft">
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Tanggal</TableHead><TableHead>Siswa</TableHead><TableHead>Status</TableHead><TableHead>Catatan</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
            <TableBody>
              {data.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-mono text-xs">{a.tanggal}</TableCell>
                  <TableCell className="font-semibold">{students.find(s => s.id === a.student_id)?.nama ?? "-"}</TableCell>
                  <TableCell><Badge className={a.status === "hadir" ? "bg-success text-primary-foreground" : a.status === "izin" ? "bg-accent text-accent-foreground" : a.status === "sakit" ? "bg-warning text-secondary-foreground" : "bg-destructive text-destructive-foreground"}>{a.status}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.catatan ?? "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => { setDraft(a); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={async () => { if (confirm("Hapus?")) { await dbDelete("attendance", a.id); refetch(); } }}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">Belum ada absensi</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{draft.id ? "Edit" : "Catat"} Absensi</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Siswa</Label>
              <Select value={draft.student_id} onValueChange={(v) => setDraft({ ...draft, student_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih siswa" /></SelectTrigger>
                <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.nama}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Tanggal</Label><Input type="date" value={draft.tanggal} onChange={(e) => setDraft({ ...draft, tanggal: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Status</Label>
                <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5"><Label>Catatan</Label><Input value={draft.catatan ?? ""} onChange={(e) => setDraft({ ...draft, catatan: e.target.value })} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Batal</Button><Button onClick={submit} className="gradient-primary text-primary-foreground">Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
