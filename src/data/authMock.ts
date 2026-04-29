import { UnitKey } from "./mockData";

export type Role =
  | "super_admin"
  | "admin_mi"
  | "admin_smp"
  | "admin_smk"
  | "guru"
  | "siswa"
  | "wali";

export interface MockUser {
  id: string;
  username: string;
  password: string;
  nama: string;
  role: Role;
  unit: UnitKey | null; // null = semua unit (super admin)
  avatar?: string;
  email: string;
  // Untuk siswa/wali
  kelas?: string;
  nis?: string;
  anak?: string; // nama anak (untuk wali)
}

export const ROLE_LABEL: Record<Role, string> = {
  super_admin: "Super Admin Yayasan",
  admin_mi: "Admin MI",
  admin_smp: "Admin SMP",
  admin_smk: "Admin SMK",
  guru: "Guru",
  siswa: "Siswa",
  wali: "Wali Murid",
};

export const MOCK_USERS: MockUser[] = [
  {
    id: "u1",
    username: "superadmin",
    password: "admin123",
    nama: "K.H. Abdul Rohman",
    role: "super_admin",
    unit: null,
    email: "super@darulrohman.id",
  },
  {
    id: "u2",
    username: "adminmi",
    password: "admin123",
    nama: "Ust. Hasan Basri",
    role: "admin_mi",
    unit: "mi",
    email: "mi@darulrohman.id",
  },
  {
    id: "u3",
    username: "adminsmp",
    password: "admin123",
    nama: "Drs. Sutrisno, M.Pd",
    role: "admin_smp",
    unit: "smp",
    email: "smp@darulrohman.id",
  },
  {
    id: "u4",
    username: "adminsmk",
    password: "admin123",
    nama: "Andi Pratama, M.Kom",
    role: "admin_smk",
    unit: "smk",
    email: "smk@darulrohman.id",
  },
  {
    id: "u5",
    username: "guru",
    password: "guru123",
    nama: "Indah Permata, S.Pd",
    role: "guru",
    unit: "smp",
    email: "indah@darulrohman.id",
  },
  {
    id: "u6",
    username: "siswa",
    password: "siswa123",
    nama: "Budi Santoso",
    role: "siswa",
    unit: "smp",
    kelas: "7A",
    nis: "20001",
    email: "budi@siswa.darulrohman.id",
  },
  {
    id: "u7",
    username: "wali",
    password: "wali123",
    nama: "Bapak Santoso",
    role: "wali",
    unit: "smp",
    anak: "Budi Santoso",
    email: "wali.budi@darulrohman.id",
  },
];

// Helper - permissions
export const canAccessCMS = (role: Role) => role === "super_admin";
export const canSwitchUnit = (role: Role) => role === "super_admin";
export const isAdmin = (role: Role) =>
  role === "super_admin" ||
  role === "admin_mi" ||
  role === "admin_smp" ||
  role === "admin_smk";
