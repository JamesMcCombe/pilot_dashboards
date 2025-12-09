import type { LucideIcon } from "lucide-react";
import {
  CandlestickChart,
  GaugeCircle,
  LayoutDashboard,
  Layers3,
  LineChart,
  Navigation,
  ShieldCheck,
  Users2,
  Wrench,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const mainNavItems: NavItem[] = [
  { title: "Command Centre", href: "/dashboard", icon: LayoutDashboard },
  { title: "Analytics", href: "/copy-trading/analytics", icon: LineChart },
  { title: "Navigators", href: "/navigators", icon: Navigation },
  { title: "Groups", href: "/groups", icon: Layers3 },
  { title: "Pilots", href: "/pilots", icon: Users2 },
  { title: "Trades", href: "/trades", icon: CandlestickChart },
  {
    title: "Pilot Score Center",
    href: "/pilot-score-center",
    icon: GaugeCircle,
  },
];

export const secondaryNavItems: NavItem[] = [
  {
    title: "Compliance",
    href: "/compliance-center",
    icon: ShieldCheck,
  },
  { title: "Settings", href: "/settings", icon: Wrench },
];

export function resolveTitleFromPath(pathname: string): string {
  const match = [...mainNavItems, ...secondaryNavItems].find((item) =>
    pathname.startsWith(item.href),
  );

  if (match) {
    return match.title;
  }

  if (pathname === "/" || pathname === "") {
    return "Command Centre";
  }

  const cleaned = pathname.split("/").filter(Boolean);
  if (cleaned.length) {
    return cleaned[cleaned.length - 1]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  return "Dashboard";
}
