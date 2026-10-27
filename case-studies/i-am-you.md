# I Am You

**A VR horror game where you are not the hiker — you are the trail camera watching him, and the body you steer is his.**

*Two-person team with Nandita Venkat · Immersive Media: XR History & Theory (XR 5010), Northeastern · Fall 2024, roughly three weeks · Unity, VR · Character models by an external artist*

**My part:** the external-perspective control system, the forest level prototype, and commissioning the character models. Nandita built the trail-camera look — shaders and effects — the camera placement design, the campsite level and the AI navigation.

## The question

VR's entire promise is embodiment. First person, your hands, your body, your point of view. Almost every design decision in the medium is aimed at making you believe the body is yours.

We asked the opposite question: **can a player care about a character they do not inhabit?**

Not as a technical exercise. If the answer is yes, then presence and empathy are separable, and the medium has a second register available to it — one where the distance between player and character is the content rather than a failure to be minimised.

## The conceit

You are a trail camera. Your viewpoint sits where the cameras sit in the forest, and it never travels. You get head rotation and your hands, and that is all the movement you own. The locomotion controls the hiker's body instead — so you are watching a man walk while being the reason he walks.

The plan's own phrase for it is the best one: *you are puppeting yourself.*

He has lost his mother, lost interest in his life, and gone back to the forest they last hiked together with the Polaroid she left him. The wind takes the photographs. Recovering them means driving his body between camera positions, in the dark, while something follows him.

## Constraints

- **Three weeks, two people**, from a planning document dated 22 November to a final submission on 12 December, with a live demo two days before it.
- **A course about XR history and theory**, so the project had to argue something about the medium, not just work.
- **No character art capability in the team.** The hiker and the monster were commissioned from an outside artist, which meant the design had to commit to what they looked like early and could not iterate on them.
- **Fixed viewpoints are a hard limit on player agency.** Whatever we built had to stay interesting while the player could not walk.

## What informed the design

- **The Proteus Effect**, cited directly in our plan: the player keeps three-degree control of their hands and arms specifically so they can see their own limbs from outside themselves, which is the mechanism the theory says drives identification with a represented body.
- **Slenderman-style collection horror** as the structural model — hunt for scattered objects in a dark forest while something hunts you — chosen because it produces tension with almost no mechanics, which suited three weeks.
- **The course's material on what XR affords that other media cannot.** The whole project is an argument that a fixed third-person camera is only meaningful in VR, because only in VR is the *default* embodiment so total that removing it is a statement.

## What we cut

**The compass.** In the first version of the plan the player carried a compass that was not a real compass — its stated purpose was to point at a photograph hidden in the scene. By the second version it is gone from the mechanics list entirely.

[NEEDS INPUT: why did the compass come out? My guess is that a device pointing at the objective deletes the searching, which is the only thing the player actually does — but I would rather have your reason than my reconstruction.]

**Being watched.** A stretch goal in the first plan: on death, the view pulls back to reveal that something has been observing the whole session from further out. It was never built. It is also the best idea in the document, because it would have made the player's own vantage point part of the horror instead of just the interface.

## Key design decisions

**The camera never translates.** The player's viewpoint changes position only by cutting between fixed trail cameras — it never slides through space. Thematically that is the dissociation the project is about. Practically, a viewpoint that never translates is also the one locomotion model that cannot make anyone motion sick, because there is no visual movement for the inner ear to disagree with. The plan does not claim comfort as the motive, but it is the effect, and it is the reason a three-week VR prototype was demonstrable to strangers at all.

**The camera is the interface and the threat.** Trail cameras are how you find the photographs, how you keep track of the body you are steering, and how you discover the Ice Cream Man is behind you. One object carries navigation, orientation and dread, which is a lot of load for a mechanic that costs nothing to explain — everyone already knows what a trail camera is.

**A monster made of soft-serve.** The antagonist is the ghost of an ice cream parlour, manifested when melted ice cream hits a campfire, and he is a white blob with a swirl on top. The intended register was, in our words, over-the-top psychological concepts and slightly silly monsters. Making grief look ridiculous is a defensible choice — it keeps a student horror game from collapsing into self-seriousness — but it is a genuine bet, and a reader is entitled to think it undercuts the material.

**Desaturation as diegesis.** The trail-camera view is greyscale, vignetted and noisy, so the moment you are looking through a camera is unmistakable without any interface furniture explaining it. The colour of the world is reserved for when you are not.

## Outcome

**A working prototype, demoed on 10 December 2024** and submitted two days later: forest and campsite levels, the trail-camera shader treatment, AI navigation for the pursuer, the external-perspective control scheme, and Polaroids to recover.

Whether the central question got answered is a different matter. We built the conditions for the experiment — a character you steer without inhabiting — and we have no evidence about whether anyone empathised with him. The plan scheduled internal playtesting in its refinement phase.

[NEEDS INPUT: did that playtesting happen, and what did people do? Specifically: did anyone talk about the hiker as "him" or as "me"? That single detail is the answer to the question the whole project was built to ask, and it would take one sentence to record.]

## What I'd change

**Give the player something to do while standing still.** Fixed cameras solved comfort and theme and left the player with very little agency between camera cuts. Hands are tracked and barely used — a flashlight is the only reason to have them. The version of this that works gives the camera position itself something to manage.

**Build the watcher.** The reveal that someone has been observing you is the idea that turns a clever control scheme into a horror premise, and it was the first thing cut. It should have been the last.

**Test the actual thesis.** The project asks whether players can bond with a character they do not embody, and then measures nothing. Two people in headsets and a single question afterwards — *what did you call him?* — would have produced a real finding for a three-week prototype.
