import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { MOCK_USERS, ROLE_LABEL, dashboardPathFor, MOCK_USERS as USERS } from "@/data/authMock";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn, ShieldCheck, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo-yayasan.png";
import { Link } from "react-router-dom";

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={dashboardPathFor(user.role, user.unit)} replace />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const res = login(username, password);
      if (res.ok) {
        const u = USERS.find((x) => x.username.toLowerCase() === username.toLowerCase());
        toast.success("Selamat datang!");
        nav(u ? dashboardPathFor(u.role, u.unit) : "/dashboard", { replace: true });
      } else {
        toast.error(res.message || "Login gagal");
      }
      setLoading(false);
    }, 400);
  };

  const quickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen w-full gradient-hero p-4 md:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-2">
        {/* Left brand */}
        <div className="hidden text-white lg:block">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-2 shadow-md-soft">
              <img src={logo} alt="Logo Yayasan" className="h-full w-full object-contain" />
            </div>
            <div>
              <Badge className="border-0 bg-secondary text-secondary-foreground">Sistem Terpadu</Badge>
              <h2 className="mt-2 font-display text-3xl font-bold leading-tight">
                Yayasan Darul Rohman
              </h2>
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
              {MOCK_USERS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => quickFill(u.username, u.password)}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-left transition-smooth hover:bg-white/15"
                >
                  <p className="font-bold text-secondary">{u.username}</p>
                  <p className="text-white/80">{ROLE_LABEL[u.role]}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right form */}
        <Card className="rounded-2xl border-0 shadow-md-soft">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-md-soft lg:hidden">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <CardTitle className="font-display text-2xl">Masuk ke Sistem</CardTitle>
            <p className="text-sm text-muted-foreground">Gunakan akun yang telah diberikan administrator</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="contoh: superadmin"
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full gradient-primary text-primary-foreground shadow-md-soft hover:opacity-95"
              >
                <LogIn className="mr-2 h-4 w-4" />
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            {/* Mobile demo accounts */}
            <div className="mt-4 rounded-xl bg-muted p-3 lg:hidden">
              <p className="mb-2 text-xs font-bold">Akun Demo:</p>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                {MOCK_USERS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => quickFill(u.username, u.password)}
                    className="rounded-md bg-card px-2 py-1.5 text-left shadow-soft"
                  >
                    <span className="font-bold text-primary">{u.username}</span>
                    <span className="ml-1 text-muted-foreground">/ {u.password}</span>
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
