import { PilotNodeGraph } from "@/components/regulator/architecture/pilot-node-graph";
import { NZBrokerConnectivityPanel } from "@/components/regulator/charts/nz-broker-connectivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Architecture | Regulator Dashboard",
  description: "PilotBridge architecture and broker connectivity overview",
};

export default function ArchitecturePage() {
  return (
    <div className="space-y-8">
      {/* Context Panel */}
      <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6">
        <h3 className="text-lg font-semibold text-primary">
          System Architecture Overview
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This section illustrates how PilotBridge creates a universal connectivity 
          layer between NZ-licensed brokers and the FMA&apos;s regulatory insight platform. 
          The architecture enables privacy-preserving behavioural analysis without 
          storing personally identifiable information.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium text-primary">Universal Bridge</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Single integration point for all trading platforms
            </p>
          </div>
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium text-primary">Privacy-First</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Encrypted telemetry with no PII storage
            </p>
          </div>
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium text-primary">Real-Time Insight</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Continuous behavioural signal processing
            </p>
          </div>
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium text-primary">Regulatory Lenses</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Purpose-built views for FMA oversight
            </p>
          </div>
        </div>
      </div>

      {/* Architecture Diagram */}
      <PilotNodeGraph />

      {/* Broker Connectivity Panel */}
      <NZBrokerConnectivityPanel />

      {/* Technical Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Data Flow Principles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              The PilotBridge architecture is designed around core principles 
              that balance regulatory insight needs with privacy protection:
            </p>
            <ul className="ml-4 list-disc space-y-1 pt-2">
              <li>
                <strong>Edge Processing:</strong> Behavioural scores computed 
                at broker level before transmission
              </li>
              <li>
                <strong>Anonymisation:</strong> All trader identifiers replaced 
                with non-reversible tokens
              </li>
              <li>
                <strong>Aggregation:</strong> Individual signals combined into 
                cohort-level insights
              </li>
              <li>
                <strong>Encryption:</strong> End-to-end encryption for all 
                telemetry streams
              </li>
              <li>
                <strong>Minimal Data:</strong> Only behavioural signals transmitted, 
                not raw trade details
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Integration Pathways
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              PilotBridge supports multiple integration methods to accommodate 
              diverse broker technology stacks:
            </p>
            <ul className="ml-4 list-disc space-y-1 pt-2">
              <li>
                <strong>MT4/MT5 Plugins:</strong> Native integration via 
                Expert Advisor framework
              </li>
              <li>
                <strong>cTrader Bridge:</strong> Direct API integration for 
                cTrader platforms
              </li>
              <li>
                <strong>FIX Protocol:</strong> Industry-standard messaging 
                for institutional feeds
              </li>
              <li>
                <strong>REST/WebSocket:</strong> Modern API integration for 
                proprietary platforms
              </li>
              <li>
                <strong>TradingView:</strong> Webhook-based integration for 
                TV-connected brokers
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Regulatory Lenses Detail */}
      <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Regulatory Lens Framework
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The FMA dashboard organises insights through purpose-built &ldquo;lenses&rdquo; 
            that transform raw behavioural signals into actionable regulatory intelligence:
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
              <h4 className="font-semibold text-primary">Broker Lens</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Platform-level risk metrics and comparative analysis across 
                NZ-licensed brokers
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
              <h4 className="font-semibold text-primary">Market Lens</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Market integrity indicators including unusual trading patterns 
                and potential manipulation
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
              <h4 className="font-semibold text-primary">Population Insights</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Demographic and cohort-level analysis of retail trading 
                behaviour and outcomes
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
              <h4 className="font-semibold text-primary">Herding Module</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Detection of coordinated trading activity and synchronisation 
                patterns
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
              <h4 className="font-semibold text-primary">Risk Decomposition</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Attribution analysis breaking down harm drivers into 
                actionable factors
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
              <h4 className="font-semibold text-primary">Volatility Response</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Analysis of trader behaviour during market stress events 
                and volatility spikes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
