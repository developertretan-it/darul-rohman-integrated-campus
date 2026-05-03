import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap, BookOpen, Briefcase, MapPin, Phone, Mail,
  Sparkles, ArrowRight, LogIn, Building2, Heart,
} from "lucide-react";
import logo from "@/assets/logo-yayasan.png";

const UNIT_CARDS = [
  { key: "mi",  title: "MI Darul Rohman",  desc: "Madrasah Ibtidaiyah dengan kurikulum terpadu Al-Qur'an, akhlak, dan sains.", icon: BookOpen,    color: "gradient-primary", fitur: ["Tahfidz Harian", "Pendidikan Karakter", "Ekstrakurikuler"] },
  { key: "smp", title: "SMP Darul Rohman", desc: "Sekolah Menengah Pertama berbasis pesantren.",                                  icon: GraduationCap, color: "gradient-sky",     fitur: ["Bahasa Arab & Inggris", "Sains Terapan", "Kepemimpinan"] },
  { key: "smk", title: "SMK Darul Rohman", desc: "Sekolah Menengah Kejuruan dengan jurusan RPL & TKJ.",                          icon: Briefcase,    color: "gradient-gold",    fitur: ["RPL & TKJ", "Praktik Industri", "Sertifikasi Kompetensi"] },
];

export default function PublicHome() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white p-1 shadow-soft">
              <img src={logo} alt="Logo Yayasan Darul Rohman" className="h-full w-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-tight">Yayasan Darul Rohman</p>
              <p className="text-[11px] text-muted-foreground">Morombuh Kwanyar</p>
            </div>
          </Link>
          <Link to="/login">
            <Button className="gradient-primary text-primary-foreground shadow-soft hover:opacity-95">
              <LogIn className="mr-2 h-4 w-4" /> Login Admin
            </Button>
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden gradient-hero text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="animate-fade-in">
              <Badge className="mb-4 border-0 bg-secondary text-secondary-foreground">
                <Sparkles className="mr-1 h-3 w-3" /> Sistem Terpadu Pendidikan
              </Badge>
              <h1 className="font-display text-3xl font-bold leading-tight md:text-5xl">
                Membentuk Generasi Qur'ani, Cerdas & Berakhlak Mulia
              </h1>
              <p className="mt-5 max-w-xl text-base text-white/90 md:text-lg">
                Yayasan Darul Rohman Morombuh Kwanyar — Bangkalan, menyelenggarakan pendidikan
                Islam terpadu dari tingkat MI, SMP, hingga SMK.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#unit">
                  <Button size="lg" className="bg-secondary text-secondary-foreground shadow-gold hover:bg-secondary/90">
                    Jelajahi Unit <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <a href="#kontak">
                  <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
                    Hubungi Kami
                  </Button>
                </a>
              </div>
            </div>
            <div className="hidden justify-center lg:flex">
              <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
                <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-white p-4 shadow-md-soft">
                  <img src={logo} alt="Logo Yayasan" className="h-full w-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="unit" className="bg-muted/40 py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center">
            <Badge variant="outline" className="border-primary text-primary">Unit Pendidikan</Badge>
            <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">MI · SMP · SMK</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {UNIT_CARDS.map((u) => (
              <Card key={u.key} className="group rounded-2xl border-border shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-md-soft">
                <CardContent className="p-6">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${u.color} text-primary-foreground shadow-soft`}>
                    <u.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold">{u.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{u.desc}</p>
                  <ul className="mt-4 space-y-1.5 text-sm">
                    {u.fitur.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-foreground/85">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="kontak" className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Badge variant="outline" className="border-primary text-primary">Hubungi Kami</Badge>
            <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">Kontak Yayasan</h2>
            <div className="mt-6 space-y-3">
              <ContactRow icon={MapPin} label="Alamat" value="Morombuh, Kwanyar, Bangkalan, Madura, Jawa Timur" />
              <ContactRow icon={Phone} label="Telepon" value="+62 31 0000 0000" />
              <ContactRow icon={Mail} label="Email" value="info@darulrohman.id" />
              <ContactRow icon={Building2} label="Unit" value="MI · SMP · SMK Darul Rohman" />
            </div>
          </div>
          <Card className="rounded-2xl border-border bg-card shadow-soft">
            <CardContent className="p-6">
              <h3 className="font-display text-lg font-bold">Akses Sistem Admin</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Halaman dashboard, pengelolaan siswa, raport, dan CMS hanya tersedia untuk admin.
              </p>
              <Link to="/login">
                <Button className="mt-5 w-full gradient-primary text-primary-foreground shadow-soft">
                  <LogIn className="mr-2 h-4 w-4" /> Masuk ke Dashboard Admin
                </Button>
              </Link>
              <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
                <p className="flex items-center gap-2 font-semibold text-foreground">
                  <Heart className="h-3.5 w-3.5 text-destructive" /> Tertarik bergabung?
                </p>
                <p className="mt-1">Pendaftaran PPDB dilakukan langsung di kantor yayasan.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground md:flex-row md:px-6">
          <p>© {new Date().getFullYear()} Yayasan Darul Rohman Morombuh Kwanyar.</p>
          <p>Sistem Terpadu Pendidikan v1.0</p>
        </div>
      </footer>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
