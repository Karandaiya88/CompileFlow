# Design.md
## SmartCC — Design System Specification

| Field | Value |
|---|---|
| Version | 1.0 |
| Applies To | All frontend components (v1 onward) |

---

## 1. Design Philosophy

SmartCC should feel like a professional developer tool, not an academic project. The visual language borrows deliberately from three references:

| Reference | What we borrow |
|---|---|
| **VS Code** | Editor chrome, panel resizing, monospace precision, dark-first palette |
| **GitHub** | Card layouts, status badges, diff/comparison views (used in Optimization Comparison) |
| **Linear** | Motion restraint, spacing discipline, typography hierarchy, command-palette-style interactions |

**Rule of thumb:** if a UI decision feels "collegiate" (bright gradients, cartoonish icons, default Bootstrap look) — reject it.

---

## 2. Color System

### 2.1 Base Palette (Dark Theme — Default)

| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#0A0A0B` | App background |
| `--bg-surface` | `#131316` | Cards, panels |
| `--bg-surface-raised` | `#1C1C1F` | Elevated panels (modals, dropdowns) |
| `--border-subtle` | `#2A2A2E` | Default borders/dividers |
| `--border-strong` | `#3A3A3F` | Focus/hover borders |
| `--text-primary` | `#EDEDEF` | Primary text |
| `--text-secondary` | `#A1A1A6` | Secondary/muted text |
| `--text-disabled` | `#5C5C61` | Disabled state |

### 2.2 Accent Colors

| Token | Hex | Usage |
|---|---|---|
| `--accent-primary` | `#5E6AD2` | Primary actions (Compile button, active nav) — Linear-inspired indigo |
| `--accent-primary-hover` | `#6E7AE2` | Hover state |
| `--success` | `#3FB950` | Successful compilation, passed checks |
| `--warning` | `#D29922` | Warnings (semantic warnings, non-fatal) |
| `--error` | `#F85149` | Errors (lexical/syntax/semantic failures) |
| `--info` | `#58A6FF` | Informational badges, active pipeline stage |

### 2.3 Phase-Specific Accent Mapping

Each compiler phase gets a consistent identity color used across Pipeline Stepper, badges, and diagnostics tags:

| Phase | Color Token |
|---|---|
| Lexical | `--phase-lexical: #58A6FF` |
| Syntax | `--phase-syntax: #BC8CFF` |
| Semantic | `--phase-semantic: #D29922` |
| Intermediate Code | `--phase-ir: #3FB950` |
| Optimization | `--phase-opt: #F778BA` |
| Codegen | `--phase-codegen: #F85149` |

> These map directly to `CompilerPhase` values in SystemDesign.md — every diagnostic, badge, and pipeline node uses this exact mapping. Never introduce a one-off color for a phase.

---

## 3. Typography

| Role | Font | Weight | Size (base) |
|---|---|---|---|
| UI Text | Inter | 400 / 500 / 600 | 14px base |
| Headings | Inter | 600 / 700 | 20–32px scale |
| Code / Tokens / TAC / Assembly | JetBrains Mono | 400 / 500 | 13px |

### Type Scale

| Token | Size | Usage |
|---|---|---|
| `text-xs` | 12px | Badges, captions |
| `text-sm` | 13px | Table cells, secondary labels |
| `text-base` | 14px | Body text |
| `text-lg` | 16px | Section labels |
| `text-xl` | 20px | Card titles |
| `text-2xl` | 24px | Page titles |
| `text-3xl` | 32px | Dashboard hero stats |

**Rule:** code/data output (tokens, TAC, assembly, parse tree node labels) is **always** monospace (JetBrains Mono) — never Inter — so it visually reads as "machine output" vs. "UI chrome."

---

## 4. Spacing System

Base unit: **4px**. All spacing must be a multiple of 4.

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Icon-to-text gaps |
| `space-2` | 8px | Compact padding |
| `space-3` | 12px | Card internal padding (tight) |
| `space-4` | 16px | Standard card padding |
| `space-6` | 24px | Section spacing |
| `space-8` | 32px | Page-level margins |
| `space-12` | 48px | Major section breaks (Dashboard blocks) |

---

## 5. Radius & Elevation

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 6px | Badges, inputs |
| `radius-md` | 10px | Buttons, small cards |
| `radius-lg` | 14px | Panels, main cards |
| `shadow-panel` | `0 1px 2px rgba(0,0,0,0.4)` | Resting card elevation |
| `shadow-modal` | `0 8px 24px rgba(0,0,0,0.5)` | Overlays, dropdowns |

No hard drop-shadows or skeuomorphic effects — elevation is subtle, borders do most of the visual separation work (VS Code style).

---

## 6. Motion (Framer Motion)

| Interaction | Duration | Easing | Notes |
|---|---|---|---|
| Panel expand/collapse | 200ms | `easeOut` | Sidebar, error panel |
| Pipeline stage transition | 300ms | `easeInOut` | Stepper highlight moves to active phase |
| Tab/route change | 150ms | `easeOut` | Fade + 4px slide, never a full-page flash |
| Hover states | 100ms | `linear` | Buttons, nav items |
| Modal/dropdown open | 180ms | `easeOut` | Scale from 0.98 → 1 + fade |

**Rule:** motion communicates state change (something happened), never decorates for its own sake. If an animation doesn't help the user track cause → effect, cut it.

---

## 7. Component Visual Standards

| Component | Standard |
|---|---|
| Buttons | Solid `--accent-primary` for primary actions; ghost/outline for secondary; never more than one solid-primary button per view |
| Badges | Pill-shaped, `radius-sm`, phase-colored per §2.3, always paired with text label (never color-only, for accessibility) |
| Tables (Symbol Table, Token Viewer) | Monospace data cells, sticky header, zebra-free (use border-subtle row dividers instead) |
| Cards | `radius-lg`, `shadow-panel`, `border-subtle` — no card ever floats without a border |
| Code Editor (Monaco) | Custom theme matching `--bg-surface` background, synced to phase-colors for inline diagnostic squiggles |

---

## 8. Accessibility Notes

- Minimum contrast ratio 4.5:1 for all text on backgrounds (verified against dark palette above).
- Phase colors are never the *only* differentiator — always paired with text/icon.
- All interactive elements reachable via keyboard (Tab order follows visual layout, left-to-right, top-to-bottom).
- Focus states use `--border-strong` outline, never removed via `outline: none` without a replacement.
