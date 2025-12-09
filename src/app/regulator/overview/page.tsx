import { KPIOverview } from "@/components/regulator/kpi-overview";
import { PilotScoreHistogram } from "@/components/regulator/charts/pilot-score-histogram";
import { OffshorePie } from "@/components/regulator/charts/offshore-pie";
import { SurvivalCurve } from "@/components/regulator/charts/survival-curve";
import { RHICard } from "@/components/regulator/charts/rhi-card";
import { RiskFactorPanel } from "@/components/regulator/charts/risk-factor-panel";
import { HerdingScoreCard } from "@/components/regulator/charts/herding-score-card";
import { KeyEventsTimeline } from "@/components/regulator/charts/key-events-timeline";
import { EarlyWarningPanel } from "@/components/regulator/charts/early-warning-panel";

export const metadata = {
  title: "Retail Harm Overview | Regulator Dashboard",
  description: "High-level NZ retail trading harm indicators and PilotScore distribution",
};

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      {/* Early Warning Indicators - At-a-glance view */}
      <EarlyWarningPanel />

      {/* Retail Harm Index - Primary Metric */}
      <RHICard />

      {/* Risk Factor Decomposition */}
      <RiskFactorPanel />

      {/* Herding & Synchronisation Score */}
      <HerdingScoreCard />

      {/* Key Harm Indicators */}
      <KPIOverview />

      {/* Primary Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PilotScoreHistogram />
        <OffshorePie />
      </div>

      {/* Survival Overview */}
      <SurvivalCurve />

      {/* Key Events Timeline (Compact) */}
      <KeyEventsTimeline compact />

      {/* Identity-less Insights Notice */}
      <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6">
        <h3 className="text-lg font-semibold text-primary">
          Identity-less Insights
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          All visualisations in this dashboard avoid storing or displaying personally
          identifiable information. Only aggregated behavioural patterns are shown.
          Individual trader IDs are anonymised synthetic identifiers used solely
          for demonstrating clustering and pattern analysis capabilities.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-card/50 p-3 text-center">
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-xs text-muted-foreground">Real Names Stored</p>
          </div>
          <div className="rounded-xl bg-card/50 p-3 text-center">
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-xs text-muted-foreground">Email/Contact Data</p>
          </div>
          <div className="rounded-xl bg-card/50 p-3 text-center">
            <p className="text-2xl font-bold text-primary">100%</p>
            <p className="text-xs text-muted-foreground">Aggregated Patterns</p>
          </div>
        </div>
      </div>
    </div>
  );
}
