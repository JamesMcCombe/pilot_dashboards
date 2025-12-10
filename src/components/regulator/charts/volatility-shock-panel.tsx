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
  ReferenceArea,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Info,
  TrendingUp,
  AlertTriangle,
  Users,
  Zap,
  Clock,
  Activity,
} from "lucide-react";
import {
  volatilityShockEvents,
  shockTimeSeriesData,
  SHOCK_SUMMARY,
  SHOCK_CATEGORY_COLORS,
  SHOCK_CATEGORY_LABELS,
  type VolatilityShockEvent,
  type ShockTimeSeriesPoint,
} from "@/data/regulator/volatility-shocks";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type MetricType = "leverage" | "clusterScore" | "lossRate" | "rhi";

const metricConfig: Record<MetricType, { label: string; color: string; format: (v: number) => string }> = {
  leverage: { label: "Leverage", color: "#f97316", format: (v) => `${v.toFixed(1)}x` },
  clusterScore: { label: "Cluster Score", color: "#8b5cf6", format: (v) => v.toFixed(0) },
  lossRate: { label: "Loss Rate", color: "#ef4444", format: (v) => `${(v * 100).toFixed(1)}%` },
  rhi: { label: "RHI", color: "#3b82f6", format: (v) => v.toFixed(0) },
};

function ShockEventCard({
  event,
  isSelected,
  onSelect,
}: {
  event: VolatilityShockEvent;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const categoryColor = SHOCK_CATEGORY_COLORS[event.category];
  const date = new Date(event.timestamp);

  return (
    <motion.button
      className={`w-full rounded-2xl border p-4 text-left transition-all ${
        isSelected
          ? "border-primary/50 bg-primary/10"
          : "border-border/40 bg-muted/20 hover:bg-muted/30"
      }`}
      onClick={onSelect}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
            >
              {SHOCK_CATEGORY_LABELS[event.category]}
            </span>
            <span className="text-xs text-muted-foreground">
              {date.toLocaleDateString("en-NZ", { month: "short", day: "numeric" })}
            </span>
          </div>
          <h4 className="mt-1 font-semibold">{event.label}</h4>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-[#ef4444]">
            <TrendingUp className="h-3 w-3" />
            <span className="text-sm font-bold">+{event.rhiBump}</span>
          </div>
          <span className="text-[10px] text-muted-foreground">RHI bump</span>
        </div>
      </div>

      {/* Mini metrics */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-card/50 p-2 text-center">
          <p className="text-[10px] text-muted-foreground">Leverage</p>
          <p className="text-xs">
            <span className="text-muted-foreground">{event.baselineLeverage}x</span>
            <span className="mx-1">→</span>
            <span className="font-semibold text-[#f97316]">{event.shockLeverage}x</span>
          </p>
        </div>
        <div className="rounded-lg bg-card/50 p-2 text-center">
          <p className="text-[10px] text-muted-foreground">Herding</p>
          <p className="text-xs">
            <span className="text-muted-foreground">{event.baselineClusterScore}</span>
            <span className="mx-1">→</span>
            <span className="font-semibold text-[#8b5cf6]">{event.shockClusterScore}</span>
          </p>
        </div>
        <div className="rounded-lg bg-card/50 p-2 text-center">
          <p className="text-[10px] text-muted-foreground">Loss Rate</p>
          <p className="text-xs">
            <span className="text-muted-foreground">{(event.baselineLossRate * 100).toFixed(0)}%</span>
            <span className="mx-1">→</span>
            <span className="font-semibold text-[#ef4444]">{(event.shockLossRate * 100).toFixed(0)}%</span>
          </p>
        </div>
      </div>
    </motion.button>
  );
}

function TimeSeriesChart({
  data,
  metric,
}: {
  data: ShockTimeSeriesPoint[];
  metric: MetricType;
}) {
  const config = metricConfig[metric];

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 25, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={config.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 141, 173, 0.1)" />
          <XAxis
            dataKey="minutesFromEvent"
            tick={{ fill: "#7c8dad", fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
            tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}m`}
          />
          <YAxis
            tick={{ fill: "#7c8dad", fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
            tickFormatter={(v) => config.format(v)}
            domain={["auto", "auto"]}
          />
          <RechartsTooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload[0]) return null;
              const point = payload[0].payload as ShockTimeSeriesPoint;
              return (
                <div className="rounded-xl border border-border bg-popover p-3 shadow-lg">
                  <p className="text-xs text-muted-foreground">
                    {point.minutesFromEvent > 0 ? "+" : ""}{point.minutesFromEvent} min from event
                  </p>
                  <p className="mt-1 font-semibold" style={{ color: config.color }}>
                    {config.label}: {config.format(point[metric])}
                  </p>
                  {point.isShockWindow && (
                    <p className="mt-1 text-xs text-[#fbbf24]">⚡ Shock Window</p>
                  )}
                </div>
              );
            }}
          />
          {/* Shock window highlight */}
          <ReferenceArea
            x1={-10}
            x2={60}
            fill="#fbbf24"
            fillOpacity={0.1}
            stroke="#fbbf24"
            strokeOpacity={0.3}
            strokeDasharray="3 3"
          />
          {/* Event marker */}
          <ReferenceLine
            x={0}
            stroke="#fbbf24"
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{
              value: "EVENT",
              position: "top",
              fill: "#fbbf24",
              fontSize: 10,
            }}
          />
          <Area
            type="monotone"
            dataKey={metric}
            stroke={config.color}
            strokeWidth={2}
            fill={`url(#gradient-${metric})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function VolatilityShockPanel() {
  const [selectedEvent, setSelectedEvent] = useState<VolatilityShockEvent>(volatilityShockEvents[0]);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("leverage");

  const timeSeriesData = shockTimeSeriesData[selectedEvent.eventId];

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">
              Volatility Shock Response
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  This analysis shows how NZ retail traders respond to market volatility 
                  shocks. During high-volatility events, we observe increased leverage usage, 
                  higher herding behavior, and elevated loss rates. All data is synthetic 
                  for demonstration purposes.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="rounded-full bg-[#fbbf24]/10 px-3 py-1 text-xs font-medium text-[#fbbf24]">
            Synthetic Analysis
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          How NZ traders react to volatility spikes: clustering, leverage, and survival patterns
        </p>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-5 gap-3">
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <Zap className="h-3.5 w-3.5" />
              <span className="text-xs">Events</span>
            </div>
            <p className="mt-1 text-xl font-bold">{SHOCK_SUMMARY.totalEvents}</p>
          </div>
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <Activity className="h-3.5 w-3.5" />
              <span className="text-xs">Avg Leverage ↑</span>
            </div>
            <p className="mt-1 text-xl font-bold text-[#f97316]">+{SHOCK_SUMMARY.avgLeverageIncrease}%</p>
          </div>
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs">Avg Herding ↑</span>
            </div>
            <p className="mt-1 text-xl font-bold text-[#8b5cf6]">+{SHOCK_SUMMARY.avgClusterIncrease}%</p>
          </div>
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span className="text-xs">Avg Loss Rate ↑</span>
            </div>
            <p className="mt-1 text-xl font-bold text-[#ef4444]">+{SHOCK_SUMMARY.avgLossRateIncrease}%</p>
          </div>
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-xs">Avg RHI Bump</span>
            </div>
            <p className="mt-1 text-xl font-bold text-[#3b82f6]">+{SHOCK_SUMMARY.avgRHIBump}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          {/* Event List */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Recent Shock Events</h4>
            <div className="max-h-[500px] space-y-2 overflow-y-auto pr-2">
              {volatilityShockEvents.map((event) => (
                <ShockEventCard
                  key={event.eventId}
                  event={event}
                  isSelected={selectedEvent.eventId === event.eventId}
                  onSelect={() => setSelectedEvent(event)}
                />
              ))}
            </div>
          </div>

          {/* Time Series Chart */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{selectedEvent.label}</h4>
                <p className="text-xs text-muted-foreground">
                  <Clock className="mr-1 inline h-3 w-3" />
                  {new Date(selectedEvent.timestamp).toLocaleString("en-NZ")}
                </p>
              </div>
              {/* Metric selector */}
              <div className="flex gap-1 rounded-xl bg-muted/20 p-1">
                {(Object.keys(metricConfig) as MetricType[]).map((metric) => (
                  <button
                    key={metric}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      selectedMetric === metric
                        ? "bg-card shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setSelectedMetric(metric)}
                    style={selectedMetric === metric ? { color: metricConfig[metric].color } : {}}
                  >
                    {metricConfig[metric].label}
                  </button>
                ))}
              </div>
            </div>

            <TimeSeriesChart data={timeSeriesData} metric={selectedMetric} />

            {/* Before/After Comparison */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              <div className="rounded-xl border border-border/40 p-3">
                <p className="text-xs text-muted-foreground">Leverage</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[#f97316]">{selectedEvent.shockLeverage}x</span>
                  <span className="text-xs text-muted-foreground">
                    (was {selectedEvent.baselineLeverage}x)
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#f97316]">+{selectedEvent.leverageChange.toFixed(0)}%</p>
              </div>
              <div className="rounded-xl border border-border/40 p-3">
                <p className="text-xs text-muted-foreground">Cluster Score</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[#8b5cf6]">{selectedEvent.shockClusterScore}</span>
                  <span className="text-xs text-muted-foreground">
                    (was {selectedEvent.baselineClusterScore})
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#8b5cf6]">+{selectedEvent.clusterChange.toFixed(0)}%</p>
              </div>
              <div className="rounded-xl border border-border/40 p-3">
                <p className="text-xs text-muted-foreground">Loss Rate</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[#ef4444]">
                    {(selectedEvent.shockLossRate * 100).toFixed(0)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (was {(selectedEvent.baselineLossRate * 100).toFixed(0)}%)
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#ef4444]">+{selectedEvent.lossRateChange.toFixed(0)}%</p>
              </div>
              <div className="rounded-xl border border-primary/40 bg-primary/5 p-3">
                <p className="text-xs text-muted-foreground">RHI During Shock</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-primary">{selectedEvent.shockRHI}</span>
                  <span className="text-xs text-muted-foreground">
                    (was {selectedEvent.baselineRHI})
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-primary">+{selectedEvent.rhiBump} bump</p>
              </div>
            </div>

            {/* Additional Event Stats */}
            <div className="mt-3 flex gap-4 rounded-xl bg-muted/10 p-3 text-xs text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">{selectedEvent.affectedTraders}</span> traders affected
              </div>
              <div>
                <span className="font-medium text-foreground">{currencyFormatter.format(selectedEvent.avgLossDuringShock)}</span> avg loss
              </div>
              <div>
                <span className="font-medium text-foreground">{selectedEvent.peakVolatility}</span> peak VIX
              </div>
            </div>
          </div>
        </div>

        {/* Interpretation Text */}
        <div className="mt-6 rounded-2xl border border-[#fbbf24]/30 bg-[#fbbf24]/5 p-4">
          <div className="flex items-start gap-3">
            <Zap className="mt-0.5 h-5 w-5 text-[#fbbf24]" />
            <div>
              <h4 className="font-medium text-[#fbbf24]">Shock Response Pattern</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Synthetic example showing how volatility events can trigger spikes in leverage, 
                herding and loss rates among NZ traders. During the highlighted shock window, 
                traders exhibit significantly elevated risk-taking behavior, with leverage 
                increasing by an average of {SHOCK_SUMMARY.avgLeverageIncrease}% and clustering 
                scores jumping {SHOCK_SUMMARY.avgClusterIncrease}%. This translates to a temporary 
                RHI bump of +{SHOCK_SUMMARY.avgRHIBump} points on average.
              </p>
            </div>
          </div>
        </div>

        {/* RHI Correlation Note */}
        <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
          <span className="font-medium text-primary">RHI Integration: </span>
          The &ldquo;Volatility Chasing&rdquo; factor in the RHI calculation captures this behavior. 
          Traders who consistently exhibit elevated activity during high-volatility windows 
          receive higher risk scores, contributing to overall Retail Harm Index values.
        </div>
      </CardContent>
    </Card>
  );
}
