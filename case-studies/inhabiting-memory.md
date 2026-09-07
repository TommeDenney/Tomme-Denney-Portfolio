# Inhabiting Memory

**A VR family museum you enter on foot — six rooms, one per family member, built so a visitor stands inside a reconstructed room instead of looking at a picture of one.**

*Sole designer and developer · Two semesters, through April 2026 · Solo thesis, advised by Prof. Jamal Thorne · Unity, C#, URP, Meta Quest 3 (PCVR), a custom fork of MLSharp for splat rendering*

## The problem

Photographs preserve the surface of a moment and discard the thing memory actually uses to find it again: the space. Recollection rebuilds the room first — layout, light, where your body was — and the story second. Flat media fixes one perspective and asks you to accept it.

So the design question was not how to reconstruct a room accurately. It was **what has to be true about a spatial medium before someone stops evaluating it and starts remembering inside it.**

The failure mode here isn't a low frame rate. It's a visitor who came to stand next to their grandmother and instead noticed the artifacts.

## Constraints

- One year, two semesters, solo — design, capture pipeline, engine work, level design, study, write-up.
- Gaussian splatting — a capture technique that rebuilds a real place as a cloud of points you can walk through — fails loudly. Artifacts and unstable geometry, with no graceful degradation to design around.
- Standalone Quest 3 could render one or two splats at a time.
- The play space was one study room in the CAMD Immersive Media Lab.
- Real families. Some participants submitted photographs of relatives who had died.

## What informed the design

- **Six family interviews.** Every room came from what that person said about their own life, not from my reading of them.
- **A six-person study** with Northeastern students, run in an isolated room in the Immersive Media Lab.
- **Continuous informal testing** with classmates, friends, lab staff and faculty.
- **Prior art as precedent:** Tuvalu's national digital twin, Tanit XR's Tunisian heritage scans, Nancy Baker Cahill's *4th Wall*, and von Pechmann's *The Big Connection* — the closest and most instructive, because it makes genealogy navigable but keeps it diagrammatic.

## What I rejected

- **Photogrammetry.** Tried it. Clean geometry that degrades politely, but it reads as a *model* of a room rather than the room.
- **True temporal 4D splatting.** The correct way to do 4D. I attempted it, failed, and stopped rather than burn production time. Shipped a flipbook of discrete frames instead — big files, visible seams — because motion mattered more here than continuity.
- **Standalone Quest.** The accessible choice, given up early. A gallery where the exhibit two rooms over hasn't loaded is not a gallery.

## Three decisions that shaped it

**Real walking inside a module, teleport between modules.**
Embodiment is the whole argument, but the museum is bigger than any room I could put someone in, and smooth locomotion makes people sick. So the level is built in modules sized to the visitor's real play space: you walk inside one on your own legs, then teleport to the next. That preserved proprioception, removed artificial motion entirely, and turned a hardware limit into a compositional grid.

**Documentary reconstruction and interpreted identity in one building.**
An accurate scan of my mother's house preserves the house, not what it meant. I kept both, joined by a gallery metaphor: the splat is the artifact, the designed room is the wall label. Because each room came from its person's interview, the interpretive half is theirs rather than my reading of them.

**Hands, not controllers.**
Presence is a subtraction problem, and a controller is an object in your hand reporting continuously that you are operating a machine. I took the reliability risk on hand tracking and it held. It cost me the artifacts — objects you could pick up — which I cut for time.

## Outcome

I stripped the museum down to run the study. Participants stood in one place and viewed four reconstructions built from their own submitted photographs — no hub, no navigation, no family tree — because testing the whole museum would have produced a warm reaction I could not attribute to anything. Holding the source material constant and changing only the medium was the only way to isolate the claim.

Six participants completed both conditions: their own photographs on a flat screen, then spatial reconstructions built from those same photographs. Presence and emotional-response surveys after each, plus two written questions. The full response set is intact.

Some had submitted photographs of relatives who had died. They described standing next to them again — the strongest thing this project produced, and the thing I could not have designed for.

Presented at the XR thesis showcase in the Northeastern news/media room, under open critique. The critique converged on two points: optimize it, and show how it continues after graduation. Both have the same answer, and I know what it is — replace the flipbook with true temporal splatting, which encodes motion into each point rather than storing whole frames, and move the renderer off DirectX so it can target standalone headsets instead of a tethered PC. That is the difference between an argument and something a family could actually use.

**No participant in the study ever experienced the thing I actually designed.** The study validates the foundation the museum is built on. It does not evaluate the museum.

## What I'd change

I ran the study last — long research phase, twice as long in production, study at the end. Run mid-production, those six sessions could have changed design decisions instead of confirming a premise I had already built on. That is a sequencing mistake, not a research one.
