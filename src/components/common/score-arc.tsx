"use client";

import { cn } from "@/lib/utils";
import { PilotScoreMark } from "./pilot-score-mark";

export const SCORE_GOOD_THRESHOLD = 700;
export const SCORE_WARNING_THRESHOLD = 400;

interface ScoreArcProps {
  score: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ScoreArc({
  score,
  label,
  size = 120,
  strokeWidth = 12,
  className,
}: ScoreArcProps) {
  const safeScore = Number.isFinite(score) ? Number(score) : 0;
  const clamped = Math.min(Math.max(safeScore, 0), 1000);
  const ratio = clamped / 1000;
  const angle = Math.round(ratio * 360);

  const tone =
    clamped >= SCORE_GOOD_THRESHOLD
      ? "good"
      : clamped >= SCORE_WARNING_THRESHOLD
        ? "neutral"
        : "bad";
  const toneColor =
    tone === "good"
      ? "#53f6c5"
      : tone === "neutral"
        ? "#f5c97b"
        : "#f17070";

  const ringSize = size;
  const innerSize = size - strokeWidth * 2;
  const badgeSize = Math.max(20, Math.min(innerSize * 0.28, 30));
  const badgeFontSize = Math.max(10, Math.min(badgeSize * 0.45, 13));

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: ringSize, height: ringSize }}
      role="img"
      aria-label={`${label ?? "Score"} ${clamped} out of 1000`}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(${toneColor} 0deg ${angle}deg, rgba(255,255,255,0.05) ${angle}deg 360deg)`,
          filter: "drop-shadow(0 0 32px rgba(83,246,197,0.18))",
        }}
      />
      <div
        className="relative flex items-center justify-center rounded-full bg-[rgba(5,12,28,0.92)]"
        style={{ width: innerSize, height: innerSize }}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <PilotScoreMark
            className="border-primary/70 bg-primary/15 text-primary"
            style={{ width: badgeSize, height: badgeSize, fontSize: badgeFontSize }}
          />
          <span className="text-3xl font-semibold text-foreground">{clamped}</span>
          <span className="text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">{label ?? "Score"}</span>
        </div>
      </div>
    </div>
  );
}
