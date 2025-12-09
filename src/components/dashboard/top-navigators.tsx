"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntityAvatar } from "@/components/common/entity-avatar";
import { ScoreBadge } from "@/components/common/score-badge";
import { ValueBadge } from "@/components/common/value-badge";
import { navigators } from "@/data/navigators";
import { pilots } from "@/data/pilots";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { getNavigatorValueMap } from "@/lib/value-score-map";
import { HelpTooltip } from "@/components/help/help-tooltip";
import { HELP_COPY, VALUE_BADGE_TOOLTIP } from "@/components/help/help-text";
import { PilotScoreValue } from "@/components/common/pilot-score-mark";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.08,
      duration: 0.35,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

export function TopNavigators() {
  const router = useRouter();

  const navigatorValueMap = useMemo(
    () => getNavigatorValueMap(navigators, pilots),
    [],
  );

  const topNavigators = useMemo(
    () =>
      [...navigators]
        .sort((a, b) => {
          const aScore = navigatorValueMap[a.id]?.valueScore ?? 0;
          const bScore = navigatorValueMap[b.id]?.valueScore ?? 0;
          return bScore - aScore;
        })
        .slice(0, 6),
    [navigatorValueMap],
  );

  const handleNavigate = (navigatorId: string) => {
    const params = new URLSearchParams();
    params.set("navigator", navigatorId);
    router.push(`/navigators?${params.toString()}`, { scroll: false });
  };

  return (
    <Card className="group rounded-3xl border-2 border-border/60 bg-[rgba(5,18,39,0.9)] p-1 shadow-none transition-transform duration-200 hover:-translate-y-1">
      <CardHeader className="px-6 pb-2 pt-6">
        <CardTitle className="flex items-center justify-between text-base font-semibold text-foreground">
          <HelpTooltip text={HELP_COPY.topNavigatorsTitle} asChild indicator={false}>
            <span>Top Navigators</span>
          </HelpTooltip>
          <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Broker revenue focus</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-6">
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col divide-y divide-border/30"
        >
          {topNavigators.map((navigator) => {
            const valueMeta = navigatorValueMap[navigator.id];
            const isTopThree = (valueMeta?.valueRank ?? Infinity) <= 3;
            const dailyRevenue = valueMeta?.brokerValue.dailyRevenue ?? navigator.brokerRevenueShare;
            const copiers = valueMeta?.brokerValue.copiers ?? navigator.followers;
            return (
              <motion.li key={navigator.id} variants={itemVariants}>
                <button
                  type="button"
                  onClick={() => handleNavigate(navigator.id)}
                  className="w-full rounded-3xl px-4 py-4 text-left transition-colors duration-150 hover:bg-primary/6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-1 items-center gap-3">
                      <EntityAvatar name={navigator.name} className="h-10 w-10" />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{navigator.name}</p>
                          {valueMeta ? (
                            <HelpTooltip text={VALUE_BADGE_TOOLTIP}>
                              <ValueBadge tier={valueMeta.valueTier} label={valueMeta.valueLabel} />
                            </HelpTooltip>
                          ) : (
                            <span className="text-[0.65rem] text-muted-foreground">N/A</span>
                          )}
                          {isTopThree ? (
                            <HelpTooltip text={HELP_COPY.topNavigatorRank}>
                              <span className="rounded-full border border-primary/40 bg-primary/10 px-2 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-primary">
                                Top {valueMeta?.valueRank}
                              </span>
                            </HelpTooltip>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">{formatNumber(navigator.followers)} followers</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">{formatCurrency(dailyRevenue)}</span>
                          <span aria-hidden="true" className="text-muted-foreground/40">•</span>
                          <span className="font-semibold text-foreground">{formatNumber(copiers)} copiers</span>
                          <span aria-hidden="true" className="text-muted-foreground/40">•</span>
                          <PilotScoreValue
                            score={navigator.pilotScore}
                            valueClassName="text-xs font-semibold text-foreground"
                            markClassName="h-3.5 w-3.5 border-primary/60 bg-transparent text-[0.45rem]"
                            srLabel={`PilotScore ${navigator.pilotScore}`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="ml-auto flex min-w-[220px] items-center gap-4">
                      <ScoreBadge score={navigator.pilotScore} />
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground/80">Broker Rev / Day</p>
                        <p className="font-semibold text-primary">{formatCurrency(dailyRevenue)}</p>
                      </div>
                      <div className="hidden h-16 w-32 min-w-0 rounded-2xl border border-border/30 bg-sidebar/40 p-2 sm:flex">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={64}>
                          <AreaChart data={navigator.trend} margin={{ top: 4, left: 0, right: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id={`top-nav-${navigator.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#53f6c5" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#53f6c5" stopOpacity={0.05} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="day" hide />
                            <YAxis hide domain={[0, "auto"]} />
                            <Tooltip
                              cursor={{ stroke: "rgba(83,246,197,0.5)", strokeWidth: 1 }}
                              contentStyle={{
                                backgroundColor: "rgba(5,12,28,0.95)",
                                borderRadius: 12,
                                border: "1px solid rgba(83,246,197,0.22)",
                                color: "white",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke="#53f6c5"
                              strokeWidth={2}
                              fill={`url(#top-nav-${navigator.id})`}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
      </CardContent>
    </Card>
  );
}
