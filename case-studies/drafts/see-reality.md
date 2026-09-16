# See Reality

**Immersive AR, MR and VR built into tours that were already running — deployed for tour operators, municipalities and guides in Boston, Lexington, Nashville, Prince Edward Island, Rome, Pompeii and Venice.**

*See Reality · Client work, multi-year, ongoing · Unity, C#, URP, Meta Quest, mobile AR, lightweight AR glasses, 360° video, Normcore*

**My part:** I am one of the developers on the studio's experiences. Across the projects below I contributed to interaction design, Unity implementation, iteration against what guides reported back from the street, and the unglamorous work of getting a build to survive a real tour day. I did not make every part of every experience — where this page says *our team*, that is what it means. The exception is the Venice multiplayer racing work, which is mine and is in progress.

[NEEDS INPUT: which of these experiences am I credited as lead developer on, and which did I contribute to as one of several? This page hedges at the same strength throughout, which is accurate for most of it and undersells the ones I owned end to end.]

## What this actually is

See Reality is a B2B studio that builds immersive experiences for tour operators, municipalities, museums and historical attractions, and then integrates them into tours those clients are already selling. Its own line is *bringing history to life with XR adapted for tours*, and the adapted is the entire job.

That makes this a different problem from most of the XR in a portfolio. Nothing here is a prototype that gets three minutes on a conference floor from an audience that already owns a headset. These are products with a ticket price, run on a schedule, in public, by staff who did not build them, for people who did not come for the technology and in many cases have never worn a headset in their lives.

Across several years it has also stopped being one kind of work. The same body of projects covers room-scale mixed reality on Quest, mobile AR triggered from street signage, tablet-delivered content a guide holds up, cinematic 360° on lightweight AR glasses, hand-tracked physical interaction, location-registered reconstruction, five-language localisation, and — currently — networked multiplayer. I did not choose that spread; the clients did, one deployment at a time, which is the reason it is broad rather than tidy.

## The constraint everything else follows from

The XR is one chapter of somebody else's experience. A guide is standing there, mid-story, with a group who paid for a two-hour tour, and the headset gets a few minutes of it. Everything below follows from that:

- **The guide is not being replaced.** The design target is a segment that hands the group back, on time, in the mood the guide needs them in. An experience that is too long, too absorbing, or too hard to exit fails even when it is good.
- **The audience is whoever bought a ticket.** Families, children, older adults, tourists working in their second or third language, people with no interest in the hardware and no patience for it. First-time users are the default case, not an edge case.
- **Up to twenty of them at once**, with mixed hardware across the group, sometimes with no usable network — the studio's own capability list includes offline device communication and group support at that scale.
- **The hardware is a design decision, not a given.** See Reality's answer is *History Glasses*: roughly 400 g, held up to the eyes like binoculars rather than strapped to the head, so a visitor never loses sight of the guide, the group or the street. That one hardware choice encodes the whole argument about what XR is for on a tour.
- **Outdoors, in daylight**, on brick and glass, in places full of moving strangers who walk straight through the scene.
- **Operators run it, not developers.** Guides fit it, launch it, reset it between groups, recover from it in front of a paying audience, and do that again all day. If a build needs the person who wrote it, it does not work.
- **Different countries and different sites**, which means language, signage, physical layout and staff training all change while the software is supposed to stay the same.

## Relive 1776, on the Freedom Trail

My earliest See Reality work fed into what became [Relive 1776](/work/relive-1776), the operation that runs mixed-reality Revolutionary-era Boston along the Freedom Trail. It sells publicly as [Relive 1776: See Boston's History in Augmented Reality](https://www.tripadvisor.com/AttractionProductReview-g60745-d28008309-Relive_1776_See_Boston_s_History_in_Augmented_Reality_AR-Boston_Massachusetts.html) — a two-hour guided tour carrying five experiences, rated 4.9 out of 5 across 83 TripAdvisor reviews at the time of writing.

The collection our team built for it:

- **Sons of Liberty** — Revolutionary-era Boston and the men organising in it.
- **Five Shots at Midnight** — the events running into the Revolution, staged where they happened.
- **17th-Century Faneuil Hall Market** — a reconstruction of the market that stood on the ground the group is standing on, stalls and traders and hanging goods layered over Quincy Market's real colonnade.
- **Paul Revere's Ride** — the ride, from inside it.
- **Bunker Hill Cannon** — a procedure, taught by hand. It gets its own section below, because it is the most transferable thing on this page.

The reason this collection is worth showing is not the subject matter. It is that the content is registered to the actual place: the market lines up with a building that is still there, the cannon sits on real bricks, and tourists who did not pay for anything walk through the frame while a guest is working the gun.

## The Bunker Hill cannon, and why it matters most

The cannon experience teaches a visitor to operate a historical field gun. Not watch one — work one, in order: the charge out of the bucket, the ball, the rammer, the aim down the plaza, the linstock, the report and the smoke. Get a step wrong and it does not fire.

Stated generally, that is the same problem as simulation-based training:

> A real procedure, decomposed into steps, translated into physical interactions, wrapped in feedback that tells a novice what just happened and what is next — until someone who has never done it completes it unaided.

Everything that makes that hard in a training context is present here in miniature. The steps have a required order and the design has to make the order discoverable without a manual. The tools have to afford their use on sight, because nobody is reading instructions in a public square. Feedback has to be immediate and physical, since the user cannot be told what went wrong by a mentor watching over their shoulder — and in fact there *is* a mentor, the guide, which makes this a two-person instructional situation rather than a solo one. The window is minutes. The user is a stranger. It has to work the next time too, with a different stranger.

It is entertainment, and I will not dress it up as certification: nothing is assessed, scored or recorded, and no one is being signed off as competent. But the interaction grammar — sequence, tool affordance, error state, recovery, completion by a novice — is the grammar of a training build, and I have already shipped it to the public.

## Featured deployments

Each of these has its own page carrying the operator's own capture of it running: [Relive 1776](/work/relive-1776), [Town of Lexington](/work/town-of-lexington), [Nashville Adventures](/work/nashville-adventures), [ShowMeItaly](/work/showmeitaly), [Ride Solar](/work/ride-solar) and [Venice City Tours](/work/venice-city-tours).

### Ride Solar — Prince Edward Island and Nova Scotia

See Reality partnered with [Ride Solar](https://ridesolar.com/) to put XR inside two live tours in Canada: a historic walking tour and a food-and-drink tour where the immersive content is tied to what is being eaten and where it came from. Around six experiences were integrated across the two itineraries — the operator advertises four "time moments" on the walking tour and three on the tasting.

Guests step onto a 19th-century lobster boat and deal with the crew, meet the figures behind Canadian Confederation, walk a market of the Anne of Green Gables era, and run into dinosaurs, all while the tour keeps moving. The design question on this one was pacing rather than fidelity: each segment has to end cleanly enough that a guide can pick the group back up and carry them to the next stop.

### Town of Lexington, Massachusetts

I contributed to See Reality's work for the [Town of Lexington](https://www.tourlexington.us/) — a municipal client, not a private operator, which changes the brief. Lexington runs a walking-tour programme with more than twenty-five guides, so the target was not one polished flagship but three AR/XR experiences that any guide could drop into a tour they already give, on tablets and headsets, without rehearsal.

Visitors stand where buildings no longer exist and see them reconstructed — the publicly listed version is a twenty-minute mixed-reality tour built around two colonial house models, the Meeting House and the Belfry — meet historical figures including Anna Harrington, and are put inside moments from the Battle of Lexington in April 1775, standing on the ground where those events happened.

Lexington's deployment was covered by Boston's 7NEWS in a segment titled *High-Tech History*, with the town's tour services coordinator, a select board member and See Reality's CEO all on camera. Nashville's got the same treatment on *Talk of the Town*. Press coverage is not evidence that a design is good, but it is evidence that a municipality was willing to put its name on it.

The part I find most interesting is the half that has no guide at all: free mobile AR triggered by QR codes on city signage, for a visitor who wanders up with a phone and no ticket. Same content problem, no staff, no hardware, no onboarding, no second chance — which is a much stricter usability test than a guided segment where a person is there to help.

### Nashville Adventures

For [Nashville Adventures](https://www.nashvilleadventures.com/) our team designed and built four XR experiences threaded through a single guided walking tour: the city's original settlers at Fort Nashborough, its historical architecture, early Music City, and the rock-and-roll era of the clubs and streets the group is walking down. The scenes layer onto the physical city while participants keep listening to a live guide — the experiences are cut to the guide's storytelling rather than competing with it.

### ShowMeItaly — Rome and Pompeii

[ShowMeItaly](https://showmeitaly.com/) is one of the larger operators working Rome and Pompeii, and See Reality built seven experiences sold into their tours as a paid immersive add-on: meeting Julius Caesar, fighting gladiators from the floor of the real Colosseum arena, four temples of the Roman Forum, an ancient Pompeii market, and Pompeii before and after Vesuvius. Their own page puts it more plainly than a case study can — *then we hand you a VR headset and you fight a gladiator in it, explore the Pompeii market and more.*

What matters here is commercial rather than technical. This is XR sold as an upsell inside an operation running tours at Roman volumes, which means the failure modes that count are throughput, device turnaround between groups and how fast a guide can recover a guest who is stuck. I am not going to print a visitor number I cannot verify.

### Venice City Tours

For [Venice City Tours](https://www.venicecitytours.it/) we built several experiences, two of which are worth separating:

**A cinematic 360° piece on lightweight AR glasses**, localised into five languages so an international group can each take it in their own — the operator's own audience runs across Italian, English, French, German and Spanish. Localisation is not a translation pass when the content is timed to a guide's narration; it changes pacing, subtitle budget and how long a segment takes.

**An XR gondola simulator**, where a participant paddles through a stylised medieval Venice while the guide carries on managing the group in the real world. Paddling is the whole interaction: physical, obvious on sight, and impossible to get wrong in a way that embarrasses somebody in front of a group.

## The Venice multiplayer work, in progress

I am currently building a **multiplayer gondola racing experience** off the back of the Venice project, networked with **Normcore**. Multiple participants in one shared scene, synchronised state, racing each other rather than taking turns.

It is in development. Nothing about it is deployed, and I am not going to describe it as shipped.

It matters to me because of what it changes about the problem. Everything above is a single-user experience running next to other single-user experiences; a networked one has to agree with itself across devices, on operator networks, with guests who joined at different moments and hardware that is not identical. That is the same step a training experience takes when it stops being one trainee at a station and becomes a team running a procedure together, which is where I want this line of work to go.

## Additional experiences

Other See Reality work I have contributed to, in less detail because some of it has no public deployment name I can confirm:

**SeeSightTours — NiagaraXR.** An XR experience built around Niagara tourism.

**Founding of Canada.** An immersive historical experience about the founding of the country.

**Temple of Artemis.** A historical reconstruction of the temple. [NEEDS INPUT: which operator or site is the Temple of Artemis experience deployed with, and is it live yet?]

**A 360° experience for lightweight AR glasses**, built against VITURE and XREAL hardware. [NEEDS INPUT: what is the client and the released name of the VITURE/XREAL 360° experience?]

**Stonehenge.** A reconstruction of the stones at full scale — in the studio's own capture reel it is standing in the middle of the Faneuil Hall plaza, which is the clearest demonstration I have of what location-based scale actually does to a person. [NEEDS INPUT: what is the commercial name and client for the Stonehenge experience?]

**SpongeGuy.** An experience carried internally under that name. [NEEDS INPUT: what is SpongeGuy, and what became of it?]

**A Liverpool FC fan experience**, from the sports end of the studio's client list rather than the heritage end.

**Experiences for children** — The Dino, The Dragon, Dancing Red Coat Soldiers, and a Kids Mini Cannon. These are not a lesser version of the adult work. A nine-year-old in a borrowed headset on a public street is the hardest user in the entire portfolio: no patience for onboarding, no fear of breaking anything, and an adult standing next to them who wants to see it work in the first five seconds.

## Designing for someone's first ten minutes in a headset

The population these experiences actually serve has never used one. That single fact drives more design decisions in this work than any other:

- **The setup is part of the experience.** A guide kneeling to fit a headset onto a child is not overhead around the design; it is the first ten seconds of it, and it has to go quickly with a group waiting.
- **Nothing that must be explained.** No menus to learn, no controller mapping, no tutorial level. Hand tracking helps here for a reason that has nothing to do with elegance: there is no controller to hand over, explain, drop or lose between groups.
- **One gesture, obvious on sight.** Reach for the bag of powder. Take the paddle. Point at the soldier. If a guest has to be told, the design has already failed the person who cannot hear the guide.
- **Per-person setup time is the real budget.** Twenty guests and a fixed tour clock means the cost of every second of onboarding is multiplied by twenty, in public, with a queue.
- **Dignity in front of strangers.** Nobody wants to look foolish in a public square wearing something on their face. Interactions that cannot be performed badly are worth more than interactions that are impressive.

This is the part of the job that reads as accessibility work even though nobody calls it that: the design target is a novice, in public, under time pressure, with no manual and no second attempt.

## Location-based XR, and the operational half nobody photographs

Registration to a real place is the medium here. The cannon has to sit on the plaza's actual bricks. The 17th-century market has to line up with a colonnade that is still standing. A dragon has to pass through the real trees above a real square, at a scale that reads from the ground. Get the alignment wrong and the effect does not degrade gracefully — it stops being the place and becomes a screensaver.

Underneath, this is Unity and C# on Meta Quest hardware with URP render pipelines tuned for standalone passthrough — the performance ceiling on a standalone headset is unforgiving, and the work of holding frame rate on a device with no tether is most of what makes a build deployable.

The other half of the job is the part no one puts in a showreel. Devices charged, stored, cleaned and accounted for. Sunlight and heat. Boundaries in a public square full of pedestrians. Resets between groups. Builds that have to behave the same across a fleet that is not on the same firmware. Staff who need training that survives their turnover. Failures that happen in the middle of a scheduled tour, where the only acceptable recovery is one a guide can perform in fifteen seconds.

What I took from that is a standard I apply to anything now: a build is not finished when it demonstrates well. It is finished when someone who did not write it can run it twelve times a day without me.

## Where this points

I am aiming at XR training, simulation and interaction design, and I want to be exact about how this work relates to that, because the overclaim is easy and wrong: See Reality is a tourism and location-based entertainment studio. It is not an industrial or biomanufacturing training company, and none of these experiences certify anybody in anything.

What does transfer is the method, and it transfers directly:

- Translating a real-world process into an interactive sequence a person performs in order — the cannon, explicitly.
- Teaching an action through physical interaction rather than instruction.
- Guiding a novice who has no mental model to build on.
- Feedback that is immediate and legible in the moment.
- Making a complicated environment understandable at a glance.
- Building around a workflow somebody else owns — a tour, a guide, a schedule, a site.
- Working from source material held by domain experts, which is the same relationship as building a procedure against the knowledge of the people who do it.

I have taken immersive systems past the prototype stage and into the hands of paying strangers, repeatedly, in several countries, on several classes of hardware. That is the claim this page exists to support.

## Honest limits

**The numbers are not mine to publish.** The one externally verifiable figure on this page is Relive 1776's TripAdvisor rating. Visitor counts, session counts and revenue belong to the operators, and I have left them out rather than estimate them.

**This is team output.** The studio's projects are built by a team, and the wording throughout reflects that on purpose. Where I owned something outright it should say so, and answering the open question at the top of this page is what would let it.

**No instrumented evaluation.** Feedback arrives through guides and operators — what confused a group, what broke, what a guide stopped using. That is real signal and it is not a usability study. I have run instrumented sessions elsewhere in my work; none of it happened here.

**The multiplayer work is unfinished**, and several of the smaller experiences above have no confirmed deployment name, which is why they are listed plainly instead of written up.

## What I'd change

**Instrument one experience.** Nobody measures whether a first-time user completes the cannon sequence unaided, and a thirty-second observation sheet per group — completed, needed a prompt, gave up — would turn the strongest interaction-design argument in this portfolio from a description into a finding. It is the cheapest unclaimed win in the entire body of work.

**Write the onboarding down.** The knowledge of how to get a stranger into a headset in twenty seconds lives in guides' hands and in developers' heads. It is a spec: fitting, first gesture, failure recovery, handback. Written down once, it would make every future deployment start from the last one instead of from scratch.

# Gaps — every `[NEEDS INPUT]` in this file

**Blocking**

1. The role split: which experiences was I lead developer on, and which did I contribute to? Everything on this page hedges uniformly because of this.
2. Start date of my work with See Reality, for the metadata line and the `cat` field in `src/data/projects.ts`.

**Important**

3. Client, site and status for Temple of Artemis, Stonehenge, SpongeGuy, and the VITURE/XREAL 360° experience.
4. Which of the Relive 1776 five I personally built versus contributed to.
5. Whether the Liverpool FC work and Fort Nashborough installation (both named in the previous version of this project's description on the site) have public names or links.
6. Any operator-approved usage figures — even one ("x guests since 2024" from a single client) would change the scale argument.
7. Captures from **Ride Solar** and **Venice City Tours** — the only two featured deployments with no footage. Both currently have a single still from the operator, so their cards are static while the other four move.
8. What is `AncientRomeVideo9minutes.mp4`? It is not Rome: it is a nine-minute split-screen field test in a grass field with an in-headset panel showing an Egyptian temple interior, Anubis statues, hieroglyphs, an obelisk and a dragon, with a phone used as a controller. 234 MB and unattributable, so it is not on the site. Name the experience and the client and I will cut a clip — the side-by-side view of a person and what they are seeing is the single clearest asset in the whole folder.
