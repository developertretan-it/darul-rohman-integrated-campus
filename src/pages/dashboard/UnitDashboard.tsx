import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import { useUnit } from "@/context/UnitContext";
import { useAuth } from "@/context/AuthContext";
import { UnitKey } from "@/data/mockData";

const VALID: UnitKey[] = ["mi", "smp", "smk"];

export default function UnitDashboard() {
  const { unitKey } = useParams<{ unitKey: string }>();
  const { setUnit, canSwitch } = useUnit();
  const { user } = useAuth();

  const target = VALID.includes(unitKey as UnitKey) ? (unitKey as UnitKey) : null;

  // Sinkronkan UnitContext supaya widget Dashboard memakai data unit ini.
  useEffect(() => {
    if (!target) return;
    if (canSwitch) {
      setUnit(target);
    }
  }, [target, canSwitch, setUnit]);

  if (!target) return <Navigate to="/dashboard/mi" replace />;

  // Admin unit hanya boleh akses dashboard unitnya. Super admin bebas.
  if (user && user.role !== "super_admin" && user.unit && user.unit !== target) {
    return <Navigate to={`/dashboard/${user.unit}`} replace />;
  }

  return <Dashboard />;
}
