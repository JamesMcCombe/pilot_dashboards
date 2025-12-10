"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, TrendingUp } from "lucide-react";
import {
  CURRENT_RISK_FACTORS,
  TOP_3_DRIVERS,
  RHI_FROM_DECOMPOSITION,
  type RiskFactor,
} from "@/data/regulator/retail-harm-index";

// Custom tooltip for bar chart
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: RiskFactor }>;
}) {
  if (!active || !payload || !payload[0]) return null;

  const factor = payload[0].payload;

  return (
    <div className="rounded-xl border border-border bg-popover p-3 shadow-lg">
      <p className="font-semibold" style={{ color: factor.color }}>
        {factor.name}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{factor.description}</p>
      <div className="mt-2 space-y-1 text-xs">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Contribution:</span>
          <span className="font-medium">{factor.contribution} pts ({factor.percentOfTotal}%)</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Raw Score:</span>
          <span className="font-medium">{factor.rawScore}/1000</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Weight:</span>
          <span className="font-medium">{(factor.weight * 100).toFixed(0)}%</span>
        </div>
      </div>
      <div className="mt-2 border-t border-border pt-2">
        <p className="text-[10px] text-muted-foreground">{factor.metric}</p>
        <p className="text-xs font-medium">{factor.currentValue}</p>
      </div>
    </div>
  );
}

export function RiskFactorPanel() {
  const [hoveredFactor, setHoveredFactor] = useState<string | null>(null);

  // Prepare chart data - use full names now that we have more space
  const chartData = CURRENT_RISK_FACTORS.map((f) => ({
    ...f,
    displayName: f.name,
  }));

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">
              Risk Factor Decomposition
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  This decomposition shows which behavioural factors contribute most 
                  to the overall Retail Harm Index. Values are synthetic and illustrative. 
                  In production, these would be computed from real anonymised behavioural signals.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="rounded-full bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
            Total: {RHI_FROM_DECOMPOSITION} pts
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Behavioural factors driving the current RHI score
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* Horizontal Bar Chart */}
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <XAxis
                  type="number"
                  domain={[0, "dataMax"]}
                  tick={{ fill: "#7c8dad", fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                />
                <YAxis
                  type="category"
                  dataKey="displayName"
                  tick={{ fill: "#aebbd4", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                  width={155}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="contribution"
                  radius={[0, 6, 6, 0]}
                  onMouseEnter={(data) => setHoveredFactor(data.id ?? null)}
                  onMouseLeave={() => setHoveredFactor(null)}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.id}
                      fill={entry.color}
                      fillOpacity={hoveredFactor === null || hoveredFactor === entry.id ? 0.85 : 0.4}
                      style={{ transition: "fill-opacity 0.2s ease" }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Factor Details */}
          <div className="flex flex-col">
            {/* Top Drivers Summary */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <TrendingUp className="h-4 w-4" />
                Top 3 Drivers Today
              </div>
              <div className="mt-3 space-y-2">
                {TOP_3_DRIVERS.map((factor, index) => (
                  <div
                    key={factor.id}
                    className="flex items-center gap-2"
                    onMouseEnter={() => setHoveredFactor(factor.id)}
                    onMouseLeave={() => setHoveredFactor(null)}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted/30 text-xs font-medium">
                      {index + 1}
                    </span>
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: factor.color }}
                    />
                    <span className="flex-1 text-sm">{factor.name}</span>
                    <span className="text-sm font-semibold" style={{ color: factor.color }}>
                      {factor.percentOfTotal}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Factor Breakdown Table */}
            <div className="mt-4 flex-1 overflow-y-auto">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                All Factors
              </p>
              <div className="space-y-1.5">
                {CURRENT_RISK_FACTORS.map((factor) => (
                  <div
                    key={factor.id}
                    className={`group cursor-pointer rounded-lg p-2 transition-colors ${
                      hoveredFactor === factor.id ? "bg-muted/30" : "hover:bg-muted/20"
                    }`}
                    onMouseEnter={() => setHoveredFactor(factor.id)}
                    onMouseLeave={() => setHoveredFactor(null)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: factor.color }}
                        />
                        <span className="text-xs">{factor.name}</span>
                      </div>
                      <span className="text-xs font-medium">
                        {factor.contribution} pts
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted/30">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${factor.percentOfTotal}%`,
                          backgroundColor: factor.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 rounded-xl border border-[#fbbf24]/30 bg-[#fbbf24]/5 p-3 text-xs text-muted-foreground">
          <span className="font-medium text-[#fbbf24]">Synthetic Decomposition: </span>
          Factor weights and contributions are illustrative. In production, decomposition 
          would be computed from real anonymised cohort behavioural data collected during 
          the SupTech pilot.
        </div>
      </CardContent>
    </Card>
  );
}
