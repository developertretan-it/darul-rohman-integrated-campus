import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { dashboardPathFor } from "@/lib/units";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import logo from "@/assets/logo-yayasan.png";

const DEMO_ACCOUNTS = [
  { email: "superadmin@darulrohman.id", label: "Super Admin Yayasan" },
  { email: "mi@darulrohman.id",  label: "Admin MI" },
  { email: "smp@darulrohman.id", label: "Admin SMP" },
  { email: "smk@darulrohman.id", label: "Admin SMK" },
];

export default function Login() {
  const { user, role, profile, loading, signIn } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user && role) {
    return <Navigate to={dashboardPathFor(role, profile?.unit ?? null)} replace />;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await signIn(email.trim(), password);
    setSubmitting(false);
    if (res.ok) {
      toast.success("Selamat datang!");
      nav("/dashboard", { replace: true });
    } else {
      toast.error(res.message ?? "Login gagal");
    }
  };

  const quickFill = (em: string) => { setEmail(em); setPassword("admin123"); };

  return (
    <div className="relative min-h-screen w-full gradient-hero p-4 md:p-8">
      <Link to="/" className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur hover:bg-white/20 md:left-6 md:top-6">
        <ArrowLeft className="h-3.5 w-3.5" /> Beranda Yayasan
      </Link>
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-2">
        <div className="hidden text-white lg:block">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-2 shadow-md-soft">
              <img src={logo} alt="Logo Yayasan" className="h-full w-full object-contain" />
            </div>
            <div>
              <Badge className="border-0 bg-secondary text-secondary-foreground">Sistem Terpadu</Badge>
              <h2 className="mt-2 font-display text-3xl font-bold leading-tight">Yayasan Darul Rohman</h2>
              <p className="text-white/80">Morombuh Kwanyar — Bangkalan</p>
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight">
            Membentuk Generasi Qur'ani, Cerdas & Berakhlak Mulia
          </h1>
          <p className="mt-4 text-lg text-white/85">
            Platform terintegrasi untuk pengelolaan MI, SMP, dan SMK dalam satu sistem yang
            modern, aman, dan mudah digunakan.
          </p>
          <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <p className="mb-2 text-sm font-semibold">Akun Demo (klik untuk isi otomatis):</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {DEMO_ACCOUNTS.map((u) => (
                <button key={u.email} type="button" onClick={() => quickFill(u.email)}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-left transition-smooth hover:bg-white/15">
                  <p className="font-bold text-secondary">{u.email}</p>
                  <p className="text-white/80">{u.label}</p>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-white/70">Password seluruh akun demo: <b>admin123</b></p>
          </div>
        </div>

        <Card className="rounded-2xl border-0 shadow-md-soft">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-md-soft lg:hidden">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <CardTitle className="font-display text-2xl">Masuk ke Sistem</CardTitle>
            <p className="text-sm text-muted-foreground">Gunakan email administrator</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@darulrohman.id" required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPwd ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                    className="h-11 pr-10" />
                  <button type="button" onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={submitting}
                className="h-11 w-full gradient-primary text-primary-foreground shadow-md-soft hover:opacity-95">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                {submitting ? "Memproses..." : "Masuk"}
              </Button>
            </form>
            <div className="mt-4 rounded-xl bg-muted p-3 lg:hidden">
              <p className="mb-2 text-xs font-bold">Akun Demo (password: admin123):</p>
              <div className="grid gap-1.5 text-[11px]">
                {DEMO_ACCOUNTS.map((u) => (
                  <button key={u.email} type="button" onClick={() => quickFill(u.email)}
                    className="rounded-md bg-card px-2 py-1.5 text-left shadow-soft">
                    <span className="font-bold text-primary">{u.email}</span>
                    <span className="ml-2 text-muted-foreground">{u.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
