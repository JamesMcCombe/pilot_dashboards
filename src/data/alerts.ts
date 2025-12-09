import type { ComplianceAlert } from "./types";

export const complianceAlerts: ComplianceAlert[] = [
  {
    id: "alert-001",
    severity: "high",
    type: "Over-leverage",
    description:
      "Caleb Freeman copied a GBP/JPY position that breached the 5x leverage policy.",
    navigatorId: "northwind-wave",
    pilotId: "pilot-caleb-freeman",
    tradeId: "trade-019",
    createdAt: "2025-11-15T07:42:00.000Z",
  },
  {
    id: "alert-002",
    severity: "medium",
    type: "Copy cascade anomaly",
    description:
      "Astra Quant signals triggered an abnormal clustering of EUR/USD entries within 3 minutes.",
    navigatorId: "astra-quant",
    createdAt: "2025-11-15T05:18:00.000Z",
  },
  {
    id: "alert-003",
    severity: "medium",
    type: "Oversized notional",
    description:
      "Mira Odum exceeded the configured position size on Brent Crude hedge trades.",
    navigatorId: "stratus-alpha",
    pilotId: "pilot-mira-odum",
    tradeId: "trade-015",
    createdAt: "2025-11-14T22:33:00.000Z",
  },
  {
    id: "alert-004",
    severity: "low",
    type: "Slippage review",
    description:
      "Slippage exceeded tolerance on EUR/USD exit for Ines Rocha.",
    navigatorId: "astra-quant",
    pilotId: "pilot-ines-rocha",
    tradeId: "trade-017",
    createdAt: "2025-11-14T18:12:00.000Z",
  },
  {
    id: "alert-005",
    severity: "medium",
    type: "Crypto volatility watch",
    description:
      "Helios Macro crypto signals produced two consecutive drawdowns, monitor adoption risk.",
    navigatorId: "helios-macro",
    pilotId: "pilot-samir-khatri",
    tradeId: "trade-024",
    createdAt: "2025-11-14T11:48:00.000Z",
  },
  {
    id: "alert-006",
    severity: "low",
    type: "Manual approval queue",
    description:
      "Navigator Zenith Arb requested blueprint extension for weekend futures sessions.",
    navigatorId: "zenith-arb",
    createdAt: "2025-11-13T09:25:00.000Z",
  },
  {
    id: "alert-007",
    severity: "high",
    type: "AML review",
    description:
      "New pilot onboarding from Gibraltar flagged for enhanced due diligence.",
    pilotId: "pilot-quinn-ybarra",
    createdAt: "2025-11-12T16:48:00.000Z",
  },
  {
    id: "alert-008",
    severity: "low",
    type: "Behavioral nudge",
    description:
      "Yara Amin missed three navigator rebalancing prompts in 24 hours.",
    navigatorId: "stratus-alpha",
    pilotId: "pilot-yara-amin",
    createdAt: "2025-11-12T08:15:00.000Z",
  },
];
