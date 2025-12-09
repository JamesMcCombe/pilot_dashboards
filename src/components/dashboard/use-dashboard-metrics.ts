"use client";

import { useMemo } from "react";
import { baselineMetrics, withPilotMetrics } from "@/data/metrics";
import { navigators } from "@/data/navigators";
import { pilots } from "@/data/pilots";
import type {
  DashboardMetricsSnapshot,
  MetricSparkline,
  TopNavigatorSparkline,
} from "@/data/types";
import {
  calculateHighQualityRevenue,
  calculateHighQualityRevenuePct,
  getNavigatorValueMap,
} from "@/lib/value-score-map";
import { getCopyTradingKpiSeries } from "@/lib/aggregations";
import { useDashboardMode } from "./dashboard-mode-context";

type SnapshotWithDelta = {
  brokerRevenueToday: MetricSparkline;
  volumeLiftPercent: MetricSparkline;
  activeCopiers: MetricSparkline;
  topNavigatorRevenueToday: TopNavigatorSparkline;
  totalBlueprintSales: MetricSparkline;
};

const baselineToWithPilotRevenueRatio =
  baselineMetrics.brokerRevenueToday.value /
  withPilotMetrics.brokerRevenueToday.value;

function withDelta<T extends MetricSparkline>(
  primaryMetric: T,
  comparisonMetric: MetricSparkline,
): T {
  const deltaAbs = primaryMetric.value - comparisonMetric.value;
  const deltaPct = comparisonMetric.value
    ? (deltaAbs / comparisonMetric.value) * 100
    : primaryMetric.value === 0
      ? 0
      : 100;

  return {
    ...primaryMetric,
    deltaAbs,
    deltaPct,
  };
}

function enrichSnapshot(
  primary: DashboardMetricsSnapshot,
  comparison: DashboardMetricsSnapshot,
): SnapshotWithDelta {
  return {
    brokerRevenueToday: withDelta(
      primary.brokerRevenueToday,
      comparison.brokerRevenueToday,
    ),
    volumeLiftPercent: withDelta(
      primary.volumeLiftPercent,
      comparison.volumeLiftPercent,
    ),
    activeCopiers: withDelta(primary.activeCopiers, comparison.activeCopiers),
    topNavigatorRevenueToday: withDelta(
      primary.topNavigatorRevenueToday,
      comparison.topNavigatorRevenueToday,
    ),
    totalBlueprintSales: withDelta(
      primary.totalBlueprintSales,
      comparison.totalBlueprintSales,
    ),
  };
}

export function useDashboardMetrics() {
  const { mode } = useDashboardMode();

  const navigatorValueMap = useMemo(
    () => getNavigatorValueMap(navigators, pilots),
    [],
  );

  const navigatorValueEntries = useMemo(
    () => Object.values(navigatorValueMap),
    [navigatorValueMap],
  );

  const copyTradingKpis = useMemo(() => getCopyTradingKpiSeries(), []);

  const primaryRaw = mode === "withPilot" ? withPilotMetrics : baselineMetrics;
  const comparisonRaw = mode === "withPilot" ? baselineMetrics : withPilotMetrics;

  const primary = useMemo(
    () => enrichSnapshot(primaryRaw, comparisonRaw),
    [primaryRaw, comparisonRaw],
  );

  const withPilotView = useMemo(
    () => enrichSnapshot(withPilotMetrics, baselineMetrics),
    [],
  );

  const baselineView = useMemo(
    () => enrichSnapshot(baselineMetrics, withPilotMetrics),
    [],
  );

  const primaryLabel = mode === "withPilot" ? "With Pilot" : "Without Pilot";
  const comparisonLabel = mode === "withPilot" ? "Without Pilot" : "With Pilot";

  const highQualityNavigatorRevenue = useMemo(
    () => calculateHighQualityRevenue(navigators, pilots),
    [],
  );

  const highQualityNavigatorRevenuePct = useMemo(
    () => calculateHighQualityRevenuePct(navigators, pilots),
    [],
  );

  const aggregateRevenueTrends = useMemo(() => {
    if (!navigatorValueEntries.length) {
      const zeros = Array(7).fill(0);
      return { total: zeros, high: zeros };
    }

    const length = navigatorValueEntries[0].revenueTrend.length;
    const total = Array.from({ length }, () => 0);
    const high = Array.from({ length }, () => 0);

    navigatorValueEntries.forEach((entry) => {
      entry.revenueTrend.forEach((value, index) => {
        total[index] += value;
        if (entry.valueTier === "high") {
          high[index] += value;
        }
      });
    });

    return { total, high };
  }, [navigatorValueEntries]);

  const highRevenueTrend = aggregateRevenueTrends.high;

  const highQualityNavigatorRevenueTrend = useMemo(() => {
    if (!highRevenueTrend.length) {
      return Array(7).fill(highQualityNavigatorRevenue);
    }
    return highRevenueTrend;
  }, [highRevenueTrend, highQualityNavigatorRevenue]);

  const copiedVolumeTrendWithPilot = useMemo(() => {
    if (!navigatorValueEntries.length) {
      return Array(7).fill(0);
    }

    const length = navigatorValueEntries[0].revenueTrend.length;
    return Array.from({ length }, (_, index) => {
      return navigatorValueEntries.reduce((sum, entry) => {
        const revenue = entry.revenueTrend[index] ?? entry.brokerValue.dailyRevenue;
        const shareFraction = entry.brokerValue.revenueSharePct / 100;
        if (shareFraction > 0.001) {
          return sum + revenue / shareFraction;
        }
        return sum + entry.brokerValue.copiedVolumeDaily;
      }, 0);
    });
  }, [navigatorValueEntries]);

  const copiedVolumeTrendBaseline = useMemo(
    () =>
      copiedVolumeTrendWithPilot.map((value) =>
        Math.round(value * baselineToWithPilotRevenueRatio),
      ),
    [copiedVolumeTrendWithPilot],
  );

  const copiedVolumeMetricWithPilot = useMemo<MetricSparkline>(() => {
    const roundedTrend = copiedVolumeTrendWithPilot.map((value) => Math.round(value));
    return {
      value: roundedTrend[roundedTrend.length - 1] ?? 0,
      trend: roundedTrend,
    };
  }, [copiedVolumeTrendWithPilot]);

  const copiedVolumeMetricBaseline = useMemo<MetricSparkline>(() => {
    const trend = copiedVolumeTrendBaseline;
    return {
      value: trend[trend.length - 1] ?? 0,
      trend,
    };
  }, [copiedVolumeTrendBaseline]);

  const copiedVolumePrimary = mode === "withPilot"
    ? withDelta(copiedVolumeMetricWithPilot, copiedVolumeMetricBaseline)
    : withDelta(copiedVolumeMetricBaseline, copiedVolumeMetricWithPilot);

  const copiedVolumeComparison = mode === "withPilot"
    ? copiedVolumeMetricBaseline
    : copiedVolumeMetricWithPilot;

  const {
    newCopiersToday,
    lostCopiersToday,
    copierRetention30d,
    navigatorRevenueConcentration,
  } = copyTradingKpis;

  return {
    mode,
    primary,
    withPilotView,
    baselineView,
    comparison: comparisonRaw,
    primaryLabel,
    comparisonLabel,
    highQualityNavigatorRevenue,
    highQualityNavigatorRevenuePct,
    highQualityNavigatorRevenueTrend,
    copiedVolumeToday: copiedVolumePrimary,
    copiedVolumeComparison,
    copyTradingKpis: {
      newCopiersToday,
      lostCopiersToday,
      copierRetention30d,
      navigatorRevenueConcentration,
    },
  };
}
