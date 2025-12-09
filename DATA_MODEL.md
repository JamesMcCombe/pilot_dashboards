# Pilot Broker Dashboard – Data Model Overview

The MVP is fully static: all data is seeded in the frontend (`/data` folder).  
These models mirror the conceptual objects in the Pilot product.

## Core Types

### Navigator

Represents a trading leader whose signals are copied by Pilots.

Key fields:
- `id: string`
- `name: string`
- `pilotScore: number` (0–1000)
- `sharpe: number`
- `winRate: number` (0–1 or %)
- `followers: number`
- `groupVolume: number` (daily notional)
- `brokerRevenueShare: number` (daily revenue)
- `trend: number[]` (for mini charts)

### Pilot

Represents a follower/trader copying one or more Navigators.

Key fields:
- `id, name`
- `pilotScore: number` (0–1000)
- `copiedVolume: number`
- `tradesCopied: number`
- `profit: number`
- `brokerRevenueShare: number`
- `navigatorIds: string[]`

### Group

Represents a cluster of Pilots under a Navigator (copy-trading group).

Key fields:
- `id, name`
- `navigatorId: string`
- `pilots: string[]` (Pilot IDs)
- `groupScore: number` (0–1000)
- `avgPilotScore: number`
- `totalVolume: number`
- `avgProfitPerPilot: number`
- `brokerRevenueShare: number`
- `consistencyScore: number` (0–100)

### Trade

Represents an individual executed trade.

Key fields:
- `id`
- `instrument: string`
- `side: 'Buy' | 'Sell'`
- `notional: number`
- `profit: number`
- `entryPrice, exitPrice`
- `entryTime, exitTime` (ISO strings)
- `navigatorId, pilotId, groupId?`
- `riskFlag?: 'none' | 'highLeverage' | 'oversized' | 'slippage'`

### PilotScoreBreakdown

Represents a sub-score category within the overall Pilot Score.

Fields:
- `category: string` (e.g. "Consistency", "Risk Discipline")
- `score: number` (0–1000 or scaled)
- `description?: string`

### ComplianceAlert

Represents a surveillance or conduct flag.

Fields:
- `id`
- `severity: 'low' | 'medium' | 'high'`
- `type: string` (e.g. "Over-leverage", "Copy cascade anomaly")
- `description: string`
- `navigatorId?, pilotId?, tradeId?`
- `createdAt: string`

## Fee Model

- For any **profitable trade**, fee = `3%` of profit.
- Fee split:
  - Navigator: `50%` of fee.
  - Pilot (company): `25%` of fee.
  - Brokerage: `25%` of fee.

Example:
- Profit: `$100`
- Fee: `$3`
- Navigator: `$1.50`
- Pilot: `$0.75`
- Broker: `$0.75`

## Volume Model

- Nominal volume input is in **yards** (1 yard = 1,000,000 notional).
- Default: **5 yards/day**.
- `withPilot` vs `baseline` metrics differ by:
  - Adoption rate.
  - Trades per copier per day.
  - Average profit per trade.

These parameters are surfaced in the Volume Simulator component and can be adjusted via sliders.
