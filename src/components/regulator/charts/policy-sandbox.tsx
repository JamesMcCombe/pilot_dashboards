"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Info,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Gauge,
  Shield,
  Users,
  Clock,
  Target,
  DollarSign,
  Activity,
  Sparkles,
} from "lucide-react";
import {
  BASELINE_METRICS,
  DEFAULT_POLICY_LEVERS,
  LEVER_CONFIGS,
  PRESET_SCENARIOS,
  simulatePolicyImpact,
  getPolicyImpactBreakdown,
  type PolicyLevers,
} from "@/data/regulator/policy-sandbox";

function Slider({
  value,
  onChange,
  min,
  max,
  step,
  label,
  unit,
  description,
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  unit: string;
  description: string;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{label}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <Info className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">{description}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <span className="text-lg font-bold text-primary">
          {value}{unit}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted/30
            [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-lg"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${percentage}%, hsl(var(--muted)/0.3) ${percentage}%, hsl(var(--muted)/0.3) 100%)`,
          }}
        />
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
}

function MetricComparison({
  label,
  baseline,
  simulated,
  change,
  unit,
  icon: Icon,
  positiveIsGood,
}: {
  label: string;
  baseline: number;
  simulated: number;
  change: number;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  positiveIsGood: boolean;
}) {
  const isImproved = positiveIsGood ? change > 0 : change < 0;
  const isChanged = Math.abs(change) > 0.1;

  return (
    <motion.div
      className={`rounded-2xl border p-4 transition-all ${
        isChanged
          ? isImproved
            ? "border-[#53f6c5]/40 bg-[#53f6c5]/10"
            : "border-[#f97316]/40 bg-[#f97316]/10"
          : "border-border/40 bg-muted/10"
      }`}
      animate={{ scale: isChanged ? [1, 1.02, 1] : 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      
      <div className="mt-2 flex items-end justify-between">
        <div>
          <p className="text-xs text-muted-foreground line-through">
            {baseline.toLocaleString()}{unit}
          </p>
          <p className={`text-2xl font-bold ${isChanged ? (isImproved ? "text-[#53f6c5]" : "text-[#f97316]") : ""}`}>
            {simulated.toLocaleString()}{unit}
          </p>
        </div>
        {isChanged && (
          <div className={`flex items-center gap-1 ${isImproved ? "text-[#53f6c5]" : "text-[#f97316]"}`}>
            {isImproved ? (
              positiveIsGood ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
            ) : (
              positiveIsGood ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {change > 0 ? "+" : ""}{change.toLocaleString()}{unit}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function PolicySandbox() {
  const [levers, setLevers] = useState<PolicyLevers>(DEFAULT_POLICY_LEVERS);
  
  const simulated = useMemo(() => simulatePolicyImpact(levers), [levers]);
  const impactBreakdown = useMemo(() => getPolicyImpactBreakdown(levers), [levers]);
  
  const hasChanges = 
    levers.maxLeverageCap !== 10 ||
    levers.stopLossAdoptionIncrease !== 0 ||
    levers.herdingReductionPct !== 0;

  const handleReset = () => {
    setLevers(DEFAULT_POLICY_LEVERS);
  };

  const handlePreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setLevers(preset.levers);
  };

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">
              Policy Sandbox
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  Simulate how different policy interventions could affect 
                  retail harm metrics. This is a toy model using simplified 
                  formulas for illustration only.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 rounded-lg border border-border/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/20"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
            <span className="rounded-full bg-[#fbbf24]/10 px-3 py-1 text-xs font-medium text-[#fbbf24]">
              Demo Model Only
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Adjust policy levers to see simulated impact on harm indicators
        </p>
      </CardHeader>
      <CardContent>
        {/* Prominent Disclaimer */}
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#fbbf24]/40 bg-[#fbbf24]/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#fbbf24]" />
          <div>
            <p className="font-medium text-[#fbbf24]">Toy Model Disclaimer</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This sandbox uses a simplified simulation model on synthetic data to demonstrate 
              how policy levers could conceptually affect harm indicators. The formulas are 
              <strong> not calibrated</strong> to real-world data and should not be used for 
              actual policy decisions. Real policy impact analysis would require rigorous 
              empirical research and validation.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[350px,1fr]">
          {/* Left: Controls */}
          <div className="space-y-6">
            {/* Preset Scenarios */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Preset Scenarios
              </p>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => handlePreset(scenario)}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      JSON.stringify(levers) === JSON.stringify(scenario.levers)
                        ? "border-primary/50 bg-primary/10"
                        : "border-border/40 bg-muted/10 hover:bg-muted/20"
                    }`}
                  >
                    <p className="text-sm font-medium">{scenario.name}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-2">
                      {scenario.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-6 rounded-2xl border border-border/40 bg-muted/10 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Policy Levers
              </p>
              {LEVER_CONFIGS.map((config) => (
                <Slider
                  key={config.id}
                  value={levers[config.id]}
                  onChange={(value) => setLevers((prev) => ({ ...prev, [config.id]: value }))}
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  label={config.name}
                  unit={config.unit}
                  description={config.impactDescription}
                />
              ))}
            </div>

            {/* Impact Breakdown */}
            {impactBreakdown.length > 0 && (
              <div className="rounded-2xl border border-border/40 bg-muted/10 p-4">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Impact Breakdown
                </p>
                <div className="space-y-3">
                  {impactBreakdown.map((impact, i) => (
                    <div key={i} className="rounded-lg bg-card/50 p-3">
                      <p className="text-sm font-medium">{impact.lever}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {impact.description}
                      </p>
                      <div className="mt-2 flex gap-3 text-xs">
                        <span className={impact.rhiImpact < 0 ? "text-[#53f6c5]" : "text-[#f97316]"}>
                          RHI: {impact.rhiImpact > 0 ? "+" : ""}{impact.rhiImpact}
                        </span>
                        <span className={impact.ttfImpact > 0 ? "text-[#53f6c5]" : "text-[#f97316]"}>
                          TTF: {impact.ttfImpact > 0 ? "+" : ""}{impact.ttfImpact}d
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Outcomes */}
          <div className="space-y-6">
            {/* Primary Metrics */}
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Simulated Outcomes (Before → After)
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <MetricComparison
                  label="Retail Harm Index"
                  baseline={BASELINE_METRICS.rhi}
                  simulated={simulated.rhi}
                  change={simulated.rhiChange}
                  unit=""
                  icon={Gauge}
                  positiveIsGood={false}
                />
                <MetricComparison
                  label="Median Time to Failure"
                  baseline={BASELINE_METRICS.medianTTF}
                  simulated={simulated.medianTTF}
                  change={simulated.ttfChange}
                  unit=" days"
                  icon={Clock}
                  positiveIsGood={true}
                />
                <MetricComparison
                  label="% High-Risk Traders"
                  baseline={BASELINE_METRICS.pctHighRisk}
                  simulated={simulated.pctHighRisk}
                  change={simulated.highRiskChange}
                  unit="%"
                  icon={AlertTriangle}
                  positiveIsGood={false}
                />
                <MetricComparison
                  label="Herding Score"
                  baseline={BASELINE_METRICS.herdingScore}
                  simulated={simulated.herdingScore}
                  change={simulated.herdingChange}
                  unit=""
                  icon={Users}
                  positiveIsGood={false}
                />
              </div>
            </div>

            {/* Secondary Metrics */}
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Additional Indicators
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricComparison
                  label="Avg Leverage"
                  baseline={BASELINE_METRICS.avgLeverage}
                  simulated={simulated.avgLeverage}
                  change={simulated.leverageChange}
                  unit="x"
                  icon={TrendingUp}
                  positiveIsGood={false}
                />
                <MetricComparison
                  label="Stop-Loss Usage"
                  baseline={BASELINE_METRICS.pctUsingStopLoss}
                  simulated={simulated.pctUsingStopLoss}
                  change={simulated.stopLossChange}
                  unit="%"
                  icon={Shield}
                  positiveIsGood={true}
                />
                <MetricComparison
                  label="90-Day Survival"
                  baseline={BASELINE_METRICS.survivalRate90Day}
                  simulated={simulated.survivalRate90Day}
                  change={simulated.survivalChange}
                  unit="%"
                  icon={Target}
                  positiveIsGood={true}
                />
                <MetricComparison
                  label="Avg Loss/Trader"
                  baseline={BASELINE_METRICS.avgLossPerTrader}
                  simulated={simulated.avgLossPerTrader}
                  change={simulated.lossChange}
                  unit=""
                  icon={DollarSign}
                  positiveIsGood={false}
                />
              </div>
            </div>

            {/* Summary */}
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-primary/30 bg-primary/5 p-4"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <p className="font-medium text-primary">Simulation Summary</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  With the selected interventions, the model estimates:
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  {simulated.rhiChange !== 0 && (
                    <li className={simulated.rhiChange < 0 ? "text-[#53f6c5]" : "text-[#f97316]"}>
                      • RHI would {simulated.rhiChange < 0 ? "decrease" : "increase"} by{" "}
                      <strong>{Math.abs(simulated.rhiChange)}</strong> points (
                      {((simulated.rhiChange / BASELINE_METRICS.rhi) * 100).toFixed(1)}%)
                    </li>
                  )}
                  {simulated.ttfChange !== 0 && (
                    <li className={simulated.ttfChange > 0 ? "text-[#53f6c5]" : "text-[#f97316]"}>
                      • Median TTF would {simulated.ttfChange > 0 ? "increase" : "decrease"} by{" "}
                      <strong>{Math.abs(simulated.ttfChange)}</strong> days (
                      {((simulated.ttfChange / BASELINE_METRICS.medianTTF) * 100).toFixed(1)}%)
                    </li>
                  )}
                  {simulated.highRiskChange !== 0 && (
                    <li className={simulated.highRiskChange < 0 ? "text-[#53f6c5]" : "text-[#f97316]"}>
                      • High-risk traders would {simulated.highRiskChange < 0 ? "decrease" : "increase"} by{" "}
                      <strong>{Math.abs(simulated.highRiskChange).toFixed(1)}</strong> percentage points
                    </li>
                  )}
                </ul>
              </motion.div>
            )}

            {/* Model Limitations */}
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Model Limitations
              </div>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li>• Assumes linear/multiplicative relationships (real effects are complex)</li>
                <li>• Does not account for trader migration to offshore platforms</li>
                <li>• Ignores implementation costs and enforcement challenges</li>
                <li>• Based on synthetic data, not empirical observations</li>
                <li>• Does not model second-order effects or market dynamics</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
