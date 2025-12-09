"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  brokerExposureData,
  OFFSHORE_EXPOSURE_PCT,
} from "@/data/regulator/broker-exposure";

const categoryColors = {
  propFirm: "#f87171",
  offshoreBroker: "#fbbf24",
  unlicensed: "#ef4444",
  regulated: "#53f6c5",
};

const categoryLabels = {
  propFirm: "Prop Firms",
  offshoreBroker: "Offshore Brokers",
  unlicensed: "Unlicensed",
  regulated: "NZ/AU Regulated",
};

export function OffshorePie() {
  const pieData = brokerExposureData.map((item) => ({
    name: categoryLabels[item.category],
    value: item.percentage,
    color: categoryColors[item.category],
    count: item.traderCount,
  }));

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Broker Exposure Breakdown
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {OFFSHORE_EXPOSURE_PCT}% trading on offshore or unregulated platforms
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f1d36",
                  border: "1px solid rgba(124, 141, 173, 0.3)",
                  borderRadius: "12px",
                }}
                formatter={(value: number, name: string) => [
                  `${value}%`,
                  name,
                ]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg bg-[#f87171]/10 p-2 text-center">
            <p className="text-lg font-bold text-[#f87171]">{OFFSHORE_EXPOSURE_PCT}%</p>
            <p className="text-xs text-muted-foreground">Offshore/Unregulated</p>
          </div>
          <div className="rounded-lg bg-primary/10 p-2 text-center">
            <p className="text-lg font-bold text-primary">
              {brokerExposureData.find((d) => d.category === "regulated")?.percentage}%
            </p>
            <p className="text-xs text-muted-foreground">NZ/AU Regulated</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
