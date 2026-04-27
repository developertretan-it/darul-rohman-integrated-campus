import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUnit } from "@/context/UnitContext";
import { PageHeader } from "@/components/shared/StatCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Nilai() {
  const { data, info } = useUnit();

  // Group by mapel for chart
  const byMapel = data.mapel.map((m) => {
    const all = data.nilai.filter((n) => n.mapel === m);
    const avg = all.length ? Math.round(all.reduce((a, b) => a + b.akhir, 0) / all.length) : 0;
    return { mapel: m, avg, count: all.length };
  });

  return (
    <div className="space-y-6">
      <PageHeader title={`Nilai Siswa ${info.short}`} subtitle="Penilaian tugas, UTS, UAS" />

      <Card className="rounded-2xl border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="font-display">Rata-rata per Mata Pelajaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {byMapel.map((row, i) => (
              <div key={row.mapel} style={{ animation: `slideUp 0.3s ease-out ${i * 0.05}s both` }}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-semibold">{row.mapel}</span>
                  <span className="font-mono font-bold text-primary">{row.avg}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full gradient-primary transition-all duration-700"
                    style={{ width: `${row.avg}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue={data.mapel[0]} className="w-full">
        <TabsList className="flex w-full flex-wrap justify-start gap-1 rounded-2xl bg-muted/40 p-1.5">
          {data.mapel.map((m) => (
            <TabsTrigger key={m} value={m} className="rounded-xl data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
              {m}
            </TabsTrigger>
          ))}
        </TabsList>
        {data.mapel.map((m) => (
          <TabsContent key={m} value={m}>
            <Card className="rounded-2xl border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="font-display">Detail Nilai {m}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Siswa</TableHead>
                        <TableHead className="text-center">Tugas</TableHead>
                        <TableHead className="text-center">UTS</TableHead>
                        <TableHead className="text-center">UAS</TableHead>
                        <TableHead className="text-center">Akhir</TableHead>
                        <TableHead>Predikat</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.nilai.filter((n) => n.mapel === m).map((n) => (
                        <TableRow key={n.id}>
                          <TableCell className="font-semibold">{n.siswa}</TableCell>
                          <TableCell className="text-center font-mono">{n.tugas}</TableCell>
                          <TableCell className="text-center font-mono">{n.uts}</TableCell>
                          <TableCell className="text-center font-mono">{n.uas}</TableCell>
                          <TableCell className="text-center">
                            <Badge className="gradient-primary text-primary-foreground">{n.akhir}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              n.akhir >= 90 ? "bg-success text-primary-foreground"
                                : n.akhir >= 80 ? "bg-secondary text-secondary-foreground"
                                  : n.akhir >= 70 ? "bg-accent text-accent-foreground"
                                    : "bg-warning text-secondary-foreground"
                            }>
                              {n.akhir >= 90 ? "A" : n.akhir >= 80 ? "B" : n.akhir >= 70 ? "C" : "D"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
