import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/StatCard";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { dbInsert, dbUpdate, dbDelete } from "@/lib/db";
import { uploadFile } from "@/lib/storage";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const empty = () => ({ title: "", slug: "", excerpt: "", content: "", category: "berita", status: "draft", audience: "public", unit: "", cover_url: "" });

export default function CmsPosts() {
  const { data, refetch } = useSupabaseTable<any>("cms_posts");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<any>(empty());

  const submit = async () => {
    if (!draft.title?.trim()) return toast.error("Judul wajib");
    const payload = { ...draft, slug: draft.slug || slugify(draft.title), unit: draft.unit || null };
    if (draft.id) await dbUpdate("cms_posts", draft.id, payload);
    else await dbInsert("cms_posts", payload);
    toast.success("Tersimpan"); setOpen(false); refetch();
  };

  const onUpload = async (f: File) => {
    try { const { publicUrl } = await uploadFile("cms-media", f, "covers"); setDraft({ ...draft, cover_url: publicUrl }); toast.success("Cover terupload"); } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="CMS — Berita & Pengumuman" subtitle={`${data.length} konten`} action={
        <Button onClick={() => { setDraft(empty()); setOpen(true); }} className="gradient-primary text-primary-foreground"><Plus className="mr-2 h-4 w-4" /> Konten Baru</Button>
      } />

      <Card className="rounded-2xl border-0 shadow-soft">
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Judul</TableHead><TableHead>Kategori</TableHead><TableHead>Audience</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
            <TableBody>
              {data.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell><Badge variant="outline">{p.category ?? "-"}</Badge></TableCell>
                  <TableCell className="text-xs">{p.audience} {p.unit ? `(${p.unit})` : ""}</TableCell>
                  <TableCell><Badge className={p.status === "published" ? "bg-success text-primary-foreground" : "bg-muted text-foreground"}>{p.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => { setDraft(p); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={async () => { if (confirm("Hapus?")) { await dbDelete("cms_posts", p.id); refetch(); } }}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">Belum ada konten</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{draft.id ? "Edit" : "Buat"} Konten</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Judul</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value, slug: draft.slug || slugify(e.target.value) })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Slug</Label><Input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })} /></div>
              <div className="space-y-1.5"><Label>Kategori</Label>
                <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="pengumuman">Pengumuman</SelectItem><SelectItem value="berita">Berita</SelectItem><SelectItem value="artikel">Artikel</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Status</Label>
                <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Unit (opsional)</Label>
                <Select value={draft.unit || "all"} onValueChange={(v) => setDraft({ ...draft, unit: v === "all" ? "" : v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="all">Semua</SelectItem><SelectItem value="mi">MI</SelectItem><SelectItem value="smp">SMP</SelectItem><SelectItem value="smk">SMK</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5"><Label>Cover</Label>
              <div className="flex items-center gap-2">
                <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
                {draft.cover_url && <img src={draft.cover_url} alt="" className="h-10 w-16 rounded object-cover" />}
              </div>
            </div>
            <div className="space-y-1.5"><Label>Excerpt</Label><Textarea rows={2} value={draft.excerpt ?? ""} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Konten</Label><Textarea rows={8} value={draft.content ?? ""} onChange={(e) => setDraft({ ...draft, content: e.target.value })} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Batal</Button><Button onClick={submit} className="gradient-primary text-primary-foreground">Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
