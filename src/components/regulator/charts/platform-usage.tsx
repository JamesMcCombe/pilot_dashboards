"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  platformUsageData,
  platformMigrationTrend,
  platformInsights,
  MULTI_PLATFORM_PCT,
} from "@/data/regulator/platform-usage";

const platformColors = {
  MT4: "#f87171",
  MT5: "#fbbf24",
  NinjaTrader: "#53f6c5",
  IBKR: "#6ea8ff",
  Other: "#a78bfa",
};

export function PlatformUsage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Platform Distribution */}
        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              Platform Distribution
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {MULTI_PLATFORM_PCT}% of traders use multiple platforms
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={platformUsageData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(124, 141, 173, 0.2)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "#7c8dad", fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="platform"
                    tick={{ fill: "#7c8dad", fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f1d36",
                      border: "1px solid rgba(124, 141, 173, 0.3)",
                      borderRadius: "12px",
                    }}
                    formatter={(value: number) => [`${value}%`, "Usage"]}
                  />
                  <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                    {platformUsageData.map((entry) => (
                      <rect
                        key={entry.platform}
                        fill={platformColors[entry.platform]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Migration Trend */}
        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              Platform Migration Trend
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              6-month platform usage shifts
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={platformMigrationTrend}
                  margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                >
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
                  <Line
                    type="monotone"
                    dataKey="mt4"
                    name="MT4"
                    stroke="#f87171"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="mt5"
                    name="MT5"
                    stroke="#fbbf24"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="ninjaTrader"
                    name="NinjaTrader"
                    stroke="#53f6c5"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="ibkr"
                    name="IBKR"
                    stroke="#6ea8ff"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Insights Grid */}
      <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            Platform Risk Profiles
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Behavioural metrics by platform type
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(Object.entries(platformInsights) as [keyof typeof platformInsights, typeof platformInsights.MT4][]).map(
              ([platform, insights]) => (
                <div
                  key={platform}
                  className="rounded-2xl border border-border/40 bg-muted/20 p-4"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: platformColors[platform as keyof typeof platformColors],
                      }}
                    />
                    <p className="font-medium">{platform}</p>
                  </div>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prop Firm Usage</span>
                      <span
                        className={
                          insights.propFirmUsage > 50
                            ? "text-[#f87171]"
                            : "text-foreground"
                        }
                      >
                        {insights.propFirmUsage}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Leverage</span>
                      <span>1:{insights.avgLeverage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stop-Loss Rate</span>
                      <span
                        className={
                          insights.stopLossRate < 50
                            ? "text-[#f97316]"
                            : "text-primary"
                        }
                      >
                        {insights.stopLossRate}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {insights.commonInstruments.map((inst) => (
                      <span
                        key={inst}
                        className="rounded-full bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {inst}
                      </span>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
