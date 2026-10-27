/**
 * The portfolio's content, in one place.
 *
 * This used to live inside the single index.html as three separate literals
 * that had to agree with each other by hand. Astro imports this at build time
 * to server-render the grids and cards, and the same objects are handed to the
 * browser script, so there is exactly one source of truth.
 */

export type Project = {
    id: string;
    name: string;
    cat: string;
    /** Path under public/. Every card in the site draws its image from this. */
    cover: string;
    bg: string;
    ico: string;
    tags: string[];
    caption?: string;
    desc: string;
    paper?: string;
    presentation?: string;
    /** genexr opts out: its stills are in the thesis documents instead. */
    galleryImages?: boolean;
    dl?: string;
    dlLabel?: string;
    /**
     * Filename stem of a long-form case study in case-studies/. When set, the
     * project's page renders that Markdown under the summary and the overlay
     * on / grows a link to it. The prose lives only in the .md — `desc` is a
     * hand-written short version, not an excerpt, so the two cannot drift.
     */
    caseStudy?: string;
    /** Overrides the keyword derivation in projectDisciplines(). */
    disciplines?: Discipline[];
    /**
     * Suppresses the still-image hero. Only Inhabiting Memory sets this: a
     * static splat render reads as a noisy photograph and undersells spatial
     * work to anyone who has never worn a headset. A screenshot of a UI has no
     * such problem, so other case studies keep their still.
     */
    noStillHero?: boolean;
    /**
     * Supporting documents, for projects with more than the one paper and one
     * deck that `paper` and `presentation` cover. Rendered in order.
     */
    documents?: { label: string; file: string; note?: string }[];
    /**
     * The id of a project this one is part of. Set on the six See Reality
     * deployments: the card carries the client and the footage, and this sends
     * a reader to the page that lists the whole body of work, so the overview
     * is never written twice.
     */
    partOf?: string;
    /**
     * Label/value pairs under a project page's title — role, platform, the
     * interaction it turns on, status, tools — so a reader scanning for fit
     * has the answer before the prose. Pairs rather than fixed fields, because
     * the honest label varies: where the split of a team project is not
     * established the row says "Team", not "Role".
     */
    glance?: [string, string][];
    /**
     * Alt text for the gallery stills, in gallery order (still 1 is the first
     * image after the cover). Without it each still is announced as
     * "<name> — still N", which says nothing about what is in the frame.
     */
    stillAlts?: string[];
    /**
     * Ids to lead the "Next" row with, ahead of the default order — for a
     * project with an obvious neighbour, such as a jam game and the later
     * game on the same premise.
     */
    related?: string[];
    /**
     * Diagrams, flows and wireframes made after the fact to analyse the
     * interaction design of an older project. Rendered under their own
     * heading with `made` beside each, so a reader never mistakes one for a
     * production document from the time. Empty for every project today.
     */
    retrospective?: { src: string; caption: string; made: string }[];
    /**
     * Captioned evidence for a project page that has no long-form case study:
     * figures lifted from the original design documents, and captures from
     * the build. `source` names where each one came from — the document's own
     * title and year, or the build — so an original artefact is never confused
     * with a capture, or with a retrospective diagram (see `retrospective`).
     */
    figures?: { src: string; caption: string; source: string }[];
    /** Outbound links beyond the one in PROJECT_EXTERNAL_SITES, each verified to load. */
    extraLinks?: { url: string; label: string }[];
};

/**
 * A project's URL is derived from its name, not its id: the ids are historical
 * ('genexr' is Inhabiting Memory, 'haptidraw' is Interview With Eternity) and
 * would make for URLs that misname the work in the one place a recruiter
 * actually reads. Names are unique across PROJECTS, so slugs are too.
 */
export function projectSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFKD')
        // Apostrophes are dropped rather than replaced: "God's" has to become
        // "gods", not "god-s".
        .replace(/['\u2019]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export type ProjectKind = 'case' | 'project';

/**
 * Which tier a project sits in: written up, or not.
 *
 * There used to be a third, 'note', for the shorter pieces that make one
 * argument rather than carrying a full problem-to-outcome case. It is gone.
 * Three badges asked a reader to learn a taxonomy before they could read
 * anything, and the distinction it drew was between two things the reader
 * wants for the same reason — the writing is either there or it is not. The
 * length of the page says the rest.
 */
export function projectKind(p: Project): ProjectKind {
    return p.caseStudy ? 'case' : 'project';
}

/** The badge text for that tier. */
export const KIND_LABEL: Record<ProjectKind, string> = {
    case: 'Case study',
    project: 'Project',
};

/** `/work/<slug>` for a project, which is where its own page lives. */
export function projectHref(name: string): string {
    return `/work/${projectSlug(name)}`;
}

/**
 * The filters on /work.
 *
 * Derived from each project's own cat and tags rather than hand-listed, so a
 * new project lands in the right bucket without a second edit. `disciplines`
 * overrides the derivation where the keywords get it wrong.
 *
 * Matching is on whole tokens, not substrings, which is not fussiness: "ar"
 * appears inside "Narrative", "game" inside "Game Design", and "study" inside
 * "Study Abroad" — a substring pass put 17 of 18 projects in Games and read as
 * noise rather than as a filter.
 *
 * There is deliberately no "Interface & UI" bucket yet. The work that would
 * fill it — the interface-design coursework with four documented rounds of user
 * testing — has no project entry, and a filter that returns nothing is worse
 * than an absent one. It goes back in when that case study exists.
 */
export const DISCIPLINES = [
    'XR & Spatial',
    'Games',
    'Research & Evaluation',
] as const;

export type Discipline = (typeof DISCIPLINES)[number];

/** Single words matched against the token set. */
const DISCIPLINE_TOKENS: Record<Discipline, string[]> = {
    'XR & Spatial': [
        'xr', 'vr', 'ar', 'mr', 'quest', 'spatial', 'gaussian', 'splatting',
        'immersive', 'passthrough', 'sidequest', 'genealogy',
    ],
    'Games': [
        'game', 'games', 'horror', 'platformer', 'arcade', 'racing', 'shooter',
        'defense', 'mystery', 'narrative', 'twine', 'survival', 'jam',
        'strategy', 'rhythm',
    ],
    'Research & Evaluation': [
        'hci', 'research', 'thesis', 'biometrics', 'usability',
    ],
};

/** Multi-word keys matched against the joined string. */
const DISCIPLINE_PHRASES: Record<Discipline, string[]> = {
    'XR & Spatial': [
        'hand tracking', 'avatar embodiment', 'gaze interaction',
        'extended reality', 'comfort & locomotion',
    ],
    'Games': ['point & click', 'interactive fiction'],
    'Research & Evaluation': [
        'design research', 'user testing', 'eye tracking', 'interview-led',
    ],
};

/** Disciplines a project belongs to. Never empty — falls back to Games. */
export function projectDisciplines(p: Project): Discipline[] {
    if (p.disciplines?.length) return p.disciplines;

    // Course codes are stripped first: "Narrative Game · XR 5020" is a game
    // made in an XR course, not a spatial project, and the bare "xr" token
    // otherwise files it under XR & Spatial on the strength of the catalogue
    // number alone.
    const text = [p.cat, ...p.tags]
        .join(' ')
        .toLowerCase()
        .replace(/\b(xr|game|artg|artf|gsnd|exre|psyc|cs)\s*\d{3,4}\b/g, ' ');
    const tokens = new Set(text.split(/[^a-z0-9]+/).filter(Boolean));

    const found = DISCIPLINES.filter(
        (d) =>
            DISCIPLINE_TOKENS[d].some((t) => tokens.has(t)) ||
            DISCIPLINE_PHRASES[d].some((phrase) => text.includes(phrase)),
    );
    return found.length ? found : ['Games'];
}

export const PROJECTS: Project[] = [
    {
        id: 'seereality', name: 'See Reality', cat: 'Professional XR · See Reality · Deployed internationally · 2024–Present',
        cover: '/projects/seereality/0.png',
        bg: 'linear-gradient(145deg,#050e1a,#0e2860,#1a449a)', ico: '🌐',
        tags: ['Unity C#', 'Meta Quest', 'Mixed Reality', 'Mobile AR', 'AR Glasses', '360° Video', 'XR Interaction Design', 'Location-Based XR', 'Multiplayer XR', 'Normcore', 'URP', 'Localisation', 'Client Work'],
        caption: 'Hand-tracked mixed reality for people who have never worn a headset, running inside live guided tours — Boston, Lexington, Nashville, Atlantic Canada, Rome, Pompeii, Venice.',
        glance: [
            ['Role', 'One of the studio’s developers: contributed to interaction design, Unity implementation, and iteration on what guides reported from the street'],
            ['Platform', 'Meta Quest mixed reality, tablets, mobile AR, lightweight AR glasses'],
            ['Interaction', 'Hand-tracked physical interaction, ordered procedures, and onboarding for people who have never worn a headset — paced to a live guide'],
            ['Status', 'Deployed on live tours, 2024–present · Venice multiplayer in development'],
            ['Built with', 'Unity, C#, URP, Normcore'],
        ],
        desc: 'See Reality builds immersive experiences for tour operators, municipalities and historical attractions, and integrates them into tours those clients are already selling. I am one of the developers on them: across the work below I contributed to interaction design, Unity implementation, iteration against what guides reported back from the street, and the unglamorous part of getting a build to survive a tour day. Where this page says our team, that is what it means — the Venice multiplayer racing work is the one piece that is mine, and it is in progress.\n\nNone of it is a demo. These run on a schedule, in public, at a ticket price, operated by staff who did not build them, for families, children, older adults and people who have never worn a headset — often twenty at a time, outdoors, with pedestrians walking through the scene. The guide is not being replaced: the XR is one chapter of somebody else’s two-hour experience and has to hand the group back on time.\n\nSo the interaction problem is the same every time: take a historical place or procedure and turn it into something a stranger in a borrowed headset can do within a few minutes, with no tutorial, while the guide keeps talking. One gesture where one will do — reach for the thing. Ordered physical steps where the history is a procedure: the Bunker Hill cannon is loaded and fired by hand, in sequence, and does not fire if a step is skipped. Segments that end cleanly enough for a guide to pick the group back up.\n\nAcross several years that has covered room-scale mixed reality on Quest, mobile AR triggered from street signage, tablet content a guide holds up, cinematic 360° on lightweight AR glasses, hand-tracked physical interaction, historical reconstruction registered to real streets, five-language localisation, and — currently — networked multiplayer in Normcore.\n\nEverything I have worked on or contributed to is below, grouped and named, including the experiences whose final client I cannot confirm.'
    },
    {
        id: 'genexr', name: 'Inhabiting Memory', cat: 'Master’s Thesis · Spatial Design · Design Research · 2026', cover: '/projects/genexr/1.png',
        bg: 'linear-gradient(145deg,#0e0418,#2a0e48,#4a1888)', ico: '🧬',
        tags: ['Spatial Design', 'Design Research', 'Immersive Genealogy', 'Comfort & Locomotion', 'Interview-Led Design', 'Master’s Thesis', 'Meta Quest 3', 'Unity C#', 'Gaussian Splatting'],
        caption: 'A VR family museum you enter on foot — real walking inside each room, hand-tracked teleport between them, built from interviews and tested against flat photographs.',
        glance: [
            ['Role', 'Sole designer and developer · master’s thesis'],
            ['Platform', 'Meta Quest 3 (PCVR)'],
            ['Interaction', 'Real walking inside play-space-sized rooms, hand-tracked teleport and menus between them, no controllers'],
            ['Status', 'Completed April 2026 · presented at the XR thesis showcase · six-participant study'],
            ['Built with', 'Unity, C#, URP, Gaussian splatting'],
        ],
        desc: 'Photographs preserve the surface of a moment and discard the thing memory actually uses to find it again: the space. Inhabiting Memory is a VR family museum you enter on foot — six rooms, one per family member, each designed from an interview with the person it belongs to, so a visitor stands inside a reconstructed room instead of looking at a picture of one. I built the locomotion around the visitor’s real play space so nobody trades comfort for presence, and I tested the premise directly: six participants viewed their own photographs on a screen, then stood inside spatial reconstructions built from those same photographs. My master’s thesis at Northeastern, presented for open critique. Built solo in Unity for Quest 3 using Gaussian splatting — a capture technique that rebuilds a real place as a cloud of points you can walk through.',
        caseStudy: 'inhabiting-memory',
        noStillHero: true,
        // The thesis PDF is withheld, not missing. Page 22 asserts that
        // "Participants consistently report stronger spatial presence,
        // familiarity, and a sense of return" — a finding written in a paper
        // whose methods section is in the future tense, and one the case study
        // deliberately declines to make because the survey data has not been
        // analysed. Linking both invites a careful reader to find the claim the
        // page refused to make, which reads as though the restraint were
        // cosmetic. Restore this line once page 22 is corrected.
        // paper: '/projects/genexr/Inhabiting Memory.pdf',
        presentation: '/projects/genexr/Inhabiting Memory Presentation.pdf',
        galleryImages: false
    },
    {
        id: 'iamyou', name: 'I Am You', cat: 'VR Horror · XR 5010 · 2024', cover: '/projects/iamyou/1.png',
        bg: 'linear-gradient(145deg,#04151f,#183a37,#432534)', ico: '📸',
        tags: ['VR', 'Embodiment', 'Comfort & Locomotion', 'Horror', 'Narrative', 'Unity C#', 'XR 5010'],
        caption: 'You are not the hiker. You are the trail camera watching him, steering his body.',
        glance: [
            ['Role', 'Two-person team · I built the external-perspective control system and the forest level prototype'],
            ['Platform', 'VR'],
            ['Interaction', 'A fixed camera viewpoint: the player keeps their own head and hands while the locomotion drives someone else’s body'],
            ['Status', 'Three-week course prototype, 2024 · download on itch.io'],
            ['Built with', 'Unity, C#'],
        ],
        desc: 'Almost every design decision in VR aims at convincing you the body is yours. I Am You asks the opposite question: can a player care about a character they do not inhabit? Your viewpoint sits at the trail cameras in a dark forest and never travels \u2014 you keep your head and hands, while the locomotion drives the hiker\u2019s body instead. You are puppeting yourself. He is looking for photographs the wind took from him, and something is following him. A two-person prototype for a course on XR history and theory, built in three weeks.',
        caseStudy: 'i-am-you',
        documents: [
            {
                label: 'Project plan, second version',
                file: '/projects/iamyou/I Am You Project Plan v2.pdf',
                note: 'The plan as revised: the Proteus Effect reasoning, the work split, and the schedule.',
            },
            {
                label: 'Project plan, first version',
                file: '/projects/iamyou/I Am You Project Plan v1.pdf',
                note: 'The earlier draft, which still carries the compass mechanic that came out.',
            },
        ]
    },
    {
        id: 'recollection', name: 'Recollection', cat: 'Product · Usurper Interactive · Live · 2026', cover: '/projects/recollection/1.jpg',
        bg: 'linear-gradient(145deg,#04151f,#432534,#183a37)', ico: '💍',
        tags: ['Product Design', 'Service Design', 'Privacy by Design', 'Onboarding', '360° Video', 'Meta VR Glasses', 'Meta Quest', 'Unity C#', 'Cloudflare'],
        caption: 'A wedding or any milestone, recorded from every direction, so nobody is stuck with one person’s edit of it.',
        glance: [
            ['Platform', 'Meta’s VR glasses and Meta Quest 3 and 3S'],
            ['Interaction', 'Named moments instead of a timeline, switching camera without losing your place, and headset sign-in without typing in the headset'],
            ['Status', 'Live, for Meta’s VR glasses and Quest 3/3S · the case study below also records the earlier, wider product'],
            ['Built with', 'Unity 6, Astro, Cloudflare Workers, D1, R2'],
        ],
        desc: 'A wedding video is one person\u2019s edit of your day \u2014 someone chose the angle, and every time you go back you get their choice again. Recollection captures the day in every direction at once, cuts it into named moments, and lets you switch camera mid-moment without losing your place. The design problem was not fidelity; it was removing the editor from between a person and their own memory, for an audience of a hundred wedding guests who will not install anything or make an account. So a guest redeems a code and gets a token scoped to one event: no login, no app, and no master key \u2014 the all-access path was removed rather than disabled. The commercial end of the same line of work as my thesis, and the only part of it with a price.',
        caseStudy: 'recollection',
        documents: [
            {
                label: 'Usurper Interactive business plan',
                file: '/projects/recollection/Usurper Interactive Business Plan.pdf',
                note: 'The studio pitch this product came out of: segmentation, differentiation position, five-year headcount and the pricing ladder. A three-person course project.',
            },
            {
                label: 'Income statement',
                file: '/projects/recollection/Usurper Interactive Income Statement.pdf',
                note: 'Five-year projection behind the pricing.',
            },
            {
                label: 'Balance sheet',
                file: '/projects/recollection/Usurper Interactive Balance Sheet.pdf',
            },
            {
                label: 'Headcount growth plan',
                file: '/projects/recollection/Usurper Interactive Headcount Plan.pdf',
                note: 'Bootstrap and part-time for two years, then four people to twelve.',
            },
        ]
    },
    {
        id: 'keystotheuniverse', name: 'Keys to the Universe', cat: 'Interactive Learning · Game UX · AI-Assisted Development · 2026',
        cover: '/projects/keystotheuniverse/1.jpg',
        bg: 'linear-gradient(145deg,#0e0418,#2a0e48,#4a1888)', ico: '🎹',
        tags: ['Learning Design', 'Game UX', 'Gamification', 'Web MIDI', 'Web Audio', 'Installable Web App', 'AI-Assisted Development', 'JavaScript'],
        caption: 'A piano course laid out as a galaxy map, with a player that waits for you — played on a screen, a computer keyboard, a MIDI piano, or a real piano heard through the microphone.',
        glance: [
            ['Role', 'Product concept and direction, course structure, and testing as its first learner · implemented with an AI coding agent (Claude)'],
            ['Platform', 'Browser, installable as a web app · tuned for iPad and desktop'],
            ['Interaction', 'Own-pace and with-the-beat practice, timing judged Perfect / Good / Early / Late, and menu navigation from the piano keys themselves'],
            ['Status', 'Live and open source (MIT) · 70 commits over two days, October 2026'],
            ['Built with', 'JavaScript modules, Web Audio, Web MIDI, a canvas notation renderer, GitHub Pages'],
        ],
        desc: 'Learning piano from an app usually means keeping up with something that scrolls past you. Keys to the Universe is a free piano course structured like a game instead: lessons are worlds on a galaxy map, songs are broken into a practice plan that goes hand by hand before hands together and slow before full tempo, and the player waits for the right note instead of scrolling past it. It listens four ways — on-screen keys, a computer keyboard, a MIDI piano, or an acoustic piano through the microphone — so the same lesson works whatever is in the room. I set the product direction and the order of the course, and tested it on my own iPad and piano; the code was written by an AI coding agent working to that direction, and every commit says so.',
        caseStudy: 'keys-to-the-universe',
        disciplines: ['Games'],
        related: ['buddyrun', 'recollection'],
    },
    {
        /*
         * This record used to hold two projects at once: Interview With
         * Eternity's name, category and description against HaptiDraw's cover
         * art, video and Devpost link — so /work/interview-with-eternity sent
         * a reader to a different project entirely. The assets and the link
         * are HaptiDraw's, so this entry keeps them and the text is corrected;
         * Interview With Eternity is its own entry below.
         */
        id: 'haptidraw', name: 'HaptiDraw', cat: 'Accessibility · MIT Reality Hack 2025', cover: '/projects/haptidraw/1.jpg',
        bg: 'linear-gradient(145deg,#04151f,#183a37,#c44900)', ico: '✋',
        tags: ['Accessibility', 'Haptics', 'Inclusive Design', 'Hackathon', 'Multisensory', 'Unity C#', 'Python'],
        caption: 'Drawing you can feel — a stylus and a haptic exoskeleton for blind users.',
        glance: [
            ['Team', 'Four people · MIT Reality Hack 2025'],
            ['Platform', 'Haptikos haptic exoskeleton, Logitech MX Ink stylus'],
            ['Interaction', 'Feedback on deviation rather than position: silence means you are on the line, with per-finger haptics carrying the shape'],
            ['Status', 'Working hackathon demonstration, not a validated tool'],
            ['Built with', 'Unity, Python, FastAPI, OpenCV'],
        ],
        desc: 'Digital drawing tools assume you can see what you are making. HaptiDraw lets a blind user draw and read a drawing by touch instead: a silhouette is traced into vector anchor points, a haptic exoskeleton drives feedback per finger, and the stylus buzzes when your hand leaves the line you are following. Built by four people in the length of MIT Reality Hack 2025. The clearest thing that came out of it is that touch does not just replace sight here — it builds a mental map of the drawing that a sighted user gets for free from a glance.',
        caseStudy: 'haptidraw'
    },
    {
        id: 'buddyrun', name: 'Buddy Run', cat: 'Design Research · Biometrics · GSND6340 · 2025', cover: '/projects/buddyrun/1.jpg',
        bg: 'linear-gradient(145deg,#04151f,#432534,#c44900)', ico: '🏃',
        tags: ['Design Research', 'Biometrics', 'Behaviour Change', 'Haptics & Audio', 'Mobile Product', 'Whoop', 'iOS'],
        caption: 'A running coach that guides by rhythm instead of telling you to speed up.',
        glance: [
            ['Team', 'Three people · Biometrics of Design, Fall 2025 · I wrote the heart-rate integration proposal'],
            ['Platform', 'iPhone with a Whoop heart-rate strap'],
            ['Interaction', 'A haptic and audio tempo to match your steps to, and a full-screen colour state readable mid-stride'],
            ['Status', 'Working prototype · tested on ourselves, not yet with outside runners'],
        ],
        desc: 'Most running apps hand you a number and leave you to interpret it mid-stride. Buddy Run is an iPhone coach that reads live heart rate from a Whoop strap and answers with rhythm instead: a haptic and audio tempo you match your steps to, so the guidance arrives through the same channel as the running itself. I worked on it in a three-person team for a graduate Biometrics of Design course. The design turns on one decision — cadence is the lever, not heart rate, because cadence is the one thing a runner can change on command and optical heart-rate sensors lag five to fifteen seconds behind a change in effort. Grounded in running biomechanics and behaviour-change research, and honest about what the sensor could not do.',
        caseStudy: 'buddy-run',
        // In the order they were written, so the narrowing from proposal to
        // prototype is legible: the buddy is in the first document and not in
        // the last.
        documents: [
            {
                label: 'Heart-rate integration proposal',
                file: '/projects/buddyrun/Buddy Run Heart Rate Proposal.pdf',
                note: 'The earliest document, written by me: the AI buddy, HRV trends, and the three data-consent models.',
            },
            {
                label: 'Method plan',
                file: '/projects/buddyrun/Buddy Run Project Prep.pdf',
                note: 'The protocol we designed, against which the autoethnographic fallback should be read.',
            },
            {
                label: 'Final presentation',
                file: '/projects/buddyrun/Buddy Run Final Slides.pdf',
                note: 'The deck as presented, including what the study actually became.',
            },
        ],
    },
    {
        id: 'virtualforest', name: 'Virtual Forest', cat: 'Professional · Unity College XR Innovation Lab · PC & Quest 2 · 2022',
        cover: '/projects/virtualforest/1.jpg',
        bg: 'linear-gradient(145deg,#04151f,#183a37,#2a5a1a)', ico: '🌲',
        tags: ['Simulation', 'Unity C#', 'Meta Quest 2', 'VR', 'Spatial Audio', 'Game UI', 'QA & Build Management', 'Plastic SCM', 'Environmental Education'],
        caption: 'A forest for practising fieldwork before the field — on student laptops, and on a standalone Quest 2.',
        glance: [
            ['Role', 'Extended Reality Developer (co-op) · gameplay and menu work, spatial audio, Quest 2 performance, QA and builds'],
            ['Employer', 'Unity College XR Innovation Lab — now Unity Environmental University'],
            ['Platform', 'Windows and Mac (PC edition) · standalone Meta Quest 2 (VR edition)'],
            ['Interaction', 'Mission-based field surveys, menu and options navigation, and a soundscape that follows player position, weather and time of day'],
            ['Status', 'January–May 2022 · PC edition used in the college’s coursework'],
            ['Built with', 'Unity 2020.3 and 2021.3, C#, Ambient Sound Manager, Plastic SCM, Unity Cloud Build'],
        ],
        desc: 'Field scientists collect data they cannot easily check against anyone else’s. Virtual Forest gives students a forest to practise in first: missions that ask them to observe and survey animals and insects in a simulated environment, so the habits are learned before the data counts. I worked on it for five months as an Extended Reality Developer co-op at Unity College’s XR Innovation Lab, my first job in games and XR, across two editions — a PC version for Windows and Mac that went into the college’s coursework, and a standalone Quest 2 version. My work ran from gameplay and menus to a 3D soundscape that follows the player, weather and time of day, to getting the VR build to hold frame rate without a cable, and the testing and build management that kept both editions shippable.',
        caseStudy: 'virtual-forest',
        disciplines: ['XR & Spatial', 'Games'],
        related: ['seereality'],
    },
    {
        id: 'truthancientforest', name: 'Truth of the Ancient Forest', cat: 'Board Game · Rapid Idea Prototyping · 2021', cover: '/projects/truthancientforest/1.jpg',
        bg: 'linear-gradient(145deg,#04151f,#183a37,#432534)', ico: '🌲',
        tags: ['Rapid Prototyping', 'Game Design', 'Systems Design', 'Physical Prototyping', 'Laser Cutting', 'Board Game', 'Iteration'],
        caption: 'A wooden survival board game whose map does not exist until you walk into it.',
        glance: [
            ['Role', 'Game designer · tile and card art by Divine Siam'],
            ['Platform', 'Tabletop · paper, then laser-cut wood'],
            ['Mechanics', 'A map built from tiles as players move into it, rationing, blind trading'],
            ['Status', 'Four playable versions, 2021'],
        ],
        desc: 'Four village leaders ration food and shelter while racing to open an ancient temple, across a forest that is not printed on a board \u2014 the map is a pile of numbered tiles laid down as players move into it, so the space everyone is competing over gets built during play. Made in four versions for an undergraduate rapid-prototyping course, from paper to laser-cut wood. The design document is an explicit list of what I added and what I removed each version, and the removals are the real work: a fully specified weather system cut for stopping the table, direct player attacks cut for making comebacks impossible, and real religious iconography cut because borrowing two living faiths as set dressing for a temple you loot was not mine to do.',
        caseStudy: 'truth-of-the-ancient-forest',
        documents: [
            {
                label: 'Design document',
                file: '/projects/truthancientforest/Truth of the Ancient Forest Design Document.pdf',
                note: 'Every addition and subtraction across four versions. The subtractions are the argument.',
            },
            {
                label: 'Rules, version 4',
                file: '/projects/truthancientforest/Truth of the Ancient Forest Rules v4.pdf',
                note: 'The game as finished: durability, the tile system, blind trading, and the seven spells.',
            },
            {
                label: 'Pitch',
                file: '/projects/truthancientforest/Truth of the Ancient Forest Pitch.pdf',
                note: 'Written for a publisher, and already proposing a VR version in 2021.',
            },
        ]
    },
    {
        id: 'bofum', name: 'BOFUM', cat: 'Asymmetric Co-op · MIT Reality Hack 2026', cover: '/projects/bofum/1.png',
        bg: 'linear-gradient(145deg,#04151f,#183a37,#c44900)', ico: '🎲',
        tags: ['Asymmetric Co-op', 'Physical Computing', 'Custom Hardware', 'Arduino', 'Hackathon', 'Unity C#', 'MIT Reality Hack'],
        caption: 'One ball, one maze, two players — and neither of them can do it alone.',
        glance: [
            ['Team', 'Five people · MIT Reality Hack 2026'],
            ['Platform', 'VR headset plus a handmade Arduino tilt controller'],
            ['Interaction', 'Split information: one player sees the maze and cannot move it, the other tilts it and cannot see it'],
            ['Status', 'Hackathon prototype'],
            ['Built with', 'Unity, C#, Arduino'],
        ],
        desc: 'A two-player labyrinth built on a deliberate split: the player in the headset can see the maze and cannot move it, and the player holding the board can tilt the whole world but cannot see any of it. Getting the ball through tight passages, drops and dead ends is therefore a conversation rather than a skill \u2014 the design makes talking to each other the only available mechanic. The controller is handmade from foam board, felt and duct tape around an Arduino, and the useful thing we learned is that incomplete information invites creativity rather than frustration, provided the maze is tuned so communication is necessary but not punishing. Made with a team of five at MIT Reality Hack 2026.'
    },
    {
        id: 'mergepoint', name: 'Merge Point', cat: 'Cross-Platform VR + AR Co-op · Team Project · 2025',
        cover: '/projects/mergepoint/1.jpg',
        bg: 'linear-gradient(145deg,#04151f,#183a37,#c44900)', ico: '🚂',
        tags: ['Asymmetric Co-op', 'Cross-Platform XR', 'Multiplayer XR', 'Meta Quest 3', 'Mobile AR', 'ARCore', 'Unity C#'],
        caption: 'One player in a headset, the rest on phones, and a portal between them that only works if they talk.',
        glance: [
            ['Team', 'Tom Tang, Nandita Venkat, Nadia Youssef, Jingren Ma and me · the document’s cover lists the other four'],
            ['My part', 'The multiplayer system meant to connect the Quest headset and a phone in one synced space'],
            ['Platform', 'Meta Quest 3 (VR) and Android phones (AR)'],
            ['Interaction', 'Asymmetric roles across devices: the VR player moves a portal window and feeds and repairs; phone players draw food and pass parts through it'],
            ['Status', 'Design document, April 2025 · the team did not finish a running cross-platform prototype'],
            ['Built with', 'Unity 2022.3, OpenXR, Meta XR SDK, Google ARCore'],
        ],
        desc: 'An intergalactic zoo train has crashed on an alien planet and the animals are loose. One player is on the planet in VR, on a Quest 3. The others are on phones in the real room, looking into that world through a passthrough portal window that the VR player carries and positions. The VR player has to keep the animals fed, keep the carnivores away from the herbivores, and repair the train; the phone players have the materials to do it with.\n\nThe interaction design is a split of abilities across devices. The VR player teleports by raycast, grabs with the controller, sees a hunger bar over each animal and a red highlight on damaged train parts, and fits a part where a green highlight shows it belongs. A phone player taps to pick up the train parts floating around their room, swipes them through the portal, and makes food by opening a whiteboard, choosing the hungry animal, and tracing a dotted sketch of what it eats — a steak for the lion — before tapping Create to turn it into a 3D object. Nothing tells either side what the other needs except talking: the scene table’s entry for that step reads “speaking out loud. use your mouth and ears”. The train fixed is a win; hunger run out and more than one animal eaten is a loss.\n\nI worked on the multiplayer system meant to put the headset and the phone in one synced space — the part every other mechanic depends on, since the portal is only a window if both devices agree where things are. By the team’s own account in the design document, a running cross-platform prototype was not finished in time for proof-of-concept testing, so what is here is the design: the scene-by-scene interaction table, the colour explorations and the phone and TV interface screens.',
        stillAlts: [
            'Colour exploration 2: the same scene in deep greens with an orange train and a yellow-clad child beside the portal ring.',
            'Colour exploration 3: autumn oranges and yellows, a blue train and a red-clad child beside the portal ring.',
            'Colour exploration 4: olive greens with a red train and an orange-clad child beside the portal ring.',
            'Colour exploration 5: cool greens and a pale sky with an orange train and a pink-clad child beside the portal ring.',
        ],
        figures: [
            {
                src: '/projects/mergepoint/figs/ar-player-ui.jpg',
                caption: 'The phone and TV interface: palette, title screen, the train-crash alert, “What can you do?”, the camera view, the food-drawing notepad with animal choices and Generate, and win and lose screens.',
                source: 'Merge Point Design Document (04/25/2025), p. 9 · “AR Player UI”',
            },
            {
                src: '/projects/mergepoint/figs/interaction-matrix-p2.jpg',
                caption: 'The technology package and the start of the scene-by-scene table, which sets VR, AR, interaction, assets, audio and code side by side for each step.',
                source: 'Merge Point Design Document (04/25/2025), p. 2',
            },
        ],
        disciplines: ['XR & Spatial', 'Games'],
        related: ['bofum', 'internshipintheafterlife'],
    },
    {
        id: 'wallace', name: 'Wallace', cat: 'Horror Game · Survival · 2025', cover: '/projects/wallace/1.png',
        bg: 'linear-gradient(145deg,#080608,#140e10,#201418)', ico: '🐕',
        tags: ['Horror', 'Unity', 'Survival', 'Atmosphere', 'First Person', 'Halloween', 'WebGL'],
        caption: 'Give out candy. Do your tasks. Do not let Wallace out.',
        glance: [
            ['Team', 'Built mainly by me and Ren, with small contributions from four others'],
            ['Platform', 'PC and browser (WebGL)'],
            ['Controls', 'WASD to move, left click to interact'],
            ['Status', 'Playable in the browser and on itch.io, 2025'],
            ['Built with', 'Unity'],
        ],
        desc: 'A short first-person horror game built on a task list. You\'re watching your neighbor\'s house for the night. Give out candy to trick-or-treaters — or don\'t, but leave the lights off. Take care of their very special dog, Wallace. Keep the front and back doors open for visitors. Do your tasks or die. Wallace is a real dog, by the way. WASD to move, Left Click to interact. Volume up.\n\nThe design document, under the working title Night With Wallace, builds the horror out of obligations that compete for the same pair of hands. There are chores to finish before the family gets home — laundry, washing and putting away the dishes in an Overcooked style, taking the trash out to the backyard. There is Wallace, who needs feeding and letting out, and who makes trouble when he is ignored: knocking things off surfaces, biting light bulbs, moving the candy bowl. And there is the door, where trick-or-treaters want the right amount of candy and will not wait for it.\n\nSound is what the document asks the player to manage those three with. Wallace barks when he is up to something, and the bark is both the warning and the clue to where he is — ignore it, and you no longer know what he has done or where. The doorbell and knocking pull you to the front of the house. The consequences stack: a visitor kept waiting too long cuts the power on the way out, sending you to the generator, and Wallace grows far more aggressive in the dark; let his needs build up and he kills you.\n\nThat is the design as written. The playable build carries the core of it — candy at the door, Wallace’s care, a house that goes dark, and a task list you fail at your peril — and this page does not claim the rest of the document’s list shipped.'
    },
    {
        id: 'returnofthechickens', name: 'Return of the Chickens', cat: 'VR Shooter · Demo · 2024', cover: '/projects/returnofthechickens/1.png',
        bg: 'linear-gradient(145deg,#1a1505,#4a3a10,#7a6020)', ico: '🐔',
        tags: ['VR Shooter', 'Meta Quest', 'Unity', 'Boston FIG 2024', 'SideQuest'],
        caption: 'Chi\'King and Chi\'Queen want your farm. Give them the Cluckshot Cannon.',
        glance: [
            ['Platform', 'Meta Quest'],
            ['Status', 'Demo on SideQuest · Boston FIG 2024 Online Expo · Northeastern Senior Games Showcase 2024'],
            ['Built with', 'Unity'],
        ],
        desc: 'A VR shooter where you play as a farmer facing a full chicken invasion. Fight back with Foul Play Firearms like the Cluckshot Cannon. Northeastern Senior Games Showcase 2024 and Boston Festival of Indie Games 2024 Online Expo. Available on SideQuest.',
        related: ['attackofthechickens'],
    },
    {
        id: 'attackofthechickens', name: 'Attack of the Chickens VR', cat: 'VR Game Jam · Global Game Jam 2024',
        cover: '/projects/attackofthechickens/0.jpg',
        bg: 'linear-gradient(145deg,#1a1505,#4a3a10,#7a6020)', ico: '🥚',
        tags: ['VR', 'Hand Interaction', 'Game Jam', 'Global Game Jam 2024', 'Comedy'],
        caption: 'You stole their eggs. Now the chickens want them back — and the eggs are all you have to fight with.',
        glance: [
            ['Event', 'Global Game Jam 2024 at Northeastern University, hosted by the NU Game Dev Club · theme “Make Me Laugh”'],
            ['Credit', 'Listed on the jam certificate as “by Tomme Denney”'],
            ['Platform', 'VR'],
            ['Interaction', 'Your own hands and the stolen eggs, against a flock charging across the farmyard'],
            ['Status', 'Jam build, January 2024 · headset capture at the top of this page'],
        ],
        desc: 'The theme was Make Me Laugh, so the premise is a farmer who stole the eggs and has to answer for it: the chickens leave the coop and come for you, and the only weapons in reach are your own hands and the eggs themselves.\n\nThe capture is first-person from the headset — two virtual hands at the bottom of the frame, a low-poly farmyard with a windmill and a barn, eggs and feathers in the air, and chickens running at the player from every side. It is a jam game, made at Northeastern’s site for Global Game Jam 2024 (22–28 January), and the whole design is one repeated physical action: turn your hands and the eggs on whatever is coming next.\n\nReturn of the Chickens, the VR shooter on this site, is a later game on the same premise.',
        stillAlts: ['Global Game Jam 2024 certificate of participation for Attack of the Chickens, by Tomme Denney.'],
        related: ['returnofthechickens'],
    },
    {
        id: 'arworkofart', name: 'AR Work of Art', cat: 'MR Art · Rhythm · XR 5010 · 2024', cover: '/projects/arworkofart/1.png',
        bg: 'linear-gradient(145deg,#04151f,#432534,#c44900)', ico: '🎵',
        tags: ['Interactive Art', 'Mixed Reality', 'Rhythm', 'Co-Creation', 'Meta Quest 3', 'Unity C#', 'XR 5010'],
        caption: 'Hit the blocks and the room fills with particles. Miss them and it empties again.',
        glance: [
            ['Platform', 'Meta Quest 3 mixed reality'],
            ['Interaction', 'Failure subtracts: a missed block dims the particles and the music instead of costing points'],
            ['Status', 'Course prototype, 2024 · on itch.io'],
            ['Built with', 'Unity, C#'],
        ],
        desc: 'Most virtual art asks you to look at it. This asks whether the audience can hold the pen: a 360\u00b0 mixed-reality rhythm game where hitting blocks fires particle effects into the room and missing them lets those effects fade, with three audio tracks layering in as you sustain it.\n\nThe one decision worth keeping is that failure subtracts instead of punishing. Missing a block does not deduct points or end a run \u2014 it dims the particles and lowers the music. There is no scoreboard, because the state of the artwork is the readout: if it is dark and quiet, that describes your performance rather than judging it. A score would have made the art a container for a game; making the art the readout means a player cannot help authoring it.\n\nIt came out of a podcast interview with Nancy Baker Cahill about siting AR work in contested places in New Orleans, which is where I am from \u2014 the same Cahill who turns up two years later as one of four precedents in my thesis. My verdict at the time was that it did not fully meet my expectations, and I still think the particle system carries more of it than the interaction does.',
        documents: [
            {
                label: 'Project write-up',
                file: '/projects/arworkofart/AR Work of Art Write-Up.pdf',
                note: 'The argument as submitted: co-creation, Cahill, and the rhythm-game lineage.',
            },
        ]
    },
    {
        id: 'interviewwitheternity', name: 'Interview With Eternity', cat: 'VR Embodiment · XR 5010 · 2024', cover: '/projects/interviewwitheternity/1.jpg',
        bg: 'linear-gradient(145deg,#04151f,#183a37,#432534)', ico: '♾️',
        tags: ['VR', 'Embodiment', 'Accessibility', 'Existential', 'Gaze Interaction', 'Unity C#', 'XR 5010'],
        caption: 'A soul before birth, choosing whether to be mortal \u2014 and all you can do is look.',
        glance: [
            ['Platform', 'VR'],
            ['Interaction', 'Gaze is the only input — no hands, no controllers'],
            ['Status', 'Course prototype, 2024 · no capture survives'],
            ['Built with', 'Unity, C#'],
        ],
        desc: 'You wake as a soul in an eternal void, before a life, and you are asked whether you want to be born mortal.\n\nThere are no hands, no controllers and nothing to pick up. Agency is removed on purpose: an immortal soul with no power to change the course of time should not have a grab button, and constraining the player\u2019s physical capability to match the avatar\u2019s condition makes the helplessness legible rather than merely described. You are not told the void is inescapable \u2014 you find that there is nothing to do about it. Gaze being the only input also makes this the most accessible thing I have built, which I did not design for and would keep on purpose now.\n\nThe mirrors in the void show no reflection. That came from a specific gap in DeVeaux et al. on attribute discrepancy in social VR, which found that people build avatars resembling or idealising themselves to different degrees \u2014 I wanted to know what happens when a user is given no appearance to choose at all. So the physical self and the virtual self collapse into the same blank thing, with no discrepancy left to negotiate.\n\nThere is no video and there are no screenshots of this experience, which is the reason it is a project here and not a case study.',
        documents: [
            {
                label: 'Project write-up',
                file: '/projects/interviewwitheternity/Interview With Eternity Write-Up.pdf',
                note: 'The embodiment reasoning, the two cited readings, and where the idea came from.',
            },
        ]
    },
    {
        id: 'spark', name: 'Spark', cat: 'Service Design · Design for Dignity · ARTG5710 · 2026', cover: '/projects/spark/1.jpg',
        bg: 'linear-gradient(145deg,#04151f,#183a37,#c44900)', ico: '✨',
        tags: ['Service Design', 'Co-Design', 'Design for Dignity', 'Accessibility', 'Intergenerational', 'Systems Mapping', 'Personas & Journeys'],
        caption: 'A card game an older adult designs the rules for, and their grandchild has to follow.',
        desc: 'Older adults are usually framed as people who need to be taught technology. Spark starts from a different reading of the same problem: the exclusion is not from the device, it is from the moments happening around it — the group chat, the shared joke, the plan everyone else is already inside. So Spark is a facilitated session where an older adult and a younger relative design a card game together, and the older adult authors the rules. The younger one follows them. The facilitator hands over a card that says Elder Expert and then spends the rest of the session getting out of the way. Built with two teammates for a graduate Design for Dignity course, as a full service design: research, personas, a fifteen-stage journey, a service blueprint, and a system map.',
        caseStudy: 'spark',
        documents: [
            {
                label: 'Final presentation',
                file: '/projects/spark/SPARK Final Presentation.pdf',
                note: 'The service blueprint, the framework, and the prompt decks.',
            },
            {
                label: 'Hero\u2019s journey map',
                file: '/projects/spark/SPARK Heros Journey Map.pdf',
                note: 'Fifteen stages, the ten-panel storyboard, and the three-layer system map, with the dignity pillars marked where each one activates.',
            },
            {
                label: 'Intervention',
                file: '/projects/spark/SPARK Intervention.pdf',
                note: 'Secondary research, both personas, the design identity, and the perception-gap argument.',
            },
            {
                label: 'Arrangement',
                file: '/projects/spark/SPARK Arrangement.pdf',
                note: 'The journey map and storyboard as presented.',
            },
            {
                label: 'Research',
                file: '/projects/spark/SPARK Research.pdf',
                note: 'The opening brainstorm and the three directions we started from.',
            },
        ]
    },
    /*
     * The six deployments below are the same body of work as the See Reality
     * entry above, one card each. They exist because every one of them has
     * footage of the thing running in the place it was built for and a client
     * name a reader recognises, and because a deployment is what an employer
     * is actually asking about. `partOf` points each one back at the roster
     * page, which is where the work is listed in full.
     */
    {
        id: 'relive1776', name: 'Relive 1776', cat: 'Mixed Reality · See Reality · Freedom Trail, Boston · Live',
        cover: '/projects/relive1776/0.jpg',
        bg: 'linear-gradient(145deg,#04151f,#432534,#c44900)', ico: '💥',
        tags: ['Mixed Reality', 'Meta Quest', 'Passthrough', 'Procedural Interaction', 'Hand Tracking', 'Unity C#', 'Heritage', 'Live Deployment'],
        caption: 'Revolutionary Boston in mixed reality, on the bricks where it happened — five experiences inside a two-hour guided tour.',
        glance: [
            ['Interaction', 'Ordered procedural interaction (the cannon) and reach-to-touch hand tracking, registered to the real plaza'],
            ['Platform', 'Meta Quest mixed reality'],
            ['Status', 'Live on a two-hour guided tour'],
        ],
        desc: 'The tour operation my earliest See Reality work fed into: five mixed-reality experiences along the Freedom Trail — Sons of Liberty, Five Shots at Midnight, a 17th-century Faneuil Hall market, Paul Revere’s Ride, and the Bunker Hill cannon, which teaches a visitor to load and fire a field gun by hand, in order. It sells as a two-hour guided tour rated 4.9 out of 5 across 83 TripAdvisor reviews.\n\nEverything is registered to the real place: the market lines up with a colonnade that is still standing, the cannon sits on the plaza’s actual bricks, and tourists who paid for nothing walk through the frame while a guest works the gun.',
        partOf: 'seereality'
    },
    {
        id: 'lexington', name: 'Town of Lexington', cat: 'Mixed Reality · See Reality · Lexington, Massachusetts · Live',
        cover: '/projects/lexington/0.jpg',
        bg: 'linear-gradient(145deg,#04151f,#183a37,#432534)', ico: '🏛️',
        tags: ['Mixed Reality', 'Mobile AR', 'Meta Quest', 'Tablet AR', 'Public Sector', 'Historical Reconstruction', 'Unity C#', 'Live Deployment'],
        caption: 'Three XR experiences twenty-five town guides can drop into tours they already give — plus mobile AR off the street signage.',
        desc: 'A municipal client rather than a private operator, which changes the brief: Lexington runs a walking-tour programme with more than twenty-five guides, so the target was not one flagship but three experiences any guide could add to their own tour on tablets and headsets, without rehearsal. Visitors stand where buildings no longer exist and see them rebuilt — the Meeting House and the Belfry — meet figures including Anna Harrington, and are put inside moments from the Battle of Lexington in April 1775.\n\nThe half I find most interesting has no guide at all: free mobile AR triggered by QR codes on city signage, for someone who walks up with a phone and no ticket. The deployment was covered by Boston’s 7NEWS in a segment titled High-Tech History.',
        partOf: 'seereality'
    },
    {
        id: 'nashvilleadventures', name: 'Nashville Adventures', cat: 'XR Walking Tour · See Reality · Nashville, Tennessee · Live',
        cover: '/projects/nashvilleadventures/0.jpg',
        bg: 'linear-gradient(145deg,#0e0418,#2a0e48,#c44900)', ico: '🎸',
        tags: ['XR Experience', 'Meta Quest', 'Guided Tour Integration', 'Historical Reconstruction', 'Unity C#', 'Live Deployment'],
        caption: 'Four XR scenes threaded through one guided walk — the original settlers, the architecture, early Music City, rock and roll.',
        desc: 'Four experiences our team designed and built into a single guided walking tour through Nashville: the city’s first settlers at Fort Nashborough, its historical architecture, early Music City, and the rock-and-roll era of the clubs and streets the group is walking down. The scenes layer onto the physical city while participants keep listening to a live guide, so the cut points are set by the guide’s storytelling rather than by the software.\n\nThe deployment was covered in a Talk of the Town segment with the operator’s founder on the Cumberland riverfront.',
        partOf: 'seereality'
    },
    {
        id: 'showmeitaly', name: 'ShowMeItaly', cat: 'VR & MR · See Reality · Rome & Pompeii · Live',
        cover: '/projects/showmeitaly/0.jpg',
        bg: 'linear-gradient(145deg,#1a0a05,#4a2010,#c44900)', ico: '🏟️',
        tags: ['VR', 'Mixed Reality', 'Meta Quest', 'Historical Reconstruction', 'Paid Add-On', 'Throughput', 'Unity C#', 'Live Deployment'],
        caption: 'Seven experiences sold as a paid add-on in Rome and Pompeii — gladiators from the arena floor, Vesuvius before and after.',
        desc: 'Seven experiences built for one of the larger operators working Rome and Pompeii, sold into their tours as a paid immersive add-on: meeting Julius Caesar, fighting gladiators from the floor of the real Colosseum arena, four temples of the Roman Forum, an ancient Pompeii market, and Pompeii before and after Vesuvius.\n\nWhat matters here is commercial rather than technical. This is XR running inside an operation working at Roman volumes, where the failure modes that count are throughput, device turnaround between groups, and how fast a guide can recover a guest who is stuck.',
        partOf: 'seereality'
    },
    {
        id: 'ridesolar', name: 'Ride Solar', cat: 'XR Tour Integration · See Reality · Prince Edward Island & Nova Scotia · Live',
        cover: '/projects/ridesolar/0.jpg',
        bg: 'linear-gradient(145deg,#04151f,#183a37,#c44900)', ico: '🦞',
        tags: ['XR Experience', 'Guided Tour Integration', 'Meta Quest', 'Pacing & Handback', 'Unity C#', 'Live Deployment'],
        caption: 'Around six XR moments dropped into a historic walking tour and a food-and-drink tour in Atlantic Canada.',
        desc: 'See Reality partnered with Ride Solar to put XR inside two live tours: a historic walking tour and a food-and-drink tour where the immersive content is tied to what is being eaten and where it came from. The operator advertises four time moments on the walk and three on the tasting.\n\nGuests step onto a 19th-century lobster boat and deal with the crew, meet the figures behind Canadian Confederation, walk a market of the Anne of Green Gables era, and run into dinosaurs — all without the tour stopping. The design question was pacing rather than fidelity: each segment has to end cleanly enough that a guide can pick the group back up and walk them to the next stop.',
        partOf: 'seereality'
    },
    {
        id: 'venicecitytours', name: 'Venice City Tours', cat: '360° & XR · See Reality · Venice, Italy · Live, plus work in progress',
        cover: '/projects/venicecitytours/0.jpg',
        bg: 'linear-gradient(145deg,#050e1a,#0e2860,#183a37)', ico: '🚣',
        tags: ['360° Video', 'AR Glasses', 'Localisation', 'Multiplayer XR', 'Normcore', 'Unity C#', 'Live Deployment'],
        caption: 'A cinematic 360° piece in five languages on AR glasses, a gondola you paddle yourself — and multiplayer racing in progress.',
        desc: 'Two things worth separating. A cinematic 360° experience delivered on lightweight AR glasses, localised into five languages so an international group can each take it in their own — which is not a translation pass when the content is timed to a guide’s narration, because it changes pacing and how long the segment takes. And an XR gondola simulator where a participant paddles through a stylised medieval Venice while the guide carries on managing the group in the real world.\n\nI am currently building a multiplayer gondola racing experience off the back of it, networked with Normcore: several participants in one shared scene, racing rather than taking turns. It is in development and nothing about it is deployed.',
        partOf: 'seereality'
    },
    {
        id: 'internshipintheafterlife', name: 'Internship in the Afterlife', cat: 'VR Puzzle · XR 5020 · 2024', cover: '/projects/internshipintheafterlife/1.png',
        bg: 'linear-gradient(145deg,#10080a,#301818,#502828)', ico: '👻',
        tags: ['VR', 'Hand Interaction', 'Language & Empathy', 'Meta Quest', 'Unity', 'XR 5020'],
        caption: 'Your first day on the afterlife’s front desk: spell each soul’s name from memory, in a language you may not read.',
        glance: [
            ['Team', 'Three people · Jingren (Komi) Ma, Namrata Mahesh Shajwani and Tomme Denney · XR 5020, taught by Prof. Wallace Lages'],
            ['My part', 'I built the interaction systems and programmed the game · Komi and Namrata did the 3D modelling, and Komi drew the storyboards'],
            ['Platform', 'Meta Quest (Android)'],
            ['Interaction', 'Grab a letter block, place it in order, and the name is checked: right sends the soul up the stairway, wrong sends it through the trap door'],
            ['Status', 'Course final, December 2024 · on itch.io'],
            ['Built with', 'Unity'],
        ],
        desc: 'You work the check-in booth of the afterlife. A soul arrives, its name is shown for a moment, and then you have to rebuild it from memory: the syllables come out of a mystery box one at a time, slot-machine style, and you place each block in order on the display in front of the soul. Spell it right and the soul is certified and walks up the stairway; spell it wrong and the floor opens. Drop five and you are fired. The report planned names in English, Mandarin and Hindi, so the puzzle is partly memory and partly reading a script you may not know — the point of the project, which the team framed around the language barriers international students, tourists and immigrants deal with.\n\nThe interaction is one loop of grasp, place and check, and the capture shows each part: putting on the employee lanyard to start, the prompt to memorise the name, hands picking up coloured letter blocks, and the two endings — “Congratulations, you did great” and “You are fired”. The team’s report also specified the feedback for that loop in haptics: a light vibration when a block is picked up, a gentle ting for a correct placement, and a stronger, buzzer-like pulse for a wrong one, with recorded phrases in several dialects adding pressure after a mistake. That is the plan as written; the capture cannot show whether the haptics shipped.\n\nMade by three people for XR 5020, taught by Prof. Wallace Lages. Komi drew the storyboards below, Komi and Namrata did the 3D modelling, and I built the interaction systems — the grab, the placement, the check and the consequences — and programmed the game.',
        figures: [
            { src: '/projects/internshipintheafterlife/figs/storyboard-1.jpg', caption: 'Putting on the afterlife employee card to enter the game.', source: 'Storyboard by Jingren (Komi) Ma · team project report, 2024, p. 5' },
            { src: '/projects/internshipintheafterlife/figs/storyboard-2.jpg', caption: 'The player as receptionist: “Welcome to Afterlife — what’s your name?”', source: 'Storyboard by Jingren (Komi) Ma · team project report, 2024, p. 5' },
            { src: '/projects/internshipintheafterlife/figs/storyboard-3.jpg', caption: 'A soul shows its name for a few seconds, to be remembered.', source: 'Storyboard by Jingren (Komi) Ma · team project report, 2024, p. 5' },
            { src: '/projects/internshipintheafterlife/figs/storyboard-4.jpg', caption: 'Letter cubes to grab with a controller and place in the answer box.', source: 'Storyboard by Jingren (Komi) Ma · team project report, 2024, p. 5' },
            { src: '/projects/internshipintheafterlife/figs/storyboard-5.jpg', caption: 'The name spelled correctly, and the halo appears.', source: 'Storyboard by Jingren (Komi) Ma · team project report, 2024, p. 5' },
            { src: '/projects/internshipintheafterlife/figs/storyboard-6.jpg', caption: 'The certified soul moves on to the stairway.', source: 'Storyboard by Jingren (Komi) Ma · team project report, 2024, p. 5' },
            { src: '/projects/internshipintheafterlife/figs/storyboard-7.jpg', caption: 'A soul whose name is written in another language.', source: 'Storyboard by Jingren (Komi) Ma · team project report, 2024, p. 6' },
            { src: '/projects/internshipintheafterlife/figs/storyboard-8.jpg', caption: 'The name spelled wrong: crossed-out blocks and a flame.', source: 'Storyboard by Jingren (Komi) Ma · team project report, 2024, p. 6' },
            { src: '/projects/internshipintheafterlife/figs/storyboard-9.jpg', caption: 'After five souls are dropped through the trap door, the receptionist is fired.', source: 'Storyboard by Jingren (Komi) Ma · team project report, 2024, p. 6' },
        ],
    },
    {
        id: 'toweroffrankenfrog', name: 'Tower of Frankenfrog', cat: 'Tower Defense · Husky Jam 2024', cover: '/projects/toweroffrankenfrog/1.png',
        bg: 'linear-gradient(145deg,#0a1a08,#1a3a12,#2a5a1a)', ico: '🐸',
        tags: ['Tower Defense', 'Strategy', 'Game Design', 'Monsters', 'Husky Jam', '2024'],
        caption: 'Frankenfrog holds the line against waves stranger than the last.',
        desc: 'A tower defense game where Frankenfrog and his amphibian army hold the line against an increasingly unhinged parade of enemies. Strategic depth wrapped in a creature-feature aesthetic. Created for Husky Jam 2024.'
    },
    {
        id: 'greatvendingmachine', name: 'Great Vending Machine', cat: '3D Platformer · Horror · 2023', cover: '/projects/greatvendingmachine/1.png',
        bg: 'linear-gradient(145deg,#0a0a1a,#20201a,#403a10)', ico: '🎰',
        tags: ['WebGL', 'Unity', '3D Platformer', 'Horror', 'Japan', 'Study Abroad'],
        caption: 'A coin. A machine. Tokyo at midnight. Something is wrong inside.',
        desc: '"Great Vending Machine" is a 3D platformer infused with horror, where you play as a coin navigating the inner workings of a vending machine. Conceived as the culminating project during a study abroad in Tokyo and Kyoto, Japan in 2023.'
    },
    {
        id: 'soulsolace', name: 'Soul Solace', cat: 'Narrative Game · Brackeys 2023', cover: '/projects/soulsolace/1.png',
        bg: 'linear-gradient(145deg,#0a0a1a,#1a1a4a,#2a2a8a)', ico: '🌊',
        tags: ['Game Jam', 'Narrative', 'Unity', 'Brackeys 2023'],
        caption: 'Introspection, hidden truths, and a family that holds more than it shows.',
        desc: 'Soul Solace immerses players in a journey of introspection, unearthing hidden truths and navigating complex moral dilemmas. Created as a submission to Brackeys Game Jam 2023. WASD to move, Left Click to interact, ESC to exit.'
    },
    {
        id: 'godsdrunkestdriver', name: "God's Drunkest Driver", cat: 'Racing · Husky Jam 2023', cover: '/projects/godsdrunkestdriver/1.png',
        bg: 'linear-gradient(145deg,#1a0a05,#4a2010,#8a4020)', ico: '🚗',
        tags: ['Racing', 'Arcade', 'Unity', 'Physics', 'Husky Jam 2023'],
        caption: 'A magic potion, a midnight road, and absolutely no plan.',
        desc: 'You are GOD\'S DRUNKEST DRIVER. Driving through midnight, you drink a "magic potion" to stay awake — but it makes the road trip far more than average. A to steer, Mouse to look, Spacebar to drink.'
    },
    {
        id: 'unforgottenstories', name: 'Unforgotten Stories', cat: 'Narrative Game · Hidden Heroes Jam 2023', cover: '/projects/unforgottenstories/1.png',
        bg: 'linear-gradient(145deg,#1a0a0a,#4a1a1a,#8a2a2a)', ico: '📖',
        tags: ['Narrative', 'Unity', 'WebGL', 'Heritage', 'Partition', 'Playable'],
        caption: 'Seven years old. Forced from home. The Partition, lived from the inside.',
        glance: [
            ['Team', 'Team Let’s Go Eevee · Tejim, Ronak and me'],
            ['Platform', 'Windows, and playable in the browser'],
            ['Interaction', 'Look to select, left click to act, left click held to decide — and a toy to look at for comfort'],
            ['Status', 'Released on itch.io and GameJolt, 2023'],
            ['Built with', 'Unity'],
        ],
        desc: 'Step into the shoes of one developer\'s grandmother during the Pakistani-Indian Partition. As a seven-year-old ripped from Karachi, you navigate the streets, survive the journey, and uncover the truth behind your family\'s past.\n\nThe team’s design document, revised after looking at Before Your Eyes, keeps the input deliberately small for a child’s point of view: looking around is limited, looking at an object is what makes it interactive, a left click acts, and a left click held for three seconds makes a decision. The first decision comes at home — the parents say there is only room for one toy, a cloth doll or a pinwheel, and the capture shows the child asking to bring both. The toy chosen then stays with her: in the document, looking at it slows time and brings back the memory of being given it, and the objective on screen during the walk through Karachi reads “witness events or look at your toy for comfort”.\n\nThe flow is linear by design. A scene cannot be revisited once left, and the story moves between the ship and the memories of the city, with the child led through Karachi by a parent’s hand — free to look around, not to walk away. The document also asks for grayscale, black borders like a film, and an interface that stays out of the way; the two menu sketches below are from it, a title screen with the ship idling at sea and a pause menu over a darkened scene.',
        figures: [
            {
                src: '/projects/unforgottenstories/figs/title-menu-sketch.png',
                caption: 'Title screen sketch: the ship at sea under a placeholder title, with Start, Load, Settings and Exit along the bottom.',
                source: 'Unforgotten Stories Design Documentation V3, p. 8 · Team Let’s Go Eevee, 2023',
            },
            {
                src: '/projects/unforgottenstories/figs/pause-menu-sketch.png',
                caption: 'Pause menu sketch: Resume, Settings, Save and Exit listed over a darkened crowd scene.',
                source: 'Unforgotten Stories Design Documentation V3, p. 8 · Team Let’s Go Eevee, 2023',
            },
        ],
    },
    {
        id: 'flora', name: 'Flora Park Mystery', cat: 'Murder Mystery · Global Game Jam 2023', cover: '/projects/flora/1.png',
        bg: 'linear-gradient(145deg,#0a1a0a,#1a3a1a,#2a5a2a)', ico: '🌺',
        tags: ['Murder Mystery', '3D', 'Point & Click', 'Global Game Jam 2023'],
        caption: 'A murder in the park. Only you can piece it together.',
        desc: 'A 3D point-and-click murder mystery created for the 2023 Global Game Jam in Boston at Northeastern University, hosted by the Game Development Club.'
    },
    {
        id: 'walk', name: 'Walk Among Us', cat: 'Museum Game · Personal · 2022', cover: '/projects/walk/1.png',
        bg: 'linear-gradient(145deg,#101010,#1e1e1e,#2a2828)', ico: '🚶',
        tags: ['Educational', 'Museum', 'Black History', 'Northeastern', 'AFAM Studies'],
        caption: 'A museum tribute to the history of Black characters in video games.',
        desc: 'Walk Among Us is a tribute to the history of Black characters in the world of video games. Created as the culmination of studies in African American and Africana Studies under Prof. Dr. Layla Brown at Northeastern University. WASD to move, Left Click to interact.'
    },
    {
        id: 'whatremainsofme', name: 'What Remains of Me', cat: 'Puzzle Platformer · Games@Northeastern Studio · 2022',
        cover: '/projects/whatremainsofme/0.jpg',
        bg: 'linear-gradient(145deg,#04151f,#183a37,#432534)', ico: '🤖',
        tags: ['Platformer', 'Puzzle', 'Game Systems Design', 'Studio Production', 'Unity', 'Student Studio'],
        caption: 'A robot reawakened in a drowned AI laboratory — made by a student studio organised like a real one.',
        glance: [
            ['Team', 'Games@Northeastern Studio · I was in Logistics & Studio Management, and in the Game Systems Design group, which wrote the wire and energy/virus documents together'],
            ['Platform', 'Windows, macOS, Linux, and in the browser on itch.io'],
            ['Mechanics', 'A wire for swinging and for plugging in: drain energy from battery packs and transfer it to terminals, and — in the design documents — drain or overload enemies and manage a virus that rides on your energy'],
            ['Status', 'Alpha prototype on itch.io · version 0.1.5 was the studio’s GDC build'],
            ['Built with', 'Unity'],
        ],
        desc: 'You play as Atlas, a robot reactivated in an abandoned, high-tech AI laboratory at the bottom of the ocean. It is a puzzle platformer: you upgrade Atlas’s abilities to get through the facility, deal with the feral AI in your way, and piece together what happened to the world and why you were switched back on. In the build shown here, Atlas runs on an energy meter, and energy Atlas has drained can be transferred into terminals to power the platforms you need to cross.\n\nTwo documents we wrote together in the Game Systems Design group, “Interaction (Wire, virus and energy) systems” and the “NEW battery and virus design document” (spring 2023), set out the rules underneath that — both are below. The wire is both the way around and the weapon: thrown toward the cursor, it plugs into the nearest pluggable object; holding the throw slows time to aim it in the air; on the ground it reels in and out to follow Atlas, and in the air it can be firmed up or swung to a 45-degree limit. Plugged into an enemy, the player chooses between draining it — taking its energy — and overloading it — pushing Atlas’s own energy in — and an enemy driven past full charge is stunned. Energy is Atlas’s health, and virus is carried as a share of it: draining an infected enemy pulls its virus across — not at all from a clean enemy, and faster the more infected the enemy is — and Atlas shuts down at 0% energy or 100% virus. The spring 2023 document adds that charging from a clean source dilutes the virus, and that an enemy with no virus is docile until it is given some.\n\nThe capture shows the wire swing, draining a battery pack, and spending that energy to power a terminal. Overload and the virus meter are in the documents but not in the footage, and the build’s HUD is a plain battery. The indicator the documents describe was drawn as a ring of charge and infection states, and a browser charge test shows how charge and virus read on an enemy outlet.\n\nThe game was made by Games@Northeastern: Studio, and the class that built it was organised to simulate a game studio. The class was split into departments — Art, Assets & Sound; Audience, covering quality assurance, community management and user research; Design; Logistics & Studio Management; Narrative & Story Development; and Programming & Implementation — and then into discipline groups: six content-design teams, Community Management, Game Systems Design, NPC Systems Design, Project Management, Quality Assurance and User Research.\n\nI was assigned to Logistics & Studio Management as my department and to Game Systems Design as my discipline group, where the wire and energy/virus rules were written as a group; the game as built is the whole studio’s. What the project gave me was the experience of design and production working as separate groups with handoffs between them, inside a structure that ran its own playtesting — the studio’s itch.io page still carries its user-research survey.',
        stillAlts: ['The What Remains of Me title logo, lettered in rusted pipes.'],
        figures: [
            {
                src: '/projects/whatremainsofme/figs/energy-virus-indicator.png',
                caption: 'The energy and virus indicator as a set of states: a ring of green charge that gives way to purple as infection rises, through to empty.',
                source: '“NEW battery and virus design document” (spring 2023) · Game Systems Design group, including me',
            },
            {
                src: '/projects/whatremainsofme/figs/charge-test.png',
                caption: 'The browser charge test: Charge, Virus and Limiter sliders and a Lock control, driving an enemy outlet’s ring.',
                source: 'Charge test, linked from the spring 2023 document · captured October 2026',
            },
            {
                src: '/projects/whatremainsofme/figs/swing-tutorial.png',
                caption: 'The swing tutorial: “To swing: L Mouse / R Trigger”, on keyboard and gamepad.',
                source: 'Gameplay capture, alpha build',
            },
            {
                src: '/projects/whatremainsofme/figs/drain-dialogue.png',
                caption: 'An NPC teaching the drain: “did you know you can drain energy from battery packs?”',
                source: 'Gameplay capture, alpha build',
            },
            {
                src: '/projects/whatremainsofme/figs/wire-to-terminal.png',
                caption: 'Atlas wired into a terminal beside a battery pack, the energy meter part spent.',
                source: 'Gameplay capture, alpha build',
            },
            {
                src: '/projects/whatremainsofme/figs/terminal-powered.png',
                caption: 'The wire run to a terminal whose screen has turned blue, beside a platform track.',
                source: 'Gameplay capture, alpha build',
            },
            {
                src: '/projects/whatremainsofme/figs/wire-on-enemy.png',
                caption: 'The wire plugged into an enemy robot.',
                source: 'Gameplay capture, alpha build',
            },
        ],
        extraLinks: [{ url: 'https://what-remains-of-me-charge-test.netlify.app/', label: 'Open the charge test' }],
        documents: [
            {
                label: 'Interaction (Wire, virus and energy) systems',
                file: '/projects/whatremainsofme/Interaction (Wire, virus and energy) systems.pdf',
                note: 'Key bindings, the wire as traversal and weapon, drain and overload, and the energy/virus rules with worked infection rates.',
            },
            {
                label: 'NEW battery and virus design document (spring 2023)',
                file: '/projects/whatremainsofme/NEW battery and virus design document (spring 2023).pdf',
                note: 'The energy/virus system revisited: clean charging, docile enemies, the indicator states and the charge-test link.',
            },
        ],
        related: ['greatvendingmachine'],
    },
    {
        id: 'otherrealm', name: 'Other Realm', cat: 'Narrative Game · Twine · 2021', cover: '/projects/otherrealm/1.png',
        bg: 'linear-gradient(145deg,#0a1a0a,#1a4a1a,#2a7a2a)', ico: '🌿',
        tags: ['Narrative Design', 'Twine', 'Horror', 'Story', 'Playable', 'Web'],
        caption: 'Two teenagers. One demon. A bond that refuses to break.',
        desc: 'A narrative-driven script built in Twine 2.3, created as a final project for Narrative for Games under Prof. Brandon Sichling. Two teenagers with a unique bond are separated by a demon looking to feast on their souls.'
    },
    {
        id: 'forbidden', name: 'Forbidden', cat: 'Horror Game · Unreal Engine · Personal · 2021',
        cover: '/projects/forbidden/1.jpg',
        bg: 'linear-gradient(145deg,#080608,#1e1208,#3a2410)', ico: '🐝',
        tags: ['Horror', 'Unreal Engine', 'Level Design', 'Environment Design', 'Environmental Storytelling', 'Enemy Design', 'Blender', 'AI Programming'],
        caption: 'An inherited house, parents who are not there, and a spirit that lives only in the dark.',
        glance: [
            ['Role', 'Game design, level and environment design, character and enemy design, sound effects and music, and AI programming'],
            ['Collaborator', 'Christian Rice, my cousin — story concept and development'],
            ['Story', 'Investigating a family home through letters and notes found in it'],
            ['Status', 'Personal project, 2021'],
            ['Built with', 'Unreal Engine, Blender'],
        ],
        desc: 'You play a college student who comes home at her parents’ request and learns she has inherited her grandmother’s house and land. When she arrives, her parents are nowhere to be found. A letter in the house describes the killings of an old woman, a middle-aged woman and a middle-aged man by someone unidentified, and she has to wonder whether that was her family. Searching further turns up a note about a local legend: a ghost that only exists in shadow, with a hook for a hand and bees pouring out of his chest. The goal is to find out what happened to the family and stop the Forbidden spirit from hurting anyone else.\n\nI made it in Unreal Engine, doing the game design, level and environment design, character and enemy design (modelled in Blender), sound effects and music, and the enemy’s AI programming. The story concept and its development are my cousin Christian Rice’s.\n\nThe story is told through the house itself — the player learns what happened by reading what was left in it — so most of the work shown here is environment. The stills are the grounds at night and the interior rooms the investigation moves through, lit by warm practical lights against the dark.',
        stillAlts: [
            'A bonfire burning in a field of tall grass in front of the house at night, behind a lit wooden fence.',
            'The game room: a pool table and seating under recessed ceiling lights.',
            'A living room with a pool table, a low glass table on a rug, and a doorway into a lit hall.',
            'The kitchen: dark cabinets, a coffee maker on the counter, and an open doorway at the far end.',
            'A bedroom with a patterned bedspread, a dresser with an old television, and a bathroom off to the left.',
            'A bedroom strung with fairy lights along striped walls, a bed in the corner.',
            'A small bathroom: pedestal sink, mirror, pink towel and an arched shower curtain.',
        ],
        related: ['wallace', 'handsup'],
    },
    {
        id: 'handsup', name: 'Hands Up', cat: 'Interactive Drama · Research Assistant · Unreal Engine · 2021',
        cover: '/projects/handsup/1.jpg',
        bg: 'linear-gradient(145deg,#050810,#101828,#1e2a40)', ico: '🏙️',
        tags: ['Interactive Drama', 'Research Project', 'Unreal Engine', 'Level Design', 'Environment Design', 'Character Design', 'Serious Games'],
        caption: 'A single-player interactive drama about racial injustice and police violence, from a research project led by Dr. Derek Curry.',
        glance: [
            ['Role', 'Research assistant · game, level and environment, and character design in Unreal Engine'],
            ['Research lead', 'Dr. Derek Curry, Associate Professor of Art + Design, Northeastern University'],
            ['Experience', 'Single-player and 3D: the player acts as a police officer through stories of wrongful judgment, and remedies the injustices in them'],
            ['Status', 'Research project, 2021'],
            ['Built with', 'Unreal Engine'],
        ],
        desc: 'Hands Up is a single-player, 3D interactive drama that uses the form of a video game to explore racial injustice and police violence. The player acts as a police officer and goes through stories of wrongful judgment, with the chance to remedy the injustices in them.\n\nThe project is Dr. Derek Curry’s. I worked on it as a research assistant, using Unreal Engine as a game designer, level and environment designer, and character designer, on the visuals the player sees while playing. The research, its framing and its narrative are not mine to claim, and this page does not describe findings.\n\nThe stills are environment work from the project: city streets at night, built to be the setting for these encounters.',
        stillAlts: [
            'A street corner at night under a traffic signal, with a crosswalk in the foreground.',
            'A dark street at night with a lamp post, a trash can on the sidewalk and a lit shopfront to the left.',
            'A night skyline: dark towers with scattered lit windows, viewed from above.',
        ],
        disciplines: ['Games'],
        related: ['walk', 'forbidden'],
    },
    {
        id: 'curse', name: 'Curse of the Mind', cat: 'Platformer · Jam-O-Lantern 2021', cover: '/projects/curse/1.png',
        bg: 'linear-gradient(145deg,#0e0808,#201010,#341818)', ico: '🌑',
        tags: ['Platformer', 'Unity', 'First Game', 'Gravity', 'Dash', 'Jam-O-Lantern 2021'],
        caption: 'My first ever digital game — gravity-flipping, dash-dashing chaos.',
        desc: 'Curse of the Mind is my very first digital game. A platformer with a gravity-flip mechanic. WASD to move, Shift to dash, R then F to flip gravity.'
    },
];

export const PMAP: Record<string, Project> = Object.fromEntries(
    PROJECTS.map((p) => [p.id, p]),
);

export type ExternalSite = { url: string; label: string };

export const PROJECT_EXTERNAL_SITES: Record<string, ExternalSite> = {
    recollection: { url: 'https://recollection.usurperinteractive.com', label: 'Visit Recollection' },
    arworkofart: { url: 'https://tommedenney.itch.io/ar-work-of-art', label: 'View on Itch.io' },
    curse: { url: 'https://tommedenney.itch.io/curse-of-the-mind-demo', label: 'Download on Itch.io' },
    flora: { url: 'https://tommedenney.itch.io/flora-park-mystery', label: 'Download on Itch.io' },
    godsdrunkestdriver: { url: 'https://tommedenney.itch.io/gods-drunkest-driver', label: 'Download on Itch.io' },
    greatvendingmachine: { url: 'https://tommedenney.itch.io/great-vending-machine', label: 'View on Itch.io' },
    iamyou: { url: 'https://tommedenney.itch.io/i-am-you', label: 'Download on Itch.io' },
    internshipintheafterlife: { url: 'https://tommedenney.itch.io/internship-in-the-afterlife', label: 'Download on Itch.io' },
    haptidraw: { url: 'https://devpost.com/software/haptidraw', label: 'View on Devpost' },
    returnofthechickens: { url: 'https://tommedenney.itch.io/return-of-the-chickens-demo', label: 'Download on Itch.io' },
    soulsolace: { url: 'https://tommedenney.itch.io/soul-solace', label: 'Download on Itch.io' },
    otherrealm: { url: 'https://tommedenney.itch.io/the-other-realm', label: 'Play on Itch.io' },
    toweroffrankenfrog: { url: 'https://tommedenney.itch.io/tower-of-franken-frog', label: 'Download on Itch.io' },
    unforgottenstories: { url: 'https://tommedenney.itch.io/unforgotten-stories-the-partition', label: 'Play on Itch.io' },
    walk: { url: 'https://tommedenney.itch.io/walkamongus', label: 'Download on Itch.io' },
    wallace: { url: 'https://tommedenney.itch.io/wallace', label: 'Download on Itch.io' },
    bofum: { url: 'https://devpost.com/software/bofum', label: 'View on Devpost' },
    seereality: { url: 'https://www.seereality.world/', label: 'See Reality' },
    keystotheuniverse: { url: 'https://tommedenney.github.io/keys-to-the-universe/#/learn', label: 'Open the live app' },
    whatremainsofme: { url: 'https://whatremainsofme.itch.io/what-remains-of-me', label: 'Play on Itch.io' },
    relive1776: {
        url: 'https://www.tripadvisor.com/AttractionProductReview-g60745-d28008309-Relive_1776_See_Boston_s_History_in_Augmented_Reality_AR-Boston_Massachusetts.html',
        label: 'Relive 1776 on TripAdvisor',
    },
    lexington: { url: 'https://www.tourlexington.us/', label: 'Tour Lexington' },
    nashvilleadventures: { url: 'https://www.nashvilleadventures.com/', label: 'Nashville Adventures' },
    showmeitaly: { url: 'https://showmeitaly.com/', label: 'ShowMeItaly' },
    ridesolar: { url: 'https://ridesolar.com/', label: 'Ride Solar' },
    venicecitytours: { url: 'https://www.venicecitytours.it/', label: 'Venice City Tours' }
};

export type Embed = { src: string; itchio: string | null };

/**
 * Projects playable in an iframe.
 *
 * `otherrealm` pointed at projects/otherrealm/index.html, which has never
 * existed in this repo and 404s on the live site — the Twine export is named
 * otherrealm.html. Corrected here.
 */
export const PROJECT_EMBEDS: Record<string, Embed> = {
    greatvendingmachine: { src: 'https://tommedenney.github.io/GVMHost/', itchio: 'https://tommedenney.itch.io/great-vending-machine' },
    unforgottenstories: { src: 'https://tommedenney.github.io/UnforgottenStoriesWebGLHost/', itchio: null },
    otherrealm: { src: '/projects/otherrealm/otherrealm.html', itchio: null },
    wallace: { src: 'https://tommedenney.github.io/WallaceWebGLHost/', itchio: 'https://tommedenney.itch.io/wallace' },
};

/** The four spring-loaded cards in the hero, left to right. */
export const HERO_IDS = ['seereality', 'genexr', 'bofum', 'greatvendingmachine'];

/** The auto-advancing carousel under "Featured Work". */
export const FEATURED_IDS = ['seereality', 'genexr', 'unforgottenstories', 'greatvendingmachine'];

/** "Play Now on Web" — the subtitle is per-card, not a project field. */
export const PLAY_WEB: { id: string; sub: string }[] = [
    { id: 'wallace', sub: 'Horror · Survival' },
    { id: 'greatvendingmachine', sub: '3D Platformer · Horror' },
    { id: 'unforgottenstories', sub: 'Narrative · Heritage' },
];
