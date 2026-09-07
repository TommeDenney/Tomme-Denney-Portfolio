# Inhabiting Memory

**A VR family museum that lets you walk inside a photograph — built for families who want future generations to enter the spaces their relatives lived in, not just look at pictures of them.**

*Sole designer and developer · Two semesters, through April 2026 · Solo thesis, advised by Prof. Jamal Thorne · Unity, C#, URP, Meta Quest 3 (PCVR), a custom fork of MLSharp for Gaussian splat rendering, Google Forms*

---

## Context and problem

Every photograph is a negotiation with loss. You point a camera at a birthday, a kitchen, a face you love, and you accept that what comes back is a flattened echo — two dimensions where there were three, one fixed perspective where you were free to move.

That trade is so normal it's invisible. But it doesn't match how memory works. People don't remember what a photograph looked like. They remember being somewhere: the layout of the room, where the light came from, how it felt to move through it. Autobiographical memory reconstructs *space* before it reconstructs narrative — the room comes back first, then what happened in it. Photography preserves the surface of a moment and discards the structure that memory actually uses to retrieve it.

So the design problem I took on was not "how do I reconstruct a room accurately." Accuracy is a capture problem and it's largely solved. The problem was: **what has to be true about a spatial medium before someone stops evaluating it and starts remembering inside it?**

That's a design question, and it has a hard edge to it. The failure mode isn't a bad frame rate — it's a user who came to stand next to their grandmother and instead noticed the artifacts. When the medium becomes visible, the memory leaves. Everything downstream in this project is about protecting that one fragile state.

**Why this had to be spatial.** The thesis claim only exists in a headset, and I built the study to prove exactly that. A flat screen can hold your attention and move you emotionally, but it cannot relocate you — you are always on the outside of the rectangle. A spatial reconstruction puts your body in the room, which is the same channel the memory was encoded through in the first place. If that difference is real, it should show up when you hold the source photographs constant and change nothing but the medium. That comparison became the study.

## Constraints

- **One year, two semesters, solo.** Design, capture pipeline, engine work, level design, study, and write-up were all mine. Prof. Thorne advised; nobody else wrote code, captured footage, or made art.
- **Gaussian splatting was the medium, and it is volatile.** It produces a quality of spatial continuity that photogrammetry struggles to match, and it fails loudly — artifacts, unstable geometry, flicker. There is no graceful degradation to design around.
- **Standalone Quest 3 could render one, maybe two splats at a time** at the point I was building. That single fact decided the platform.
- **The play space was a study room in the CAMD Immersive Media Lab.** Whatever locomotion I designed had to work in a room that size, for someone tethered to a PC.
- **Real families, real grief.** Participants supplied their own photographs and video, and some of those photographs were of people who had died. That ruled out any interaction that treats a person as a prop, and it ruled out shipping anything that glitched in front of a face someone loved.
- **No established 4D splat capture pipeline to inherit.** Temporal reconstruction was still research-grade, which put a ceiling on what "a moment as it was unfolding" could actually mean this year.

## What informed the design

**Family interviews (6 people).** I interviewed each of my immediate family members — my mother, my father, Jasmine, Troy, Ryan — about their own lives, and designed their rooms from what they told me. None of the six rooms is my interpretation of them. Every idea in them came from the person it belongs to. My own room is the one exception, and I built it the same way.

**A controlled study with 6 participants.** Northeastern students, run in an isolated study room in the CAMD Immersive Media Lab. Within-subject: each person first viewed their own submitted photographs and video on a flat screen, then entered splats built from those same materials in a Quest 3. Presence survey and emotional-response survey after each condition, plus two written questions. Responses are in Google Forms.

**Informal testing throughout, with anyone I could get into a headset** — classmates, friends, lab staff, faculty. This was continuous rather than structured, and it's where most of my iteration signal came from. [NEEDS INPUT: name two or three specific things you changed because of what you watched someone do in the headset. This is the highest-value gap in the document — one concrete "I moved X after watching three people do Y" is worth more than the whole informal-testing paragraph.]

**Prior art, read as design precedent rather than as literature.** Tuvalu's national digital twin (LiDAR scans of all 124 islands, a citizen-curated cultural archive, statehood asserted independent of territory) established that spatial reconstruction can be a response to loss rather than a documentation exercise. Tanit XR's work on Tunisian heritage sites showed reconstruction as *mediated return* to places that are no longer reachable. Nancy Baker Cahill's *4th Wall* showed spatial media changing how a place is perceived even after the work is removed. Ludwig von Pechmann's *The Big Connection* — 500+ individuals across 13 generations in navigable 3D — was the closest precedent and the most instructive, because it showed me what I did *not* want: it makes genealogy navigable but keeps it diagrammatic. Relationships stay objects you fly around instead of rooms you stand in.

**An ethical frame that functioned as a constraint, not a values statement.** Dignity, autonomy, human rights, interpersonal care. In practice that meant families keep control of representation and access, and it meant designing for someone who might be blindsided by their own reaction. [NEEDS INPUT: was there IRB or equivalent human-subjects review, and what did the consent process look like? A design researcher reading this will look for it, and "yes, IRB-approved" is a sentence you want here.]

**A research phase that ran long.** Photogrammetry, conventional 3D modeling, and multiple splat pipelines all got tried before I committed.

## Explorations and what I rejected

**Photogrammetry and conventional 3D modeling.** Tried both in the research phase. Photogrammetry gives you clean, portable geometry and it degrades politely — but it also reads as a *model* of a room rather than the room. It loses the soft, continuous, light-carrying quality that makes a splat feel like a place your eyes accept. I was choosing between a medium that fails gracefully and one that succeeds harder, and for a project whose entire claim rests on the user forgetting they're looking at a reconstruction, I took the one that succeeds harder and spent the rest of the year managing its failure modes.

**True temporal Gaussian splatting.** This is the one that actually hurt. Temporal splatting encodes motion into each splat as a trajectory function, so position, rotation, scale, and opacity can be evaluated continuously from a single compact file. It is the correct way to do 4D. I attempted it in the research phase, failed, and made the call to stop rather than spend production time on it. What shipped instead is a flipbook: discrete PLY snapshots played in sequence. It costs enormous file sizes and the transitions between frames are visibly discontinuous. I kept it anyway, because one moving splat per participant does something four static ones cannot — a static reconstruction gives back a place, and a temporal one gives back a place that was still happening. Losing continuity was worth keeping motion. Replacing the flipbook is the first thing on the technical roadmap.

**A single person's life timeline.** Before this was a family museum, it was one person's life laid out as a sequence of events, and before *that* it was pure reconstruction research with no person in it at all. Prof. Thorne didn't reframe the project for me — he nudged it, and the nudge was that it needed to be personal. The single-person timeline was the intermediate step, and it lost because [NEEDS INPUT: why did you move off the one-person timeline to a family? Was it that a timeline is still a diagram — a line you walk along rather than rooms you enter? Or that one life didn't carry the intergenerational argument? Your answer here is a strong paragraph and I don't want to invent it.]

**Standalone Quest 3.** The obvious accessibility choice and I gave it up early. Standalone could hold one or two splats; I needed every splat visible from a given vantage point to render at once, because a gallery where the exhibit two rooms over hasn't loaded yet isn't a gallery. Going tethered PCVR bought the headroom, and the cost I expected — a cable ruining the sense of being somewhere else — never materialized, because the lab's cable was ceiling-mounted and nobody in the study mentioned it. Portability is the real thing I traded away, and it's the reason "how does this survive past graduation" was the sharpest question I got at the showcase.

## Key design decisions

### 1. Real walking inside a 5×5 module, teleport between modules

**The tension.** The whole thesis rests on embodiment — memory is encoded through moving your body through space, so the reconstruction has to be entered on foot, not flown through. But a museum with a hub and six rooms is much larger than any room I could put a participant in, and every standard solution to that problem attacks the thing I was protecting. Smooth stick locomotion induces sickness through vection, and sickness is not a comfort footnote here: a nauseated user is a user who has stopped remembering. Free room-scale walking respects the body but caps the world at the size of the study room.

**What I chose.** I built a custom locomotion system around a module sized to the visitor's real play space. Inside a module you move by walking — physically, with your own legs. To go anywhere else, you teleport to the next module. Then I designed the level *in that unit*, so every gallery piece got its own room-sized frame.

**The reasoning.** One move resolved three problems. It preserved proprioception, which is the mechanism the argument depends on. It eliminated artificial motion entirely, so there's no vection to make anyone sick. And it turned a hardware limit into a compositional grid — the module became the unit of curation, which is why each piece can feel like its own space instead of an object in a hallway. Constraining freedom to a 5×5 square and then making that square the design language produced *more* apparent freedom than smooth locomotion would have, and it did it without asking anyone's inner ear for a favor.

[NEEDS INPUT: how long is a full pass through the experience, and did anyone report discomfort or nausea? Even "nobody reported motion sickness across roughly N sessions" is a defensible comfort claim and this section wants it.]

### 2. Documentary reconstruction and interpreted identity in the same building

**The tension.** A perfectly accurate reconstruction of my mother's house preserves the house. It does not preserve what the house meant, or who she is. Fidelity and meaning are different objectives and they pull in opposite directions — the more I designed, the less I was preserving; the less I designed, the more I was just producing a very good scan.

**The options.** Ship a pure archive and let accuracy carry it. Ship a pure interpretive art piece and drop the preservation claim. Or hold both in one experience and take the risk that neither reads cleanly.

**What I chose.** Both, joined by a gallery. Splat reconstructions do the documentary work — real captured environments, spatially faithful. Then each family member has a designed space built from their own interview: Jasmine's is burgundy and gold, Harry Potter–inflected, with insulin vials falling like rain for her daily life with Type 1 Diabetes. Troy's is a DJ setup on the surface of the moon with Earth rising behind it. Ryan's carries a religious aesthetic, winged treble clefs and a microphone, for his singing. My mother's opens into a garden under clear sky, surrounded by her paintings. My father's is a fishing boat on a calm lake. Mine is an airplane cabin whose windows look out on places I've traveled.

**The reasoning.** This was the deliberation that took longest — not whether to include both, but what the container should be. I kept coming back to a classical art gallery, where the pieces on the walls are moments you can step into rather than images you stand in front of; the closest reference I had was the archive sequence in *Ready Player One*, where a person's memories are exhibited as spaces. Once the gallery metaphor held, the split stopped being a contradiction: the splat is the artifact and the designed room is the wall label, and a museum has always been a place where documentation and interpretation sit inches apart without anyone finding it strange. It also settled the authorship problem. Because every room came from the interview rather than from me, the interpretive half isn't my reading of my family — it's theirs, spatialized.

[NEEDS INPUT: what layouts did you try and throw out before the gallery? A literal reconstruction of the family home? An abstract void? Naming even one discarded layout makes this a decision rather than an origin story.]

### 3. Hands, not controllers

**The tension.** Presence is a subtraction problem — every layer between the user and the space is a reminder that the space is a rendering. A controller is a plastic object in your hand telling you continuously that you are operating a machine. But hand tracking is the less reliable input, and it degrades in exactly the conditions a memory piece tends to live in: dim light, hands at rest, hands in your lap.

**What I chose.** Hand tracking, with a custom interaction layer I built for menu navigation and teleport selection. Your hands are your hands.

**The reasoning.** If the user's own body is the instrument the medium is exploiting, handing them a proxy for that body is self-defeating. I took the reliability risk and it held: hand tracking gave me no trouble in the lab conditions the study ran in, and I kept the gesture vocabulary small enough that there was very little to go wrong.

**What it cost.** I had built toward object interaction — artifacts in each room, things you could pick up that represented pieces of a person's life. I cut them. There wasn't time to implement them to a standard where handling an object that stands in for someone's life would feel like anything other than physics. Cutting them is the right call and it's still the biggest hole in the experience: right now the rooms are inhabited but not handled, and reach is the one embodied channel I'm not using.

[NEEDS INPUT: how did you onboard someone who had never worn a headset? Was there a tutorial, a spoken walkthrough from you, a first module that teaches teleport? Several of your six participants were probably first-timers and this is a question every XR design interview asks.]

### 4. Cutting the museum down to four splats to run the study

**The tension.** The experience I designed is a hub, six rooms, spatial navigation, hand-tracked menus, static and temporal splats, and personalized audio. As a study instrument it's useless — too many variables to attribute anything to anything, and it takes the participant's family out of it entirely, because it's *my* family. The thesis needed an answer to one question: does changing the medium change the relationship to the memory?

**The options.** Test the full museum and get rich, unattributable reactions. Skip the study and argue the case from design and literature. Or reduce the build to the single comparison and accept that I'd be testing the premise instead of the product.

**What I chose.** I stripped it. In the study build the participant stands in one place and views four splats generated from materials *they* submitted — three static, one temporal — each composed specifically for the person in it. No hub, no navigation, no family tree. They see their own photographs and video flat on a screen first, then stand inside reconstructions of those same materials. Source material held constant, medium the only thing that changes.

**The reasoning.** The claim I had to defend was about the medium, not the museum, and mixing the two would have produced a warm reception I couldn't attribute to anything. Removing locomotion also removed a confound I would otherwise have had to argue away for the rest of my life. I also deliberately did not frame the flat condition as a deficient control — it's how everyone currently experiences their own recorded memories, and the comparison is about what becomes possible, not about photography being bad.

**What it cost, stated plainly.** No participant in the study ever experienced the thing I actually designed. The study validates the foundation the museum is built on; it does not evaluate the museum. Those are two different claims and the case study should never blur them.

## The result

You put on a Quest 3, tethered, standing in a room roughly the size of the virtual module you're about to occupy.

You arrive in a central hub whose job is to orient you and set the tone before it asks you for anything. From here the family is spatially arranged rather than listed — you go to a person by going *toward* them. Movement inside your current module is real walking: you take steps, your body reports them, and the space responds the way a space does. When you want to be somewhere else, you raise a hand, select, and arrive. There is no drifting, no stick, no artificial motion at any point.

Enter a room and it does two things at once. There's a splat reconstruction — a real environment, captured and rebuilt, that holds together as a place when you move your head inside it. And there's the room's back wall opened out into the person: the garden, the lake, the moon, the insulin rain. Sound is placed in the space to match, sourced from what the person described rather than from a library, because sound is one of the strongest retrieval cues there is and a reconstruction that's silent is a reconstruction you evaluate visually.

One splat in each set moves. It's a flipbook — discrete frames, visible seams — and it is still the piece people react to, because a still reconstruction gives you a room and a moving one gives you a room where time is passing.

Underneath: I forked and modified an existing splat renderer to get the files behaving in-engine, and wrote an occluder that culls splats the way occlusion culling culls geometry, which is what made a room full of simultaneous reconstructions possible at frame rate.

## Outcome

**Six participants completed both conditions** in the CAMD Immersive Media Lab: presence survey, emotional-response survey, and two written questions after each. The full response set is intact in Google Forms.

[NEEDS INPUT — THE MOST IMPORTANT GAP IN THIS DOCUMENT: what do the six responses actually say? Direction and rough magnitude on spatial presence, involvement, realism, nostalgia, familiarity, connection, sense of return. Do not write "participants consistently reported" anything until this is filled from the data. With n=6 the right register is "five of six rated X higher in the VR condition," not a percentage.]

**Some participants had submitted photographs of relatives who had died.** They described standing next to them again. That reaction is the strongest evidence this project produced, and it is also the thing I could not have designed for or predicted — I built a comparison of two media and got someone standing beside their grandmother. [NEEDS INPUT: how many participants was this, and pull two or three verbatim lines from the written responses. Their exact words will carry this section better than any survey number, and quoting real participants is the one place in this case study where language stronger than mine is available.]

**Presented at the XR thesis showcase** in the Northeastern news/media room — no traditional closed defense, but a presentation to a large audience of students, faculty, and staff from across the university, followed by open critique and audience questions.

**The critique converged on two things:** optimize it, and show how this continues after graduation. Both are fair and both point at the same root cause — it's tethered PCVR with flipbook 4D and multi-gigabyte assets, which is a working demonstration of the argument rather than something a family could use. Nobody challenged whether spatial preservation was worth doing. They challenged whether *this build* could survive contact with the world, which is a better problem to have.

[NEEDS INPUT: grade, and any archived written feedback from Prof. Thorne or the showcase. Instructor feedback in someone else's words is the most defensible outcome evidence student work can carry.]

**Not shipped.** It's a working thesis system built around one family, with a six-person study behind its central premise. That's what it is and it's worth presenting as exactly that.

## Reflection

**I ran the study last.** Long research phase, twice as long a production phase, study at the end. That ordering meant the study could only ever confirm or fail to confirm a premise I had already spent a year building on — it couldn't change anything. Run mid-production, those six sessions would have told me which of my design commitments were doing work and which were mine rather than the participants', and I'd have had a second round to act on it. This is the decision I'd reverse, and it's a sequencing mistake rather than a research one: I treated the study as evidence for the thesis instead of as an instrument for the design.

**The optimization critique was correct and I'd take it earlier.** Choosing tethered PCVR was right for the demonstration and wrong for the argument. The project claims to be infrastructure for families, and the build requires a lab. Moving the pipeline off flipbook 4D onto true temporal splatting and off the current renderer onto something that can target standalone and mobile XR isn't polish — it's the difference between an argument and a thing.

**I'd rebuild the artifacts.** Cutting handleable objects was the right call under the deadline and it left the rooms strangely untouchable. Reach is a channel I proved I care about by choosing hand tracking and then didn't use.

**What I'd keep without changing a line:** the 5×5 module, and building every room from the person's own interview. Those two decisions are why the experience feels like a place rather than a menu, and why the interpretive half is defensible as preservation rather than as my art about my family.

---

# Assets to capture or dig up

Stills cannot carry this project — the entire claim is about what happens when you can move. Video first.

**Video (highest priority)**

1. **Headset capture, one full pass: hub → walk within a module → teleport → enter a room.** *Proves the 5×5 locomotion system and the gallery structure — the single best design decision in the project, and completely invisible in a screenshot.*
2. **Headset capture of a temporal splat playing, with the user's head moving.** *Proves the difference between a place and a moment, and proves the reconstruction holds together under parallax. Shoot it head-moving; a static camera turns it back into video.*
3. **Third-person capture of a participant in the study room — body walking the module, hands raised to teleport.** *Proves this is a physical, embodied experience and shows the real play space that constrained the design. Get a headset-view/room-view split screen if you can.*
4. **Side-by-side: the same submitted photographs flat on a screen, then the splat built from them.** *This is the study's argument in fifteen seconds and should probably be the first thing on the page.*
5. **Hand-tracked menu and teleport selection, close on the hands.** *Proves the interaction layer and the no-controller decision.*

**Stills and diagrams**

6. **One frame per family room** — garden, lake, moon DJ setup, insulin rain, treble clefs, airplane cabin. *Proves the interpretive half is specific and came from six different people, not one aesthetic.*
7. **The iPad mockups, as-is, unretouched.** *Proves process. Do not clean these up — legible thinking beats a tidy artifact, and this is the exact evidence your current portfolio lacks.*
8. **Hub layout / spatial family arrangement, top-down.** *Proves the museum is composed rather than assembled.*
9. **The 5×5 module diagram: real play space → virtual module → teleport network across the level.** *If you make one new diagram, make this one. It's your strongest design idea and there is currently no image of it.*
10. **A failure state — artifacts, unstable geometry, a broken reconstruction.** *Proves you understand the medium's failure mode. Showing the ugly frame and explaining what you did about it reads as command; hiding it reads as luck.*
11. **Before/after of the splat occluder, with frame counts.** *One image, establishes the engineering credential without giving it a paragraph.*
12. **Capture-session photos and raw submitted source material** (with consent). *Proves real people and real materials went in.*
13. **The Google Forms instrument itself** — survey pages, the two written questions. *Proves the study was designed, not improvised.*
14. **A showcase photo from the NU news/media room.** *Proves it was presented publicly and defended live.*

**Do not lead with** a static hero render of a splat. It looks like a photograph with noise, which undersells the whole project to anyone who hasn't worn a headset.

---

# Gaps — every `[NEEDS INPUT]` in this draft

**Blocking (the case study is materially weaker until these are filled)**

1. **Study findings.** What do the six response sets actually say — direction and rough magnitude across the presence and emotional measures? Nothing goes in the Outcome section until this is answered from the data.
2. **Verbatim participant quotes**, especially from participants who submitted photographs of relatives who had died, and how many participants that was.
3. **Informal testing → specific changes.** Two or three things you altered because of what you watched someone do in a headset.

**Important**

4. Full pass duration, and whether anyone reported discomfort or nausea.
5. Onboarding for first-time headset users — tutorial, spoken walkthrough, or a teaching module.
6. IRB or equivalent human-subjects review, and the consent process.
7. Why the single-person life timeline lost to the family tree.
8. Layouts you tried and discarded before the classical-gallery metaphor.
9. Grade, and any archived written feedback from Prof. Thorne or the showcase critique.

**Small factual**

10. `5×5` — feet or meters?
11. Project start month/year (for the metadata line).
12. Exact name and link for the renderer you forked ("MLSharp") so it's citable, plus what you shot your own family's captures on.
13. What the hand-tracked menu actually does — the paper frames navigation as "spatial rather than menu-based," but you've said menus are part of the core experience. Worth one clarifying sentence so the two don't read as a contradiction.
