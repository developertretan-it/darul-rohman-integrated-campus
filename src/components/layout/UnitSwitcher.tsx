import { useUnit } from "@/context/UnitContext";
import { UNITS, UnitKey } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function UnitSwitcher() {
  const { unit, setUnit } = useUnit();
  const keys: UnitKey[] = ["mi", "smp", "smk"];

  return (
    <div className="inline-flex items-center gap-1 rounded-2xl border border-border/60 bg-muted/40 p-1.5 shadow-soft">
      {keys.map((k) => {
        const u = UNITS[k];
        const active = unit === k;
        return (
          <button
            key={k}
            onClick={() => setUnit(k)}
            className={cn(
              "relative rounded-xl px-4 py-2 text-sm font-semibold transition-smooth",
              active
                ? "gradient-primary text-primary-foreground shadow-md-soft"
                : "text-muted-foreground hover:bg-background hover:text-foreground"
            )}
          >
            <span className="flex items-center gap-2">
              <span className={cn(
                "flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-xs font-bold",
                active ? "bg-secondary text-secondary-foreground" : "bg-background text-foreground"
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
