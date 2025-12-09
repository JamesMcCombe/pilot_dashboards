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
import { groups } from "@/data/groups";
import { navigators } from "@/data/navigators";
import { GroupDetailPanel } from "@/components/group/group-detail-panel";
import { formatCurrency } from "@/lib/formatters";
import { ScoreBadge } from "@/components/common/score-badge";
import { HelpTooltip } from "@/components/help/help-tooltip";

export default function GroupsPage() {
  return (
    <Suspense fallback={<div className="min-h-[200px]" aria-hidden="true" />}>
      <GroupsContent />
    </Suspense>
  );
}

function GroupsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const sortedGroups = useMemo(() => [...groups].sort((a, b) => b.groupScore - a.groupScore), []);

  const selectedId = searchParams.get("group");
  const selectedGroup = selectedId
    ? groups.find((group) => group.id === selectedId) ?? null
    : null;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("group");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }
  };

  const setGroupParam = (groupId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("group", groupId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const columnHelp = {
    group: "Navigator-aligned copy cohort. Drill in to inspect pilot mix and trades.",
    navigator: "Navigator leading the group; helpful when narrating cross-sell opportunities.",
    score: "Group Score summarises risk and performance (0-1000).", 
    pilots: "Number of pilots linked to this group.",
    volume: "Total notional traded per day across the group.",
    avgProfit: "Average profit each pilot contributes in the group.",
    revenue: "Broker revenue generated per day by this group.",
  } as const;

  return (
    <div className="flex flex-col gap-6">
      <Card className="rounded-3xl border-2 border-border/60 bg-card/85 shadow-none">
        <CardHeader className="space-y-2">
          <CardTitle className="text-lg font-semibold text-foreground">Group Health Overview</CardTitle>
          <p className="text-sm text-muted-foreground">
            The broker’s copy cohorts with navigator alignment. Use the detail drawer to review pilot distribution, score breakdowns, and recent trades.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow className="border-border/40">
                <TableHead className="w-[26%]">
                  <HelpTooltip text={columnHelp.group} asChild indicator={false}>
                    <span>Group</span>
                  </HelpTooltip>
                </TableHead>
                <TableHead>
                  <HelpTooltip text={columnHelp.navigator} asChild indicator={false}>
                    <span>Navigator</span>
                  </HelpTooltip>
                </TableHead>
                <TableHead>
                  <HelpTooltip text={columnHelp.score} asChild indicator={false}>
                    <span>Group Score</span>
                  </HelpTooltip>
                </TableHead>
                <TableHead>
                  <HelpTooltip text={columnHelp.pilots} asChild indicator={false}>
                    <span># Pilots</span>
                  </HelpTooltip>
                </TableHead>
                <TableHead>
                  <HelpTooltip text={columnHelp.volume} asChild indicator={false}>
                    <span>Total Volume</span>
                  </HelpTooltip>
                </TableHead>
                <TableHead>
                  <HelpTooltip text={columnHelp.avgProfit} asChild indicator={false}>
                    <span>Avg Profit / Pilot</span>
                  </HelpTooltip>
                </TableHead>
                <TableHead>
                  <HelpTooltip text={columnHelp.revenue} asChild indicator={false}>
                    <span>Broker Revenue / Day</span>
                  </HelpTooltip>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedGroups.map((group) => {
                const navigator = navigators.find((candidate) => candidate.id === group.navigatorId);
                return (
                  <TableRow
                    key={group.id}
                    className="cursor-pointer border-border/20 transition hover:bg-primary/5"
                    onClick={() => setGroupParam(group.id)}
                  >
                    <TableCell className="font-medium text-foreground">{group.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {navigator ? navigator.name : "Unknown"}
                    </TableCell>
                    <TableCell>
                      <ScoreBadge score={group.groupScore} />
                    </TableCell>
                    <TableCell>{group.pilots.length}</TableCell>
                    <TableCell>{formatCurrency(group.totalVolume * 1_000_000)}</TableCell>
                    <TableCell>{formatCurrency(group.avgProfitPerPilot)}</TableCell>
                    <TableCell>{formatCurrency(group.brokerRevenueShare)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <GroupDetailPanel group={selectedGroup} open={Boolean(selectedGroup)} onOpenChange={handleOpenChange} />
    </div>
  );
}
