"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { getNavigatorBreakdown } from "@/data/score-insights";
import { groups } from "@/data/groups";
import type { Group, Navigator } from "@/data/types";
import { GroupDetailPanel } from "@/components/group/group-detail-panel";
import { ScoreBadge } from "@/components/common/score-badge";
import { EntityAvatar } from "@/components/common/entity-avatar";
import { HelpTooltip } from "@/components/help/help-tooltip";
import { PilotScoreValue } from "@/components/common/pilot-score-mark";

const PANEL_TRANSITION: Transition = { duration: 0.28, ease: "easeOut" };

interface NavigatorDetailPanelProps {
  navigator: Navigator | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NavigatorDetailPanel({ navigator, open, onOpenChange }: NavigatorDetailPanelProps) {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupOpen, setGroupOpen] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setGroupOpen(false);
      setSelectedGroup(null);
    }
    onOpenChange(nextOpen);
  };

  const relatedGroups = useMemo(
    () => (navigator ? groups.filter((group) => group.navigatorId === navigator.id) : []),
    [navigator],
  );

  const breakdown = useMemo(
    () => (navigator ? getNavigatorBreakdown(navigator.id) : []),
    [navigator],
  );

  const navigatorEconomics = navigator?.navigatorEconomics;
  const navigatorCopierStats = navigator?.copierStats;
  const navigatorRevenueTrend = navigator?.revenueTrend?.length
    ? navigator.revenueTrend
    : navigator?.trend.map((point) => point.value) ?? [];

  const tabHelp = {
    overview: "Overview blends Pilot Score, behaviour breakdowns, and quick KPIs so you can narrate why this navigator matters.",
    groups: "Group Health shows how this navigator’s copy cohorts are performing and where pilots sit.",
    economics: "Economics tab covers revenue, copier funnel, and sparkline trends for this navigator.",
  } as const;

  const overviewMetricHelp = {
    Followers: "Number of accounts currently copying this navigator.",
    "Group Volume": "Total copied notional across the navigator’s aligned groups per day.",
    "Navigator Revenue": "What the navigator personally earns from copy trading (leader share).",
    "Broker Revenue": "Daily broker revenue from this navigator.",
    "Win Rate": "Share of trades closed profitably; pairs with Sharpe to explain quality.",
    Sharpe: "Sharpe-style stability score; higher means smoother returns.",
  } as const;

  const economicsMetricHelp = {
    "Broker Revenue (30d)": "Total broker revenue this navigator generated in the last 30 days.",
    "Navigator Revenue (30d)": "Leader’s fee share for the same period.",
    "New Copiers (30d)": "Fresh followers added in the last month.",
    "Lost Copiers (30d)": "Followers who churned over the last month.",
    "Retention 30d": "Percentage of this navigator’s copiers still active 30 days later.",
    "Growth Rate": "30-day revenue growth rate for the navigator.",
  } as const;

  const funnelHelp = {
    Registered: "Total accounts exposed to this navigator’s profile.",
    "First Copy": "Accounts that executed at least one copied trade for this navigator.",
    Active: "Copiers placing trades regularly (stay in the cadence bucket).",
    "Retained 30d": "Copiers still active 30 days after their first copy for this navigator.",
  } as const;

const navigatorScoreHelp = "Navigator Pilot Score blends consistency, discipline, trade quality, and liquidity impact to explain leadership health.";

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:w-[620px] md:w-[760px] lg:w-[900px] xl:w-[1000px] max-w-[min(1040px,100vw)] overflow-y-auto border-border/60 bg-panel/95 p-0 text-foreground"
        >
          {navigator ? (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={PANEL_TRANSITION}
              className="space-y-6 p-6 md:p-8"
            >
              <SheetHeader className="mb-2 flex flex-row items-start justify-between">
                <div className="flex items-center gap-4">
                  <EntityAvatar name={navigator.name} className="h-12 w-12" />
                  <div className="space-y-1">
                    <SheetTitle className="text-xl font-semibold tracking-tight">
                      {navigator.name}
                    </SheetTitle>
                    <p className="text-sm text-muted-foreground">Navigator overview · live copy cohort</p>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </SheetHeader>

              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-sidebar/40 p-1">
                  <HelpTooltip text={tabHelp.overview} asChild indicator={false}>
                    <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
                      Overview
                    </TabsTrigger>
                  </HelpTooltip>
                  <HelpTooltip text={tabHelp.groups} asChild indicator={false}>
                    <TabsTrigger value="groups" className="rounded-xl data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
                      Group Health
                    </TabsTrigger>
                  </HelpTooltip>
                  <HelpTooltip text={tabHelp.economics} asChild indicator={false}>
                    <TabsTrigger value="economics" className="rounded-xl data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
                      Economics
                    </TabsTrigger>
                  </HelpTooltip>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="grid gap-4 rounded-3xl border-2 border-border/50 bg-sidebar/40 p-6 md:grid-cols-[1.2fr_1fr]"
                  >
                    <div className="flex flex-col gap-6">
                      <HelpTooltip text={navigatorScoreHelp} asChild>
                        <div className="rounded-3xl border-2 border-primary/50 bg-primary/10 p-6 text-primary">
                          <span className="text-xs uppercase tracking-[0.32em] text-primary/90">Pilot Score</span>
                          <div className="mt-3 flex items-end gap-3">
                            <motion.div
                              key={navigator.pilotScore}
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 220, damping: 26 }}
                            >
                              <PilotScoreValue
                                score={navigator.pilotScore}
                                valueClassName="text-6xl font-semibold text-primary"
                                markClassName="h-7 w-7 border-primary/70 bg-primary/15 text-[0.6rem] text-primary"
                                srLabel={`Navigator PilotScore ${navigator.pilotScore} out of 1000`}
                              />
                            </motion.div>
                            <span className="text-sm text-primary/80">/ 1000</span>
                          </div>
                        </div>
                      </HelpTooltip>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {breakdown.map((item) => (
                          <HelpTooltip key={item.label} text={item.description} asChild>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              className={cn(
                                "rounded-3xl border-2 border-border/50 bg-card/80 p-4",
                                item.tone === "good" && "border-primary/40",
                                item.tone === "bad" && "border-[color:var(--pilot-bad)]/40",
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    "rounded-full px-3 py-1 text-xs",
                                    item.tone === "good" && "bg-primary/15 text-primary",
                                    item.tone === "bad" && "bg-[color:var(--pilot-bad)]/15 text-[color:var(--pilot-bad)]",
                                  )}
                                >
                                  {item.score}
                                </Badge>
                              </div>
                              <p className="mt-3 text-xs text-muted-foreground/80">{item.description}</p>
                            </motion.div>
                          </HelpTooltip>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="rounded-3xl border-2 border-border/50 bg-card/80 p-4">
                        <HelpTooltip text="Sparkline showing this navigator’s Pilot Score trend so you can discuss behaviour stability.">
                          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted-foreground">
                            <span>Navigator Trend</span>
                            <span>30 day</span>
                          </div>
                        </HelpTooltip>
                        <div className="h-32 w-full min-w-0">
                          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={128}>
                            <AreaChart
                              data={navigator.trend.map((point) => ({
                                day: point.day,
                                score: point.value,
                              }))}
                              margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
                            >
                              <defs>
                                <linearGradient id="navigator-score" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#53f6c5" stopOpacity={0.5} />
                                  <stop offset="95%" stopColor="#53f6c5" stopOpacity={0.05} />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="day" hide />
                              <YAxis hide domain={[600, 1000]} />
                              <Tooltip
                                cursor={false}
                                contentStyle={{
                                  backgroundColor: "rgba(7,20,44,0.85)",
                                  borderRadius: 12,
                                  border: "1px solid rgba(83,246,197,0.2)",
                                  color: "white",
                                }}
                                formatter={(value: number) => [`Score ${value}`, ""]}
                              />
                              <Area type="monotone" dataKey="score" stroke="#53f6c5" strokeWidth={2} fill="url(#navigator-score)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <MetricBadge label="Followers" value={formatNumber(navigator.followers)} helpText={overviewMetricHelp.Followers} />
                        <MetricBadge label="Group Volume" value={formatCurrency(navigator.groupVolume * 1_000_000)} helpText={overviewMetricHelp["Group Volume"]} />
                        <MetricBadge label="Navigator Revenue" value={formatCurrency(navigator.brokerRevenueShare * 2)} subtitle="50% fee share" helpText={overviewMetricHelp["Navigator Revenue"]} />
                        <MetricBadge label="Broker Revenue" value={formatCurrency(navigator.brokerRevenueShare)} helpText={overviewMetricHelp["Broker Revenue"]} />
                        <MetricBadge label="Win Rate" value={`${Math.round(navigator.winRate * 100)}%`} helpText={overviewMetricHelp["Win Rate"]} />
                        <MetricBadge label="Sharpe" value={navigator.sharpe.toFixed(2)} helpText={overviewMetricHelp.Sharpe} />
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="groups" className="space-y-4">
                  <Card className="border-border/40 bg-card/80">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border/40">
                            <TableHead className="w-[40%]">Group</TableHead>
                            <TableHead>Group Score</TableHead>
                            <TableHead>Pilots</TableHead>
                            <TableHead>Avg Pilot Score</TableHead>
                            <TableHead>Total Volume</TableHead>
                            <TableHead>Avg Profit / Pilot</TableHead>
                            <TableHead>Broker Revenue</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {relatedGroups.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="py-6 text-center text-sm text-muted-foreground">
                                No groups assigned yet.
                              </TableCell>
                            </TableRow>
                          ) : null}
                          {relatedGroups.map((group) => (
                            <TableRow
                              key={group.id}
                              className="cursor-pointer border-border/20 transition hover:bg-primary/5"
                              onClick={() => {
                                setSelectedGroup(group);
                                setGroupOpen(true);
                              }}
                            >
                              <TableCell className="font-medium text-foreground">{group.name}</TableCell>
                              <TableCell>
                                <ScoreBadge score={group.groupScore} />
                              </TableCell>
                              <TableCell>{group.pilots.length}</TableCell>
                              <TableCell>
                                <PilotScoreValue
                                  score={group.avgPilotScore}
                                  valueClassName="text-sm font-semibold text-foreground"
                                  markClassName="h-4 w-4 border-primary/60"
                                  srLabel={`Average PilotScore ${Math.round(group.avgPilotScore)}`}
                                />
                              </TableCell>
                              <TableCell>{formatCurrency(group.totalVolume * 1_000_000)}</TableCell>
                              <TableCell>{formatCurrency(group.avgProfitPerPilot)}</TableCell>
                              <TableCell>{formatCurrency(group.brokerRevenueShare)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="economics" className="space-y-5">
                  {navigatorEconomics ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <MetricBadge label="Broker Revenue (30d)" value={formatCurrency(navigatorEconomics.brokerRevenue30d)} helpText={economicsMetricHelp["Broker Revenue (30d)"]} />
                      <MetricBadge label="Navigator Revenue (30d)" value={formatCurrency(navigatorEconomics.navigatorRevenue30d)} helpText={economicsMetricHelp["Navigator Revenue (30d)"]} />
                      <MetricBadge label="New Copiers (30d)" value={formatNumber(navigator?.newCopiers30d ?? 0)} helpText={economicsMetricHelp["New Copiers (30d)"]} />
                      <MetricBadge label="Lost Copiers (30d)" value={formatNumber(navigator?.lostCopiers30d ?? 0)} helpText={economicsMetricHelp["Lost Copiers (30d)"]} />
                      <MetricBadge label="Retention 30d" value={`${navigator?.retention30d ?? 0}%`} helpText={economicsMetricHelp["Retention 30d"]} />
                      <MetricBadge label="Growth Rate" value={`${navigatorEconomics.growthRate30d}%`} helpText={economicsMetricHelp["Growth Rate"]} />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Economics data not available yet for this navigator.</p>
                  )}

                  {navigatorCopierStats ? (
                    <div className="grid gap-3 md:grid-cols-4">
                      {(() => {
                        const stageKeys = ["registered", "firstCopy", "active", "retained30d"] as const;
                        const labelMap: Record<(typeof stageKeys)[number], keyof typeof funnelHelp> = {
                          registered: "Registered",
                          firstCopy: "First Copy",
                          active: "Active",
                          retained30d: "Retained 30d",
                        };
                        const nextKeyMap: Record<(typeof stageKeys)[number], (typeof stageKeys)[number] | null> = {
                          registered: "firstCopy",
                          firstCopy: "active",
                          active: "retained30d",
                          retained30d: null,
                        };
                        return stageKeys.map((stageKey) => {
                          const value = navigatorCopierStats[stageKey] ?? 0;
                          const nextStage = nextKeyMap[stageKey];
                          const nextValue = nextStage ? navigatorCopierStats[nextStage] ?? 0 : 0;
                          const conversion = value && nextValue ? Number(((nextValue / value) * 100).toFixed(1)) : 0;
                          const helpText = funnelHelp[labelMap[stageKey]] ?? "Copier funnel stage.";
                          return (
                            <HelpTooltip key={stageKey} text={helpText}>
                              <div className="rounded-3xl border-2 border-border/50 bg-sidebar/40 p-4">
                                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{labelMap[stageKey]}</p>
                                <p className="mt-2 text-2xl font-semibold">{formatNumber(value)}</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {conversion ? `${conversion}% → next stage` : "Retention anchor"}
                                </p>
                              </div>
                            </HelpTooltip>
                          );
                        });
                      })()}
                    </div>
                  ) : null}

                  {navigatorRevenueTrend.length ? (
                    <div className="rounded-3xl border-2 border-border/50 bg-card/80 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Revenue Sparkline</p>
                      <div className="mt-3 h-40 w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={160}>
                          <AreaChart
                            data={navigatorRevenueTrend.map((value, index) => ({ index, value }))}
                            margin={{ top: 10, left: 0, right: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="navigator-economics" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#53f6c5" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#53f6c5" stopOpacity={0.05} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="index" hide />
                            <YAxis hide domain={[0, "auto"]} />
                            <Tooltip contentStyle={{ backgroundColor: "rgba(5,12,28,0.9)", borderRadius: 12, border: "1px solid rgba(83,246,197,0.2)", color: "white" }} />
                            <Area type="monotone" dataKey="value" stroke="#53f6c5" strokeWidth={2} fill="url(#navigator-economics)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ) : null}

                  <Button asChild variant="outline" className="w-full rounded-full border-primary/40 bg-primary/10 text-primary">
                    <Link href={`/copy-trading/navigators/${navigator.id}/economics`}>
                      Open full Navigator Economics view
                    </Link>
                  </Button>
                </TabsContent>
              </Tabs>
            </motion.div>
          ) : null}
        </SheetContent>
      </Sheet>

      <GroupDetailPanel group={selectedGroup} open={groupOpen} onOpenChange={setGroupOpen} />
    </>
  );
}

function MetricBadge({
  label,
  value,
  subtitle,
  helpText,
}: {
  label: string;
  value: string;
  subtitle?: string;
  helpText?: string;
}) {
  const badge = (
    <motion.div
      layout
      className="rounded-3xl border-2 border-border/50 bg-sidebar/40 px-5 py-3"
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">{value}</span>
      </div>
      {subtitle ? <p className="mt-1 text-[0.7rem] text-muted-foreground/70">{subtitle}</p> : null}
    </motion.div>
  );

  return helpText ? <HelpTooltip text={helpText}>{badge}</HelpTooltip> : badge;
}
