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
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  brokerExposureData,
  brokerExposureTrend,
  propFirmBreakdown,
  riskFlags,
  OFFSHORE_EXPOSURE_PCT,
} from "@/data/regulator/broker-exposure";

const categoryColors = {
  propFirm: "#f87171",
  offshoreBroker: "#fbbf24",
  unlicensed: "#ef4444",
  regulated: "#53f6c5",
};

const severityColors = {
  high: "#ef4444",
  medium: "#f97316",
  low: "#eab308",
};

export function BrokerExposurePanel() {
  const gradientId = useId();

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {brokerExposureData.map((item) => (
          <Card
            key={item.category}
            className="rounded-3xl border-2 border-border/60 bg-card/85"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{item.name}</p>
                  <p className="mt-1 text-3xl font-bold">{item.percentage}%</p>
                  <p className="text-xs text-muted-foreground">
                    {item.traderCount.toLocaleString()} traders
                  </p>
                </div>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: `${categoryColors[item.category]}20`,
                  }}
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: categoryColors[item.category] }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Trend Chart */}
        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              Offshore Exposure Trend
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {OFFSHORE_EXPOSURE_PCT}% of NZ traders now using offshore platforms
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={brokerExposureTrend}
                  margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id={`${gradientId}-prop`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f87171" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id={`${gradientId}-offshore`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id={`${gradientId}-unlicensed`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(124, 141, 173, 0.2)"
                  />
                  <XAxis
                    dataKey="month"
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
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Area
                    type="monotone"
                    dataKey="propFirm"
                    name="Prop Firms"
                    stackId="1"
                    stroke="#f87171"
                    fill={`url(#${gradientId}-prop)`}
                  />
                  <Area
                    type="monotone"
                    dataKey="offshoreBroker"
                    name="Offshore Brokers"
                    stackId="1"
                    stroke="#fbbf24"
                    fill={`url(#${gradientId}-offshore)`}
                  />
                  <Area
                    type="monotone"
                    dataKey="unlicensed"
                    name="Unlicensed"
                    stackId="1"
                    stroke="#ef4444"
                    fill={`url(#${gradientId}-unlicensed)`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Prop Firm Breakdown */}
        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              Prop Firm Breakdown
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Distribution by platform and average time to failure
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {propFirmBreakdown.map((firm) => (
                <div key={firm.name} className="flex items-center gap-3">
                  <div className="w-32 text-sm">{firm.name}</div>
                  <div className="flex-1">
                    <div className="h-6 overflow-hidden rounded-full bg-muted/30">
                      <div
                        className="h-full rounded-full bg-[#f87171]/70 transition-all duration-500"
                        style={{ width: `${firm.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm font-medium">
                    {firm.percentage}%
                  </div>
                  <div className="w-20 text-right text-xs text-muted-foreground">
                    TTF: {firm.avgTimeToFail}d
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Flags */}
      <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Active Risk Flags</CardTitle>
          <p className="text-sm text-muted-foreground">
            Synthetic risk indicators based on behavioural patterns
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskFlags.map((flag) => (
              <div
                key={flag.id}
                className="flex items-start gap-4 rounded-2xl border border-border/40 bg-muted/20 p-4"
              >
                <div
                  className="mt-0.5 h-3 w-3 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: severityColors[flag.severity] }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{flag.type}</p>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: `${severityColors[flag.severity]}20`,
                        color: severityColors[flag.severity],
                      }}
                    >
                      {flag.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {flag.description}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {flag.affectedTraders} traders affected
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
