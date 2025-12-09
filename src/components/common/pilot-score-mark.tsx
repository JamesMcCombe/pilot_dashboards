"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

export function PilotScoreMark({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      style={style}
      className={cn(
        "inline-grid aspect-square place-items-center rounded-full border border-primary/60 bg-primary/10 text-[0.5rem] font-black uppercase tracking-[0.2em] leading-none text-primary shadow-[0_0_10px_rgba(83,246,197,0.35)]",
        className,
      )}
    >
      PS
    </span>
  );
}

export function PilotScoreValue({
  score,
  className,
  valueClassName,
  markClassName,
  srLabel = "PilotScore value",
}: {
  score: number;
  className?: string;
  valueClassName?: string;
  markClassName?: string;
  srLabel?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="sr-only">{srLabel}</span>
      <PilotScoreMark className={markClassName} />
      <span className={cn("font-semibold text-foreground", valueClassName)}>{Math.round(score)}</span>
    </span>
  );
}
