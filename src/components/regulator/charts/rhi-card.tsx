"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  CURRENT_RHI,
  CURRENT_RHI_BAND,
  RHI_TREND_30D,
  RHI_DELTA_30D,
  RHI_DELTA_30D_PCT,
  RHI_90D_HIGH,
  RHI_90D_LOW,
  RHI_90D_AVG,
  DAYS_IN_HIGH_ZONE,
  RHI_THRESHOLDS,
} from "@/data/regulator/retail-harm-index";

export function RHICard() {
  const gradientId = useId();
  
  const deltaIcon = RHI_DELTA_30D > 5 
    ? <TrendingUp className="h-4 w-4" />
    : RHI_DELTA_30D < -5 
      ? <TrendingDown className="h-4 w-4" />
      : <Minus className="h-4 w-4" />;
  
  const deltaColor = RHI_DELTA_30D > 5 
    ? "text-[#ef4444]" 
    : RHI_DELTA_30D < -5 
      ? "text-[#53f6c5]" 
      : "text-muted-foreground";

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Retail Harm Index (RHI)
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Composite indicator of NZ retail trading harm (0–1000, synthetic)
            </p>
          </div>
          <div 
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold"
            style={{ 
              backgroundColor: `${CURRENT_RHI_BAND.color}20`,
              color: CURRENT_RHI_BAND.color,
            }}
          >
            {(CURRENT_RHI_BAND.band === "HIGH" || CURRENT_RHI_BAND.band === "CRITICAL") && (
              <AlertTriangle className="h-4 w-4" />
            )}
            {CURRENT_RHI_BAND.label} Harm
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-[1fr,2fr]">
          {/* Current Score */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-muted/20 p-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <div 
                className="text-7xl font-bold"
                style={{ color: CURRENT_RHI_BAND.color }}
              >
                {CURRENT_RHI}
              </div>
              <div className="mt-1 text-center text-sm text-muted-foreground">
                out of 1000
              </div>
            </motion.div>
            
            {/* Delta */}
            <div className={`mt-4 flex items-center gap-1 ${deltaColor}`}>
              {deltaIcon}
              <span className="text-sm font-medium">
                {RHI_DELTA_30D > 0 ? "+" : ""}{RHI_DELTA_30D} ({RHI_DELTA_30D_PCT}%)
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs 30d ago</span>
            </div>

            {/* Stats */}
            <div className="mt-4 grid w-full grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-card/50 p-2">
                <p className="font-semibold">{RHI_90D_LOW}</p>
                <p className="text-muted-foreground">90d Low</p>
              </div>
              <div className="rounded-lg bg-card/50 p-2">
                <p className="font-semibold">{RHI_90D_AVG}</p>
                <p className="text-muted-foreground">90d Avg</p>
              </div>
              <div className="rounded-lg bg-card/50 p-2">
                <p className="font-semibold">{RHI_90D_HIGH}</p>
                <p className="text-muted-foreground">90d High</p>
              </div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>30-Day Trend</span>
              <span>{DAYS_IN_HIGH_ZONE} days in High/Critical zone (90d)</span>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={RHI_TREND_30D}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id={`${gradientId}-rhi`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CURRENT_RHI_BAND.color} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={CURRENT_RHI_BAND.color} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  {/* Reference areas for harm bands */}
                  <ReferenceArea
                    y1={RHI_THRESHOLDS.CRITICAL.min}
                    y2={1000}
                    fill={RHI_THRESHOLDS.CRITICAL.color}
                    fillOpacity={0.1}
                  />
                  <ReferenceArea
                    y1={RHI_THRESHOLDS.HIGH.min}
                    y2={RHI_THRESHOLDS.CRITICAL.min}
                    fill={RHI_THRESHOLDS.HIGH.color}
                    fillOpacity={0.08}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#7c8dad", fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                    tickFormatter={(date) => {
                      const d = new Date(date);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    }}
                    interval={6}
                  />
                  <YAxis
                    domain={[400, 900]}
                    tick={{ fill: "#7c8dad", fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                    width={35}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f1d36",
                      border: "1px solid rgba(124, 141, 173, 0.3)",
                      borderRadius: "12px",
                    }}
                    labelFormatter={(date) => new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    formatter={(value: number) => [`RHI: ${value}`, ""]}
                  />
                  <ReferenceLine
                    y={RHI_THRESHOLDS.HIGH.min}
                    stroke={RHI_THRESHOLDS.HIGH.color}
                    strokeDasharray="3 3"
                    strokeOpacity={0.6}
                  />
                  <ReferenceLine
                    y={RHI_THRESHOLDS.CRITICAL.min}
                    stroke={RHI_THRESHOLDS.CRITICAL.color}
                    strokeDasharray="3 3"
                    strokeOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="rhi"
                    stroke={CURRENT_RHI_BAND.color}
                    strokeWidth={2}
                    fill={`url(#${gradientId}-rhi)`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Band Legend */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs">
              {Object.entries(RHI_THRESHOLDS).map(([key, threshold]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div 
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: threshold.color }}
                  />
                  <span className="text-muted-foreground">
                    {threshold.label} ({threshold.min}–{threshold.max})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 rounded-xl border border-[#fbbf24]/30 bg-[#fbbf24]/5 p-3 text-xs text-muted-foreground">
          <span className="font-medium text-[#fbbf24]">Synthetic Demo Data: </span>
          RHI uses synthetic indicator data for demonstration purposes only. Real values will be 
          generated from anonymised cohorts in the SupTech pilot.
        </div>
      </CardContent>
    </Card>
  );
}
