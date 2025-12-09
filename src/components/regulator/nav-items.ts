import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  TrendingDown,
  Users2,
  Grid3X3,
  Globe,
  BarChart3,
  Zap,
  Building2,
  Network,
  UsersRound,
  SlidersHorizontal,
  Share2,
  CalendarClock,
} from "lucide-react";

export type RegulatorNavSection =
  | "Overview"
  | "Behaviour & Harm Analytics"
  | "Brokers & Leakage"
  | "Events & Pathways"
  | "Sandbox & System";

export type RegulatorNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  section: RegulatorNavSection;
};

// Section display order
export const NAV_SECTION_ORDER: RegulatorNavSection[] = [
  "Overview",
  "Behaviour & Harm Analytics",
  "Brokers & Leakage",
  "Events & Pathways",
  "Sandbox & System",
];

export const regulatorNavItems: RegulatorNavItem[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // Section: Overview
  // ─────────────────────────────────────────────────────────────────────────
  {
    title: "Retail Harm Overview",
    href: "/regulator/overview",
    icon: LayoutDashboard,
    description: "High-level NZ retail trading health metrics",
    section: "Overview",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Section: Behaviour & Harm Analytics
  // ─────────────────────────────────────────────────────────────────────────
  {
    title: "Survival Curves",
    href: "/regulator/survival-curves",
    icon: TrendingDown,
    description: "Time-to-failure and blow-up patterns",
    section: "Behaviour & Harm Analytics",
  },
  {
    title: "Influence Detection",
    href: "/regulator/influence-detection",
    icon: Users2,
    description: "Trading clusters and herding patterns",
    section: "Behaviour & Harm Analytics",
  },
  {
    title: "Loss Clustering",
    href: "/regulator/loss-clustering",
    icon: Grid3X3,
    description: "Coordinated loss event analysis",
    section: "Behaviour & Harm Analytics",
  },
  {
    title: "Behavioural Metrics",
    href: "/regulator/behavioural-metrics",
    icon: BarChart3,
    description: "Leverage, stop-loss, and risk discipline",
    section: "Behaviour & Harm Analytics",
  },
  {
    title: "Volatility Shocks",
    href: "/regulator/volatility-shocks",
    icon: Zap,
    description: "Trader response to market volatility events",
    section: "Behaviour & Harm Analytics",
  },
  {
    title: "Cohorts",
    href: "/regulator/cohorts",
    icon: UsersRound,
    description: "Behavioural cohort segmentation and analysis",
    section: "Behaviour & Harm Analytics",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Section: Brokers & Leakage
  // ─────────────────────────────────────────────────────────────────────────
  {
    title: "Broker Leakage",
    href: "/regulator/broker-leakage",
    icon: Globe,
    description: "Offshore platform exposure tracking",
    section: "Brokers & Leakage",
  },
  {
    title: "NZ Brokers",
    href: "/regulator/nz-brokers",
    icon: Building2,
    description: "NZ-licensed broker risk comparison",
    section: "Brokers & Leakage",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Section: Events & Pathways
  // ─────────────────────────────────────────────────────────────────────────
  {
    title: "Key Events",
    href: "/regulator/events",
    icon: CalendarClock,
    description: "Timeline of significant harm events",
    section: "Events & Pathways",
  },
  {
    title: "Influence Pathways",
    href: "/regulator/influence-pathways",
    icon: Share2,
    description: "Network visualization of influence propagation",
    section: "Events & Pathways",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Section: Sandbox & System
  // ─────────────────────────────────────────────────────────────────────────
  {
    title: "Policy Sandbox",
    href: "/regulator/policy-sandbox",
    icon: SlidersHorizontal,
    description: "Simulate policy interventions and harm impact",
    section: "Sandbox & System",
  },
  {
    title: "Architecture",
    href: "/regulator/architecture",
    icon: Network,
    description: "PilotBridge system architecture and connectivity",
    section: "Sandbox & System",
  },
];

export function resolveRegulatorTitleFromPath(pathname: string): string {
  const match = regulatorNavItems.find((item) =>
    pathname.startsWith(item.href)
  );

  if (match) {
    return match.title;
  }

  if (pathname === "/regulator" || pathname === "/regulator/") {
    return "Retail Harm Overview";
  }

  return "Regulator Dashboard";
}
