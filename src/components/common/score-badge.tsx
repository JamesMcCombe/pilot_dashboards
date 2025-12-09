"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SCORE_GOOD_THRESHOLD, SCORE_WARNING_THRESHOLD } from "./score-arc";
import { PilotScoreMark } from "./pilot-score-mark";

interface ScoreBadgeProps {
  score: number;
  className?: string;
  label?: string;
}

export function ScoreBadge({ score, className, label }: ScoreBadgeProps) {
  const tone =
    score >= SCORE_GOOD_THRESHOLD
      ? "good"
      : score >= SCORE_WARNING_THRESHOLD
        ? "neutral"
        : "bad";

  return (
    <Badge
      variant="secondary"
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 text-xs font-semibold",
        tone === "good" && "bg-primary/15 text-primary",
        tone === "neutral" && "bg-muted/40 text-muted-foreground",
        tone === "bad" && "bg-[color:var(--pilot-bad)]/15 text-[color:var(--pilot-bad)]",
        className,
      )}
    >
      <PilotScoreMark className="h-3.5 w-3.5 border-current text-[0.45rem]" />
      <span>{label ? `${label} ${score}` : score}</span>
    </Badge>
  );
}
