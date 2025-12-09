"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  blowupPatterns,
  blowupFrequencyData,
  AVG_BLOWUPS_PER_TRADER,
  TOTAL_REPEAT_LOSSES,
} from "@/data/regulator/survival-data";

const riskColors = {
  extreme: "#ef4444",
  high: "#f97316",
  moderate: "#eab308",
};

export function BlowupPatterns() {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            Repeated Blow-Up Frequency
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Distribution of account failures per trader · Avg: {AVG_BLOWUPS_PER_TRADER} blow-ups
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={blowupFrequencyData}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(124, 141, 173, 0.2)"
                  vertical={false}
                />
                <XAxis
                  dataKey="blowups"
                  tick={{ fill: "#7c8dad", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                  label={{
                    value: "Number of Account Blow-Ups",
                    position: "bottom",
                    offset: 0,
                    fill: "#7c8dad",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  tick={{ fill: "#7c8dad", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f1d36",
                    border: "1px solid rgba(124, 141, 173, 0.3)",
                    borderRadius: "12px",
                  }}
                  formatter={(value: number) => [`${value} traders`, "Count"]}
                />
                <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            High-Risk Repeat Offenders
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Total repeat losses: {currencyFormatter.format(TOTAL_REPEAT_LOSSES)}
          </p>
        </CardHeader>
        <CardContent>
          <div className="max-h-[280px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border/40">
                  <th className="pb-2 text-left font-medium text-muted-foreground">
                    Trader
                  </th>
                  <th className="pb-2 text-center font-medium text-muted-foreground">
                    Blow-ups
                  </th>
                  <th className="pb-2 text-center font-medium text-muted-foreground">
                    Avg Days
                  </th>
                  <th className="pb-2 text-right font-medium text-muted-foreground">
                    Total Loss
                  </th>
                  <th className="pb-2 text-right font-medium text-muted-foreground">
                    Risk
                  </th>
                </tr>
              </thead>
              <tbody>
                {blowupPatterns.map((pattern) => (
                  <tr
                    key={pattern.traderId}
                    className="border-b border-border/20"
                  >
                    <td className="py-2 font-mono text-xs">{pattern.traderId}</td>
                    <td className="py-2 text-center">{pattern.blowupCount}</td>
                    <td className="py-2 text-center text-muted-foreground">
                      {pattern.avgDaysBetween}d
                    </td>
                    <td className="py-2 text-right text-[#f87171]">
                      {currencyFormatter.format(pattern.totalLoss)}
                    </td>
                    <td className="py-2 text-right">
                      <span
                        className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: `${riskColors[pattern.riskCategory]}20`,
                          color: riskColors[pattern.riskCategory],
                        }}
                      >
                        {pattern.riskCategory}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
