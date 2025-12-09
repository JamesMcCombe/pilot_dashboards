"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BrokerExposurePanel } from "@/components/regulator/charts/broker-exposure-panel";
import { OffshoreLeakageFlow } from "@/components/regulator/charts/offshore-leakage-flow";
import { TimeRangeSelector, type TimeRange } from "@/components/regulator/charts/time-range-selector";
import { InsightNote } from "@/components/regulator/charts/insight-note";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Users, DollarSign, AlertTriangle, Info } from "lucide-react";
import {
  TOTAL_OFFSHORE_TRADERS,
  TOTAL_OFFSHORE_LOSSES,
  AVG_OFFSHORE_LOSS,
  offshoreLeakageDestinations,
} from "@/data/regulator/broker-exposure";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface CategoryCard {
  id: string;
  name: string;
  shortName: string;
  percentage: number;
  color: string;
}

const categoryCards: CategoryCard[] = offshoreLeakageDestinations.slice(0, 4).map((d) => ({
  id: d.id,
  name: d.name,
  shortName: d.shortName,
  percentage: d.percentage,
  color: d.color,
}));

export default function BrokerLeakagePage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30D");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  return (
    <div className="space-y-6">
      {/* Hero Section - Reduced Padding */}
      <div className="rounded-3xl border border-[#f87171]/30 bg-[#f87171]/5 p-5">
        {/* Header Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#f87171]">
              Understanding Broker Leakage
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              NZ retail traders moving activity to offshore, often unregulated platforms
            </p>
          </div>
          <div className="flex items-center gap-3">
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  Synthetic data filtered for demo purposes only. Time range affects 
                  visual intensity but does not change underlying synthetic values.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Key Risk Indicators */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium text-[#f87171]">No Oversight</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Trading occurs outside NZ regulatory perimeter
            </p>
          </div>
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium text-[#f87171]">Limited Recourse</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Traders have minimal protection or complaint channels
            </p>
          </div>
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium text-[#f87171]">Invisible Harm</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Losses and harmful practices go undetected
            </p>
          </div>
        </div>

        {/* Hero Metrics */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl bg-card/80 p-4 text-center"
          >
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Offshore Traders</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {TOTAL_OFFSHORE_TRADERS.toLocaleString()}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl bg-card/80 p-4 text-center"
          >
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs font-medium">Total Losses</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-[#f87171]">
              {currencyFormatter.format(TOTAL_OFFSHORE_LOSSES)}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-card/80 p-4 text-center"
          >
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium">Avg Loss</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-[#f97316]">
              {currencyFormatter.format(AVG_OFFSHORE_LOSS)}
            </p>
          </motion.div>
        </div>

        {/* Sankey Flow - Embedded in Hero */}
        <div className="mt-5">
          <OffshoreLeakageFlow
            highlightedCategory={selectedCategory}
            compact
            showHeader={false}
          />
        </div>

        {/* Clickable Category Filter Cards */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              Click to filter by destination category
            </p>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs text-primary hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map((card) => {
              const isSelected = selectedCategory === card.id;
              const isDimmed = selectedCategory !== null && !isSelected;

              return (
                <Tooltip key={card.id}>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => handleCategoryClick(card.id)}
                      className={`rounded-xl border-2 p-3 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border/40 bg-card/50 hover:border-border hover:bg-card/70"
                      }`}
                      style={{ opacity: isDimmed ? 0.5 : 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: card.color }}
                          />
                          <span className="text-xs font-medium">{card.shortName}</span>
                        </div>
                        <span
                          className="text-lg font-bold"
                          style={{ color: card.color }}
                        >
                          {card.percentage}%
                        </span>
                      </div>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      UI-only filter for demonstration. All data is synthetic.
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>

      {/* Insight Note */}
      <InsightNote>
        In this synthetic example, approximately 38% of offshore leakage flows to prop firms, 
        with higher average losses compared to other destinations. Crypto derivatives show the 
        fastest growth (+45% over 6 months) driven by retail access to high-leverage perpetual futures.
      </InsightNote>

      {/* Broker Exposure Panel */}
      <BrokerExposurePanel />

      {/* Insight Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Prop Firm Funnel Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Prop trading firms represent the fastest-growing segment of offshore
              leakage. Key characteristics observed:
            </p>
            <ul className="ml-4 list-disc space-y-1 pt-2">
              <li>
                Aggressive social media marketing targeting NZ retail traders
              </li>
              <li>
                Challenge/evaluation model creates recurring purchase patterns
              </li>
              <li>
                High failure rates lead to rapid capital depletion
              </li>
              <li>
                Traders often try multiple firms, compounding losses
              </li>
              <li>
                Limited transparency on actual success rates
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Policy Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Based on observed leakage patterns, potential regulatory responses
              could include:
            </p>
            <ul className="ml-4 list-disc space-y-1 pt-2">
              <li>
                <strong>Enhanced Disclosure:</strong> Require warnings about
                offshore trading risks
              </li>
              <li>
                <strong>Education Campaigns:</strong> Target demographics most
                susceptible to prop firm marketing
              </li>
              <li>
                <strong>Platform Partnerships:</strong> Work with domestic
                platforms to identify at-risk traders
              </li>
              <li>
                <strong>Influencer Guidelines:</strong> Address promotion of
                unregulated services
              </li>
              <li>
                <strong>Ongoing Monitoring:</strong> Establish regular leakage
                tracking metrics
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Footer Disclaimer */}
      <div className="text-center text-[10px] text-muted-foreground">
        All data on this page is synthetic and for demonstration purposes only.
        Time range and category filters are UI-only and do not affect underlying calculations.
      </div>
    </div>
  );
}
