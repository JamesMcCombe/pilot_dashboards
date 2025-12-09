"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCopierBehaviourStats } from "@/lib/aggregations";
import { cn } from "@/lib/utils";
import { HelpTooltip } from "@/components/help/help-tooltip";

const behaviourHelpCopy = {
  profit: "Distribution of copy followers’ profit and loss; shows whether copiers tend to win or lose overall.",
  frequency: "How often followers copy trades; separates occasional copiers from your power users.",
  segments: "Segments copiers into dormant, occasional, active, and power users so you can explain engagement mix.",
} as const;

export function CopierBehaviourOverview() {
  const { profitDistribution, frequencyDistribution, segments } = useMemo(
    () => getCopierBehaviourStats(),
    [],
  );

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <HelpTooltip text={behaviourHelpCopy.profit}>
      <Card className="rounded-3xl border-2 border-border/60 bg-card/85 shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Follower Profit Distribution</CardTitle>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Last 30 days</p>
          </CardHeader>
          <CardContent className="h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
              <BarChart data={profitDistribution} margin={{ top: 8, bottom: 16, left: -20, right: 0 }}>
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#7c8aa6", fontSize: 12 }} />
                <YAxis hide domain={[0, "auto"]} />
                <Tooltip cursor={{ fill: "rgba(83,246,197,0.1)" }} contentStyle={tooltipStyles} />
                <Bar dataKey="value" fill="#53f6c5" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </HelpTooltip>

      <HelpTooltip text={behaviourHelpCopy.frequency}>
      <Card className="rounded-3xl border-2 border-border/60 bg-card/85 shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Copy Frequency Distribution</CardTitle>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Trades copied per week</p>
          </CardHeader>
          <CardContent className="h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
              <BarChart data={frequencyDistribution} margin={{ top: 8, bottom: 16, left: -20, right: 0 }}>
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#7c8aa6", fontSize: 12 }} />
                <YAxis hide domain={[0, "auto"]} />
                <Tooltip cursor={{ fill: "rgba(82,229,255,0.1)" }} contentStyle={tooltipStyles} />
                <Bar dataKey="value" fill="#51e5ff" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </HelpTooltip>

      <HelpTooltip text={behaviourHelpCopy.segments}>
      <Card className="rounded-3xl border-2 border-border/60 bg-card/85 shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Follower Segments</CardTitle>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Engagement + retention</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {segments.map((segment) => (
              <div key={segment.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                  <span>{segment.label}</span>
                  <span className="text-xs text-muted-foreground">{segment.count} · {segment.percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-border/40">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      segment.label === "Power Copier" && "bg-primary",
                      segment.label === "Dormant" && "bg-[color:var(--pilot-bad)]",
                      segment.label === "Occasional" && "bg-amber-300",
                      segment.label === "Active" && "bg-sky-300",
                    )}
                    style={{ width: `${segment.percent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground/80">{segment.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </HelpTooltip>
    </div>
  );
}

const tooltipStyles = {
  backgroundColor: "rgba(5,12,28,0.95)",
  borderRadius: 12,
  border: "1px solid rgba(83,246,197,0.25)",
  color: "white",
};
