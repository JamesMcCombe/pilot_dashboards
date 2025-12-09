"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { useDashboardMode } from "./dashboard-mode-context";
import { HelpTooltip } from "@/components/help/help-tooltip";

export function VolumeSimulator() {
  const { mode } = useDashboardMode();
  const isWithoutPilot = mode === "withoutPilot";

  const [totalMembers, setTotalMembers] = useState(50_000);
  const [adoptionPct, setAdoptionPct] = useState(45);
  const [tradesPerDay, setTradesPerDay] = useState(6);
  const [nominalVolumeYards, setNominalVolumeYards] = useState(5);
  const [avgProfitPerTrade, setAvgProfitPerTrade] = useState(100);

  const effectiveAdoptionPct = isWithoutPilot ? 5 : adoptionPct;
  const effectiveTradesPerDay = isWithoutPilot
    ? Math.max(1, Math.round(tradesPerDay * 0.65))
    : tradesPerDay;
  const effectiveAvgProfitPerTrade = isWithoutPilot
    ? Math.max(10, Math.round(avgProfitPerTrade * 0.75))
    : avgProfitPerTrade;

  const copiers = Math.round(totalMembers * (effectiveAdoptionPct / 100));
  const dailyTrades = Math.round(copiers * effectiveTradesPerDay);

  // Demo simplification: treat nominal volume as average per-copier trade size measured in yards.
  // Daily copied volume therefore scales with both active copiers and their trade cadence.
  const dailyCopiedVolume = copiers * effectiveTradesPerDay * nominalVolumeYards * 1_000_000;

  const nominalVolumeFactor = nominalVolumeYards / 5;
  const adjustedAvgProfitPerTrade = effectiveAvgProfitPerTrade * nominalVolumeFactor;

  const feePoolDaily = dailyTrades * adjustedAvgProfitPerTrade * 0.03;
  const navigatorShare = feePoolDaily * 0.5;
  const pilotShare = feePoolDaily * 0.25;
  const brokerShare = feePoolDaily * 0.25;
  const monthlyRunRate = feePoolDaily * 30;

  const feeTrendData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => ({
      day: `D${index + 1}`,
      fee:
        feePoolDaily > 0
          ? feePoolDaily * (0.78 + index * 0.05)
          : 0,
    }));
  }, [feePoolDaily]);

  const modeBadge = isWithoutPilot ? (
    <HelpTooltip text="Baseline mode strips out Pilot uplift by capping adoption, trades, and profit so you can contrast with the true reality." asChild indicator={false}>
      <Badge className="bg-muted/60 text-muted-foreground" variant="secondary">
        Baseline mode adjustments applied
      </Badge>
    </HelpTooltip>
  ) : (
    <HelpTooltip text="With Pilot reflects copy trading uplift from Navigator overlays, keeping adoption and profits boosted." asChild indicator={false}>
      <Badge className="bg-primary/15 text-primary" variant="secondary">
        With Pilot uplift enabled
      </Badge>
    </HelpTooltip>
  );

  const controlHelp: Record<string, string> = {
    "Total Members": "Total funded customers you could convert into copiers; raising this expands the funnel top.",
    "Copy Trading Adoption %": "Percentage of members currently copying at least one navigator; a key driver of active copiers.",
    "Trades per Copier per Day": "Average copied trades each follower executes daily; higher cadence boosts fees.",
    "Nominal Volume per Day": "Average notional size per copier (1 yard ≈ $1M). Larger trades create more fee dollars.",
    "Average Profit per Trade": "Gross profit per copied trade before the 3% fee split. Dialling this changes the fee pool baseline.",
  };

  const metricHelp: Record<string, string> = {
    "Active Copiers": "Number of customers copying at least one navigator based on the member and adoption inputs.",
    "Daily Trades": "Total copied trades per day (active copiers × trades per copier).",
    "Daily Copied Volume": "Total notional size of all copied trades in a day, based on cadence and volume per trade.",
    "Daily 3% Fee Pool": "Gross daily fees assuming the broker monetises 3% of copied profits across the book.",
    "Navigator Share (50%)": "Portion of the fee pool paid out to navigators as their revenue share.",
    "Pilot Share (25%)": "Pilot or overlay services share of the daily fee pool.",
    "Broker Share (25%)": "Broker take-home from the fee split; this is the metric most executives care about.",
    "Monthly Run Rate": "Projected monthly broker revenue if today’s assumptions held for an entire month.",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="rounded-3xl border-2 border-border/60 bg-card/85 shadow-none transition-transform duration-200 hover:-translate-y-1 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary/40">
        <CardHeader className="flex flex-col gap-3 pb-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <HelpTooltip
              text="Interactive model to estimate broker revenue from copy trading based on adoption, volume, and fee-split levers."
              asChild
              indicator={false}
            >
              <CardTitle className="text-lg font-semibold text-foreground">
                Copy Trading Economics Model
              </CardTitle>
            </HelpTooltip>
            {modeBadge}
          </div>
          <p className="text-sm text-muted-foreground">
            Model broker revenue from copy trading adoption and volume assumptions. Adjust inputs to explore fee pool dynamics across different scenarios.
          </p>
        </CardHeader>
        <CardContent className="grid gap-8 p-6 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:p-8">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col"
          >
            <div className="rounded-[32px] border-2 border-dashed border-primary/40 bg-primary/5 p-5">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-primary/80">Demo Inputs</p>
                  <p className="text-sm text-muted-foreground">Edit these assumptions live to narrate the economics story.</p>
                </div>
                <Badge variant="secondary" className="border border-primary/40 bg-primary/15 text-primary">
                  Editable
                </Badge>
              </div>
              <div className="flex flex-col gap-6">
                <ControlField
                  label="Total Members"
                  valueDisplay={formatNumber(totalMembers)}
                  helpText={controlHelp["Total Members"]}
                >
                  <Slider
                    min={1_000}
                    max={200_000}
                    step={1_000}
                    value={[totalMembers]}
                    onValueChange={([value]) => setTotalMembers(value)}
                  />
                </ControlField>

                <ControlField
                  label="Copy Trading Adoption %"
                  valueDisplay={`${effectiveAdoptionPct}%`}
                  hint={
                    isWithoutPilot
                      ? "Baseline caps adoption at 5%"
                      : undefined
                  }
                  helpText={controlHelp["Copy Trading Adoption %"]}
                >
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[effectiveAdoptionPct]}
                    onValueChange={([value]) =>
                      !isWithoutPilot && setAdoptionPct(value)
                    }
                    disabled={isWithoutPilot}
                  />
                </ControlField>

                <ControlField
                  label="Trades per Copier per Day"
                  valueDisplay={`${effectiveTradesPerDay}`}
                  hint={
                    isWithoutPilot
                      ? "Baseline reduces activity by ~35%"
                      : undefined
                  }
                  helpText={controlHelp["Trades per Copier per Day"]}
                >
                  <Slider
                    min={1}
                    max={20}
                    step={1}
                    value={[effectiveTradesPerDay]}
                    onValueChange={([value]) =>
                      !isWithoutPilot && setTradesPerDay(value)
                    }
                    disabled={isWithoutPilot}
                  />
                </ControlField>

                <ControlField
                  label="Nominal Volume per Day"
                  valueDisplay={`${nominalVolumeYards} yards`}
                  helpText={controlHelp["Nominal Volume per Day"]}
                  hint={`${nominalVolumeYards} yards = ${formatCurrency(
                    nominalVolumeYards * 1_000_000,
                  )} notional`}
                >
                  <Input
                    type="number"
                    min={1}
                    step={0.5}
                    value={nominalVolumeYards}
                    onChange={(event) =>
                      setNominalVolumeYards(Math.max(1, Number(event.target.value) || 1))
                    }
                    className="h-11 rounded-2xl border-border/60 bg-sidebar/60 text-sm"
                  />
                </ControlField>

                <ControlField
                  label="Average Profit per Trade"
                  valueDisplay={formatCurrency(effectiveAvgProfitPerTrade)}
                  hint={
                    isWithoutPilot
                      ? "Baseline trims profits by ~25%"
                      : undefined
                  }
                  helpText={controlHelp["Average Profit per Trade"]}
                >
                  <Input
                    type="number"
                    min={10}
                    step={10}
                    value={isWithoutPilot ? effectiveAvgProfitPerTrade : avgProfitPerTrade}
                    onChange={(event) => {
                      if (isWithoutPilot) return;
                      const next = Number(event.target.value) || 0;
                      setAvgProfitPerTrade(Math.max(10, next));
                    }}
                    className="h-11 rounded-2xl border-border/60 bg-sidebar/60 text-sm"
                    disabled={isWithoutPilot}
                  />
                </ControlField>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-3">
              <MetricRow label="Active Copiers" value={formatNumber(copiers)} helpText={metricHelp["Active Copiers"]} />
              <MetricRow label="Daily Trades" value={formatNumber(dailyTrades)} helpText={metricHelp["Daily Trades"]} />
              <MetricRow
                label="Daily Copied Volume"
                value={formatCurrency(dailyCopiedVolume)}
                helpText={metricHelp["Daily Copied Volume"]}
              />
              <MetricRow
                label="Daily 3% Fee Pool"
                value={formatCurrency(feePoolDaily)}
                helpText={metricHelp["Daily 3% Fee Pool"]}
              />
              <MetricRow
                label="Navigator Share (50%)"
                value={formatCurrency(navigatorShare)}
                helpText={metricHelp["Navigator Share (50%)"]}
              />
              <MetricRow
                label="Pilot Share (25%)"
                value={formatCurrency(pilotShare)}
                helpText={metricHelp["Pilot Share (25%)"]}
              />
              <MetricRow
                label="Broker Share (25%)"
                value={formatCurrency(brokerShare)}
                highlight
                helpText={metricHelp["Broker Share (25%)"]}
              />
              <MetricRow
                label="Monthly Run Rate"
                value={formatCurrency(monthlyRunRate)}
                helpText={metricHelp["Monthly Run Rate"]}
              />
            </div>

            <HelpTooltip text="Shows the daily fee pool trend for the last week using the current assumptions so you can talk about momentum.">
              <div className="rounded-3xl border border-border/40 bg-sidebar/40 p-5">
                <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  <span>Fee Trend</span>
                  <span>{mode === "withPilot" ? "With Pilot" : "Baseline"}</span>
                </div>
                {feePoolDaily > 0 ? (
                  <div className="h-32 w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={120}>
                      <AreaChart data={feeTrendData} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="feeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#53f6c5" stopOpacity={0.55} />
                            <stop offset="95%" stopColor="#53f6c5" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" hide />
                        <YAxis hide domain={[0, "auto"]} />
                        <Tooltip
                          cursor={{ stroke: "rgba(83,246,197,0.4)", strokeWidth: 2 }}
                          contentStyle={{
                            backgroundColor: "rgba(7,20,44,0.85)",
                            borderRadius: 12,
                            border: "1px solid rgba(83,246,197,0.2)",
                            color: "white",
                          }}
                          formatter={(value: number) => [formatCurrency(value), "Fee"]}
                        />
                        <Area
                          type="monotone"
                          dataKey="fee"
                          stroke="#53f6c5"
                          strokeWidth={2}
                          fill="url(#feeGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-border/40 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    No fees generated with current inputs
                  </div>
                )}
              </div>
            </HelpTooltip>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ControlField({
  label,
  valueDisplay,
  children,
  hint,
  helpText,
}: {
  label: string;
  valueDisplay: string;
  children: React.ReactNode;
  hint?: string;
  helpText?: string;
}) {
  const content = (
    <div className="group rounded-3xl border-2 border-primary/30 bg-[rgba(5,17,36,0.9)] p-4 transition focus-within:border-primary/60">
      <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-muted-foreground/80">
        <span>{label}</span>
        <span className="font-semibold text-primary">{valueDisplay}</span>
      </div>
      <div className="space-y-3">
        {children}
        {hint ? <p className="text-xs text-muted-foreground/70">{hint}</p> : null}
      </div>
    </div>
  );

  return helpText ? <HelpTooltip text={helpText}>{content}</HelpTooltip> : content;
}

function MetricRow({
  label,
  value,
  highlight,
  helpText,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  helpText?: string;
}) {
  const row = (
    <motion.div
      layout
      className={cn(
        "flex items-center justify-between rounded-3xl border border-border/40 bg-sidebar/35 px-5 py-3",
        highlight && "border-primary/50 bg-primary/10 text-primary",
      )}
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
    >
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className={cn("text-sm font-semibold text-foreground", highlight && "text-primary")}
      >
        {value}
      </motion.span>
    </motion.div>
  );

  return helpText ? <HelpTooltip text={helpText}>{row}</HelpTooltip> : row;
}
