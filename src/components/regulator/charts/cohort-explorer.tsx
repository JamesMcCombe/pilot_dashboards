"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Cell,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Info,
  UserPlus,
  TrendingUp,
  Users,
  Shield,
  Zap,
  X,
  Clock,
  Target,
  AlertTriangle,
  Activity,
} from "lucide-react";
import {
  BEHAVIOURAL_COHORTS,
  COHORT_SUMMARY,
  COHORT_RISK_COLORS,
  OVERALL_SURVIVAL_CURVE,
  type BehaviouralCohort,
} from "@/data/regulator/behavioural-cohorts";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  UserPlus,
  TrendingUp,
  Users,
  Shield,
  Zap,
};

function CohortCard({
  cohort,
  isSelected,
  onSelect,
}: {
  cohort: BehaviouralCohort;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = iconMap[cohort.icon] || Users;
  const riskColor = COHORT_RISK_COLORS[cohort.riskLevel];

  return (
    <motion.button
      className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
        isSelected
          ? "border-primary/50 bg-primary/10 shadow-lg"
          : "border-border/40 bg-card/50 hover:bg-muted/20"
      }`}
      onClick={onSelect}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${cohort.color}20`, color: cohort.color }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold">{cohort.name}</h4>
            <p className="text-xs text-muted-foreground">
              {cohort.cohortSize.toLocaleString()} traders ({cohort.percentOfTotal}%)
            </p>
          </div>
        </div>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase"
          style={{ backgroundColor: `${riskColor}20`, color: riskColor }}
        >
          {cohort.riskLevel}
        </span>
      </div>

      {/* Quick metrics */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg bg-muted/30 p-2">
          <p className="text-muted-foreground">PilotScore</p>
          <p className="font-semibold">{cohort.avgPilotScore}</p>
        </div>
        <div className="rounded-lg bg-muted/30 p-2">
          <p className="text-muted-foreground">TTF</p>
          <p className="font-semibold">{cohort.medianTimeToFailure}d</p>
        </div>
        <div className="rounded-lg bg-muted/30 p-2">
          <p className="text-muted-foreground">RHI</p>
          <p className="font-semibold" style={{ color: riskColor }}>
            {cohort.rhiContribution}%
          </p>
        </div>
      </div>
    </motion.button>
  );
}

function CohortDetailView({
  cohort,
  onClose,
}: {
  cohort: BehaviouralCohort;
  onClose: () => void;
}) {
  const Icon = iconMap[cohort.icon] || Users;
  const riskColor = COHORT_RISK_COLORS[cohort.riskLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="rounded-3xl border-2 border-border/60 bg-card/95 p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${cohort.color}20`, color: cohort.color }}
          >
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{cohort.name}</h3>
            <p className="text-sm text-muted-foreground">{cohort.description}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/20 hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Key Metrics */}
      <div className="mt-6 grid grid-cols-6 gap-3">
        <MetricCard
          label="Cohort Size"
          value={cohort.cohortSize.toLocaleString()}
          subtext={`${cohort.percentOfTotal}% of total`}
          icon={Users}
        />
        <MetricCard
          label="Avg PilotScore"
          value={cohort.avgPilotScore.toString()}
          subtext="0-1000 scale"
          icon={Target}
          color={cohort.avgPilotScore < 500 ? "#f97316" : "#53f6c5"}
        />
        <MetricCard
          label="Avg Leverage"
          value={`${cohort.avgLeverage}x`}
          subtext="position size"
          icon={TrendingUp}
          color={cohort.avgLeverage > 8 ? "#ef4444" : undefined}
        />
        <MetricCard
          label="Median TTF"
          value={`${cohort.medianTimeToFailure}d`}
          subtext="time to failure"
          icon={Clock}
          color={cohort.medianTimeToFailure < 30 ? "#ef4444" : "#53f6c5"}
        />
        <MetricCard
          label="Herding Score"
          value={cohort.avgHerdingScore.toString()}
          subtext="synchronisation"
          icon={Activity}
          color={cohort.avgHerdingScore > 600 ? "#f97316" : undefined}
        />
        <MetricCard
          label="RHI Contribution"
          value={`${cohort.rhiContribution}%`}
          subtext="of total harm"
          icon={AlertTriangle}
          color={riskColor}
        />
      </div>

      {/* Charts Row */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Survival Curve Comparison */}
        <div className="rounded-2xl border border-border/40 bg-muted/10 p-4">
          <h4 className="mb-3 text-sm font-medium">Survival Curve vs Overall</h4>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="cohortGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={cohort.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={cohort.color} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="overallGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c8dad" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7c8dad" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 141, 173, 0.1)" />
                <XAxis
                  dataKey="day"
                  type="number"
                  domain={[0, 90]}
                  tick={{ fill: "#7c8dad", fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                  tickFormatter={(v) => `${v}d`}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#7c8dad", fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                  tickFormatter={(v) => `${v}%`}
                />
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length < 2) return null;
                    return (
                      <div className="rounded-xl border border-border bg-popover p-2 text-xs shadow-lg">
                        <p className="text-muted-foreground">Day {payload[0]?.payload?.day}</p>
                        <p style={{ color: cohort.color }}>
                          {cohort.name}: {payload[0]?.value}%
                        </p>
                        <p className="text-muted-foreground">
                          Overall: {payload[1]?.value}%
                        </p>
                      </div>
                    );
                  }}
                />
                {/* Overall curve */}
                <Area
                  data={OVERALL_SURVIVAL_CURVE}
                  type="monotone"
                  dataKey="survival"
                  stroke="#7c8dad"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  fill="url(#overallGradient)"
                />
                {/* Cohort curve */}
                <Area
                  data={cohort.survivalCurve}
                  type="monotone"
                  dataKey="survival"
                  stroke={cohort.color}
                  strokeWidth={2}
                  fill="url(#cohortGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-0.5 w-4" style={{ backgroundColor: cohort.color }} />
              {cohort.name}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-0.5 w-4 border-t-2 border-dashed border-muted-foreground" />
              Overall
            </span>
          </div>
        </div>

        {/* PilotScore Distribution */}
        <div className="rounded-2xl border border-border/40 bg-muted/10 p-4">
          <h4 className="mb-3 text-sm font-medium">PilotScore Distribution</h4>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cohort.pilotScoreDistribution}
                margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 141, 173, 0.1)" />
                <XAxis
                  dataKey="range"
                  tick={{ fill: "#7c8dad", fontSize: 9 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                />
                <YAxis
                  tick={{ fill: "#7c8dad", fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                />
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload[0]) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-border bg-popover p-2 text-xs shadow-lg">
                        <p className="font-medium">{data.range}</p>
                        <p className="text-muted-foreground">{data.count} traders</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={cohort.avgPilotScore > 600 ? "601-800" : "401-600"} stroke={cohort.color} strokeDasharray="3 3" />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {cohort.pilotScoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Average: <span className="font-medium">{cohort.avgPilotScore}</span>
          </p>
        </div>
      </div>

      {/* Characteristics & Implications */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/40 bg-muted/10 p-4">
          <h4 className="mb-3 text-sm font-medium">Key Characteristics</h4>
          <ul className="space-y-2">
            {cohort.characteristics.map((char, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: cohort.color }} />
                {char}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="rounded-2xl border p-4"
          style={{ borderColor: `${riskColor}40`, backgroundColor: `${riskColor}10` }}
        >
          <h4 className="mb-3 text-sm font-medium" style={{ color: riskColor }}>
            Regulatory Implications
          </h4>
          <p className="text-sm text-muted-foreground">{cohort.regulatoryImplications}</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-4 flex flex-wrap gap-4 rounded-xl bg-muted/10 p-3 text-xs text-muted-foreground">
        <span>
          Stop-Loss Usage: <strong>{cohort.pctUsingStopLoss}%</strong>
        </span>
        <span>
          Volatility Exposure: <strong>{cohort.avgVolatilityExposure}/100</strong>
        </span>
        <span>
          90-Day Survival: <strong>{cohort.survivalRate90Day}%</strong>
        </span>
        <span>
          Avg Loss: <strong>${cohort.avgLossPerTrader.toLocaleString()}</strong>
        </span>
      </div>
    </motion.div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  subtext?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-muted/20 p-3 text-center">
      <Icon className="mx-auto h-4 w-4 text-muted-foreground" />
      <p className="mt-1 text-lg font-bold" style={color ? { color } : undefined}>
        {value}
      </p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

export function CohortExplorer() {
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const selectedCohort = selectedCohortId
    ? BEHAVIOURAL_COHORTS.find((c) => c.id === selectedCohortId)
    : null;

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">
              Behavioural Cohort Explorer
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  NZ traders segmented into behavioural cohorts based on trading 
                  patterns, risk tolerance, and outcomes. All data is synthetic 
                  for demonstration purposes.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="rounded-full bg-[#fbbf24]/10 px-3 py-1 text-xs font-medium text-[#fbbf24]">
            Synthetic Data
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Select a cohort to explore detailed metrics and regulatory implications
        </p>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-4 gap-3">
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <p className="text-xs text-muted-foreground">Total Traders</p>
            <p className="mt-1 text-xl font-bold">{COHORT_SUMMARY.totalTraders.toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <p className="text-xs text-muted-foreground">Cohorts</p>
            <p className="mt-1 text-xl font-bold">{BEHAVIOURAL_COHORTS.length}</p>
          </div>
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <p className="text-xs text-muted-foreground">Avg PilotScore</p>
            <p className="mt-1 text-xl font-bold">{COHORT_SUMMARY.avgPilotScore}</p>
          </div>
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <p className="text-xs text-muted-foreground">High-Risk Cohorts</p>
            <p className="mt-1 text-xl font-bold text-[#f97316]">
              {COHORT_SUMMARY.highRiskCohorts}
            </p>
          </div>
        </div>

        {/* Cohort Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {BEHAVIOURAL_COHORTS.map((cohort) => (
            <CohortCard
              key={cohort.id}
              cohort={cohort}
              isSelected={selectedCohortId === cohort.id}
              onSelect={() =>
                setSelectedCohortId(selectedCohortId === cohort.id ? null : cohort.id)
              }
            />
          ))}
        </div>

        {/* Detail View */}
        <AnimatePresence>
          {selectedCohort && (
            <div className="mt-6">
              <CohortDetailView
                cohort={selectedCohort}
                onClose={() => setSelectedCohortId(null)}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Hint when no selection */}
        {!selectedCohort && (
          <div className="mt-6 rounded-xl border border-dashed border-border/60 bg-muted/10 p-6 text-center">
            <Users className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              Click on a cohort card above to view detailed metrics and charts
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
          <span className="font-medium text-primary">Cohort Segmentation: </span>
          Traders are segmented based on behavioural patterns including leverage usage, 
          trading frequency, social correlation, and volatility response. Cohort 
          membership is computed from anonymised behavioural signals, not personal data.
        </div>
      </CardContent>
    </Card>
  );
}
