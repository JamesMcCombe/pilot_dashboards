"use client";

import { useId } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  leverageDistribution,
  AVERAGE_LEVERAGE,
  HIGH_LEVERAGE_THRESHOLD,
  HIGH_LEVERAGE_PCT,
} from "@/data/regulator/behavioural-metrics";

export function LeverageCurve() {
  const gradientId = useId();

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Leverage Usage Distribution
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Average leverage: 1:{AVERAGE_LEVERAGE} · {HIGH_LEVERAGE_PCT}% using 1:100 or higher
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={leverageDistribution}
              margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
            >
              <defs>
                <linearGradient id={`${gradientId}-normal`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6ea8ff" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#6ea8ff" stopOpacity={0.5} />
                </linearGradient>
                <linearGradient id={`${gradientId}-high`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#f87171" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(124, 141, 173, 0.2)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "#7c8dad", fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fill: "#7c8dad", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f1d36",
                  border: "1px solid rgba(124, 141, 173, 0.3)",
                  borderRadius: "12px",
                }}
                formatter={(value: number) => [`${value}%`, "Traders"]}
              />
              <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                {leverageDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.value >= HIGH_LEVERAGE_THRESHOLD
                        ? `url(#${gradientId}-high)`
                        : `url(#${gradientId}-normal)`
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-3 w-6 rounded-full bg-[#6ea8ff]/70" />
            <span className="text-muted-foreground">Moderate Leverage (&lt;1:100)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-6 rounded-full bg-[#f87171]/70" />
            <span className="text-muted-foreground">High Leverage (≥1:100)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
