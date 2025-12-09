"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pilots } from "@/data/pilots";
import { navigators } from "@/data/navigators";
import type { Pilot } from "@/data/types";
import { PilotDetailPanel } from "@/components/pilot/pilot-detail-panel";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { ScoreBadge } from "@/components/common/score-badge";
import { EntityAvatar } from "@/components/common/entity-avatar";
import { HelpTooltip } from "@/components/help/help-tooltip";

export default function PilotsPage() {
  const [selectedPilot, setSelectedPilot] = useState<Pilot | null>(null);
  const [open, setOpen] = useState(false);

  const enrichedPilots = useMemo(() => {
    const navigatorLookup = new Map(navigators.map((navigator) => [navigator.id, navigator.name] as const));
    return pilots.map((pilot) => ({
      ...pilot,
      navigatorNames: pilot.navigatorIds.map((id) => navigatorLookup.get(id) ?? "Unknown"),
    }));
  }, []);

  const columnHelp = {
    pilot: "Pilot (copy follower) account you supervise. Click to open their behaviour timelines.",
    score: "Pilot Score captures discipline and compliance risk out of 1000.",
    volume: "Total notional they copy per day/week; indicates engagement level.",
    trades: "Number of copied trades executed – use to identify power copiers.",
    profit: "Pilot’s net profit from copying – helpful for telling success stories.",
    revenue: "Broker revenue attributable to this pilot’s activity (fees/spread).",
    navigators: "List of navigators this pilot follows; useful for matching behaviour to leaders.",
  } as const;

  return (
    <div className="flex flex-col gap-6">
      <Card className="rounded-3xl border-2 border-border/60 bg-card/85 shadow-none">
        <CardHeader className="space-y-2">
          <CardTitle className="text-lg font-semibold text-foreground">Pilot Scorebook</CardTitle>
          <p className="text-sm text-muted-foreground">
            Inspect pilot discipline, risk alignment, and trade history. Select any pilot to review score breakdowns and behavioural timelines.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow className="border-border/40">
                <TableHead className="w-[24%]">
                  <HelpTooltip text={columnHelp.pilot} asChild indicator={false}>
                    <span>Pilot</span>
                  </HelpTooltip>
                </TableHead>
                <TableHead>
                  <HelpTooltip text={columnHelp.score} asChild indicator={false}>
                    <span>Pilot Score</span>
                  </HelpTooltip>
                </TableHead>
                <TableHead>
                  <HelpTooltip text={columnHelp.volume} asChild indicator={false}>
                    <span>Copied Volume</span>
                  </HelpTooltip>
                </TableHead>
                <TableHead>
                  <HelpTooltip text={columnHelp.trades} asChild indicator={false}>
                    <span>Trades Copied</span>
                  </HelpTooltip>
                </TableHead>
                <TableHead>
                  <HelpTooltip text={columnHelp.profit} asChild indicator={false}>
                    <span>Profit</span>
                  </HelpTooltip>
                </TableHead>
                <TableHead>
                  <HelpTooltip text={columnHelp.revenue} asChild indicator={false}>
                    <span>Broker Revenue</span>
                  </HelpTooltip>
                </TableHead>
                <TableHead>
                  <HelpTooltip text={columnHelp.navigators} asChild indicator={false}>
                    <span>Navigators</span>
                  </HelpTooltip>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrichedPilots.map((pilot) => (
                <TableRow
                  key={pilot.id}
                  className="cursor-pointer border-border/20 transition hover:bg-primary/5"
                  onClick={() => {
                    setSelectedPilot(pilot);
                    setOpen(true);
                  }}
                >
                  <TableCell className="flex items-center gap-3">
                    <EntityAvatar name={pilot.name} className="h-9 w-9" />
                    <div>
                      <p className="font-medium text-foreground">{pilot.name}</p>
                      <p className="text-xs text-muted-foreground">{formatNumber(pilot.tradesCopied)} trades copied</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ScoreBadge score={pilot.pilotScore} />
                  </TableCell>
                  <TableCell>{formatCurrency(pilot.copiedVolume * 1_000_000)}</TableCell>
                  <TableCell>{formatNumber(pilot.tradesCopied)}</TableCell>
                  <TableCell className={pilot.profit < 0 ? "text-[color:var(--pilot-bad)]" : ""}>{formatCurrency(pilot.profit)}</TableCell>
                  <TableCell>{formatCurrency(pilot.brokerRevenueShare)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                      {pilot.navigatorNames.map((name) => (
                        <span key={`${pilot.id}-${name}`} className="rounded-full bg-sidebar/50 px-2 py-1">
                          {name}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <PilotDetailPanel pilot={selectedPilot} open={open} onOpenChange={setOpen} />
    </div>
  );
}
