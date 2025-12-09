# Pilot Broker Dashboard TODOs

> Immediate tasks define the MVP demo experience: broker money dashboard, drill-downs, and Pilot Score views using static data.
> Backlog items are enhancements we can request from Codex/Droid later.

## Immediate: MVP Broker Demo Experience

### IM-1: Project Scaffold & Theming

- [x] **IM-1.1: Scaffold Next.js + Tailwind + ShadCN + Framer Motion**
  1. Create a new Next.js (App Router) project with TypeScript.
  2. Install and configure Tailwind CSS.
  3. Install ShadCN UI and generate core components (Button, Card, Tabs, Dialog/Sheet, Table, Input, Badge, Switch).
  4. Install Framer Motion and Recharts (or similar) for charts.
  - Completed via create-next-app scaffold, ShadCN CLI (`button` through `switch`), and npm installs for `framer-motion`/`recharts`.

- [x] **IM-1.2: Implement Pilot brand theme tokens**
  1. Add CSS variables / Tailwind config entries for:
     - `--pilot-navy`, `--pilot-mint`, `--pilot-white`, neutral greys, `--pilot-good`, `--pilot-bad`.
  2. Ensure base layout uses a dark shell (navy) with slightly lighter cards.
  3. Reserve `pilot-mint` for key accents and selection states.
  - Added brand palette + shell/panel tokens in `globals.css` with Tailwind theme bindings for accents and surfaces.

- [x] **IM-1.3: Global dashboard layout**
  1. Create `app/(dashboard)/layout.tsx` with:
     - Left sidebar (logo + nav).
     - Top header (page title, search, profile, “With Pilot / Without Pilot” toggle).
     - Main content area.
  2. Ensure layout is responsive and uses consistent paddings / rounded corners.
  - Introduced dashboard layout shell wrapping sidebar, header, and padded main content with responsive/mobile sheet nav.

---

### IM-2: Sidebar Navigation & Routing

- [x] **IM-2.1: Implement sidebar nav structure**
  1. Add routes + links for:
     - Dashboard (default)
     - Navigators
     - Groups
     - Pilots
     - Trades
     - Pilot Score Center
     - Compliance Center
     - Settings
  2. Use icons and mint-highlight for active nav item.
  3. Pin “Compliance Center” and “Settings” in a lower sidebar section.
  - Sidebar links (desktop + mobile sheet) cover all routes with mint motion highlight and pinned lower section.
  - Mobile nav sheet now closes on selection for responsive usability.

- [x] **IM-2.2: Header & With/Without Pilot toggle**
  1. Add a header bar with:
     - Page title.
     - Search input.
     - Notification / help icons.
     - Profile avatar.
  2. Implement a `useDashboardMode` hook or context that stores:
     - `mode: 'withPilot' | 'withoutPilot'`.
  3. Wire the toggle so main dashboard cards can read this mode and switch between two data sets.
  - Header pulls page title, exposes search/actions, and the new dashboard mode context drives the With/Without Pilot switch + dashboard placeholders.

---

### IM-3: Static Data Layer

- [x] **IM-3.1: Define core TypeScript types**
  1. Create `data/types.ts` with:
     - `Navigator`, `Pilot`, `Group`, `Trade`, `PilotScoreBreakdown`, `ComplianceAlert`.
  2. Ensure Pilot Score is out of 1000 and nominal volume is modeled in yards (5 yards/day default).
  - Added strongly-typed models for navigators, pilots, groups, trades, score breakdowns, alerts, and dashboard metrics with sparkline support.

- [x] **IM-3.2: Seed fake data**
  1. Create `data/navigators.ts`, `data/pilots.ts`, `data/groups.ts`, `data/trades.ts`, `data/alerts.ts`.
  2. Seed:
     - 5–8 navigators.
     - 10–20 pilots.
     - 3–5 groups.
     - 20–40 trades.
     - 5–10 compliance alerts.
  3. Provide two top-level summary snapshots:
     - `baselineMetrics` (without Pilot).
     - `withPilotMetrics` (with Pilot uplift).
  - Seeded 6 navigators, 15 pilots, 6 groups, 24 trades, 8 compliance alerts, plus baseline/with Pilot metric snapshots keyed to 5-yard nominal volume.

---

### IM-4: Dashboard (Broker Money View)

- [x] **IM-4.1: KPI header cards**
  1. Build `dashboard/KPIHeader` component showing:
     - Broker Revenue Today (With Pilot).
     - Broker Revenue Today (Without Pilot).
     - Volume Lift %.
     - Active Copiers.
     - Top Navigator Revenue Today.
     - Total Blueprint Sales.
  2. Each card should include:
     - Main value.
     - % change.
     - Tiny chart via Recharts.
  3. Animate cards on load with Framer Motion (staggered fade+slide).
  - Created KPI header grid using useDashboardMetrics hook, adds delta badges (% change vs comparison) and animates Recharts sparklines per mode.

- [x] **IM-4.2: Volume & Fee Simulator**
  1. Build `dashboard/VolumeSimulator` card with:
     - Slider: total members.
     - Slider: copy trading adoption %.
     - Slider: trades per copier per day.
     - Input: nominal volume per day (default 5 yards).
  2. Calculate:
     - Daily copied volume.
     - Daily 3% fee pool.
     - Fee split: Navigator 50%, Pilot 25%, Broker 25%.
     - Monthly run rate (30x).
  3. React to `withPilot/withoutPilot` mode by changing base adoption and profit assumptions.
  4. Animate number changes (Framer Motion `animate` props or simple spring).
  - Implemented two-column simulator with ShadCN controls, mode-aware overrides (5% adoption baseline) and animated fee outputs with Recharts sparkline.
  - Daily copied volume and fee math now tie every control (members, adoption, trades, nominal volume, avg profit) together and clamp zero-fee scenarios to a true zero trend.
  - NOTE: Model stays intentionally simplified; revisit once real broker adoption curves and per-instrument variance data are available.

- [x] **IM-4.3: Top Navigators & Watchlists**
  1. Build `dashboard/TopNavigators` list/cards (using navigator data).
  2. Build right-side widgets:
     - Navigator Watchlist.
     - High-growth groups.
     - High-risk/high-return groups.
  3. Clicking a navigator should route to Navigators page and pre-select that navigator.
  - Added broker-focused Top Navigators list with revenue, score, and trends plus responsive Watchlists for consistency, growth, and risk cohorts wired into existing detail sheets.

---

### IM-5: Navigators, Groups, Pilots Pages

- [x] **IM-5.1: Navigators table + detail panel**
  1. Create a Navigators table using ShadCN Table:
     - Columns: name, Pilot Score (0–1000), Sharpe, win rate, followers, volume, broker share.
  2. On row click, open a Framer Motion sheet/panel:
     - Overview tab: big score card, sub-score cards, trend chart, revenue summary.
     - Group Health tab: list of groups for this navigator with mini metrics.
  - Implemented navigator roster with mint score chips and animated sheet showing breakdowns and nested group panel launchers.

- [x] **IM-5.2: Groups table + detail panel**
  1. Groups table: name, navigator, group score, # pilots, total volume, avg profit per pilot, broker share.
  2. Detail view:
     - Group score visual (dark analytic style).
     - Pilot score distribution (chart).
     - Top/bottom pilots list.
  - Groups page now links to animated detail panel with pilot distribution bubbles, pilot table, and trades tab (stub dialog) plus nested pilot drill-down.

- [x] **IM-5.3: Pilots table + detail panel**
  1. Pilots table: name, Pilot Score, copied volume, trades copied, profit, broker share, navigators followed.
  2. Detail view:
     - Pilot Score page (credit-score style): big score, sub-scores (Copy Discipline, Risk Alignment, Trade Quality, etc.), timeline bubbles (good/neutral/bad behavior).
  - Pilot scorebook renders detail sheet with behaviour timeline bubbles, filtered trades, and navigator chips; trade dialog serves as interim stub pending IM-6.

---

### IM-6: Trades Page & Trade Detail Stub

- Shared primitives extracted: `ScoreBadge`, `EntityAvatar`, and the reusable `TradeDetailDialog` now power the Navigators, Groups, Pilots, and Trades surfaces.

- [x] **IM-6.1: Trades table**
  1. Table columns: time, instrument, side, notional, profit, navigator, pilot, group, risk flag icon.
  2. Color-code profit (green for positive, red for negative).
  - Implemented dark ShadCN table with enriched navigator/pilot/group context, shared score badges/avatars, and row click launching the dialog.

- [x] **IM-6.2: Trade detail card (stub)**
  1. On row click, show a ShadCN Dialog or Sheet:
     - Header: instrument, side, notional, P&L.
     - Core: entry/exit price, entry/exit time, duration, navigator + pilot names and pilot scores.
     - Fees: profit, 3% fee, split into navigator/pilot/broker (with numeric examples).
     - Risk flag badge.
     - Footer: a placeholder area labelled “Price chart (future enhancement)”.
  2. Animate open/close via Framer Motion (slide from right, fade).
  - Replaced stubs across Trades page and detail panels with the shared dialog; fee breakdown auto-calculates and risk flags share formatting helpers.

---

### IM-7: Pilot Score Center & Compliance Center

- [x] **IM-7.1: Pilot Score Center overview**
  1. Dark-analytic page with three sections:
     - Navigator Scores grid.
     - Group Scores grid.
     - Pilot Scores grid.
  2. Each card shows score out of 1000, status tag (Excellent / Good / Watch / Risky), and a tiny trendline.
  3. Card click navigates to appropriate Navigators/Groups/Pilots detail.
  - Implemented credit-score style grids with ScoreArc visuals, sparkline trends, and direct sheet launches for each entity type.
  - Group and Pilot cards now mirror Navigator cards with ScoreArc, ScoreBadge, and micro-trends for consistent scoring UX.

- [x] **IM-7.2: Compliance Center tabs**
  1. Create a dark-style page with ShadCN Tabs:
     - Surveillance
     - Conduct Risk
     - KYC/AML
     - Best Execution
     - Audit Trail
  2. Use `ComplianceAlert` data to populate Surveillance (table).
  3. Add static placeholder cards for the other tabs describing future capabilities (no heavy logic yet).
  - Surveillance table now hooks into real alerts and opens drill-down sheets; other tabs outline future risk modules and audit log feed.
  - Inline entity chips support direct jumps to Navigator, Pilot, or Trade detail without overriding row click priority.

---

### IM-8: Polish & Animation Pass

- [x] **IM-8.1: Framer Motion pass**
  1. Add motion to:
     - Dashboard initial load (staggered cards).
     - Panel/Sheet open/close.
     - Hover interactions (scale + subtle shadow).
  2. Ensure animation timings are consistent and not overdone.
  - Unified dashboard load/stagger timings, aligned sheet/dialog transitions, and added gentle hover lift to hero cards.

- [x] **IM-8.2: Responsive and UX polish**
  1. Test the app at common widths (desktop first, tablet as a bonus).
  2. Ensure no critical UI overflows.
  3. Add basic keyboard focus styles for accessibility.
  - Wrapped data tables with horizontal overflow, reinforced focus-visible outlines on interactive dashboard widgets, and added empty-state copy for quiet data sets.
  - Expanded SheetContent widths to 420/520/560/600px responsive tiers with consistent padding across navigator, group, and pilot detail panels.

---

## Backlog: Future Enhancements

### BK-1: Real charts in Trade Detail & Score Views

- [ ] **BK-1.1: Sparkline price chart in Trade detail**
  1. Replace placeholder with a small Recharts candlestick/line chart using fake series data.
  2. Mark entry/exit points on the chart.

- [ ] **BK-1.2: Advanced Pilot Score visualizations**
  1. Add radial charts or radar charts for 57 touchpoint categories.
  2. Show comparison between Navigator vs Group vs Pilot.

- [ ] **BK-1.3: Extend shared primitives**
  1. Expand `TradeDetailDialog` with live chart + compliance panel once data is ready.
  2. Gather additional reusable badge/avatar primitives as more IM tasks emerge.
  3. ScoreArc now guards against non-finite inputs; continue to centralise scoring thresholds across primitives.

- [ ] **BK-1.4: Score center expansions**
  1. Pilot Score Center ready for future additions: radar charts for 57 touchpoints, real-time scoring, and score-drift analysis.
  2. Compliance Center ready for deeper integrations: real surveillance models, trade reconstruction timelines, deeper risk dashboards.

### BK-2: Scenario Presets & Saved Watchlists

- [ ] **BK-2.1: Scenario presets for volume simulator**
  1. Add dropdown presets (Conservative / Typical / Aggressive) for adoption and trade frequency.
  2. Update cards when user switches presets.

- [ ] **BK-2.2: Persistent watchlists (localStorage)**
  1. Allow adding/removing navigators to watchlists and store in browser localStorage.

### BK-3: Theming & Light/Dark Toggle

- [ ] **BK-3.1: Implement full theme toggle**
  1. Support light variant for dashboard using same component structure.
  2. Wire to a theme toggle in header.

---

*Last updated: 2025-11-15*
