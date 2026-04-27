import { createContext, useContext, useState, ReactNode } from "react";
import { UnitKey, MOCK_DATA, UNITS } from "@/data/mockData";

interface UnitContextValue {
  unit: UnitKey;
  setUnit: (u: UnitKey) => void;
  data: typeof MOCK_DATA[UnitKey];
  info: typeof UNITS[UnitKey];
}

const UnitContext = createContext<UnitContextValue | null>(null);

export const UnitProvider = ({ children }: { children: ReactNode }) => {
  const [unit, setUnit] = useState<UnitKey>("mi");
  return (
    <UnitContext.Provider value={{ unit, setUnit, data: MOCK_DATA[unit], info: UNITS[unit] }}>
      {children}
    </UnitContext.Provider>
  );
};

export const useUnit = () => {
  const ctx = useContext(UnitContext);
  if (!ctx) throw new Error("useUnit must be inside UnitProvider");
  return ctx;
};
