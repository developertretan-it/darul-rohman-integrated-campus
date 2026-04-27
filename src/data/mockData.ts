export type UnitKey = "mi" | "smp" | "smk";

export interface UnitInfo {
  key: UnitKey;
  short: string;
  name: string;
  level: string;
  color: string;
}

export const UNITS: Record<UnitKey, UnitInfo> = {
  mi: { key: "mi", short: "MI", name: "Madrasah Ibtidaiyah", level: "Dasar", color: "primary" },
  smp: { key: "smp", short: "SMP", name: "Sekolah Menengah Pertama", level: "Menengah", color: "accent" },
  smk: { key: "smk", short: "SMK", name: "Sekolah Menengah Kejuruan", level: "Atas", color: "secondary" },
};

export interface Siswa {
  id: string;
  nama: string;
  nis: string;
  kelas: string;
  jenisKelamin: "L" | "P";
  alamat: string;
  status: "Aktif" | "Cuti";
}

export interface Jadwal {
  id: string;
  hari: string;
  jam: string;
  mapel: string;
  guru: string;
  ruang: string;
}

export interface Nilai {
  id: string;
  siswa: string;
  mapel: string;
  tugas: number;
  uts: number;
  uas: number;
  akhir: number;
}

export interface Guru {
  id: string;
  nama: string;
  nip: string;
  mapel: string;
  jabatan: string;
  telp: string;
}

export interface Tagihan {
  id: string;
  siswa: string;
  kelas: string;
  bulan: string;
  jumlah: number;
  status: "Lunas" | "Belum";
  tanggal: string;
}

export interface Pendaftar {
  id: string;
  nama: string;
  nik: string;
  asal: string;
  unit: UnitKey;
  status: "Pending" | "Diterima" | "Ditolak";
  tanggal: string;
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  tanggal: string;
  unit: UnitKey | "all";
}

export interface UnitData {
  ringkasan: {
    totalSiswa: number;
    totalGuru: number;
    totalKelas: number;
    hadirHariIni: number;
  };
  siswa: Siswa[];
  jadwalHariIni: Jadwal[];
  nilai: Nilai[];
  guru: Guru[];
  tagihan: Tagihan[];
  absensi: { hadir: number; izin: number; sakit: number; alpha: number };
  mapel: string[];
  kelas: string[];
}

const HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
const today = HARI[Math.min(new Date().getDay() - 1, 4) >= 0 ? new Date().getDay() - 1 : 0] || "Senin";

const buildNilai = (siswaList: string[], mapelList: string[], min: number, max: number): Nilai[] => {
  const out: Nilai[] = [];
  let id = 1;
  siswaList.slice(0, 8).forEach((s) => {
    mapelList.forEach((m) => {
      const tugas = Math.floor(Math.random() * (max - min) + min);
      const uts = Math.floor(Math.random() * (max - min) + min);
      const uas = Math.floor(Math.random() * (max - min) + min);
      out.push({
        id: `n${id++}`,
        siswa: s,
        mapel: m,
        tugas,
        uts,
        uas,
        akhir: Math.round(tugas * 0.3 + uts * 0.3 + uas * 0.4),
      });
    });
  });
  return out;
};

const buildTagihan = (siswaList: Siswa[], spp: number): Tagihan[] =>
  siswaList.slice(0, 12).map((s, i) => ({
    id: `t${i}`,
    siswa: s.nama,
    kelas: s.kelas,
    bulan: ["Oktober", "November", "Desember"][i % 3],
    jumlah: spp,
    status: i % 3 === 0 ? "Belum" : "Lunas",
    tanggal: `2025-${String((i % 3) + 10).padStart(2, "0")}-15`,
  }));

// ============ MI ============
const miSiswa: Siswa[] = [
  { id: "mi1", nama: "Ahmad Fauzi", nis: "10001", kelas: "1A", jenisKelamin: "L", alamat: "Morombuh", status: "Aktif" },
  { id: "mi2", nama: "Siti Aminah", nis: "10002", kelas: "1A", jenisKelamin: "P", alamat: "Kwanyar", status: "Aktif" },
  { id: "mi3", nama: "Muhammad Rizki", nis: "10003", kelas: "2B", jenisKelamin: "L", alamat: "Bangkalan", status: "Aktif" },
  { id: "mi4", nama: "Aisyah Putri", nis: "10004", kelas: "3A", jenisKelamin: "P", alamat: "Morombuh", status: "Aktif" },
  { id: "mi5", nama: "Abdullah Hakim", nis: "10005", kelas: "4A", jenisKelamin: "L", alamat: "Kwanyar", status: "Aktif" },
  { id: "mi6", nama: "Fatimah Zahra", nis: "10006", kelas: "5A", jenisKelamin: "P", alamat: "Morombuh", status: "Aktif" },
  { id: "mi7", nama: "Yusuf Maulana", nis: "10007", kelas: "6A", jenisKelamin: "L", alamat: "Bangkalan", status: "Aktif" },
  { id: "mi8", nama: "Khadijah Salma", nis: "10008", kelas: "6A", jenisKelamin: "P", alamat: "Kwanyar", status: "Aktif" },
];

// ============ SMP ============
const smpSiswa: Siswa[] = [
  { id: "smp1", nama: "Budi Santoso", nis: "20001", kelas: "7A", jenisKelamin: "L", alamat: "Morombuh", status: "Aktif" },
  { id: "smp2", nama: "Dewi Lestari", nis: "20002", kelas: "7A", jenisKelamin: "P", alamat: "Kwanyar", status: "Aktif" },
  { id: "smp3", nama: "Eko Prasetyo", nis: "20003", kelas: "7B", jenisKelamin: "L", alamat: "Bangkalan", status: "Aktif" },
  { id: "smp4", nama: "Fitri Handayani", nis: "20004", kelas: "8A", jenisKelamin: "P", alamat: "Morombuh", status: "Aktif" },
  { id: "smp5", nama: "Gilang Ramadhan", nis: "20005", kelas: "8A", jenisKelamin: "L", alamat: "Kwanyar", status: "Aktif" },
  { id: "smp6", nama: "Hesti Wulandari", nis: "20006", kelas: "8B", jenisKelamin: "P", alamat: "Morombuh", status: "Aktif" },
  { id: "smp7", nama: "Irfan Hakim", nis: "20007", kelas: "9A", jenisKelamin: "L", alamat: "Bangkalan", status: "Aktif" },
  { id: "smp8", nama: "Jihan Salsabila", nis: "20008", kelas: "9A", jenisKelamin: "P", alamat: "Kwanyar", status: "Aktif" },
];

// ============ SMK ============
const smkSiswa: Siswa[] = [
  { id: "smk1", nama: "Krisna Wijaya", nis: "30001", kelas: "X RPL", jenisKelamin: "L", alamat: "Morombuh", status: "Aktif" },
  { id: "smk2", nama: "Lina Marlina", nis: "30002", kelas: "X RPL", jenisKelamin: "P", alamat: "Kwanyar", status: "Aktif" },
  { id: "smk3", nama: "Maulana Iqbal", nis: "30003", kelas: "X TKJ", jenisKelamin: "L", alamat: "Bangkalan", status: "Aktif" },
  { id: "smk4", nama: "Nurul Hidayah", nis: "30004", kelas: "XI RPL", jenisKelamin: "P", alamat: "Morombuh", status: "Aktif" },
  { id: "smk5", nama: "Oki Setiawan", nis: "30005", kelas: "XI TKJ", jenisKelamin: "L", alamat: "Kwanyar", status: "Aktif" },
  { id: "smk6", nama: "Putri Anggraini", nis: "30006", kelas: "XI RPL", jenisKelamin: "P", alamat: "Morombuh", status: "Aktif" },
  { id: "smk7", nama: "Qori Rahman", nis: "30007", kelas: "XII RPL", jenisKelamin: "L", alamat: "Bangkalan", status: "Aktif" },
  { id: "smk8", nama: "Ratna Sari", nis: "30008", kelas: "XII TKJ", jenisKelamin: "P", alamat: "Kwanyar", status: "Aktif" },
];

const miMapel = ["Tematik", "Matematika", "Bahasa Indonesia", "PAI", "PJOK"];
const smpMapel = ["IPA", "IPS", "Matematika", "Bahasa Inggris", "Bahasa Indonesia"];
const smkMapel = ["Pemrograman Web", "Basis Data", "Jaringan Komputer", "Sistem Operasi", "Matematika"];

const miGuru: Guru[] = [
  { id: "g1", nama: "Ust. Hasan Basri, S.Pd", nip: "198501012010", mapel: "Tematik", jabatan: "Wali Kelas 1A", telp: "0812-1111-1111" },
  { id: "g2", nama: "Ustz. Maryam, S.Pd.I", nip: "198603152011", mapel: "PAI", jabatan: "Guru PAI", telp: "0812-2222-2222" },
  { id: "g3", nama: "Ust. Imron, S.Pd", nip: "198801102012", mapel: "Matematika", jabatan: "Wali Kelas 4A", telp: "0812-3333-3333" },
  { id: "g4", nama: "Ustz. Halimah, S.Pd", nip: "198902052013", mapel: "Bahasa Indonesia", jabatan: "Wali Kelas 6A", telp: "0812-4444-4444" },
];

const smpGuru: Guru[] = [
  { id: "g5", nama: "Drs. Sutrisno, M.Pd", nip: "197505012005", mapel: "IPA", jabatan: "Kepala Sekolah", telp: "0813-1111-1111" },
  { id: "g6", nama: "Indah Permata, S.Pd", nip: "198607202010", mapel: "Matematika", jabatan: "Wakasek Kurikulum", telp: "0813-2222-2222" },
  { id: "g7", nama: "Bambang Wibowo, S.Pd", nip: "198410152008", mapel: "IPS", jabatan: "Wali Kelas 8A", telp: "0813-3333-3333" },
  { id: "g8", nama: "Sri Wahyuni, S.S", nip: "198812102013", mapel: "Bahasa Inggris", jabatan: "Wali Kelas 9A", telp: "0813-4444-4444" },
];

const smkGuru: Guru[] = [
  { id: "g9", nama: "Andi Pratama, M.Kom", nip: "198205102008", mapel: "Pemrograman Web", jabatan: "Kepala Jurusan RPL", telp: "0814-1111-1111" },
  { id: "g10", nama: "Rina Kartika, S.Kom", nip: "198908152012", mapel: "Basis Data", jabatan: "Guru Produktif", telp: "0814-2222-2222" },
  { id: "g11", nama: "Dimas Nugroho, S.T", nip: "198706012011", mapel: "Jaringan Komputer", jabatan: "Kepala Jurusan TKJ", telp: "0814-3333-3333" },
  { id: "g12", nama: "Ratih Sundari, S.Pd", nip: "198403102009", mapel: "Matematika", jabatan: "Wali Kelas XII RPL", telp: "0814-4444-4444" },
];

const buildJadwal = (mapel: string[], guru: Guru[], ruang: string): Jadwal[] =>
  mapel.slice(0, 5).map((m, i) => ({
    id: `j${i}`,
    hari: today,
    jam: ["07:00 - 08:30", "08:30 - 10:00", "10:15 - 11:45", "12:30 - 14:00", "14:00 - 15:30"][i],
    mapel: m,
    guru: guru[i % guru.length].nama,
    ruang: `${ruang} ${i + 1}`,
  }));

export const MOCK_DATA: Record<UnitKey, UnitData> = {
  mi: {
    ringkasan: { totalSiswa: 248, totalGuru: 18, totalKelas: 12, hadirHariIni: 232 },
    siswa: miSiswa,
    jadwalHariIni: buildJadwal(miMapel, miGuru, "Kelas"),
    nilai: buildNilai(miSiswa.map((s) => s.nama), miMapel, 85, 96),
    guru: miGuru,
    tagihan: buildTagihan(miSiswa, 100000),
    absensi: { hadir: 92, izin: 4, sakit: 3, alpha: 1 },
    mapel: miMapel,
    kelas: ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B"],
  },
  smp: {
    ringkasan: { totalSiswa: 312, totalGuru: 24, totalKelas: 9, hadirHariIni: 288 },
    siswa: smpSiswa,
    jadwalHariIni: buildJadwal(smpMapel, smpGuru, "Ruang"),
    nilai: buildNilai(smpSiswa.map((s) => s.nama), smpMapel, 70, 92),
    guru: smpGuru,
    tagihan: buildTagihan(smpSiswa, 150000),
    absensi: { hadir: 90, izin: 5, sakit: 3, alpha: 2 },
    mapel: smpMapel,
    kelas: ["7A", "7B", "7C", "8A", "8B", "8C", "9A", "9B", "9C"],
  },
  smk: {
    ringkasan: { totalSiswa: 186, totalGuru: 20, totalKelas: 6, hadirHariIni: 174 },
    siswa: smkSiswa,
    jadwalHariIni: buildJadwal(smkMapel, smkGuru, "Lab"),
    nilai: buildNilai(smkSiswa.map((s) => s.nama), smkMapel, 75, 95),
    guru: smkGuru,
    tagihan: buildTagihan(smkSiswa, 200000),
    absensi: { hadir: 93, izin: 3, sakit: 2, alpha: 2 },
    mapel: smkMapel,
    kelas: ["X RPL", "X TKJ", "XI RPL", "XI TKJ", "XII RPL", "XII TKJ"],
  },
};

export const PENDAFTAR: Pendaftar[] = [
  { id: "p1", nama: "Aldi Pratama", nik: "3526011234567001", asal: "TK Al-Hidayah", unit: "mi", status: "Diterima", tanggal: "2025-04-10" },
  { id: "p2", nama: "Bintang Maulana", nik: "3526011234567002", asal: "MI Darul Ulum", unit: "smp", status: "Diterima", tanggal: "2025-04-12" },
  { id: "p3", nama: "Citra Dewi", nik: "3526011234567003", asal: "SMP Negeri 1", unit: "smk", status: "Pending", tanggal: "2025-04-15" },
  { id: "p4", nama: "Dimas Aditya", nik: "3526011234567004", asal: "SD Negeri 2", unit: "smp", status: "Pending", tanggal: "2025-04-18" },
  { id: "p5", nama: "Elsa Putri", nik: "3526011234567005", asal: "TK Tunas Bangsa", unit: "mi", status: "Diterima", tanggal: "2025-04-20" },
  { id: "p6", nama: "Faisal Rahman", nik: "3526011234567006", asal: "SMP Al-Falah", unit: "smk", status: "Diterima", tanggal: "2025-04-22" },
  { id: "p7", nama: "Gita Anggraini", nik: "3526011234567007", asal: "SDN Morombuh", unit: "smp", status: "Ditolak", tanggal: "2025-04-23" },
];

export const PENGUMUMAN: Pengumuman[] = [
  { id: "u1", judul: "Pembukaan PPDB Tahun Ajaran 2025/2026", isi: "Pendaftaran peserta didik baru telah dibuka untuk seluruh unit MI, SMP, dan SMK.", tanggal: "2025-04-25", unit: "all" },
  { id: "u2", judul: "Ujian Tengah Semester SMP", isi: "UTS SMP akan dilaksanakan tanggal 5-12 Mei 2025.", tanggal: "2025-04-22", unit: "smp" },
  { id: "u3", judul: "Praktik Industri SMK Kelas XI", isi: "Pendaftaran tempat PKL dibuka mulai 1 Mei 2025.", tanggal: "2025-04-20", unit: "smk" },
  { id: "u4", judul: "Lomba Tahfidz MI", isi: "Lomba hafalan Al-Qur'an tingkat MI akan diadakan 15 Mei 2025.", tanggal: "2025-04-18", unit: "mi" },
];
