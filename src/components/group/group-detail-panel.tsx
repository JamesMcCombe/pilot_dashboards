"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TradeDetailDialog, formatRiskFlag } from "@/components/trade/trade-detail-dialog";
import { ScoreBadge } from "@/components/common/score-badge";
import { EntityAvatar } from "@/components/common/entity-avatar";
import { PilotScoreMark, PilotScoreValue } from "@/components/common/pilot-score-mark";

const PANEL_TRANSITION: Transition = { duration: 0.28, ease: "easeOut" };
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { getGroupBreakdown, getGroupDistribution } from "@/data/score-insights";
import { pilots } from "@/data/pilots";
import { trades } from "@/data/trades";
import type { Group, Pilot, Trade } from "@/data/types";
import { PilotDetailPanel } from "@/components/pilot/pilot-detail-panel";
import { HelpTooltip } from "@/components/help/help-tooltip";

interface GroupDetailPanelProps {
  group: Group | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupDetailPanel({ group, open, onOpenChange }: GroupDetailPanelProps) {
  const [selectedPilot, setSelectedPilot] = useState<Pilot | null>(null);
  const [pilotOpen, setPilotOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [tradeOpen, setTradeOpen] = useState(false);

  const breakdown = useMemo(() => (group ? getGroupBreakdown(group.id) : []), [group]);
  const distribution = useMemo(() => (group ? getGroupDistribution(group.id) : []), [group]);
  const groupPilots = useMemo(() => {
    if (!group) return [];
    const pilotIds = new Set(group.pilots);
    return pilots.filter((pilot) => pilotIds.has(pilot.id));
  }, [group]);
  const groupTrades = useMemo(() => (group ? trades.filter((trade) => trade.groupId === group.id) : []), [group]);
  const groupEconomics = group?.groupEconomics;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedPilot(null);
      setPilotOpen(false);
      setSelectedTrade(null);
      setTradeOpen(false);
    }
    onOpenChange(nextOpen);
  };

  const tabHelp = {
    overview: "Overview combines Group Score, behaviour breakdowns, and economics so you can narrate why this group matters.",
    pilots: "Pilots tab lists every follower in the group with their economics so you can deep dive.",
    trades: "Trades tab lists recent executions tied to this group for compliance storytelling.",
  } as const;

const distributionQuadrantStyles: Record<string, { card: string; label: string }> = {
  excellent: {
    card: "border-emerald-400/80 bg-emerald-400/10",
    label: "text-emerald-200",
  },
  healthy: {
    card: "border-emerald-200/70 bg-emerald-200/5",
    label: "text-emerald-100",
  },
  watch: {
    card: "border-amber-400/80 bg-amber-400/10",
    label: "text-amber-200",
  },
  risk: {
    card: "border-rose-500/80 bg-rose-500/10",
    label: "text-rose-200",
  },
};

const metricHelp = {
    "Total Volume": "Daily notional volume passing through this group.",
    "Avg Pilot Score": "Average risk/discipline score of pilots in the group.",
    "Avg Profit / Pilot": "Average profit contribution per pilot – useful for identifying high value cohorts.",
    "Consistency Score": "Quick read on behaviour stability; higher is more predictable.",
    "Broker Revenue": "Broker revenue attributed to this group per day.",
  } as const;

const groupScoreHelp = "Composite health score blending adoption, profit quality, consistency, and compliance for this group.";

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:w-[620px] md:w-[760px] lg:w-[900px] xl:w-[1000px] max-w-[min(1040px,100vw)] overflow-y-auto border-border/60 bg-panel/95 p-0 text-foreground"
        >
          {group ? (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={PANEL_TRANSITION}
              className="space-y-6 p-6 md:p-8"
            >
              <SheetHeader className="mb-2 flex flex-row items-start justify-between">
                <div className="space-y-1">
                  <SheetTitle className="text-xl font-semibold tracking-tight">
                    {group.name}
                  </SheetTitle>
                  <p className="text-sm text-muted-foreground">Navigator-aligned group performance overview</p>
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
                  <HelpTooltip text={tabHelp.pilots} asChild indicator={false}>
                    <TabsTrigger value="pilots" className="rounded-xl data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
                      Pilots
                    </TabsTrigger>
                  </HelpTooltip>
                  <HelpTooltip text={tabHelp.trades} asChild indicator={false}>
                    <TabsTrigger value="trades" className="rounded-xl data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
                      Trades
                    </TabsTrigger>
                  </HelpTooltip>
                </TabsList>

                <TabsContent value="overview">
                  <div className="space-y-6">
                  <div className="grid gap-5 rounded-3xl border-2 border-border/50 bg-sidebar/40 p-6 md:grid-cols-[1.2fr_1fr]">
                    <div className="flex flex-col gap-5">
                      <HelpTooltip text={groupScoreHelp} asChild>
                        <div className="rounded-3xl border-2 border-primary/50 bg-primary/10 p-6 text-primary">
                          <span className="text-xs uppercase tracking-[0.32em] text-primary/80">Group Score</span>
                          <div className="mt-3 flex items-end gap-3">
                            <motion.span
                              key={group.groupScore}
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 220, damping: 24 }}
                              className="text-6xl font-semibold"
                            >
                              {group.groupScore}
                            </motion.span>
                            <span className="text-sm text-primary/70">/ 1000</span>
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
                                    "rounded-full px-3",
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

                    <div className="space-y-5">
                      <HelpTooltip
                        text="Shows the distribution of follower quality bands (Excellent, Healthy, Watch, Risk) so you can see how stable or risky this group’s copier base is."
                        asChild
                      >
                        <div className="rounded-3xl border-2 border-border/50 bg-card/80 p-5">
                          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">Pilot distribution</div>
                          <div className="grid grid-cols-2 grid-rows-2 gap-4 rounded-2xl border-2 border-primary/30 bg-background/40 p-4">
                            {distribution.map((bucket) => {
                              const normalizedLabel = bucket.label.toLowerCase();
                              const quadrantStyle = distributionQuadrantStyles[normalizedLabel] ?? {
                                card: "border-border/40 bg-card/80",
                                label: "text-muted-foreground",
                              };

                              return (
                                <div
                                  key={bucket.label}
                                  className={cn(
                                    "rounded-xl border-2 p-4 text-base text-foreground",
                                    "flex flex-col justify-center gap-1",
                                    quadrantStyle.card,
                                  )}
                                >
                                  <span className="text-2xl font-semibold tracking-tight">{bucket.value}%</span>
                                  <span className={cn("text-xs uppercase tracking-[0.18em]", quadrantStyle.label)}>
                                    {bucket.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </HelpTooltip>
                        <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.24em] text-primary">
                            <PilotScoreMark className="h-4 w-4 border-primary/60 bg-primary/10 text-[0.45rem]" />
                            <span>PilotScore talking points</span>
                          </div>
                          <p className="mt-2 text-[0.8rem] text-foreground/80">
                            PilotScore is the compliance-by-design signal regulators expect—each number blends risk-adjusted performance, behaviour, risk controls, and disclosure quality so supervisors can narrate suitability, not future returns.
                          </p>
                          <ul className="mt-3 space-y-1 text-[0.78rem] text-muted-foreground">
                            <li><span className="font-semibold text-foreground/90">Risk-adjusted performance:</span> Sharpe/Sortino, drawdown stability, regime-aware lookbacks.</li>
                            <li><span className="font-semibold text-foreground/90">Behaviour & consistency:</span> leverage, concentration, cadence discipline, loss-chasing flags.</li>
                            <li><span className="font-semibold text-foreground/90">Risk control:</span> drawdown tripwires, volatility alignment, cool-off triggers.</li>
                            <li><span className="font-semibold text-foreground/90">Disclosure & conduct:</span> compensation/licensing attestations plus hype/disclosure mismatches.</li>
                          </ul>
                          <p className="mt-3 text-[0.78rem] text-muted-foreground/90">
                            Use these talking points to remind audiences that PilotScore is a supervisory signal for suitability gates, audit trails, and disclosures—never a promise of future returns.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <MetricBlock label="Total Volume" value={formatCurrency(group.totalVolume * 1_000_000)} helpText={metricHelp["Total Volume"]} />
                        <MetricBlock
                          label="Avg Pilot Score"
                          value={<PilotScoreValue score={group.avgPilotScore} valueClassName="text-sm font-semibold text-foreground" markClassName="h-4 w-4 border-primary/60" />}
                          helpText={metricHelp["Avg Pilot Score"]}
                        />
                        <MetricBlock label="Avg Profit / Pilot" value={formatCurrency(group.avgProfitPerPilot)} helpText={metricHelp["Avg Profit / Pilot"]} />
                        <MetricBlock label="Consistency Score" value={`${group.consistencyScore}/100`} helpText={metricHelp["Consistency Score"]} />
                        <MetricBlock label="Broker Revenue" value={formatCurrency(group.brokerRevenueShare)} highlight helpText={metricHelp["Broker Revenue"]} />
                      </div>

                      {groupEconomics ? (
                        <HelpTooltip text="Quick economics snapshot for this group: use it to explain revenue impact and retention.">
                          <div className="rounded-3xl border-2 border-primary/40 bg-primary/5 p-4">
                            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Group Economics</div>
                          <div className="mt-3 grid gap-3 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Broker Rev (30d)</span>
                              <span className="font-semibold text-foreground">{formatCurrency(groupEconomics.brokerRevenue30d)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Copiers</span>
                              <span className="font-semibold text-foreground">{formatNumber(groupEconomics.copiers)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">New (30d)</span>
                              <span className="font-semibold text-primary">{formatNumber(groupEconomics.newCopiers30d)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Retention 30d</span>
                              <span className="font-semibold text-foreground">{groupEconomics.retention30d}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Growth</span>
                              <span className="font-semibold text-primary">{groupEconomics.growthRate30d}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Churn</span>
                              <span className="font-semibold text-[color:var(--pilot-bad)]">{groupEconomics.churnRate30d}%</span>
                            </div>
                          </div>
                          </div>
                        </HelpTooltip>
                      ) : null}
                    </div>
                    {groupPilots.length ? (
                      <Card className="border-2 border-border/50 bg-card/80">
                        <CardHeader>
                          <CardTitle className="text-base font-semibold">Top Followers in Group</CardTitle>
                          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Economics snapshot</p>
                        </CardHeader>
                        <CardContent className="p-0">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-border/40">
                                <TableHead>Pilot</TableHead>
                                <TableHead>Copy Freq</TableHead>
                                <TableHead>Revenue Contrib.</TableHead>
                                <TableHead>LTV</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {groupPilots
                                .slice()
                                .sort((a, b) => (b.pilotEconomics?.copierRevenueContributed ?? 0) - (a.pilotEconomics?.copierRevenueContributed ?? 0))
                                .slice(0, 4)
                                .map((pilot) => (
                                  <TableRow key={pilot.id} className="border-border/10">
                                    <TableCell className="font-semibold text-foreground">{pilot.name}</TableCell>
                                    <TableCell>{pilot.pilotEconomics ? `${pilot.pilotEconomics.copyFrequency}/wk` : "—"}</TableCell>
                                    <TableCell>{pilot.pilotEconomics ? formatCurrency(pilot.pilotEconomics.copierRevenueContributed) : formatCurrency(pilot.brokerRevenueShare)}</TableCell>
                                    <TableCell>{pilot.pilotEconomics ? formatCurrency(pilot.pilotEconomics.lifetimeValue) : "—"}</TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    ) : null}
                  </div>
                </TabsContent>

                <TabsContent value="pilots">
                  <Card className="border-border/40 bg-card/80">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border/40">
                            <TableHead className="w-[28%]">Pilot</TableHead>
                            <TableHead>Pilot Score</TableHead>
                            <TableHead>Copied Volume</TableHead>
                            <TableHead>Trades Copied</TableHead>
                            <TableHead>Profit</TableHead>
                            <TableHead>Broker Revenue</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {groupPilots.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="py-6 text-center text-sm text-muted-foreground">
                                No pilots attached to this group yet.
                              </TableCell>
                            </TableRow>
                          ) : null}
                          {groupPilots.map((pilot) => (
                            <TableRow
                              key={pilot.id}
                              className="cursor-pointer border-border/20 transition hover:bg-primary/5"
                              onClick={() => {
                                setSelectedPilot(pilot);
                                setPilotOpen(true);
                              }}
                            >
                              <TableCell className="flex items-center gap-3">
                                <EntityAvatar name={pilot.name} className="h-9 w-9" />
                                <div>
                                  <p className="font-medium text-foreground">{pilot.name}</p>
                                  <p className="text-xs text-muted-foreground">{pilot.navigatorIds.length} navigators</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <ScoreBadge score={pilot.pilotScore} />
                              </TableCell>
                              <TableCell>{formatCurrency(pilot.copiedVolume * 1_000_000)}</TableCell>
                              <TableCell>{formatNumber(pilot.tradesCopied)}</TableCell>
                              <TableCell className={cn(pilot.profit < 0 ? "text-[color:var(--pilot-bad)]" : "")}>{formatCurrency(pilot.profit)}</TableCell>
                              <TableCell>{formatCurrency(pilot.brokerRevenueShare)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="trades">
                  <Card className="border-border/40 bg-card/80">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border/40">
                            <TableHead>Time</TableHead>
                            <TableHead>Instrument</TableHead>
                            <TableHead>Side</TableHead>
                            <TableHead>Notional</TableHead>
                            <TableHead>Profit</TableHead>
                            <TableHead>Risk Flag</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {groupTrades.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="py-6 text-center text-sm text-muted-foreground">
                                No trades for this entity in the current dataset.
                              </TableCell>
                            </TableRow>
                          ) : null}
                          {groupTrades.map((trade) => (
                            <TableRow
                              key={trade.id}
                              className="cursor-pointer border-border/20 transition hover:bg-primary/5"
                              onClick={() => {
                                setSelectedTrade(trade);
                                setTradeOpen(true);
                              }}
                            >
                              <TableCell className="text-xs text-muted-foreground">
                                {new Date(trade.exitTime).toLocaleString()}
                              </TableCell>
                              <TableCell className="font-medium text-foreground">{trade.instrument}</TableCell>
                              <TableCell>{trade.side}</TableCell>
                              <TableCell>{formatCurrency(trade.notional * 1_000_000)}</TableCell>
                              <TableCell className={cn(trade.profit < 0 ? "text-[color:var(--pilot-bad)]" : "text-primary")}>{formatCurrency(trade.profit)}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    "rounded-full px-3",
                                    trade.riskFlag && trade.riskFlag !== "none"
                                      ? "bg-[color:var(--pilot-bad)]/15 text-[color:var(--pilot-bad)]"
                                      : "bg-primary/15 text-primary",
                                  )}
                                >
                                  {formatRiskFlag(trade.riskFlag)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          ) : null}
        </SheetContent>
      </Sheet>

      <PilotDetailPanel pilot={selectedPilot} open={pilotOpen} onOpenChange={setPilotOpen} />

      <TradeDetailDialog trade={selectedTrade} open={tradeOpen} onOpenChange={(isOpen) => {
        setTradeOpen(isOpen);
        if (!isOpen) {
          setSelectedTrade(null);
        }
      }} />
    </>
  );
}

function MetricBlock({ label, value, highlight, helpText }: { label: string; value: ReactNode; highlight?: boolean; helpText?: string }) {
  const block = (
    <motion.div
      layout
      className={cn(
        "rounded-3xl border-2 border-border/50 bg-sidebar/40 px-5 py-3",
        highlight && "border-primary/60 bg-primary/10 text-primary",
      )}
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">{value}</span>
      </div>
    </motion.div>
  );

  return helpText ? <HelpTooltip text={helpText}>{block}</HelpTooltip> : block;
}
