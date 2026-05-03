import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/StatCard";
import { useUnit } from "@/context/UnitContext";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { dbInsert, dbUpdate, dbDelete } from "@/lib/db";
import { Plus, Pencil, Trash2, Phone, Mail, UserCog } from "lucide-react";
import { toast } from "sonner";

const empty = (unit: string) => ({ nama: "", nip: "", jabatan: "", mapel_utama: "", telepon: "", email: "", unit });

export default function Guru() {
  const { unit, info } = useUnit();
  const { data, refetch } = useSupabaseTable<any>("teachers", { unit });
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<any>(empty(unit));

  const submit = async () => {
    if (!draft.nama?.trim()) return toast.error("Nama wajib diisi");
    const payload = { ...draft, unit };
    if (draft.id) await dbUpdate("teachers", draft.id, payload);
    else await dbInsert("teachers", payload);
    toast.success("Tersimpan"); setOpen(false); refetch();
  };

  return (
    <div className="space-y-6">
      <PageHeader title={`Guru & Staff ${info.short}`} subtitle={`${data.length} guru terdaftar`} action={
        <Button onClick={() => { setDraft(empty(unit)); setOpen(true); }} className="gradient-primary text-primary-foreground"><Plus className="mr-2 h-4 w-4" /> Tambah Guru</Button>
      } />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((g) => (
          <Card key={g.id} className="rounded-2xl border-0 shadow-soft">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 ring-2 ring-secondary/40">
                  <AvatarFallback className="gradient-primary font-bold text-primary-foreground">{g.nama.split(" ").slice(0, 2).map((s: string) => s[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{g.nama}</p>
                  <p className="text-xs text-muted-foreground">NIP {g.nip ?? "-"}</p>
                  {g.mapel_utama && <Badge className="mt-2 bg-secondary text-secondary-foreground">{g.mapel_utama}</Badge>}
                </div>
              </div>
              <div className="mt-4 space-y-2 border-t border-border/60 pt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><UserCog className="h-4 w-4" />{g.jabatan ?? "-"}</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" />{g.telepon ?? "-"}</div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4" />{g.email ?? "-"}</div>
              </div>
              <div className="mt-3 flex gap-1">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => { setDraft(g); setOpen(true); }}><Pencil className="mr-1 h-3.5 w-3.5" /> Edit</Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={async () => { if (confirm("Hapus?")) { await dbDelete("teachers", g.id); refetch(); } }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {data.length === 0 && <p className="col-span-full py-12 text-center text-muted-foreground">Belum ada guru</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{draft.id ? "Edit" : "Tambah"} Guru</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            {[["nama", "Nama"], ["nip", "NIP"], ["jabatan", "Jabatan"], ["mapel_utama", "Mapel Utama"], ["telepon", "Telepon"], ["email", "Email"]].map(([k, l]) => (
              <div key={k} className="space-y-1.5"><Label>{l}</Label><Input value={draft[k] ?? ""} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} /></div>
            ))}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Batal</Button><Button onClick={submit} className="gradient-primary text-primary-foreground">Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
