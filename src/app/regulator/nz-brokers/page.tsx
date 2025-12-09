import { NZBrokerPanel } from "@/components/regulator/charts/nz-broker-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "NZ Brokers | Regulator Dashboard",
  description: "Comparison of NZ-licensed brokers on key risk metrics",
};

export default function NZBrokersPage() {
  return (
    <div className="space-y-8">
      {/* Context Panel */}
      <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6">
        <h3 className="text-lg font-semibold text-primary">
          NZ Broker Oversight
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This dashboard provides a comparative view of NZ-licensed trading platforms 
          across key risk metrics. Understanding broker-level patterns helps identify 
          where regulatory attention may be most needed.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium text-primary">Risk Scoring</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Composite score based on user outcomes and behaviour
            </p>
          </div>
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium text-primary">User Profiles</p>
            <p className="mt-1 text-xs text-muted-foreground">
              % of high-risk users and average PilotScore
            </p>
          </div>
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium text-primary">Offshore Links</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Activity patterns linked to unregulated platforms
            </p>
          </div>
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium text-primary">Risk Practices</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Leverage usage and stop-loss adoption rates
            </p>
          </div>
        </div>
      </div>

      {/* Main Broker Comparison Panel */}
      <NZBrokerPanel />

      {/* Insight Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Key Observations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Based on the synthetic broker data, several patterns emerge that would 
              warrant regulatory attention in a real-world scenario:
            </p>
            <ul className="ml-4 list-disc space-y-1 pt-2">
              <li>
                <strong>High-risk concentration:</strong> Some brokers show 
                significantly higher proportions of traders with poor PilotScores
              </li>
              <li>
                <strong>Offshore linkages:</strong> Variation in offshore-linked 
                behaviour suggests differing client acquisition channels
              </li>
              <li>
                <strong>Leverage policies:</strong> Average leverage varies 
                substantially, indicating different platform defaults and controls
              </li>
              <li>
                <strong>Risk tool adoption:</strong> Stop-loss usage ranges from 
                35% to 68%, suggesting differing platform education/nudging
              </li>
              <li>
                <strong>Churn rates:</strong> Higher churn may indicate either 
                aggressive marketing or poor user outcomes
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Potential Regulatory Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Broker-level insights could inform targeted regulatory interventions:
            </p>
            <ul className="ml-4 list-disc space-y-1 pt-2">
              <li>
                <strong>Enhanced monitoring:</strong> Focus resources on brokers 
                with elevated risk scores
              </li>
              <li>
                <strong>Best practice sharing:</strong> Identify what low-risk 
                brokers do differently (education, defaults, nudges)
              </li>
              <li>
                <strong>Leverage caps:</strong> Consider platform-specific leverage 
                restrictions for high-risk brokers
              </li>
              <li>
                <strong>Marketing review:</strong> Investigate client acquisition 
                practices at high-offshore-linked brokers
              </li>
              <li>
                <strong>Outcome reporting:</strong> Require standardised client 
                outcome disclosures across all platforms
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Risk Score Methodology */}
      <div className="rounded-3xl border border-border/60 bg-card/85 p-6">
        <h3 className="text-lg font-semibold">
          Broker Risk Score Methodology
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The Broker Risk Score (0-1000) is a weighted composite of six metrics, 
          designed to identify platforms where user harm may be elevated:
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <p className="text-2xl font-bold text-primary">25%</p>
            <p className="text-xs text-muted-foreground">High-Risk Users</p>
          </div>
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <p className="text-2xl font-bold text-primary">20%</p>
            <p className="text-xs text-muted-foreground">Avg PilotScore</p>
          </div>
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <p className="text-2xl font-bold text-primary">20%</p>
            <p className="text-xs text-muted-foreground">Offshore Links</p>
          </div>
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <p className="text-2xl font-bold text-primary">15%</p>
            <p className="text-xs text-muted-foreground">Avg Leverage</p>
          </div>
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <p className="text-2xl font-bold text-primary">10%</p>
            <p className="text-xs text-muted-foreground">Stop-Loss Usage</p>
          </div>
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <p className="text-2xl font-bold text-primary">10%</p>
            <p className="text-xs text-muted-foreground">Monthly Churn</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs">
          <span className="font-medium">Risk Bands:</span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#53f6c5]" /> Low (0-299)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#fbbf24]" /> Medium (300-499)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#f97316]" /> High (500-699)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#ef4444]" /> Critical (700+)
          </span>
        </div>
      </div>
    </div>
  );
}
