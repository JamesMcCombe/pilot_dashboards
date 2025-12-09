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
import { Badge } from "@/components/ui/badge";
import { trades } from "@/data/trades";
import { navigators } from "@/data/navigators";
import { pilots } from "@/data/pilots";
import { groups } from "@/data/groups";
import type { Trade } from "@/data/types";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { ScoreBadge } from "@/components/common/score-badge";
import { EntityAvatar } from "@/components/common/entity-avatar";
import { TradeDetailDialog, formatRiskFlag } from "@/components/trade/trade-detail-dialog";

type TradeRow = Trade & {
  navigatorName: string;
  navigatorScore: number;
  pilotName: string;
  pilotScore: number;
  groupName?: string;
};

export default function TradesPage() {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [open, setOpen] = useState(false);

  const enrichedTrades = useMemo<TradeRow[]>(() => {
    const navigatorLookup = new Map(navigators.map((item) => [item.id, item] as const));
    const pilotLookup = new Map(pilots.map((item) => [item.id, item] as const));
    const groupLookup = new Map(groups.map((item) => [item.id, item] as const));

    return trades.map((trade) => {
      const navigator = navigatorLookup.get(trade.navigatorId);
      const pilot = pilotLookup.get(trade.pilotId);
      const group = trade.groupId ? groupLookup.get(trade.groupId) : undefined;

      return {
        ...trade,
        navigatorName: navigator?.name ?? "Unknown",
        navigatorScore: navigator?.pilotScore ?? 0,
        pilotName: pilot?.name ?? "Unknown",
        pilotScore: pilot?.pilotScore ?? 0,
        groupName: group?.name,
      };
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <Card className="rounded-3xl border-2 border-border/60 bg-card/85 shadow-none">
        <CardHeader className="space-y-2">
          <CardTitle className="text-lg font-semibold text-foreground">Trade Blotter</CardTitle>
          <p className="text-sm text-muted-foreground">
            Network-wide trade executions. Click any trade to review entry, exit, fees, and compliance flags in detail.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow className="border-border/40">
                <TableHead>Exit Time</TableHead>
                <TableHead>Instrument</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Notional</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Navigator</TableHead>
                <TableHead>Pilot</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrichedTrades.map((trade) => (
                <TableRow
                  key={trade.id}
                  className="cursor-pointer border-border/20 transition hover:bg-primary/5"
                  onClick={() => {
                    setSelectedTrade(trade);
                    setOpen(true);
                  }}
                >
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(trade.exitTime).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{trade.instrument}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "rounded-full px-3",
                        trade.side === "Buy"
                          ? "bg-primary/15 text-primary"
                          : "bg-[color:var(--pilot-bad)]/15 text-[color:var(--pilot-bad)]",
                      )}
                    >
                      {trade.side}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(trade.notional * 1_000_000)}</TableCell>
                  <TableCell className={trade.profit >= 0 ? "text-primary" : "text-[color:var(--pilot-bad)]"}>
                    {formatCurrency(trade.profit)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <EntityAvatar name={trade.navigatorName} className="h-8 w-8" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{trade.navigatorName}</span>
                        <ScoreBadge score={trade.navigatorScore} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <EntityAvatar name={trade.pilotName} className="h-8 w-8" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{trade.pilotName}</span>
                        <ScoreBadge score={trade.pilotScore} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {trade.groupName ?? "—"}
                  </TableCell>
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
          </div>
        </CardContent>
      </Card>

      <TradeDetailDialog
        trade={selectedTrade}
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setSelectedTrade(null);
          }
        }}
      />
    </div>
  );
}
