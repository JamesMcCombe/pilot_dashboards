"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type TimeRange = "7D" | "30D" | "90D" | "YTD";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const ranges: TimeRange[] = ["7D", "30D", "90D", "YTD"];

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex items-center gap-1 rounded-xl bg-muted/30 p-1">
      {ranges.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={cn(
            "relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            value === range
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {value === range && (
            <motion.div
              layoutId="time-range-pill"
              className="absolute inset-0 rounded-lg bg-primary/20"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{range}</span>
        </button>
      ))}
    </div>
  );
}
