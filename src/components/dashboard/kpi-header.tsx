"use client";

import { useId, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MetricSparkline } from "@/data/types";
import { cn } from "@/lib/utils";
import { useDashboardMetrics } from "./use-dashboard-metrics";
import { HelpTooltip } from "@/components/help/help-tooltip";
import { HELP_COPY } from "@/components/help/help-text";

type CardConfig = {
  key: string;
  title: string;
  metric: MetricSparkline;
  secondary?: string;
  format: (value: number) => string;
  accent: string;
  showDelta?: boolean;
  deltaComparisonLabel?: string;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

const helpCopy: Record<string, string> = {
  "revenue-with-pilot":
    "Total broker revenue generated today from copy trading, including spread/fee share on all copied trades.",
  "high-quality-revenue":
    "Daily revenue from navigators with a high ValueScore (profitable and relatively low-risk leaders). Indicates how much of your revenue comes from your best leaders.",
  "revenue-baseline":
    "Estimated revenue from the same user base if copy trading and Pilot features were not enabled.",
  "active-copiers":
    "Number of users currently copying at least one navigator, based on recent trade activity.",
  "copied-volume":
    "Total notional volume executed via copy trading signals over the selected period.",
  "blueprint-sales":
    "Revenue from selling strategy blueprints or premium configurations to users.",
  "navigator-revenue":
    "Broker revenue attributed to your single highest-earning leader over the selected period.",
  "new-copiers":
    "Users who started copying for the first time during the current day.",
  "lost-copiers":
    "Users who stopped copying (or became inactive) during the current day.",
  "copier-retention":
    "Percentage of copiers who are still active 30 days after they started copying.",
};

export function KPIHeader() {
  const {
    primary,
    comparison,
    withPilotView,
    baselineView,
    comparisonLabel,
    highQualityNavigatorRevenue,
    highQualityNavigatorRevenuePct,
    highQualityNavigatorRevenueTrend,
    copiedVolumeToday,
    copiedVolumeComparison,
    copyTradingKpis,
  } =
    useDashboardMetrics();

  const highQualityMetric = useMemo<MetricSparkline>(
    () => ({
      value: highQualityNavigatorRevenue,
      trend: highQualityNavigatorRevenueTrend,
    }),
    [highQualityNavigatorRevenue, highQualityNavigatorRevenueTrend],
  );

  const revenueCards = useMemo<CardConfig[]>(() => {
    return [
      {
        key: "revenue-with-pilot",
        title: "Revenue Today (With Pilot)",
        metric: withPilotView.brokerRevenueToday,
        secondary: `vs Baseline ${currencyFormatter.format(
          baselineView.brokerRevenueToday.value,
        )}`,
        format: currencyFormatter.format,
        accent: "#53f6c5",
        showDelta: true,
        deltaComparisonLabel: "Baseline",
      },
      {
        key: "high-quality-revenue",
        title: "High-Quality Navigator Revenue",
        metric: highQualityMetric,
        secondary: `${highQualityNavigatorRevenuePct.toFixed(1)}% of total copy revenue`,
        format: currencyFormatter.format,
        accent: "#51e5ff",
      },
      {
        key: "revenue-baseline",
        title: "Revenue Without Pilot (Baseline)",
        metric: baselineView.brokerRevenueToday,
        secondary: `vs With Pilot ${currencyFormatter.format(
          withPilotView.brokerRevenueToday.value,
        )}`,
        format: currencyFormatter.format,
        accent: "#92a1c0",
        showDelta: true,
        deltaComparisonLabel: "With Pilot",
      },
    ];
  }, [withPilotView, baselineView, highQualityMetric, highQualityNavigatorRevenuePct]);

  const productCards = useMemo<CardConfig[]>(() => {
    return [
      {
        key: "active-copiers",
        title: "Active Copiers",
        metric: primary.activeCopiers,
        secondary: `vs ${comparisonLabel} ${numberFormatter.format(
          comparison.activeCopiers.value,
        )}`,
        format: (value) => numberFormatter.format(value),
        accent: "#8da9ff",
        showDelta: true,
        deltaComparisonLabel: comparisonLabel,
      },
      {
        key: "copied-volume",
        title: "Copied Volume",
        metric: copiedVolumeToday,
        secondary: `vs ${comparisonLabel} ${currencyFormatter.format(
          copiedVolumeComparison.value,
        )}`,
        format: currencyFormatter.format,
        accent: "#53f6c5",
        showDelta: true,
        deltaComparisonLabel: comparisonLabel,
      },
      {
        key: "blueprint-sales",
        title: "Total Blueprint Sales",
        metric: primary.totalBlueprintSales,
        secondary: `vs ${comparisonLabel} ${numberFormatter.format(
          comparison.totalBlueprintSales.value,
        )}`,
        format: (value) => numberFormatter.format(value),
        accent: "#d0bbff",
        showDelta: true,
        deltaComparisonLabel: comparisonLabel,
      },
      {
        key: "navigator-revenue",
        title: "Top Navigator Revenue",
        metric: primary.topNavigatorRevenueToday,
        secondary: primary.topNavigatorRevenueToday.navigatorName,
        format: currencyFormatter.format,
        accent: "#51e5ff",
        showDelta: true,
        deltaComparisonLabel: comparisonLabel,
      },
      {
        key: "new-copiers",
        title: "New Copiers Today",
        metric: copyTradingKpis.newCopiersToday,
        format: (value) => numberFormatter.format(value),
        accent: "#53f6c5",
      },
      {
        key: "lost-copiers",
        title: "Lost Copiers Today",
        metric: copyTradingKpis.lostCopiersToday,
        format: (value) => numberFormatter.format(value),
        accent: "#f97316",
      },
      {
        key: "copier-retention",
        title: "Copier Retention 30d",
        metric: copyTradingKpis.copierRetention30d,
        format: (value) => `${value.toFixed(1)}%`,
        accent: "#8da9ff",
      },
    ];
  }, [primary, comparison, comparisonLabel, copiedVolumeToday, copiedVolumeComparison, copyTradingKpis]);

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Revenue Today
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {revenueCards.map((card, index) => (
            <KPICard key={card.key} card={card} index={index} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Product Health
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {productCards.map((card, index) => (
            <KPICard key={card.key} card={card} index={index + revenueCards.length} />
          ))}
        </div>
        <HelpTooltip text={HELP_COPY.navigatorConcentration}>
          <div className="rounded-3xl border border-border/40 bg-sidebar/40 px-5 py-4 text-sm text-muted-foreground">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground/80">Navigator Revenue Concentration</p>
            <p className="mt-2 text-base font-semibold text-foreground">
              Top 3 navigators account for {copyTradingKpis.navigatorRevenueConcentration}% of copy trading revenue.
            </p>
          </div>
        </HelpTooltip>
      </section>
    </div>
  );
}

function KPICard({ card, index }: { card: CardConfig; index: number }) {
  const description = helpCopy[card.key];
  const cardBody = (
    <Card className="h-full rounded-3xl border-2 border-border/60 bg-card/85 shadow-none transition-transform duration-200 hover:-translate-y-1 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {card.title}
        </CardTitle>
        {card.showDelta && card.metric.deltaPct !== undefined ? (
          <DeltaBadge
            deltaPct={card.metric.deltaPct}
            comparisonLabel={card.deltaComparisonLabel ?? "baseline"}
          />
        ) : null}
        {card.secondary ? (
          <p className="text-xs text-muted-foreground/80">{card.secondary}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.p
          key={`${card.key}-${card.metric.value}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="text-3xl font-semibold text-foreground"
        >
          {card.format(card.metric.value)}
        </motion.p>
        <Sparkline data={card.metric.trend} color={card.accent} />
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      key={card.key}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: "easeOut" }}
    >
      {description ? (
        <HelpTooltip text={description}>{cardBody}</HelpTooltip>
      ) : (
        cardBody
      )}
    </motion.div>
  );
}

function DeltaBadge({
  deltaPct,
  comparisonLabel,
}: {
  deltaPct: number;
  comparisonLabel: string;
}) {
  const isPositive = deltaPct > 0.01;
  const isNegative = deltaPct < -0.01;
  const isNeutral = !isPositive && !isNegative;

  const arrow = isPositive ? "↑" : isNegative ? "↓" : "→";
  const formattedValue = `${Math.abs(deltaPct).toFixed(0)}%`;
  const text = isNeutral
    ? `0% vs ${comparisonLabel}`
    : `${arrow} ${formattedValue} vs ${comparisonLabel}`;

  const className = cn(
    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em]",
    isPositive && "border-primary/40 bg-primary/15 text-primary",
    isNegative && "border-[color:var(--pilot-bad)]/40 bg-[color:var(--pilot-bad)]/15 text-[color:var(--pilot-bad)]",
    isNeutral && "border-border/40 bg-muted/20 text-muted-foreground",
  );

  return <span className={className}>{text}</span>;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((value, index) => ({ index, value }));
  const gradientId = useId();

  return (
    <div className="h-16 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={80}>
        <AreaChart data={chartData} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.45} />
              <stop offset="95%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
