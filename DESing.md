---
name: Sovereign Intelligence
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#ffffff'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#424654'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#0058cc'
  primary: '#0055c7'
  on-primary: '#ffffff'
  primary-container: '#296ee9'
  on-primary-container: '#fefcff'
  inverse-primary: '#b0c6ff'
  secondary: '#7f42a8'
  on-secondary: '#ffffff'
  secondary-container: '#d493ff'
  on-secondary-container: '#5f2189'
  tertiary: '#665380'
  on-tertiary: '#ffffff'
  tertiary-container: '#806c9a'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b0c6ff'
  on-primary-fixed: '#001945'
  on-primary-fixed-variant: '#00419c'
  secondary-fixed: '#f3daff'
  secondary-fixed-dim: '#e3b5ff'
  on-secondary-fixed: '#2f004c'
  on-secondary-fixed-variant: '#65288f'
  tertiary-fixed: '#eddcff'
  tertiary-fixed-dim: '#d4bdf1'
  on-tertiary-fixed: '#24123b'
  on-tertiary-fixed-variant: '#503e6a'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
  deep-navy: '#100028'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base-unit: 8px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  max-width: 1440px
---

## Brand & Style
The design system represents a convergence of institutional authority and advanced computational intelligence. Designed for the specialized needs of enterprise C-suites and government defense agencies, the UI evokes a sense of impenetrable security through a lens of modern sophistication.

The aesthetic follows a **Corporate Modern** approach with **Minimalist** execution. The visual narrative is "Quietly Powerful," utilizing significant whitespace to maintain clarity during high-pressure monitoring. The interface avoids aggressive decorative trends, opting instead for precision, structured layouts, and a light, premium atmosphere that signals transparency and reliability.

## Colors
The palette is centered on **Bright Blue (#3174ef)** as the primary brand color, chosen to symbolize trust, stability, and institutional strength. The **Purple (#c282ed)** serves as a secondary accent color, specifically reserved for "intelligence" features, AI-driven insights, and sophisticated interactive highlights.

The color strategy uses a light-mode foundation. Surfaces are constructed using a hierarchy of whites and near-whites, with **Deep Navy (#100028)** providing grounding contrast for high-priority typography. Semantic colors for alerts and system statuses use muted background fills paired with high-saturation text to ensure the "light and premium" theme is maintained even during critical system events.

## Typography
**Inter** is the exclusive typeface, selected for its technical precision and exceptional legibility across dense data environments. 

The typographic hierarchy distinguishes between "Display" and "Functional" roles. Headlines use tighter tracking and heavier weights to project authority. Body text utilizes a comfortable 1.5x line height to facilitate long-form analysis. For small-scale data labels, a semi-bold weight is used at 12px to maintain visual clarity against background tints.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a hard cap at 1440px to optimize for the widescreen monitors prevalent in Security Operation Centers.

The system utilizes an 8px base rhythm. Spacing within components is intentionally "Airy" (24px–32px internal padding) to prevent the cognitive fatigue often associated with data-dense security platforms.

- **Desktop (1200px+):** 12-column grid, 24px gutters, 40px margins.
- **Tablet (768px-1199px):** 8-column grid, 20px gutters, 24px margins.
- **Mobile (0px-767px):** 4-column grid, 16px gutters, 16px margins.

## Elevation & Depth
Visual hierarchy is established through **Tonal Layers** and **Ambient Shadows** rather than heavy borders.

1.  **Background (L0):** The base canvas uses #F8F9FB. A subtle geometric dot-grid pattern in light gray provides a technical texture.
2.  **Surfaces (L1):** Interactive cards and containers are pure white with a 1px border (#E5E7EB) and a soft, diffused shadow: `0px 4px 20px rgba(16, 0, 40, 0.04)`.
3.  **Overlays (L2):** Modals and global navigation use a deeper shadow: `0px 12px 32px rgba(16, 0, 40, 0.08)` and may incorporate a **Glassmorphism** effect (80% opacity with 12px backdrop blur) to maintain situational awareness of the background data.

## Shapes
The design system uses **Rounded (Scale 2)** geometry. This softening of edges humanizes the technical environment, moving away from "harsh" legacy software toward a modern, accessible service experience.

- **Standard Elements (Buttons/Inputs):** 8px (0.5rem).
- **Cards:** 24px (1.5rem) to create distinct visual containers.
- **Status Indicators/Navigation:** Pill-shaped (Full round) to distinguish them from primary action buttons and data containers.

## Components
- **Buttons:**
    - **Primary:** Solid Bright Blue (#3174ef) with white text.
    - **Secondary/AI:** Solid Purple (#c282ed) or Ghost Purple with 1px border.
    - **Outline:** Ghost style with 1px border (#3174ef) and blue text.
- **Floating Navigation:** A centered, pill-shaped global menu. Active states use the Primary Blue with a subtle soft glow.
- **Input Fields:** White background with 1px light gray border. Focus state triggers a transition to the Primary Blue border with a 2px outer glow.
- **Cards:** 24px corner radius. Headlines use `title-lg`. AI-generated insights use a distinctive 2px gradient border transitioning from Primary Blue to Secondary Purple.
- **Chips & Tags:** Pill-shaped using `label-sm`. Semantic chips use low-opacity background tints of their respective status color (Success, Warning, Error).
- **Data Lists:** High-precision rows with 1px horizontal dividers. Priority items are flagged with a 4px vertical accent bar on the left edge.