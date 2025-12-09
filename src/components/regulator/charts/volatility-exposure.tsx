"use client";

import { useId } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  volatilityExposure,
  HIGH_VOLATILITY_EXPOSURE_PCT,
} from "@/data/regulator/behavioural-metrics";

export function VolatilityExposure() {
  const gradientId = useId();

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Volatility Exposure Distribution
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {HIGH_VOLATILITY_EXPOSURE_PCT}% of traders have high or very high volatility exposure
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={volatilityExposure}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(124, 141, 173, 0.2)"
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "#7c8dad", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
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
              <Area
                type="monotone"
                dataKey="percentage"
                stroke="#a78bfa"
                strokeWidth={2}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs">
          {volatilityExposure.map((item) => (
            <div key={item.label} className="rounded-lg bg-muted/20 p-2">
              <p className="font-medium">{item.percentage}%</p>
              <p className="text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
