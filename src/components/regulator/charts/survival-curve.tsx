"use client";

import { useId, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  survivalCurveData,
  jurisdictions,
  NZ_EARLY_LOSS_PCT,
  type JurisdictionKey,
} from "@/data/regulator/survival-data";

export function SurvivalCurve() {
  const gradientId = useId();
  
  // Track which jurisdictions are visible - NZ and Global on by default
  const [visible, setVisible] = useState<Record<JurisdictionKey, boolean>>({
    nz: true,
    global: true,
    au: false,
    uk: false,
    us: false,
    th: false,
    my: false,
  });

  const toggleJurisdiction = (key: JurisdictionKey) => {
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Get visible jurisdictions for the subtitle
  const visibleKeys = (Object.keys(visible) as JurisdictionKey[]).filter((k) => visible[k]);

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Time-to-Failure Survival Curve
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {visibleKeys.length > 0 ? (
                <>
                  {visibleKeys.map((k, i) => (
                    <span key={k}>
                      {i > 0 && " · "}
                      <span style={{ color: jurisdictions[k].color }}>
                        {jurisdictions[k].label}: {jurisdictions[k].medianTTF}d
                      </span>
                    </span>
                  ))}
                </>
              ) : (
                "Select jurisdictions to compare"
              )}
            </p>
          </div>
        </div>
        
        {/* Jurisdiction Toggles */}
        <div className="mt-4 flex flex-wrap gap-3">
          {(Object.entries(jurisdictions) as [JurisdictionKey, typeof jurisdictions[JurisdictionKey]][]).map(
            ([key, { label, color }]) => (
              <button
                key={key}
                onClick={() => toggleJurisdiction(key)}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  visible[key]
                    ? "bg-white/10"
                    : "bg-muted/20 opacity-60 hover:opacity-100"
                }`}
                style={{
                  border: visible[key] ? `1px solid ${color}` : "1px solid transparent",
                }}
              >
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: color, opacity: visible[key] ? 1 : 0.4 }}
                />
                {label}
                <Switch
                  checked={visible[key]}
                  onCheckedChange={() => toggleJurisdiction(key)}
                  className="ml-1 scale-75"
                />
              </button>
            )
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={survivalCurveData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <defs>
                {(Object.entries(jurisdictions) as [JurisdictionKey, typeof jurisdictions[JurisdictionKey]][]).map(
                  ([key, { color }]) => (
                    <linearGradient key={key} id={`${gradientId}-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                    </linearGradient>
                  )
                )}
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(124, 141, 173, 0.2)"
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "#7c8dad", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                label={{
                  value: "Days Since Account Creation",
                  position: "bottom",
                  offset: 20,
                  fill: "#7c8dad",
                  fontSize: 12,
                }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#7c8dad", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                label={{
                  value: "% Still Active",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#7c8dad",
                  fontSize: 12,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f1d36",
                  border: "1px solid rgba(124, 141, 173, 0.3)",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                }}
                labelStyle={{ color: "#f8fafc", fontWeight: 600 }}
                formatter={(value: number, name: string) => {
                  const jurisdiction = Object.values(jurisdictions).find((j) => j.key === name);
                  return [`${value}%`, jurisdiction?.label || name];
                }}
                labelFormatter={(label) => `Day ${label}`}
              />
              
              {/* Render lines for each visible jurisdiction */}
              {(Object.entries(jurisdictions) as [JurisdictionKey, typeof jurisdictions[JurisdictionKey]][]).map(
                ([key, { key: dataKey, color }]) =>
                  visible[key] && (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={dataKey}
                      stroke={color}
                      strokeWidth={key === "nz" ? 3 : 2}
                      dot={false}
                      activeDot={{ r: 4, fill: color }}
                    />
                  )
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 rounded-2xl border border-[#f87171]/30 bg-[#f87171]/10 p-3 text-sm">
          <p className="font-medium text-[#f87171]">Early Loss Concentration</p>
          <p className="mt-1 text-muted-foreground">
            NZ traders show significantly faster account depletion compared to global
            benchmarks, with {NZ_EARLY_LOSS_PCT}% failing in the first 30 days. 
            Thailand and Malaysia show even faster failure rates, while UK and US 
            traders demonstrate better survival.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
