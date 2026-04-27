import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUnit } from "@/context/UnitContext";
import { PageHeader } from "@/components/shared/StatCard";
import { Clock, MapPin, User } from "lucide-react";

const HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

export default function Jadwal() {
  const { data, info } = useUnit();

  return (
    <div className="space-y-6">
      <PageHeader title={`Jadwal Pelajaran ${info.short}`} subtitle="Jadwal mingguan seluruh mata pelajaran" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {HARI.map((hari, hi) => (
          <Card key={hari} className="rounded-2xl border-0 shadow-soft transition-smooth hover:shadow-md-soft" style={{ animation: `slideUp 0.3s ease-out ${hi * 0.05}s both` }}>
            <CardHeader className="gradient-primary rounded-t-2xl text-primary-foreground">
              <CardTitle className="font-display text-lg">{hari}</CardTitle>
              <p className="text-sm opacity-90">{data.jadwalHariIni.length} jam pelajaran</p>
            </CardHeader>
            <CardContent className="space-y-2 p-4">
              {data.jadwalHariIni.map((j, i) => (
                <div key={`${hari}-${j.id}`} className="rounded-xl border border-border/60 p-3 transition-smooth hover:border-primary/40">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-secondary text-secondary-foreground">
                      <Clock className="mr-1 h-3 w-3" />{j.jam.split(" ")[0]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">#{i + 1}</span>
                  </div>
                  <p className="mt-2 font-semibold">{j.mapel}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" />{j.guru.split(",")[0]}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{j.ruang}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
