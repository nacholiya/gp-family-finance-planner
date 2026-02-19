# beanies.family Brand Theme Skill

Use this skill whenever writing UI copy, designing components, choosing colors, writing code comments or error messages, or generating any content for the beanies.family app. All output must be consistent with the Corporate Identity Guidelines (`docs/brand/beanies-cig.html`).

---

## Identity

- **App name:** `beanies.family` (always lowercase, always with the `.family` TLD — never "Beanies", "beanies", or "Beanies Family")
- **Tagline:** *every bean counts* (lower case, no period)
- **Origin story:** Born from a father's nickname for his son. The app is the focal point where piano lessons meet financial planning — a family legacy tool, not a spreadsheet.
- **Core promise:** "We don't just count beans; we grow them."

---

## Colors — The Sunrise Security Set

| Name | Hex | CSS Variable | Role | Use for |
|------|-----|-------------|------|---------|
| Deep Slate | `#2C3E50` | `--color-secondary`, `--color-text` | The Foundation | Primary text, security, dark backgrounds |
| Heritage Orange | `#F15D22` | `--color-primary` | The Energy | Primary actions, CTA buttons, growth indicators |
| Heritage Orange Dark | `#D14D1A` | `--color-primary-dark` | — | Hover/active states for primary |
| Sky Silk | `#AED6F1` | — | The Calm | Parent elements, backgrounds, light shadows, focus rings |
| Terracotta | `#E67E22` | `--color-warning` | The Human | Children, personal milestones, warnings |
| Success Green | `#22c55e` | `--color-success` | — | Income indicators (keep green) |
| Error Red | `#ef4444` | `--color-danger` | — | Form validation errors and destructive action buttons ONLY |
| Warm White | `#FDFBF9` | `--color-background` | — | Light mode page background |
| Warm Surface | `#F5F1ED` | `--color-surface` | — | Light mode card/surface background |

### Dark mode

- Background: Deep Slate `#2C3E50` and darker variants (`#1a252f`, `#243342`)
- Surfaces: `#34495E` (lighter slate)
- Accent: Heritage Orange `#F15D22` (slightly muted: `#E0551F` on dark surfaces)
- Text: `#ECF0F1` (light), `#BDC3C7` (muted)
- Borders: `#4A6274`
- Keep existing Tailwind `dark:` prefix pattern, swap in brand colors

### Rules

- **Heritage Orange** is the primary action color. Use for buttons, active states, CTAs, links, toggles, progress bars.
- **Never use "Alert Red"** for notifications or important messages — use Heritage Orange to keep the mood positive and secure.
- Keep `green-*` for income indicators.
- Keep `red-*` only for destructive actions and hard form validation errors.
- Heritage Orange replaces all primary `blue-*` usage throughout the UI.
- **Sky Silk for soft accents.** Use for focus rings, background highlights, card shadows, hover states on light backgrounds.

---

## Typography

| Font | Weight | Use for |
|------|--------|---------|
| Outfit | 700 | Headings (h1, h2, h3) |
| Outfit | 600 | Subheadings, emphasized values |
| Outfit | 500 | App name wordmark, subheadings |
| Outfit | 400 | Financial values and large numbers |
| Inter | 600 | Labels, column headers, strong body |
| Inter | 400 | Body text, data, table content |

- Financial figures always use Outfit — they must be clear and easy to read
- Numbers should emphasise the "Every bean counts" value proposition

### Font loading

```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

```css
body { font-family: 'Inter', system-ui, sans-serif; }
h1, h2, h3, .font-headline, .font-brand, .font-amount { font-family: 'Outfit', system-ui, sans-serif; }
```

---

## Logo & Mascot Rules

- **Wordmark:** "beanies.family" in Outfit Medium, Deep Slate `#2C3E50`
- **Tagline lockup:** Inter Regular, centered below wordmark
- **Symbol:** Blue parent + orange child holding hands, with an upward arrow — togetherness and financial momentum
- **The Golden Rule:** The beanies hold hands to show they are together as a family. **Never separate them. Never rotate the arrow.**
- **On light backgrounds:** Full color
- **On Deep Slate backgrounds:** Knockout white (all elements white)
- **On Heritage Orange backgrounds:** Knockout white

---

## Visual Assets

All assets in `public/brand/`.

| Asset | File | Usage |
|-------|------|-------|
| Logo (opaque) | `beanies-logo.png` | Standalone on white/light backgrounds |
| Logo (transparent) | `beanies-logo-transparent.png` | Overlays, dark mode, colored backgrounds, sidebar |
| Spinner with text | `beanies-spinner.png` | Full loading screen |
| Spinner no text (opaque) | `beanies-spinner-no-text.png` | Inline loading on light backgrounds |
| Spinner no text (transparent) | `beanies-spinner-no-text-transparent.png` | Inline loading on dark/colored backgrounds |
| Watermark (opaque) | `beanies-watermark.png` | Footer watermark on light backgrounds |
| Watermark (transparent) | `beanies-watermark-transparent.png` | Footer watermark on dark/colored backgrounds |
| Celebration circle | `beanies-celebrating-circle.png` | Toast celebrations (auto-dismiss) |
| Celebration line | `beanies-celebrating-line.png` | Modal celebrations (with dismiss button) |
| Covering eyes | `beanies_covering_eyes_transparent_512x512.png` | Privacy/hidden state — replaces lock icons. Use wherever data is protected, hidden, or encrypted. |
| Open eyes | `beanies_open_eyes_transparent_512x512.png` | Visible/exposed state — replaces open-lock icons. Use wherever data is visible or unencrypted. |
| Impact bullet | `beanies_impact_bullet_transparent_192x192.png` | Bullet points, alerts, and flair. Use in place of list bullet markers, exclamation/warning icons, and anywhere a touch of beanie energy adds impact. Also suitable as a semi-transparent watermark. |

### Icon usage guide

| Situation | Asset to use |
|-----------|-------------|
| Privacy mode active (figures hidden) | `beanies_covering_eyes_transparent_512x512.png` |
| Privacy mode off (figures visible) | `beanies_open_eyes_transparent_512x512.png` |
| Data encrypted | `beanies_covering_eyes_transparent_512x512.png` |
| Data not encrypted / exposed | `beanies_open_eyes_transparent_512x512.png` |
| Feature bullet point | `beanies_impact_bullet_transparent_192x192.png` |
| Warning / alert / attention needed | `beanies_impact_bullet_transparent_192x192.png` |
| Watermark / background flair | `beanies_impact_bullet_transparent_192x192.png` at low opacity |

### Transparent vs Opaque selection

- **Transparent:** Use wherever the image overlays content, colored backgrounds, or dark mode surfaces (sidebar logo, header branding, celebration overlays, watermarks, dark mode)
- **Opaque:** Use for standalone display on white/light backgrounds (login hero, setup wizard, favicon source)

---

## The Pod Spinner

- Use `beanies-spinner-no-text-transparent.png` as the animated loading spinner
- Color order of the bean sequence: **Blue → Terracotta → Orange → Slate** (always)
- The beans spin; the loading text stays stationary
- Loading text: **"counting beans..."** (never "Loading...", never "Please wait")
- Footer watermark: `beanies-watermark-transparent.png` at low opacity

---

## UI Design — The Nook

- **Shape language:** Squircles — use high corner radius (`rounded-2xl`, `rounded-3xl`) on all buttons and cards. Never use sharp corners.
- **Shadows:** Soft Sky Silk `#AED6F1` tinted shadows to make the UI feel lightweight
- **Celebrations:** Punctuate happy moments with celebratory images or animations from `public/brand/`

### Border radius reference

| Component | Radius |
|-----------|--------|
| Buttons | `rounded-2xl` (1rem) |
| Cards | `rounded-2xl` or `rounded-3xl` (1.5rem) |
| Inputs, Selects | `rounded-xl` (0.75rem) |
| Modals | `rounded-3xl` (1.5rem) |
| Badges/chips | `rounded-full` |

### Shadows

```css
box-shadow: 0 4px 14px rgba(174, 214, 241, 0.3);    /* Light mode */
box-shadow: 0 4px 14px rgba(44, 62, 80, 0.4);        /* Dark mode */
```

### Focus rings

```css
/* Primary inputs/buttons */
ring-2 ring-[#AED6F1] ring-offset-2  /* Sky Silk ring */

/* Destructive buttons only */
ring-2 ring-red-300 ring-offset-2
```

### Component styling quick reference

```
BaseButton (primary):  bg-[#F15D22] hover:bg-[#D14D1A] text-white rounded-2xl
BaseButton (secondary): bg-[#2C3E50] hover:bg-[#1a252f] text-white rounded-2xl
BaseCard:              bg-white dark:bg-[#34495E] rounded-2xl shadow-sky-silk
BaseInput:             rounded-xl focus:ring-[#AED6F1]
BaseSelect:            rounded-xl focus:ring-[#AED6F1]
BaseModal:             rounded-3xl
Active nav item:       bg-orange-50 text-[#F15D22] border-l-[#F15D22]
Progress bars:         bg-[#F15D22]
```

---

## Celebration Triggers

| Trigger | Asset | Mode | Message |
|---------|-------|------|---------|
| Complete setup wizard | `beanies-celebrating-line.png` | Modal | "Setup complete — ready to start counting your beanies!" |
| First bank account | `beanies-celebrating-circle.png` | Toast | "Your first bean is planted!" |
| First transaction | `beanies-celebrating-circle.png` | Toast | "Every beanie counts!" |
| Goal reached 100% | `beanies-celebrating-line.png` | Modal | "Goal complete! The beanies are proud!" |
| First file save | `beanies-celebrating-circle.png` | Toast | "Your beanies are safe and encrypted!" |
| Debt goal paid off | `beanies-celebrating-line.png` | Modal | "Debt-free! The beanies are celebrating!" |

### Implementation pattern

- **Toast:** Bottom-center, auto-dismiss 4s, subtle bounce-in animation
- **Modal:** Centered overlay with image, congratulatory message, dismiss button
- Track "first time" events in localStorage to avoid repeating first-time celebrations
- Use a reusable `CelebrationOverlay.vue` component

---

## Brand Voice & Writing Style

### The five principles

1. **Simple** — Plain language over jargon. Say "Beans" not "Liquid Assets." Say "Money in" not "Net positive cash inflow."
2. **Friendly** — Warm and informal. Speak directly to the user ("your beans", "your family"). Avoid cold, clinical phrasing.
3. **Comforting** — Use warm greetings, celebrate milestones, acknowledge effort.
4. **Secure** — Warmth is backed by the promise of bank-grade local privacy. Never make the user feel exposed.
5. **Familiar** — Use names. Treat every activity as an investment in the family.

### Preferred phrasing

| Instead of | Say |
|-----------|-----|
| Loading... | counting beans... |
| Syncing... | Saving... |
| Sync File | Family Data File |
| File Sync | Family Data Options |
| Last Sync | Last Saved |
| Liquid Assets | Beans |
| Net Worth | Your bean count |
| Error saving | Hmm, we couldn't save your beans |

### Writing UI copy — checklist

- Does it feel warm and human?
- Does it use the user's name or family name where possible?
- Does it avoid "Alert Red" language (doom, error, fail) in favour of constructive framing?
- Does it celebrate progress, not just report it?
- Is it shorter than it needs to be? (Remove every word that doesn't add warmth or clarity.)

### Drawing images and illustrations

When generating or describing brand images:
- **The beanies characters** are round, simple, friendly bean shapes with hands
- The **parent bean** is blue/Sky Silk; the **child bean** is orange/Terracotta
- They always hold hands — never depicted separately
- Expressions are warm and celebratory — never stressed, never alarmed
- Background style: warm whites (`#FDFBF9`), soft gradients in the Sunrise Security palette
- **Never** depict the beanies with sharp angles, dark surroundings, or anxious expressions
- The upward arrow (momentum) should feel optimistic — a gentle curve upward, not a steep or aggressive spike

---

## Terminology (Enforced)

| Correct | Incorrect |
|---------|-----------|
| beanies.family | Beanies, beanies, Beanies Family, GP Family Planner, GP Family Finance |
| Every bean counts | Every Bean Counts, every bean counts. |
| Family Data File | Sync File |
| Family Data Options | File Sync |
| Last Saved | Last Sync |
| Saving... | Syncing... |
| counting beans... | Loading... |

---

## Tailwind Color Mapping (Find & Replace Guide)

| Old Pattern | New Pattern | Context |
|-------------|-------------|---------|
| `blue-600`, `blue-500` | Heritage Orange equiv | Primary actions |
| `blue-50`, `blue-100` | `orange-50` or Sky Silk bg | Background highlights |
| `from-blue-600 via-cyan-500 to-teal-500` | Brand gradient | Gradients |
| `red-*` (in alerts/notifications) | Heritage Orange | Non-error alerts |
| `red-*` (in form errors, delete buttons) | Keep `red-*` | Validation & destructive |
| `green-*` (income) | Keep `green-*` | Income indicators |

---

## Reference

- Full CIG: `docs/brand/beanies-cig.html`
- Brand assets: `public/brand/`
- Issue #22: Full rebranding task tracking
