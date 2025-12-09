"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  stopLossUsage,
  STOP_LOSS_ADOPTION_RATE,
  NO_STOP_LOSS_PCT,
} from "@/data/regulator/behavioural-metrics";

const pieData = [
  { name: "Always", value: stopLossUsage.always.percentage, color: "#53f6c5" },
  { name: "Usually (>75%)", value: stopLossUsage.usually.percentage, color: "#6ea8ff" },
  { name: "Sometimes", value: stopLossUsage.sometimes.percentage, color: "#fbbf24" },
  { name: "Rarely (<25%)", value: stopLossUsage.rarely.percentage, color: "#f97316" },
  { name: "Never", value: stopLossUsage.never.percentage, color: "#f87171" },
];

export function StopLossRatio() {
  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Stop-Loss Usage Distribution
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {STOP_LOSS_ADOPTION_RATE}% consistently use stop-losses · {NO_STOP_LOSS_PCT}% rarely or never
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f1d36",
                  border: "1px solid rgba(124, 141, 173, 0.3)",
                  borderRadius: "12px",
                }}
                formatter={(value: number) => [`${value}%`, "Traders"]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 rounded-2xl border border-[#f97316]/30 bg-[#f97316]/10 p-3 text-sm">
          <p className="font-medium text-[#f97316]">Risk Indicator</p>
          <p className="mt-1 text-muted-foreground">
            {NO_STOP_LOSS_PCT}% of traders rarely or never use stop-losses, indicating
            poor risk management discipline and higher susceptibility to large losses.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
