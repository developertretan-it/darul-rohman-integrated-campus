import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/ThemeContext";
import { UnitProvider } from "@/context/UnitContext";
import { AuthProvider } from "@/context/AuthContext";
import { CmsProvider } from "@/context/CmsContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Siswa from "./pages/Siswa";
import Jadwal from "./pages/Jadwal";
import Absensi from "./pages/Absensi";
import Nilai from "./pages/Nilai";
import Mapel from "./pages/Mapel";
import Keuangan from "./pages/Keuangan";
import Guru from "./pages/Guru";
import PPDB from "./pages/PPDB";
import Yayasan from "./pages/Yayasan";
import CmsPosts from "./pages/cms/CmsPosts";
import CmsBanners from "./pages/cms/CmsBanners";
import CmsPages from "./pages/cms/CmsPages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <UnitProvider>
          <CmsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/siswa" element={<Siswa />} />
                      <Route path="/jadwal" element={<Jadwal />} />
                      <Route path="/absensi" element={<Absensi />} />
                      <Route path="/nilai" element={<Nilai />} />
                      <Route path="/mapel" element={<Mapel />} />
                      <Route path="/keuangan" element={<Keuangan />} />
                      <Route path="/guru" element={<Guru />} />
                      <Route path="/ppdb" element={<PPDB />} />
                    </Route>
                  </Route>
                  {/* Super admin only */}
                  <Route element={<ProtectedRoute roles={["super_admin"]} />}>
                    <Route element={<DashboardLayout />}>
                      <Route path="/yayasan" element={<Yayasan />} />
                      <Route path="/cms/posts" element={<CmsPosts />} />
                      <Route path="/cms/banners" element={<CmsBanners />} />
                      <Route path="/cms/pages" element={<CmsPages />} />
                    </Route>
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CmsProvider>
        </UnitProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
