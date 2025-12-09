import { CohortExplorer } from "@/components/regulator/charts/cohort-explorer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Cohorts | Regulator Dashboard",
  description: "Behavioural cohort segmentation and analysis",
};

export default function CohortsPage() {
  return (
    <div className="space-y-8">
      {/* Context Panel */}
      <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6">
        <h3 className="text-lg font-semibold text-primary">
          Understanding Behavioural Cohorts
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Traders are segmented into behavioural cohorts based on their trading patterns, 
          risk tolerance, and outcomes. This segmentation enables targeted regulatory 
          interventions and helps identify which groups contribute most to retail harm.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          <div className="rounded-xl bg-card/50 p-3 text-center">
            <div className="mx-auto h-8 w-8 rounded-lg bg-[#3b82f6]/20 p-1.5">
              <div className="h-full w-full rounded bg-[#3b82f6]" />
            </div>
            <p className="mt-2 text-xs font-medium">New Traders</p>
          </div>
          <div className="rounded-xl bg-card/50 p-3 text-center">
            <div className="mx-auto h-8 w-8 rounded-lg bg-[#ef4444]/20 p-1.5">
              <div className="h-full w-full rounded bg-[#ef4444]" />
            </div>
            <p className="mt-2 text-xs font-medium">High-Leverage</p>
          </div>
          <div className="rounded-xl bg-card/50 p-3 text-center">
            <div className="mx-auto h-8 w-8 rounded-lg bg-[#8b5cf6]/20 p-1.5">
              <div className="h-full w-full rounded bg-[#8b5cf6]" />
            </div>
            <p className="mt-2 text-xs font-medium">Socially Influenced</p>
          </div>
          <div className="rounded-xl bg-card/50 p-3 text-center">
            <div className="mx-auto h-8 w-8 rounded-lg bg-[#53f6c5]/20 p-1.5">
              <div className="h-full w-full rounded bg-[#53f6c5]" />
            </div>
            <p className="mt-2 text-xs font-medium">Consistent / Stable</p>
          </div>
          <div className="rounded-xl bg-card/50 p-3 text-center">
            <div className="mx-auto h-8 w-8 rounded-lg bg-[#f97316]/20 p-1.5">
              <div className="h-full w-full rounded bg-[#f97316]" />
            </div>
            <p className="mt-2 text-xs font-medium">Volatility Chasers</p>
          </div>
        </div>
      </div>

      {/* Main Cohort Explorer */}
      <CohortExplorer />

      {/* Insight Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Segmentation Methodology
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Cohort membership is determined through behavioural signal analysis:
            </p>
            <ul className="ml-4 list-disc space-y-1 pt-2">
              <li>
                <strong>Leverage patterns:</strong> Average and peak leverage 
                usage over trading history
              </li>
              <li>
                <strong>Social correlation:</strong> Timing synchronisation with 
                other traders and copy trading signals
              </li>
              <li>
                <strong>Volatility response:</strong> Activity changes during 
                high-volatility market events
              </li>
              <li>
                <strong>Risk management:</strong> Stop-loss usage, position 
                sizing consistency, drawdown patterns
              </li>
              <li>
                <strong>Account maturity:</strong> Trading duration, deposit 
                patterns, learning progression
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Regulatory Applications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Cohort-level insights enable targeted regulatory interventions:
            </p>
            <ul className="ml-4 list-disc space-y-1 pt-2">
              <li>
                <strong>Risk warnings:</strong> Cohort-specific messaging based 
                on identified harm patterns
              </li>
              <li>
                <strong>Product restrictions:</strong> Tailored leverage limits 
                for high-risk cohorts
              </li>
              <li>
                <strong>Education targeting:</strong> Customised educational 
                content for each segment
              </li>
              <li>
                <strong>Broker accountability:</strong> Monitoring cohort 
                distributions across platforms
              </li>
              <li>
                <strong>Policy evaluation:</strong> Measuring intervention 
                effectiveness by cohort
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* RHI Contribution Chart */}
      <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            RHI Contribution by Cohort
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Each cohort contributes differently to the overall Retail Harm Index. 
            High-leverage traders and socially influenced traders together account 
            for over 50% of total RHI, despite representing only ~34% of the population.
          </p>
          <div className="mt-4 space-y-3">
            {[
              { name: "High-Leverage Traders", pct: 28.2, color: "#ef4444", size: 14.4 },
              { name: "Socially Influenced", pct: 24.8, color: "#8b5cf6", size: 19.7 },
              { name: "Volatility Chasers", pct: 20.3, color: "#f97316", size: 19.4 },
              { name: "New Traders", pct: 18.5, color: "#3b82f6", size: 22.4 },
              { name: "Consistent / Stable", pct: 8.2, color: "#53f6c5", size: 24.1 },
            ].map((cohort) => (
              <div key={cohort.name} className="flex items-center gap-3">
                <div className="w-32 text-sm">{cohort.name}</div>
                <div className="flex-1">
                  <div className="h-6 w-full overflow-hidden rounded-full bg-muted/20">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${cohort.pct * 3}%`,
                        backgroundColor: cohort.color,
                      }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right">
                  <span className="font-semibold" style={{ color: cohort.color }}>
                    {cohort.pct}%
                  </span>
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({cohort.size}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Bar shows RHI contribution %. Number in parentheses shows cohort size as % of total population.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
