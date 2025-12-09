"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { getPilotBreakdown, getPilotTimeline } from "@/data/score-insights";
import { trades } from "@/data/trades";
import { navigators } from "@/data/navigators";
import type { Pilot, Trade } from "@/data/types";
import { TradeDetailDialog, formatRiskFlag } from "@/components/trade/trade-detail-dialog";
import { HelpTooltip } from "@/components/help/help-tooltip";
import { PilotScoreValue } from "@/components/common/pilot-score-mark";

const PANEL_TRANSITION: Transition = { duration: 0.28, ease: "easeOut" };

interface PilotDetailPanelProps {
  pilot: Pilot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PilotDetailPanel({ pilot, open, onOpenChange }: PilotDetailPanelProps) {
  const [activeTrade, setActiveTrade] = useState<Trade | null>(null);
  const [tradeOpen, setTradeOpen] = useState(false);

  const breakdown = useMemo(() => (pilot ? getPilotBreakdown(pilot.id) : []), [pilot]);
  const behaviorTimeline = useMemo(() => (pilot ? getPilotTimeline(pilot.id) : []), [pilot]);
  const pilotTrades = useMemo(() => (pilot ? trades.filter((trade) => trade.pilotId === pilot.id) : []), [pilot]);
  const pilotNavigators = useMemo(
    () =>
      pilot
        ? navigators.filter((navigator) => pilot.navigatorIds.includes(navigator.id))
        : [],
    [pilot],
  );

  const tabHelp = {
    overview: "Overview blends Pilot Score, behaviour breakdowns, and economics for this follower.",
    timeline: "Timeline shows recent behaviour touchpoints you can narrate during reviews.",
    trades: "Trades tab lists the pilot’s executions for compliance storytelling.",
  } as const;

  const metricHelp = {
    "Copied Volume": "Total notional this pilot copies – handy for sizing their impact.",
    "Trades Copied": "Number of copied trades executed, showing how active they are.",
    Profit: "Net profit for this pilot; positive values are proof points for copy trading.",
    "Broker Revenue": "Broker revenue driven by this pilot’s activity.",
    "Navigators Followed": "How many leaders this pilot copies, helpful for diversification stories.",
  } as const;

  const economicsHelp = {
    "Days Active": "How long this pilot has been copying.",
    "Copy Frequency": "Average weekly copied trades.",
    "Copier Profit": "Pilot’s realised profit from copying.",
    "Revenue Contributed": "Broker revenue attributable to this pilot.",
    "Lifetime Value": "Estimated lifetime revenue from this pilot.",
  } as const;

  const pilotScoreHelp = "Pilot Score blends copy discipline, risk alignment, trade quality, and stability so you can contextualise this follower.";

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setActiveTrade(null);
      setTradeOpen(false);
    }
    onOpenChange(nextOpen);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:w-[620px] md:w-[760px] lg:w-[900px] xl:w-[1000px] max-w-[min(1040px,100vw)] overflow-y-auto border-border/60 bg-panel/95 p-0 text-foreground"
        >
          {pilot ? (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={PANEL_TRANSITION}
              className="space-y-6 p-6 md:p-8"
            >
              <SheetHeader className="mb-2 flex flex-row items-start justify-between">
                <div className="space-y-2">
                  <SheetTitle className="text-xl font-semibold tracking-tight">
                    {pilot.name}
                  </SheetTitle>
                  <div className="flex flex-wrap gap-2">
                    {pilotNavigators.map((navigator) => (
                      <Badge key={navigator.id} variant="secondary" className="rounded-full bg-sidebar/50 text-xs text-muted-foreground">
                        {navigator.name}
                      </Badge>
                    ))}
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
                  <HelpTooltip text={tabHelp.timeline} asChild indicator={false}>
                    <TabsTrigger value="timeline" className="rounded-xl data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
                      Behavior Timeline
                    </TabsTrigger>
                  </HelpTooltip>
                  <HelpTooltip text={tabHelp.trades} asChild indicator={false}>
                    <TabsTrigger value="trades" className="rounded-xl data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
                      Trades
                    </TabsTrigger>
                  </HelpTooltip>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="grid gap-5 rounded-3xl border-2 border-border/50 bg-sidebar/40 p-6 md:grid-cols-[1.2fr_1fr]"
                  >
                    <div className="space-y-5">
                      <HelpTooltip text={pilotScoreHelp} asChild>
                        <div className="rounded-3xl border-2 border-primary/50 bg-primary/10 p-6 text-primary">
                          <span className="text-xs uppercase tracking-[0.32em] text-primary/80">Pilot Score</span>
                          <div className="mt-3 flex items-end gap-3">
                            <motion.div
                              key={pilot.pilotScore}
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 220, damping: 24 }}
                            >
                              <PilotScoreValue
                                score={pilot.pilotScore}
                                valueClassName="text-6xl font-semibold text-primary"
                                markClassName="h-7 w-7 border-primary/70 bg-primary/15 text-[0.6rem] text-primary"
                                srLabel={`PilotScore ${pilot.pilotScore} out of 1000`}
                              />
                            </motion.div>
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

                    <div className="space-y-4">
                      <MetricRow label="Copied Volume" value={formatCurrency(pilot.copiedVolume * 1_000_000)} helpText={metricHelp["Copied Volume"]} />
                      <MetricRow label="Trades Copied" value={formatNumber(pilot.tradesCopied)} helpText={metricHelp["Trades Copied"]} />
                      <MetricRow label="Profit" value={formatCurrency(pilot.profit)} highlight={pilot.profit >= 0} negative={pilot.profit < 0} helpText={metricHelp.Profit} />
                      <MetricRow label="Broker Revenue" value={formatCurrency(pilot.brokerRevenueShare)} highlight helpText={metricHelp["Broker Revenue"]} />
                      <MetricRow label="Navigators Followed" value={pilot.navigatorIds.length.toString()} helpText={metricHelp["Navigators Followed"]} />

                      {pilot.pilotEconomics ? (
                        <div className="rounded-3xl border-2 border-border/50 bg-card/80 p-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Economics</p>
                          <div className="mt-3 grid gap-3 text-sm text-foreground">
                            <HelpTooltip text={economicsHelp["Days Active"]}>
                              <EconomicsStat label="Days Active" value={pilot.pilotEconomics.daysActive.toString()} />
                            </HelpTooltip>
                            <HelpTooltip text={economicsHelp["Copy Frequency"]}>
                              <EconomicsStat label="Copy Frequency" value={`${pilot.pilotEconomics.copyFrequency}/wk`} />
                            </HelpTooltip>
                            <HelpTooltip text={economicsHelp["Copier Profit"]}>
                              <EconomicsStat label="Copier Profit" value={formatCurrency(pilot.pilotEconomics.copierProfit)} highlight={pilot.pilotEconomics.copierProfit >= 0} />
                            </HelpTooltip>
                            <HelpTooltip text={economicsHelp["Revenue Contributed"]}>
                              <EconomicsStat label="Revenue Contributed" value={formatCurrency(pilot.pilotEconomics.copierRevenueContributed)} />
                            </HelpTooltip>
                            <HelpTooltip text={economicsHelp["Lifetime Value"]}>
                              <EconomicsStat label="Lifetime Value" value={formatCurrency(pilot.pilotEconomics.lifetimeValue)} />
                            </HelpTooltip>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="timeline">
                  <Card className="border-border/40 bg-card/80">
                    <CardContent className="space-y-4 p-6">
                      <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Behaviour Touchpoints</div>
                      <div className="flex flex-wrap gap-3">
                        {behaviorTimeline.map((event) => (
                          <HelpTooltip key={event.id} text={event.description} asChild>
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className={cn(
                                "flex h-12 min-w-[80px] items-center justify-center rounded-full border-2 px-4 text-xs",
                                event.tone === "good" && "border-primary/40 bg-primary/15 text-primary",
                                event.tone === "neutral" && "border-muted/40 bg-muted/20 text-muted-foreground",
                                event.tone === "bad" && "border-[color:var(--pilot-bad)]/40 bg-[color:var(--pilot-bad)]/15 text-[color:var(--pilot-bad)]",
                              )}
                            >
                              {event.label}
                            </motion.div>
                          </HelpTooltip>
                        ))}
                      </div>
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
                          {pilotTrades.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="py-6 text-center text-sm text-muted-foreground">
                                No trades for this entity in the current dataset.
                              </TableCell>
                            </TableRow>
                          ) : null}
                          {pilotTrades.map((trade) => (
                            <TableRow
                              key={trade.id}
                              className="cursor-pointer border-border/20 transition hover:bg-primary/5"
                              onClick={() => {
                                setActiveTrade(trade);
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

      <TradeDetailDialog
        trade={activeTrade}
        open={tradeOpen}
        onOpenChange={(isOpen) => {
          setTradeOpen(isOpen);
          if (!isOpen) {
            setActiveTrade(null);
          }
        }}
      />
    </>
  );
}

function MetricRow({
  label,
  value,
  highlight,
  negative,
  helpText,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  negative?: boolean;
  helpText?: string;
}) {
  const row = (
    <motion.div
      layout
      className={cn(
        "rounded-3xl border-2 border-border/50 bg-sidebar/40 px-5 py-3",
        highlight && !negative && "border-primary/60 bg-primary/10 text-primary",
        negative && "border-[color:var(--pilot-bad)]/60 bg-[color:var(--pilot-bad)]/10 text-[color:var(--pilot-bad)]",
      )}
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">{value}</span>
      </div>
    </motion.div>
  );

  return helpText ? <HelpTooltip text={helpText}>{row}</HelpTooltip> : row;
}

function EconomicsStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-semibold", highlight ? "text-primary" : "text-foreground")}>{value}</span>
    </div>
  );
}
