# Portfolio v2 — design direction

**One job:** make a design hiring manager believe, in under a minute, that Tomme
frames problems and evidences decisions — and can build what he designs. The
current site proves the building. This redesign proves the thinking.

---

## 1. The one honest constraint on "forget how the site works"

The *surface* should be rebuilt: palette, type, layout, IA, and the content
model all change. Four things underneath should not, because they are working
and rebuilding them is pure loss:

| Keep | Why |
|---|---|
| `/work/<slug>` URLs | Live, deployed, and 18 of them. Changing the scheme breaks every link already shared. |
| `assets-r2/` + `assetUrl()` | Cloudflare Pages rejects files over 25 MB and this site is video-first. |
| `remark-strip-needs-input` + the build guard | The redesign *adds* `[NEEDS INPUT]` markers. The guard is what keeps them off the live site. |
| `projectMedia` build-time resolution | Emits real `<img>`/`<video>` tags instead of probing with 404s. |

Everything else — the overlay SPA, the warm palette, `HomeView`'s hero card
stack, the featured carousel — is replaced.

---

## 2. What the two references actually teach

**rajakabierski.com** — a filterable grid (`All / Game UI/UX / 2D Art /
Game Productions / UI/UX`), cards that carry title + discipline tags +
one-line descriptor, and case studies that run a *predictable* spine so the
reader learns the shape once. Progressive disclosure: grid → filter → card →
case study.

**annaparmentier.com** — spacious, image-led, three discipline gateways rather
than one undifferentiated wall. And notably: **she states accessibility as a
value in the first sentence about herself.** Text is contextual support, not
the main event.

**The synthesis for this site:** Anna's spacing and discipline gateways, Raja's
filters and repeatable case-study spine, and — the thing neither has — visible
process artifacts as evidence.

---

## 3. Information architecture

```
/                     Positioning, three discipline gateways, 3 lead case studies
/work                 Filterable index of everything
/work/<slug>          Case study (18 existing URLs preserved)
/about                Who he is, how he thinks, the frameworks — shown via work
/cv                   Résumé, downloadable
/photography          Existing photo mode, promoted to a real route
```

**Filters on `/work`,** derived from real work rather than invented taxonomy:

`All` · `XR & Spatial` · `Games` · `Interface & UI` · `Research & Evaluation` · `Photography`

`Research & Evaluation` is the one that does unusual work: it collects the
biometrics unit, the four-round testing logs, and the thesis study. Almost no
junior portfolio has that filter, which is exactly why it should exist.

**Three gateways on `/`**, following Anna's model, in this order:

1. **XR & Spatial** — the repositioning target. Leads.
2. **Games & Interface** — the deepest body of work.
3. **Photography** — real skill, kept clearly separate so it doesn't dilute the design read.

---

## 4. The case study spine

Default structure for any project that genuinely ran it. **Phases are labelled
with the five names from ARTG5710 only where that project actually went through
them** — a stock diagram on a project that skipped ideation is a lie with a
nice icon.

```
Header          Name · one-sentence what-and-for-whom
                Role · timeline · team · tools          (tools live here only)
Hero            Video. Never a static render on a spatial project.

Context         The situation that created the need
Constraints     What couldn't change, and what that ruled out
What informed   Research / testing / briefs / prior art — honest about scale
   ↳ ARTIFACT   Testing logs, surveys, wireframes — unretouched
Explorations    At least two directions not shipped, and why each lost
   ↳ ARTIFACT   Sketches, rejected wireframes
Decisions       3–5, each: tension → options → choice → reasoning
                (a dignity pillar named inline, only where it drove the choice)
The result      The final experience as a user meets it
Outcome         What happened. Demos, users, reception, shipped or not.
   ↳ QUOTE      Instructor or critique pull-quote, attributed
Reflection      What I'd change, stated with judgment
```

**Process strip** — a thin horizontal band under the header, shown *only* on
the two *Design for Dignity* projects:

```
RESEARCH ─── DEFINITION ─── IDEATION ─── SYNTHESIS ─── DELIVERY
   ●             ●              ●            ●            ●
 artifact      artifact      artifact     artifact     artifact
```

Each dot links to the artifact for that phase. If a phase has no artifact, the
dot is hollow and unlinked — visibly incomplete beats quietly fabricated.

---

## 5. How the dignity framework surfaces

**Rule: no badge, no diagram, no tagline.** The four pillars appear as a single
plain sentence inside a decision where the pillar changed the outcome, and
nowhere else.

Worked examples for *Inhabiting Memory*, from what actually happened:

> **Autonomy and merit.** Every interpretive room came from that person's own
> interview rather than my reading of them, and families kept control of how
> they were represented. That made the interpretive half theirs, which is the
> only reason it can be called preservation rather than my art about my family.

> **Human rights and merit.** I ruled out interactions that would have let a
> visitor handle a deceased relative as an object. It was the most obvious
> mechanic available and it treats a person as a prop.

> **Interpersonal connection.** The brief was intergenerational connection, not
> a substitute for it — which is why the museum is something a family enters
> together rather than a private replay.

Those read as judgment. "Dignity-driven designer" reads as coursework.

**`/about`** is the one place the framework may be named directly — a short
paragraph, plus the **Designer's Oath** as a real artifact (his own words,
written for the course). **Designer's Court** fits as a critique-practice note.
Grades appear nowhere.

---

## 6. Evidence rules (the spine of the whole redesign)

1. **Every process claim ships with a visible artifact.** "I ran four rounds of
   testing" requires the testing log on the page — image, excerpt, or download.
   No artifact, no claim.
2. **Artifacts go up unretouched.** Sketches, wireframe photos, marked-up
   screenshots, iPad mockups, as they are. Redrawing them into tidy vectors
   proves only that he owns Illustrator.
3. **Captions say what the artifact proves,** not what it is.
4. **Third-party quotes are attributed plainly** — "course instructor
   feedback," "audience critique at the XR thesis showcase" — and used sparingly.
5. **Nothing is invented.** No personas, journey maps, How Might We, Crazy
   Eights, competitive audits or findings that don't exist as files. Gaps ship
   as `[NEEDS INPUT: …]` in the Markdown and are stripped from the build.

**Component: the artifact figure.** Full-width image or embedded PDF page, a
caption stating what it proves, an optional download link, and a source line
("Game Interface Design, GAME3300"). Degrades to nothing when the file is
absent — same `existsSync` pattern already in `projectMedia.ts`.

---

## 7. Accessibility as a through-line, not a section

Surfaced inside the decision it belongs to, never collected into an
"Accessibility" box:

- **HaptiDraw** — a sketching tool for visually impaired users. This is the
  strongest accessibility credential on the site and currently invisible.
- **Hand tracking over controllers** — framed as removing a layer of mediation.
- **XR comfort treated as accessibility** — locomotion, motion sickness,
  session length, play space, and first-time headset users. On *Inhabiting
  Memory* the play-space module is a comfort decision before it is a level-design one.
- **The site itself** — verified contrast (§8), reduced-motion respected,
  semantic headings, real focus states, alt text on every artifact.

---

## 8. Visual system — Vintage Charm, measured

### Contrast, computed not assumed

| Foreground on background | Ratio | Verdict |
|---|---|---|
| Ink `#04151f` on Wheat `#efd6ac` | **13.15** | AAA body |
| Wheat on Ink | **13.15** | AAA body |
| Violet `#432534` on Wheat | **9.59** | AAA body |
| Slate `#183a37` on Wheat | **8.76** | AAA body |
| Wheat on Violet | **9.59** | AAA body |
| Wheat on Slate | **8.76** | AAA body |
| Burnt Orange `#c44900` on Ink | 3.80 | Large text / UI only |
| Burnt Orange on Wheat | 3.46 | Large text / UI only |
| Orange on Slate | 2.53 | **FAIL** |
| Orange on Violet | 2.77 | **FAIL** |
| Slate on Ink | 1.50 | **FAIL** |
| Violet on Ink | 1.37 | **FAIL** |

### Three hard rules that follow

1. **Burnt orange is never body text and never a small link.** It is a
   large-display and UI accent only — headline words, rules, active filter
   state, focus rings, 24px+ or 19px bold minimum.
2. **Orange never sits on slate or violet.** Both fail. Orange goes on wheat or ink.
3. **Slate and violet are surfaces on ink, never text on it.** At 1.50 and 1.37
   they are nearly invisible against ink — which makes them excellent quiet
   elevated panels and useless for type.

### Roles

```
Light (default)                    Dark
--bg        #efd6ac  wheat         #04151f  ink
--surface   #e5c993  wheat −6%     #183a37  slate
--text      #04151f  ink           #efd6ac  wheat
--muted     #183a37  slate         #efd6ac @ 68%
--rule      #04151f @ 14%          #efd6ac @ 16%
--accent    #c44900  burnt orange  #c44900  burnt orange
--deep      #432534  violet        #432534  violet
```

Violet is the "candlelight" surface: case-study hero overlays, quote blocks,
the footer. It is what stops the palette reading as plain navy-and-cream.

### Typography

**Keep Barlow Condensed 900 for display + Barlow 400/600 for text.** Already
loaded, already the site's voice, and condensed caps carry the editorial,
old-signage feel the palette is reaching for. One addition: **letterpress-style
tracking on section labels** (`.18em`, uppercase, 11px, muted) which is where
the "old maps" character actually lives — in the labels, not a novelty face.

If a serif is wanted for display, the pairing to try is **Fraunces** for
headlines against Barlow body. It is a real vintage register rather than a
costume. I'd ship Barlow first and treat Fraunces as a follow-up experiment,
because a display face swap is a one-line change and easy to A/B later.

### Grid and space

- Reading measure **660px** for prose; **1200px** page max.
- Generous vertical rhythm — Anna's spacing, not the current dense grid: 120px
  between major sections on desktop, 72px on mobile.
- Artifacts break the measure and run to 916px, so evidence reads as
  substantial rather than as an inline aside.

---

## 9. Layouts

### `/` home

```
┌────────────────────────────────────────────────────────────┐
│ TOMME DENNEY                        WORK  ABOUT  CV  PHOTO │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  SPATIAL & IMMERSIVE                                       │
│  PRODUCT DESIGNER                                          │
│  WHO PROTOTYPES                                            │
│                                                            │
│  I design experiences you enter rather than look at, and   │
│  I build them well enough to test. MS Extended Reality     │
│  (HCI), BFA Game Design — Northeastern.                    │
│                                                            │
│  ── one sentence on accessibility, stated as a value ──    │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  LEAD CASE STUDY                                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [ looping headset capture — video, muted, no sound ] │  │
│  │ INHABITING MEMORY                                    │  │
│  │ A family museum you enter on foot                    │  │
│  └──────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────┤
│  XR & SPATIAL     │  GAMES & INTERFACE  │  PHOTOGRAPHY     │
│  [gateway image]  │  [gateway image]    │  [gateway image] │
├────────────────────────────────────────────────────────────┤
│  TWO MORE CASE STUDIES (cards)                             │
└────────────────────────────────────────────────────────────┘
```

No hero card stack, no auto-advancing carousel. The homepage's job is to state
the positioning and hand off to one case study.

### `/work` index

```
ALL   XR & SPATIAL   GAMES   INTERFACE & UI   RESEARCH & EVALUATION   PHOTOGRAPHY
      ▔▔▔▔▔▔▔▔▔▔▔▔  (active filter underlined in burnt orange)

┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ cover image   │  │ cover image   │  │ cover image   │
│               │  │               │  │               │
├───────────────┤  ├───────────────┤  ├───────────────┤
│ INHABITING    │  │ HAPTIDRAW     │  │ BOFUM         │
│ MEMORY        │  │               │  │               │
│ Graduate      │  │ MIT Reality   │  │ 72-hour       │
│ thesis · XR   │  │ Hack · A11y   │  │ hackathon     │
│ CASE STUDY →  │  │ CASE STUDY →  │  │ PROJECT →     │
└───────────────┘  └───────────────┘  └───────────────┘
```

Cards distinguish **case study** from **project** so depth is advertised
honestly. Hover keeps the existing swap behaviour, recoloured: cover image
gives way to a violet panel with name + context.

### `/work/<slug>` case study

Single 660px column, artifacts breaking wider, process strip under the header
where earned. No sticky table of contents and no "more projects" rail — both
were removed in v1 for good reason.

---

## 10. Which projects lead, and why

1. **Inhabiting Memory** — graduate thesis. Problem framing, rejected
   directions, a real study, third-party critique. The lead.
2. **HaptiDraw** — accessibility for visually impaired users, at a hackathon.
   Carries the inclusive-design through-line no other project can.
3. **Game Interface Design (GAME3300)** — *a case study that does not exist yet
   and should.* Four discrete rounds of user testing, organized, analyzed into
   goals, changes implemented, externally graded 10/10 on iterative approach.
   **This is the most under-used asset in the archive** — it is the only
   project with a complete, documented, externally-validated usability process,
   and it appears nowhere on the site.
4. **Biometrics of Design / Buddy Run** — eye tracking and heart-rate
   instrumentation. Quantitative UX evaluation is rare in a junior portfolio.
5. **See Reality** — real clients, real shipping.

Games and horror work sit below as a body of craft.

---

## 11. Artifact files needed

The evidence rules can't be implemented without the files. Highest value first:

**Blocking for the two new case studies**
1. `User Testing Logs.pdf` (GAME3300) — the four rounds. Highest-value artifact in the archive.
2. `Buddy Run` final slides + the eye-tracking and heart-rate unit assignments.
3. Low-fi → high-fi wireframe pairs (ARTF2223), as separate files.

**Strong supporting**
4. `Iconography.pdf`; sketching project `Tomme.pdf` + `Tomme's Pitch.pdf`.
5. `Survey and analysis.pdf`; the heuristic critique + values-driven redesign.
6. The Designer's Oath, and the Designer's Court exercise.
7. Written instructor feedback / rubrics for anything above, for pull-quotes.
8. Room redesign photos; site-specific installation documentation.

**Still open from v1**
9. Headset captures for Inhabiting Memory — asset list already staged.
10. The Google Forms study data.
11. Session length and whether anyone reported discomfort.
