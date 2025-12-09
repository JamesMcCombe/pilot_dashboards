"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  HIGH_HARM_PERCENTAGE,
  AVERAGE_PILOT_SCORE,
  TOTAL_TRADERS,
} from "@/data/regulator/pilot-score-distribution";
import {
  NZ_MEDIAN_TTF,
  NZ_EARLY_LOSS_PCT,
} from "@/data/regulator/survival-data";
import {
  OFFSHORE_EXPOSURE_PCT,
  OFFSHORE_TRADER_COUNT,
} from "@/data/regulator/broker-exposure";
import {
  AVERAGE_LEVERAGE,
  HIGH_LEVERAGE_PCT,
  STOP_LOSS_ADOPTION_RATE,
  NO_STOP_LOSS_PCT,
} from "@/data/regulator/behavioural-metrics";

interface KPICardProps {
  label: string;
  value: string | number;
  subtext?: string;
  severity?: "danger" | "warning" | "neutral" | "good";
  index: number;
}

const severityColors = {
  danger: {
    bg: "bg-[#f87171]/10",
    border: "border-[#f87171]/30",
    text: "text-[#f87171]",
  },
  warning: {
    bg: "bg-[#fbbf24]/10",
    border: "border-[#fbbf24]/30",
    text: "text-[#fbbf24]",
  },
  neutral: {
    bg: "bg-muted/20",
    border: "border-border/60",
    text: "text-foreground",
  },
  good: {
    bg: "bg-primary/10",
    border: "border-primary/30",
    text: "text-primary",
  },
};

function KPICard({ label, value, subtext, severity = "neutral", index }: KPICardProps) {
  const colors = severityColors[severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
    >
      <Card
        className={`rounded-3xl border-2 ${colors.border} ${colors.bg} shadow-none transition-transform duration-200 hover:-translate-y-1`}
      >
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={`mt-2 text-3xl font-bold ${colors.text}`}>{value}</p>
          {subtext && (
            <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function KPIOverview() {
  const kpis = [
    {
      label: "Traders in High-Harm Zone",
      value: `${HIGH_HARM_PERCENTAGE}%`,
      subtext: `PilotScore 0-40 · ~${Math.round((parseFloat(HIGH_HARM_PERCENTAGE) / 100) * TOTAL_TRADERS)} traders`,
      severity: "danger" as const,
    },
    {
      label: "Trading Offshore",
      value: `${OFFSHORE_EXPOSURE_PCT}%`,
      subtext: `${OFFSHORE_TRADER_COUNT} traders on unregulated platforms`,
      severity: "danger" as const,
    },
    {
      label: "Median Time-to-Failure",
      value: `${NZ_MEDIAN_TTF} days`,
      subtext: `${NZ_EARLY_LOSS_PCT}% fail within 30 days`,
      severity: "danger" as const,
    },
    {
      label: "Average PilotScore",
      value: AVERAGE_PILOT_SCORE,
      subtext: `${TOTAL_TRADERS.toLocaleString()} traders in sample`,
      severity: "warning" as const,
    },
    {
      label: "Average Leverage",
      value: `1:${AVERAGE_LEVERAGE}`,
      subtext: `${HIGH_LEVERAGE_PCT}% using 1:100 or higher`,
      severity: "warning" as const,
    },
    {
      label: "Stop-Loss Adoption",
      value: `${STOP_LOSS_ADOPTION_RATE}%`,
      subtext: `${NO_STOP_LOSS_PCT}% rarely or never use`,
      severity: "warning" as const,
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Key Harm Indicators
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi, index) => (
          <KPICard key={kpi.label} {...kpi} index={index} />
        ))}
      </div>
    </div>
  );
}
