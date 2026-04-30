---
name: ava-pptx
description: This skill should be used when the user needs to create a PowerPoint presentation, deck, slides, or pitch following official Ava brand guidelines. Trigger for "create a deck", "make slides", "build a presentation", "prepare a pitch", "present to client", "quarterly deck", or any request to generate .pptx files. This skill knows the exact colors, fonts, layouts, wave decorations, and logo placement from the Ava Standard PowerPoint template and produces client-ready, on-brand output.
license: MIT
---

# Avanade PPTX Skill

You are building a fully branded Avanade PowerPoint presentation using pptxgenjs. Every slide must
respect the Avanade visual identity exactly as described here. No improvisation on colors or fonts.

## Step-by-step workflow

1. **Understand the request** — clarify topic, audience, number of slides, and confidentiality level
2. **Read `references/brand-guidelines.md`** for full color/font/layout specs before writing any code
3. **Read the pptx skill** (search for `pptxgenjs.md` in the installed skills, e.g. `~/.claude/skills/pptx/pptxgenjs.md`) for pptxgenjs syntax
4. **Use `scripts/avanade_base.js`** as your starting point — copy it and extend it
5. **Build the presentation** slide by slide, using the layout catalogue below
6. **QA**: Convert to images and visually inspect (see pptx skill for QA workflow)
7. **Save to** `/Users/avanade/Desktop/Marketing/` and provide computer:// link

---

## Brand Snapshot (memorize these)

```
FONT:            Segoe UI (all weights)
SLIDE SIZE:      LAYOUT_16x9 (10" × 5.625")

COLORS — never use # prefix in pptxgenjs:
  ORANGE:        FF5800   ← Avanade Primary (Solar)
  DARK_ORANGE:   DC4600   ← Secondary orange (Pantone 159)
  YELLOW:        FFD700   ← Solar Yellow (Luminous Primary)
  RED_ORANGE:    B43C14   ← Flame (gradient mid-dark)
  DEEP_PURPLE:   870032   ← Gradient end (Thermal/deep)
  DARK_GRAY:     333333   ← Body text on light backgrounds
  MED_GRAY:      666666   ← Secondary text / page numbers
  WHITE:         FFFFFF
  LIGHT_ORANGE_BG: FFF0E8 ← Very light orange tint (callout boxes)

GRADIENT DIRECTION: Orange → Red → Purple (left-to-right or top-to-bottom)
```

---

## Consistent Elements on EVERY Slide

Add these to every slide without exception:

| Element | Position | Style |
|---------|----------|-------|
| Avanade logo | x:0.3, y:0.2, w:1.5, h:0.4 | White on dark/gradient; color PNG on white bg |
| "Do what matters" | x:6.5, y:0.25, w:3.2, h:0.3 | Segoe UI Semibold 12pt; white on dark, orange `FF5800` on white |
| Copyright footer | x:2.5, y:5.3, w:5, h:0.2 | "©2026 Avanade Inc. All Rights Reserved." gray `999999` 7pt center |
| Page number | x:9.4, y:5.3, w:0.4, h:0.2 | gray `999999` 8pt right |

Logo image paths (use whichever fits):
- White PNG logo: embed from `scripts/logo_white.png` (for dark/gradient backgrounds)
- Color PNG logo: embed from `scripts/logo_color.png` (for white backgrounds)
- Fallback: render "avanade" text in Segoe UI Bold if image unavailable

---

## Layout Catalogue

Read `references/brand-guidelines.md` for exact coordinates. Below is the decision guide:

### 1. COVER — gradient full background
Use for: first slide, executive summary intro, major section openers
- Full-slide gradient background (orange FF5800 → purple 870032, left-to-right)
- White logo + white "Do what matters" top area
- Wave decoration (see brand-guidelines.md for SVG paths)
- Title: Segoe UI Bold 44pt WHITE, bottom-left area (x:0.5, y:3.2)
- Subtitle: Segoe UI Semibold 20pt WHITE, below title

### 2. SECTION DIVIDER — gradient or solid orange
Use for: chapter breaks, major topic transitions
- Full orange or orange gradient background
- Wave decoration at bottom
- Large heading only: Segoe UI Bold 40pt WHITE
- Subheading: Segoe UI Semibold 18pt WHITE

### 3. CONTENTS / AGENDA — numbered grid
Use for: table of contents, agenda, overview
- White background with orange-number grid
- Numbers: Segoe UI Bold 28pt ORANGE (FF5800)
- Section headings: Segoe UI Bold 14pt DARK_GRAY
- Subheadings: Segoe UI Regular 12pt MED_GRAY
- Wave decoration in lower third (orange tones)
- Logo/footer at bottom as usual

### 4. CONTENT + IMAGE LEFT — split layout
Use for: feature explanations with visual support
- Left 40%: photo/image panel with orange strip accent
- Right 60%: white content area
- Slide title: Segoe UI Bold 22pt DARK_GRAY, top-right area
- Body: Segoe UI Regular 14-16pt DARK_GRAY
- Wave at bottom

### 5. CONTENT + IMAGE RIGHT — split layout (mirrored)
Use for: same as above, alternating for visual variety

### 6. FULL-BLEED IMAGE — image as background
Use for: impactful moments, quotes, transition slides
- Image fills full slide
- Orange wave/logo lines overlaid on top of image
- Title: Segoe UI Bold 28pt WHITE, bottom-left
- Subtitle: Segoe UI Semibold 16pt WHITE

### 7. TEXT CONTENT — white background with wave decoration
Use for: detailed content, bullet lists, body-heavy slides
- White background
- Orange wave decoration in lower third
- Title: Segoe UI Bold 24pt DARK_GRAY
- Body: Segoe UI Regular 16pt DARK_GRAY

### 8. TWO-COLUMN — content comparison
Use for: before/after, pros/cons, side-by-side comparison
- White background
- Two equal columns, orange vertical divider or card treatment
- Column headers: Segoe UI Semibold 18pt ORANGE
- Body: Regular 14pt DARK_GRAY

### 9. NUMBERED POINTS — large numbered list
Use for: key takeaways, steps, top-N lists
- Large numbers (Segoe UI Bold 48-60pt) in DARK_GRAY or ORANGE
- Heading per item: Segoe UI Bold 18pt ORANGE
- Paragraph: Regular 13pt DARK_GRAY

### 10. CLOSING / THANK YOU — gradient, similar to cover
Use for: final slide
- Same gradient as cover
- "Thank you" or key call-to-action
- Avanade logo + Do what matters tagline
- Optional: presenter contact info

---

## Confidentiality Watermark

Add to footer if requested:
- "< Confidential >" or "< Highly Confidential >" — append to copyright string

---

## Wave Decoration

The Avanade "logo lines" are organic wave shapes in orange/red/yellow gradient.
Since pptxgenjs doesn't support gradients natively, render them as SVG embedded as base64 image.

The `scripts/avanade_base.js` file includes a `getWaveSVG(theme)` function.
Use `theme: 'orange'` for white-background slides, `theme: 'gradient'` for dark slides.

---

## Quality Checklist (before delivery)

- [ ] All text in Segoe UI (not Arial, not Calibri)
- [ ] Orange is exactly `FF5800` (not `FF6600`, not `E85D00`)
- [ ] Logo appears on every slide
- [ ] "Do what matters" appears on every slide
- [ ] Footer copyright on every slide
- [ ] Page numbers correct
- [ ] No lorem ipsum placeholder text remains
- [ ] Gradient slides use white text only
- [ ] White slides use DARK_GRAY (`333333`) for body text
- [ ] Wave decoration present on content slides

---

## Reference Files

- `references/brand-guidelines.md` — full color specs, exact font sizes, layout coordinates
- `scripts/avanade_base.js` — base pptxgenjs script to copy and extend

Read `references/brand-guidelines.md` before starting any presentation.
