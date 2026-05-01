import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCms } from "@/context/CmsContext";
import {
  GraduationCap, BookOpen, Briefcase, Megaphone, Newspaper, MapPin, Phone, Mail,
  Sparkles, ArrowRight, LogIn, Building2, Heart,
} from "lucide-react";
import logo from "@/assets/logo-yayasan.png";

const UNIT_CARDS = [
  {
    key: "mi",
    title: "MI Darul Rohman",
    desc: "Madrasah Ibtidaiyah dengan kurikulum terpadu Al-Qur'an, akhlak, dan sains untuk usia 6–12 tahun.",
    icon: BookOpen,
    color: "gradient-primary",
    fitur: ["Tahfidz Harian", "Pendidikan Karakter", "Ekstrakurikuler"],
  },
  {
    key: "smp",
    title: "SMP Darul Rohman",
    desc: "Sekolah Menengah Pertama berbasis pesantren, mempersiapkan siswa siap akademis dan religius.",
    icon: GraduationCap,
    color: "gradient-sky",
    fitur: ["Bahasa Arab & Inggris", "Sains Terapan", "Kepemimpinan"],
  },
  {
    key: "smk",
    title: "SMK Darul Rohman",
    desc: "Sekolah Menengah Kejuruan dengan jurusan RPL & TKJ, link & match dengan industri.",
    icon: Briefcase,
    color: "gradient-gold",
    fitur: ["RPL & TKJ", "Praktik Industri", "Sertifikasi Kompetensi"],
  },
];

export default function PublicHome() {
  const { posts, pages } = useCms();
  const published = posts.filter((p) => p.status === "published");
  const pengumuman = published.filter((p) => p.kategori === "Pengumuman").slice(0, 3);
  const berita = published.filter((p) => p.kategori !== "Pengumuman").slice(0, 6);
  const tentang = pages.find((p) => p.slug === "tentang" && p.status === "published");
  const visiMisi = pages.find((p) => p.slug === "visi-misi" && p.status === "published");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Topbar publik */}
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
          <nav className="hidden items-center gap-1 md:flex">
            <a href="#tentang" className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">Tentang</a>
            <a href="#unit" className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">Unit</a>
            <a href="#pengumuman" className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">Pengumuman</a>
            <a href="#berita" className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">Berita</a>
            <a href="#kontak" className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">Kontak</a>
          </nav>
          <Link to="/login">
            <Button className="gradient-primary text-primary-foreground shadow-soft hover:opacity-95">
              <LogIn className="mr-2 h-4 w-4" /> Login Admin
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
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

      {/* Tentang */}
      <section id="tentang" className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <Badge variant="outline" className="border-primary text-primary">Profil Yayasan</Badge>
            <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">Tentang Kami</h2>
            <p className="mt-3 text-muted-foreground">
              Lembaga pendidikan Islam terpadu yang berkomitmen pada akhlak, akademik, dan keterampilan.
            </p>
          </div>
          <Card className="rounded-2xl border-border shadow-soft lg:col-span-2">
            <CardContent className="space-y-4 p-6">
              {tentang ? (
                <p className="leading-relaxed text-foreground/90">{tentang.isi}</p>
              ) : (
                <p className="leading-relaxed text-foreground/90">
                  Yayasan Darul Rohman Morombuh Kwanyar didirikan untuk menyebarkan pendidikan
                  Islam berkualitas di wilayah Bangkalan, Madura.
                </p>
              )}
              {visiMisi && (
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-sm font-bold text-primary">{visiMisi.judul}</p>
                  <p className="mt-2 whitespace-pre-line text-sm text-foreground/90">{visiMisi.isi}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Unit */}
      <section id="unit" className="bg-muted/40 py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center">
            <Badge variant="outline" className="border-primary text-primary">Unit Pendidikan</Badge>
            <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">MI · SMP · SMK</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              Tiga jenjang pendidikan dalam satu yayasan — selaras visi qur'ani dan kompetensi modern.
            </p>
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

      {/* Pengumuman */}
      <section id="pengumuman" className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <Badge variant="outline" className="border-secondary text-secondary-foreground">
              <Megaphone className="mr-1 h-3 w-3" /> CMS Real-time
            </Badge>
            <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">Pengumuman Terbaru</h2>
          </div>
        </div>
        {pengumuman.length === 0 ? (
          <EmptyPublic title="Belum ada pengumuman" desc="Silakan cek kembali nanti." />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {pengumuman.map((p) => (
              <article key={p.id} className="rounded-2xl border-l-4 border-secondary bg-secondary/10 p-5 shadow-soft">
                <p className="text-xs font-medium text-muted-foreground">{p.tanggal}</p>
                <h3 className="mt-1 font-bold text-foreground">{p.judul}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-foreground/85">{p.isi}</p>
                <p className="mt-3 text-xs text-muted-foreground">— {p.penulis}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Berita */}
      <section id="berita" className="bg-muted/40 py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-6">
            <Badge variant="outline" className="border-primary text-primary">
              <Newspaper className="mr-1 h-3 w-3" /> Kabar Yayasan
            </Badge>
            <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">Berita & Artikel</h2>
          </div>
          {berita.length === 0 ? (
            <EmptyPublic title="Belum ada berita" desc="Konten baru akan otomatis tampil ketika diterbitkan oleh admin." />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {berita.map((p) => (
                <Card key={p.id} className="rounded-2xl border-border shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-md-soft">
                  <CardContent className="space-y-2 p-5">
                    <Badge className="bg-accent text-accent-foreground">{p.kategori}</Badge>
                    <h3 className="font-display text-lg font-bold leading-snug">{p.judul}</h3>
                    <p className="line-clamp-3 text-sm text-muted-foreground">{p.isi}</p>
                    <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                      <span>{p.penulis}</span>
                      <span>{p.tanggal}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Kontak */}
      <section id="kontak" className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Badge variant="outline" className="border-primary text-primary">Hubungi Kami</Badge>
            <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">Kontak Yayasan</h2>
            <p className="mt-3 text-muted-foreground">
              Silakan hubungi kami untuk informasi pendaftaran, kerjasama, atau pertanyaan lainnya.
            </p>
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
                Halaman dashboard, pengelolaan siswa, raport, dan CMS hanya tersedia untuk admin yayasan dan unit.
              </p>
              <Link to="/login">
                <Button className="mt-5 w-full gradient-primary text-primary-foreground shadow-soft">
                  <LogIn className="mr-2 h-4 w-4" /> Masuk ke Dashboard Admin
                </Button>
              </Link>
              <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
                <p className="flex items-center gap-2 font-semibold text-foreground">
                  <Heart className="h-3.5 w-3.5 text-destructive" /> Tertarik bergabung sebagai siswa?
                </p>
                <p className="mt-1">Pendaftaran PPDB dilakukan langsung di kantor yayasan atau melalui kontak di samping.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
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

function EmptyPublic({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
      <p className="font-bold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
