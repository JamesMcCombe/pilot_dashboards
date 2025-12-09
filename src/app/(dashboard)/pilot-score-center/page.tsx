"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScoreBadge } from "@/components/common/score-badge";
import { ValueBadge } from "@/components/common/value-badge";
import { EntityAvatar } from "@/components/common/entity-avatar";
import { ScoreArc } from "@/components/common/score-arc";
import { navigators } from "@/data/navigators";
import { groups } from "@/data/groups";
import { pilots } from "@/data/pilots";
import type { Navigator, Group, Pilot } from "@/data/types";
import { NavigatorDetailPanel } from "@/components/navigator/navigator-detail-panel";
import { GroupDetailPanel } from "@/components/group/group-detail-panel";
import { PilotDetailPanel } from "@/components/pilot/pilot-detail-panel";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { getNavigatorValueMap } from "@/lib/value-score-map";
import { HelpTooltip } from "@/components/help/help-tooltip";
import { VALUE_BADGE_TOOLTIP } from "@/components/help/help-text";
import { PilotScoreValue } from "@/components/common/pilot-score-mark";

const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

type NavigatorSortMode = "value" | "score" | "revenue";

const navigatorSortOptions: { label: string; value: NavigatorSortMode }[] = [
  { label: "Value", value: "value" },
  { label: "Score", value: "score" },
  { label: "Revenue", value: "revenue" },
];

const sortOptionHelp: Record<NavigatorSortMode, string> = {
  value: "Sort leaders by composite ValueScore (revenue + growth + behaviour).",
  score: "Sort leaders by Pilot Score to emphasise conduct stability.",
  revenue: "Sort leaders by raw broker revenue to highlight top earners.",
};

export default function PilotScoreCenterPage() {
  const [selectedNavigator, setSelectedNavigator] = useState<Navigator | null>(null);
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupOpen, setGroupOpen] = useState(false);
  const [selectedPilot, setSelectedPilot] = useState<Pilot | null>(null);
  const [pilotOpen, setPilotOpen] = useState(false);
  const [navigatorSortMode, setNavigatorSortMode] = useState<NavigatorSortMode>("value");

  const navigatorValueMap = useMemo(
    () => getNavigatorValueMap(navigators, pilots),
    [],
  );

  const sortedNavigators = useMemo(
    () =>
      [...navigators].sort((a, b) => {
        if (navigatorSortMode === "value") {
          const aScore = navigatorValueMap[a.id]?.valueScore ?? 0;
          const bScore = navigatorValueMap[b.id]?.valueScore ?? 0;
          return bScore - aScore;
        }
        if (navigatorSortMode === "revenue") {
          const aRevenue = navigatorValueMap[a.id]?.brokerValue.dailyRevenue ?? a.brokerRevenueShare;
          const bRevenue = navigatorValueMap[b.id]?.brokerValue.dailyRevenue ?? b.brokerRevenueShare;
          return bRevenue - aRevenue;
        }
        return b.pilotScore - a.pilotScore;
      }),
    [navigatorSortMode, navigatorValueMap],
  );
  const sortedGroups = useMemo(
    () => [...groups].sort((a, b) => b.groupScore - a.groupScore),
    [],
  );
  const sortedPilots = useMemo(
    () => [...pilots].sort((a, b) => b.pilotScore - a.pilotScore),
    [],
  );
  const groupTrends = useMemo(
    () => new Map(groups.map((group) => [group.id, generateTrend(group.id, group.groupScore)])),
    [],
  );
  const pilotTrends = useMemo(
    () => new Map(pilots.map((pilot) => [pilot.id, generateTrend(pilot.id, pilot.pilotScore)])),
    [],
  );

  return (
    <div className="flex flex-col gap-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Pilot Score Center</h1>
        <p className="text-sm text-muted-foreground">
          Navigator, Group, and Pilot scores across the Pilot network.
        </p>
      </motion.div>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Navigator Scores</h2>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Credit-style health across signal leaders</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Sort by</span>
            <div className="flex gap-1 rounded-full border border-border/40 bg-sidebar/40 p-1">
              {navigatorSortOptions.map((option) => (
                <HelpTooltip key={option.value} text={sortOptionHelp[option.value]} asChild indicator={false}>
                  <Button
                    type="button"
                    variant="ghost"
                    className={cn(
                      "rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em]",
                      navigatorSortMode === option.value
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground",
                    )}
                    onClick={() => setNavigatorSortMode(option.value)}
                  >
                    {option.label}
                  </Button>
                </HelpTooltip>
              ))}
            </div>
          </div>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          variants={gridVariants}
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
        >
          {sortedNavigators.map((navigator) => {
            const valueMeta = navigatorValueMap[navigator.id];
            const isTopThree = (valueMeta?.valueRank ?? Infinity) <= 3;
            const dailyRevenue = valueMeta?.brokerValue.dailyRevenue ?? navigator.brokerRevenueShare;
            const copiedVolumeDaily = valueMeta?.brokerValue.copiedVolumeDaily ?? navigator.groupVolume * 1_000_000;
            const copiers = valueMeta?.brokerValue.copiers ?? navigator.followers;
            return (
            <motion.div key={navigator.id} variants={cardVariants}>
              <Card
                className="group relative h-full overflow-hidden rounded-3xl border-2 border-border/60 bg-[rgba(4,13,28,0.95)]/95 p-6 shadow-none transition-transform duration-200 hover:-translate-y-1"
                onClick={() => {
                  setSelectedNavigator(navigator);
                  setNavigatorOpen(true);
                }}
              >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <EntityAvatar name={navigator.name} className="h-11 w-11" />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-base font-semibold text-foreground">{navigator.name}</p>
                            {isTopThree ? (
                              <span className="rounded-full border border-primary/40 bg-primary/10 px-2 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-primary">
                                #{valueMeta?.valueRank}
                              </span>
                            ) : null}
                          </div>
                          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Navigator</p>
                        </div>
                      </div>
                      {valueMeta ? (
                        <HelpTooltip text={VALUE_BADGE_TOOLTIP}>
                          <ValueBadge tier={valueMeta.valueTier} label={valueMeta.valueLabel} className="text-[0.65rem]" />
                        </HelpTooltip>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                    </div>

                    <div className="rounded-3xl border border-border/40 bg-sidebar/40 p-4">
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{formatCurrency(dailyRevenue)}</span>
                        <span className="uppercase tracking-[0.22em] text-muted-foreground/70">Rev/day</span>
                        <span aria-hidden="true" className="text-muted-foreground/40">•</span>
                        <span className="font-semibold text-foreground">{formatCurrency(copiedVolumeDaily)}</span>
                        <span className="uppercase tracking-[0.22em] text-muted-foreground/70">Volume/day</span>
                        <span aria-hidden="true" className="text-muted-foreground/40">•</span>
                        <span className="font-semibold text-foreground">{formatNumber(copiers)}</span>
                        <span className="uppercase tracking-[0.22em] text-muted-foreground/70">Copiers</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-5">
                      <ScoreArc score={navigator.pilotScore} label="Risk" size={92} strokeWidth={12} />
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <ScoreBadge score={navigator.pilotScore} />
                          <Button
                            size="sm"
                            variant="secondary"
                            className="rounded-full bg-primary/15 text-xs font-semibold uppercase tracking-[0.22em] text-primary"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedNavigator(navigator);
                              setNavigatorOpen(true);
                            }}
                          >
                            View
                          </Button>
                        </div>
                        <div className="h-20 w-full min-w-0 rounded-3xl border border-border/40 bg-sidebar/30 p-4">
                          <div className="h-full w-full min-w-0">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={80}>
                              <AreaChart data={navigator.trend} margin={{ top: 6, bottom: 0, left: 0, right: 0 }}>
                                <defs>
                                  <linearGradient id={`navigator-${navigator.id}-gradient`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#53f6c5" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#53f6c5" stopOpacity={0.05} />
                                  </linearGradient>
                                </defs>
                                <XAxis dataKey="day" hide />
                                <YAxis hide domain={[0, "auto"]} />
                                <Tooltip
                                  cursor={{ stroke: "rgba(83,246,197,0.5)", strokeWidth: 1 }}
                                  contentStyle={{
                                    backgroundColor: "rgba(5,12,28,0.92)",
                                    borderRadius: 12,
                                    border: "1px solid rgba(83,246,197,0.2)",
                                    color: "white",
                                  }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="value"
                                  stroke="#53f6c5"
                                  strokeWidth={2}
                                  fill={`url(#navigator-${navigator.id}-gradient)`}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Group Scores</h2>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Cohort health and consistency watch</p>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          variants={gridVariants}
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
        >
          {sortedGroups.map((group) => {
            const trend = groupTrends.get(group.id) ?? generateTrend(group.id, group.groupScore);
            return (
            <motion.div key={group.id} variants={cardVariants}>
              <Card
                className="group relative h-full overflow-hidden rounded-3xl border-2 border-border/60 bg-[rgba(6,16,34,0.95)] p-6 shadow-none transition-transform duration-200 hover:-translate-y-1"
                onClick={() => {
                  setSelectedGroup(group);
                  setGroupOpen(true);
                }}
              >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{group.name}</p>
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Group</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
                    <div className="flex items-center gap-4">
                      <ScoreArc score={group.groupScore} label="Group Score" size={118} strokeWidth={12} />
                      <div className="space-y-2">
                        <ScoreBadge score={group.groupScore} className="self-start" />
                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Avg Pilot Score</p>
                        <PilotScoreValue
                          score={group.avgPilotScore}
                          valueClassName="text-lg font-semibold text-foreground"
                          markClassName="h-4 w-4 border-primary/60"
                          srLabel={`Average PilotScore ${Math.round(group.avgPilotScore)}`}
                        />
                      </div>
                    </div>
                    <div className="h-full flex-1 rounded-3xl border border-border/40 bg-sidebar/30 p-4">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                        <span>Trend</span>
                        <span>Consistency {group.consistencyScore}/100</span>
                      </div>
                      <div className="mt-2 h-20 w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={120}>
                          <AreaChart data={trend} margin={{ top: 6, bottom: 0, left: 0, right: 0 }}>
                            <defs>
                              <linearGradient id={`group-${group.id}-gradient`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f5c97b" stopOpacity={0.75} />
                                <stop offset="95%" stopColor="#f5c97b" stopOpacity={0.05} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="day" hide />
                            <YAxis hide domain={[0, "auto"]} />
                            <Tooltip
                              cursor={{ stroke: "rgba(245,201,123,0.4)", strokeWidth: 1 }}
                              contentStyle={{
                                backgroundColor: "rgba(6,16,34,0.92)",
                                borderRadius: 12,
                                border: "1px solid rgba(245,201,123,0.2)",
                                color: "white",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke="#f5c97b"
                              strokeWidth={2}
                              fill={`url(#group-${group.id}-gradient)`}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <MetricPill label="Pilots" value={group.pilots.length.toString()} />
                    <MetricPill label="Consistency" value={`${group.consistencyScore}/100`} tone="neutral" />
                    <MetricPill label="Volume" value={formatCurrency(group.totalVolume * 1_000_000)} />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Pilot Scores</h2>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Discipline and performance at the individual level</p>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-120px" }}
          variants={gridVariants}
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
        >
          {sortedPilots.map((pilot) => {
            const trend = pilotTrends.get(pilot.id) ?? generateTrend(pilot.id, pilot.pilotScore);
            return (
            <motion.div key={pilot.id} variants={cardVariants}>
              <Card
                className="group relative h-full overflow-hidden rounded-3xl border-2 border-border/60 bg-[rgba(7,18,36,0.96)] p-6 shadow-none transition-transform duration-200 hover:-translate-y-1"
                onClick={() => {
                  setSelectedPilot(pilot);
                  setPilotOpen(true);
                }}
              >
                  <div className="flex items-center gap-3">
                    <EntityAvatar name={pilot.name} className="h-10 w-10" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{pilot.name}</p>
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Pilot</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
                    <div className="flex items-center gap-4">
                      <ScoreArc score={pilot.pilotScore} label="Pilot Score" size={110} strokeWidth={12} />
                      <div className="space-y-2">
                        <ScoreBadge score={pilot.pilotScore} className="self-start" />
                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Trades Copied</p>
                        <p className="text-lg font-semibold text-foreground">{formatNumber(pilot.tradesCopied)}</p>
                      </div>
                    </div>
                    <div className="h-full flex-1 rounded-3xl border border-border/40 bg-sidebar/30 p-4">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                        <span>Trend</span>
                        <span>Volume {formatCurrency(pilot.copiedVolume * 1_000_000)}</span>
                      </div>
                      <div className="mt-2 h-20 w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={120}>
                          <AreaChart data={trend} margin={{ top: 6, bottom: 0, left: 0, right: 0 }}>
                            <defs>
                              <linearGradient id={`pilot-${pilot.id}-gradient`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#53f6c5" stopOpacity={0.75} />
                                <stop offset="95%" stopColor="#53f6c5" stopOpacity={0.05} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="day" hide />
                            <YAxis hide domain={[0, "auto"]} />
                            <Tooltip
                              cursor={{ stroke: "rgba(83,246,197,0.4)", strokeWidth: 1 }}
                              contentStyle={{
                                backgroundColor: "rgba(7,18,36,0.92)",
                                borderRadius: 12,
                                border: "1px solid rgba(83,246,197,0.25)",
                                color: "white",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke="#53f6c5"
                              strokeWidth={2}
                              fill={`url(#pilot-${pilot.id}-gradient)`}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <MetricPill
                      label="Score"
                      value={<PilotScoreValue score={pilot.pilotScore} valueClassName="text-sm font-semibold text-foreground" markClassName="h-4 w-4 border-primary/60" />}
                    />
                    <MetricPill label="Copied Volume" value={formatCurrency(pilot.copiedVolume * 1_000_000)} />
                    <MetricPill label="Broker Revenue" value={formatCurrency(pilot.brokerRevenueShare)} />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <NavigatorDetailPanel
        navigator={selectedNavigator}
        open={navigatorOpen}
        onOpenChange={(isOpen) => {
          setNavigatorOpen(isOpen);
          if (!isOpen) {
            setSelectedNavigator(null);
          }
        }}
      />

      <GroupDetailPanel
        group={selectedGroup}
        open={groupOpen}
        onOpenChange={(isOpen) => {
          setGroupOpen(isOpen);
          if (!isOpen) {
            setSelectedGroup(null);
          }
        }}
      />

      <PilotDetailPanel
        pilot={selectedPilot}
        open={pilotOpen}
        onOpenChange={(isOpen) => {
          setPilotOpen(isOpen);
          if (!isOpen) {
            setSelectedPilot(null);
          }
        }}
      />
    </div>
  );
}

function MetricPill({ label, value, tone }: { label: string; value: ReactNode; tone?: "neutral" | "bad" | "good" }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/40 bg-sidebar/40 p-3",
        tone === "neutral" && "border-amber-200/30 bg-amber-500/10 text-amber-200/90",
        tone === "bad" && "border-[color:var(--pilot-bad)]/40 bg-[color:var(--pilot-bad)]/10 text-[color:var(--pilot-bad)]",
      )}
    >
      <p className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      <div className="mt-2 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function generateTrend(seed: string, baseScore: number) {
  const base = Number.isFinite(baseScore) ? baseScore : 0;
  const safeBase = Math.min(Math.max(base, 350), 1000);
  const seedValue = seed
    .split("")
    .reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0);

  return Array.from({ length: 7 }).map((_, index) => {
    const swing = Math.sin(seedValue + index) * 18;
    const slope = (index - 3) * 2.8;
    const value = Math.max(0, Math.round(safeBase + swing + slope));
    return { day: `D${index + 1}`, value };
  });
}
