# Avanade Brand Guidelines — PowerPoint Reference

Source: Avanade Standard PowerPoint Template 2026 + Avanade Brand Site

---

## Color System

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Avanade Orange (Solar) | `FF5800` | 255, 88, 0 | Primary brand color. Buttons, accents, key text highlights |
| Avanade Dark Orange | `DC4600` | 204, 70, 0 | Pantone 159. Secondary orange for hover states |
| Luminous Yellow | `FFD700` | 255, 215, 0 | Gradient accent, wave top line |

### Gradient Palette (Avanade's signature look)

| Stop | Hex | Position |
|------|-----|----------|
| Solar Orange | `FF5800` | 0% — start |
| Flame Red | `B43C14` | 50% — mid |
| Deep Purple | `870032` | 100% — end |

The gradient is applied to: cover slides, section dividers, agenda slides, closing slides.
Wave elements use a sub-gradient: `FF5800` → `DC4600` → `FFD700` (orange-yellow).

### Secondary / Supporting Colors

| Name | Hex | Usage |
|------|-----|-------|
| Dark Gray | `333333` | Body text on white backgrounds |
| Medium Gray | `666666` | Subtext, captions, page numbers |
| Light Gray | `999999` | Footers, copyright |
| Very Light Gray | `F5F5F5` | Subtle background on content slides |
| Light Orange Tint | `FFF0E8` | Callout boxes, pull-quote backgrounds |
| Orange Border | `FF5800` | Card borders, accent lines in callouts |
| White | `FFFFFF` | All text on gradient/dark backgrounds |

### NEVER use these
- `#` prefix — corrupts pptxgenjs output
- 8-char hex for opacity — use `opacity` property instead
- Any blue, green, or cool-toned color as primary
- Arial, Calibri, or any non-Segoe UI font

---

## Typography System

**Universal font: Segoe UI** (all slides, all elements)

### Size Scale for Slides (10"×5.625" canvas)

| Role | Weight | Size | Color |
|------|--------|------|-------|
| Cover title | Bold | 44–54pt | FFFFFF on gradient |
| Cover subtitle | Semibold | 20–24pt | FFFFFF on gradient |
| Section heading (divider) | Bold | 36–44pt | FFFFFF on gradient |
| Section subheading (divider) | Semibold | 18pt | FFFFFF on gradient |
| Slide title (content slides) | Bold | 22–28pt | 333333 on white |
| Slide title (on gradient) | Bold | 24–30pt | FFFFFF |
| Body heading | Semibold | 18pt | FF5800 (orange accents) |
| Body paragraph | Regular | 14–16pt | 333333 |
| Caption / label | Light | 11–12pt | 666666 |
| Page number | Regular | 8pt | 999999 |
| Copyright footer | Regular | 7pt | 999999 |
| "Do what matters" tagline | Semibold | 11–12pt | FFFFFF on dark; FF5800 on white |
| Numbered section numbers (contents) | Bold | 28–32pt | FF5800 |
| Large stat callout numbers | Bold | 60–72pt | FF5800 or 333333 |

---

## Slide Dimensions & Safe Zones

```
Total canvas:   10.0" × 5.625"
Left margin:    0.3"
Right margin:   0.3"  (content ends at x:9.7)
Top margin:     0.2"
Bottom margin:  0.2"  (footer zone: y:5.3–5.5)
Content starts: y:0.9  (below logo/tagline)
Content ends:   y:5.1  (above footer)
Safe width:     9.4"
Safe height:    4.2"
```

---

## Fixed Elements — Exact Coordinates

### Logo (every slide)
```javascript
// White logo on gradient/dark backgrounds
slide.addImage({
  path: 'path/to/logo_white.png',  // or base64
  x: 0.3, y: 0.2, w: 1.5, h: 0.4
});

// Color logo on white backgrounds  
slide.addImage({
  path: 'path/to/logo_color.png',  // or base64
  x: 0.3, y: 0.2, w: 1.5, h: 0.4
});
```

If logo image is unavailable, render as text fallback:
```javascript
slide.addText("avanade", {
  x: 0.3, y: 0.18, w: 1.8, h: 0.45,
  fontFace: "Segoe UI", fontSize: 22, bold: true,
  color: onDark ? "FFFFFF" : "FF5800"
});
```

### "Do what matters" Tagline (every slide)
```javascript
slide.addText("Do what matters", {
  x: 6.5, y: 0.25, w: 3.2, h: 0.3,
  fontFace: "Segoe UI", fontSize: 11, bold: true,
  color: onDark ? "FFFFFF" : "FF5800",
  align: "right", margin: 0
});
```

### Copyright Footer (every slide)
```javascript
slide.addText("©2026 Avanade Inc. All Rights Reserved.", {
  x: 2.5, y: 5.32, w: 5.0, h: 0.2,
  fontFace: "Segoe UI", fontSize: 7, color: "999999", align: "center", margin: 0
});
```

### Page Number (every slide, except cover)
```javascript
slide.addText(String(slideNum), {
  x: 9.4, y: 5.3, w: 0.4, h: 0.2,
  fontFace: "Segoe UI", fontSize: 8, color: "999999", align: "right", margin: 0
});
```

---

## Layout Specifications

### Layout 1: Cover Slide

```
Background:  Full gradient image (orange FF5800 → purple 870032)
Wave:        Decorative wave shapes top-right + bottom  
Logo:        White, x:0.3 y:0.2 w:1.5 h:0.4
Tagline:     White, top-right
Title:       White Bold 44pt, x:0.5 y:3.0 w:7.0 h:1.2
Subtitle:    White Semibold 20pt, x:0.5 y:4.2 w:6.5 h:0.5
Copyright:   White/very light, x:2.5 y:5.32 (no page number on cover)
```

### Layout 2: Section Divider (Chapter Break)

```
Background:  Full orange or gradient (Solar FF5800 as dominant)
Wave:        Bottom-area wave decoration
Logo:        White, top-left
Tagline:     White, top-right
Heading:     White Bold 40pt, x:0.5 y:2.8 w:8.5 h:1.2
Subheading:  White Semibold 18pt, x:0.5 y:4.0 w:7.0 h:0.5
```

### Layout 3: Contents / Agenda (5-column grid)

```
Background:  White
Title:       "Contents" or "Agenda" — Bold 32pt 333333, x:0.4 y:0.2 w:5 h:0.7
Numbers:     Bold 28pt FF5800 — positioned in 5 columns
             Col positions: 0.4, 2.2, 4.0, 5.8, 7.6  (width 1.6 each, y:1.2)
Headings:    Bold 14pt 333333, below numbers (y:1.65)
Subheadings: Regular 11pt 666666, below headings (y:2.0)
Wave:        Orange wave, y:3.5–5.6 region
Logo/footer: Standard positions
```

Example for 5 sections:
```javascript
const sections = [
  { num: '01', heading: 'Introduction', sub: 'Context and goals' },
  { num: '02', heading: 'Approach',     sub: 'Our methodology' },
  // ...
];
const colX = [0.4, 2.2, 4.0, 5.8, 7.6];
sections.forEach((s, i) => {
  const x = colX[i];
  slide.addText(s.num, { x, y: 1.15, w: 1.6, h: 0.55,
    fontFace: 'Segoe UI', fontSize: 28, bold: true, color: 'FF5800' });
  slide.addText(s.heading, { x, y: 1.7, w: 1.6, h: 0.35,
    fontFace: 'Segoe UI', fontSize: 13, bold: true, color: '333333' });
  slide.addText(s.sub, { x, y: 2.05, w: 1.6, h: 0.3,
    fontFace: 'Segoe UI', fontSize: 11, color: '666666' });
});
```

### Layout 4: Content + Image Left

```
Image panel: x:0 y:0 w:3.8 h:5.625 (covers full left side)
Orange accent strip: x:3.7 y:0 w:0.12 h:5.625 fill:FF5800
Content area: x:4.0 y:0.8 w:5.7 h:4.5
  Title:    Bold 22pt 333333, y:0.9
  Body:     Regular 14-16pt 333333
  Bullets:  Regular 14pt 333333 with bullet:true
Wave:       Bottom of right content panel, y:4.2
Logo:       White if over image, or color on right panel
```

### Layout 5: Content + Image Right (mirror of Layout 4)

```
Content area: x:0.4 y:0.8 w:5.5 h:4.5
Orange accent strip: x:5.9 y:0 w:0.12 h:5.625 fill:FF5800
Image panel: x:6.0 y:0 w:4.0 h:5.625
```

### Layout 6: Full-Bleed Image

```
Image:      x:0 y:0 w:10 h:5.625 (sizing: cover)
Orange wave overlay on top of image
Logo:       White, top-left
Tagline:    White, top-right
Title:      White Bold 28pt, x:0.5 y:3.4 w:7 h:0.9
Subtitle:   White Semibold 16pt, x:0.5 y:4.3 w:6 h:0.5
```

### Layout 7: Text Content (white, with wave)

```
Background: White (FFFFFF)
Orange wave: bottom third, y:3.8–5.6
Title:      Bold 24pt 333333, x:0.5 y:0.85 w:9.0 h:0.65
Body:       Regular 15pt 333333, x:0.5 y:1.6 w:9.0 h:3.0
Tagline:    FF5800 (orange) top-right
Logo:       Color, top-left
```

### Layout 8: Two Column

```
Background:  White
Title:       Bold 22pt 333333, x:0.5 y:0.85 w:9.0 h:0.55
Left col:    x:0.4 y:1.55 w:4.4 h:3.3
Right col:   x:5.1 y:1.55 w:4.5 h:3.3
Divider:     Thin line or orange strip x:4.9 y:1.5 w:0.08 h:3.4 fill:FF5800
Col headers: Semibold 16pt FF5800
Col body:    Regular 13pt 333333
Wave:        Orange wave, y:4.4+
```

### Layout 9: Numbered Points

```
Background: White or gradient
Numbers:    Bold 52pt 333333 (or FF5800 on white), x:0.4 y-offset per item
Headings:   Bold 18pt FF5800, next to number
Body:       Regular 13pt 333333
Spacing:    ~1.4" per item block
```

### Layout 10: Closing / Thank You

```
Same as Cover (gradient background)
Central text: "Thank you" Bold 44pt WHITE
Or: key call-to-action message
Contact: Regular 14pt WHITE
Avanade.com: Regular 12pt WHITE
```

---

## Wave Decoration — SVG Approach

Since pptxgenjs doesn't support gradients natively, use SVG embedded as base64.

### Orange Wave (for white-background slides)
```javascript
function getOrangeWaveSVG(width = 960, height = 200) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF5800"/>
      <stop offset="60%" stop-color="#DC4600"/>
      <stop offset="100%" stop-color="#B43C14"/>
    </linearGradient>
    <linearGradient id="wg2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFD700"/>
      <stop offset="100%" stop-color="#FF5800"/>
    </linearGradient>
  </defs>
  <!-- Main wave -->
  <path d="M0,100 C200,30 400,170 600,80 C800,0 900,120 960,60 L960,200 L0,200 Z" 
        fill="url(#wg1)" opacity="0.9"/>
  <!-- Accent wave line -->
  <path d="M-50,130 C150,60 350,190 550,100 C750,20 880,140 1010,70" 
        stroke="url(#wg2)" stroke-width="12" fill="none" stroke-linecap="round"/>
</svg>`;
}
```

### Gradient Background (for cover/section slides)
```javascript
function getGradientBgSVG(width = 960, height = 540) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF5800"/>
      <stop offset="55%" stop-color="#B43C14"/>
      <stop offset="100%" stop-color="#870032"/>
    </linearGradient>
    <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFD700"/>
      <stop offset="100%" stop-color="#FF5800"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <!-- Top-right wave accent -->
  <path d="M550,0 C650,80 800,-20 960,60 C960,0 960,0 960,0 Z" 
        fill="url(#wave1)" opacity="0.5"/>
  <!-- Main decorative wave -->
  <path d="M-100,350 C200,250 400,450 650,320 C850,210 950,380 1100,280" 
        stroke="#FFD700" stroke-width="18" fill="none" stroke-linecap="round" opacity="0.8"/>
  <path d="M-80,390 C200,300 420,490 660,360 C860,240 960,410 1100,310" 
        stroke="#FF5800" stroke-width="14" fill="none" stroke-linecap="round" opacity="0.6"/>
  <path d="M-60,430 C220,350 440,520 680,390 C880,270 970,440 1100,340" 
        stroke="#DC4600" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.5"/>
</svg>`;
}
```

Convert SVG to base64 for pptxgenjs:
```javascript
const svgBuffer = Buffer.from(svgString);
const base64 = svgBuffer.toString('base64');
const dataUrl = `image/svg+xml;base64,${base64}`;
slide.addImage({ data: dataUrl, x: 0, y: 0, w: 10, h: 5.625 });
```

---

## Callout Box / Pull Quote Style

```javascript
// Orange-bordered callout box
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 2.0, w: 4.0, h: 1.2,
  fill: { color: 'FFF0E8' },
  line: { color: 'FF5800', width: 2 }
});
slide.addText('"Key insight or quote goes here"', {
  x: 0.6, y: 2.05, w: 3.8, h: 1.1,
  fontFace: 'Segoe UI', fontSize: 14, italic: true, color: '333333'
});

// Orange left-bar accent
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 2.0, w: 0.08, h: 1.2,
  fill: { color: 'FF5800' }, line: { color: 'FF5800', width: 0 }
});
```

---

## Numbered Badge (for agenda/contents/steps)

```javascript
// Orange badge circle with number
slide.addShape(pres.shapes.OVAL, {
  x: 0.4, y: 1.5, w: 0.45, h: 0.45,
  fill: { color: 'FFF0E8' }, line: { color: 'FF5800', width: 1.5 }
});
slide.addText('01', {
  x: 0.4, y: 1.5, w: 0.45, h: 0.45,
  fontFace: 'Segoe UI', fontSize: 11, bold: true, color: 'FF5800',
  align: 'center', valign: 'middle', margin: 0
});
```
