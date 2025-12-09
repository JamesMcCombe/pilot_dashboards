"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Info,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Shield,
} from "lucide-react";
import {
  EARLY_WARNING_INDICATORS,
  EWI_SUMMARY,
  STATUS_CONFIG,
  type EarlyWarningIndicator,
} from "@/data/regulator/early-warning";

function TrendIcon({ trend }: { trend?: "up" | "down" | "stable" }) {
  if (trend === "up") {
    return <TrendingUp className="h-3 w-3 text-[#ef4444]" />;
  }
  if (trend === "down") {
    return <TrendingDown className="h-3 w-3 text-[#53f6c5]" />;
  }
  return <Minus className="h-3 w-3 text-muted-foreground" />;
}

function IndicatorTile({ indicator }: { indicator: EarlyWarningIndicator }) {
  const statusConfig = STATUS_CONFIG[indicator.status];

  return (
    <div
      className="relative rounded-2xl border-2 p-4 transition-all hover:shadow-lg"
      style={{
        backgroundColor: statusConfig.bgColor,
        borderColor: statusConfig.borderColor,
      }}
    >
      {/* Status Badge */}
      <div className="absolute right-3 top-3">
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{
            backgroundColor: statusConfig.color,
            color: "#0a0f1a",
          }}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Title and Subtitle */}
      <h4 className="pr-16 text-sm font-semibold" style={{ color: statusConfig.color }}>
        {indicator.title}
      </h4>
      <p className="mt-0.5 text-[10px] text-muted-foreground">
        {indicator.subtitle}
      </p>

      {/* Value */}
      <div className="mt-3 flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold" style={{ color: statusConfig.color }}>
            {typeof indicator.value === "number" && indicator.value % 1 !== 0
              ? indicator.value.toFixed(1)
              : indicator.value}
          </span>
          <span className="text-xs text-muted-foreground">{indicator.unit}</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendIcon trend={indicator.trend} />
          <span className="text-[10px] text-muted-foreground">
            {indicator.trend === "up" ? "Rising" : indicator.trend === "down" ? "Falling" : "Stable"}
          </span>
        </div>
      </div>

      {/* Threshold bar */}
      <div className="mt-3">
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
          {/* Threshold zones */}
          <div className="absolute inset-0 flex">
            <div
              className="h-full"
              style={{
                width: `${(indicator.threshold.medium / indicator.threshold.critical) * 100}%`,
                backgroundColor: STATUS_CONFIG.low.color,
                opacity: 0.3,
              }}
            />
            <div
              className="h-full"
              style={{
                width: `${((indicator.threshold.high - indicator.threshold.medium) / indicator.threshold.critical) * 100}%`,
                backgroundColor: STATUS_CONFIG.medium.color,
                opacity: 0.3,
              }}
            />
            <div
              className="h-full"
              style={{
                width: `${((indicator.threshold.critical - indicator.threshold.high) / indicator.threshold.critical) * 100}%`,
                backgroundColor: STATUS_CONFIG.high.color,
                opacity: 0.3,
              }}
            />
            <div
              className="h-full flex-1"
              style={{
                backgroundColor: STATUS_CONFIG.critical.color,
                opacity: 0.3,
              }}
            />
          </div>
          {/* Current position marker */}
          <div
            className="absolute top-0 h-full w-1 rounded-full"
            style={{
              left: `${Math.min((indicator.value / (indicator.threshold.critical * 1.2)) * 100, 100)}%`,
              backgroundColor: statusConfig.color,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function EarlyWarningPanel() {
  const overallConfig = STATUS_CONFIG[EWI_SUMMARY.overallStatus];

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ backgroundColor: overallConfig.bgColor }}
            >
              {EWI_SUMMARY.overallStatus === "critical" || EWI_SUMMARY.overallStatus === "high" ? (
                <AlertTriangle className="h-4 w-4" style={{ color: overallConfig.color }} />
              ) : (
                <Shield className="h-4 w-4" style={{ color: overallConfig.color }} />
              )}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                Early Warning Indicators
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                At-a-glance regulatory risk assessment
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  Key harm indicators with status levels computed from synthetic 
                  metrics. Thresholds are illustrative and would be calibrated 
                  based on regulatory policy in production.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: overallConfig.bgColor,
                color: overallConfig.color,
                border: `1px solid ${overallConfig.borderColor}`,
              }}
            >
              Overall: {overallConfig.label}
            </span>
          </div>
        </div>

        {/* Summary Pills */}
        <div className="mt-3 flex flex-wrap gap-2">
          {EWI_SUMMARY.criticalCount > 0 && (
            <span
              className="rounded-full px-2 py-0.5 text-xs"
              style={{
                backgroundColor: STATUS_CONFIG.critical.bgColor,
                color: STATUS_CONFIG.critical.color,
              }}
            >
              {EWI_SUMMARY.criticalCount} Critical
            </span>
          )}
          {EWI_SUMMARY.highCount > 0 && (
            <span
              className="rounded-full px-2 py-0.5 text-xs"
              style={{
                backgroundColor: STATUS_CONFIG.high.bgColor,
                color: STATUS_CONFIG.high.color,
              }}
            >
              {EWI_SUMMARY.highCount} High
            </span>
          )}
          {EWI_SUMMARY.mediumCount > 0 && (
            <span
              className="rounded-full px-2 py-0.5 text-xs"
              style={{
                backgroundColor: STATUS_CONFIG.medium.bgColor,
                color: STATUS_CONFIG.medium.color,
              }}
            >
              {EWI_SUMMARY.mediumCount} Medium
            </span>
          )}
          {EWI_SUMMARY.lowCount > 0 && (
            <span
              className="rounded-full px-2 py-0.5 text-xs"
              style={{
                backgroundColor: STATUS_CONFIG.low.bgColor,
                color: STATUS_CONFIG.low.color,
              }}
            >
              {EWI_SUMMARY.lowCount} Low
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Indicator Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EARLY_WARNING_INDICATORS.map((indicator) => (
            <IndicatorTile key={indicator.id} indicator={indicator} />
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
          <span className="font-medium text-primary">Note: </span>
          Indicators computed from synthetic datasets for demo purposes. 
          Thresholds and status levels are illustrative only.
        </div>
      </CardContent>
    </Card>
  );
}
