# DESIGN.md — PixShift Design System
<!-- Source of truth. Edit this file to change the design — do not edit design-reference.html directly. -->
<!-- Last updated: 2026-06-11 -->
<!-- Stack: TailwindCSS + shadcn/ui -->
<!-- Mode: Dark-first. This is the primary experience. -->

## Color System

### Brand Colors
| Token | Hex | Tailwind Key | Usage |
|-------|-----|--------------|-------|
| primary | #7C3AED | primary | Main CTAs, active states, links, focus rings |
| primary-hover | #6D28D9 | primary-hover | Button hover state |
| secondary | #1E1B33 | secondary | Secondary button backgrounds, subtle panels |
| accent | #A78BFA | accent | Decorative highlights, gradient text, badges |

### Neutral Scale
| Token | Hex | Tailwind Key | Usage |
|-------|-----|--------------|-------|
| neutral-50 | #F4F4FF | neutral-50 | Primary text, headings |
| neutral-100 | #E8E7F5 | neutral-100 | Secondary headings |
| neutral-200 | #C5C3D8 | neutral-200 | Body text on dark surfaces |
| neutral-300 | #A09DB8 | neutral-300 | Secondary text |
| neutral-400 | #7B7894 | neutral-400 | Muted / placeholder text |
| neutral-500 | #5A5770 | neutral-500 | Disabled text |
| neutral-600 | #3D3A52 | neutral-600 | Strong borders |
| neutral-700 | #2A2840 | neutral-700 | Subtle borders, dividers |
| neutral-800 | #1A1830 | neutral-800 | Card/surface background |
| neutral-900 | #09090F | neutral-900 | Page background |

### Semantic Colors
| Token | Hex | Tailwind Key | Usage |
|-------|-----|--------------|-------|
| success | #22C55E | success | Success states, confirmation |
| success-bg | #052E16 | success-bg | Success alert background |
| warning | #F59E0B | warning | Warning states |
| warning-bg | #1C1500 | warning-bg | Warning alert background |
| error | #EF4444 | error | Error states, destructive actions |
| error-bg | #2A0808 | error-bg | Error alert background |
| info | #3B82F6 | info | Informational states |
| info-bg | #0C1A2E | info-bg | Info alert background |

### Text Colors
| Token | Hex | Usage |
|-------|-----|-------|
| text-primary | #F4F4FF | Main headings and body text |
| text-secondary | #9490AD | Supporting/muted text, descriptions |
| text-disabled | #5A5770 | Disabled elements |
| text-inverse | #09090F | Text on light/white backgrounds |
| text-link | #A78BFA | Clickable links |

### Background Colors
| Token | Hex | Usage |
|-------|-----|-------|
| bg-page | #09090F | Page/app background |
| bg-surface | #131220 | Cards, panels, modals |
| bg-elevated | #1A1830 | Nested cards, dropdowns |
| bg-overlay | rgba(9,9,15,0.80) | Modal backdrop |

### Border Colors
| Token | Hex | Usage |
|-------|-----|-------|
| border-default | #252342 | Standard card and input borders |
| border-strong | #3D3A52 | Emphasized borders, hover states |
| border-focus | #7C3AED | Input focus ring |

---

## Typography

### Font Families
- **Display:** Space Grotesk — Google Fonts — headings, hero text, product name
- **Body:** Inter — Google Fonts — paragraphs, labels, UI text, forms
- **Mono:** JetBrains Mono — Google Fonts — API keys, code blocks, technical data

**Google Fonts import (add to `web/src/app/layout.tsx` or global CSS):**
```
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

### Type Scale
| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| text-xs | 12px | 16px | 400 | Captions, metadata, timestamps, API key prefixes |
| text-sm | 14px | 20px | 400 | Labels, helper text, secondary UI, table data |
| text-base | 16px | 24px | 400 | Body text, paragraphs, form inputs |
| text-lg | 18px | 28px | 400 | Lead paragraphs, card descriptions |
| text-xl | 20px | 28px | 500 | Subheadings, section labels |
| text-2xl | 24px | 32px | 600 | Dashboard section headings |
| text-3xl | 30px | 36px | 700 | Page headings |
| text-4xl | 36px | 40px | 700 | Hero subheadlines |
| text-5xl | 48px | 52px | 800 | Hero headline |

### Heading Hierarchy
| Element | Size | Weight | Font | Letter Spacing |
|---------|------|--------|------|----------------|
| H1 | 48px | 800 | Space Grotesk | -0.02em |
| H2 | 36px | 700 | Space Grotesk | -0.01em |
| H3 | 30px | 700 | Space Grotesk | 0 |
| H4 | 24px | 600 | Inter | 0 |
| H5 | 20px | 600 | Inter | 0 |
| H6 | 16px | 600 | Inter | 0 |

---

## Spacing Scale
Base unit: 4px. All spacing values are multiples of this unit.
Use only these values — never hardcode arbitrary pixel values.

| Token | px | Usage |
|-------|----|-------|
| space-1 | 4px | Micro spacing — icon gaps |
| space-2 | 8px | Tight spacing — inline elements |
| space-3 | 12px | Small padding — compact components |
| space-4 | 16px | Base padding — buttons, inputs |
| space-5 | 20px | Comfortable spacing |
| space-6 | 24px | Component internal padding |
| space-8 | 32px | Between related elements |
| space-10 | 40px | Between components |
| space-12 | 48px | Section sub-spacing |
| space-16 | 64px | Section spacing (mobile) |
| space-20 | 80px | Section spacing (tablet) |
| space-24 | 96px | Section spacing (desktop) |
| space-32 | 128px | Large section breaks |

---

## Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| rounded-none | 0px | Sharp edges (rare) |
| rounded-sm | 4px | Subtle rounding — badges, small tags |
| rounded | 6px | Inputs, table cells |
| rounded-md | 8px | Cards, modals, dropdowns |
| rounded-lg | 12px | Prominent cards, panels |
| rounded-xl | 16px | Large feature cards |
| rounded-full | 9999px | Primary CTA buttons, avatars, pills |

**Project defaults:**
- Primary CTA button: `rounded-full`
- Secondary/ghost button: `rounded-lg`
- Cards: `rounded-lg`
- Inputs: `rounded-md`
- Badges: `rounded-sm`

---

## Shadows / Elevation
Dark-mode shadows use purple-tinted color to feel cohesive, not generic grey.

| Token | Value | Usage |
|-------|-------|-------|
| shadow-none | none | Flat elements — dividers, inline |
| shadow-sm | 0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.06) | Cards, inputs at rest |
| shadow-md | 0 4px 12px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.10) | Dropdowns, hover cards |
| shadow-lg | 0 8px 24px rgba(0,0,0,0.6), 0 0 20px rgba(124,58,237,0.12) | Modals, popovers |
| shadow-xl | 0 16px 48px rgba(0,0,0,0.7), 0 0 40px rgba(124,58,237,0.18) | Full overlays, hero elements |

---

## Breakpoints
Standard Tailwind breakpoints — do not change.

| Name | Min Width | Usage |
|------|-----------|-------|
| (default) | 0px | Mobile — design mobile first |
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Wide screens |

---

## Layout
- **Container max width:** 1280px (`max-w-7xl`)
- **Container padding:** 24px on mobile, 32px on desktop
- **Grid columns:** 12 columns
- **Grid gutter:** 24px (space-6)
- **Section vertical padding:** 64px mobile / 80px tablet / 96px desktop

---

## Component Patterns

### Buttons

**Primary Button** — pill shape, purple, bold
- Background: `primary` (#7C3AED) | Text: white | Border: none | Radius: `rounded-full`
- Padding: 12px 28px | Font: Inter, 14px, 600
- Hover: `primary-hover` (#6D28D9) background | Transition: 150ms ease
- Disabled: `neutral-700` background, `neutral-500` text, cursor-not-allowed
- Sizes: sm (8px 20px, 13px) | md (12px 28px, 14px) | lg (16px 36px, 16px)

**Secondary Button** — rounded-lg, dark surface, border
- Background: `secondary` (#1E1B33) | Text: `accent` (#A78BFA) | Border: 1px solid `border-default`
- Hover: `neutral-700` background, `border-strong` border | Radius: `rounded-lg`

**Ghost Button** — no background, text only
- Background: transparent | Text: `neutral-300` | Border: none
- Hover: `secondary` background | Radius: `rounded-lg`

**Destructive Button**
- Background: `error` (#EF4444) | Text: white | Radius: `rounded-lg`
- Hover: #DC2626

### Inputs

**Text / Email / Password Input**
- Background: `bg-elevated` (#1A1830) | Border: 1px solid `border-default` (#252342)
- Radius: `rounded-md` | Padding: 10px 14px | Font: Inter, 14px, 400 | Text: `text-primary`
- Placeholder: `neutral-500`
- Focus: `border-focus` (#7C3AED) border, box-shadow: 0 0 0 3px rgba(124,58,237,0.20)
- Error: `error` (#EF4444) border, error text below
- Disabled: `neutral-800` background, `neutral-500` text

**Label** — Inter, 14px, 500, `neutral-200`, margin-bottom: 6px

**Helper Text** — Inter, 12px, 400, `neutral-400`, margin-top: 4px

**Error Text** — Inter, 12px, 400, `error` (#EF4444), margin-top: 4px

### Cards
- Background: `bg-surface` (#131220) | Border: 1px solid `border-default` (#252342)
- Radius: `rounded-lg` | Shadow: `shadow-sm` | Padding: 24px
- Hover (interactive): `border-strong` border, `shadow-md` — transition 150ms

### Badges / Tags
- Padding: 2px 10px | Radius: `rounded-sm` | Font: Inter, 12px, 500
- Primary: `primary` bg at 15% opacity + `accent` text
- Success: `success-bg` + `success` text
- Warning: `warning-bg` + `warning` text
- Error: `error-bg` + `error` text
- Neutral: `neutral-700` + `neutral-300` text

### Alerts / Banners
- Padding: 16px | Radius: `rounded-md` | Border-left: 3px solid semantic color
- Background: semantic `-bg` color
- Variants: success, warning, error, info

### Code Block / API Key Display
- Background: `bg-page` (#09090F) | Border: 1px solid `border-default`
- Font: JetBrains Mono, 13px, 400 | Text: `accent` (#A78BFA)
- Radius: `rounded-md` | Padding: 12px 16px
- Copy button: ghost button with copy icon, right-aligned

### Avatars
- Sizes: sm (24px) | md (32px) | lg (40px) | xl (64px)
- Shape: `rounded-full`
- Fallback: initials on `secondary` background, `accent` text

---

## Navigation

### Top Navbar
- Height: 64px | Background: `bg-page` with `border-bottom: 1px solid border-default`
- Logo: left-aligned (Space Grotesk, 18px, 700, white) | Links: right | CTA: far right (primary pill button)
- Backdrop: sticky, with `backdrop-blur` for scroll effect
- Mobile: hamburger menu, full-height drawer from right

---

## Landing Page Sections

### Hero Section
- Background: `bg-page` with subtle radial purple glow behind headline
- Full-width, min-height: 80vh, centered content
- Headline: H1 (Space Grotesk, 48px+, 800, white) with one highlighted word in `accent`
- Subheadline: text-lg, `text-secondary` (#9490AD)
- CTAs: Primary pill button + secondary ghost button, side by side
- Below fold: code snippet or product screenshot card with `shadow-xl`

### Feature Grid
- 3 columns on desktop, 1 on mobile
- Each feature card: `bg-surface` card + `accent`-colored icon (24px Lucide) + H4 + text-base description
- Subtle purple glow on hover

### How It Works / Steps
- Numbered steps (1, 2, 3) in large `accent`-colored digits
- Each step: number + heading + description
- Connected by a vertical or horizontal line in `border-default`

### Code Example Section
- Dark card with syntax-highlighted code block
- Tab switcher for different languages (curl, Python, Node.js)
- Copy button top-right

### CTA Section (Bottom)
- Background: subtle purple gradient or `secondary` (#1E1B33)
- Centered: H2 + subheading + primary pill CTA button
- Padding: space-20 top and bottom

### Footer
- Background: `bg-page` | Border-top: 1px solid `border-default`
- Columns: logo + tagline | links by category | social icons
- Bottom bar: copyright, `text-secondary`, 14px
- All link text: `neutral-400`, hover: `neutral-200`

---

## Motion & Animation
| Token | Value | Usage |
|-------|-------|-------|
| duration-fast | 150ms | Hover states, button clicks |
| duration-normal | 250ms | Dropdowns, accordion |
| duration-slow | 400ms | Modal enter, page elements |
| ease-default | ease-in-out | Most transitions |
| ease-enter | ease-out | Elements entering screen |
| ease-exit | ease-in | Elements leaving screen |

---

## Icons
- **Library:** Lucide React (`lucide-react`)
- **Sizes:** 16px (inline/small UI), 20px (standard), 24px (feature icons)
- **Stroke width:** 1.5 — matches the regular weight of Inter
- **Color:** inherit from parent — never hardcode icon colors

---

## Tailwind Config — Extend Block

Add this to `web/tailwind.config.ts` under `theme.extend`:

```typescript
colors: {
  primary: {
    DEFAULT: '#7C3AED',
    hover: '#6D28D9',
  },
  secondary: {
    DEFAULT: '#1E1B33',
  },
  accent: {
    DEFAULT: '#A78BFA',
  },
  neutral: {
    50:  '#F4F4FF',
    100: '#E8E7F5',
    200: '#C5C3D8',
    300: '#A09DB8',
    400: '#7B7894',
    500: '#5A5770',
    600: '#3D3A52',
    700: '#2A2840',
    800: '#1A1830',
    900: '#09090F',
  },
  success: {
    DEFAULT: '#22C55E',
    bg: '#052E16',
  },
  warning: {
    DEFAULT: '#F59E0B',
    bg: '#1C1500',
  },
  error: {
    DEFAULT: '#EF4444',
    bg: '#2A0808',
  },
  info: {
    DEFAULT: '#3B82F6',
    bg: '#0C1A2E',
  },
},
fontFamily: {
  display: ['Space Grotesk', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
},
boxShadow: {
  sm: '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.06)',
  md: '0 4px 12px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.10)',
  lg: '0 8px 24px rgba(0,0,0,0.6), 0 0 20px rgba(124,58,237,0.12)',
  xl: '0 16px 48px rgba(0,0,0,0.7), 0 0 40px rgba(124,58,237,0.18)',
},
borderRadius: {
  sm: '4px',
  DEFAULT: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
},
```

---

## Rules for All Agents

1. Read this file completely before writing any UI component
2. Never use a color, font, or spacing value not defined here
3. Never hardcode a hex value in a component — always use the Tailwind token
4. Never add a font not listed here (Space Grotesk, Inter, JetBrains Mono)
5. If a new component type is needed that isn't covered above — define it here first, then build it
6. The spacing scale is fixed — never use arbitrary values like `p-[17px]`
7. All icons come from Lucide React — no other icon libraries
8. Dark mode is the primary experience — always design for dark backgrounds first
9. Primary CTA buttons are always pill-shaped (`rounded-full`) — never use rounded-lg on primary CTAs
10. API keys and code are always displayed in JetBrains Mono with `accent` color on `bg-page` background
