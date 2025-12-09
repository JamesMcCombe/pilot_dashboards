"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, TrendingUp, TrendingDown, Zap, BarChart3 } from "lucide-react";
import {
  CURRENT_HERDING_RESULT,
  HERDING_TIME_SERIES,
  HERDING_STATS,
  HERDING_BANDS,
  HERDING_COMPONENTS,
  type HerdingBand,
} from "@/data/regulator/herding-score";

function getBandGradient(band: HerdingBand): string {
  switch (band) {
    case "critical":
      return "from-[#ef4444]/20 to-[#ef4444]/5";
    case "high":
      return "from-[#f97316]/20 to-[#f97316]/5";
    case "medium":
      return "from-[#fbbf24]/20 to-[#fbbf24]/5";
    case "low":
      return "from-[#53f6c5]/20 to-[#53f6c5]/5";
  }
}

export function HerdingScoreCard() {
  const [showComponents, setShowComponents] = useState(false);
  
  const { score, band, bandLabel, bandColor } = CURRENT_HERDING_RESULT;
  const { trend, avg30Day, max30Day, min30Day, spikeCount } = HERDING_STATS;
  
  // Prepare chart data (last 30 days)
  const chartData = HERDING_TIME_SERIES.slice(-30).map((point) => ({
    ...point,
    displayDate: new Date(point.date).toLocaleDateString("en-NZ", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <Card className={`rounded-3xl border-2 border-border/60 bg-gradient-to-br ${getBandGradient(band)}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">
              Herding & Synchronisation Score
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  Quantifies how synchronised NZ trader behaviour is. 0 = fully 
                  independent behaviour; 1000 = tightly synchronised herding. 
                  Higher scores indicate potential coordinated trading patterns 
                  that may amplify market risks.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: `${bandColor}20`, color: bandColor }}
          >
            {bandLabel} Herding
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-[1fr,2fr]">
          {/* Score Display */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-card/50 p-6">
            <p className="text-6xl font-bold" style={{ color: bandColor }}>
              {score}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">/ 1000</p>
            
            {/* Trend indicator */}
            <div className="mt-4 flex items-center gap-2">
              {trend > 0 ? (
                <TrendingUp className="h-4 w-4 text-[#ef4444]" />
              ) : trend < 0 ? (
                <TrendingDown className="h-4 w-4 text-[#53f6c5]" />
              ) : null}
              <span
                className={`text-sm font-medium ${
                  trend > 0 ? "text-[#ef4444]" : trend < 0 ? "text-[#53f6c5]" : "text-muted-foreground"
                }`}
              >
                {trend > 0 ? "+" : ""}{trend} vs last week
              </span>
            </div>

            {/* Band scale */}
            <div className="mt-6 w-full">
              <div className="flex h-2 w-full overflow-hidden rounded-full">
                {Object.entries(HERDING_BANDS).map(([key, config]) => (
                  <div
                    key={key}
                    className="h-full"
                    style={{
                      backgroundColor: config.color,
                      width: `${((config.max - config.min + 1) / 1001) * 100}%`,
                      opacity: key === band ? 1 : 0.3,
                    }}
                  />
                ))}
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>0</span>
                <span>300</span>
                <span>600</span>
                <span>800</span>
                <span>1000</span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-4 grid w-full grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-lg bg-muted/30 p-2">
                <p className="text-muted-foreground">30d Avg</p>
                <p className="font-semibold">{avg30Day}</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-2">
                <p className="text-muted-foreground">30d Range</p>
                <p className="font-semibold">{min30Day}–{max30Day}</p>
              </div>
            </div>
          </div>

          {/* Trend Chart */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">30-Day Trend</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-[#fbbf24]" />
                  <span>{spikeCount} high/critical days</span>
                </div>
              </div>
            </div>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="herdingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={bandColor} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={bandColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 141, 173, 0.1)" />
                  <XAxis
                    dataKey="displayDate"
                    tick={{ fill: "#7c8dad", fontSize: 9 }}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[0, 1000]}
                    tick={{ fill: "#7c8dad", fontSize: 9 }}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                    ticks={[0, 300, 600, 800, 1000]}
                  />
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload[0]) return null;
                      const point = payload[0].payload;
                      const pointBand = HERDING_BANDS[point.band as HerdingBand];
                      return (
                        <div className="rounded-xl border border-border bg-popover p-3 shadow-lg">
                          <p className="text-xs text-muted-foreground">{point.date}</p>
                          <p className="mt-1 text-lg font-bold" style={{ color: pointBand.color }}>
                            {point.score}
                          </p>
                          <p className="text-xs" style={{ color: pointBand.color }}>
                            {pointBand.label} Herding
                          </p>
                          {point.isVolatilitySpike && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-[#fbbf24]">
                              <Zap className="h-3 w-3" /> Volatility Event
                            </p>
                          )}
                          <div className="mt-2 space-y-0.5 text-[10px] text-muted-foreground">
                            <p>Clusters: {point.clusteredEvents}</p>
                            <p>Avg Size: {point.avgClusterSize} traders</p>
                          </div>
                        </div>
                      );
                    }}
                  />
                  {/* Band reference lines */}
                  <ReferenceLine y={300} stroke="#fbbf24" strokeDasharray="3 3" strokeOpacity={0.5} />
                  <ReferenceLine y={600} stroke="#f97316" strokeDasharray="3 3" strokeOpacity={0.5} />
                  <ReferenceLine y={800} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke={bandColor}
                    strokeWidth={2}
                    fill="url(#herdingGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Component Breakdown Toggle */}
        <button
          onClick={() => setShowComponents(!showComponents)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border/40 bg-muted/10 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted/20"
        >
          <BarChart3 className="h-3.5 w-3.5" />
          {showComponents ? "Hide" : "Show"} Score Components
        </button>

        {/* Component Breakdown */}
        {showComponents && (
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            {HERDING_COMPONENTS.map((component) => {
              const componentBand = 
                component.score >= 800 ? "critical" :
                component.score >= 600 ? "high" :
                component.score >= 300 ? "medium" : "low";
              const componentColor = HERDING_BANDS[componentBand].color;
              
              return (
                <div
                  key={component.id}
                  className="rounded-xl border border-border/40 bg-card/50 p-3"
                >
                  <p className="text-xs font-medium">{component.name}</p>
                  <p className="mt-1 text-2xl font-bold" style={{ color: componentColor }}>
                    {component.score}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {(component.weight * 100).toFixed(0)}% weight
                  </p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="mt-1 cursor-help truncate text-[10px] text-muted-foreground underline decoration-dotted">
                        What&apos;s this?
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">{component.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-medium text-primary">Scale:</span>
            <span>0 = fully independent behaviour</span>
            <span>→</span>
            <span>1000 = tightly synchronised herding</span>
            <span className="ml-auto text-[10px]">(synthetic demo data)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
