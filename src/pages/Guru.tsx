import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUnit } from "@/context/UnitContext";
import { PageHeader, StatCard } from "@/components/shared/StatCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Phone, BookOpen, UserCog, Award } from "lucide-react";

export default function Guru() {
  const { data, info } = useUnit();

  return (
    <div className="space-y-6">
      <PageHeader title={`Guru & Staff ${info.short}`} subtitle={`${data.guru.length} pengajar aktif di ${info.name}`} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Guru" value={data.guru.length} icon={UserCog} variant="primary" />
        <StatCard label="Mata Pelajaran" value={data.mapel.length} icon={BookOpen} variant="secondary" />
        <StatCard label="Sertifikasi" value={`${Math.round(data.guru.length * 0.7)}`} icon={Award} variant="accent" hint="Guru bersertifikat" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.guru.map((g, i) => (
          <Card key={g.id} className="rounded-2xl border-0 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-md-soft" style={{ animation: `slideUp 0.3s ease-out ${i * 0.05}s both` }}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 ring-2 ring-secondary/40">
                  <AvatarFallback className="gradient-primary text-primary-foreground font-bold">
                    {g.nama.split(" ").slice(0, 2).map((s) => s[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{g.nama}</p>
                  <p className="text-xs text-muted-foreground">NIP {g.nip}</p>
                  <Badge className="mt-2 bg-secondary text-secondary-foreground">{g.mapel}</Badge>
                </div>
              </div>
              <div className="mt-4 space-y-2 border-t border-border/60 pt-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserCog className="h-4 w-4" />
                  <span>{g.jabatan}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{g.telp}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
