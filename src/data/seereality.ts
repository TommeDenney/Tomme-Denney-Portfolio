/**
 * The See Reality roster.
 *
 * This work is not one project and it is not a case study either: it is a
 * couple of dozen deployed experiences across eight clients, and the only
 * honest way to show it is to show all of it and say what each one is. So the
 * See Reality page is a grid rather than an argument — every item here becomes
 * one ruled cell with its own clip, its own line of metadata and its own
 * paragraph.
 *
 * Six of the deployments are full project entries in projects.ts with their own
 * pages and card previews; those items carry a `project` id rather than a copy
 * of the media. Everything else points at a clip or a still under
 * /projects/seereality/clips/, cut from the studio's capture reels and the
 * operators' own coverage.
 *
 * Wording rule, which is the whole reason this file reads the way it does: the
 * studio's experiences are built by a team, so `mine` says what the commit
 * record shows I built — audited across all 49 repositories in the See-Reality
 * GitHub organisation in October 2026 — and `team` names who built the rest.
 * Nothing here invents a client, a name or a number. Four of the smaller
 * experiences have no deployment name I can confirm, and they are described
 * without one instead of being dressed up.
 */

export type RosterItem = {
    name: string;
    /** Client, place, hardware — the small-caps line under the name. */
    meta?: string;
    /** A project in PROJECTS whose page and looping preview this item reuses. */
    project?: string;
    /** A card-sized loop under /projects/seereality/clips/, with its poster. */
    clip?: string;
    /** A still, for the two items where motion adds nothing. */
    still?: string;
    link?: { url: string; label: string };
    body: string;
    /**
     * What I built on this one, from the commit record across the See-Reality
     * organisation's repositories (audited October 2026). Absent where the
     * record does not show work of mine.
     */
    mine?: string;
    /** Who built the parts that are not mine, by the names they commit under. */
    team?: string;
};

export type RosterSection = {
    id: string;
    label: string;
    note?: string;
    items: RosterItem[];
};

const clip = (stem: string) => ({
    clip: `/projects/seereality/clips/${stem}.mp4`,
});

export const SEE_REALITY_WORK: RosterSection[] = [
    {
        id: 'deployments',
        label: 'Deployments',
        note: 'Eight operators, six with a page of their own. Each one is a tour that was already selling tickets before any of this existed.',
        items: [
            {
                name: 'Relive 1776',
                meta: 'Freedom Trail, Boston · Quest · Live',
                project: 'relive1776',
                link: { url: 'https://www.tripadvisor.com/AttractionProductReview-g60745-d28008309-Relive_1776_See_Boston_s_History_in_Augmented_Reality_AR-Boston_Massachusetts.html', label: 'TripAdvisor' },
                body: 'Five mixed-reality experiences carried on a two-hour guided tour along the Freedom Trail. It sells publicly and holds 4.9 out of 5 across 83 TripAdvisor reviews. Everything is registered to the real place: the market lines up with a colonnade that is still standing, and the cannon sits on the plaza’s actual bricks while strangers walk past the muzzle.',
mine: 'My first See Reality work, from August 2024, was the Boston Massacre experience this tour grew from. On the tour itself I was the main developer of Five Shots at Midnight and Paul Revere’s Ride, wrote the Bunker Hill cannon’s step-by-step firing logic, set up and animated the Faneuil Hall Market, and converted Sons of Liberty to Quest.',
team: 'Sons of Liberty was built by Kuutamokuu; the market was populated by Dylan Husted, with horse petting by Kuutamokuu.',
            },
            {
                name: 'ShowMeItaly',
                meta: 'Rome & Pompeii · Paid add-on · Live',
                project: 'showmeitaly',
                ...clip('pompeii'),
                link: { url: 'https://showmeitaly.com/', label: 'showmeitaly.com' },
                body: 'Seven experiences built for one of the larger operators working Rome and Pompeii, sold into their tours as a paid immersive add-on: meeting Julius Caesar, fighting gladiators from the floor of the real Colosseum arena, four temples of the Roman Forum, an ancient Pompeii market, and Pompeii before and after Vesuvius. At Roman volumes the failure modes that matter are throughput and device turnaround between groups.',
mine: 'Performance, crowd and audio fixes across the Rome and Pompeii scenes in August and September 2026 — occlusion culling for the crowds, animated crowds in the gladiator stands, grabbable market fruit — and the studio template the project started from.',
team: 'Built mainly by Dylan Husted and Claire Combs.',
            },
            {
                name: 'Town of Lexington',
                meta: 'Lexington, Massachusetts · Quest, tablets, mobile AR · Live',
                project: 'lexington',
                link: { url: 'https://www.tourlexington.us/', label: 'tourlexington.us' },
                body: 'A municipal client rather than a private operator, which changes the brief. Lexington runs a walking-tour programme with more than twenty-five guides, so the target was three experiences any guide could add to a tour they already give, without rehearsal. Visitors stand where buildings no longer exist and see them rebuilt, meet figures including Anna Harrington, and are put inside moments from April 1775. Free mobile AR off QR codes on city signage covers the visitor who turns up with a phone and no ticket.',
mine: 'I built both apps. The mobile and tablet AR app on AR Foundation (ARKit and ARCore), from plane-detected placement to an iPhone and iPad version ready for the town’s demo day in October 2025; then the Quest version — the Belfry Tower bell rope, doors and teleporting, the Meeting House speech, the staging menu, and player-height fixes made on site.',
team: 'Building models and textures by Patricio, the Anna Harrington character by Kuutamokuu, attic figures and NPC reactions by KoMi, and the launcher by Dylan Husted.',
            },
            {
                name: 'Nashville Adventures',
                meta: 'Nashville, Tennessee · Quest · Live',
                project: 'nashvilleadventures',
                link: { url: 'https://www.nashvilleadventures.com/', label: 'nashvilleadventures.com' },
                body: 'Four experiences our team designed and built into a single guided walk: the city’s first settlers at Fort Nashborough, its historical architecture, early Music City, and the rock-and-roll era of the clubs the group is walking past. The scenes layer onto the physical city while the guide keeps talking, so the cut points are set by the storytelling rather than by the software.',
mine: 'I created the project and built the Fort Nashborough settlers scene, the architecture timelapse, the scene transitions, the Titans stadium explosions and the gesture recenter, integrated every scene into one build, and shipped it for Nashville in March 2026.',
team: 'The Music City scenes were built by Kuutamokuu and the moonshiner by Claire Combs; the launcher by Dylan Husted.',
            },
            {
                name: 'Ride Solar',
                meta: 'Prince Edward Island & Nova Scotia · Live',
                project: 'ridesolar',
                link: { url: 'https://ridesolar.com/', label: 'ridesolar.com' },
                body: 'XR built into two live tours in Atlantic Canada: a historic walking tour, and a food-and-drink tour where the content is tied to what is being eaten and where it came from. Around six experiences across the two itineraries — guests step onto a 19th-century lobster boat and deal with the crew, meet the figures behind Canadian Confederation, walk a market of the Anne of Green Gables era, and run into dinosaurs. The design question here was pacing: every segment has to end cleanly enough for the guide to pick the group back up.',
mine: 'I wrote the experience manager that runs every scene, built the branching dialogue system for the John Hamilton Gray experience — with lip-sync and automated facial expressions — brought over the cannon and the dinosaurs, rebuilt the lobster-trap interaction, and merged it all into one launchable build.',
team: 'The lobster boat and its crew were built by Kuutamokuu; launcher and performance work by Dylan Husted.',
            },
            {
                name: 'Venice City Tours',
                meta: 'Venice, Italy · AR glasses · Live, plus work in progress',
                project: 'venicecitytours',
                link: { url: 'https://www.venicecitytours.it/', label: 'venicecitytours.it' },
                body: 'A cinematic 360° experience delivered on lightweight AR glasses and localised into five languages, and an XR gondola simulator a participant paddles through a stylised medieval Venice while the guide carries on managing the group in the real world. On top of it, a multiplayer gondola race networked with Normcore — in development, and nothing about it is deployed.',
mine: 'I built the first 360° prototype on XREAL glasses in February 2026, and I am building the multiplayer race: spawning and ownership, a lobby with a ready-up, countdown, placements and finish line, and a fallback when there is no network. It lives on a feature branch and is not merged.',
team: 'The shipped glasses app, its five languages and the launcher are Dylan Husted’s; the gondola simulator is Dylan Husted’s and Claire Combs’s.',
            },
            {
                name: 'SeeSightTours — NiagaraXR',
                meta: 'Niagara · Contributed to',
                body: 'An XR experience built around Niagara tourism, for a different operator and a site that behaves nothing like a city walking tour.',
mine: 'I created the project and built a boat-cannon sequence that rescues passengers by rope, with its dialogue, and the carnival games — darts, balloon pop and a hammer strength test.',
team: 'Built mainly by Dylan Husted and Claire Combs.',
            },
            {
                name: 'Liverpool FC',
                meta: 'Fan experience · Contributed to',
                body: 'Fan-experience work from the sports end of the studio’s client list rather than the heritage end.',
            },
        ],
    },
    {
        id: 'boston',
        label: 'Relive 1776',
        note: 'The five experiences on the Boston tour. The cannon is the one I point at in interviews, for reasons under it.',
        items: [
            {
                name: 'Bunker Hill Cannon',
                meta: 'Mixed reality · Procedural interaction',
                ...clip('cannon'),
                body: 'It teaches a visitor to work a historical field gun by hand and in order — charge, ball, rammer, aim down the plaza, linstock, report — and it does not fire if a step is missed or taken out of sequence. A real procedure, decomposed into physical steps, wrapped in feedback that lets a stranger finish it unaided. That is the same problem as simulation-based training, minus the assessment, and it is the most transferable thing in this whole roster.',
mine: 'I wrote the sequencing: each tool checked in order, the next step highlighted, a reset, a historically accurate and a simplified version, and a ship target that sinks under fire. I adapted it for Ride Solar in Canada.',
team: 'Cannon and tool models, the hand-interaction constraints, the interface and the effects by Kuutamokuu.',
            },
            {
                name: '17th-Century Faneuil Hall Market',
                meta: 'Mixed reality · Hand tracking',
                ...clip('market'),
                body: 'A reconstruction of the market that stood on the ground the group is standing on: stalls, traders and hanging goods laid over Quincy Market’s real colonnade. The interaction vocabulary is one gesture — reach for the thing — because nobody is teaching a control scheme to a first-time user in a public square.',
mine: 'Project and XR setup, character animation and dialogue, and the grab interactions; I later reused the market for Ride Solar and Lexington.',
team: 'Stalls, traders and carriages by Dylan Husted; horse petting by Kuutamokuu.',
            },
            {
                name: 'Paul Revere’s Ride',
                meta: 'Mixed reality',
                body: 'An immersive recreation of the ride, from inside it rather than watching it happen.',
mine: 'I created the project and built the NPC behaviour — colonists walking NavMesh waypoints with Animator-driven animation — the conversation scenes, and a mobile AR version.',
team: 'Paul Revere and horse models, rigging and animation by Kuutamokuu.',
            },
            {
                name: 'Five Shots at Midnight',
                meta: 'Mixed reality',
                body: 'The Boston Massacre, staged on the streets where it happened, with Crispus Attucks among the figures the visitor meets.',
mine: 'I built it from the Boston Massacre experience that was my first See Reality work in August 2024: the soldier and colonist behaviour, the captain who responds when touched, voice lines and dialogue, and a thumbs-up gesture menu.',
            },
            {
                name: 'Sons of Liberty',
                meta: 'Mixed reality',
                body: 'Revolutionary-era Boston and the men organising in it, sited in the part of the city where that organising went on.',
mine: 'I converted it from mobile AR to Quest, with new tap, letter and letter-giving interactions.',
team: 'Built by Kuutamokuu.',
            },
        ],
    },
    {
        id: 'more',
        label: 'Additional experiences',
        note: 'Other See Reality work I have contributed to. Four of these have no deployment name I can confirm, so they are described without one rather than given an invented client.',
        items: [
            {
                name: 'Stonehenge',
                meta: 'Full-scale reconstruction',
                still: '/projects/seereality/clips/stonehenge.jpg',
                body: 'The stones rebuilt at full height. In the studio’s own capture they are standing in the middle of the Faneuil Hall plaza, against a building that is still there — which is the clearest demonstration I have of what scale does once you put it in a street people already know.',
            },
            {
                name: '360° for AR glasses',
                meta: 'VITURE / XREAL hardware',
                body: 'A 360° immersive piece built against lightweight AR glasses rather than a headset. Glasses change the brief completely: no hand tracking, no room scale, and a visitor who can still see the guide the entire time.',
mine: 'I built the XREAL prototype that the glasses piece started from.',
team: 'The VITURE app that shipped is Dylan Husted’s.',
            },
            {
                name: 'Temple of Artemis',
                meta: 'Historical reconstruction',
                body: 'An immersive reconstruction of the temple, built from historical source material.',
mine: 'I built the first demo, with teleport spheres, in October 2025.',
team: 'Developed further by Dylan Husted, Claire Combs and KoMi.',
            },
            {
                name: 'Founding of Canada',
                meta: 'Historical experience',
                body: 'An immersive historical experience centred on the founding of the country, which became Ride Solar’s John Hamilton Gray encounter.',
mine: 'I wrote its dialogue system: branching choices, idle body language between lines, random speaking animations and automated facial expressions, with lip-sync.',
team: 'Models, lip-sync setup and voice lines by Kuutamokuu.',
            },
            {
                name: 'SpongeGuy',
                meta: 'Internal name',
                body: 'An AR clip carried internally under that name: a Blender scene exported to GLB and USDZ with video textures.',
mine: 'Made with Kuutamokuu.',
            },
        ],
    },
    {
        id: 'kids',
        label: 'For younger visitors',
        note: 'Children are not a lesser version of this audience. A nine-year-old in a borrowed headset on a public street has no patience for onboarding, no fear of breaking anything, and an adult next to them who wants to see it work inside five seconds.',
        items: [
            {
                name: 'The Dragon',
                meta: 'Mixed reality · Overhead scale',
                ...clip('dragon'),
                body: 'A dragon that passes through the real trees above the square and breathes fire, at a size that reads from the ground. The ceiling is the actual sky, which is a scale no screen gets to use.',
mine: 'I created the project and wrote the dragon’s behaviour and flight path.',
team: 'Kuutamokuu finished the interaction.',
            },
            {
                name: 'Kids Mini Cannon',
                meta: 'Mixed reality · Procedural',
                body: 'A scaled-down version of the cannon experience for younger visitors.',
            },
            {
                name: 'Dancing Red Coat Soldiers',
                meta: 'Mixed reality',
                body: 'British regulars, dancing — the children’s counterpart to the Revolutionary-era content the adult tour carries.',
            },
            {
                name: 'The Dino',
                meta: 'Mixed reality',
                body: 'A dinosaur encounter built for younger visitors.',
mine: 'All of it: the dinosaur’s behaviour, a circling pterodactyl, sound and animation. It later went into the Ride Solar tour.',
            },
        ],
    },
    {
        id: 'craft',
        label: 'What the work involves',
        note: 'The through-line across all of it, and the part that transfers to XR training and simulation.',
        items: [
            {
                name: 'Somebody’s first ten minutes in a headset',
                ...clip('first-headset'),
                body: 'The population these experiences serve has never used one, so the setup is part of the design rather than overhead around it: a guide kneeling to fit a headset onto a child is the first ten seconds of the experience, performed in public with a group waiting. Nothing may need explaining, nobody should be able to perform an interaction badly in front of strangers, and per-person onboarding time gets multiplied by twenty.',
            },
            {
                name: 'The hardware is a design decision',
                ...clip('nashville-glasses'),
                body: 'See Reality’s own answer is History Glasses: roughly 400 g, held up to the eyes like binoculars rather than strapped on, so a visitor never loses sight of the guide, the group or the street. One hardware choice carries the entire argument about what XR is for on a tour — it is a chapter of someone else’s experience, not a replacement for it.',
            },
            {
                name: 'Hands, not controllers',
                ...clip('redcoats'),
                body: 'Hand tracking here is an operational choice before it is an elegant one. There is no controller to hand over, explain, drop, or lose between groups, and a visitor’s own hand reaching into the scene needs no tutorial. The cost is that tracking has to hold up outdoors, in daylight, over a full day of use.',
            },
            {
                name: 'Registered to a real place',
                still: '/projects/seereality/clips/market-street.jpg',
                body: 'Location-based XR lives or dies on alignment. The market has to run the length of a colonnade that is still standing; the cannon has to sit on the plaza’s bricks. Get it wrong and the effect does not degrade politely — it stops being the place and becomes a screensaver.',
            },
            {
                name: 'Standing inside a building that is gone',
                ...clip('lexington-meetinghouse'),
                body: 'Reconstruction is the other half of the same idea: a visitor stands on the ground a building occupied and then stands inside it. It puts the design work in the source material — what the building actually was — and in making a complicated historical space legible at a glance to someone who has thirty seconds.',
            },
            {
                name: 'Inside a working operation',
                ...clip('italy-gladiator'),
                body: 'The visitors around that gladiator fight are the tour, not a test audience. Everything here has to survive a schedule: staff who did not build it, groups back to back, mixed hardware, no reliable network, devices charged and cleaned and accounted for, and recovery a guide can perform in fifteen seconds in front of a paying group.',
            },
            {
                name: 'Reliability as a design property',
                body: 'The standard I took from this work and now apply everywhere: a build is not finished when it demonstrates well. It is finished when somebody who did not write it can run it twelve times a day without me. That covers performance on standalone hardware, URP pipelines tuned for passthrough, and behaving the same across a fleet that is not on identical firmware.',
            },
            {
                name: 'A recenter that survives a public street',
                body: 'Visitors are every height, and a borrowed headset on a moving tour loses its bearings. I built a height-adjustment and palm-gesture recenter — a visitor makes the gesture and the scene puts itself back in front of them at the right height — and it became part of the studio’s project template, used across Lexington, Nashville, Ride Solar and the newer tours.',
            },
            {
                name: 'Multiplayer, in development',
                body: 'The Venice racing work is the first networked thing I have built here: several participants in one shared scene in Normcore, with spawning and ownership, a lobby and ready-up, a countdown, placements and a finish, and an offline fallback for a tour with no network. It is on a feature branch, not merged. It is the same step a training experience takes when it stops being one trainee at a station and becomes a team running a procedure together.',
            },
            {
                name: 'Where this points',
                body: 'See Reality is a tourism and location-based entertainment studio — not an industrial training company, and nothing here certifies anyone in anything. What transfers is the method: translate a real process into an ordered interactive sequence, teach the action physically, guide a novice with no mental model, give feedback in the moment, and fit the whole thing inside a workflow somebody else owns. I have done that repeatedly, for paying strangers, in several countries.',
            },
        ],
    },
];

/** Keyed by project id, so a second body of work like this needs no new page. */
export const PROJECT_ROSTERS: Record<string, RosterSection[]> = {
    seereality: SEE_REALITY_WORK,
};
