"use client";

import { useId } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  pilotScoreDistribution,
  HIGH_HARM_THRESHOLD,
  HIGH_HARM_PERCENTAGE,
  AVERAGE_PILOT_SCORE,
} from "@/data/regulator/pilot-score-distribution";

export function PilotScoreHistogram() {
  const gradientId = useId();

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          PilotScore Distribution – NZ Sample
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {HIGH_HARM_PERCENTAGE}% of traders in High-Harm Zone (0-40) · Average score: {AVERAGE_PILOT_SCORE}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={pilotScoreDistribution}
              margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
            >
              <defs>
                <linearGradient id={`${gradientId}-harm`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#f87171" stopOpacity={0.5} />
                </linearGradient>
                <linearGradient id={`${gradientId}-normal`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6ea8ff" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#6ea8ff" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(124, 141, 173, 0.2)"
                vertical={false}
              />
              <XAxis
                dataKey="range"
                tick={{ fill: "#7c8dad", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                label={{
                  value: "PilotScore Range",
                  position: "bottom",
                  offset: 20,
                  fill: "#7c8dad",
                  fontSize: 12,
                }}
              />
              <YAxis
                tick={{ fill: "#7c8dad", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                label={{
                  value: "Number of Traders",
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
                itemStyle={{ color: "#aebbd4" }}
                formatter={(value: number) => [
                  `${value} traders`,
                  "Count",
                ]}
              />
              <ReferenceLine
                x="31-40"
                stroke="#f87171"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  value: "High-Harm Zone",
                  position: "top",
                  fill: "#f87171",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {pilotScoreDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.max <= HIGH_HARM_THRESHOLD
                        ? `url(#${gradientId}-harm)`
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
            <span className="h-3 w-6 rounded-full bg-[#f87171]/70" />
            <span className="text-muted-foreground">High-Harm Zone (0-40)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-6 rounded-full bg-[#6ea8ff]/70" />
            <span className="text-muted-foreground">Normal Range (41-100)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
