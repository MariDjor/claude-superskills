# ava-web

Generate Avanade-branded websites, landing pages, and web components with the official Ava visual identity system.

## Overview

`ava-web` produces production-ready HTML, Tailwind CSS, React, and Next.js code that matches the Avanade brand — the same orange gradient, Segoe UI typography, wave SVG decorations, and design tokens used in `ava-pptx` presentations.

## Metadata

| Field | Value |
|-------|-------|
| Version | 1.0.0 |
| Author | Eric Andrade |
| Created | 2026-04-30 |
| Updated | 2026-04-30 |
| Platforms | All (GitHub Copilot CLI, Claude Code, Codex, Gemini CLI, OpenCode, Cursor, AdaL, Antigravity) |
| Category | design |
| Tags | ui, web, avanade, branding, tailwind, react, nextjs, landing-page |
| Risk | safe |

## Trigger phrases

- "create an Avanade-branded landing page"
- "build a website in Ava style"
- "generate a hero section with orange gradient"
- "create a React component Avanade style"
- "Ava web landing page"
- "design a service page with Avanade colors"
- "create a Next.js page with Avanade brand"
- "build a stats bar Avanade orange"
- "create a footer with Do what matters tagline"
- "wave divider Avanade style"

## Features

- **4 stacks supported**: HTML + CSS, HTML + Tailwind, React + Tailwind, Next.js + Tailwind
- **5 page types**: Landing, Service, About, Case Study, Contact
- **12 components**: Nav, Hero (gradient), Feature cards, Stats bar, Content+Image, Callout, CTA section, Testimonials, Wave divider, Footer, Buttons, Cards
- **WCAG accessibility rules**: built-in guidance on when orange can/cannot be used as text
- **Brand-compliant**: same colors as ava-pptx — orange `#FF5800`, gradient to `#870032`, Segoe UI
- **Wave decorations**: SVG wave separator between sections (Avanade signature element)
- **Tailwind config**: ready-to-paste config with all Avanade tokens as `ava-*` colors

## Stacks

| Stack | Output |
|-------|--------|
| **HTML + CSS** | Single `.html` file with `<style>` block + CSS custom properties |
| **HTML + Tailwind** | Single `.html` with Tailwind CDN + custom config |
| **React + Tailwind** | Component `.jsx` files + `tailwind.config.js` |
| **Next.js** | `app/` directory structure, TypeScript, `layout.tsx`, `page.tsx`, components |

## Page Types

| Page | Sections |
|------|---------|
| **Landing page** | Hero → Wave → Features → Stats → Content+Image → Wave → CTA → Footer |
| **Service page** | Hero → Content+Image alternating → Features → CTA → Footer |
| **About page** | Hero → Stats → Content+Image → CTA → Footer |
| **Case Study** | Hero → Challenge/Solution/Result → Stats → Pull Quote → CTA → Footer |
| **Contact page** | Hero → Form → Footer |

## References

- [`references/web-brand-guidelines.md`](references/web-brand-guidelines.md) — CSS variables, typography scale, wave SVGs, accessibility rules
- [`references/components.md`](references/components.md) — all 12 components with HTML + Tailwind + React code
- [`references/tailwind-config.md`](references/tailwind-config.md) — drop-in Tailwind config with Ava tokens
- [`skills/ava-pptx/references/brand-guidelines.md`](../ava-pptx/references/brand-guidelines.md) — original PPTX brand source

## Related Skills

- **ava-pptx** — same brand, generates PowerPoint presentations instead of websites
- **ui-ux-pro-max** — design intelligence backend (color palettes, font pairings, design systems)
- **design-system** — 3-layer token architecture for large design systems
