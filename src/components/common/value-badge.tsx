import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ValueTier } from "@/lib/value-score";

interface ValueBadgeProps {
  tier: ValueTier;
  label: string;
  score?: number;
  className?: string;
}

/**
 * Badge showing "Value to Broker" tier.
 * - High Value: Green (high revenue + low risk)
 * - Medium Value: Yellow (balanced)
 * - Watch: Red (low value or high risk)
 */
export function ValueBadge({ tier, label, score, className }: ValueBadgeProps) {
  const badgeClass = cn(
    "rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em]",
    tier === "high" &&
      "border-[color:var(--pilot-good)]/40 bg-[color:var(--pilot-good)]/15 text-[color:var(--pilot-good)]",
    tier === "medium" &&
      "border-amber-400/40 bg-amber-400/15 text-amber-200",
    tier === "watch" &&
      "border-[color:var(--pilot-bad)]/40 bg-[color:var(--pilot-bad)]/15 text-[color:var(--pilot-bad)]",
    className
  );

  return (
    <Badge variant="secondary" className={badgeClass}>
      {label}
      {score !== undefined && ` (${score})`}
    </Badge>
  );
}
