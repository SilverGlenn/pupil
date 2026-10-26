# Pupil PH — Master Documentation, Curriculum & Engineering Specification Suite

Welcome to the **Pupil PH** project documentation repository. This package contains the complete research, pedagogical framework, UI/UX design system, word-for-word course materials, interactive game specifications, and technical architecture prepared for the software engineering team.

---

## 1. Project Overview & Core Requirements

**Pupil PH** is a fast, lightweight, offline-capable web application designed to teach **Tech Literacy**, **Basic English**, and **Typing** to students in the Philippines across four educational stages:
1. **Stage 1: Pre-School & Kindergarten (Ages 3–6)** — *Playful Touch UI (`playful`)*
2. **Stage 2: Lower Elementary (Grades 1–3)** — *Guided Story Cards UI (`guided`)*
3. **Stage 3: Upper Elementary (Grades 4–6)** — *Skill Builder Dashboard UI (`dashboard`)*
4. **Stage 4: Early High School (Grades 7–10)** — *Modern Studio UI (`studio`) + **"Start from Basics" (Foundations Bridge)** Toggle*

### Key Architectural & Pedagogical Pillars
- **Pure Simple English Only**: All UI strings, lessons, vocabulary definitions, stories, typing drills, and mini-games use **Pure Simple English** (zero Tagalog translations in the interface or lessons). Sentences are short, clear, and free of Western-only idioms while grounded in familiar Philippine contexts (mangoes, jeepneys, *sari-sari* stores, barangay community life, school computer labs, saving files before brownouts, and spotting fake prize/mobile load scams).
- **Dignity-First Design for Older Beginners**: High School learners with lower tech or English literacy use the sleek, mature **Modern Studio UI** (`#0F172A` dark slate aesthetic) and can toggle **"Start from Basics (Foundations Bridge)"** (`Alt + F` or header switch) to learn foundational mouse, keyboard, and basic English skills without childish graphics or lower-grade labels.
- **Kid-Friendly Authentication with Browser Persistence**:
  - **Teacher / Parent Portal**: Manage and create School/Family codes, create and manage student accounts, set/reset 4-digit numeric PINs, assign grade levels, and enable/disable High School "Start from Basics" mode.
  - **Student Login**: Students log in using their **School/Family Code**, **Student Name**, and a **4-Digit PIN** (`0000`–`9999`).
  - **Browser-Remembered Quick Login**: Both the active **School/Family Code** and **previously logged-in student account cards** are persisted in the browser (`localStorage` / `IndexedDB`) so returning kids on shared tablets or lab PCs can simply tap their saved name card and enter their 4-digit PIN on a giant touch keypad.
- **Optimized for Tablets & Low-Spec Laptops/PCs**: Strict bundle budget ($\le 120\text{ KB}$ gzipped JS, inline SVG illustrations, Web Speech API TTS + Web Audio API synthesized sound effects, 100% offline PWA caching, and 3-second brownout auto-save).

---

## 2. Repository Structure & Document Index

```
/home/siru/Projects/pupil/
├── README.md                                      # Master Handoff Index & Overview (this file)
├── docs/
│   ├── 01-research-and-pedagogy.md                # Target audience personas, DepEd MATATAG alignment, Simple English Style Guide, Dignity-First remediation
│   └── 02-ui-ux-and-interface-specs.md            # Complete UI/UX specs for all 4 Stage Interfaces, CSS custom properties, wireframes, and TTS rules
├── curriculum/
│   ├── 01-tech-literacy-curriculum.md             # 12 Modules (28 word-for-word lessons + quizzes) & specs for 5 Hands-On Tech Simulators
│   ├── 02-basic-english-curriculum.md             # 75 Vocabulary Cards, 30 Sentence Builder exercises, and 13 Short Stories with 39 comprehension MCQs
│   └── 03-typing-and-games-spec.md                # Dual-input Typing Tutor engine, 60 progressive Typing Drills (6 stages), and 4 Mini-Games specs
└── specs/
    ├── 01-system-architecture-and-auth.md         # School/Family Code + Name + 4-Digit PIN Auth, Browser Persistence, Teacher Portal, JSON Schemas & PWA specs
    └── 02-implementation-plan.md                  # Master 7-Phase Engineering Implementation Plan, 36-file target tree, and 14-point QA Matrix
```

---

## 3. Detailed Guide to Deliverables

### A. Research, Pedagogy & UI/UX Design (`docs/`)
1. **[`docs/01-research-and-pedagogy.md`](./docs/01-research-and-pedagogy.md)** *(474 lines)*
   - **Audience Profiles & Personas**: Detailed motor, cognitive, and tech baselines for Pre-K/Kinder (*Aya*), Grades 1–3 (*Joshua*), Grades 4–6 (*Bea*), and Grades 7–10 (*Mark*, late-starter remediation persona).
   - **Philippine Classroom Realities**: Hardware constraints (DepEd DCP Celeron/Atom PCs, 2GB RAM Android tablets), Piso-WiFi/shared connectivity, and the **3-second brownout auto-save protocol**.
   - **Controlled Simple English Style Guide**: Word budgets per sentence by stage, approved vs. disallowed lexicon, controlled technical glossary, and Philippine thematic contexts.
   - **Dignity-First Pedagogy**: Psychological rationale and transformation rules for the High School **Foundations Bridge** mode.

2. **[`docs/02-ui-ux-and-interface-specs.md`](./docs/02-ui-ux-and-interface-specs.md)** *(591 lines)*
   - **4 Adaptive Interfaces**:
     - *Stage 1: Playful Touch UI* (`64px–80px` touch targets, `180px` object cards, auto-playing voiceovers).
     - *Stage 2: Guided Story Cards UI* (`48px–56px` touch targets, dual-hand color-coded keyboard guide).
     - *Stage 3: Skill Builder Dashboard UI* (Two-column mission workspace, simulated desktop sandboxes).
     - *Stage 4: Modern Studio UI + Foundations Bridge* (Dark slate `#0F172A` IDE aesthetic, `JetBrains Mono`, seamless `Alt + F` Foundations toggle).
   - **Production CSS Custom Properties**: Complete `:root` CSS token dictionary for spacing, colors, typography (`Lexend` + `JetBrains Mono`), and stage themes.

---

### B. Complete Course Materials & Game Content Banks (`curriculum/`)
3. **[`curriculum/01-tech-literacy-curriculum.md`](./curriculum/01-tech-literacy-curriculum.md)** *(1,606 lines)*
   - **12 Complete Modules (28 Word-for-Word Lessons)** across Levels 1, 2, 3, Track 4A (High School Foundations Bridge), and Track 4B (High School Standard), complete with on-screen card copy, voiceover scripts, visual art descriptions, Philippine classroom tips, and multiple-choice quizzes with corrective feedback.
   - **5 Hands-On Interactive Tech Simulator Specifications**:
     1. *Simulator 1*: Screen Tap & Gentle Target Trainer
     2. *Simulator 2*: Mouse & Touchpad Action Trainer (Single-Click, Double-Click, Drag-and-Drop, Scroll)
     3. *Simulator 3*: Desktop File & Folder Sorter (`.docx`, `.pdf`, `.jpg`, `.mp3` + brownout save drill)
     4. *Simulator 4*: Keyboard Shortcut Interactive Sandbox (`Ctrl+C`, `Ctrl+V`, `Ctrl+Z`, `Ctrl+F`, `Ctrl+S`)
     5. *Simulator 5*: "Safe or Scam?" Message Inspector (Philippine SMS/chat phishing & OTP protection)

4. **[`curriculum/02-basic-english-curriculum.md`](./curriculum/02-basic-english-curriculum.md)** *(1,768 lines)*
   - **75 Complete Vocabulary Cards** (15 per track across Level 1, Level 2, Level 3, Track 4A HS Foundations, and Track 4B HS Standard) with ultra-simple definitions, example sentences, icon descriptions, and pronunciation guides.
   - **30 Interactive Sentence Builder Exercises** (6 per track) with ordered target word tiles, distractors, and context hints.
   - **13 Full Short Stories & Reading Passages** with **39 Multiple-Choice Comprehension Questions** and option-by-option feedback.

5. **[`curriculum/03-typing-and-games-spec.md`](./curriculum/03-typing-and-games-spec.md)** *(1,122 lines)*
   - **Dual-Input Typing Tutor Engine**: Physical keyboard (`keydown`) + Tablet On-Screen QWERTY Keyboard ($56\times 56\text{ px}$ hitboxes, 9 color-coded finger zones, animated left/right hand guide, stress-free WPM toggle).
   - **60 Complete Typing Drills across 6 Progressive Stages**: From *Stage 1: Letter & Vowel Discovery* and *Stage 2: Home Row (`ASDF JKL;`)* up to *Stage 6: File Names, Emails & Symbols*.
   - **4 Educational Mini-Games Specifications & Content Banks**:
     1. *Jeepney Word Express* (Vocabulary & Picture Match)
     2. *Falling Keys / Mango Catcher* (Keyboard/Touch Reflex Game — Golden Mangoes in younger modes vs. glowing Key Capsules in High School Studio mode)
     3. *Sentence Builder Scramble* (Syntax ordering puzzle with TTS read-aloud)
     4. *Tech Detective Challenge* (Target practice, File Sorter, and Safe vs. Scam Spotter)

---

### C. System Architecture, Authentication & Schemas (`specs/`)
6. **[`specs/01-system-architecture-and-auth.md`](./specs/01-system-architecture-and-auth.md)** *(713 lines)*
   - **Three-Pillar Authentication Flow**: School/Family Code + Student Name + 4-Digit Numeric PIN (`0000`–`9999`).
   - **Browser Persistence (`localStorage` / `IndexedDB`)**: Saves `pupil_active_school_code` and `pupil_remembered_students` so returning students tap their name card and enter their 4-digit PIN on a giant touch keypad without re-typing school codes or names.
   - **Teacher / Parent Portal Specification**: Full administrative workflows for managing school/family codes, student rosters, PIN resets, High School "Start from Basics" toggles, and progress analytics.
   - **TypeScript Interfaces & JSON Schemas**: Production schemas for `SchoolGroup`, `StudentAccount`, `RememberedStudentCard`, `RememberedBrowserState`, `UserProgress`, `Lesson`, `TypingDrill`, and `GameResult`.
   - **PWA Offline & Performance Specs**: Service Worker caching strategies, Web Audio API synthesis, Web Speech API TTS parameters, and tablet viewport rules.

7. **[`specs/02-implementation-plan.md`](./specs/02-implementation-plan.md)** *(830 lines)*
   - **Master Engineering Blueprint**: Stack selection (Vite 5 + React 18 + TypeScript 5 + zero-runtime CSS Custom Properties), strict hardware/bundle budgets ($\le 120\text{ KB}$ gzipped JS, $<80\text{ MB}$ RAM), and complete 36-file target source tree (`src/`).
   - **7-Phase Implementation Roadmap**: Step-by-step tasks and acceptance criteria from Phase 1 (Scaffolding, CSS tokens, Audio/Speech/Crypto/Brownout engines) through Phase 7 (Offline PWA Service Worker & 14-point QA Verification Matrix).
