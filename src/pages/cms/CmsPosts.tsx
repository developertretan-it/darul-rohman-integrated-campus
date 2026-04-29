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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useCms } from "@/context/CmsContext";
import { CMSPost, PostStatus } from "@/data/cmsMock";
import { useAuth } from "@/context/AuthContext";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

const empty = (penulis: string): CMSPost => ({
  id: `post${Date.now()}`,
  judul: "",
  kategori: "Pengumuman",
  isi: "",
  penulis,
  status: "draft",
  tanggal: new Date().toISOString().slice(0, 10),
});

export default function CmsPosts() {
  const { posts, savePost, deletePost } = useCms();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<CMSPost | null>(null);
  const [draft, setDraft] = useState<CMSPost>(empty(user?.nama ?? "Admin"));
  const [filter, setFilter] = useState<"all" | PostStatus>("all");

  const list = posts.filter((p) => filter === "all" || p.status === filter);

  const openNew = () => { setDraft(empty(user?.nama ?? "Admin")); setOpen(true); };
  const openEdit = (p: CMSPost) => { setDraft(p); setOpen(true); };

  const submit = () => {
    if (!draft.judul.trim() || !draft.isi.trim()) {
      toast.error("Judul dan isi wajib diisi");
      return;
    }
    savePost(draft);
    setOpen(false);
    toast.success(draft.status === "published" ? "Konten dipublikasikan" : "Draft disimpan");
  };

  const remove = (id: string) => {
    deletePost(id);
    toast.success("Konten dihapus");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="CMS — Pengumuman & Berita"
        subtitle="Kelola konten yang ditampilkan di website yayasan"
        action={
          <Button onClick={openNew} className="gradient-primary text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" /> Konten Baru
          </Button>
        }
      />

      <div className="flex gap-2">
        {(["all", "published", "draft"] as const).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
            className={filter === f ? "gradient-primary text-primary-foreground" : ""}
          >
            {f === "all" ? "Semua" : f === "published" ? "Terbit" : "Draft"}
            <Badge variant="secondary" className="ml-2">
              {f === "all" ? posts.length : posts.filter((p) => p.status === f).length}
            </Badge>
          </Button>
        ))}
      </div>

      <Card className="rounded-2xl border-0 shadow-soft">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Penulis</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.judul}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{p.kategori}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.penulis}</TableCell>
                  <TableCell className="text-sm">{p.tanggal}</TableCell>
                  <TableCell>
                    <Badge className={p.status === "published" ? "bg-success text-primary-foreground" : "bg-muted text-foreground"}>
                      {p.status === "published" ? "Terbit" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => setPreview(p)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => openEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(p.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {list.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    Belum ada konten
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Editor */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{draft.judul ? "Edit Konten" : "Konten Baru"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Judul</Label>
              <Input value={draft.judul} onChange={(e) => setDraft({ ...draft, judul: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={draft.kategori} onValueChange={(v) => setDraft({ ...draft, kategori: v as CMSPost["kategori"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pengumuman">Pengumuman</SelectItem>
                    <SelectItem value="Berita">Berita</SelectItem>
                    <SelectItem value="Artikel">Artikel</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>
            <div className="space-y-2">
              <Label>Isi Konten</Label>
              <Textarea rows={8} value={draft.isi} onChange={(e) => setDraft({ ...draft, isi: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={submit} className="gradient-primary text-primary-foreground">Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview */}
      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{preview?.judul}</DialogTitle>
          </DialogHeader>
          {preview && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">{preview.kategori}</Badge>
                <span>•</span>
                <span>{preview.penulis}</span>
                <span>•</span>
                <span>{preview.tanggal}</span>
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed">{preview.isi}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
