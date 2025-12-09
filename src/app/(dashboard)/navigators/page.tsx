"use client";

import { Suspense, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { navigators } from "@/data/navigators";
import { pilots } from "@/data/pilots";
import { NavigatorDetailPanel } from "@/components/navigator/navigator-detail-panel";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";
import { ScoreBadge } from "@/components/common/score-badge";
import { EntityAvatar } from "@/components/common/entity-avatar";
import { ValueBadge } from "@/components/common/value-badge";
import { getNavigatorValueMap } from "@/lib/value-score-map";
import { cn } from "@/lib/utils";
import { HelpTooltip } from "@/components/help/help-tooltip";
import { HELP_COPY, VALUE_BADGE_TOOLTIP } from "@/components/help/help-text";

export default function NavigatorsPage() {
  return (
    <Suspense fallback={<div className="min-h-[200px]" aria-hidden="true" />}>
      <NavigatorsContent />
    </Suspense>
  );
}

function NavigatorsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const navigatorValueMap = useMemo(
    () => getNavigatorValueMap(navigators, pilots),
    [],
  );

  const sortedNavigators = useMemo(
    () =>
      [...navigators].sort((a, b) => {
        const aScore = navigatorValueMap[a.id]?.valueScore ?? 0;
        const bScore = navigatorValueMap[b.id]?.valueScore ?? 0;
        return bScore - aScore;
      }),
    [navigatorValueMap],
  );

  const selectedId = searchParams.get("navigator");
  const selectedNavigator = selectedId
    ? navigators.find((navigator) => navigator.id === selectedId) ?? null
    : null;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("navigator");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }
  };

  const setNavigatorParam = (navigatorId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("navigator", navigatorId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const columnHelp = {
    navigator: "Leader account whose signals followers copy. Click any row to open a detailed panel.",
    value: "Composite ValueScore combining revenue, growth, and behaviour to show how commercially important this leader is.",
    pilotScore: "Risk/conduct score out of 1000 – higher means steadier behaviour and lower compliance headaches.",
    sharpe: "Sharpe-like stability score for this navigator’s strategy; helps explain performance consistency.",
    winRate: "Percentage of trades closed profitably. Pair with Sharpe to describe quality.",
    followers: "Number of active followers copying this navigator right now.",
    groupVolume: "Total notional volume routed through the navigator’s assigned groups per day.",
  } as const;

  const inlineMetricHelp = {
    revenue: "Daily broker revenue you earn from this navigator’s copied trades.",
    volume: "Average copied notional per day for this navigator.",
    share: "Share of total broker copy-trading revenue attributed to this navigator.",
  } as const;

  return (
    <div className="flex flex-col gap-6">
      <Card className="rounded-3xl border-2 border-border/60 bg-card/85 shadow-none">
        <CardHeader className="space-y-2">
          <CardTitle className="text-lg font-semibold text-foreground">Navigator Roster</CardTitle>
          <p className="text-sm text-muted-foreground">
            Explore navigator health, performance, and compliance handoffs. Click any row to open detailed score analytics.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow className="border-border/40">
                <TableHead className="w-[32%]">
                  <HelpTooltip text={columnHelp.navigator} asChild indicator={false}>
                    <span>Navigator</span>
                  </HelpTooltip>
                </TableHead>
                <TableHead>
                  <HelpTooltip text={columnHelp.value} asChild indicator={false}>
                    <span>Value to Broker</span>
                  </HelpTooltip>
                </TableHead>
                <TableHead>
                  <HelpTooltip text={columnHelp.pilotScore} asChild indicator={false}>
                    <span>Pilot Score</span>
                  </HelpTooltip>
                </TableHead>
                <TableHead>
                  <HelpTooltip text={columnHelp.sharpe} asChild indicator={false}>
                    <span>Sharpe</span>
                  </HelpTooltip>
                </TableHead>
                <TableHead>
                  <HelpTooltip text={columnHelp.winRate} asChild indicator={false}>
                    <span>Win Rate</span>
                  </HelpTooltip>
                </TableHead>
                <TableHead>
                  <HelpTooltip text={columnHelp.followers} asChild indicator={false}>
                    <span>Followers</span>
                  </HelpTooltip>
                </TableHead>
                <TableHead>
                  <HelpTooltip text={columnHelp.groupVolume} asChild indicator={false}>
                    <span>Group Volume</span>
                  </HelpTooltip>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedNavigators.map((navigator) => {
                const valueMeta = navigatorValueMap[navigator.id];
                const isTopValue = (valueMeta?.valueRank ?? Infinity) <= 3;
                const dailyRevenue = valueMeta?.brokerValue.dailyRevenue ?? navigator.brokerRevenueShare;
                const copiedVolumeDaily = valueMeta?.brokerValue.copiedVolumeDaily ?? navigator.groupVolume * 1_000_000;
                const revenueSharePct = valueMeta?.brokerValue.revenueSharePct ?? 0;
                return (
                  <TableRow
                    key={navigator.id}
                    className={cn(
                      "group relative cursor-pointer border-border/20 transition",
                      isTopValue
                        ? "hover:bg-transparent [&>td]:bg-primary/10 [&>td]:transition-colors [&>td]:border-y [&>td]:border-border/10"
                        : "hover:bg-primary/5",
                    )}
                    onClick={() => setNavigatorParam(navigator.id)}
                  >
                    <TableCell className={cn("relative align-top", isTopValue && "pl-7")}>
                      {isTopValue ? (
                        <span className="absolute inset-y-2 left-2 w-1 rounded-full bg-primary/70" aria-hidden="true" />
                      ) : null}
                      <div className="flex items-center gap-3">
                        <EntityAvatar name={navigator.name} className="h-10 w-10" />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-foreground">{navigator.name}</p>
                            {isTopValue ? (
                              <HelpTooltip text={HELP_COPY.topNavigatorRank}>
                                <span className="rounded-full border border-primary/50 bg-primary/10 px-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
                                  #{valueMeta?.valueRank}
                                </span>
                              </HelpTooltip>
                            ) : null}
                          </div>
                          <p className="text-xs text-muted-foreground">{formatNumber(navigator.followers)} followers</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.7rem] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="font-semibold text-foreground">{formatCurrency(dailyRevenue)}</span>
                          <HelpTooltip text={inlineMetricHelp.revenue} asChild indicator={false}>
                            <span className="uppercase tracking-[0.22em] text-muted-foreground/70">Rev/day</span>
                          </HelpTooltip>
                        </span>
                        <span aria-hidden="true" className="text-muted-foreground/40">
                          •
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-semibold text-foreground">{formatCurrency(copiedVolumeDaily)}</span>
                          <HelpTooltip text={inlineMetricHelp.volume} asChild indicator={false}>
                            <span className="uppercase tracking-[0.22em] text-muted-foreground/70">Volume/day</span>
                          </HelpTooltip>
                        </span>
                        <span aria-hidden="true" className="text-muted-foreground/40">
                          •
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-semibold text-foreground">{formatPercent(revenueSharePct / 100)}</span>
                          <HelpTooltip text={inlineMetricHelp.share} asChild indicator={false}>
                            <span className="uppercase tracking-[0.22em] text-muted-foreground/70">Share</span>
                          </HelpTooltip>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {valueMeta ? (
                        <HelpTooltip text={VALUE_BADGE_TOOLTIP}>
                          <ValueBadge tier={valueMeta.valueTier} label={valueMeta.valueLabel} />
                        </HelpTooltip>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <ScoreBadge score={navigator.pilotScore} />
                    </TableCell>
                    <TableCell>{navigator.sharpe.toFixed(2)}</TableCell>
                    <TableCell>{Math.round(navigator.winRate * 100)}%</TableCell>
                    <TableCell>{formatNumber(navigator.followers)}</TableCell>
                    <TableCell>{formatCurrency(navigator.groupVolume * 1_000_000)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <NavigatorDetailPanel navigator={selectedNavigator} open={Boolean(selectedNavigator)} onOpenChange={handleOpenChange} />
    </div>
  );
}
