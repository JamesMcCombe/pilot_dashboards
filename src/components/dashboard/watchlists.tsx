"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EntityAvatar } from "@/components/common/entity-avatar";
import { ScoreBadge } from "@/components/common/score-badge";
import { navigators } from "@/data/navigators";
import { groups } from "@/data/groups";
import { formatCurrency } from "@/lib/formatters";
import { HelpTooltip } from "@/components/help/help-tooltip";

const listVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, staggerChildren: 0.08, when: "beforeChildren" },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

export function Watchlists() {
  const router = useRouter();

  const navigatorTagHelp: Record<string, string> = {
    "High Consistency": "Navigator shows disciplined risk controls and steady returns, ideal for conservative copier messaging.",
    Momentum: "Navigator is accelerating in growth or returns; highlight them in campaigns while trend lasts.",
  };

  const groupTagHelp: Record<string, string> = {
    "↑ Growing": "Group volume and revenue are trending up sharply; nurture these copiers to lock-in gains.",
    "⚠ High Risk / Reward": "Group carries higher volatility—monitor closely but position for big upside.",
  };

  const navigatorWatchlist = useMemo(
    () =>
      [...navigators]
        .filter((navigator) => navigator.pilotScore >= 780)
        .slice(0, 3)
        .map((navigator) => ({
          ...navigator,
          tag: navigator.sharpe >= 1.8 ? "High Consistency" : "Momentum",
        })),
    [],
  );

  const highGrowthGroups = useMemo(
    () =>
      [...groups]
        .sort((a, b) => b.totalVolume - a.totalVolume)
        .slice(0, 3)
        .map((group) => ({
          ...group,
          tag: "↑ Growing",
        })),
    [],
  );

  const highRiskGroups = useMemo(
    () =>
      [...groups]
        .sort((a, b) => a.groupScore - b.groupScore)
        .slice(0, 3)
        .map((group) => ({
          ...group,
          tag: "⚠ High Risk / Reward",
        })),
    [],
  );

  const navigatorById = useMemo(() => new Map(navigators.map((nav) => [nav.id, nav])), []);

  const pushWithParam = (path: string, key: string, value: string) => {
    const params = new URLSearchParams();
    params.set(key, value);
    router.push(`${path}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="grid gap-5">
      <Card className="rounded-3xl border-2 border-border/60 bg-[rgba(6,18,38,0.92)] p-1 shadow-none transition-transform duration-200 hover:-translate-y-1">
        <CardHeader className="px-6 pb-1 pt-6">
          <HelpTooltip text="Curated navigators that meet high score thresholds so brokers can quickly highlight safe leaders." asChild indicator={false}>
            <CardTitle className="text-base font-semibold text-foreground">Navigator Watchlist</CardTitle>
          </HelpTooltip>
        </CardHeader>
        <CardContent className="px-4 pb-5">
          <motion.ul initial="hidden" animate="visible" variants={listVariants} className="space-y-3">
            {navigatorWatchlist.map((navigator) => (
              <motion.li key={navigator.id} variants={itemVariants}>
                <button
                  type="button"
                  onClick={() => pushWithParam("/navigators", "navigator", navigator.id)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-border/30 bg-sidebar/40 px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60"
                >
                  <EntityAvatar name={navigator.name} className="h-9 w-9" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{navigator.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Sharpe {navigator.sharpe.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <ScoreBadge score={navigator.pilotScore} />
                    <HelpTooltip text={navigatorTagHelp[navigator.tag] ?? "Navigator tag explaining why this leader appears in the watchlist."}>
                      <Badge variant="secondary" className="rounded-full bg-primary/15 text-[0.65rem] uppercase tracking-[0.2em] text-primary">
                        {navigator.tag}
                      </Badge>
                    </HelpTooltip>
                  </div>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-2 border-border/60 bg-[rgba(6,18,38,0.9)] p-1 shadow-none transition-transform duration-200 hover:-translate-y-1">
        <CardHeader className="px-6 pb-1 pt-6">
          <HelpTooltip text="Groups whose copier or volume growth is accelerating. Use these insights to double down on proven segments." asChild indicator={false}>
            <CardTitle className="text-base font-semibold text-foreground">High-Growth Groups</CardTitle>
          </HelpTooltip>
        </CardHeader>
        <CardContent className="px-4 pb-5">
          <motion.ul initial="hidden" animate="visible" variants={listVariants} className="space-y-3">
            {highGrowthGroups.map((group) => (
              <motion.li key={group.id} variants={itemVariants}>
                <button
                  type="button"
                  onClick={() => pushWithParam("/groups", "group", group.id)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-border/30 bg-sidebar/40 px-4 py-3 text-left transition-colors hover:border-amber-300/40 hover:bg-amber-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/60"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{group.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Navigator {navigatorById.get(group.navigatorId)?.name ?? "Unknown"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-right text-xs">
                    <ScoreBadge score={group.groupScore} />
                    <HelpTooltip text={groupTagHelp[group.tag] ?? "Group tag describing behaviour or risk."}>
                      <Badge variant="secondary" className="rounded-full bg-amber-400/15 text-[0.65rem] uppercase tracking-[0.2em] text-amber-200">
                        {group.tag}
                      </Badge>
                    </HelpTooltip>
                    <span className="text-muted-foreground/80">Volume {formatCurrency(group.totalVolume * 1_000_000)}</span>
                  </div>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-2 border-border/60 bg-[rgba(6,18,38,0.9)] p-1 shadow-none transition-transform duration-200 hover:-translate-y-1">
        <CardHeader className="px-6 pb-1 pt-6">
          <HelpTooltip text="Groups with higher conduct risk or volatility but outsized upside. Use this list when narrating risk/reward trade-offs." asChild indicator={false}>
            <CardTitle className="text-base font-semibold text-foreground">High-Risk / High-Return Groups</CardTitle>
          </HelpTooltip>
        </CardHeader>
        <CardContent className="px-4 pb-5">
          <motion.ul initial="hidden" animate="visible" variants={listVariants} className="space-y-3">
            {highRiskGroups.map((group) => (
              <motion.li key={group.id} variants={itemVariants}>
                <button
                  type="button"
                  onClick={() => pushWithParam("/groups", "group", group.id)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-border/30 bg-sidebar/40 px-4 py-3 text-left transition-colors hover:border-[color:var(--pilot-bad)]/40 hover:bg-[color:var(--pilot-bad)]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--pilot-bad)]/60"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{group.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Navigator {navigatorById.get(group.navigatorId)?.name ?? "Unknown"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-right text-xs">
                    <ScoreBadge score={group.groupScore} />
                    <HelpTooltip text={groupTagHelp[group.tag] ?? "Group tag describing behaviour or risk."}>
                      <Badge variant="secondary" className="rounded-full bg-[color:var(--pilot-bad)]/15 text-[0.65rem] uppercase tracking-[0.2em] text-[color:var(--pilot-bad)]">
                        {group.tag}
                      </Badge>
                    </HelpTooltip>
                  </div>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
      </Card>
    </div>
  );
}
