# Pilot Broker Dashboard – Design Notes

## Visual Inspirations

- **“Ms. Bertha” CRM UI**  
  - Soft neutral panels, rounded cards, integrated drill-down.
  - Used for conceptual layout of nested information and detail views.

- **Credit Score Dashboard (Aella-style)**  
  - Dark, analytical panels, strong score visual, green/yellow/red bubbles.
  - Used for Pilot Score pages (Navigator, Group, Pilot) and Compliance pages.

- **Credly Trading Dashboard**  
  - Dark shell with sidebar navigation.
  - Horizontal KPI cards, “products & tools” grid, right-hand portfolio widget.
  - Used as the main structure for the Broker Dashboard.

## Brand

- Primary: Pilot navy (`--pilot-navy`)
- Accent: Pilot mint (`--pilot-mint`)
- Good: Green (`--pilot-good`)
- Bad: Red (`--pilot-bad`)
- Neutral greys: used for surfaces and text.

Pilot logo appears in the top-left of the sidebar, with optional wordmark “Pilot”.

## Layout Principles

- Sidebar + header framing all pages.
- Cards with `rounded-2xl` and subtle shadows.
- Consistent 24px–32px padding in main content.
- Max width constraints to avoid edge-to-edge clutter on large screens.

## Theming

- **Dashboard**: dark shell, mid-tone cards.
- **Pilot Score & Compliance**: darker background, stronger data viz, credit-score vibe.
- **Accent usage**:
  - Mint for selections, active states, and positive highlights.
  - Green/red for performance and risk, not for generic chrome.

## Motion

- Framer Motion used for:
  - Page/card entrance.
  - Sheet / dialog transitions.
  - Hover feedback.
  - With/Without Pilot toggle transitions.

Keep easing curves soft and durations ~200–300ms.
