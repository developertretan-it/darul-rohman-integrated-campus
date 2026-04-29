export type PostStatus = "draft" | "published";

export interface CMSPost {
  id: string;
  judul: string;
  kategori: "Pengumuman" | "Berita" | "Artikel";
  isi: string;
  penulis: string;
  status: PostStatus;
  tanggal: string;
  thumbnail?: string;
}

export interface CMSBanner {
  id: string;
  judul: string;
  subjudul: string;
  link: string;
  aktif: boolean;
  warna: string;
}

export interface CMSPage {
  id: string;
  slug: string;
  judul: string;
  isi: string;
  status: PostStatus;
  updatedAt: string;
}

export const INITIAL_POSTS: CMSPost[] = [
  {
    id: "post1",
    judul: "Pembukaan PPDB Tahun Ajaran 2025/2026",
    kategori: "Pengumuman",
    isi: "Yayasan Darul Rohman membuka pendaftaran peserta didik baru untuk seluruh unit pendidikan: MI, SMP, dan SMK. Pendaftaran dibuka mulai 1 Mei hingga 30 Juni 2025.",
    penulis: "K.H. Abdul Rohman",
    status: "published",
    tanggal: "2025-04-25",
  },
  {
    id: "post2",
    judul: "Prestasi Tahfidz Santri MI",
    kategori: "Berita",
    isi: "Alhamdulillah, 12 santri MI Darul Rohman berhasil menyelesaikan hafalan 5 juz Al-Qur'an pada semester ini.",
    penulis: "Ust. Hasan Basri",
    status: "published",
    tanggal: "2025-04-20",
  },
  {
    id: "post3",
    judul: "Workshop Coding SMK",
    kategori: "Berita",
    isi: "SMK Darul Rohman jurusan RPL mengadakan workshop pemrograman web modern bersama praktisi industri.",
    penulis: "Andi Pratama, M.Kom",
    status: "draft",
    tanggal: "2025-04-22",
  },
  {
    id: "post4",
    judul: "Kegiatan Bakti Sosial Yayasan",
    kategori: "Artikel",
    isi: "Seluruh civitas Yayasan Darul Rohman mengadakan bakti sosial di Desa Morombuh dalam rangka menyambut bulan Ramadhan.",
    penulis: "K.H. Abdul Rohman",
    status: "published",
    tanggal: "2025-04-15",
  },
];

export const INITIAL_BANNERS: CMSBanner[] = [
  {
    id: "ban1",
    judul: "Selamat Datang di Yayasan Darul Rohman",
    subjudul: "Membentuk generasi qur'ani, cerdas, dan berakhlak mulia",
    link: "/about",
    aktif: true,
    warna: "primary",
  },
  {
    id: "ban2",
    judul: "PPDB 2025/2026 Telah Dibuka",
    subjudul: "Daftarkan putra-putri terbaik Anda sekarang",
    link: "/ppdb",
    aktif: true,
    warna: "secondary",
  },
  {
    id: "ban3",
    judul: "Beasiswa Tahfidz",
    subjudul: "Program beasiswa untuk santri berprestasi",
    link: "/beasiswa",
    aktif: false,
    warna: "accent",
  },
];

export const INITIAL_PAGES: CMSPage[] = [
  {
    id: "pg1",
    slug: "tentang",
    judul: "Tentang Yayasan",
    isi: "Yayasan Darul Rohman Morombuh Kwanyar didirikan pada tahun 1985 oleh K.H. Abdul Rohman dengan tujuan menyebarkan pendidikan Islam yang berkualitas di wilayah Bangkalan, Madura.",
    status: "published",
    updatedAt: "2025-04-10",
  },
  {
    id: "pg2",
    slug: "visi-misi",
    judul: "Visi & Misi",
    isi: "VISI: Menjadi lembaga pendidikan Islam unggulan yang melahirkan generasi qur'ani, cerdas, mandiri, dan berakhlak mulia.\n\nMISI: 1) Menyelenggarakan pendidikan berbasis Al-Qur'an dan As-Sunnah. 2) Mengembangkan potensi akademik dan non-akademik siswa. 3) Membangun karakter islami yang kuat.",
    status: "published",
    updatedAt: "2025-04-10",
  },
  {
    id: "pg3",
    slug: "profil-mi",
    judul: "Profil MI Darul Rohman",
    isi: "Madrasah Ibtidaiyah Darul Rohman menyelenggarakan pendidikan dasar Islam untuk siswa kelas 1-6 dengan kurikulum terpadu.",
    status: "published",
    updatedAt: "2025-04-12",
  },
];
