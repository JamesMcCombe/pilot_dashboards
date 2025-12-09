"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCopyTradingFunnel, type FunnelStage, type FunnelTimeframe } from "@/lib/aggregations";
import { formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { HelpTooltip } from "@/components/help/help-tooltip";

const funnelOverviewHelp =
  "Shows where users drop off in the copy trading lifecycle, from registration to long-term retained copiers. Each leak is a lost revenue opportunity.";

const stageHelpCopy: Record<string, string> = {
  Registered: "Users who have registered accounts on the platform.",
  "First Copy": "Users who have executed at least one copied trade.",
  "Active Copier": "Users who copy trades regularly, e.g. at least one copied trade per week.",
  "Retained 30d": "Copiers who remain active at least 30 days after their first copied trade.",
};

const ranges: { label: string; value: FunnelTimeframe }[] = [
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "Last 90 Days", value: "last90Days" },
];

export function CopyTradingFunnel() {
  const [range, setRange] = useState<FunnelTimeframe>("thisMonth");

  const stages = useMemo(() => getCopyTradingFunnel(range), [range]);

  const cardBody = (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85 shadow-none">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-base font-semibold">Copy Trading Funnel</CardTitle>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Navigator + follower journey</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ranges.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={range === option.value ? "default" : "ghost"}
              onClick={() => setRange(option.value)}
              className={cn(
                "rounded-full border px-4 py-1 text-xs uppercase tracking-[0.18em]",
                range === option.value
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-border/50 bg-transparent text-muted-foreground hover:border-primary/40 hover:text-primary",
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-4">
          {stages.map((stage, index) => (
            <StageCard key={stage.label} stage={stage} index={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return <HelpTooltip text={funnelOverviewHelp}>{cardBody}</HelpTooltip>;
}

function StageCard({ stage, index }: { stage: FunnelStage; index: number }) {
  const hasConversion = stage.conversionToNext > 0;
  const deltaLabel = stage.deltaVsLast30d > 0
    ? `+${stage.deltaVsLast30d}%`
    : `${stage.deltaVsLast30d}%`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
    >
      <HelpTooltip text={stageHelpCopy[stage.label] ?? stageHelpCopy.Registered}>
        <div className="rounded-3xl border-2 border-border/60 bg-sidebar/40 p-4">
          <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">{stage.label}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{formatNumber(stage.value)}</p>
          <div className="mt-3 h-2 rounded-full bg-border/40">
            {hasConversion ? (
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.min(100, stage.conversionToNext)}%` }}
              />
            ) : null}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {hasConversion ? `${stage.conversionToNext}% to next stage` : "Retention achieved"}
            </span>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em]",
                stage.deltaVsLast30d > 0
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-[color:var(--pilot-bad)]/40 bg-[color:var(--pilot-bad)]/10 text-[color:var(--pilot-bad)]",
              )}
            >
              vs last 30d {deltaLabel}
            </span>
          </div>
        </div>
      </HelpTooltip>
    </motion.div>
  );
}
