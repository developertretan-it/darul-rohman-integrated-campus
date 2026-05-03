import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/StatCard";
import { useUnit } from "@/context/UnitContext";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { dbInsert, dbUpdate, dbDelete } from "@/lib/db";
import { Plus, Pencil, Trash2, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface Student { id: string; nama: string; nis: string | null; nisn: string | null; jenis_kelamin: string | null; alamat: string | null; nama_wali: string | null; telepon_wali: string | null; kelas_id: string | null; status: string; unit: string; tanggal_lahir: string | null; }

const empty = (unit: string): Partial<Student> => ({ nama: "", nis: "", nisn: "", jenis_kelamin: "L", alamat: "", nama_wali: "", telepon_wali: "", kelas_id: null, status: "aktif", unit });

export default function Siswa() {
  const { unit, info } = useUnit();
  const { data, refetch } = useSupabaseTable<Student>("students", { unit });
  const { data: classes } = useSupabaseTable<any>("classes", { unit });
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<any>(empty(unit));

  const filtered = data.filter((s) =>
    s.nama.toLowerCase().includes(q.toLowerCase()) || (s.nis ?? "").includes(q)
  );

  const openNew = () => { setDraft(empty(unit)); setOpen(true); };
  const openEdit = (s: Student) => { setDraft({ ...s }); setOpen(true); };

  const submit = async () => {
    if (!draft.nama?.trim()) return toast.error("Nama wajib diisi");
    try {
      const payload = { ...draft, unit, kelas_id: draft.kelas_id || null };
      if (draft.id) await dbUpdate("students", draft.id, payload);
      else await dbInsert("students", payload);
      toast.success("Tersimpan"); setOpen(false); refetch();
    } catch {}
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus siswa ini?")) return;
    await dbDelete("students", id); toast.success("Dihapus"); refetch();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Data Siswa ${info.short}`}
        subtitle={`${data.length} siswa terdaftar di ${info.name}`}
        action={<Button onClick={openNew} className="gradient-primary text-primary-foreground"><UserPlus className="mr-2 h-4 w-4" /> Tambah Siswa</Button>}
      />

      <Card className="rounded-2xl border-0 shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="font-display">Daftar Siswa</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari..." className="w-64 rounded-xl pl-10" />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NIS</TableHead><TableHead>Nama</TableHead><TableHead>Kelas</TableHead>
                <TableHead>L/P</TableHead><TableHead>Wali</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.nis ?? "-"}</TableCell>
                  <TableCell className="font-semibold">{s.nama}</TableCell>
                  <TableCell><Badge variant="outline">{classes.find((c) => c.id === s.kelas_id)?.nama ?? "-"}</Badge></TableCell>
                  <TableCell>{s.jenis_kelamin ?? "-"}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{s.nama_wali ?? "-"}</TableCell>
                  <TableCell><Badge className="bg-success text-primary-foreground">{s.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Belum ada siswa</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>{draft.id ? "Edit Siswa" : "Tambah Siswa"}</DialogTitle></DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nama"><Input value={draft.nama ?? ""} onChange={(e) => setDraft({ ...draft, nama: e.target.value })} /></Field>
            <Field label="NIS"><Input value={draft.nis ?? ""} onChange={(e) => setDraft({ ...draft, nis: e.target.value })} /></Field>
            <Field label="NISN"><Input value={draft.nisn ?? ""} onChange={(e) => setDraft({ ...draft, nisn: e.target.value })} /></Field>
            <Field label="Jenis Kelamin">
              <Select value={draft.jenis_kelamin ?? "L"} onValueChange={(v) => setDraft({ ...draft, jenis_kelamin: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="L">Laki-laki</SelectItem><SelectItem value="P">Perempuan</SelectItem></SelectContent>
              </Select>
            </Field>
            <Field label="Kelas">
              <Select value={draft.kelas_id ?? "none"} onValueChange={(v) => setDraft({ ...draft, kelas_id: v === "none" ? null : v })}>
                <SelectTrigger><SelectValue placeholder="Pilih kelas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">- Tidak ada -</SelectItem>
                  {classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.nama}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Tanggal Lahir"><Input type="date" value={draft.tanggal_lahir ?? ""} onChange={(e) => setDraft({ ...draft, tanggal_lahir: e.target.value || null })} /></Field>
            <Field label="Nama Wali"><Input value={draft.nama_wali ?? ""} onChange={(e) => setDraft({ ...draft, nama_wali: e.target.value })} /></Field>
            <Field label="Telepon Wali"><Input value={draft.telepon_wali ?? ""} onChange={(e) => setDraft({ ...draft, telepon_wali: e.target.value })} /></Field>
            <div className="sm:col-span-2"><Field label="Alamat"><Input value={draft.alamat ?? ""} onChange={(e) => setDraft({ ...draft, alamat: e.target.value })} /></Field></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={submit} className="gradient-primary text-primary-foreground">Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
