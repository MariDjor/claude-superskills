# Ava Web Component Catalogue

Complete component library for Avanade-branded websites.
Each component includes: HTML + CSS, Tailwind CSS, and React (JSX) variants.

---

## 1. Navigation Bar

### HTML + CSS

```html
<nav class="ava-nav">
  <div class="ava-container ava-nav__inner">
    <!-- Logo -->
    <a href="/" class="ava-nav__logo" aria-label="Avanade home">
      <img src="/images/avanade-logo.svg" alt="Avanade" height="36" width="auto">
    </a>
    <!-- Links -->
    <ul class="ava-nav__links">
      <li><a href="/services">Services</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/insights">Insights</a></li>
      <li><a href="/careers">Careers</a></li>
    </ul>
    <!-- CTA -->
    <a href="/contact" class="ava-btn-primary ava-nav__cta">Contact us</a>
  </div>
</nav>

<style>
  .ava-nav {
    position: sticky; top: 0; z-index: 100;
    height: 72px;
    background: #fff;
    border-bottom: 1px solid #F5F5F5;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .ava-nav__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }
  .ava-nav__links {
    display: flex;
    list-style: none;
    gap: 32px;
    margin: 0; padding: 0;
  }
  .ava-nav__links a {
    color: #333333;
    font-size: 16px;
    font-weight: 400;
    text-decoration: none;
    transition: color 0.2s;
  }
  .ava-nav__links a:hover { color: #FF5800; }
</style>
```

### Tailwind

```html
<nav class="sticky top-0 z-50 h-[72px] bg-white border-b border-[#F5F5F5] shadow-sm font-ava">
  <div class="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
    <a href="/" class="flex-shrink-0">
      <img src="/images/avanade-logo.svg" alt="Avanade" class="h-9 w-auto">
    </a>
    <ul class="hidden md:flex gap-8 list-none m-0 p-0">
      <li><a href="/services" class="text-[#333] text-base hover:text-ava-orange transition-colors">Services</a></li>
      <li><a href="/about"    class="text-[#333] text-base hover:text-ava-orange transition-colors">About</a></li>
      <li><a href="/insights" class="text-[#333] text-base hover:text-ava-orange transition-colors">Insights</a></li>
      <li><a href="/careers"  class="text-[#333] text-base hover:text-ava-orange transition-colors">Careers</a></li>
    </ul>
    <a href="/contact" class="bg-ava-orange hover:bg-ava-orange-dark text-white font-semibold px-6 py-2.5 rounded text-sm transition-colors">
      Contact us
    </a>
  </div>
</nav>
```

### React

```jsx
export function AvaNav({ links = [], ctaLabel = "Contact us", ctaHref = "/contact" }) {
  return (
    <nav className="sticky top-0 z-50 h-[72px] bg-white border-b border-gray-100 shadow-sm font-ava">
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        <a href="/" className="flex-shrink-0">
          <img src="/images/avanade-logo.svg" alt="Avanade" className="h-9 w-auto" />
        </a>
        <ul className="hidden md:flex gap-8 list-none m-0 p-0">
          {links.map(({ label, href }) => (
            <li key={href}>
              <a href={href} className="text-[#333] text-base hover:text-[#FF5800] transition-colors">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a href={ctaHref} className="bg-[#FF5800] hover:bg-[#DC4600] text-white font-semibold px-6 py-2.5 rounded text-sm transition-colors">
          {ctaLabel}
        </a>
      </div>
    </nav>
  );
}
```

---

## 2. Hero Section (Gradient)

### Tailwind

```html
<section class="relative bg-ava-hero min-h-[640px] flex items-center overflow-hidden font-ava">
  <!-- Background wave decoration -->
  <div class="absolute inset-0 opacity-20 pointer-events-none">
    <svg class="w-full h-full" viewBox="0 0 1440 640" preserveAspectRatio="xMidYMid slice">
      <path d="M-100,400 C300,250 600,550 900,350 C1100,200 1300,450 1540,300"
            stroke="#FFD700" stroke-width="24" fill="none" stroke-linecap="round"/>
      <path d="M-80,450 C320,300 620,590 920,390 C1120,240 1320,490 1560,340"
            stroke="#FF5800" stroke-width="16" fill="none" stroke-linecap="round" opacity="0.6"/>
    </svg>
  </div>

  <div class="relative max-w-[1200px] mx-auto px-6 py-24">
    <p class="text-white/70 text-sm font-semibold tracking-widest uppercase mb-3">
      Do what matters
    </p>
    <h1 class="text-5xl md:text-6xl font-bold text-white leading-tight max-w-3xl">
      We accelerate the extraordinary.
    </h1>
    <p class="text-xl text-white/80 mt-6 max-w-2xl leading-relaxed">
      Technology and digital innovation that drives real business outcomes.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 mt-10">
      <a href="/contact" class="bg-white text-[#FF5800] font-bold px-8 py-4 rounded text-base hover:bg-[#FFF0E8] transition-colors text-center">
        Get started
      </a>
      <a href="/services" class="border-2 border-white text-white font-semibold px-8 py-4 rounded text-base hover:bg-white/10 transition-colors text-center">
        Explore services
      </a>
    </div>
  </div>
</section>
```

### React

```jsx
export function AvaHero({ tagline, title, subtitle, primaryCta, secondaryCta }) {
  return (
    <section className="relative bg-gradient-to-br from-[#FF5800] via-[#B43C14] to-[#870032] min-h-[640px] flex items-center overflow-hidden font-ava">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1440 640" preserveAspectRatio="xMidYMid slice">
          <path d="M-100,400 C300,250 600,550 900,350 C1100,200 1300,450 1540,300"
                stroke="#FFD700" strokeWidth="24" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="relative max-w-[1200px] mx-auto px-6 py-24">
        {tagline && <p className="text-white/70 text-sm font-semibold tracking-widest uppercase mb-3">{tagline}</p>}
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight max-w-3xl">{title}</h1>
        {subtitle && <p className="text-xl text-white/80 mt-6 max-w-2xl leading-relaxed">{subtitle}</p>}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          {primaryCta && (
            <a href={primaryCta.href} className="bg-white text-[#FF5800] font-bold px-8 py-4 rounded text-base hover:bg-[#FFF0E8] transition-colors text-center">
              {primaryCta.label}
            </a>
          )}
          {secondaryCta && (
            <a href={secondaryCta.href} className="border-2 border-white text-white font-semibold px-8 py-4 rounded text-base hover:bg-white/10 transition-colors text-center">
              {secondaryCta.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
```

---

## 3. Feature Cards Grid

### Tailwind (3-column)

```html
<section class="py-20 bg-white font-ava">
  <div class="max-w-[1200px] mx-auto px-6">
    <h2 class="text-4xl font-bold text-[#333] text-center mb-4">Our Services</h2>
    <p class="text-[#666] text-center max-w-2xl mx-auto mb-14 text-lg">
      End-to-end solutions powered by Microsoft technology.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Card -->
      <div class="bg-white rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(255,88,0,0.15)] transition-shadow overflow-hidden border-t-4 border-[#FF5800]">
        <div class="p-6">
          <div class="w-12 h-12 bg-[#FFF0E8] rounded-full flex items-center justify-center mb-4 text-[#FF5800] text-xl">
            <!-- icon -->
          </div>
          <h3 class="text-xl font-semibold text-[#333] mb-3">Cloud & Infrastructure</h3>
          <p class="text-[#666] text-sm leading-relaxed mb-4">Scalable cloud solutions built on Microsoft Azure.</p>
          <a href="#" class="text-[#FF5800] font-semibold text-sm hover:text-[#DC4600] inline-flex items-center gap-1">
            Learn more <span aria-hidden>→</span>
          </a>
        </div>
      </div>
      <!-- repeat card -->
    </div>
  </div>
</section>
```

---

## 4. Stats Bar

### Tailwind

```html
<section class="py-16 bg-[#F5F5F5] font-ava">
  <div class="max-w-[1200px] mx-auto px-6">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
      <div class="text-center">
        <div class="text-5xl font-bold text-[#FF5800] leading-none">50K+</div>
        <div class="text-sm text-[#666] mt-2">Employees globally</div>
      </div>
      <div class="text-center">
        <div class="text-5xl font-bold text-[#FF5800] leading-none">25+</div>
        <div class="text-sm text-[#666] mt-2">Years of innovation</div>
      </div>
      <div class="text-center">
        <div class="text-5xl font-bold text-[#FF5800] leading-none">100+</div>
        <div class="text-sm text-[#666] mt-2">Countries served</div>
      </div>
      <div class="text-center">
        <div class="text-5xl font-bold text-[#FF5800] leading-none">#1</div>
        <div class="text-sm text-[#666] mt-2">Microsoft partner</div>
      </div>
    </div>
  </div>
</section>
```

---

## 5. Content + Image (Two-column)

### Tailwind

```html
<!-- Image right -->
<section class="py-20 bg-white font-ava">
  <div class="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
    <div>
      <p class="text-[#FF5800] font-semibold text-sm tracking-widest uppercase mb-3">Services</p>
      <h2 class="text-4xl font-bold text-[#333] leading-tight mb-6">
        Building the future of work with AI
      </h2>
      <p class="text-[#666] leading-relaxed mb-4">
        We combine Microsoft Copilot, Azure AI, and deep industry expertise
        to create intelligent solutions that drive real outcomes.
      </p>
      <p class="text-[#666] leading-relaxed mb-8">
        From strategy to implementation, our team of 50,000+ professionals
        is ready to help you transform.
      </p>
      <a href="/services/ai" class="bg-[#FF5800] hover:bg-[#DC4600] text-white font-semibold px-7 py-3 rounded transition-colors inline-block">
        Explore AI services
      </a>
    </div>
    <div class="rounded-lg overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
      <img src="/images/ai-services.jpg" alt="AI Services" class="w-full h-80 object-cover">
    </div>
  </div>
</section>
```

---

## 6. Callout / Pull Quote

### Tailwind

```html
<blockquote class="my-12 mx-auto max-w-3xl bg-[#FFF0E8] border-l-4 border-[#FF5800] rounded-r-lg p-8 font-ava">
  <p class="text-2xl font-semibold text-[#333] leading-relaxed italic mb-4">
    "Technology only matters when it creates real, lasting impact for people and organizations."
  </p>
  <footer class="text-[#FF5800] font-semibold text-sm">
    — Avanade CEO
  </footer>
</blockquote>
```

---

## 7. CTA Section

### Tailwind

```html
<section class="bg-gradient-to-r from-[#FF5800] via-[#DC4600] to-[#B43C14] py-20 font-ava">
  <div class="max-w-[1200px] mx-auto px-6 text-center">
    <h2 class="text-4xl font-bold text-white mb-4">Ready to do what matters?</h2>
    <p class="text-white/80 text-lg max-w-2xl mx-auto mb-10">
      Let's build something extraordinary together.
      Our experts are ready to help you accelerate your digital transformation.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="/contact" class="bg-white text-[#FF5800] font-bold px-8 py-4 rounded text-base hover:bg-[#FFF0E8] transition-colors">
        Get in touch
      </a>
      <a href="/about" class="border-2 border-white text-white font-semibold px-8 py-4 rounded text-base hover:bg-white/10 transition-colors">
        About Avanade
      </a>
    </div>
  </div>
</section>
```

---

## 8. Testimonial Block

### Tailwind

```html
<section class="py-20 bg-[#F5F5F5] font-ava">
  <div class="max-w-[1200px] mx-auto px-6">
    <h2 class="text-4xl font-bold text-[#333] text-center mb-14">What our clients say</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white rounded-lg p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)] border-t-4 border-[#FF5800]">
        <div class="text-[#FF5800] text-3xl mb-4">"</div>
        <p class="text-[#333] text-base leading-relaxed mb-6 italic">
          Avanade helped us modernize our entire cloud infrastructure in 6 months.
        </p>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-[#FFF0E8] rounded-full flex items-center justify-center text-[#FF5800] font-bold text-sm">
            JS
          </div>
          <div>
            <div class="text-sm font-semibold text-[#333]">Jane Smith</div>
            <div class="text-xs text-[#666]">CTO, Fortune 500 Company</div>
          </div>
        </div>
      </div>
      <!-- repeat card -->
    </div>
  </div>
</section>
```

---

## 9. Wave Divider (between sections)

```html
<!-- Place between a white section (above) and gradient section (below) -->
<div class="overflow-hidden leading-none h-20">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80"
       preserveAspectRatio="none" class="w-full h-full">
    <defs>
      <linearGradient id="wave-g1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#FF5800"/>
        <stop offset="60%"  stop-color="#DC4600"/>
        <stop offset="100%" stop-color="#B43C14"/>
      </linearGradient>
    </defs>
    <path d="M0,40 C360,0 720,80 1080,30 C1260,10 1380,60 1440,20 L1440,80 L0,80 Z"
          fill="url(#wave-g1)"/>
  </svg>
</div>
```

---

## 10. Footer

### Tailwind

```html
<footer class="bg-[#333333] text-white font-ava">
  <div class="max-w-[1200px] mx-auto px-6 py-16">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
      <!-- Brand column -->
      <div>
        <img src="/images/avanade-logo-white.svg" alt="Avanade" class="h-8 mb-4">
        <p class="text-[#999] text-sm leading-relaxed">
          Accelerating the extraordinary. A joint venture of Accenture and Microsoft.
        </p>
        <p class="text-[#FF5800] font-semibold text-sm mt-4">Do what matters.</p>
      </div>
      <!-- Links columns -->
      <div>
        <h4 class="text-sm font-semibold tracking-widest uppercase text-[#999] mb-4">Services</h4>
        <ul class="space-y-2">
          <li><a href="#" class="text-[#ccc] text-sm hover:text-white transition-colors">Cloud & Infrastructure</a></li>
          <li><a href="#" class="text-[#ccc] text-sm hover:text-white transition-colors">Data & AI</a></li>
          <li><a href="#" class="text-[#ccc] text-sm hover:text-white transition-colors">Modern Work</a></li>
          <li><a href="#" class="text-[#ccc] text-sm hover:text-white transition-colors">Security</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-sm font-semibold tracking-widest uppercase text-[#999] mb-4">Company</h4>
        <ul class="space-y-2">
          <li><a href="#" class="text-[#ccc] text-sm hover:text-white transition-colors">About</a></li>
          <li><a href="#" class="text-[#ccc] text-sm hover:text-white transition-colors">Careers</a></li>
          <li><a href="#" class="text-[#ccc] text-sm hover:text-white transition-colors">Insights</a></li>
          <li><a href="#" class="text-[#ccc] text-sm hover:text-white transition-colors">Newsroom</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-sm font-semibold tracking-widest uppercase text-[#999] mb-4">Contact</h4>
        <ul class="space-y-2">
          <li><a href="#" class="text-[#ccc] text-sm hover:text-white transition-colors">Get in touch</a></li>
          <li><a href="#" class="text-[#ccc] text-sm hover:text-white transition-colors">Locations</a></li>
          <li><a href="#" class="text-[#ccc] text-sm hover:text-white transition-colors">Partners</a></li>
        </ul>
      </div>
    </div>
    <!-- Bottom bar -->
    <div class="border-t border-[#555] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-[#999] text-xs">© 2026 Avanade. All rights reserved.</p>
      <div class="flex gap-6">
        <a href="#" class="text-[#999] text-xs hover:text-white transition-colors">Privacy</a>
        <a href="#" class="text-[#999] text-xs hover:text-white transition-colors">Terms</a>
        <a href="#" class="text-[#999] text-xs hover:text-white transition-colors">Accessibility</a>
      </div>
    </div>
  </div>
</footer>
```

---

## 11. Buttons (all variants)

```html
<!-- Primary -->
<button class="bg-[#FF5800] hover:bg-[#DC4600] text-white font-semibold px-7 py-3 rounded text-base transition-colors shadow-[0_4px_12px_rgba(255,88,0,0.35)] font-ava">
  Primary action
</button>

<!-- Secondary / outline -->
<button class="border-2 border-[#FF5800] text-[#FF5800] hover:bg-[#FF5800] hover:text-white font-semibold px-7 py-3 rounded text-base transition-colors font-ava">
  Secondary action
</button>

<!-- Ghost (on gradient/dark background) -->
<button class="border-2 border-white text-white hover:bg-white/10 font-semibold px-7 py-3 rounded text-base transition-colors font-ava">
  Ghost action
</button>

<!-- Small variant -->
<button class="bg-[#FF5800] hover:bg-[#DC4600] text-white font-semibold px-5 py-2 rounded text-sm transition-colors font-ava">
  Small action
</button>
```

---

## 12. Cards (all variants)

```html
<!-- Standard card — orange top border -->
<div class="bg-white rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(255,88,0,0.15)] transition-shadow border-t-4 border-[#FF5800] p-6 font-ava">
  <h3 class="text-xl font-semibold text-[#333] mb-2">Card Title</h3>
  <p class="text-[#666] text-sm leading-relaxed">Description text goes here.</p>
</div>

<!-- Gradient header card -->
<div class="bg-white rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden font-ava">
  <div class="bg-gradient-to-r from-[#FF5800] to-[#B43C14] h-2"></div>
  <div class="p-6">
    <h3 class="text-xl font-semibold text-[#333] mb-2">Card Title</h3>
    <p class="text-[#666] text-sm leading-relaxed">Description text goes here.</p>
  </div>
</div>

<!-- Icon card — tint background icon -->
<div class="bg-white rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-6 font-ava">
  <div class="w-12 h-12 bg-[#FFF0E8] rounded-full flex items-center justify-center mb-4">
    <!-- Icon with text-[#FF5800] class -->
  </div>
  <h3 class="text-xl font-semibold text-[#333] mb-2">Card Title</h3>
  <p class="text-[#666] text-sm leading-relaxed">Description text goes here.</p>
  <a href="#" class="text-[#FF5800] font-semibold text-sm mt-4 inline-block hover:text-[#DC4600]">
    Learn more →
  </a>
</div>
```

---

## Page Compositions

### Landing Page structure

```
<AvaNav />
<AvaHero />           ← gradient bg
<WaveDivider />       ← orange wave
<FeaturesGrid />      ← white bg, 3-col cards
<StatBar />           ← subtle gray bg
<ContentImage />      ← white bg, image right
<WaveDivider />       ← orange wave (flipped)
<CtaSection />        ← gradient bg
<Footer />            ← dark gray bg
```

### Service Page structure

```
<AvaNav />
<AvaHero variant="compact" />
<BreadcrumbBar />
<ContentImage image="right" />
<FeatureGrid cols={2} />
<ContentImage image="left" />
<CalloutQuote />
<CtaSection />
<Footer />
```

### Case Study structure

```
<AvaNav />
<AvaHero variant="compact" />
<ChallengeSolutionResult />   ← 3-col layout
<StatBar count={3} />
<ContentImage />
<PullQuote />
<CtaSection />
<Footer />
```
