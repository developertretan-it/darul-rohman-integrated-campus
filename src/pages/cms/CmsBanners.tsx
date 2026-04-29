import { useState } from "react";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useCms } from "@/context/CmsContext";
import { CMSBanner } from "@/data/cmsMock";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const empty = (): CMSBanner => ({
  id: `ban${Date.now()}`,
  judul: "",
  subjudul: "",
  link: "/",
  aktif: true,
  warna: "primary",
});

const warnaToBg: Record<string, string> = {
  primary: "gradient-primary",
  secondary: "gradient-gold",
  accent: "gradient-sky",
};

export default function CmsBanners() {
  const { banners, saveBanner, deleteBanner, toggleBanner } = useCms();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CMSBanner>(empty());

  const openNew = () => { setDraft(empty()); setOpen(true); };
  const openEdit = (b: CMSBanner) => { setDraft(b); setOpen(true); };

  const submit = () => {
    if (!draft.judul.trim()) { toast.error("Judul wajib diisi"); return; }
    saveBanner(draft);
    setOpen(false);
    toast.success("Banner disimpan");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="CMS — Banner Homepage"
        subtitle="Kelola banner promosi yang tampil di halaman utama"
        action={
          <Button onClick={openNew} className="gradient-primary text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" /> Banner Baru
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {banners.map((b) => (
          <Card key={b.id} className={`overflow-hidden rounded-2xl border-0 shadow-soft ${b.aktif ? "" : "opacity-60"}`}>
            <div className={`relative h-40 ${warnaToBg[b.warna] ?? "gradient-primary"} p-6 text-white`}>
              <ImageIcon className="absolute right-4 top-4 h-6 w-6 opacity-30" />
              <h3 className="font-display text-xl font-bold">{b.judul}</h3>
              <p className="mt-1 text-sm text-white/90">{b.subjudul}</p>
              <p className="absolute bottom-4 left-6 text-xs text-white/70">→ {b.link}</p>
            </div>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Switch checked={b.aktif} onCheckedChange={() => toggleBanner(b.id)} />
                <span className="text-sm font-medium">{b.aktif ? "Aktif" : "Non-aktif"}</span>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => openEdit(b)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => { deleteBanner(b.id); toast.success("Banner dihapus"); }} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{draft.judul ? "Edit Banner" : "Banner Baru"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Judul</Label>
              <Input value={draft.judul} onChange={(e) => setDraft({ ...draft, judul: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Sub Judul</Label>
              <Input value={draft.subjudul} onChange={(e) => setDraft({ ...draft, subjudul: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Link Tujuan</Label>
              <Input value={draft.link} onChange={(e) => setDraft({ ...draft, link: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Warna</Label>
              <Select value={draft.warna} onValueChange={(v) => setDraft({ ...draft, warna: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Hijau</SelectItem>
                  <SelectItem value="secondary">Kuning</SelectItem>
                  <SelectItem value="accent">Biru</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={draft.aktif} onCheckedChange={(v) => setDraft({ ...draft, aktif: v })} />
              <Label>Aktifkan banner</Label>
            </div>
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
