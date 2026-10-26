# Pupil PH — Typing Curriculum & Mini-Games Engineering Specification
**Document ID:** `CURR-03-TYPING-GAMES`  
**Version:** 1.0.0  
**Target Platform:** Web (Tablets: iPadOS, Android; Laptops/Desktops: Windows, macOS, ChromeOS)  
**Language Rule:** Pure Simple English Only (Relatable Philippine Cultural & School Contexts; No Tagalog Translations)

---

## 1. Executive Summary & Pedagogical Foundation

### 1.1 Purpose & Scope
This specification defines the interactive **Typing Tutor Module** and **Four Educational Mini-Games** for the **Pupil PH** platform. Pupil PH is designed specifically for Filipino students across four broad learning stages:
1. **Pre-School & Kindergarten** (Ages 4–6)
2. **Lower Elementary** (Grades 1–3, Ages 6–9)
3. **Upper Elementary** (Grades 4–6, Ages 9–12)
4. **Early High School** (Grades 7–10, Ages 12–16) — including an adaptive **"Start from Basics"** foundational pathway.

Because many Philippine public and private schools utilize shared computer laboratories (desktop/laptop PCs) and shared tablet carts (Android and iPad devices), this module delivers an identical high-tier learning experience across both **physical hardware keyboards** and **responsive on-screen touch keyboards**.

### 1.2 Core Pedagogical Principles

```
           ┌───────────────────────────────────────────────┐
           │        PUPIL PH TYPING PEDAGOGY               │
           └───────────────────────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
 ┌───────────────┐         ┌───────────────┐         ┌───────────────┐
 │ ACCURACY OVER │         │  ZERO-ANXIETY │         │  AGE-DIGNIFIED│
 │ SPEED (WPM)   │         │ SOUND & VISION│         │    SKINNING   │
 └───────────────┘         └───────────────┘         └───────────────┘
  • No countdown clocks     • Gentle chime on hit     • High schoolers
  • Hidden WPM by default   • Soft wooden thud on     • Get "Studio Mode"
  • Rhythm before velocity    miss (no loud buzz)       no baby graphics
```

1. **Accuracy First, Rhythm Second, Velocity Last**:
   - For young learners and high school beginners, counting Words Per Minute (WPM) introduces panic, tension, and hunt-and-peck bad habits.
   - The primary success metric across all stages is **Keystroke Accuracy Percentage** ($Acc \ge 90\%$) and **Smooth Rhythmic Cadence**.
   - WPM is **hidden by default** on beginner stages. A clean toggle switch (`"Show Typing Speed"`) allows teachers or advanced students to reveal WPM only when ready.
2. **Stress-Free Audio-Visual Reinforcement**:
   - *Correct Keystroke*: Plays a crisp, gentle pentatonic chime synthesized in real-time via the Web Audio API (never annoying, zero external sound download).
   - *Incorrect Keystroke*: The target key pulses gently in soft amber/coral; an unobtrusive wooden thud sounds. There are no harsh error buzzers, red flashing screens, or failure horns.
   - *Streak Rewards*: Subtle sparkle animations and small star increments every 5 consecutive accurate keystrokes.
3. **Adaptive Visual Skinning for High School Dignity**:
   - An adolescent in Grade 8 who does not know how to type must **never** be subjected to cartoonish kindergarten graphics, bouncing baby animals, or childish labels.
   - When a student is flagged as **High School ("Start from Basics")**, the tutor displays the foundational drills (Stages 1–6) inside the **"Studio Mode" UI**: clean obsidian/slate dark theme, neon-accented Key Capsules, refined typography, and neutral stage labels (`"Foundations 1: Keystroke Mechanics"`, `"Foundations 2: Home Row Control"`).

---

## 2. Dual-Input Architectural Design

```
+-------------------------------------------------------------------------+
|                         PUPIL PH TYPING ENGINE                          |
+-------------------------------------------------------------------------+
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌─────────────────────────────────┐         ┌─────────────────────────────────┐
│     PHYSICAL KEYBOARD INPUT     │         │   TABLET ON-SCREEN KEYBOARD     │
├─────────────────────────────────┤         ├─────────────────────────────────┤
│ • Window 'keydown' listener     │         │ • High-performance SVG grid     │
│ • 'event.key' mapping           │         │ • 56px minimum touch targets    │
│ • PreventDefault on Space/Tab   │         │ • Color-coded finger zones      │
│ • Shift key dual-detection      │         │ • Animated Left/Right hand rigs │
│ • Physical tactile key mirror   │         │ • Web Vibration API haptics     │
└─────────────────────────────────┘         └─────────────────────────────────┘
```

### 2.1 Physical Keyboard Specification (Laptops & Desktop PCs)
- **Event Listener**: Global `keydown` event bound to `window` with active module focus trapping.
- **Key Capture**: Read `event.key`. Special handling:
  - `Space`: Calls `event.preventDefault()` to stop browser page scrolling.
  - `Backspace`: Allowed only if the student makes an error on the immediate current character; does not allow clearing already-validated correct historical characters.
  - `Tab`, `Escape`, `F1-F12`: Suppressed during drill execution to prevent accidental navigation.
- **Physical Key Mirroring**: As the user types on their real keyboard, the on-screen virtual keyboard highlights the exact key pressed in real-time, validating finger placement.

### 2.2 Tablet On-Screen QWERTY Keyboard Specification
- **Component**: Custom SVG/CSS flexbox grid rendered above or below the target text depending on tablet orientation (Landscape primary; Portrait secondary).
- **Touch Target Dimensions**: Minimum $56 \times 56\text{ px}$ per alphanumeric key; Spacebar minimum $240 \times 56\text{ px}$.
- **Touch Handling**: `touch-action: manipulation` applied to container to eliminate mobile 300ms tap delay and block accidental double-tap zoom.
- **Haptic Feedback**: Triggers `navigator.vibrate(15)` on touch devices supporting the HTML5 Vibration API.

### 2.3 Color-Coded Finger Zones & Visual Hand Guide
Each key on the on-screen keyboard belongs to an immutable finger assignment zone:

| Finger Name | Hand | Key Mapping | Design Color Token | Visual Accent |
|:---|:---|:---|:---|:---|
| **Left Pinky** | Left | `~`, `!`, `1`, `Q`, `A`, `Z`, `Left Shift`, `Caps` | `hsl(340, 82%, 65%)` | Soft Coral / Rose |
| **Left Ring** | Left | `@`, `2`, `W`, `S`, `X` | `hsl(28, 90%, 62%)` | Tangerine Orange |
| **Left Middle** | Left | `#`, `3`, `E`, `D`, `C` | `hsl(45, 95%, 55%)` | Sunny Yellow / Amber |
| **Left Index** | Left | `$`, `%`, `4`, `5`, `R`, `T`, `F`, `G`, `V`, `B` | `hsl(160, 70%, 45%)` | Emerald Green |
| **Thumbs** | Both | `Spacebar` | `hsl(210, 20%, 65%)` | Neutral Slate |
| **Right Index** | Right | `^`, `&`, `6`, `7`, `Y`, `U`, `H`, `J`, `N`, `M` | `hsl(190, 85%, 45%)` | Ocean Cyan |
| **Right Middle** | Right | `*`, `8`, `I`, `K`, `< `, `,` | `hsl(215, 85%, 60%)` | Sky Blue |
| **Right Ring** | Right | `(`, `9`, `O`, `L`, `>`, `.` | `hsl(260, 75%, 65%)` | Soft Lavender |
| **Right Pinky** | Right | `)`, `_`, `+`, `0`, `-`, `=`, `P`, `{`, `}`, `[`, `]`, `\|`, `\`, `:`, `;`, `"`, `'`, `?`, `/`, `Enter`, `Right Shift` | `hsl(300, 70%, 62%)` | Magenta / Orchid |

#### Visual Hand & Finger Indicator
- Two stylized hands (Left Hand and Right Hand) sit directly beneath the keyboard.
- When the target character is `F`, the **Left Index Finger** pulses with an animated glowing dot matching the Emerald Green color token.
- When the target character requires `Shift` (e.g., capital `A`), the **Right Pinky** highlights on `Right Shift` while the **Left Pinky** highlights on `A`.

---

## 3. Adaptive UI Skinning Specifications

| UI Token / Attribute | Playful Mode (Pre-K / Kinder) | Guided Mode (Grades 1–3) | Dashboard Mode (Grades 4–6) | Studio Mode (Early High School / "Start from Basics") |
|:---|:---|:---|:---|:---|
| **Color Theme** | Cream background (`#FFFDF7`), sky blues, warm sun accents | Clean slate white (`#F8FAFC`), indigo headers, royal blue keys | Crisp cool slate (`#F1F5F9`), cobalt blue (`#1D4ED8`) & cyan accents | Dark charcoal/obsidian (`#0F172A`), midnight slate (`#1E293B`), electric cyan (`#06B6D4`) |
| **Key Styling** | 3D pill-shaped buttons with rounded drop-shadows | Crisp flat keys with clean 2px borders | Structured rectangular keys with shortcut badges | Sleek Key Capsules with subtle inner glow and monospaced typography |
| **Mascot / Guide** | "Bibo" the friendly Philippine Tarsier with big welcoming eyes | "Cap" the energetic Laptop Guide | Clean Mission Badge Icon | Minimalist circular wave/audio pulse icon (Zero animal cartoons) |
| **Stage Title** | *"Fun Keys 1: Letter Hunt!"* | *"Level 1: Letter & Vowel Basics"* | *"Module 1: Keystroke & Home Row Lab"* | *"Foundations 1: Letter Discovery & Keystrokes"* |
| **Audio Tone** | High marimba / toy glockenspiel chimes | Clean kalimba acoustic chime | Crisp mechanical key tick | Subdued low-pass synthesizer chime |
| **Speed Metric** | Hidden entirely; displays golden bananas/stars | Optional toggle switch; displays stars & accuracy % | Displays Accuracy % and optional WPM toggle | Displays Accuracy %, Rhythmic Flow indicator, and optional WPM toggle |

---

## 4. Complete Typing Drill Content Bank (6 Stages)

Each stage contains **10 fully articulated drills**. Every drill includes:
- `drillId`: Unique system identifier
- `title`: Age-dignified drill title
- `targetText`: Exact text the student must type
- `focusKeys`: Keys trained in this drill
- `pedagogicalGoal`: Skill objective
- `promptInstruction`: Pure Simple English on-screen instruction
- `ttsPrompt`: Web Speech text read aloud when student taps "Listen"

---

### Stage 1: Letter & Vowel Discovery (Pre-K / Absolute Beginners)
*Goal: Familiarize fingers with individual letter locations without punishment. Focus on vowels and anchor consonants.*

#### Drill 1.1: The Sunny Vowels
- **drillId**: `type-s1-d01`
- **title**: First Vowels A and O
- **focusKeys**: `["a", "o", " "]`
- **targetText**: `a a o o a o a o aa oo`
- **pedagogicalGoal**: Find the left pinky vowel A and right ring vowel O.
- **promptInstruction**: Find the letters A and O. Press each letter gently. Use Space between letters.
- **ttsPrompt**: Let us type the vowels A and O. Press Space with your thumb.

#### Drill 1.2: Vowel Friends E and I
- **drillId**: `type-s1-d02`
- **title**: Middle Vowels E and I
- **focusKeys**: `["e", "i", " "]`
- **targetText**: `e e i i e i e i ee ii`
- **pedagogicalGoal**: Reach left middle finger up to E and right middle finger up to I.
- **promptInstruction**: Reach up to type E and I. Use your middle fingers.
- **ttsPrompt**: Good job. Now type the letters E and I. Press Space to move forward.

#### Drill 1.3: The Happy Vowel U
- **drillId**: `type-s1-d03`
- **title**: Vowel U Reach
- **focusKeys**: `["u", "a", " "]`
- **targetText**: `u u a a u a u a uu aa`
- **pedagogicalGoal**: Coordinate right index reaching up to U with left pinky on A.
- **promptInstruction**: Use your right index finger for U. Use your left pinky for A.
- **ttsPrompt**: Type letter U and letter A. Take your time.

#### Drill 1.4: All Five Vowels
- **drillId**: `type-s1-d04`
- **title**: Vowel Rainbow
- **focusKeys**: `["a", "e", "i", "o", "u", " "]`
- **targetText**: `a e i o u a e i o u aeiou`
- **pedagogicalGoal**: Sequential vowel muscle memory across both hands.
- **promptInstruction**: Type all five vowels in order: A, E, I, O, U.
- **ttsPrompt**: Type the five vowels: A, E, I, O, U. You can do it!

#### Drill 1.5: Friendly Consonants M and S
- **drillId**: `type-s1-d05`
- **title**: Letters M and S
- **focusKeys**: `["m", "s", " "]`
- **targetText**: `m m s s m s m s am is`
- **pedagogicalGoal**: Right index down to M, left ring resting on S.
- **promptInstruction**: Left ring finger taps S. Right index finger taps M.
- **ttsPrompt**: Press S with your left ring finger. Press M with your right index finger.

#### Drill 1.6: Tapping Letters T and B
- **drillId**: `type-s1-d06`
- **title**: Letters T and B
- **focusKeys**: `["t", "b", " "]`
- **targetText**: `t t b b t b t b at bat`
- **pedagogicalGoal**: Left index reach upward to T and downward to B.
- **promptInstruction**: Reach your left index finger up for T and down for B.
- **ttsPrompt**: Use your left index finger to type T and B.

#### Drill 1.7: Letters P and N
- **drillId**: `type-s1-d07`
- **title**: Letters P and N
- **focusKeys**: `["p", "n", " "]`
- **targetText**: `p p n n p n p n pan pen`
- **pedagogicalGoal**: Right pinky reach to P; right index downward reach to N.
- **promptInstruction**: Reach your right pinky up for P. Reach your right index down for N.
- **ttsPrompt**: Right pinky reaches for P. Right index reaches for N.

#### Drill 1.8: Two-Letter Words Set 1
- **drillId**: `type-s1-d08`
- **title**: First Mini Words
- **focusKeys**: `["a", "m", "t", "i", "s", " "]`
- **targetText**: `am at is it am at is it`
- **pedagogicalGoal**: Combining trained letters into real English two-letter sight words.
- **promptInstruction**: Type the short words: am, at, is, it. Remember to press Space!
- **ttsPrompt**: Now we can make words! Type: am, at, is, it.

#### Drill 1.9: Two-Letter Words Set 2
- **drillId**: `type-s1-d09`
- **title**: More Mini Words
- **focusKeys**: `["o", "n", "u", "p", "g", " "]`
- **targetText**: `on up go no on up go no`
- **pedagogicalGoal**: Bilateral coordination between left and right hands.
- **promptInstruction**: Type the words: on, up, go, no. Press Space once after each word.
- **ttsPrompt**: Type: on, up, go, no. Keep your fingers resting on the keyboard.

#### Drill 1.10: Stage 1 Master Challenge
- **drillId**: `type-s1-d10`
- **title**: First Steps Celebration
- **focusKeys**: `["a", "b", "c", "d", "e", "m", "p", "t", "s", " "]`
- **targetText**: `a cat a bat a mat a pet`
- **pedagogicalGoal**: Fluid reading and typing of simple 3-letter English words.
- **promptInstruction**: Great job! Type these simple phrases with confidence.
- **ttsPrompt**: You are doing amazing. Type: a cat, a bat, a mat, a pet.

---

### Stage 2: Home Row Foundation (`A S D F` / `J K L ;` and `G H`)
*Goal: Instill the bedrock of touch typing: resting fingers on the home row and finding the tactile bumps on F and J.*

```
LEFT HAND                         RIGHT HAND
[A] [S] [D] [F]  [G]       [H]   [J] [K] [L] [;]
 |   |   |   |    |         |     |   |   |   |
 P   R   M   I    I         I     I   M   R   P
 (Pinky, Ring, Middle, Index)
```

#### Drill 2.1: Left Hand Home Base
- **drillId**: `type-s2-d01`
- **title**: Left Home Keys A S D F
- **focusKeys**: `["a", "s", "d", "f", " "]`
- **targetText**: `aaaa ssss dddd ffff asdf asdf`
- **pedagogicalGoal**: Establish left hand home positions. Left index rests on the bump of F.
- **promptInstruction**: Rest four fingers on A, S, D, and F. Feel the tiny bump on key F with your index finger.
- **ttsPrompt**: Place your left fingers on A, S, D, and F. Feel the small bump on key F.

#### Drill 2.2: Right Hand Home Base
- **drillId**: `type-s2-d02`
- **title**: Right Home Keys J K L Semicolon
- **focusKeys**: `["j", "k", "l", ";", " "]`
- **targetText**: `jjjj kkkk llll ;;;; jkl; jkl;`
- **pedagogicalGoal**: Establish right hand home positions. Right index rests on the bump of J.
- **promptInstruction**: Rest four fingers on J, K, L, and semicolon. Feel the tiny bump on key J.
- **ttsPrompt**: Place your right fingers on J, K, L, and semicolon. Feel the bump on key J.

#### Drill 2.3: Both Hands Together
- **drillId**: `type-s2-d03`
- **title**: Both Hands Meeting
- **focusKeys**: `["a", "s", "d", "f", "j", "k", "l", ";", " "]`
- **targetText**: `asdf jkl; asdf jkl; a; s l d k f j`
- **pedagogicalGoal**: Simultaneous bilateral finger awareness without looking at hands.
- **promptInstruction**: Keep all eight fingers resting gently on the home row. Type each pair smoothly.
- **ttsPrompt**: Both hands work together. Keep fingers on the home keys.

#### Drill 2.4: The Center Keys G and H
- **drillId**: `type-s2-d04`
- **title**: Reaching for G and H
- **focusKeys**: `["f", "g", "h", "j", " "]`
- **targetText**: `fgf fgf jhj jhj fghj fghj`
- **pedagogicalGoal**: Stretch left index sideways to G and return to F; stretch right index to H and return to J.
- **promptInstruction**: Left index slides to G and back to F. Right index slides to H and back to J.
- **ttsPrompt**: Reach to the middle! Slide to G and back to F. Slide to H and back to J.

#### Drill 2.5: Home Row Three-Letter Words
- **drillId**: `type-s2-d05`
- **title**: First Home Words
- **focusKeys**: `["a", "s", "d", "f", "g", "h", "j", "k", "l", " "]`
- **targetText**: `had had dad dad sad sad fad fad`
- **pedagogicalGoal**: Form real words strictly using the home row keys.
- **promptInstruction**: Type words made only from your home keys: had, dad, sad, fad.
- **ttsPrompt**: Type the words: had, dad, sad, fad. Keep your eyes on the screen.

#### Drill 2.6: The Word "ask" and "all"
- **drillId**: `type-s2-d06`
- **title**: Words with S, K, and L
- **focusKeys**: `["a", "s", "k", "l", " "]`
- **targetText**: `ask ask all all fall fall sash sash`
- **pedagogicalGoal**: Fluid transitions between left hand A-S and right hand K-L.
- **promptInstruction**: Type: ask, all, fall, sash. Feel your fingers dance across the home row.
- **ttsPrompt**: Type: ask, all, fall, sash. Do not rush. Accuracy comes first.

#### Drill 2.7: Words with G and H
- **drillId**: `type-s2-d07`
- **title**: Words with G and H
- **focusKeys**: `["g", "a", "s", "h", "l", " "]`
- **targetText**: `gas gas lag lag glad glad half half`
- **pedagogicalGoal**: Smooth lateral reaches to G and H while typing full words.
- **promptInstruction**: Type: gas, lag, glad, half. Return your index finger to the home bumps after G and H.
- **ttsPrompt**: Type: gas, lag, glad, half. Always return your fingers to the home row.

#### Drill 2.8: Home Row Flash Combinations
- **drillId**: `type-s2-d08`
- **title**: Flash Words
- **focusKeys**: `["f", "l", "a", "s", "h", " "]`
- **targetText**: `flash flash flask flask dash dash`
- **pedagogicalGoal**: Finger independence across all 4 fingers of both hands.
- **promptInstruction**: Type: flash, flask, dash. Notice how every letter stays on the home row!
- **ttsPrompt**: Type: flash, flask, dash. Every letter is right under your fingers.

#### Drill 2.9: Home Row Mini Phrases
- **drillId**: `type-s2-d09`
- **title**: Home Row Phrases
- **focusKeys**: `["a", "s", "d", "f", "g", "h", "j", "k", "l", " "]`
- **targetText**: `a glad lad a sad lass half a dash`
- **pedagogicalGoal**: Sustained sentence-like flow without leaving the home row.
- **promptInstruction**: Type these short phrases. Keep your wrists resting comfortably.
- **ttsPrompt**: Type: a glad lad, a sad lass, half a dash. Keep a steady beat.

#### Drill 2.10: Stage 2 Home Row Mastery
- **drillId**: `type-s2-d10`
- **title**: Home Row Champion
- **focusKeys**: `["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", " "]`
- **targetText**: `dad has a glad lad; all had a flash`
- **pedagogicalGoal**: Complete mastery of the home row including the semicolon.
- **promptInstruction**: Type this complete home row sentence. Finish with the semicolon!
- **ttsPrompt**: Final home row drill! Type: dad has a glad lad; all had a flash.

---

### Stage 3: Top & Bottom Row Reach + Short Everyday Words
*Goal: Train vertical reaches from home keys to the top row (Q W E R T Y U I O P) and bottom row (Z X C V B N M , .). Introduce everyday English words familiar to Filipino students.*

#### Drill 3.1: Top Row Vowels E and O
- **drillId**: `type-s3-d01`
- **title**: Reaching Up to E and O
- **focusKeys**: `["d", "e", "l", "o", " "]`
- **targetText**: `deed solo de lo see red toe led`
- **pedagogicalGoal**: Left middle reaches up from D to E. Right ring reaches up from L to O.
- **promptInstruction**: Reach left middle finger to E. Reach right ring finger to O. Return to home keys.
- **ttsPrompt**: Reach up for E and O. Type: see, red, toe, led.

#### Drill 3.2: Top Row Reach R and U
- **drillId**: `type-s3-d02`
- **title**: Reaching Up to R and U
- **focusKeys**: `["f", "r", "j", "u", " "]`
- **targetText**: `frf juj fr ju run rut fur jar our`
- **pedagogicalGoal**: Left index reach to R; right index reach to U.
- **promptInstruction**: Left index reaches up for R. Right index reaches up for U.
- **ttsPrompt**: Reach up with your index fingers for R and U. Type: run, rut, fur, jar, our.

#### Drill 3.3: Top Row Letters T and Y
- **drillId**: `type-s3-d03`
- **title**: High Reaches T and Y
- **focusKeys**: `["t", "y", "e", "s", " "]`
- **targetText**: `ftf jyj try you toy yet yes year`
- **pedagogicalGoal**: Upper diagonal reaches for center top keys.
- **promptInstruction**: Reach up-right for T. Reach up-left for Y. Return to your home bumps.
- **ttsPrompt**: Type: try, you, toy, yet, yes, year. Keep your palms relaxed.

#### Drill 3.4: Top Row Letters W and P
- **drillId**: `type-s3-d04`
- **title**: Outer Top Keys W and P
- **focusKeys**: `["w", "p", "a", "s", " "]`
- **targetText**: `sws ;p; wet pan pot paw pen mop`
- **pedagogicalGoal**: Left ring reaches up for W. Right pinky reaches up for P.
- **promptInstruction**: Left ring reaches up to W. Right pinky reaches up to P.
- **ttsPrompt**: Type: wet, pan, pot, paw, pen, mop. Great reaches!

#### Drill 3.5: Bottom Row Reach B, N, and M
- **drillId**: `type-s3-d05`
- **title**: Down to the Floor B, N, M
- **focusKeys**: `["b", "n", "m", " "]`
- **targetText**: `fbf jnj jmj ban man bag net mug`
- **pedagogicalGoal**: Index fingers reaching downward to the bottom row.
- **promptInstruction**: Reach index fingers down to B, N, and M. Rest fingers back on F and J.
- **ttsPrompt**: Move your index fingers down to B, N, and M. Type: ban, man, bag, net, mug.

#### Drill 3.6: Bottom Row Reach C and Comma
- **drillId**: `type-s3-d06`
- **title**: Middle Fingers Down to C and Comma
- **focusKeys**: `["d", "c", "k", ",", " "]`
- **targetText**: `dcd k,k cat cup cap, can cup, car`
- **pedagogicalGoal**: Left middle reaches down for C. Right middle reaches down for comma.
- **promptInstruction**: Left middle reaches down for C. Right middle reaches down for comma.
- **ttsPrompt**: Left middle taps C. Right middle taps comma. Type: cat, cup, cap, can.

#### Drill 3.7: Bottom Row Reach Z, X, and Period
- **drillId**: `type-s3-d07`
- **title**: Pinky and Ring Drops Z, X, Period
- **focusKeys**: `["z", "x", "l", ".", " "]`
- **targetText**: `aza sxs l.l zoo box six fix. mix.`
- **pedagogicalGoal**: Pinky and ring finger agility on the bottom row and sentence-ending period.
- **promptInstruction**: Type Z, X, and period. Practice ending words with a clean period.
- **ttsPrompt**: Type: zoo, box, six, fix., mix. Use your pinky for the period.

#### Drill 3.8: Everyday Philippine Words 1
- **drillId**: `type-s3-d08`
- **title**: Everyday Words: Sun, Rice, Jeep
- **focusKeys**: `["s", "u", "n", "r", "i", "c", "e", "j", "p", " "]`
- **targetText**: `sun sun rice rice jeep jeep boat boat`
- **pedagogicalGoal**: Typing familiar cultural words with full-keyboard reach.
- **promptInstruction**: Type these familiar everyday words: sun, rice, jeep, boat.
- **ttsPrompt**: Type familiar words: sun, rice, jeep, boat. Take your time.

#### Drill 3.9: Everyday Philippine Words 2
- **drillId**: `type-s3-d09`
- **title**: Everyday Words: Tree, Book, Road
- **focusKeys**: `["t", "r", "e", "b", "o", "k", "a", "d", "l", "m", "p", " "]`
- **targetText**: `tree tree book book lamp lamp road road`
- **pedagogicalGoal**: Balance keystrokes between left and right hand words.
- **promptInstruction**: Type: tree, book, lamp, road. Keep your wrists straight and relaxed.
- **ttsPrompt**: Type: tree, book, lamp, road. You are building real typing muscle memory!

#### Drill 3.10: Stage 3 Reach Mastery
- **drillId**: `type-s3-d10`
- **title**: Reach Champion: Fresh Mango
- **focusKeys**: `["m", "a", "n", "g", "o", "f", "r", "e", "s", "h", "b", "i", "g", " "]`
- **targetText**: `sweet mango big green tree clean cool water`
- **pedagogicalGoal**: Fluid typing of descriptive multi-word phrases across top, home, and bottom rows.
- **promptInstruction**: Type this refreshing phrase: sweet mango big green tree clean cool water.
- **ttsPrompt**: Master drill! Type: sweet mango, big green tree, clean cool water.

---

### Stage 4: Capital Letters (`Shift`) & Polite Sentences
*Goal: Master two-handed Shift key coordination (opposite hand holds Shift while the other taps the letter). Introduce polite school communication and proper noun capitalization.*

```
CAPITALIZATION RULE: OPPOSITE HAND COORDINATION
┌─────────────────────────────────────────────────────────────┐
│ To type Capital "A" (Left Hand Key):                        │
│   1. Right Pinky presses and holds [Right Shift]            │
│   2. Left Pinky taps [A]                                    │
│   3. Release both keys                                      │
├─────────────────────────────────────────────────────────────┤
│ To type Capital "P" (Right Hand Key):                       │
│   1. Left Pinky presses and holds [Left Shift]              │
│   2. Right Pinky taps [P]                                   │
│   3. Release both keys                                      │
└─────────────────────────────────────────────────────────────┘
```

#### Drill 4.1: Right Shift for Left Hand Capitals
- **drillId**: `type-s4-d01`
- **title**: Capital Letters A, S, D, F
- **focusKeys**: `["Shift", "A", "S", "D", "F", " "]`
- **targetText**: `A S D F As Df Anna Sam Dan Faye`
- **pedagogicalGoal**: Hold Right Shift with right pinky while left hand types capital letters.
- **promptInstruction**: Hold Right Shift with your right pinky. Tap the letter with your left hand.
- **ttsPrompt**: Hold the Right Shift key. Tap the capital letters with your left hand.

#### Drill 4.2: Left Shift for Right Hand Capitals
- **drillId**: `type-s4-d02`
- **title**: Capital Letters J, K, L, M
- **focusKeys**: `["Shift", "J", "K", "L", "M", " "]`
- **targetText**: `J K L M Jk Lm Joy Ken Leo Maria`
- **pedagogicalGoal**: Hold Left Shift with left pinky while right hand types capital letters.
- **promptInstruction**: Hold Left Shift with your left pinky. Tap the letter with your right hand.
- **ttsPrompt**: Hold the Left Shift key. Tap the capital letters with your right hand.

#### Drill 4.3: The Capital Letter "I"
- **drillId**: `type-s4-d03`
- **title**: Typing "I am" and "I can"
- **focusKeys**: `["Shift", "I", "a", "m", "c", "n", " "]`
- **targetText**: `I am ready. I can type. I am happy.`
- **pedagogicalGoal**: Master typing the pronoun "I" using Left Shift + right middle finger.
- **promptInstruction**: Hold Left Shift and tap I. Remember to add the period at the end!
- **ttsPrompt**: Type: I am ready. I can type. I am happy.

#### Drill 4.4: Greeting the Teacher
- **drillId**: `type-s4-d04`
- **title**: Polite Morning Greeting
- **focusKeys**: `["G", "o", "d", "m", "r", "n", "i", "g", "T", "e", "a", "c", "h", ",", "."]`
- **targetText**: `Good morning, Teacher.`
- **pedagogicalGoal**: Accurate comma pause and capitalization in a real daily greeting.
- **promptInstruction**: Type: Good morning, Teacher. Do not forget the comma after morning!
- **ttsPrompt**: Type: Good morning, Teacher.

#### Drill 4.5: Polite Classroom Request
- **drillId**: `type-s4-d05`
- **title**: Borrowing a Pencil
- **focusKeys**: `["M", "a", "y", "I", "b", "o", "r", "w", "p", "e", "n", "c", "i", "l", "?", "p", "s"]`
- **targetText**: `May I borrow a pencil, please?`
- **pedagogicalGoal**: Typing the question mark symbol (`Shift` + `/`).
- **promptInstruction**: Hold Left Shift and tap the `/` key to type the question mark `?`.
- **ttsPrompt**: Type: May I borrow a pencil, please? Remember the question mark!

#### Drill 4.6: Courteous Gratitude
- **drillId**: `type-s4-d06`
- **title**: Saying Thank You
- **focusKeys**: `["T", "h", "a", "n", "k", "y", "o", "u", "v", "e", "r", "m", "c", "."]`
- **targetText**: `Thank you very much. You are welcome.`
- **pedagogicalGoal**: Fluid transitions between two complete polite sentences.
- **promptInstruction**: Type: Thank you very much. You are welcome. Press Space once after each period.
- **ttsPrompt**: Type: Thank you very much. You are welcome.

#### Drill 4.7: Philippine Island Names
- **drillId**: `type-s4-d07`
- **title**: Capitalizing Proper Place Names
- **focusKeys**: `["L", "u", "z", "o", "n", "V", "i", "s", "a", "y", "M", "d", ",", "."]`
- **targetText**: `Luzon, Visayas, and Mindanao.`
- **pedagogicalGoal**: Multiple capitalized proper nouns separated by commas.
- **promptInstruction**: Type the three major island groups: Luzon, Visayas, and Mindanao.
- **ttsPrompt**: Type: Luzon, Visayas, and Mindanao. Capitalize each island name.

#### Drill 4.8: Classroom Respect & Care
- **drillId**: `type-s4-d08`
- **title**: Classroom Kindness
- **focusKeys**: `["W", "e", "s", "h", "a", "r", "k", "i", "n", "d", "w", "o", "r", "."]`
- **targetText**: `We share our books. We speak kindly.`
- **pedagogicalGoal**: Sentence cadence and consistent finger spacing.
- **promptInstruction**: Type: We share our books. We speak kindly.
- **ttsPrompt**: Type: We share our books. We speak kindly.

#### Drill 4.9: Asking for Permission
- **drillId**: `type-s4-d09`
- **title**: Raising Your Hand
- **focusKeys**: `["P", "l", "e", "a", "s", "m", "y", "w", "s", "h", "n", "d", "?"]`
- **targetText**: `Please may I wash my hands?`
- **pedagogicalGoal**: Rapid shift reach for capital P and ending question mark.
- **promptInstruction**: Type: Please may I wash my hands?
- **ttsPrompt**: Type: Please may I wash my hands?

#### Drill 4.10: Stage 4 Politeness Mastery
- **drillId**: `type-s4-d10`
- **title**: Polite Student Pledge
- **focusKeys**: `["I", "w", "i", "l", "b", "e", "p", "o", "t", "a", "n", "d", "h", "e", "f", "u", "."]`
- **targetText**: `I will be polite, honest, and helpful every day.`
- **pedagogicalGoal**: Long-form compound sentence with multiple commas and full alphabet coverage.
- **promptInstruction**: Type this complete pledge with calm, even keystrokes.
- **ttsPrompt**: Master drill! Type: I will be polite, honest, and helpful every day.

---

### Stage 5: Practical School Sentences & Paragraphs
*Goal: Sustained typing endurance, multi-sentence paragraph flow, school computer laboratory rules, and natural language typing rhythm.*

#### Drill 5.1: Computer Lab Rule 1 (Clean Hands)
- **drillId**: `type-s5-d01`
- **title**: Computer Lab: Clean Hands
- **focusKeys**: `["C", "l", "e", "a", "n", "h", "d", "s", "k", "e", "p", "o", "u", "r", "t", "b", "."]`
- **targetText**: `Clean hands keep our keyboard and mouse dry.`
- **pedagogicalGoal**: Focus on accurate spacing and common digital literacy vocabulary.
- **promptInstruction**: Type: Clean hands keep our keyboard and mouse dry.
- **ttsPrompt**: Type: Clean hands keep our keyboard and mouse dry.

#### Drill 5.2: Computer Lab Rule 2 (No Food or Drinks)
- **drillId**: `type-s5-d02`
- **title**: Computer Lab: No Food
- **focusKeys**: `["D", "o", "n", "t", "e", "a", "o", "r", "d", "i", "k", "n", "c", "m", "p", "u", "."]`
- **targetText**: `Do not eat or drink near the computer table.`
- **pedagogicalGoal**: Typing contractions (`Do not`) and prepositional phrasing.
- **promptInstruction**: Type: Do not eat or drink near the computer table.
- **ttsPrompt**: Type: Do not eat or drink near the computer table.

#### Drill 5.3: Good Posture at the Desk
- **drillId**: `type-s5-d03`
- **title**: Sitting Straight & Tall
- **focusKeys**: `["S", "i", "t", "u", "p", "s", "t", "r", "a", "g", "h", "R", "e", "f", "o", "l", "."]`
- **targetText**: `Sit up straight. Rest both feet flat on the floor.`
- **pedagogicalGoal**: Two distinct sentences emphasizing ergonomic posture.
- **promptInstruction**: Type: Sit up straight. Rest both feet flat on the floor.
- **ttsPrompt**: Sit up straight while you type! Type: Sit up straight. Rest both feet flat on the floor.

#### Drill 5.4: Taking Care of the Tablet Screen
- **drillId**: `type-s5-d04`
- **title**: Gentle Touch on Screens
- **focusKeys**: `["T", "o", "u", "c", "h", "e", "s", "r", "n", "g", "l", "y", "U", "f", "."]`
- **targetText**: `Touch the screen gently. Use clean and soft fingers.`
- **pedagogicalGoal**: Repetitive practice of consonant blends *ch*, *sc*, *ft*.
- **promptInstruction**: Type: Touch the screen gently. Use clean and soft fingers.
- **ttsPrompt**: Type: Touch the screen gently. Use clean and soft fingers.

#### Drill 5.5: Saving School Homework
- **drillId**: `type-s5-d05`
- **title**: Saving Your Work
- **focusKeys**: `["A", "l", "w", "a", "y", "s", "v", "e", "y", "o", "u", "r", "w", "k", "b", "f", "."]`
- **targetText**: `Always save your work before you close the window.`
- **pedagogicalGoal**: Building speed on essential digital workflow instructions.
- **promptInstruction**: Type: Always save your work before you close the window.
- **ttsPrompt**: Type: Always save your work before you close the window.

#### Drill 5.6: Writing a Short Science Note
- **drillId**: `type-s5-d06`
- **title**: Science Note: Plants and Sunlight
- **focusKeys**: `["P", "l", "a", "n", "t", "s", "n", "e", "d", "s", "u", "l", "i", "g", "h", "w", "."]`
- **targetText**: `Plants need sunlight and water to grow green leaves.`
- **pedagogicalGoal**: Academic vocabulary typing practice.
- **promptInstruction**: Type: Plants need sunlight and water to grow green leaves.
- **ttsPrompt**: Type: Plants need sunlight and water to grow green leaves.

#### Drill 5.7: Morning School Lineup
- **drillId**: `type-s5-d07`
- **title**: Morning Assembly
- **focusKeys**: `["T", "h", "e", "b", "e", "l", "r", "i", "n", "g", "s", "W", "a", "l", "k", "q", "."]`
- **targetText**: `The bell rings at seven in the morning. We walk to our classroom in line.`
- **pedagogicalGoal**: Multi-sentence continuous typing rhythm.
- **promptInstruction**: Type these two sentences smoothly without stopping between words.
- **ttsPrompt**: Type: The bell rings at seven in the morning. We walk to our classroom in line.

#### Drill 5.8: Philippine Weather Observation
- **drillId**: `type-s5-d08`
- **title**: Sunny and Rainy Days
- **focusKeys**: `["T", "o", "d", "a", "y", "i", "s", "w", "a", "r", "m", "R", "a", "i", "n", "c", "."]`
- **targetText**: `Today is warm and sunny. Dark rain clouds might arrive in the afternoon.`
- **pedagogicalGoal**: Descriptive sentence construction with varying word lengths.
- **promptInstruction**: Type: Today is warm and sunny. Dark rain clouds might arrive in the afternoon.
- **ttsPrompt**: Type: Today is warm and sunny. Dark rain clouds might arrive in the afternoon.

#### Drill 5.9: Teamwork in the Computer Room
- **drillId**: `type-s5-d09`
- **title**: Working Together
- **focusKeys**: `["W", "e", "t", "a", "k", "e", "u", "r", "n", "s", "H", "l", "p", "y", "c", "l", "."]`
- **targetText**: `We take turns on the computer. Help your classmate if they have a question.`
- **pedagogicalGoal**: Cooperative language typing with diverse letter frequencies.
- **promptInstruction**: Type: We take turns on the computer. Help your classmate if they have a question.
- **ttsPrompt**: Type: We take turns on the computer. Help your classmate if they have a question.

#### Drill 5.10: Stage 5 Full Paragraph Challenge
- **drillId**: `type-s5-d10`
- **title**: Paragraph Challenge: The Computer Lab
- **focusKeys**: `["all letters", ".", ","]`
- **targetText**: `Our school computer lab is quiet and clean. We use the keyboard to write stories and learn new ideas. Always listen to your teacher and take good care of the computers.`
- **pedagogicalGoal**: Complete paragraph typing stamina (3 full sentences, 34 words).
- **promptInstruction**: Type this three-sentence paragraph. Take steady breaths and maintain your rhythm.
- **ttsPrompt**: Paragraph challenge! Type the complete paragraph with steady, confident fingers.

---

### Stage 6: File Names, Email/Form Inputs & Symbols (`_`, `.`, `@`, `?`, `-`, `1-9`)
*Goal: Prepare students for real-world school technology tasks: entering email addresses, submitting file attachments with underscores and hyphens, filling web forms, and typing secure passwords.*

#### Drill 6.1: Number Row Essentials 1 to 5
- **drillId**: `type-s6-d01`
- **title**: Numbers 1 2 3 4 5
- **focusKeys**: `["1", "2", "3", "4", "5", " "]`
- **targetText**: `1 2 3 4 5 12 34 51 12345 54321`
- **pedagogicalGoal**: Finger stretches up to the top number row for the left hand.
- **promptInstruction**: Reach up with your left hand fingers to the number keys 1, 2, 3, 4, 5.
- **ttsPrompt**: Type the numbers 1, 2, 3, 4, 5. Reach up carefully.

#### Drill 6.2: Number Row Essentials 6 to 0
- **drillId**: `type-s6-d02`
- **title**: Numbers 6 7 8 9 0
- **focusKeys**: `["6", "7", "8", "9", "0", " "]`
- **targetText**: `6 7 8 9 0 67 89 90 67890 09876`
- **pedagogicalGoal**: Finger stretches up to the top number row for the right hand.
- **promptInstruction**: Reach up with your right hand fingers to the number keys 6, 7, 8, 9, 0.
- **ttsPrompt**: Type the numbers 6, 7, 8, 9, 0 with your right hand.

#### Drill 6.3: The At Sign `@` for Email
- **drillId**: `type-s6-d03`
- **title**: The At Symbol `@`
- **focusKeys**: `["Shift", "@", "2", "a", "b", "c"]`
- **targetText**: `@@ student@school teacher@class info@deped`
- **pedagogicalGoal**: Right pinky holds `Right Shift` while left ring finger reaches up to `2` for `@`.
- **promptInstruction**: Hold Right Shift with your right pinky and press 2 with your left ring finger to type `@`.
- **ttsPrompt**: Hold Right Shift and press 2 to make the at symbol. Type: student@school.

#### Drill 6.4: Full School Email Addresses
- **drillId**: `type-s6-d04`
- **title**: Typing Student Emails
- **focusKeys**: `["@", ".", "s", "t", "u", "d", "e", "n", "p", "h"]`
- **targetText**: `maria.santos@pupil.ph juan.cruz@school.edu.ph`
- **pedagogicalGoal**: Combining dots, letters, and the `@` sign without accidental spaces.
- **promptInstruction**: Type these real school email addresses. Notice there are no spaces inside an email!
- **ttsPrompt**: Type the email addresses: maria.santos@pupil.ph and juan.cruz@school.edu.ph.

#### Drill 6.5: The Underscore `_` for File Names
- **drillId**: `type-s6-d05`
- **title**: The Underscore Key `_`
- **focusKeys**: `["Shift", "_", "-"]`
- **targetText**: `__ science_project math_homework grade4_quiz`
- **pedagogicalGoal**: Hold Left Shift while right pinky reaches up to the key next to zero for `_`.
- **promptInstruction**: Hold Left Shift and press the minus key next to 0 to type an underscore `_`.
- **ttsPrompt**: Hold Left Shift and tap the key next to zero. Type: science_project and math_homework.

#### Drill 6.6: File Extensions `.docx`, `.pdf`, `.png`
- **drillId**: `type-s6-d06`
- **title**: Saving Files with Extensions
- **focusKeys**: `[".", "_", "d", "o", "c", "x", "p", "f", "n", "g"]`
- **targetText**: `english_report.docx art_drawing.png book_list.pdf`
- **pedagogicalGoal**: Real-world file naming conventions required for homework submissions.
- **promptInstruction**: Type these exact computer file names: english_report.docx, art_drawing.png, book_list.pdf.
- **ttsPrompt**: Type the file names: english_report.docx, art_drawing.png, book_list.pdf.

#### Drill 6.7: Web Addresses & URLs
- **drillId**: `type-s6-d07`
- **title**: Typing Website Addresses
- **focusKeys**: `["h", "t", "p", "s", ":", "/", ".", "w"]`
- **targetText**: `https://pupil.ph https://deped.gov.ph`
- **pedagogicalGoal**: Typing colons (`Shift` + `;`) and forward slashes (`/`).
- **promptInstruction**: Type the web address: https://pupil.ph. Hold Shift for the colon `:`.
- **ttsPrompt**: Type: https://pupil.ph and https://deped.gov.ph.

#### Drill 6.8: Form Input: Date and Phone Number
- **drillId**: `type-s6-d08`
- **title**: Dates and Phone Numbers
- **focusKeys**: `["-", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]`
- **targetText**: `2026-10-26 0917-555-0123 0922-888-4567`
- **pedagogicalGoal**: Number row fluency and hyphen typing for standard Philippine mobile and date formats.
- **promptInstruction**: Type the date and mobile phone numbers using numbers and the hyphen `-`.
- **ttsPrompt**: Type the date 2026-10-26 and the phone numbers. Use the hyphen key.

#### Drill 6.9: Password Creation Symbols
- **drillId**: `type-s6-d09`
- **title**: Safe Password Characters
- **focusKeys**: `["#", "!", "$", "1", "2", "3", "A", "b", "c"]`
- **targetText**: `Mango#2026 School!45 Manila$99`
- **pedagogicalGoal**: Alternating between capital letters, lowercase letters, numbers, and symbols.
- **promptInstruction**: Type these strong password examples. Alternate Shift key presses smoothly.
- **ttsPrompt**: Type: Mango#2026, School!45, Manila$99. Strong passwords use letters, numbers, and symbols.

#### Drill 6.10: Stage 6 Practical Master Challenge
- **drillId**: `type-s6-d10`
- **title**: Complete Digital Form Entry
- **focusKeys**: `["all letters", "numbers", "symbols"]`
- **targetText**: `User: maria_cruz | ID: 2026-4401 | Email: maria@school.ph | File: unit1_test.pdf`
- **pedagogicalGoal**: Comprehensive synthesis of letters, numbers, colon, vertical bar, underscore, dot, and `@`.
- **promptInstruction**: Final Stage 6 challenge! Type this complete student record string with maximum precision.
- **ttsPrompt**: Congratulations on reaching the final drill! Type the complete student record accurately.

---

## 5. Mini-Game 1: Jeepney Word Express

```
+-------------------------------------------------------------------------+
|                      JEEPNEY WORD EXPRESS (HUD)                         |
+-------------------------------------------------------------------------+
| Route: Barangay San Jose -> City Library      [Score: 450] [Speed: 40km]|
|                                                                         |
|                       ┌─────────────────────────┐                       |
|                       │   PASSENGER WORD STOP   │                       |
|                       │     "YELLOW BANANA"     │                       |
|                       └─────────────────────────┘                       |
|                                                                         |
|      [1]                  [2]                  [3]                 [4]  |
| ┌───────────┐        ┌───────────┐        ┌───────────┐       ┌───────┐ |
| │  [Image:  │        │  [Image:  │        │  [Image:  │       │[Image:│ |
| │  Jeepney] │        │  Banana]  │        │  Mango]   │       │ Papaya│ |
| └───────────┘        └───────────┘        └───────────┘       └───────┘ |
|                                                                         |
|        ______[ JEEPNEY EXPRESS ]______                                  |
|  =====(_____[#  #  #  #  #  #]_______)==============================    |
|             (O)            (O)                                          |
+-------------------------------------------------------------------------+
```

### 5.1 Game Overview & Pedagogical Purpose
- **Genre**: Vocabulary & Picture Matching / Rapid Word Recognition.
- **Objective**: Drive the colorful Philippine Jeepney along its scenic route from the Barangay Hall to the City Central Library by picking up passengers at bus stops. At each stop, match the displayed English vocabulary word with the correct picture card before the jeepney's green departure timer bar expires.
- **Pedagogical Target**: English word-to-object association, visual discrimination, and reaction speed without fear of failure.

### 5.2 Gameplay Mechanics & Controls
- **Round Presentation**:
  1. A target word (or short phrase) appears in large clear typography at the top of the windshield.
  2. The Web Speech API speaks the word aloud automatically: `sound.speak(round.targetWord)`.
  3. A horizontal row of image cards appears across the bottom of the road.
- **Input Controls**:
  - **Tablet Touch**: Direct tap on the matching image card ($>64 \times 64\text{ px}$ touch target).
  - **Laptop/Desktop Keyboard**: Each card has a prominent number badge (`[1]`, `[2]`, `[3]`, `[4]`). Pressing keys `1`, `2`, `3`, or `4` on the keyboard instantly selects that card. Alternatively, students can use the Left/Right Arrow keys + `Enter`.
- **Feedback & Animations**:
  - *Correct Match*: Passenger cheerfully hops into the jeepney with a gentle "Bip-bip!" honk; the jeepney accelerates forward, leaving a small puff of celebratory confetti; score increases by $+100 \times \text{streak multiplier}$.
  - *Incorrect Match*: The incorrect card wiggles gently with a low wooden click; the timer does not drop; the student is encouraged to try another card until correct. No loss of life.

### 5.3 Level Progression & Scaling

| Level Tier | Target Grades | Number of Choices | Timer per Stop | Word Complexity | Visual Theme |
|:---|:---|:---|:---|:---|:---|
| **Tier 1 (Playful)** | Pre-K & Kinder | 2 large cards | No timer (Calm mode) | Single 3-letter nouns (*cat, dog, sun, bus*) | Cheerful countryside, coconut trees, smiling sun |
| **Tier 2 (Guided A)** | Grades 1–2 | 3 cards | 15 seconds | Everyday objects & food (*mango, pencil, water, table*) | Vibrant town avenue with sari-sari stores |
| **Tier 3 (Guided B)** | Grades 3–4 | 4 cards | 10 seconds | Action verbs & places (*reading, jumping, school, market*) | Busy highway with road signs & bridges |
| **Tier 4 (Studio Mode)** | Grades 5+ & High School | 4 cards | 7 seconds | Digital & academic tools (*monitor, keyboard, folder, browser*) | Sleek neon night-metro expressway with modern transit skin |

### 5.4 Complete 15-Round Content Bank

| Round ID | Level Tier | Target English Word | Category | Correct Image Asset / Concept | Distractor 1 | Distractor 2 | Distractor 3 |
|:---|:---|:---|:---|:---|:---|:---|:---|
| `jep-01` | Tier 1 | `Sun` | Nature | Bright yellow smiling sun | Rain cloud | Blue ocean wave | — |
| `jep-02` | Tier 1 | `Cat` | Animals | Orange sleeping cat | Brown dog | Green frog | — |
| `jep-03` | Tier 1 | `Book` | School | Open storybook | Wooden chair | Red apple | — |
| `jep-04` | Tier 2 | `Mango` | Food | Ripe yellow mango | Yellow banana | Green coconut | Red papaya |
| `jep-05` | Tier 2 | `Pencil` | School | Yellow sharpened pencil | Blue water bottle | School notebook | Eraser |
| `jep-06` | Tier 2 | `Water` | Everyday | Clear glass of water | Hot cup of milk | Soup bowl | Plate of rice |
| `jep-07` | Tier 2 | `Jeepney` | Vehicles | Colorful passenger jeepney | Yellow tricycle | School bus | Bicycle |
| `jep-08` | Tier 3 | `Reading` | Actions | Girl reading a library book | Boy running on track | Child sleeping | Kid singing |
| `jep-09` | Tier 3 | `Planting` | Actions | Hands planting a green seedling | Watering can | Cooking soup | Painting picture |
| `jep-10` | Tier 3 | `Library` | Places | Room full of books & study desks | Basketball court | Market stall | Playground |
| `jep-11` | Tier 3 | `Bridge` | Places | Long river bridge with road | Mountain trail | Sandy beach | Airport runway |
| `jep-12` | Tier 4 | `Monitor` | Technology | Desktop computer display screen | Computer mouse | Audio speaker | USB flash drive |
| `jep-13` | Tier 4 | `Folder` | Technology | Yellow digital file folder icon | Trash can icon | Web search icon | Printer |
| `jep-14` | Tier 4 | `Keyboard` | Technology | Computer typing keyboard | Game controller | Camera lens | Power plug |
| `jep-15` | Tier 4 | `Download` | Technology | Arrow pointing down into tray | Arrow pointing up | Refresh circle | Lock symbol |

---

## 6. Mini-Game 2: Falling Keys / Mango Catcher

```
+-------------------------------------------------------------------------+
|                  MANGO CATCHER / KEY CAPSULES (HUD)                     |
+-------------------------------------------------------------------------+
| Level: Home Row Sprint    [Score: 820]    [Streak: 12]    [Shield: 3/3] |
|                                                                         |
|        ( A )                                                            |
|          |                                            ( J )             |
|          v                       ( F )                  |               |
|                                    |                    v               |
|                                    v                                    |
|                                                                         |
|                                                                         |
|                                                                         |
|     \______/                                                            |
|  [KAING BASKET]                                                         |
+-------------------------------------------------------------------------+
```

### 6.1 Game Overview & Pedagogical Purpose
- **Genre**: Keyboard Reflex & Touch Target Timing Arcade.
- **Objective**: Golden ripe mangoes (or sleek glowing Key Capsules in High School Studio Mode) drop smoothly from the top canopy toward the ground. Each falling item displays a letter, number, or short word. The student must press the matching key on their keyboard (or tap the falling capsule on tablet) before it touches the ground!
- **Pedagogical Target**: Instantaneous letter-to-finger muscular reaction, visual tracking, and cognitive processing speed.

### 6.2 Adaptive Visual Skinning
1. **Elementary & Playful Theme: "The Mango Orchard"**:
   - The scene is a lush green mango orchard with a woven bamboo basket (*kaing*) resting at the base.
   - Falling items are golden-ripe carabao mangoes with glowing green leaves.
   - Catching a mango plays a joyful acoustic marimba "pop!" and adds the mango to the basket.
2. **High School Studio Mode: "Cyber Key Capsules"**:
   - The scene transforms into a minimalist neon cyber terminal with a slate grid background.
   - Falling items are sleek, geometric **Key Capsules** with cyan/emerald LED borders.
   - Catching a capsule triggers an electronic synth pulse and a crisp particle spark.

### 6.3 Speed Tiers & Velocity Curves
The drop duration ($T_{\text{drop}}$ in milliseconds) is governed by the formula:
$$T_{\text{drop}}(n) = \max\left(1400, T_{\text{initial}} - (n \times \Delta t)\right)$$
where $n$ is the round count.

| Tier ID | Focus Content | Fall Duration ($T_{\text{drop}}$) | Simultaneous Drops | Target Grade Range |
|:---|:---|:---|:---|:---|
| **Tier 1: Calm** | Vowels: `A, E, I, O, U` | $4500\text{ ms}$ (Very slow) | 1 item | Pre-K & Kinder |
| **Tier 2: Home Row** | `A, S, D, F, J, K, L` | $3500\text{ ms}$ | 1 item | Lower Elementary |
| **Tier 3: Full Alpha** | All alphabet keys `A–Z` | $2600\text{ ms}$ | 2 items staggered | Upper Elementary |
| **Tier 4: Studio Rush**| Letters + Numbers + Symbols | $1800\text{ ms}$ | 2 to 3 items | High School Studio |

### 6.4 Scoring, Combos & Zero-Trauma Policy
- **Base Score**: $+50\text{ points}$ per catch.
- **Height Bonus**: Catching the item in the top half of the screen yields $+25\text{ bonus points}$ (rewarding fast recognition).
- **Streak Multiplier**:
  - $1\text{–}4\text{ streak}$: $1.0\times$
  - $5\text{–}9\text{ streak}$: $1.5\times$
  - $10+\text{ streak}$: $2.0\times$ (Activates "Golden Mango Glow" mode)
- **Zero-Trauma Policy**:
  - If a mango reaches the ground uncaught, it does not explode or show negative red marks. It gently rolls away with a soft leaf rustle sound.
  - The game never forces a harsh "GAME OVER" screen. A 3-heart shield absorbs misses; if all shields deplete, the game gracefully pauses, celebrates the points earned, and presents a friendly `"Try Again with Slower Drops?"` toggle.

---

## 7. Mini-Game 3: Sentence Builder Scramble

```
+-------------------------------------------------------------------------+
|                     SENTENCE BUILDER SCRAMBLE                           |
+-------------------------------------------------------------------------+
| [Listen to Target Sentence] (🔊 Web Speech Read-Aloud)                  |
|                                                                         |
| Target Rack:                                                            |
| ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐|
| │  [ Slot 1 ]   │ │  [ Slot 2 ]   │ │  [ Slot 3 ]   │ │  [ Slot 4 ]   │|
| └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘|
|                                                                         |
| Scrambled Word Tiles:                                                   |
|       ┌───────────┐         ┌───────────┐         ┌───────────┐         |
|       │  jeepney. │         │    The    │         │  yellow   │         |
|       └───────────┘         └───────────┘         └───────────┘         |
|                             ┌───────────┐                               |
|                             │    is     │                               |
|                             └───────────┘                               |
|                                                                         |
| [Hint: The first word starts with a capital letter!]                    |
+-------------------------------------------------------------------------+
```

### 7.1 Game Overview & Pedagogical Purpose
- **Genre**: Syntax Construction & Sentence Ordering Puzzle.
- **Objective**: Reassemble a set of shuffled word tiles into a grammatically correct, meaningful English sentence.
- **Pedagogical Target**: English Subject-Verb-Object (SVO) sentence structure, proper noun capitalization, punctuation awareness, and reading comprehension.

### 7.2 Mechanics & Web Speech API Integration
- **Interaction Model**:
  - **Touch/Mouse**: Tap a scrambled word tile to send it into the next available slot on the Target Rack. Tapping a placed tile returns it to the pool. Full drag-and-drop HTML5 / touch-drag is also supported.
  - **Keyboard Navigation**: Pressing `Tab` cycles through word tiles; pressing `Space` or `Enter` moves the tile to the target rack.
- **Audio TTS Integration**:
  - Tapping the **"Listen"** button at any time reads the full correct sentence aloud at $0.85\times$ speed using the Web Speech API (`window.speechSynthesis`).
  - Tapping an individual tile pronounces that single word instantly, reinforcing phonetic decoding.
- **Smart Hint System**:
  - *Hint 1 (Visual clue)*: Capitalized first word is subtly bordered with a soft blue underline.
  - *Hint 2 (Punctuation clue)*: The ending word tile containing the period (`.`) or question mark (`?`) has a slightly rounded right edge.
  - *Hint 3 (Audio nudge)*: Plays the first two words aloud when the student hesitates for more than 12 seconds.

### 7.3 Complete 20-Sentence Content Bank (4 Difficulty Levels)

#### Level 1: Simple 3-Word Sentences (Pre-K / Kinder)
| Sentence ID | Scrambled Words | Correct Sentence | Grammar Focus | TTS Audio Script |
|:---|:---|:---|:---|:---|
| `sb-01` | `["cat.", "The", "sleeps"]` | `The cat sleeps.` | Determiner + Noun + Intransitive Verb | *"The cat sleeps."* |
| `sb-02` | `["mangoes.", "like", "I"]` | `I like mangoes.` | Pronoun + Verb + Plural Noun | *"I like mangoes."* |
| `sb-03` | `["is", "sun", "The", "hot."]` | `The sun is hot.` | Predicate Adjective | *"The sun is hot."* |
| `sb-04` | `["Birds", "high.", "fly"]` | `Birds fly high.` | Noun + Verb + Adverb | *"Birds fly high."* |
| `sb-05` | `["We", "school.", "love"]` | `We love school.` | Plural Pronoun + Transitive Verb | *"We love school."* |

#### Level 2: 4-to-5 Word Everyday Sentences (Lower Elementary)
| Sentence ID | Scrambled Words | Correct Sentence | Grammar Focus | TTS Audio Script |
|:---|:---|:---|:---|:---|
| `sb-06` | `["yellow", "ride", "the", "jeepney.", "We"]` | `We ride the yellow jeepney.` | Adjective before Noun | *"We ride the yellow jeepney."* |
| `sb-07` | `["opens", "her", "Maria", "laptop."]` | `Maria opens her laptop.` | Proper Noun + Singular Verb + Object | *"Maria opens her laptop."* |
| `sb-08` | `["pencils", "have", "sharp", "Two", "boys."]` | `Two boys have sharp pencils.` | Number Quantifier + Adjective | *"Two boys have sharp pencils."* |
| `sb-09` | `["Teacher", "smiles", "Our", "today."]` | `Our Teacher smiles today.` | Possessive Determiner + Adverb of Time | *"Our Teacher smiles today."* |
| `sb-10` | `["clean", "water", "Drink", "every", "day."]` | `Drink clean water every day.` | Imperative Command | *"Drink clean water every day."* |

#### Level 3: 6-to-8 Word School & Tech Sentences (Upper Elementary)
| Sentence ID | Scrambled Words | Correct Sentence | Grammar Focus | TTS Audio Script |
|:---|:---|:---|:---|:---|
| `sb-11` | `["save", "button", "Click", "to", "work.", "your", "blue", "the"]` | `Click the blue button to save your work.` | Infinitive of Purpose | *"Click the blue button to save your work."* |
| `sb-12` | `["swim", "in", "Small", "the", "river.", "cool", "fishes"]` | `Small fishes swim in the cool river.` | Plural Subject-Verb Agreement | *"Small fishes swim in the cool river."* |
| `sb-13` | `["homework", "We", "submit", "before", "our", "Friday."]` | `We submit our homework before Friday.` | Prepositional Time Phrase | *"We submit our homework before Friday."* |
| `sb-14` | `["keyboard", "Keep", "dry", "and", "the", "clean."]` | `Keep the keyboard clean and dry.` | Conjunction connecting adjectives | *"Keep the keyboard clean and dry."* |
| `sb-15` | `["reads", "a", "story", "Leo", "his", "sister.", "to"]` | `Leo reads a story to his sister.` | Indirect Object with Preposition | *"Leo reads a story to his sister."* |

#### Level 4: 8-to-12 Word Practical Digital Literacy Sentences (High School / Studio)
| Sentence ID | Scrambled Words | Correct Sentence | Grammar Focus | TTS Audio Script |
|:---|:---|:---|:---|:---|
| `sb-16` | `["strangers", "password", "Never", "your", "secret", "online.", "with", "share"]` | `Never share your secret password with strangers online.` | Adverb of Frequency + Security Rule | *"Never share your secret password with strangers online."* |
| `sb-17` | `["file", "your", "name", "project.", "with", "Save", "name_science.pdf", "the"]` | `Save your file with the name name_science.pdf project.` | Naming convention instruction | *"Save your file with the name name_science.pdf project."* |
| `sb-18` | `["messages", "delete", "suspicious", "Always", "unknown", "from", "numbers."]` | `Always delete suspicious messages from unknown numbers.` | Security imperative + Adjective phrase | *"Always delete suspicious messages from unknown numbers."* |
| `sb-19` | `["computer", "Log", "out", "of", "the", "finishing", "after", "class."]` | `Log out of the computer after finishing class.` | Phrasal Verb + Temporal Clause | *"Log out of the computer after finishing class."* |
| `sb-20` | `["helps", "Polite", "us", "communication", "collaborate", "classmates.", "with", "effectively"]` | `Polite communication helps us collaborate effectively with classmates.` | Complex Subject + Adverbial Manner | *"Polite communication helps us collaborate effectively with classmates."* |

---

## 8. Mini-Game 4: Tech Detective Challenge

```
+-------------------------------------------------------------------------+
|                    TECH DETECTIVE CHALLENGE (HUD)                       |
+-------------------------------------------------------------------------+
| Case #104: The Suspicious Prize Message    [Badge: Junior Cyber Detective]|
|                                                                         |
| ┌─────────────────────────────────────────────────────────────────────┐ |
| │ SIMULATED INBOX MESSAGE                                             │ |
| │ From: 0999-FREE-LOAD (Unknown Sender)                               │ |
| │ Subject: CONGRATULATIONS! YOU WON 50,000 PESOS!                    │ |
| │ Message: Click this link now: http://free-load-claim.ru/win.exe     │ |
| │ Send your home address and your parent's PIN number immediately!    │ |
| └─────────────────────────────────────────────────────────────────────┘ |
|                                                                         |
| Detective Question: What should you do with this message?               |
|                                                                         |
|  [A] Click the link and enter your parent's PIN quickly!                |
|  [B] (Correct) Do NOT click the link. Tell a teacher or adult.          |
|  [C] Send the message to all your classmates.                          |
|                                                                         |
| Clue Highlight: Notice the unknown number and the request for secrets!  |
+-------------------------------------------------------------------------+
```

### 8.1 Game Overview & Pedagogical Purpose
- **Genre**: Multi-Stage Interactive Tech Simulation & Scenario Evaluation.
- **Objective**: Become a certified **"Pupil Cyber Detective"** by solving realistic technology challenges across three specialized mission modes:
  1. **Mode A: Target Practice** (Fine motor mouse and touch precision: single-click, double-click, drag-and-drop, right-click / long-press).
  2. **Mode B: File & Folder Sorter** (Spatial file management: sorting `.docx`, `.png`, `.mp3` files into dedicated desktop folders).
  3. **Mode C: Safe vs. Scam Spotter** (Critical thinking: spotting phishing links, fake prize pop-ups, online stranger danger, and secure passwords).

---

### 8.2 Mode A: Target Practice (Precision Mechanics)
- **Mission A.1: The Single-Tap Button Trainer**:
  - Screen displays floating bubbles containing school supplies. Student must single-click / tap each bubble without touching the background. Teaches primary cursor targeting.
- **Mission A.2: The Double-Click Document Opener**:
  - Requires students to double-click an on-screen folder icon within $450\text{ ms}$ (or double-tap on tablet). Visual ripple feedback confirms timing success.
- **Mission A.3: The Drag-and-Drop USB Ejector**:
  - Student must click/touch a virtual USB drive icon, drag it smoothly across the desktop, and drop it safely into the "Eject / Unmount" dock zone.

---

### 8.3 Mode B: File & Folder Sorter (Content Matrix)
Students are presented with a desktop workbench containing 6 disorganized files. They must drag each file into its proper destination folder:

| File Name | File Icon / Type | Correct Target Folder | Pedagogical Concept |
|:---|:---|:---|:---|
| `philippine_eagle.png` | Image / Picture | **`[Pictures]`** | Image file extension `.png` |
| `science_plants.docx` | Document / Text | **`[Documents]`** | Word document extension `.docx` |
| `national_anthem.mp3` | Music / Audio | **`[Music & Audio]`** | Audio recording extension `.mp3` |
| `math_quiz_scores.xlsx`| Spreadsheet / Table| **`[Documents]`** | Data spreadsheet extension `.xlsx` |
| `class_field_trip.jpg` | Image / Picture | **`[Pictures]`** | Camera photo extension `.jpg` |
| `corregidor_history.pdf`| PDF Document | **`[Documents]`** | Fixed document extension `.pdf` |

---

### 8.4 Mode C: Safe vs. Scam Spotter (Detailed Scenario Bank)

#### Scenario C.1: The Free Online Game Load Scam
- **Simulated Visual**: Simulated SMS message banner on a smartphone frame.
  - *Sender*: `FREE-RELOAD-WINNER`
  - *Text*: `"URGENT! You won 1,000 Pesos mobile load! Click http://bit.ly/freeload-now and enter your mother's bank card number in 5 minutes!"`
- **Question**: Is this message Safe or a Scam?
- **Options**:
  - Option 1 (Safe): `"Safe! I want 1,000 Pesos load for my games."`
  - Option 2 (Scam - Recommended): `"SCAM! Legitimate companies never ask for bank card numbers to give a free prize."`
- **Detective Explanation**: Real contests never ask for secret parent information. Never click strange shortened links from people you do not know.

#### Scenario C.2: The School Teacher Email
- **Simulated Visual**: Simulated email client window.
  - *Sender*: `teacher.faye@sanjose-elem.edu.ph`
  - *Subject*: `Grade 4 Science Reading for Monday`
  - *Text*: `"Good afternoon, class. Please read pages 12 to 15 in your science textbook before our lesson on Monday. Have a restful weekend!"`
- **Question**: Is this message Safe or a Scam?
- **Options**:
  - Option 1 (Safe - Recommended): `"SAFE! It comes from an official school email address and asks only for homework reading."`
  - Option 2 (Scam): `"Scam! Delete it immediately."`
- **Detective Explanation**: Look at the sender address ending in `.edu.ph`. It is polite, does not ask for money or passwords, and is from your verified teacher.

#### Scenario C.3: The "Virus Detected!" Fake Browser Alert
- **Simulated Visual**: Flashing red pop-up dialog box overlaying a web page.
  - *Title*: `"WARNING! YOUR TABLET HAS 17 VIRUSES!"`
  - *Text*: `"Your device will break in 30 seconds! Call 1-800-FAKE-HELP or download CleanTabletFast.exe immediately!"`
- **Question**: What is the correct detective action?
- **Options**:
  - Option 1 (Incorrect): `"Download CleanTabletFast.exe to clean the tablet."`
  - Option 2 (Correct - Recommended): `"Close the web browser tab immediately and tell an adult or teacher."`
- **Detective Explanation**: Fake virus pop-ups try to scare you into downloading harmful software. Websites cannot scan your computer through a simple page. Just close the tab!

#### Scenario C.4: Social Media Password Request from a "Friend"
- **Simulated Visual**: Chat bubble from an account using a classmate's picture.
  - *Message*: `"Hey! I forgot my password for Pupil PH. Can you send me your username and 4-digit PIN so I can play your games?"`
- **Question**: What should you do?
- **Options**:
  - Option 1 (Incorrect): `"Give them your PIN because they are your friend."`
  - Option 2 (Correct - Recommended): `"Do NOT share your PIN. Tell them to ask the teacher to reset their account."`
- **Detective Explanation**: Your 4-digit PIN is strictly for you. Real friends will never ask you to compromise your account. The teacher can always give them their own login.

---

## 9. Audio Synthesis & Ergonomics Reference

### 9.1 Web Audio API Procedural Audio Generator
To achieve $0\text{ ms}$ asset load time and eliminate slow network audio requests on intermittent Philippine school Wi-Fi, the entire sound system is generated via procedural Web Audio API oscillators:

```typescript
// Web Audio API Synthesis Helper Specification
export class SoundSynthesizer {
  private ctx: AudioContext | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Gentle pentatonic correct key chime
  public playCorrectTone(frequency = 523.25) { // C5
    this.initContext();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  // Soft wooden thud on incorrect key (non-punitive)
  public playSoftThud() {
    this.initContext();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(130.81, this.ctx.currentTime); // C3
    osc.frequency.exponentialRampToValueAtTime(65.41, this.ctx.currentTime + 0.12); // C2

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }
}
```

---

## 10. Engineering Hand-off Checklist

- [x] Dual-input architecture defined (Physical `keydown` vs. On-Screen Touch QWERTY).
- [x] Full color-coded finger zones and visual hand guide mapped.
- [x] Adaptive UI skinning specifications for Playful, Guided, and Studio ("Start from Basics") modes.
- [x] 60 fully articulated typing drills across 6 progressive stages.
- [x] 15 complete rounds for Jeepney Word Express with touch & keyboard controls.
- [x] Falling Keys / Mango Catcher speed curves, skinning, and zero-trauma mechanics.
- [x] 20 complete sentence scramble puzzle configurations with Web Speech API scripts.
- [x] Tech Detective Challenge multi-mode simulation specs with realistic phishing/security cases.
- [x] Zero external media dependencies: Web Audio API procedural synthesis specifications provided.
- [x] 100% Pure Simple English throughout. No Tagalog translations.
