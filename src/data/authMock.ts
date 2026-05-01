import { UnitKey } from "./mockData";

export type Role = "super_admin" | "admin_mi" | "admin_smp" | "admin_smk";

export interface MockUser {
  id: string;
  username: string;
  password: string;
  nama: string;
  role: Role;
  unit: UnitKey | null; // null = lintas unit (super admin)
  avatar?: string;
  email: string;
}

export const ROLE_LABEL: Record<Role, string> = {
  super_admin: "Super Admin Yayasan",
  admin_mi: "Admin MI",
  admin_smp: "Admin SMP",
  admin_smk: "Admin SMK",
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
];

// Helper - permissions
export const canAccessCMS = (role: Role) => role === "super_admin";
export const canSwitchUnit = (role: Role) => role === "super_admin";
export const isAdmin = (_role: Role) => true; // semua role kini admin

// Mapping default landing per role
export const dashboardPathFor = (role: Role, unit: UnitKey | null): string => {
  if (role === "super_admin") return "/dashboard/mi";
  if (role === "admin_mi" || unit === "mi") return "/dashboard/mi";
  if (role === "admin_smp" || unit === "smp") return "/dashboard/smp";
  if (role === "admin_smk" || unit === "smk") return "/dashboard/smk";
  return "/dashboard/mi";
};
