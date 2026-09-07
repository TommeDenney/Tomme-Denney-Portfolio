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
        id: 'recollection', name: 'Recollection', cat: 'Product · Usurper Interactive · Live · 2026', cover: '/projects/recollection/1.png',
        bg: 'linear-gradient(145deg,#04151f,#432534,#183a37)', ico: '💍',
        tags: ['Product Design', 'Service Design', 'Privacy by Design', 'Onboarding', '360° Video', 'WebXR', 'Unity C#', 'Cloudflare'],
        caption: 'Every camera on every moment of a wedding, opened from a link with no account and no app.',
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
        id: 'genexr', name: 'Inhabiting Memory', cat: 'Master’s Thesis · Spatial Design · Design Research · 2026', cover: '/projects/genexr/1.png',
        bg: 'linear-gradient(145deg,#0e0418,#2a0e48,#4a1888)', ico: '🧬',
        tags: ['Spatial Design', 'Design Research', 'Immersive Genealogy', 'Comfort & Locomotion', 'Interview-Led Design', 'Master’s Thesis', 'Meta Quest 3', 'Unity C#', 'Gaussian Splatting'],
        caption: 'A family museum you enter on foot — built from interviews, tested against flat photographs.',
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
    {
        id: 'buddyrun', name: 'Buddy Run', cat: 'Design Research · Biometrics · GSND6340 · 2025', cover: '/projects/buddyrun/1.jpg',
        bg: 'linear-gradient(145deg,#04151f,#432534,#c44900)', ico: '🏃',
        tags: ['Design Research', 'Biometrics', 'Behaviour Change', 'Haptics & Audio', 'Mobile Product', 'Whoop', 'iOS'],
        caption: 'A running coach that guides by rhythm instead of telling you to speed up.',
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
        desc: 'Digital drawing tools assume you can see what you are making. HaptiDraw lets a blind user draw and read a drawing by touch instead: a silhouette is traced into vector anchor points, a haptic exoskeleton drives feedback per finger, and the stylus buzzes when your hand leaves the line you are following. Built by four people in the length of MIT Reality Hack 2025. The clearest thing that came out of it is that touch does not just replace sight here — it builds a mental map of the drawing that a sighted user gets for free from a glance.',
        caseStudy: 'haptidraw'
    },
    {
        id: 'iamyou', name: 'I Am You', cat: 'VR Horror · XR 5010 · 2024', cover: '/projects/iamyou/1.png',
        bg: 'linear-gradient(145deg,#04151f,#183a37,#432534)', ico: '📸',
        tags: ['VR', 'Embodiment', 'Comfort & Locomotion', 'Horror', 'Narrative', 'Unity C#', 'XR 5010'],
        caption: 'You are not the hiker. You are the trail camera watching him, steering his body.',
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
        id: 'truthancientforest', name: 'Truth of the Ancient Forest', cat: 'Board Game · Rapid Idea Prototyping · 2021', cover: '/projects/truthancientforest/1.jpg',
        bg: 'linear-gradient(145deg,#04151f,#183a37,#432534)', ico: '🌲',
        tags: ['Rapid Prototyping', 'Game Design', 'Systems Design', 'Physical Prototyping', 'Laser Cutting', 'Board Game', 'Iteration'],
        caption: 'A wooden survival board game whose map does not exist until you walk into it.',
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
        id: 'seereality', name: 'See Reality', cat: 'XR Studio · Client Work · 2024–Present', cover: '/projects/seereality/0.png',
        bg: 'linear-gradient(145deg,#050e1a,#0e2860,#1a449a)', ico: '🌐',
        tags: ['Unity C#', 'Meta Quest', 'URP', 'XR Experience', 'Client Work'],
        caption: 'Real-world client XR — from colonial installations to stadium fan experiences.',
        desc: 'Immersive XR experiences built for world-class clients spanning heritage, sports, and entertainment — from Fort Nashborough colonial installations to Liverpool FC fan experiences. Built with Unity C#, Meta Quest hardware, and custom URP shader pipelines optimized for standalone passthrough.\n\nClients & Collaborators: See Reality · Nashville Adventures · Town of Lexington, MA · Liverpool FC · Venice City Tours · Faneuil Hall'
    },
    {
        id: 'bofum', name: 'BOFUM', cat: 'XR Game · MIT Reality Hack 2026', cover: '/projects/bofum/1.png',
        bg: 'linear-gradient(145deg,#040c04,#0e2810,#1a4a1e)', ico: '🎮',
        tags: ['XR', 'Unity', 'MIT Reality Hack', 'Multiplayer', 'Hackathon', 'Spatial Game'],
        caption: 'Built in 72 hours at MIT Reality Hack 2026 — spatial, wild, and alive.',
        desc: 'BOFUM is a spatial XR game built in 72 hours at MIT Reality Hack 2026. Designed for mixed reality with physical space as the playing field — fast, chaotic, and built to surprise. Check it out on Devpost.'
    },
    {
        id: 'interviewwitheternity', name: 'Interview With Eternity', cat: 'VR Experience · XR 5010 · 2026', cover: '/projects/interviewwitheternity/1.jpg',
        bg: 'linear-gradient(145deg,#08080e,#14122a,#1e1848)', ico: '✨',
        tags: ['VR', 'Avatar Embodiment', 'Existential', 'HCI', 'XR 5010', 'Gaze Interaction'],
        caption: 'Before you are born — choose mortality, or choose forever.',
        desc: 'A VR experience where you assume the identity of a soul before birth, confronting the existential choice between mortality and immortality. Using only gaze to respond, players are stripped of agency — heightening embodiment and isolation. A submission for the VR Embodiment Project in XR 5010.'
    },
    {
        id: 'wallace', name: 'Wallace', cat: 'Horror Game · Survival · 2025', cover: '/projects/wallace/1.png',
        bg: 'linear-gradient(145deg,#080608,#140e10,#201418)', ico: '🐕',
        tags: ['Horror', 'Unity', 'Survival', 'Atmosphere', 'First Person', 'Halloween', 'WebGL'],
        caption: 'Give out candy. Do your tasks. Do not let Wallace out.',
        desc: 'You\'re watching your neighbor\'s house for the night. Give out candy to trick-or-treaters — or don\'t, but leave the lights off. Take care of their very special dog, Wallace. Keep the front and back doors open for visitors. Do your tasks or die. Wallace is a real dog, by the way. WASD to move, Left Click to interact. Volume up.'
    },
    {
        id: 'internshipintheafterlife', name: 'Internship in the Afterlife', cat: 'Narrative Game · XR 5020 · 2024', cover: '/projects/internshipintheafterlife/1.png',
        bg: 'linear-gradient(145deg,#10080a,#301818,#502828)', ico: '👻',
        tags: ['Narrative', 'Comedy', 'Game Design', 'Afterlife', 'XR 5020', 'Interactive Fiction'],
        caption: 'Your first performance review is from beyond the grave. Good luck.',
        desc: 'What happens when your internship is in the afterlife? Navigate a bureaucratic underworld, complete absurd tasks for spectral supervisors, and try to survive your first performance review — from beyond the grave. Created as XR 5020 Course Final 2024.'
    },
    {
        id: 'toweroffrankenfrog', name: 'Tower of Frankenfrog', cat: 'Tower Defense · Husky Jam 2024', cover: '/projects/toweroffrankenfrog/1.png',
        bg: 'linear-gradient(145deg,#0a1a08,#1a3a12,#2a5a1a)', ico: '🐸',
        tags: ['Tower Defense', 'Strategy', 'Game Design', 'Monsters', 'Husky Jam', '2024'],
        caption: 'Frankenfrog holds the line against waves stranger than the last.',
        desc: 'A tower defense game where Frankenfrog and his amphibian army hold the line against an increasingly unhinged parade of enemies. Strategic depth wrapped in a creature-feature aesthetic. Created for Husky Jam 2024.'
    },
    {
        id: 'returnofthechickens', name: 'Return of the Chickens', cat: 'VR Shooter · Demo · 2024', cover: '/projects/returnofthechickens/1.png',
        bg: 'linear-gradient(145deg,#1a1505,#4a3a10,#7a6020)', ico: '🐔',
        tags: ['VR Shooter', 'Meta Quest', 'Unity', 'Boston FIG 2024', 'SideQuest'],
        caption: 'Chi\'King and Chi\'Queen want your farm. Give them the Cluckshot Cannon.',
        desc: 'A VR shooter where you play as a farmer facing a full chicken invasion. Fight back with Foul Play Firearms like the Cluckshot Cannon. Northeastern Senior Games Showcase 2024 and Boston Festival of Indie Games 2024 Online Expo. Available on SideQuest.'
    },
    {
        id: 'arworkofart', name: 'AR Work of Art', cat: 'AR · Rhythm Game · XR 5010 · 2024', cover: '/projects/arworkofart/1.png',
        bg: 'linear-gradient(145deg,#1a0a2e,#4a1888,#7040b5)', ico: '🎨',
        tags: ['AR', 'MR', 'Rhythm Game', 'Unity', 'Particles', 'Immersive Media', 'XR 5010'],
        caption: 'Hit the beat, build the atmosphere — miss it and watch it fall apart.',
        desc: 'An AR/MR rhythm game where players hit spawning cubes in a full 360° space — each hit activating one of ten unique particle effects and layering audio tracks. Miss a cube and the world dims. Inspired by Guitar Hero, Beat Saber, and Pistol Whip. Class project for XR 5010.'
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
        desc: 'Step into the shoes of one developer\'s grandmother during the Pakistani-Indian Partition. As a seven-year-old ripped from Karachi, you navigate the streets, survive the journey, and uncover the truth behind your family\'s past.'
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
        id: 'otherrealm', name: 'Other Realm', cat: 'Narrative Game · Twine · 2021', cover: '/projects/otherrealm/1.png',
        bg: 'linear-gradient(145deg,#0a1a0a,#1a4a1a,#2a7a2a)', ico: '🌿',
        tags: ['Narrative Design', 'Twine', 'Horror', 'Story', 'Playable', 'Web'],
        caption: 'Two teenagers. One demon. A bond that refuses to break.',
        desc: 'A narrative-driven script built in Twine 2.3, created as a final project for Narrative for Games under Prof. Brandon Sichling. Two teenagers with a unique bond are separated by a demon looking to feast on their souls.'
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
    recollection: { url: 'https://recollection.usurperinteractive.com', label: 'Visit Recollection ↗' },
    arworkofart: { url: 'https://tommedenney.itch.io/ar-work-of-art', label: 'View on Itch.io ↗' },
    curse: { url: 'https://tommedenney.itch.io/curse-of-the-mind-demo', label: 'Download on Itch.io ↗' },
    flora: { url: 'https://tommedenney.itch.io/flora-park-mystery', label: 'Download on Itch.io ↗' },
    godsdrunkestdriver: { url: 'https://tommedenney.itch.io/gods-drunkest-driver', label: 'Download on Itch.io ↗' },
    greatvendingmachine: { url: 'https://tommedenney.itch.io/great-vending-machine', label: 'View on Itch.io ↗' },
    iamyou: { url: 'https://tommedenney.itch.io/i-am-you', label: 'Download on Itch.io ↗' },
    internshipintheafterlife: { url: 'https://tommedenney.itch.io/internship-in-the-afterlife', label: 'Download on Itch.io ↗' },
    haptidraw: { url: 'https://devpost.com/software/haptidraw', label: 'View on Devpost ↗' },
    returnofthechickens: { url: 'https://tommedenney.itch.io/return-of-the-chickens-demo', label: 'Download on Itch.io ↗' },
    soulsolace: { url: 'https://tommedenney.itch.io/soul-solace', label: 'Download on Itch.io ↗' },
    otherrealm: { url: 'https://tommedenney.itch.io/the-other-realm', label: 'Play on Itch.io ↗' },
    toweroffrankenfrog: { url: 'https://tommedenney.itch.io/tower-of-franken-frog', label: 'Download on Itch.io ↗' },
    unforgottenstories: { url: 'https://tommedenney.itch.io/unforgotten-stories-the-partition', label: 'Play on Itch.io ↗' },
    walk: { url: 'https://tommedenney.itch.io/walkamongus', label: 'Download on Itch.io ↗' },
    wallace: { url: 'https://tommedenney.itch.io/wallace', label: 'Download on Itch.io ↗' },
    bofum: { url: 'https://devpost.com/software/bofum', label: 'View on Devpost ↗' }
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
