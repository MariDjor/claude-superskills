# Tailwind Config — Avanade Brand Tokens

Drop-in Tailwind configuration with Avanade design tokens. Use with Tailwind CSS v3+.

---

## `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ava: {
          orange:       '#FF5800',
          'orange-dark':'#DC4600',
          yellow:       '#FFD700',
          flame:        '#B43C14',
          purple:       '#870032',
          'gray-dark':  '#333333',
          'gray-mid':   '#666666',
          'gray-light': '#999999',
          subtle:       '#F5F5F5',
          tint:         '#FFF0E8',
          white:        '#FFFFFF',
        },
      },
      fontFamily: {
        ava: [
          '"Segoe UI"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Helvetica Neue"',
          'sans-serif',
        ],
      },
      backgroundImage: {
        'ava-hero':         'linear-gradient(135deg, #FF5800 0%, #B43C14 55%, #870032 100%)',
        'ava-cta':          'linear-gradient(90deg, #FF5800 0%, #DC4600 60%, #B43C14 100%)',
        'ava-wave':         'linear-gradient(90deg, #FF5800 0%, #DC4600 60%, #B43C14 100%)',
        'ava-wave-accent':  'linear-gradient(90deg, #FFD700 0%, #FF5800 100%)',
      },
      boxShadow: {
        'ava-card':  '0 2px 12px rgba(0,0,0,0.08)',
        'ava-hover': '0 8px 24px rgba(255,88,0,0.15)',
        'ava-btn':   '0 4px 12px rgba(255,88,0,0.35)',
      },
      borderRadius: {
        'ava-card': '8px',
        'ava-btn':  '4px',
      },
      maxWidth: {
        'ava-container': '1200px',
      },
      height: {
        'ava-nav': '72px',
      },
      animation: {
        'ava-fade-up':   'ava-fade-up 0.5s ease both',
        'ava-fade-in':   'ava-fade-in 0.4s ease both',
      },
      keyframes: {
        'ava-fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'ava-fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
```

---

## Common Utility Combinations

### Hero section

```html
<section class="bg-ava-hero min-h-screen flex items-center">
  <div class="max-w-ava-container mx-auto px-6 py-20">
    <h1 class="font-ava text-5xl font-bold text-white leading-tight">
      Do what matters.
    </h1>
    <p class="font-ava text-xl text-white/80 mt-4 max-w-2xl">
      We accelerate the extraordinary.
    </p>
    <div class="mt-10 flex gap-4">
      <button class="font-ava bg-white text-ava-orange font-semibold px-7 py-3 rounded-ava-btn hover:bg-ava-tint transition-colors">
        Get started
      </button>
      <button class="font-ava border-2 border-white text-white font-semibold px-7 py-3 rounded-ava-btn hover:bg-white/10 transition-colors">
        Learn more
      </button>
    </div>
  </div>
</section>
```

### Feature card

```html
<div class="bg-white rounded-ava-card shadow-ava-card hover:shadow-ava-hover transition-shadow overflow-hidden border-t-4 border-ava-orange">
  <div class="p-6">
    <div class="w-10 h-10 bg-ava-tint rounded-full flex items-center justify-center mb-4">
      <!-- icon here, text-ava-orange -->
    </div>
    <h3 class="font-ava text-lg font-semibold text-ava-gray-dark mb-2">Card Title</h3>
    <p class="font-ava text-sm text-ava-gray-mid leading-relaxed">Card description text.</p>
    <a href="#" class="font-ava text-ava-orange font-semibold text-sm mt-4 inline-flex items-center gap-1 hover:text-ava-orange-dark">
      Learn more →
    </a>
  </div>
</div>
```

### Stats bar

```html
<section class="bg-ava-subtle py-16">
  <div class="max-w-ava-container mx-auto px-6">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div>
        <div class="font-ava text-5xl font-bold text-ava-orange">50K+</div>
        <div class="font-ava text-sm text-ava-gray-mid mt-2">Employees globally</div>
      </div>
      <!-- repeat for other stats -->
    </div>
  </div>
</section>
```

### Primary button

```html
<button class="font-ava bg-ava-orange hover:bg-ava-orange-dark text-white font-semibold px-7 py-3 rounded-ava-btn transition-colors shadow-ava-btn">
  Contact us
</button>
```

### CTA section

```html
<section class="bg-ava-cta py-20">
  <div class="max-w-ava-container mx-auto px-6 text-center">
    <h2 class="font-ava text-4xl font-bold text-white">Ready to do what matters?</h2>
    <p class="font-ava text-white/80 text-lg mt-4 mb-8">Let's build something extraordinary together.</p>
    <button class="font-ava bg-white text-ava-orange font-bold px-8 py-4 rounded-ava-btn hover:bg-ava-tint transition-colors text-lg">
      Let's talk
    </button>
  </div>
</section>
```

---

## `globals.css` Additions (for Next.js / CRA)

```css
@import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600;700&display=swap');
/* Note: Segoe UI is preinstalled on Windows/macOS — Google Fonts fallback only for Linux */

:root {
  font-family: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  color: #333333;
  background-color: #ffffff;
}

*, *::before, *::after {
  box-sizing: border-box;
}
```
