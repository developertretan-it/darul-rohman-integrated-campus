import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface Props { title: string; subtitle?: string; }

export default function Placeholder({ title, subtitle }: Props) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} subtitle={subtitle ?? "Modul ini sedang disiapkan untuk integrasi Supabase real-time."} />
      <Card className="rounded-2xl border-dashed border-border bg-muted/30">
        <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Construction className="h-6 w-6" />
          </div>
          <p className="font-bold text-foreground">Segera tersedia</p>
          <p className="max-w-md text-sm text-muted-foreground">
            Halaman ini akan terhubung ke database Supabase pada tahap berikutnya.
            Tidak ada data dummy yang dipakai.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
