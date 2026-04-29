import { useState } from "react";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useCms } from "@/context/CmsContext";
import { CMSPage, PostStatus } from "@/data/cmsMock";
import { Plus, Pencil, Trash2, Eye, FilePen } from "lucide-react";
import { toast } from "sonner";

const empty = (): CMSPage => ({
  id: `pg${Date.now()}`,
  slug: "halaman-baru",
  judul: "",
  isi: "",
  status: "draft",
  updatedAt: new Date().toISOString().slice(0, 10),
});

export default function CmsPages() {
  const { pages, savePage, deletePage } = useCms();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<CMSPage | null>(null);
  const [draft, setDraft] = useState<CMSPage>(empty());

  const openNew = () => { setDraft(empty()); setOpen(true); };
  const openEdit = (p: CMSPage) => { setDraft(p); setOpen(true); };

  const submit = () => {
    if (!draft.judul.trim() || !draft.isi.trim()) { toast.error("Judul dan isi wajib diisi"); return; }
    savePage({ ...draft, updatedAt: new Date().toISOString().slice(0, 10) });
    setOpen(false);
    toast.success("Halaman disimpan");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="CMS — Halaman Konten"
        subtitle="Kelola halaman statis: Tentang, Visi & Misi, Profil Sekolah"
        action={
          <Button onClick={openNew} className="gradient-primary text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" /> Halaman Baru
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((p) => (
          <Card key={p.id} className="rounded-2xl border-0 shadow-soft hover-lift">
            <CardContent className="p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FilePen className="h-5 w-5" />
                </div>
                <Badge className={p.status === "published" ? "bg-success text-primary-foreground" : "bg-muted text-foreground"}>
                  {p.status === "published" ? "Terbit" : "Draft"}
                </Badge>
              </div>
              <h3 className="font-bold">{p.judul}</h3>
              <p className="mt-1 text-xs text-muted-foreground">/{p.slug}</p>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.isi}</p>
              <p className="mt-3 text-xs text-muted-foreground">Diperbarui: {p.updatedAt}</p>
              <div className="mt-4 flex gap-1">
                <Button size="sm" variant="outline" onClick={() => setPreview(p)} className="flex-1">
                  <Eye className="mr-1 h-3.5 w-3.5" /> Preview
                </Button>
                <Button size="icon" variant="ghost" onClick={() => openEdit(p)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => { deletePage(p.id); toast.success("Halaman dihapus"); }} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{draft.judul ? "Edit Halaman" : "Halaman Baru"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Judul</Label>
                <Input value={draft.judul} onChange={(e) => setDraft({ ...draft, judul: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Slug URL</Label>
                <Input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v as PostStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Publish</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Konten Halaman</Label>
              <Textarea rows={10} value={draft.isi} onChange={(e) => setDraft({ ...draft, isi: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={submit} className="gradient-primary text-primary-foreground">Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{preview?.judul}</DialogTitle></DialogHeader>
          {preview && (
            <div className="space-y-3">
              <Badge variant="outline">/{preview.slug}</Badge>
              <p className="whitespace-pre-line text-sm leading-relaxed">{preview.isi}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
