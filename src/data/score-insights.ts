export type ScoreTone = "good" | "neutral" | "bad";

export interface ScoreBreakdown {
  label: string;
  score: number;
  description: string;
  tone?: ScoreTone;
}

export interface TimelineEvent {
  id: string;
  label: string;
  tone: ScoreTone;
  description: string;
}

type BreakdownMap = Record<string, ScoreBreakdown[]>;
type TimelineMap = Record<string, TimelineEvent[]>;

const defaultNavigatorBreakdown: ScoreBreakdown[] = [
  {
    label: "Consistency",
    score: 860,
    description: "Signal cadence has remained inside 5% variance week over week.",
    tone: "good",
  },
  {
    label: "Risk Discipline",
    score: 812,
    description: "Max drawdown held below broker policy limits.",
    tone: "good",
  },
  {
    label: "Trade Quality",
    score: 835,
    description: "Win/loss asymmetry remains > 1.6x on 30-day basis.",
    tone: "good",
  },
  {
    label: "Liquidity Impact",
    score: 790,
    description: "Copy-trade slippage inside 18 bps average.",
    tone: "neutral",
  },
];

const navigatorBreakdownMap: BreakdownMap = {
  "astra-quant": defaultNavigatorBreakdown,
  "helios-macro": [
    {
      label: "Consistency",
      score: 828,
      description: "Macro signal cadence stabilized after FOMC window.",
      tone: "good",
    },
    {
      label: "Risk Discipline",
      score: 794,
      description: "Drawdown events capped at 3.5% trailing basis.",
      tone: "neutral",
    },
    {
      label: "Trade Quality",
      score: 842,
      description: "Positive expectancy sustained across FX and crypto legs.",
      tone: "good",
    },
    {
      label: "Liquidity Impact",
      score: 768,
      description: "Asia session liquidity dips flagged for monitoring.",
      tone: "neutral",
    },
  ],
  "northwind-wave": [
    {
      label: "Consistency",
      score: 802,
      description: "Signal schedule synchronized with London open.",
      tone: "good",
    },
    {
      label: "Risk Discipline",
      score: 755,
      description: "Recent GBP volatility increased VAR utilisation.",
      tone: "neutral",
    },
    {
      label: "Trade Quality",
      score: 816,
      description: "Win streak sustained across indices and FX hedges.",
      tone: "good",
    },
    {
      label: "Liquidity Impact",
      score: 742,
      description: "Copy slippage elevated on mid-cap equities.",
      tone: "neutral",
    },
  ],
  "zenith-arb": [
    {
      label: "Consistency",
      score: 784,
      description: "Latency arbitrage cadence steady at 120 signals/week.",
      tone: "neutral",
    },
    {
      label: "Risk Discipline",
      score: 738,
      description: "High leverage crypto legs triggering compliance review.",
      tone: "bad",
    },
    {
      label: "Trade Quality",
      score: 801,
      description: "Spread capture remains above 28 bps per trade.",
      tone: "good",
    },
    {
      label: "Liquidity Impact",
      score: 722,
      description: "Weekend sessions produce mild slippage spikes.",
      tone: "neutral",
    },
  ],
  "stratus-alpha": [
    {
      label: "Consistency",
      score: 756,
      description: "Short-term equity rotations introduced mild volatility.",
      tone: "neutral",
    },
    {
      label: "Risk Discipline",
      score: 772,
      description: "Hedging discipline improving after March directive.",
      tone: "good",
    },
    {
      label: "Trade Quality",
      score: 788,
      description: "Cross-asset win rate stabilised above 58%.",
      tone: "good",
    },
    {
      label: "Liquidity Impact",
      score: 705,
      description: "Watchlist triggered for emerging market equities.",
      tone: "neutral",
    },
  ],
  "lumen-surge": [
    {
      label: "Consistency",
      score: 742,
      description: "Signal cadence impacted by crypto volatility weekend.",
      tone: "neutral",
    },
    {
      label: "Risk Discipline",
      score: 688,
      description: "Two oversized trades flagged for navigator coaching.",
      tone: "bad",
    },
    {
      label: "Trade Quality",
      score: 764,
      description: "Options hedges recovering expectancy trajectory.",
      tone: "neutral",
    },
    {
      label: "Liquidity Impact",
      score: 718,
      description: "Vol desk investigating weekend spreads.",
      tone: "neutral",
    },
  ],
};

const defaultGroupBreakdown: ScoreBreakdown[] = [
  {
    label: "Signal Adoption",
    score: 812,
    description: "Majority of pilots copying >75% of navigator plays.",
    tone: "good",
  },
  {
    label: "Profit Quality",
    score: 784,
    description: "Positive expectancy across 30-day trailing cohort.",
    tone: "good",
  },
  {
    label: "Consistency",
    score: 805,
    description: "Daily active pilots staying within variance bands.",
    tone: "good",
  },
  {
    label: "Compliance",
    score: 766,
    description: "Minor leverage nudges issued last week.",
    tone: "neutral",
  },
];

const groupBreakdownMap: BreakdownMap = {
  "group-astra-squad": defaultGroupBreakdown,
  "group-helios-signal": [
    {
      label: "Signal Adoption",
      score: 784,
      description: "Copy adoption dipped slightly during CPI release.",
      tone: "neutral",
    },
    {
      label: "Profit Quality",
      score: 818,
      description: "FX swing trades boosting expectancy.",
      tone: "good",
    },
    {
      label: "Consistency",
      score: 792,
      description: "Daily active down 6% but stabilising.",
      tone: "neutral",
    },
    {
      label: "Compliance",
      score: 752,
      description: "Two pilots on watch for leverage creep.",
      tone: "neutral",
    },
  ],
  "group-northwave": [
    {
      label: "Signal Adoption",
      score: 756,
      description: "Overlap with other navigators dilutes adoption.",
      tone: "neutral",
    },
    {
      label: "Profit Quality",
      score: 802,
      description: "Index hedge program delivering stable returns.",
      tone: "good",
    },
    {
      label: "Consistency",
      score: 774,
      description: "Weekend participation soft; alerts issued.",
      tone: "neutral",
    },
    {
      label: "Compliance",
      score: 736,
      description: "GBP leverage warning active for 2 pilots.",
      tone: "neutral",
    },
  ],
  "group-zenith-watch": [
    {
      label: "Signal Adoption",
      score: 709,
      description: "Latency-sensitive pilots drop weekend sessions.",
      tone: "neutral",
    },
    {
      label: "Profit Quality",
      score: 798,
      description: "Crypto arb legs still accretive post adjustments.",
      tone: "good",
    },
    {
      label: "Consistency",
      score: 734,
      description: "Copy volume volatile, watchlist flagged.",
      tone: "neutral",
    },
    {
      label: "Compliance",
      score: 702,
      description: "Weekend leverage prompts compliance pings.",
      tone: "bad",
    },
  ],
  "group-stratus-net": defaultGroupBreakdown,
  "group-lumen-alliance": [
    {
      label: "Signal Adoption",
      score: 688,
      description: "Copy activity contracted 12% after risk alert.",
      tone: "bad",
    },
    {
      label: "Profit Quality",
      score: 742,
      description: "Still profitable but variance elevated.",
      tone: "neutral",
    },
    {
      label: "Consistency",
      score: 701,
      description: "Adoption uneven across time zones.",
      tone: "neutral",
    },
    {
      label: "Compliance",
      score: 674,
      description: "AML watch on one pilot temporarily reduces flow.",
      tone: "bad",
    },
  ],
};

const defaultDistribution = [
  { label: "Excellent", value: 42, tone: "good" as const },
  { label: "Healthy", value: 31, tone: "good" as const },
  { label: "Watch", value: 18, tone: "neutral" as const },
  { label: "Risk", value: 9, tone: "bad" as const },
];

const groupDistributionMap: Record<string, typeof defaultDistribution> = {
  "group-astra-squad": defaultDistribution,
  "group-helios-signal": [
    { label: "Excellent", value: 36, tone: "good" },
    { label: "Healthy", value: 28, tone: "good" },
    { label: "Watch", value: 21, tone: "neutral" },
    { label: "Risk", value: 9, tone: "bad" },
  ],
  "group-northwave": [
    { label: "Excellent", value: 28, tone: "good" },
    { label: "Healthy", value: 34, tone: "good" },
    { label: "Watch", value: 24, tone: "neutral" },
    { label: "Risk", value: 14, tone: "bad" },
  ],
  "group-zenith-watch": [
    { label: "Excellent", value: 19, tone: "good" },
    { label: "Healthy", value: 27, tone: "neutral" },
    { label: "Watch", value: 31, tone: "neutral" },
    { label: "Risk", value: 23, tone: "bad" },
  ],
  "group-stratus-net": [
    { label: "Excellent", value: 34, tone: "good" },
    { label: "Healthy", value: 32, tone: "good" },
    { label: "Watch", value: 21, tone: "neutral" },
    { label: "Risk", value: 13, tone: "bad" },
  ],
  "group-lumen-alliance": [
    { label: "Excellent", value: 14, tone: "good" },
    { label: "Healthy", value: 24, tone: "neutral" },
    { label: "Watch", value: 31, tone: "neutral" },
    { label: "Risk", value: 31, tone: "bad" },
  ],
};

const defaultPilotBreakdown: ScoreBreakdown[] = [
  {
    label: "Copy Discipline",
    score: 812,
    description: "Highly aligned with navigator execution windows.",
    tone: "good",
  },
  {
    label: "Risk Alignment",
    score: 784,
    description: "Position sizing within broker guardrails.",
    tone: "good",
  },
  {
    label: "Trade Quality",
    score: 803,
    description: "Positive expectancy across 60-day window.",
    tone: "good",
  },
  {
    label: "Stability",
    score: 776,
    description: "Low variance in daily participation.",
    tone: "neutral",
  },
  {
    label: "Liquidity Behaviour",
    score: 758,
    description: "Minor slippage events observed on high-vol pairs.",
    tone: "neutral",
  },
];

const pilotBreakdownMap: BreakdownMap = {
  "pilot-aurora-leong": defaultPilotBreakdown,
  "pilot-darius-holt": defaultPilotBreakdown,
  "pilot-ines-rocha": [
    {
      label: "Copy Discipline",
      score: 826,
      description: "Auto-copy uptime > 98% across sessions.",
      tone: "good",
    },
    {
      label: "Risk Alignment",
      score: 764,
      description: "Recent slippage flagged for monitoring.",
      tone: "neutral",
    },
    {
      label: "Trade Quality",
      score: 817,
      description: "Latency strategy delivering uplifts.",
      tone: "good",
    },
    {
      label: "Stability",
      score: 784,
      description: "Weekend participation variable.",
      tone: "neutral",
    },
    {
      label: "Liquidity Behaviour",
      score: 742,
      description: "Watchlist for EUR/USD slippage events.",
      tone: "neutral",
    },
  ],
};

const defaultTimeline: TimelineEvent[] = Array.from({ length: 12 }).map(
  (_, index) => ({
    id: `evt-${index}`,
    label: `Event ${index + 1}`,
    tone: index % 4 === 0 ? "bad" : index % 3 === 0 ? "neutral" : "good",
    description:
      index % 4 === 0
        ? "Leverage spike contained with broker guardrail."
        : index % 3 === 0
          ? "Participation dipped during off-hours session."
          : "Strong alignment with navigator signal cadence.",
  }),
);

const pilotTimelineMap: TimelineMap = {
  "pilot-aurora-leong": defaultTimeline,
  "pilot-darius-holt": defaultTimeline,
  "pilot-ines-rocha": defaultTimeline,
  "pilot-samir-khatri": defaultTimeline,
  "pilot-livia-choi": defaultTimeline,
  "pilot-caleb-freeman": defaultTimeline,
  "pilot-janel-ortega": defaultTimeline,
  "pilot-haruto-sato": defaultTimeline,
  "pilot-eloise-martin": defaultTimeline,
  "pilot-gideon-hart": defaultTimeline,
  "pilot-mira-odum": defaultTimeline,
  "pilot-quinn-ybarra": defaultTimeline,
  "pilot-sabine-voss": defaultTimeline,
  "pilot-tariq-elias": defaultTimeline,
  "pilot-yara-amin": defaultTimeline,
};

export function getNavigatorBreakdown(id: string) {
  return navigatorBreakdownMap[id] ?? defaultNavigatorBreakdown;
}

export function getGroupBreakdown(id: string) {
  return groupBreakdownMap[id] ?? defaultGroupBreakdown;
}

export function getGroupDistribution(id: string) {
  return groupDistributionMap[id] ?? defaultDistribution;
}

export function getPilotBreakdown(id: string) {
  return pilotBreakdownMap[id] ?? defaultPilotBreakdown;
}

export function getPilotTimeline(id: string) {
  return pilotTimelineMap[id] ?? defaultTimeline;
}
