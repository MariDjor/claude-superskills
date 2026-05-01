---
name: ava-web
description: This skill should be used when the user needs to create a website, landing page, web component, or web UI following Ava brand guidelines. Trigger for "create a landing page", "build a website", "design a hero section", "Avanade-branded website", "create a React component in Avanade style", or any request to generate HTML/CSS/React/Next.js code with Ava visual identity.
license: MIT
---

## Purpose

Generate production-ready websites, landing pages, and web components using the Avanade (Ava) brand system.
Uses the same color tokens, typography, and wave decorations as `ava-pptx` — adapted for HTML/CSS, Tailwind, React, and Next.js.

Signature elements: orange gradient hero, wave SVG dividers, Segoe UI typography, orange CTA buttons, and the tagline "Do what matters".

## When to Use

- User asks to create a landing page, service page, about page, case study, or contact page
- User requests an Avanade-branded (or "Ava-branded") website or web UI
- User wants HTML/Tailwind/React/Next.js components following the Avanade visual style
- User asks for an "orange gradient hero", "Avanade-style cards", or a "wave separator"
- User needs a Tailwind config with Avanade design tokens
- User wants to generate a web prototype consistent with ava-pptx presentations

## Brand Snapshot

Memorize before generating any code:

| Token | Value | Web rule |
|-------|-------|---------|
| Primary Orange | `#FF5800` | Buttons, headings ≥24px, borders, icons. **Never body text** (fails WCAG AA at normal size) |
| Dark Orange | `#DC4600` | Hover/active states |
| Yellow Accent | `#FFD700` | Wave accent stripe only |
| Gradient | `135deg #FF5800→#B43C14→#870032` | Hero backgrounds, CTA sections |
| Body text | `#333333` | All running text on light backgrounds |
| Secondary text | `#666666` | Captions, subtitles |
| Subtle bg | `#F5F5F5` | Alternating sections |
| Tint bg | `#FFF0E8` | Callout boxes, icon backgrounds |
| Font | `'Segoe UI', system-ui, -apple-system, sans-serif` | All elements |
| Tagline | "Do what matters" | Footer + hero eyebrow |

## Workflow

### Step 0: Discovery

Before generating any code, determine:

1. **Stack** — ask if not stated:
   - HTML + CSS (no framework)
   - HTML + Tailwind CSS
   - React + Tailwind CSS
   - Next.js (App Router) + Tailwind CSS

2. **Page type** — identify or ask:
   - Landing page (Hero + Features + Stats + CTA + Footer)
   - Service page (Hero + Content-Image alternating + Features + CTA)
   - About page (Hero + Stats + Two-col + CTA)
   - Case Study (Hero + Challenge/Solution/Result + Stats + Quote + CTA)
   - Contact page (Hero + Form + Footer)
   - Single component (specify which one)

3. **Content** — what text, headings, statistics, and calls-to-action should appear? If not provided, use generic Avanade-style placeholder content ("We accelerate the extraordinary.", "Do what matters.", etc.)

4. **Logo** — ask if they have an SVG file path or should use a text placeholder.

### Step 1: Load Brand Reference

Read `references/web-brand-guidelines.md` before writing any code.
Read `references/components.md` to select the relevant components for the requested page type.
Read `references/tailwind-config.md` if the stack uses Tailwind.

### Step 2: Select Components

Map the page type to its component composition:

```
Landing page:     Nav + Hero (gradient) + WaveDivider + FeaturesGrid + StatsBar + ContentImage + WaveDivider + CTA + Footer
Service page:     Nav + Hero (compact) + ContentImage×2 + FeaturesGrid + CTA + Footer
About page:       Nav + Hero (compact) + StatsBar + ContentImage + ContentImage + CTA + Footer
Case Study:       Nav + Hero (compact) + Challenge/Solution/Result cols + StatsBar + PullQuote + CTA + Footer
Contact page:     Nav + Hero (compact) + ContactForm + Footer
Single component: Just the requested component
```

### Step 3: Generate Code

Produce complete, runnable code. Follow these rules per stack:

**HTML + CSS:**
- Use CSS custom properties from `references/web-brand-guidelines.md` (copy `:root {}` block verbatim)
- Use semantic HTML (`<nav>`, `<section>`, `<article>`, `<footer>`)
- Inline SVG wave decorations between sections
- Single-file output unless the user asks for separate files

**HTML + Tailwind:**
- Include `<script src="https://cdn.tailwindcss.com"></script>` for quick prototyping
- OR provide `tailwind.config.js` from `references/tailwind-config.md` if in a project
- Use `ava-*` color tokens (e.g., `bg-[#FF5800]`, `text-[#333333]`)
- For production: reference `references/tailwind-config.md` and use `bg-ava-orange` etc.

**React + Tailwind:**
- Produce component files (`.jsx` or `.tsx`)
- Each section = its own component with props
- Export default from a `Page.jsx` that composes all sections
- Use `className` (not `class`)
- Include `tailwind.config.js` content from references

**Next.js:**
- Use App Router: `app/page.tsx`, `app/layout.tsx`, `components/` directory
- `layout.tsx` sets the Segoe UI font and root CSS variables
- `page.tsx` imports and composes section components
- Include `tailwind.config.ts` from references
- TypeScript by default; use `interface` for props

### Step 4: Quality Check

Before delivering, verify:

- [ ] No `#FF5800` as body or caption text color (fails WCAG AA)
- [ ] Gradient uses correct stops: `#FF5800 → #B43C14 → #870032`
- [ ] Font family is `'Segoe UI', system-ui, -apple-system, sans-serif` everywhere
- [ ] Wave SVG uses the correct gradient IDs (`ava-wg1`, `ava-wg2`)
- [ ] All sections have `font-ava` or `font-family: var(--ava-font)` applied
- [ ] CTA buttons are orange (`#FF5800`) with white text
- [ ] Footer contains "Do what matters" tagline
- [ ] Logo placeholder is present (left side of nav)
- [ ] Code runs without errors — no unclosed tags, no missing imports

## Critical Rules

- NEVER use `#FF5800` as body paragraph or label text (contrast 2.8:1 — fails WCAG AA)
- NEVER use a font other than `'Segoe UI', system-ui, -apple-system, sans-serif`
- NEVER use blue, green, or cool tones as primary or accent
- ALWAYS read `references/web-brand-guidelines.md` before generating any code
- ALWAYS include the wave SVG divider between white and gradient sections
- ALWAYS place "Do what matters" in the footer (and optionally as a hero eyebrow)
- ALWAYS produce runnable code — not skeletons or pseudocode unless explicitly asked
- ALWAYS ask the stack (HTML/Tailwind/React/Next.js) if not specified — it changes output significantly

## Example Usage

1. "Create an Avanade-branded landing page for an AI consulting service (React + Tailwind)"
2. "Build a hero section with orange gradient and wave, Next.js, with headline 'We accelerate the extraordinary.'"
3. "Generate a Tailwind config with Avanade colors and a full case study page in HTML"
4. "Create a footer component with the Avanade brand style, 'Do what matters' tagline, dark background"
5. "Build a stats bar showing 50K+ employees, 25+ years, 100+ countries — Avanade orange numbers"
