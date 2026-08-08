# DISFRUTAR 2K26 Design System Architecture & Specifications

This document serves as the absolute single source of truth for the **DISFRUTAR 2K26 AI OS Boot Experience & Preloader**. It documents every color token, typographic scale, motion curve, particle physics formula, visual asset, layout parameter, component structure, and design guideline currently implemented in the codebase.

---

# 1. Project Overview

### Design Philosophy
The DISFRUTAR 2K26 preloader is engineered as an **AI Operating System Kernel Initialization (DISFRUTAR-OS v2.26)**. The aesthetic balances high-density engineering aesthetics, OLED cinematic depth, and fluid particle physics.

### Visual Identity
- **Primary Domain**: National 24-Hour AI Hackathon hosted by KARE ACM Student Chapter.
- **Tone & Atmosphere**: Premium, futuristic, high-tech, precise, OLED-optimized, luxury sci-fi.
- **Brand Palette**: Deep OLED Space Canvas (`#06080B`), KARE ACM Sky Blue (`#50A7D8`), Electric Cyan Glow (`#70C5F5`), and High-Contrast White (`#FFFFFF`).

### Experience Goals
1. **Immediate Visual Impact**: Seamless transition from an engineering telemetry HUD into an interactive 2,500-particle vector matrix.
2. **Zero-Lag Execution**: GPU-accelerated 60 FPS HTML5 Canvas animation with 2px crisp particle grid rasterization.
3. **Cinematic Progression**: An 8.0-second non-blocking timeline with mathematically calculated cubic easing curves and 3D character blur reveals.

---

# 2. Design Principles

### 1. Mathematical Precision
Every position, scale factor, and timing offset is derived from exact screen dimensions and physics equations (Cubic Bézier curves, radial distance formulas, and rotational vector transformations).

### 2. Engineering & Telemetry Aesthetic
UI elements avoid decorative "fluff" and mimic terminal interfaces, telemetry telemetry status displays, concentric radar rings, and hardware system monitors.

### 3. OLED Depth & Lighting Hierarchy
Visual depth is established through a multi-layered background system: 1200px ambient radial glow, 700px core illumination behind the hero logo, subtle 16px/64px engineering grid lines, and an edge vignette with 2% soft-light film grain to eliminate color banding.

### 4. Motion Choreography as Narrative
Motion is strictly sequential and functional. Each phase signals a hardware boot stage—from kernel initialization to particle convergence, logo materialization, elevation, presenter text reveal, title character staggered rise, and badge arrival.

### 5. Content-Centric Whitespace
Particles burst into a peripheral ambient starfield (160px–340px radius) the instant the HD logo materializes at `t = 3.7s`, completely clearing the center viewport to keep hero typography 100% legible.

---

# 3. Visual Language

- **Architectural Archetype**: Sci-Fi Operating System HUD / Luxury Technological Terminal.
- **Visual Texture**: Clean glassmorphism (`backdrop-blur-md`, `bg-white/[0.04]`), ultra-thin 1px borders with selective opacity (`border-[#50A7D8]/35`), and subtle drop shadows (`drop-shadow-[0_0_35px_rgba(80,167,216,0.55)]`).
- **Surface Composition**: Flat, high-contrast dark surfaces with zero saturated background fills. Depth comes exclusively from radial light falloff and edge vignettes.

---

# 4. Color System

### Primary & Brand Colors
| Token Name | Color Value | HEX / RGBA | Usage / Rules |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#06080B` | `rgb(6, 8, 11)` | Root viewport container background. |
| **Fallback Dark** | `#050505` | `rgb(5, 5, 5)` | HTML body fallback / scrollbar track. |
| **ACM Sky Blue** | `#50A7D8` | `rgb(80, 167, 216)` | Primary brand color, progress ring, borders, sparkles. |
| **Electric Sky Blue** | `#70C5F5` | `rgb(112, 197, 245)` | Gradient typography stop, header accent text. |
| **Pure White** | `#FFFFFF` | `rgb(255, 255, 255)` | Primary title, logo circle, primary text. |
| **Soft Light Blue** | `#E0F2FE` | `rgb(224, 242, 254)` | Secondary particle dust, text highlights. |

### Background & Surface Lighting Tokens
| Token Name | HEX / RGBA Value | Applied Parameters | Usage |
| :--- | :--- | :--- | :--- |
| **Upper Ambient Radial** | `rgba(100, 160, 255, 0.03)` | 1200px radius at `50% 35%` | Soft background depth. |
| **Center Ambient Light** | `rgba(80, 170, 255, 0.08)` | 700px radius at `50% 50%` | Radial illumination behind hero logo. |
| **Minor Grid Line** | `rgba(255, 255, 255, 0.03)` | 1px line, 16px stride | Engineering background grid. |
| **Major Grid Line** | `rgba(120, 180, 255, 0.05)` | 1px line, 64px stride | Every 4th grid line emphasis. |
| **Vignette Edge** | `rgba(0, 0, 0, 0.55)` | Radial gradient, 40% inner clear to 100% edge | Edge darkening & light falloff. |
| **Film Grain Noise** | SVG `<feTurbulence>` | `baseFrequency="0.8" numOctaves="3" opacity="0.02"` | Soft-light blend mode noise overlay. |

### Component Border & Glow Tokens
| Token Name | RGBA Value | Component Usage |
| :--- | :--- | :--- |
| **Track Ring** | `rgba(80, 167, 216, 0.15)` | Preloader HUD SVG track ring. |
| **Active Progress Ring** | `rgba(80, 167, 216, 1.0)` | Preloader HUD active SVG arc. |
| **HUD Terminal Border** | `rgba(80, 167, 216, 0.30)` | Terminal status telemetry badge. |
| **Logo Drop Shadow** | `rgba(80, 167, 216, 0.70)` | Filter drop-shadow `0 0 28px`. |
| **Title Glow** | `rgba(80, 167, 216, 0.55)` | Title text drop-shadow `0 0 35px`. |
| **Title Year Glow** | `rgba(80, 167, 216, 0.65)` | Year text drop-shadow `0 0 30px`. |
| **Pill Badge Border** | `rgba(80, 167, 216, 0.35)` | Subtitle pill badge border. |

---

# 5. Typography

### Font Families
- **Display Title Font**: `'Syne', sans-serif` (`.font-syne`) — Used for "DISFRUTAR 2K26" hero title.
- **Primary Body / UI Font**: `'Plus Jakarta Sans', sans-serif` (`.font-jakarta`) — Used for presenter headers, sub-badges, and general UI.
- **Secondary Branding Font**: `'Outfit', sans-serif` (`.font-outfit`) — Used for particle target matrix text sampling.
- **Monospace Font**: `font-mono` (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`) — Used for preloader progress numbers, terminal telemetry, and "PRESENTS" labels.

### Typography Hierarchy & Rules

| Element | Font Family | Size Range | Weight | Tracking | Case | Drop Shadow / Color |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title ("DISFRUTAR")** | `Syne` | `clamp(2.2rem, 6.5vw, 5.5rem)` | 900 (Black) | `-0.025em` (tight) | UPPERCASE | `#FFFFFF` with `drop-shadow-[0_0_35px_rgba(80,167,216,0.55)]` |
| **Hero Year ("2K26")** | `Syne` | `clamp(2.2rem, 6.5vw, 5.5rem)` | 900 (Black) | `-0.025em` (tight) | UPPERCASE | Gradient `from-[#50A7D8] via-[#70C5F5] to-white`, `drop-shadow-[0_0_30px_rgba(80,167,216,0.65)]` |
| **Presenter Header** | `Plus Jakarta Sans` | `11px` / `12px` / `14px` (`text-[11px] sm:text-xs md:text-sm`) | 700 (Bold) | `0.28em` (`tracking-[0.28em]`) | UPPERCASE | `#70C5F5` |
| **"PRESENTS" Label** | Monospace | `10px` / `12px` (`text-[10px] sm:text-xs`) | 900 (Black) | `0.60em` (`tracking-[0.6em]`) | UPPERCASE | `rgba(255, 255, 255, 0.8)` |
| **Subtitle Pill Badge** | `Plus Jakarta Sans` | `11px` / `12px` / `14px` (`text-[11px] sm:text-xs md:text-sm`) | 600 (SemiBold) | `0.22em` (`tracking-[0.22em]`) | UPPERCASE | `rgba(255, 255, 255, 0.9)` |
| **HUD Progress Number** | Monospace | `text-4xl sm:text-6xl` | 900 (Black) | Tight | N/A | Gradient `from-white via-white to-[#70C5F5]`, `drop-shadow-[0_0_20px_rgba(80,167,216,0.8)]` |
| **HUD Terminal Status** | Monospace | `text-xs` (12px) | 400 (Regular) | `0.05em` | UPPERCASE | `rgba(255, 255, 255, 0.9)` |

---

# 6. Spacing System

### Spacing Scale
The spacing system uses a standard 4px / 8px grid with specific vertical rhythm offsets for hero elements:

- `2px` (`0.125rem`): Minimum offset / dot gap / particle stride.
- `4px` (`0.25rem`): Micro gaps inside badges (`gap-1.5`).
- `8px` (`0.5rem`): Standard icon/text inline gaps (`gap-2`).
- `10px` (`0.625rem`): Distance between "KARE ACM STUDENT CHAPTER" and "PRESENTS".
- `12px` (`0.75rem`): Vertical translation offset during fade-in transitions (`translateY(12px)`).
- `16px` (`1.0rem`): Grid minor cell dimension (`16px x 16px`).
- `28px` (`1.75rem`): Vertical gap below elevated logo to top of text stack (`textStackTop`), and gap below hero title to subtitle badge (`marginTop: '28px'`).
- `36px` (`2.25rem`): Distance between "PRESENTS" and hero title `DISFRUTAR 2K26` (`marginTop: '36px'`).
- `64px` (`4.0rem`): Grid major cell dimension (`64px x 64px`).

---

# 7. Grid System

### Background Engineering Grid Structure
- **Pattern**: Dual overlay linear gradients with sub-pixel alignment.
- **Minor Cell Size**: `16px x 16px` using `rgba(255, 255, 255, 0.03)`.
- **Major Cell Size**: `64px x 64px` using `rgba(120, 180, 255, 0.05)` (every 4th line).
- **Positioning**: Absolute fixed inset spanning `100vw x 100vh` behind all UI layers.

### Layout Container Widths
- **Max Container Width**: `max-w-4xl` (`896px`) centered via `left-1/2 -translate-x-1/2`.
- **Responsive Padding**: `px-4` (`16px`) on mobile viewports.

---

# 8. Border System

### Thickness Tokens
- `1px`: Standard UI border thickness (terminal badge, subtitle pill badge, outer HUD ring).
- `3.0px`: SVG background track ring stroke width (`strokeWidth="3"`).
- `3.5px`: SVG active progress ring stroke width (`strokeWidth="3.5"`).

### Applied Border Styles
```css
/* Subtitle Pill Badge Border */
border: 1px solid rgba(80, 167, 216, 0.35);

/* Preloader Terminal Telemetry Border */
border: 1px solid rgba(80, 167, 216, 0.30);

/* Outer HUD Counter-Rotating Ring */
border: 1px dashed rgba(80, 167, 216, 0.25);
```

---

# 9. Corner Radius

| Radius Token | CSS Value | Applied Components |
| :--- | :--- | :--- |
| **Pill / Circular** | `rounded-full` (`9999px`) | Preloader HUD rings, terminal status badge, subtitle pill badge, pulsing shockwaves. |
| **Square Particle** | `0px` (`fillRect(x, y, 2, 2)`) | Particle rendering pixels (strict 2px x 2px squares). |

---

# 10. Shadows

| Shadow Token | Tailwind / CSS Value | Component |
| :--- | :--- | :--- |
| **Drop Shadow Sky Blue** | `drop-shadow-[0_0_28px_rgba(80,167,216,0.7)]` | KARE ACM Logo image element. |
| **Drop Shadow Title Disfrutar** | `drop-shadow-[0_0_35px_rgba(80,167,216,0.55)]` | "DISFRUTAR" white span text. |
| **Drop Shadow Title Year** | `drop-shadow-[0_0_30px_rgba(80,167,216,0.65)]` | "2K26" gradient span text. |
| **Drop Shadow HUD Counter** | `drop-shadow-[0_0_20px_rgba(80,167,216,0.8)]` | Percentage numbers `00`..`100`. |
| **Container Box Shadow** | `shadow-2xl`, `shadow-xl` | Floating terminal status badge & subtitle pill badge. |

---

# 11. Blur

| Blur Type | Value | Target Element |
| :--- | :--- | :--- |
| **Glassmorphism Backdrop Filter** | `backdrop-blur-md` (`12px`) | Preloader terminal status badge & subtitle pill badge. |
| **Ambient Logo Aura** | `filter: blur(26px)` | Radial glow aura behind fixed logo. |
| **HUD Core Glow** | `blur-lg` (`16px`) | Concentric ring radial core glow. |
| **Character Stagger Reveal Blur** | `0px` to `6px` (`filter: blur(${blur}px)`) | Title character dynamic entrance calculation (`(1 - eased) * 6px`). |

---

# 12. Icons

### Icon Library
- **Library**: `lucide-react`
- **Allowed Icons**:
  - `Activity`: Preloader HUD header indicator (`w-3.5 h-3.5 text-[#50A7D8] animate-pulse`).
  - `Terminal`: Preloader telemetry status indicator (`w-3.5 h-3.5 text-[#50A7D8] animate-pulse`).
  - `Sparkles`: Subtitle pill badge icon (`w-3.5 h-3.5 text-[#50A7D8] animate-pulse`).

### Usage Rules
- Stroke width: `2px` (default Lucide stroke).
- Icon dimension: `14px x 14px` (`w-3.5 h-3.5`).
- Color: `#50A7D8` with `animate-pulse`.

---

# 13. Components

### 1. `BootExperience`
- **Purpose**: Root orchestrator component driving the central animation timeline (`currentTime` state from `0.0s` to `8.0s` via `requestAnimationFrame`).
- **Layers**:
  1. Root Container (`bg-[#06080B]`).
  2. Background Radial Depth (`1200px` gradient).
  3. Center Ambient Light (`700px` gradient).
  4. Dual Engineering Grid.
  5. Vignette Layer (`55%` opacity).
  6. Film Grain Noise SVG.
  7. `PreloaderHUD` (`0.0s` to `2.2s`).
  8. `CanvasParticleSystem` (`0.0s` to `8.0s`).
  9. `HeroRevealSequence` (`3.7s` to `8.0s`).

### 2. `PreloaderHUD`
- **Purpose**: Telemetry radial progress ring and terminal status log active during Phase 1 (`0.0s` to `2.2s`).
- **Progress Math**: `progressPercent = min(100, floor((currentTime / 2.2) * 100))`.
- **Concentric Ring Dimensions**: `w-52 h-52 sm:w-64 sm:h-64` (`208px` / `256px`).
- **SVG Ring Parameters**: Radius `r = 72`, Circumference `2 * PI * 72 ≈ 452.39px`.

### 3. `CanvasParticleSystem`
- **Purpose**: HTML5 Canvas rendering 2,500 particles (High-Performance Mode) or 1,200 particles (Low-Performance Mode).
- **Particle Specifications**:
  - Geometry: `2px x 2px` solid squares (`fillRect`).
  - Colors: ACM Sky Blue (`rgba(80, 167, 216, 0.85)` / `rgba(56, 158, 211, 0.9)`), Crisp White (`rgba(255, 255, 255, 0.95)`), Light Sky Dust (`rgba(224, 242, 254, 0.9)`).
  - Allocation Groups:
    - Group 0 (Diamond Fill & Edge): 32%
    - Group 1 (Inner White Circle): 24%
    - Group 2 ("KARE" Text): 14%
    - Group 3 ("ACM" Text): 18%
    - Group 4 ("STUDENT CHAPTER" Text): 12%

### 4. `HeroRevealSequence`
- **Purpose**: Manages the materialization, elevation, and character-by-character 3D blur reveal of hero typography.
- **Sub-elements**:
  - Fixed KARE ACM Logo Image (`/acm_logo.png`) with bounding box calculated via `getParticleLogoBounds(w, h)`.
  - Presenter Header (`KARE ACM STUDENT CHAPTER` + `PRESENTS`).
  - Main Title (`DISFRUTAR` + `2K26`).
  - Subtitle Pill Badge (`24-HOUR NATIONAL AI HACKATHON`).

---

# 14. Motion System

### Master Timeline Choreography (0.0s to 8.0s)

```
0.0s ──── 1.0s ──── 2.2s ──── 2.6s ──── 3.7s ──── 4.5s ──── 5.3s ──── 5.9s ──── 6.6s ──── 8.0s
│         │         │         │         │         │         │         │         │         │
├─ Phase 1: Preloader HUD ───┤         │         │         │         │         │         │
│  (0.0s - 2.2s, Fades out 1.8s-2.2s)   │         │         │         │         │         │
│         │                   │         │         │         │         │         │         │
│         ├─ Phase 2: Vortex Spiral ────┤         │         │         │         │         │
│            (1.0s - 2.6s)              │         │         │         │         │         │
│                                       │         │         │         │         │         │
│                                       ├─ Phase 3: Particle Matrix ──┤         │         │
│                                          (2.6s - 3.7s)              │         │         │
│                                                                     │         │         │
│                                                                     ├─ Phase 4: Logo Image Appears ──┤
│                                                                        (3.7s - 4.5s at dead center)  │
│                                                                               │         │            │
│                                                                               ├─ Phase 5: Logo Elevation Sequence ──┤
│                                                                                  (4.5s - 5.3s: Scale 1.0 -> 0.42)   │
│                                                                                         │                    │
│                                                                                         ├─ Phase 6: Presenter Text ──┤
│                                                                                            (5.3s - 5.9s)             │
│                                                                                                   │                  │
│                                                                                                   ├─ Phase 7: Title 3D Stagger ──┤
│                                                                                                      (5.9s - 6.6s)               │
│                                                                                                             │                    │
│                                                                                                             ├─ Phase 8: Sub-Badge ──┤
│                                                                                                                (6.6s - 8.0s)       │
```

### Motion Easing Curves & Formulae
1. **Cubic Ease-Out (Logo Elevation & Character Rise)**:
   $$f(p) = 1 - (1 - p)^3$$
2. **Cubic Bézier Curve (Particle Spiral Convergence)**:
   $$B(t) = (1-t)^3 P_0 + 3(1-t)^2 t P_1 + 3(1-t) t^2 P_2 + t^3 P_3$$
3. **Character Stagger Formula**:
   - Base Delay for "DISFRUTAR": `5.9s`, Stagger: `0.03s` per char.
   - Base Delay for "2K26": `6.25s`, Stagger: `0.035s` per char.
   - Offset: $Y = (1 - \text{eased}) \times 20\text{px}$, Scale: $0.82 + \text{eased} \times 0.18$, Blur: $(1 - \text{eased}) \times 6\text{px}$.

---

# 15. Visual Effects

- **Particle Peripheral Burst**: At `t = 3.7s`, particles explode outward into an ambient starfield (`160px` to `340px` radius) with sinusoidal breathing alpha (`0.22 + sin((t - 3.7)*3)*0.1`).
- **Shockwave Energy Rings**: Canvas stroke rings expanding from center with decay (`alpha *= 0.95`, `radius += speed`).
- **OLED Film Grain**: SVG noise filter with `0.02` opacity overlaying the canvas in `soft-light` blend mode.

---

# 16. Accessibility

- **Motion Preference**: Layout handles static fallback if needed.
- **Color Contrast**: All primary text elements exceed WCAG AAA requirements (`#FFFFFF` and `#70C5F5` on `#06080B` canvas background).
- **Non-blocking Execution**: Interaction events are set to `pointer-events-none` on overlay elements so background pointer handling remains unobstructed.

---

# 17. Responsive Behaviour

- **Responsive Bounds Scale**: Logo scale is bounded via `Math.min(Math.max(minDim * 0.45, 260), 400)`.
- **Title Fluid Clamp**: `text-[clamp(2.2rem,6.5vw,5.5rem)]` prevents wrapping or overflow on screens down to 320px width.
- **DPR Scaling**: Canvas automatically scales for Retina displays (`devicePixelRatio` clamped between 1 and 2).

---

# 18. Component Hierarchy

```
BootExperience
├── Background Layer Stack
│   ├── Upper Ambient Radial Gradient (1200px)
│   ├── Center Ambient Light (700px)
│   ├── Dual Engineering Grid (16px / 64px)
│   ├── Edge Vignette (55% opacity)
│   └── Film Grain SVG Noise Filter
├── PreloaderHUD (Active 0.0s - 2.2s)
│   ├── SVG Concentric Progress Ring
│   ├── Outer Counter-Rotating Dashed Ring
│   ├── Inner Rotating Segmented Tech Ring
│   ├── Core Glow Pulse
│   ├── Percentage Display (00 - 100%)
│   └── Telemetry Terminal Status Badge
├── CanvasParticleSystem (Active 0.0s - 8.0s)
│   └── HTML5 Canvas 2D Context (2,500 particles)
└── HeroRevealSequence (Active 3.7s - 8.0s)
    ├── KARE ACM Fixed Bounding Logo
    │   ├── Radial Glow Aura
    │   ├── Pulsing Shockwave Ring
    │   └── KARE ACM Logo Image (/acm_logo.png)
    └── Hero Content Stack
        ├── Presenter Header (KARE ACM STUDENT CHAPTER)
        ├── PRESENTS Sub-label
        ├── Hero Title DISFRUTAR 2K26 (3D Character Stagger Spans)
        └── Subtitle Pill Badge (24-HOUR NATIONAL AI HACKATHON)
```

---

# 19. Design Tokens

```typescript
export const DESIGN_TOKENS = {
  colors: {
    bgCanvas: '#06080B',
    bgFallback: '#050505',
    acmSkyBlue: '#50A7D8',
    electricSkyBlue: '#70C5F5',
    pureWhite: '#FFFFFF',
    softLightBlue: '#E0F2FE',
  },
  typography: {
    fontSyne: "'Syne', sans-serif",
    fontJakarta: "'Plus Jakarta Sans', sans-serif",
    fontOutfit: "'Outfit', sans-serif",
    fontMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '28px',
    xl: '36px',
    gridMinor: '16px',
    gridMajor: '64px',
  },
  radii: {
    full: '9999px',
    square: '0px',
  },
  shadows: {
    logoDrop: '0 0 28px rgba(80, 167, 216, 0.7)',
    titleGlow: '0 0 35px rgba(80, 167, 216, 0.55)',
    yearGlow: '0 0 30px rgba(80, 167, 216, 0.65)',
    hudGlow: '0 0 20px rgba(80, 167, 216, 0.8)',
  },
  timing: {
    preloaderDuration: 2.2,
    masterDuration: 8.0,
    phaseTransitions: [0.0, 1.0, 2.0, 2.6, 3.7, 4.5, 5.3, 5.9, 6.6, 8.0],
  },
};
```

---

# 20. Naming Convention

- **Components**: PascalCase (e.g., `BootExperience`, `CanvasParticleSystem`, `PreloaderHUD`, `HeroRevealSequence`).
- **Files**: PascalCase for components (`.tsx`), camelCase for libraries and utilities (`logoTargets.ts`, `audioSynth.ts`).
- **Tailwind Utility Classes**: Explicit token classes (`font-syne`, `font-jakarta`, `bg-[#06080B]`, `text-[#70C5F5]`).

---

# 21. Do (40 Best Practices)

1. ✓ Always maintain `#06080B` as the primary background canvas color.
2. ✓ Always use exact pixel bounds from `getParticleLogoBounds(w, h)` for logo alignment.
3. ✓ Keep particle size strictly at `2px x 2px` squares in canvas rendering.
4. ✓ Ensure particles burst away into peripheral starfield when HD logo materializes at `t = 3.7s`.
5. ✓ Keep `pointer-events-none` on all HUD and sequence overlays.
6. ✓ Maintain `font-syne` for main title typography `DISFRUTAR 2K26`.
7. ✓ Maintain `font-jakarta` for presenter text and subtitle badge text.
8. ✓ Use `font-mono` for all preloader percentage displays and telemetry text.
9. ✓ Keep exact cubic ease-out `1 - Math.pow(1 - p, 3)` for elevation and character reveals.
10. ✓ Ensure responsive fluid font clamp `clamp(2.2rem, 6.5vw, 5.5rem)` on main title.
11. ✓ Maintain `#50A7D8` for brand sky blue accent borders and badges.
12. ✓ Maintain `#70C5F5` for highlight text and gradient text stops.
13. ✓ Keep 10px top margin between presenter header and `PRESENTS` label.
14. ✓ Keep 36px top margin between `PRESENTS` label and `DISFRUTAR 2K26` title.
15. ✓ Keep 28px top margin between title and subtitle pill badge.
16. ✓ Keep 28px top margin between elevated logo bottom edge and text stack top.
17. ✓ Use `backdrop-blur-md` on glassmorphism badges.
18. ✓ Use `animate-pulse` on Lucide icons in HUD and badges.
19. ✓ Keep particle count at 2,500 in high performance mode.
20. ✓ Keep particle count at 1,200 in low performance mode.
21. ✓ Ensure SVG stroke dashoffset smoothly tracks `progressPercent`.
22. ✓ Maintain 700px radius center ambient light behind hero logo.
23. ✓ Maintain 1200px radius upper ambient light gradient.
24. ✓ Maintain 55% opacity vignette on screen edges.
25. ✓ Maintain 2% soft-light SVG film grain noise.
26. ✓ Ensure minor engineering grid lines are rendered at `16px` stride with `0.03` opacity.
27. ✓ Ensure major engineering grid lines are rendered at `64px` stride with `0.05` opacity.
28. ✓ Keep character stagger delay at `0.03s` per character for "DISFRUTAR".
29. ✓ Keep character stagger delay at `0.035s` per character for "2K26".
30. ✓ Maintain 3D character blur animation starting from 6px blur down to 0px.
31. ✓ Maintain character Y translation offset starting from +20px up to 0px.
32. ✓ Keep character initial scale at 0.82 expanding to 1.0.
33. ✓ Keep logo scale reduction from 1.0 down to 0.42 during elevation phase.
34. ✓ Keep logo elevation distance between 140px and 190px based on screen height (`h * 0.22`).
35. ✓ Ensure preloader HUD smoothly fades out between `1.8s` and `2.2s`.
36. ✓ Keep Web Audio synth fallback muted by default until user interaction.
37. ✓ Maintain clean zero-margin container alignments using `left-1/2 -translate-x-1/2`.
38. ✓ Use `drop-shadow-[0_0_28px_rgba(80,167,216,0.7)]` on logo image element.
39. ✓ Keep `object-contain` on KARE ACM logo image tag.
40. ✓ Always run `lint_applet` and `compile_applet` to verify zero TypeScript or syntax regressions.

---

# 22. Don't (40 Prohibited Practices)

1. ✗ Don't change `#06080B` background color to pure `#000000` or grey.
2. ✗ Don't add floating debug HUD panels or telemetry header bars back to the UI.
3. ✗ Don't add playback sliders, transport controls, or bottom control docks.
4. ✗ Don't re-introduce a "REPLAY BOOT" button or floating overlay.
5. ✗ Don't change particle rendering shape from 2px square to rounded circles.
6. ✗ Don't increase particle size beyond 2px.
7. ✗ Don't modify master timeline duration from 8.0 seconds.
8. ✗ Don't alter preloader phase thresholds (`2.2s`, `2.6s`, `3.7s`, `4.5s`, `5.3s`, `5.9s`, `6.6s`).
9. ✗ Don't mix unapproved font families like Inter or Arial.
10. ✗ Don't remove the character-by-character stagger animation on "DISFRUTAR 2K26".
11. ✗ Don't remove drop shadows from hero typography.
12. ✗ Don't use saturated neon colors (e.g. bright green, magenta, hot pink).
13. ✗ Don't remove the 2% film grain SVG overlay.
14. ✗ Don't remove the 55% edge vignette layer.
15. ✗ Don't replace Lucide icons with custom SVGs.
16. ✗ Don't allow text inside pills or badges to wrap onto multiple lines.
17. ✗ Don't change the logo elevation destination scale from 0.42.
18. ✗ Don't remove the ambient radial aura behind the hero logo.
19. ✗ Don't remove the shockwave energy ring during logo materialization at `t = 3.7s`.
20. ✗ Don't change the engineering grid dimensions (must remain 16px and 64px).
21. ✗ Don't use full-screen solid modal backdrops.
22. ✗ Don't apply heavy drop shadows with spread larger than 35px.
23. ✗ Don't add secondary navigation drawers or tab bars.
24. ✗ Don't hardcode fixed font pixel sizes on main title without fluid `clamp()`.
25. ✗ Don't alter the particle allocation group ratios (32% Diamond, 24% Circle, etc.).
26. ✗ Don't remove the 3D blur effect from text character entrance transitions.
27. ✗ Don't disable retina DPR scaling in canvas setup.
28. ✗ Don't remove `user-select: none` from global body style.
29. ✗ Don't introduce external audio assets or MP3 dependencies.
30. ✗ Don't modify the KARE ACM Sky Blue HEX `#50A7D8`.
31. ✗ Don't modify the Electric Sky Blue HEX `#70C5F5`.
32. ✗ Don't add background video or canvas video overlays.
33. ✗ Don't remove `pointer-events-none` from animation overlays.
34. ✗ Don't shift hero content alignment away from horizontal center.
35. ✗ Don't remove the counter-rotating dashed ring from the preloader HUD.
36. ✗ Don't remove the terminal telemetry status bar during preloader phase.
37. ✗ Don't create nested cards or bordered containers inside the hero area.
38. ✗ Don't use uppercase transformation on title text spans dynamically—keep raw text uppercase.
39. ✗ Don't alter the `getParticleLogoBounds` bounding diamond ratio (0.46 * scale).
40. ✗ Don't introduce unrequested external libraries or state management frameworks.

---

# 23. Avoid (50 Common Mistakes)

1. Avoid flat `#000000` backgrounds without depth layers.
2. Avoid color banding on dark gradients (always maintain SVG grain).
3. Avoid overlapping particles behind hero text after `t = 3.7s`.
4. Avoid layout shift during logo elevation from center to header.
5. Avoid inconsistent letter spacing across uppercase headers.
6. Avoid missing fallback font definitions in CSS utilities.
7. Avoid incorrect canvas scaling on mobile high-DPI screens.
8. Avoid non-integer pixel rendering in `fillRect` calls.
9. Avoid skipping heading levels or mixing font weights randomly.
10. Avoid overly bright background glows that compete with hero text.
11. Avoid hard edges on radial background gradients.
12. Avoid re-rendering React hooks conditionally inside components.
13. Avoid state updates directly inside canvas animation render loops.
14. Avoid missing dependencies in `useMemo` or `useCallback` hook arrays.
15. Avoid hardcoded viewport pixel heights (`window.innerHeight - 200`).
16. Avoid adding horizontal scrollbars during character 3D scale transforms.
17. Avoid text truncation on subtitle pill badges.
18. Avoid mismatched border-radius between inner elements and outer pills.
19. Avoid inconsistent icon sizes (always stick to `14px` / `w-3.5 h-3.5`).
20. Avoid noisy or erratic particle velocity values.
21. Avoid removing the 28px gap between elevated logo and text stack.
22. Avoid altering the 10px spacing below "KARE ACM STUDENT CHAPTER".
23. Avoid altering the 36px spacing above "DISFRUTAR 2K26".
24. Avoid removing `font-syne` from main title text.
25. Avoid removing `font-jakarta` from presenter header.
26. Avoid removing `font-mono` from HUD progress text.
27. Avoid unhandled canvas context loss during browser resize.
28. Avoid missing `alt` attributes on `/acm_logo.png` image tags.
29. Avoid non-transparent background fills on SVG progress rings.
30. Avoid using `import type` for enum imports in TypeScript.
31. Avoid inline CSS style blocks where Tailwind classes exist.
32. Avoid modifying `package.json` build scripts unless required.
33. Avoid removing `selection:bg-[#50A7D8]` custom text selection color.
34. Avoid using heavy blur values (>30px) that cause GPU frame drops on mobile.
35. Avoid hardcoded particle target arrays without screen dimension context.
36. Avoid mixing linear easing with cubic easing curves in the same sequence.
37. Avoid duplicate IDs on SVG filter elements.
38. Avoid unclipped overflow on root container elements.
39. Avoid breaking rules of hooks during early returns in sequence components.
40. Avoid changing the title gradient color stops (`from-[#50A7D8] via-[#70C5F5] to-white`).
41. Avoid setting canvas CSS dimensions without pixel unit strings.
42. Avoid removing the `animate-pulse` utility on status icons.
43. Avoid changing the preloader ring radius (`r = 72`).
44. Avoid changing the preloader ring stroke width (`3.5px`).
45. Avoid missing `key` props on character stagger text spans.
46. Avoid adding redundant padding to fixed overlay wrappers.
47. Avoid dropping Web Audio synthesis exception handling guards.
48. Avoid removing `tracking-[0.6em]` from `PRESENTS` label.
49. Avoid removing `tracking-[0.28em]` from presenter header.
50. Avoid removing `tracking-[0.22em]` from subtitle badge.

---

# 24. Future Development Rules

All future screens, modules, or features built for DISFRUTAR 2K26 MUST adhere to these mandatory integration rules:

1. **Token Reuse**: All UI elements must directly reference the established design tokens (`#06080B`, `#50A7D8`, `#70C5F5`, `font-syne`, `font-jakarta`, `font-mono`).
2. **Background Continuity**: Any new page or modal must overlay the same depth background system (`1200px` radial depth, `700px` center ambient light, `16px`/`64px` engineering grid, `55%` vignette, and `2%` film grain).
3. **Glassmorphism Consistency**: Surface containers must use `bg-white/[0.04]`, `border border-[#50A7D8]/35`, and `backdrop-blur-md`.
4. **Typographic Alignment**: Titles must use `font-syne`, UI labels and headers must use `font-jakarta`, and telemetry/data values must use `font-mono`.
5. **Icon Continuity**: Icons must be imported strictly from `lucide-react`, rendered at `14px` (`w-3.5 h-3.5`), styled in `#50A7D8`, and utilize subtle pulse or glow animations where appropriate.

---

# 25. AI Coding Rules

When generating or modifying code for this project, AI coding assistants MUST strictly obey the following directives:

1. **Zero Spacing/Color Inventions**: Never invent new arbitrary HEX colors, margin values, or font sizes. Re-use existing design tokens and Tailwind utility patterns.
2. **Preserve Master Animation Timeline**: Do not alter `currentTime` thresholds or durations in `BootExperience.tsx`, `CanvasParticleSystem.tsx`, or `HeroRevealSequence.tsx`.
3. **Hook Order Protection**: Always declare all React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`) at the top level before any conditional `if` return statements to avoid React Rules of Hooks violations.
4. **No Debug Overlay Restoration**: Never restore development HUD bars, FPS indicators, playback control docks, or replay buttons unless explicitly instructed by the user.
5. **Surgical Edits**: Make minimal, targeted file edits and run `lint_applet` and `compile_applet` after edits to verify zero compilation errors.
