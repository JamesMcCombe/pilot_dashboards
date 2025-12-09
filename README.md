# Pilot Dashboards

A comprehensive Next.js dashboard application featuring two operational modes for retail trading oversight and broker analytics.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## Overview

This application provides two distinct dashboard modes:

### 🛡️ Regulator Mode (FMA SupTech Prototype)
A demonstration dashboard built for the Financial Markets Authority (FMA) in collaboration with Cambridge SupTech Lab. Visualizes behavioural patterns in NZ retail trading to support harm detection and policy development.

**Key Features:**
- **Retail Harm Index (RHI)** - Composite 0-1000 scale indicator of NZ retail trading harm
- **Early Warning Indicators** - 6-indicator panel with threshold-based status levels
- **Broker Leakage Analysis** - Offshore platform exposure tracking with interactive Sankey flow
- **Behavioural Cohort Explorer** - 5 trader cohorts with survival curves and PilotScore distributions
- **Policy Sandbox** - Interactive harm simulator with adjustable policy levers
- **Influence Pathway Graph** - Network visualization of trading influence patterns
- **NZ Broker Risk Comparison** - Risk scoring for 8 real NZ-licensed brokers (synthetic metrics)
- **Volatility Shock Response** - Time-series analysis of trader behaviour during market events
- **Herding & Synchronisation Score** - Detection of coordinated trading patterns

### 📊 Broker Mode
Revenue, compliance, and copy-trading analytics for brokers.

**Key Features:**
- Dashboard overview with KPIs
- Navigator leaderboards and economics
- Copy-trading analytics
- Compliance center
- Trade monitoring

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) - defaults to Regulator Mode.

## Routes

### Regulator Mode (`/regulator/*`)
| Route | Description |
|-------|-------------|
| `/regulator/overview` | Main dashboard with EWI, RHI, and key metrics |
| `/regulator/broker-leakage` | Offshore flow analysis with interactive filters |
| `/regulator/nz-brokers` | NZ broker risk comparison |
| `/regulator/cohorts` | Behavioural cohort explorer |
| `/regulator/policy-sandbox` | Policy impact simulator |
| `/regulator/influence-pathways` | Network graph visualization |
| `/regulator/events` | Key harm events timeline |
| `/regulator/volatility-shocks` | Market event response analysis |
| `/regulator/architecture` | PilotBridge system diagram |

### Broker Mode (`/dashboard/*`)
| Route | Description |
|-------|-------------|
| `/dashboard` | Broker overview |
| `/navigators` | Navigator management |
| `/copy-trading/analytics` | Copy trading metrics |
| `/compliance-center` | Compliance monitoring |
| `/trades` | Trade history |

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Data Notice

⚠️ **All data in this application is 100% synthetic.** No real trader information, personally identifiable data, or actual trading records are used. The dashboard demonstrates the types of behavioural insights that could be derived from anonymised retail trading data.

## Switching Modes

- **Broker → Regulator:** Click "Switch to Regulator Mode" in the broker sidebar
- **Regulator → Broker:** Click "Back to Broker Mode" in the regulator sidebar

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── regulator/         # Regulator mode pages
│   └── dashboard/         # Broker mode pages
├── components/
│   ├── regulator/         # Regulator-specific components
│   │   ├── charts/        # Visualization components
│   │   └── architecture/  # System diagram components
│   ├── dashboard/         # Broker mode components
│   └── ui/                # Shared UI primitives
├── data/
│   └── regulator/         # Synthetic data generators
└── lib/                   # Utilities
```

## Deployment

This application is deployed on Fly.io. See deployment configuration in `fly.toml`.

## Credits

- **Pilot** - PilotScore Protocol
- **FMA** - Financial Markets Authority New Zealand
- **Cambridge SupTech Lab** - Research collaboration

---

© 2025 Pilot × FMA × Cambridge SupTech Lab
