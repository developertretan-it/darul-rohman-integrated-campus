import { useUnit } from "@/context/UnitContext";
import { UNITS, UnitKey } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function UnitSwitcher() {
  const { unit, setUnit } = useUnit();
  const keys: UnitKey[] = ["mi", "smp", "smk"];

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
