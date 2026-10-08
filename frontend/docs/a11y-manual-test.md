# LSA Bridge — Manual Accessibility (A11y) Verification Protocol

This protocol defines the manual verification procedure for WCAG 2.2 Level AA compliance across assistive technologies, input modalities, and visual presentation modes.

---

## 1. Assistive Technology Testing Matrix

### 1.1 Screen Reader Verification
Perform testing using at least one desktop and one mobile screen reader:
- **Desktop:** NVDA (Windows / Firefox or Chrome) or JAWS
- **macOS / iOS:** VoiceOver (Safari)
- **Android:** TalkBack (Chrome)

| Test ID | Element / Flow | Expected Assistive Behavior | Pass/Fail |
|---|---|---|---|
| `SR-01` | Page Navigation | `h1` announced on route transition; page title matches `<title>` tag. | [ ] |
| `SR-02` | Landmark Regions | Header (`<header>`), Navigation (`<nav>`), Main content (`<main>`), Footer landmark structure navigable via shortcut keys. | [ ] |
| `SR-03` | Camera Panel | Status changes announced via `aria-live="polite"` (e.g. "Caméra active", "Main gauche détectée"). | [ ] |
| `SR-04` | Sign Recognition | Detected sign chips announce gloss name and confidence tier without interrupting active speech. | [ ] |
| `SR-05` | SignPlayer | Player announces currently playing sign caption and total sequence duration in active language. | [ ] |
| `SR-06` | Emergency Sheet | Modal traps screen reader focus within sheet; announces "Urgence médicale" with role `alertdialog`. | [ ] |
| `SR-07` | Toast Notifications | Toast messages announced via `role="status"` or `aria-live="assertive"` for critical alerts. | [ ] |

---

## 2. Keyboard & Switch Control Navigation

### 2.1 Focus Management & Visual Indicators
- Verify that every interactive control (`<button>`, `<a>`, `<input>`, `<select>`, custom controls) has an unmistakable focus ring:
  - Default: 2px solid `--primary-strong` with 2px offset.
  - High-Contrast: 3px solid black with 2px white offset.

| Test ID | Action | Expected Focus Behavior | Pass/Fail |
|---|---|---|---|
| `KB-01` | Sequential Tab | Tab order follows logical visual reading order (LTR in FR/EN, RTL in AR). | [ ] |
| `KB-02` | Reverse Tab | Shift+Tab traverses backwards without getting trapped. | [ ] |
| `KB-03` | Modal Dialogs | Opening a modal/sheet sets focus to the first interactive element inside. Tabbing cycles strictly within modal. | [ ] |
| `KB-04` | Escape Key | Pressing `Escape` closes any open Modal, Sheet, or Dropdown and returns focus to the trigger button. | [ ] |
| `KB-05` | Space / Enter | Space or Enter activates buttons; Space toggles switches and checkboxes; Enter submits form inputs. | [ ] |
| `KB-06` | Arrow Keys | Segmented controls and Radio groups navigable via Left/Right/Up/Down arrow keys. | [ ] |

---

## 3. Visual & Cognitive Verification

### 3.1 Color Contrast Audit (WCAG 2.2 AA)
All measurements verified using colour contrast analyzer tools:

| Element | Background | Foreground | Minimum Target | Actual Ratio | Pass/Fail |
|---|---|---|---|---|---|
| Primary Button Text | `--primary-strong` (#0F766E) | White (#FFFFFF) | $\ge 4.5:1$ | **5.4:1** | [ ] |
| Primary Link / Nav | `--bg` (#FAF8F5) | `--primary-strong` (#0F766E) | $\ge 4.5:1$ | **5.2:1** | [ ] |
| Muted Secondary Text | `--bg` (#FAF8F5) | `--muted` (#5B6470) | $\ge 4.5:1$ | **4.9:1** | [ ] |
| Border Lines / Inputs | `--bg` (#FAF8F5) | `--border-strong` (#CFC8BC) | $\ge 3.0:1$ | **3.2:1** | [ ] |
| High Contrast Mode | Pure White (#FFFFFF) | Pure Black (#000000) | $\ge 7.0:1$ | **21:1** | [ ] |

### 3.2 Zoom & Dynamic Text Scaling
1. In Settings, toggle Large Text between **100%**, **125%**, and **150%**.
2. Verify that:
   - No text is truncated or clipped by fixed-height containers.
   - Layout reflows smoothly without horizontal scrollbars at 320px viewport width.
   - Touch targets expand to accommodate larger text where applicable.

### 3.3 Reduced Motion Mode (`prefers-reduced-motion`)
1. Enable `prefers-reduced-motion: reduce` in OS settings or in-app accessibility preferences.
2. Verify that:
   - Page transitions complete instantaneously (duration $\le 1\text{ms}$).
   - Pulsing status dots convert to solid static rings.
   - Slide-in sheets open with an immediate cut rather than a sliding animation.
   - Canvas landmark animations disable unnecessary camera bounce.
