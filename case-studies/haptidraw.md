# HaptiDraw

**A drawing tool for blind users: a stylus and a haptic exoskeleton that let you feel the line instead of seeing it.**

*Four-person team · MIT Reality Hack 2025 · Unity, Python, FastAPI, OpenCV, Haptikos exoskeleton, Logitech MX-Ink stylus*

## The problem

Every digital art tool assumes the person using it can see what they are making. Remove sight and almost nothing survives — not the canvas, not the cursor, not the feedback loop of drawing a line and looking at whether it went where you meant.

The interesting part is that the missing sense is not really vision. It is **the glance**: the free, continuous confirmation a sighted person gets that their hand is where they think it is. A blind user drawing has no way to check without stopping.

## What it does

An image silhouette is traced into vector anchor points. The Haptikos exoskeleton drives feedback per finger, and the Logitech MX-Ink stylus vibrates when your hand drifts off the vertex you are following. So the line is not something you look at afterwards — it is something pushing back while you draw it.

The same mechanism works in reverse: because the drawing is a set of anchor points rather than a bitmap, an existing image can be handed to a user to *read* by touch.

## The decision that made it work

**Feedback on deviation, not on position.** Reporting where the stylus is would mean constant vibration a user has to interpret continuously — noise pretending to be information. Reporting only when the hand *leaves* the intended line makes silence meaningful: no buzz means you are on the line, which is a signal a hand can follow without thinking about it.

Pairing that with per-finger haptics on the exoskeleton splits the two questions a hand is asking — *am I on the line* and *what shape am I in* — across two channels instead of overloading one.

## What we learned

Touch did not substitute for sight so much as do a different job. Feedback through the hand let users build a **mental map** of the drawing — a sense of the whole shape and where they were inside it — which is the thing a sighted person gets from a glance and which no amount of describing the image aloud provides. Adding audio alongside the haptics helped, but the spatial understanding came from the hand.

## Honest limits

This was built in a hackathon by four people against unfamiliar hardware, and it is a working demonstration rather than a validated tool. Getting the exoskeleton, the stylus and Unity to agree on a coordinate space took much of the available time, and calibrating the feedback so it read as *intuitive* rather than merely *accurate* was the hardest unsolved part.

[NEEDS INPUT: did any blind or visually impaired person use HaptiDraw? For an accessibility project this is the only question that really counts, and I would rather the page say "not yet" than let a reader assume. If someone did, what did they do that surprised us?]

## What I'd change

**Design the reading mode first.** We built drawing and got reading as a consequence of the vector representation. Reading is probably the more useful half — being handed a diagram, a map, or someone else's sketch and being able to feel it — and designing for that first would likely have produced a better drawing tool too.

**Stop assuming the line is the goal.** The system guides a hand along a predetermined silhouette, which is closer to tracing than to drawing. Tracing is the right first problem because it makes success measurable, but a tool for artistic expression eventually has to let someone make a mark nobody specified, and we did not get to what feedback means when there is no correct answer to deviate from.
