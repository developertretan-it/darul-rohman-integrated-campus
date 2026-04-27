import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUnit } from "@/context/UnitContext";
import { PageHeader } from "@/components/shared/StatCard";
import { BookOpen } from "lucide-react";

export default function Mapel() {
  const { data, info } = useUnit();

  return (
    <div className="space-y-6">
      <PageHeader title={`Mata Pelajaran ${info.short}`} subtitle={`${data.mapel.length} mata pelajaran tersedia`} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.mapel.map((m, i) => (
          <Card key={m} className="rounded-2xl border-0 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-md-soft" style={{ animation: `slideUp 0.3s ease-out ${i * 0.05}s both` }}>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-primary-foreground">
                <BookOpen className="h-6 w-6" />
              </div>
              <CardTitle className="font-display">{m}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Mata pelajaran inti pada jenjang {info.name}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Guru pengampu</span>
                <span className="font-semibold">{data.guru.find((g) => g.mapel === m)?.nama.split(",")[0] || "—"}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
