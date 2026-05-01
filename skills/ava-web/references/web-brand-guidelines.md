# Avanade Web Brand Guidelines

Source of truth: `skills/ava-pptx/references/brand-guidelines.md` (PPTX origin)
Web adaptation: CSS custom properties, Tailwind tokens, responsive components

---

## Color System

### CSS Custom Properties

```css
:root {
  /* Primary brand colors */
  --ava-orange:       #FF5800;
  --ava-orange-dark:  #DC4600;
  --ava-yellow:       #FFD700;

  /* Gradient stops */
  --ava-flame:        #B43C14;
  --ava-purple:       #870032;

  /* Text */
  --ava-text-dark:    #333333;
  --ava-text-mid:     #666666;
  --ava-text-light:   #999999;

  /* Backgrounds */
  --ava-white:        #FFFFFF;
  --ava-bg-subtle:    #F5F5F5;
  --ava-tint:         #FFF0E8;

  /* Gradients */
  --ava-gradient:     linear-gradient(135deg, #FF5800 0%, #B43C14 55%, #870032 100%);
  --ava-wave-gradient:linear-gradient(90deg,  #FF5800 0%, #DC4600 60%, #B43C14 100%);
}
```

### Color Reference Table

| Token | Hex | Usage |
|-------|-----|-------|
| `--ava-orange` | `#FF5800` | Buttons, icons, headings on gradient, borders active |
| `--ava-orange-dark` | `#DC4600` | Hover/active state on orange elements |
| `--ava-yellow` | `#FFD700` | Wave accent stripe, decorative highlight |
| `--ava-flame` | `#B43C14` | Gradient midpoint |
| `--ava-purple` | `#870032` | Gradient end, dark header variant |
| `--ava-text-dark` | `#333333` | **All body text and headings on light backgrounds** |
| `--ava-text-mid` | `#666666` | Subheadings, captions, labels |
| `--ava-text-light` | `#999999` | Footer links, copyright, timestamps |
| `--ava-bg-subtle` | `#F5F5F5` | Alternating section backgrounds |
| `--ava-tint` | `#FFF0E8` | Callout boxes, pull-quote backgrounds |
| `--ava-white` | `#FFFFFF` | Text on gradient, card backgrounds |

---

## ⚠️ Accessibility — Critical Rules

`#FF5800` on `#FFFFFF` has a contrast ratio of **2.8:1** — this **fails** WCAG AA for normal text (requires 4.5:1).

| Use case | Allowed? | Reason |
|----------|----------|--------|
| Body paragraph text | ❌ Never | Fails WCAG AA (2.8:1) |
| Small labels/links | ❌ Never | Fails WCAG AA |
| Large heading ≥24px bold | ✅ OK | WCAG large text = 3:1 minimum (passes) |
| Buttons / CTAs | ✅ OK | Interactive element + large text |
| Borders / decorative | ✅ OK | Not text — no ratio requirement |
| Icons (≥24px) | ✅ OK | Non-text element |
| Orange on `#870032` (dark purple) | ✅ OK | Ratio 4.6:1 |
| White on `#FF5800` | ✅ OK | Ratio 3.1:1 (large text) |
| White on `#B43C14` | ✅ OK | Ratio 4.3:1 |
| White on `#870032` | ✅ OK | Ratio 8.0:1 |

**Rule:** Body text is always `#333333`. Use orange for headings ≥24px, buttons, icons, borders — never for running text.

---

## Typography

### Font Stack

```css
font-family: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
```

### Type Scale (web equivalents of PPTX sizes)

| Role | Size | Weight | Color | CSS class hint |
|------|------|--------|-------|---------------|
| Hero display title | 48–64px | 700 | White (on gradient) or #333333 | `.ava-hero-title` |
| Section title | 36–48px | 700 | #333333 or white | `.ava-section-title` |
| Card/panel heading | 24–30px | 600 | #333333 or #FF5800 | `.ava-card-heading` |
| Body heading | 20–22px | 600 | #FF5800 | `.ava-body-heading` |
| Body paragraph | 16–18px | 400 | #333333 | `.ava-body` |
| Caption / label | 12–14px | 400 | #666666 | `.ava-caption` |
| Footer / copyright | 12px | 400 | #999999 | `.ava-footer-text` |
| Stat callout number | 56–80px | 700 | #FF5800 | `.ava-stat-number` |
| "Do what matters" tagline | 13–14px | 600 | #FF5800 on light; white on dark | `.ava-tagline` |
| Navigation link | 16px | 400 | #333333 | `.ava-nav-link` |
| CTA button text | 16–18px | 600 | white (on orange bg) | `.ava-btn-primary` |

---

## Gradients

```css
/* Hero / Cover — diagonal orange→purple */
.ava-gradient-hero {
  background: linear-gradient(135deg, #FF5800 0%, #B43C14 55%, #870032 100%);
}

/* CTA section — left-to-right orange */
.ava-gradient-cta {
  background: linear-gradient(90deg, #FF5800 0%, #DC4600 60%, #B43C14 100%);
}

/* Subtle card accent top-border gradient */
.ava-gradient-border-top {
  background: linear-gradient(90deg, #FF5800 0%, #B43C14 50%, #870032 100%);
}
```

---

## Spacing & Layout

```css
:root {
  --ava-section-py:   80px;   /* vertical padding, sections */
  --ava-section-px:   24px;   /* horizontal padding, mobile */
  --ava-container:    1200px; /* max content width */
  --ava-card-radius:  8px;
  --ava-btn-radius:   4px;
  --ava-nav-height:   72px;
  --ava-shadow-card:  0 2px 12px rgba(0,0,0,0.08);
  --ava-shadow-hover: 0 8px 24px rgba(255,88,0,0.15);
}
```

---

## Wave Decoration — SVG

Reused from ava-pptx brand guidelines, adapted for HTML.

### Bottom-of-section wave divider (SVG inline)

```html
<!-- Place at the bottom of a white section, above gradient section -->
<div class="ava-wave-divider">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
    <defs>
      <linearGradient id="ava-wg1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#FF5800"/>
        <stop offset="60%"  stop-color="#DC4600"/>
        <stop offset="100%" stop-color="#B43C14"/>
      </linearGradient>
      <linearGradient id="ava-wg2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#FFD700"/>
        <stop offset="100%" stop-color="#FF5800"/>
      </linearGradient>
    </defs>
    <!-- Main wave fills bottom -->
    <path d="M0,60 C360,0 720,120 1080,50 C1260,20 1380,80 1440,40 L1440,120 L0,120 Z"
          fill="url(#ava-wg1)" opacity="0.9"/>
    <!-- Yellow accent stroke -->
    <path d="M-50,80 C270,20 540,120 810,60 C1080,0 1260,90 1490,30"
          stroke="url(#ava-wg2)" stroke-width="8" fill="none" stroke-linecap="round"/>
  </svg>
</div>

<style>
  .ava-wave-divider {
    width: 100%;
    overflow: hidden;
    line-height: 0;
    height: 80px;
  }
  .ava-wave-divider svg {
    width: 100%;
    height: 100%;
  }
</style>
```

### CSS clip-path wave (alternative, no SVG)

```css
.ava-wave-clip {
  clip-path: polygon(0 0, 100% 0, 100% 75%, 60% 100%, 40% 80%, 0 95%);
  background: linear-gradient(135deg, #FF5800 0%, #B43C14 55%, #870032 100%);
}
```

---

## Responsive Breakpoints

```css
/* Mobile first */
/* sm  */ @media (min-width: 640px)  { ... }
/* md  */ @media (min-width: 768px)  { ... }
/* lg  */ @media (min-width: 1024px) { ... }
/* xl  */ @media (min-width: 1280px) { ... }
/* 2xl */ @media (min-width: 1536px) { ... }

/* Container */
.ava-container {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: clamp(16px, 4vw, 48px);
}
```

---

## Navigation Bar

```
Height:     72px
Background: #FFFFFF (light) or gradient hero (dark variant)
Logo:       left, height 36px
Links:      center or right, #333333, 16px, font-weight 400
CTA button: rightmost, --ava-orange background, white text, radius 4px
Tagline:    "Do what matters" — small text right-of-logo or footer only
```

---

## Button System

```css
/* Primary */
.ava-btn-primary {
  background-color: #FF5800;
  color: #FFFFFF;
  padding: 12px 28px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}
.ava-btn-primary:hover {
  background-color: #DC4600;
  box-shadow: 0 4px 12px rgba(255,88,0,0.35);
}

/* Secondary / outline */
.ava-btn-secondary {
  background-color: transparent;
  color: #FF5800;
  padding: 11px 27px;
  border-radius: 4px;
  border: 2px solid #FF5800;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.ava-btn-secondary:hover {
  background-color: #FF5800;
  color: #FFFFFF;
}

/* Ghost / white (for use on gradient bg) */
.ava-btn-ghost {
  background-color: transparent;
  color: #FFFFFF;
  padding: 11px 27px;
  border-radius: 4px;
  border: 2px solid #FFFFFF;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.ava-btn-ghost:hover {
  background-color: rgba(255,255,255,0.15);
}
```

---

## NEVER in Ava Web

- Orange `#FF5800` as body text color (contrast fails)
- Blue, green, or cool-toned colors as primary or accent
- Any font other than Segoe UI stack
- Bright neon colors or unsaturated grays as headlines
- Logos smaller than 100px wide in nav
- Mixing the gradient background with heavy card grids (use solid color or white instead)
