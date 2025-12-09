import { VolatilityShockPanel } from "@/components/regulator/charts/volatility-shock-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Volatility Shocks | Regulator Dashboard",
  description: "Analysis of trader behaviour during market volatility events",
};

export default function VolatilityShocksPage() {
  return (
    <div className="space-y-8">
      {/* Context Panel */}
      <div className="rounded-3xl border border-[#fbbf24]/30 bg-[#fbbf24]/5 p-6">
        <h3 className="text-lg font-semibold text-[#fbbf24]">
          Understanding Volatility Shock Response
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Market volatility events (economic releases, geopolitical shocks, flash crashes) 
          often trigger predictable but harmful patterns among retail traders. This analysis 
          examines how NZ traders respond to these events:
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium text-[#f97316]">Leverage Spike</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Traders increase position sizes during volatility
            </p>
          </div>
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium text-[#8b5cf6]">Herding Behaviour</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Synchronised trading patterns emerge rapidly
            </p>
          </div>
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium text-[#ef4444]">Elevated Losses</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Loss rates surge during shock windows
            </p>
          </div>
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium text-[#3b82f6]">RHI Impact</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Retail Harm Index spikes temporarily
            </p>
          </div>
        </div>
      </div>

      {/* Main Volatility Shock Panel */}
      <VolatilityShockPanel />

      {/* Insight Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Why Volatility Attracts Traders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              High-volatility events are paradoxically attractive to retail traders 
              despite their elevated risk. Key drivers include:
            </p>
            <ul className="ml-4 list-disc space-y-1 pt-2">
              <li>
                <strong>Perceived opportunity:</strong> Large price moves appear to 
                offer outsized profit potential
              </li>
              <li>
                <strong>FOMO:</strong> Fear of missing out on major market moves 
                drives impulsive entry
              </li>
              <li>
                <strong>Social amplification:</strong> Trading communities and social 
                media create urgency
              </li>
              <li>
                <strong>Overconfidence:</strong> Past small wins inflate belief in 
                ability to &ldquo;trade the news&rdquo;
              </li>
              <li>
                <strong>Gamification:</strong> Platform notifications and alerts 
                encourage activity during events
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Regulatory Implications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Understanding shock response patterns enables targeted interventions:
            </p>
            <ul className="ml-4 list-disc space-y-1 pt-2">
              <li>
                <strong>Circuit breakers:</strong> Consider temporary leverage 
                restrictions during extreme volatility
              </li>
              <li>
                <strong>Real-time warnings:</strong> Push notifications about 
                elevated risk during shock events
              </li>
              <li>
                <strong>Cooling-off periods:</strong> Mandatory delays before 
                opening new positions during events
              </li>
              <li>
                <strong>Education triggers:</strong> Just-in-time educational 
                content when volatility spikes
              </li>
              <li>
                <strong>Post-event analysis:</strong> Required broker reporting 
                on client outcomes during shocks
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Methodology Note */}
      <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6">
        <h3 className="text-lg font-semibold text-primary">
          Methodology Note
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This shock response analysis uses a synthetic dataset demonstrating typical 
          patterns observed in retail trading populations during volatility events. 
          In production, this would be computed from:
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-card/50 p-3 text-center">
            <p className="text-2xl font-bold text-primary">VIX</p>
            <p className="text-xs text-muted-foreground">Volatility Index Triggers</p>
          </div>
          <div className="rounded-xl bg-card/50 p-3 text-center">
            <p className="text-2xl font-bold text-primary">T-30/+60</p>
            <p className="text-xs text-muted-foreground">Pre/Post Event Windows</p>
          </div>
          <div className="rounded-xl bg-card/50 p-3 text-center">
            <p className="text-2xl font-bold text-primary">Anon</p>
            <p className="text-xs text-muted-foreground">Privacy-Preserving Analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
}
