import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { UnitKey, MOCK_DATA, UNITS } from "@/data/mockData";
import { useAuth } from "./AuthContext";
import { canSwitchUnit } from "@/data/authMock";

interface UnitContextValue {
  unit: UnitKey;
  setUnit: (u: UnitKey) => void;
  canSwitch: boolean;
  data: typeof MOCK_DATA[UnitKey];
  info: typeof UNITS[UnitKey];
}

const UnitContext = createContext<UnitContextValue | null>(null);

export const UnitProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  // Default unit dari user. Super admin default ke MI.
  const initialUnit: UnitKey = user?.unit ?? "mi";
  const [unit, setUnitState] = useState<UnitKey>(initialUnit);

  // Sync ketika user berubah (login/logout/switch user)
  useEffect(() => {
    setUnitState(user?.unit ?? "mi");
  }, [user?.id]);

  const canSwitch = user ? canSwitchUnit(user.role) : false;

  const setUnit = (u: UnitKey) => {
    if (!canSwitch) return; // user biasa terkunci
    setUnitState(u);
  };

  return (
    <UnitContext.Provider value={{ unit, setUnit, canSwitch, data: MOCK_DATA[unit], info: UNITS[unit] }}>
      {children}
    </UnitContext.Provider>
  );
};

export const useUnit = () => {
  const ctx = useContext(UnitContext);
  if (!ctx) throw new Error("useUnit must be inside UnitProvider");
  return ctx;
};
