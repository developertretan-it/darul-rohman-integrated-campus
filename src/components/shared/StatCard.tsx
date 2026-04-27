import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  trend?: string;
  variant?: "primary" | "secondary" | "accent" | "default";
  className?: string;
}

const variantStyles: Record<string, string> = {
  primary: "gradient-primary text-white",
  secondary: "gradient-gold text-secondary-foreground",
  accent: "gradient-sky text-white",
  default: "bg-card text-card-foreground",
};

export function StatCard({ label, value, icon: Icon, hint, trend, variant = "default", className }: StatCardProps) {
  const isColored = variant !== "default";
  return (
    <Card className={cn(
      "group relative overflow-hidden rounded-2xl border-0 shadow-soft hover-lift",
      variantStyles[variant],
      className
    )}>
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className={cn("text-sm font-medium", isColored ? "opacity-90" : "text-muted-foreground")}>{label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
            {hint && <p className={cn("mt-1 text-xs", isColored ? "opacity-80" : "text-muted-foreground")}>{hint}</p>}
          </div>
          <div className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-smooth group-hover:scale-110",
            isColored ? "bg-white/20" : "bg-primary/10 text-primary"
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {trend && (
          <div className={cn(
            "mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            isColored ? "bg-white/20" : "bg-success/10 text-success"
          )}>
            <TrendingUp className="h-3 w-3" />
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground md:text-base">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
