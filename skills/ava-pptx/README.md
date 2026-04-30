# ava-pptx

Creates fully branded PowerPoint presentations following official Ava brand guidelines — colors, typography, wave decorations, logo placement, and slide layouts.

## Metadata

| Field | Value |
|-------|-------|
| Version | 1.0.0 |
| Author | ericgandrade |
| Created | 2026-04-30 |
| Updated | 2026-04-30 |
| Platforms | Claude Code, GitHub Copilot, Codex, OpenCode, Gemini CLI, Cursor |
| Category | Content |
| Tags | pptx, powerpoint, presentation, branding, slides, deck |
| Risk | low |

## What it does

- Generates `.pptx` presentations from scratch using `pptxgenjs`
- Applies the official brand palette, Segoe UI typography, and wave decorations to every slide
- Includes 10 layout types: cover, section divider, agenda, content+image, full-bleed, two-column, numbered points, closing, and more
- Enforces logo + tagline + copyright footer on every slide
- Performs visual QA via sub-agents before delivery

## Triggers

- "create a deck"
- "make slides"
- "build a presentation"
- "prepare a pitch"
- "present to client"
- "quarterly deck"
- Any request to generate `.pptx` files

## Requirements

```bash
npm install -g pptxgenjs
```

## Example Usage

```
> Create a 10-slide pitch deck for a digital transformation proposal
> Build a quarterly business review presentation, 8 slides, confidential
> Make a sales deck for a cloud migration offering
> Generate an internal all-hands presentation about our Q2 results
```

## Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Full skill specification and workflow |
| `references/brand-guidelines.md` | Complete color, font, and layout specifications |
| `scripts/avanade_base.js` | Base pptxgenjs script to copy and extend |
| `scripts/logo_white.png` | White logo for dark/gradient backgrounds |
| `scripts/logo_color.png` | Color logo for white backgrounds |
| `scripts/wave.png` | Wave decoration asset |
