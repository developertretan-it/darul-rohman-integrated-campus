import { useUnit } from "@/context/UnitContext";
import { UNITS, UnitKey } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

export function UnitSwitcher() {
  const { unit, setUnit, canSwitch, info } = useUnit();
  const keys: UnitKey[] = ["mi", "smp", "smk"];

  // User biasa: badge unit terkunci
  if (!canSwitch) {
    return (
      <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-1.5 shadow-soft">
        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold text-muted-foreground">Unit:</span>
        <span className="rounded-md bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
          {info.short}
        </span>
        <span className="hidden text-sm font-semibold text-foreground sm:inline">{info.level}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-muted p-1 shadow-soft">
      {keys.map((k) => {
        const u = UNITS[k];
        const active = unit === k;
        return (
          <button
            key={k}
            onClick={() => setUnit(k)}
            className={cn(
              "relative rounded-lg px-3 py-1.5 text-sm font-semibold transition-smooth",
              active
                ? "gradient-primary text-white shadow-soft"
                : "text-foreground/70 hover:bg-card hover:text-foreground"
            )}
          >
            <span className="flex items-center gap-2">
              <span className={cn(
                "flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-xs font-bold",
                active ? "bg-secondary text-secondary-foreground" : "bg-card text-foreground"
              )}>
                {u.short}
              </span>
              <span className="hidden sm:inline">{u.level}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
