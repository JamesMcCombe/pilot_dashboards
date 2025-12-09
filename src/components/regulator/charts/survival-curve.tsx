"use client";

import { useId } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  survivalCurveData,
  NZ_MEDIAN_TTF,
  GLOBAL_MEDIAN_TTF,
  NZ_EARLY_LOSS_PCT,
} from "@/data/regulator/survival-data";

export function SurvivalCurve() {
  const gradientId = useId();

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Time-to-Failure Survival Curve
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          NZ median: {NZ_MEDIAN_TTF} days · Global median: {GLOBAL_MEDIAN_TTF} days ·{" "}
          {NZ_EARLY_LOSS_PCT}% of NZ traders fail within 30 days
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={survivalCurveData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <defs>
                <linearGradient id={`${gradientId}-nz`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id={`${gradientId}-global`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#53f6c5" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#53f6c5" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(124, 141, 173, 0.2)"
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "#7c8dad", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                label={{
                  value: "Days Since Account Creation",
                  position: "bottom",
                  offset: 20,
                  fill: "#7c8dad",
                  fontSize: 12,
                }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#7c8dad", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                label={{
                  value: "% Still Active",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#7c8dad",
                  fontSize: 12,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f1d36",
                  border: "1px solid rgba(124, 141, 173, 0.3)",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                }}
                labelStyle={{ color: "#f8fafc", fontWeight: 600 }}
                formatter={(value: number, name: string) => [
                  `${value}%`,
                  name === "nzSurvival" ? "NZ Cohort" : "Global Benchmark",
                ]}
                labelFormatter={(label) => `Day ${label}`}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) =>
                  value === "nzSurvival" ? "NZ Cohort" : "Global Benchmark"
                }
              />
              <ReferenceLine
                x={NZ_MEDIAN_TTF}
                stroke="#f87171"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  value: `NZ Median (${NZ_MEDIAN_TTF}d)`,
                  position: "top",
                  fill: "#f87171",
                  fontSize: 10,
                }}
              />
              <ReferenceLine
                x={GLOBAL_MEDIAN_TTF}
                stroke="#53f6c5"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  value: `Global Median (${GLOBAL_MEDIAN_TTF}d)`,
                  position: "top",
                  fill: "#53f6c5",
                  fontSize: 10,
                }}
              />
              <Area
                type="monotone"
                dataKey="globalSurvival"
                stroke="#53f6c5"
                strokeWidth={2}
                fill={`url(#${gradientId}-global)`}
              />
              <Area
                type="monotone"
                dataKey="nzSurvival"
                stroke="#f87171"
                strokeWidth={2}
                fill={`url(#${gradientId}-nz)`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 rounded-2xl border border-[#f87171]/30 bg-[#f87171]/10 p-3 text-sm">
          <p className="font-medium text-[#f87171]">Early Loss Concentration</p>
          <p className="mt-1 text-muted-foreground">
            NZ traders show significantly faster account depletion compared to global
            benchmarks, with {NZ_EARLY_LOSS_PCT}% failing in the first 30 days.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
