import { KeyEventsTimeline } from "@/components/regulator/charts/key-events-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  EVENT_SUMMARY,
  EVENT_CATEGORY_CONFIG,
} from "@/data/regulator/key-events";

export const metadata = {
  title: "Key Harm Events | Regulator Dashboard",
  description: "Timeline of significant harm events in NZ retail trading",
};

export default function EventsPage() {
  return (
    <div className="space-y-8">
      {/* Context Panel */}
      <div className="rounded-3xl border border-[#f97316]/30 bg-[#f97316]/5 p-6">
        <h3 className="text-lg font-semibold text-[#f97316]">
          Key Harm Events Timeline
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This timeline presents a chronological view of significant harm events 
          detected in NZ retail trading patterns. Events are categorised by type 
          and severity, with links to relevant analysis modules for deeper investigation.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-6">
          {Object.entries(EVENT_CATEGORY_CONFIG).map(([key, config]) => (
            <div
              key={key}
              className="rounded-xl bg-card/50 p-3 text-center"
              style={{ borderLeft: `3px solid ${config.color}` }}
            >
              <p
                className="text-xl font-bold"
                style={{ color: config.color }}
              >
                {EVENT_SUMMARY.eventsByCategory[key] || 0}
              </p>
              <p className="text-[10px] text-muted-foreground">{config.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Timeline */}
      <KeyEventsTimeline />

      {/* Analysis Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Event Detection Methodology
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Key harm events are identified through automated pattern detection:
            </p>
            <ul className="ml-4 list-disc space-y-1 pt-2">
              <li>
                <strong>RHI threshold breaches:</strong> Events where the Retail 
                Harm Index exceeds defined thresholds or shows sudden changes
              </li>
              <li>
                <strong>Cluster detection:</strong> Identification of synchronized 
                trading activity beyond statistical norms
              </li>
              <li>
                <strong>Volatility correlation:</strong> Mapping trader behaviour 
                changes to market volatility events
              </li>
              <li>
                <strong>Flow analysis:</strong> Detecting unusual offshore migration 
                or platform concentration patterns
              </li>
              <li>
                <strong>Regulatory triggers:</strong> Manual flags from FMA monitoring 
                and enforcement activity
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Using This Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              The events timeline supports several regulatory workflows:
            </p>
            <ul className="ml-4 list-disc space-y-1 pt-2">
              <li>
                <strong>Historical analysis:</strong> Review past events to identify 
                recurring patterns and seasonal trends
              </li>
              <li>
                <strong>Impact assessment:</strong> Track affected trader counts and 
                RHI changes to prioritise intervention
              </li>
              <li>
                <strong>Module drill-down:</strong> Click through to related analysis 
                modules for detailed investigation
              </li>
              <li>
                <strong>Trend monitoring:</strong> Filter by category to track 
                specific harm vectors over time
              </li>
              <li>
                <strong>Reporting:</strong> Export event data for regulatory 
                reporting and policy development
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            6-Month Summary Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-muted/10 p-4 text-center">
              <p className="text-3xl font-bold">{EVENT_SUMMARY.totalEvents}</p>
              <p className="text-sm text-muted-foreground">Total Events Recorded</p>
            </div>
            <div className="rounded-xl bg-[#ef4444]/10 p-4 text-center">
              <p className="text-3xl font-bold text-[#ef4444]">
                {EVENT_SUMMARY.criticalEvents}
              </p>
              <p className="text-sm text-muted-foreground">Critical Severity</p>
            </div>
            <div className="rounded-xl bg-muted/10 p-4 text-center">
              <p className="text-3xl font-bold">{EVENT_SUMMARY.maxRHI}</p>
              <p className="text-sm text-muted-foreground">Peak RHI Recorded</p>
            </div>
            <div className="rounded-xl bg-muted/10 p-4 text-center">
              <p className="text-3xl font-bold">
                {EVENT_SUMMARY.totalAffectedTraders.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Traders Affected</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border/40 bg-muted/5 p-4">
            <h4 className="font-medium">Key Observations</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>
                • <strong>Volatility events</strong> account for the highest RHI 
                spikes, with the JPY carry trade unwind (Aug 2024) reaching RHI 845
              </li>
              <li>
                • <strong>Herding behaviour</strong> shows strong correlation with 
                social media activity and copy trading platforms
              </li>
              <li>
                • <strong>Offshore leakage</strong> events typically follow periods 
                of NZ broker enforcement activity
              </li>
              <li>
                • <strong>Prop firm activity</strong> creates clustered risk around 
                challenge deadlines and funding milestones
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6">
        <h3 className="text-lg font-semibold text-primary">
          Data Privacy and Synthetic Nature
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          All events displayed are synthetic demonstrations created for the FMA 
          SupTech prototype. Real implementation would derive events from aggregated, 
          anonymised trading data without identifying individual traders. Event 
          timestamps, RHI values, and affected trader counts are illustrative only.
        </p>
      </div>
    </div>
  );
}
