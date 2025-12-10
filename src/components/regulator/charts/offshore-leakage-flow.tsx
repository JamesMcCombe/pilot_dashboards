"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  DollarSign,
  BarChart3,
  GitCompare,
  Building2,
} from "lucide-react";
import {
  offshoreLeakageDestinations,
  TOTAL_OFFSHORE_TRADERS,
  TOTAL_OFFSHORE_LOSSES,
  AVG_OFFSHORE_LOSS,
  type OffshoreDestination,
} from "@/data/regulator/broker-exposure";
import { cn } from "@/lib/utils";

const riskLevelColors = {
  critical: { bg: "bg-[#ef4444]/20", text: "text-[#ef4444]", border: "border-[#ef4444]/40" },
  high: { bg: "bg-[#f97316]/20", text: "text-[#f97316]", border: "border-[#f97316]/40" },
  medium: { bg: "bg-[#fbbf24]/20", text: "text-[#fbbf24]", border: "border-[#fbbf24]/40" },
  low: { bg: "bg-[#53f6c5]/20", text: "text-[#53f6c5]", border: "border-[#53f6c5]/40" },
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

// Source panel view types
type SourcePanelView = "trend" | "stats" | "compare" | "sources";

const sourcePanelViews: { id: SourcePanelView; label: string; icon: React.ReactNode }[] = [
  { id: "trend", label: "Trend", icon: <TrendingUp className="h-3 w-3" /> },
  { id: "stats", label: "Stats", icon: <BarChart3 className="h-3 w-3" /> },
  { id: "compare", label: "Compare", icon: <GitCompare className="h-3 w-3" /> },
  { id: "sources", label: "Sources", icon: <Building2 className="h-3 w-3" /> },
];

// Synthetic trend data (6 months)
const leakageTrendData = [
  { month: "Jun", pct: 58 },
  { month: "Jul", pct: 60 },
  { month: "Aug", pct: 62 },
  { month: "Sep", pct: 64 },
  { month: "Oct", pct: 65 },
  { month: "Nov", pct: 65.4 },
];

// Source broker breakdown (where traders come FROM before leaking)
const sourceBreakdown = [
  { name: "IG Markets", pct: 28 },
  { name: "BlackBull", pct: 24 },
  { name: "CMC Markets", pct: 18 },
  { name: "Plus500", pct: 16 },
  { name: "Others", pct: 14 },
];

interface OffshoreLeakageFlowProps {
  highlightedCategory?: string | null;
  compact?: boolean;
  showHeader?: boolean;
}

export function OffshoreLeakageFlow({
  highlightedCategory = null,
  compact = false,
  showHeader = true,
}: OffshoreLeakageFlowProps) {
  const [hoveredDestination, setHoveredDestination] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<OffshoreDestination | null>(null);
  const [sourcePanelView, setSourcePanelView] = useState<SourcePanelView>("trend");
  
  // Calculate comparison stats
  const regulatedPct = 34.6; // % staying with NZ/AU regulated
  const unregulatedPct = 100 - regulatedPct;

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      {showHeader && (
        <CardHeader className={compact ? "pb-2 pt-4" : "pb-2"}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">
                Offshore Leakage Flow
              </CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    This visualization shows the estimated distribution of NZ trading 
                    activity flowing into offshore environments. All data is synthetic 
                    and for demonstration purposes only. In production, this would be 
                    derived from anonymised behavioural signals.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="rounded-full bg-[#fbbf24]/10 px-3 py-1 text-xs font-medium text-[#fbbf24]">
              Synthetic Data
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Estimated distribution of NZ trading activity into offshore environments
          </p>
        </CardHeader>
      )}
      <CardContent className={compact ? "pt-4" : ""}>
        {/* Summary Stats */}
        {!compact && (
          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/20 p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span className="text-xs">Traders</span>
              </div>
              <p className="mt-1 text-xl font-bold">{TOTAL_OFFSHORE_TRADERS.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-muted/20 p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                <DollarSign className="h-3.5 w-3.5" />
                <span className="text-xs">Total Losses</span>
              </div>
              <p className="mt-1 text-xl font-bold text-[#f87171]">
                {currencyFormatter.format(TOTAL_OFFSHORE_LOSSES)}
              </p>
            </div>
            <div className="rounded-xl bg-muted/20 p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span className="text-xs">Avg Loss</span>
              </div>
              <p className="mt-1 text-xl font-bold text-[#f97316]">
                {currencyFormatter.format(AVG_OFFSHORE_LOSS)}
              </p>
            </div>
          </div>
        )}

        {/* Sankey-style Flow Visualization */}
        <div className="relative grid grid-cols-[auto_1fr_auto] items-stretch gap-0 py-4">
          {/* Source Node */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="flex h-72 w-24 flex-col items-center justify-center rounded-2xl border-2 border-primary/40 bg-primary/10">
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground">Source</p>
                <p className="mt-1 text-xs font-semibold text-primary">NZ Retail</p>
                <p className="text-xs font-semibold text-primary">Traders</p>
                <p className="mt-2 text-2xl font-bold text-primary">100%</p>
              </div>
            </div>
          </div>

          {/* Center Panel - Full Width Info */}
          <div className="relative flex min-w-0 py-2">
            <div className="flex h-72 w-full flex-col rounded-2xl border border-border/40 bg-muted/10 p-4">
              {/* Toggle Pills */}
              <div className="mb-3 flex gap-1 rounded-xl bg-muted/30 p-1">
                {sourcePanelViews.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => setSourcePanelView(view.id)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all",
                      sourcePanelView === view.id
                        ? "bg-primary/20 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    )}
                  >
                    {view.icon}
                    <span>{view.label}</span>
                  </button>
                ))}
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {sourcePanelView === "trend" && (
                    <motion.div
                      key="trend"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      className="flex h-full flex-col"
                    >
                      <p className="mb-2 text-xs font-medium text-muted-foreground">
                        Offshore Leakage Trend (6 months)
                      </p>
                      <div className="flex flex-1 items-end gap-2 px-2">
                        {leakageTrendData.map((d) => (
                          <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                            <div
                              className="w-full rounded bg-gradient-to-t from-[#f87171] to-[#f87171]/60 transition-all"
                              style={{ height: `${(d.pct - 50) * 6}px` }}
                            />
                            <span className="text-[10px] text-muted-foreground">{d.month}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[#f87171]/10 py-2">
                        <TrendingUp className="h-4 w-4 text-[#f87171]" />
                        <span className="text-sm font-bold text-[#f87171]">+7.4% growth</span>
                      </div>
                    </motion.div>
                  )}

                  {sourcePanelView === "stats" && (
                    <motion.div
                      key="stats"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      className="flex h-full flex-col justify-center gap-3"
                    >
                      <div className="rounded-xl bg-[#f87171]/10 p-4 text-center">
                        <p className="text-xs text-muted-foreground">Unregulated Flow</p>
                        <p className="text-3xl font-bold text-[#f87171]">65.4%</p>
                        <p className="text-[10px] text-muted-foreground">of NZ traders offshore</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl bg-muted/30 p-3 text-center">
                          <p className="text-[10px] text-muted-foreground">Avg Loss</p>
                          <p className="text-lg font-bold text-[#f97316]">$3,045</p>
                        </div>
                        <div className="rounded-xl bg-muted/30 p-3 text-center">
                          <p className="text-[10px] text-muted-foreground">6mo Growth</p>
                          <p className="text-lg font-bold text-[#f87171]">+34%</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {sourcePanelView === "compare" && (
                    <motion.div
                      key="compare"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      className="flex h-full flex-col justify-center"
                    >
                      <p className="mb-3 text-center text-xs font-medium text-muted-foreground">
                        Where NZ Traders Are Trading
                      </p>
                      <div className="flex h-10 w-full overflow-hidden rounded-xl">
                        <div
                          className="flex items-center justify-center bg-[#53f6c5]/70"
                          style={{ width: `${regulatedPct}%` }}
                        >
                          <span className="text-sm font-bold text-background">
                            {regulatedPct}%
                          </span>
                        </div>
                        <div
                          className="flex items-center justify-center bg-[#f87171]/70"
                          style={{ width: `${unregulatedPct}%` }}
                        >
                          <span className="text-sm font-bold text-white">
                            {unregulatedPct.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-[#53f6c5]" />
                          <span className="text-muted-foreground">NZ/AU Regulated</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-[#f87171]" />
                          <span className="text-muted-foreground">Offshore</span>
                        </div>
                      </div>
                      <p className="mt-4 text-center text-[10px] text-muted-foreground">
                        Nearly 2 in 3 traders operate outside regulatory oversight
                      </p>
                    </motion.div>
                  )}

                  {sourcePanelView === "sources" && (
                    <motion.div
                      key="sources"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      className="flex h-full flex-col"
                    >
                      <p className="mb-2 text-xs font-medium text-muted-foreground">
                        Which NZ Brokers Are Traders Leaving?
                      </p>
                      <div className="flex flex-1 flex-col justify-center gap-2">
                        {sourceBreakdown.map((src) => (
                          <div key={src.name} className="flex items-center gap-3">
                            <span className="w-20 text-xs text-muted-foreground truncate">
                              {src.name}
                            </span>
                            <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted/30">
                              <motion.div
                                className="h-full rounded-full bg-primary/70"
                                initial={{ width: 0 }}
                                animate={{ width: `${src.pct * 3}%` }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                              />
                            </div>
                            <span className="w-8 text-right text-xs font-medium">
                              {src.pct}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Destination Nodes */}
          <div className="flex h-72 flex-col justify-center gap-1.5 py-2">
            {offshoreLeakageDestinations.map((dest) => {
              const isHovered = hoveredDestination === dest.id;
              const isHighlighted = highlightedCategory === null || highlightedCategory === dest.id;
              const riskColors = riskLevelColors[dest.riskLevel];

              return (
                <motion.button
                  key={dest.id}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition-all ${
                    isHovered ? riskColors.border : "border-border/40"
                  } ${isHovered ? riskColors.bg : "bg-muted/20 hover:bg-muted/30"}`}
                  style={{ opacity: isHighlighted ? 1 : 0.4 }}
                  onMouseEnter={() => setHoveredDestination(dest.id)}
                  onMouseLeave={() => setHoveredDestination(null)}
                  onClick={() => setSelectedDestination(dest)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: dest.color }}
                  />
                  <div className="flex-1 min-w-[100px]">
                    <p className="text-xs font-medium">{dest.shortName}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {dest.traderCount} traders
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: dest.color }}>
                      {dest.percentage}%
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected Destination Details */}
        <AnimatePresence>
          {selectedDestination && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div
                className={`rounded-2xl border p-4 ${
                  riskLevelColors[selectedDestination.riskLevel].border
                } ${riskLevelColors[selectedDestination.riskLevel].bg}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: selectedDestination.color }}
                      />
                      <h4 className="font-semibold">{selectedDestination.name}</h4>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                          riskLevelColors[selectedDestination.riskLevel].text
                        }`}
                      >
                        {selectedDestination.riskLevel} risk
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {selectedDestination.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedDestination(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-3">
                  <div className="rounded-lg bg-card/50 p-2 text-center">
                    <p className="text-xs text-muted-foreground">Flow Share</p>
                    <p className="text-lg font-bold" style={{ color: selectedDestination.color }}>
                      {selectedDestination.percentage}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-card/50 p-2 text-center">
                    <p className="text-xs text-muted-foreground">Traders</p>
                    <p className="text-lg font-bold">{selectedDestination.traderCount}</p>
                  </div>
                  <div className="rounded-lg bg-card/50 p-2 text-center">
                    <p className="text-xs text-muted-foreground">Avg Loss</p>
                    <p className="text-lg font-bold text-[#f87171]">
                      {currencyFormatter.format(selectedDestination.avgLossPerTrader)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-card/50 p-2 text-center">
                    <p className="text-xs text-muted-foreground">6mo Growth</p>
                    <p className="flex items-center justify-center gap-1 text-lg font-bold text-[#f97316]">
                      <TrendingUp className="h-4 w-4" />
                      {selectedDestination.growthRate}%
                    </p>
                  </div>
                </div>

                {selectedDestination.examples.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground">Examples:</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedDestination.examples.map((ex) => (
                        <span
                          key={ex}
                          className="rounded-full bg-muted/40 px-2 py-0.5 text-xs"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Note about RHI correlation */}
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
          <span className="font-medium text-primary">RHI Correlation Note: </span>
          Higher offshore leakage is associated with elevated Retail Harm Index scores. 
          The &ldquo;Offshore Leakage&rdquo; factor contributes to the overall RHI calculation 
          based on the percentage of traders operating outside regulated environments.
        </div>

        {/* Disclaimer */}
        <div className="mt-3 text-center text-[10px] text-muted-foreground">
          All percentages and trader counts are synthetic estimates for demonstration purposes.
        </div>
      </CardContent>
    </Card>
  );
}
