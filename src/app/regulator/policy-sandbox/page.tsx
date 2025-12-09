import { PolicySandbox } from "@/components/regulator/charts/policy-sandbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Policy Sandbox | Regulator Dashboard",
  description: "Simulate policy interventions and their impact on harm metrics",
};

export default function PolicySandboxPage() {
  return (
    <div className="space-y-8">
      {/* Context Panel */}
      <div className="rounded-3xl border border-[#fbbf24]/30 bg-[#fbbf24]/5 p-6">
        <h3 className="text-lg font-semibold text-[#fbbf24]">
          Harm Simulator / Policy Sandbox
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This sandbox allows you to explore how different policy interventions might 
          affect retail trading harm indicators. Adjust the policy levers to see 
          simulated changes to key metrics. <strong>All calculations use a toy model 
          on synthetic data</strong> and are for conceptual demonstration only.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium text-[#fbbf24]">Leverage Caps</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Restrict maximum leverage to reduce extreme losses
            </p>
          </div>
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium text-[#fbbf24]">Stop-Loss Nudges</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Increase adoption through defaults and education
            </p>
          </div>
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium text-[#fbbf24]">Herding Education</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Reduce synchronised trading through awareness campaigns
            </p>
          </div>
        </div>
      </div>

      {/* Main Policy Sandbox */}
      <PolicySandbox />

      {/* Insight Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Policy Intervention Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Regulators have several tools available to address retail trading harm:
            </p>
            <ul className="ml-4 list-disc space-y-1 pt-2">
              <li>
                <strong>Hard caps:</strong> Mandatory limits on leverage, position 
                sizes, or loss thresholds
              </li>
              <li>
                <strong>Soft nudges:</strong> Default settings, warnings, and 
                friction that encourage safer behaviour
              </li>
              <li>
                <strong>Education:</strong> Targeted content to improve financial 
                literacy and risk awareness
              </li>
              <li>
                <strong>Disclosure:</strong> Requiring platforms to show outcome 
                statistics and risk warnings
              </li>
              <li>
                <strong>Cooling-off:</strong> Mandatory delays before opening 
                positions or increasing exposure
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Real-World Considerations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Actual policy implementation faces challenges not captured in this model:
            </p>
            <ul className="ml-4 list-disc space-y-1 pt-2">
              <li>
                <strong>Offshore migration:</strong> Strict rules may push traders 
                to unregulated platforms
              </li>
              <li>
                <strong>Enforcement costs:</strong> Monitoring and compliance require 
                significant resources
              </li>
              <li>
                <strong>Market effects:</strong> Interventions may impact liquidity 
                and market functioning
              </li>
              <li>
                <strong>Political constraints:</strong> Industry lobbying and public 
                opinion shape feasible options
              </li>
              <li>
                <strong>Behavioural adaptation:</strong> Traders may find workarounds 
                that undermine policy intent
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Model Documentation */}
      <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Model Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This sandbox uses simplified formulas to demonstrate policy impact concepts. 
            The model is <strong>not calibrated</strong> to real data.
          </p>
          
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
              <h4 className="font-medium">Leverage Cap Impact</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Formula: Impact scales linearly with distance from baseline (10x). 
                A 3x cap produces ~24% RHI reduction, ~32% TTF increase.
              </p>
            </div>
            
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
              <h4 className="font-medium">Stop-Loss Adoption Impact</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Formula: Linear relationship with adoption increase. 
                +40% adoption produces ~14% RHI reduction, ~24% TTF increase.
              </p>
            </div>
            
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
              <h4 className="font-medium">Herding Reduction Impact</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Formula: Linear relationship with herding reduction. 
                50% reduction produces ~12.5% RHI reduction, ~15% TTF increase.
              </p>
            </div>
            
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
              <h4 className="font-medium">Combined Effects</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Multiple interventions are combined multiplicatively with diminishing 
                returns. Real-world interactions are likely more complex.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-xs text-muted-foreground">
              <strong className="text-primary">Research Note:</strong> A production 
              version of this tool would require empirical calibration using historical 
              intervention data, econometric modeling of trader behaviour, and validation 
              against controlled experiments or natural policy variations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
