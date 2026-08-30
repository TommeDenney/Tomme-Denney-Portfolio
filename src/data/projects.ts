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
};

export const PROJECTS: Project[] = [
    {
        id: 'genexr', name: 'Inhabiting Memory', cat: 'Master’s Thesis · XR · Gaussian Splatting · 2026', cover: '/projects/genexr/1.png',
        bg: 'linear-gradient(145deg,#0e0418,#2a0e48,#4a1888)', ico: '🧬',
        tags: ['Meta Quest 3', 'PCVR', 'Gaussian Splatting', 'Unity C#', 'Hand Tracking', 'URP', 'HCI', 'Capstone'],
        caption: 'Walk inside a family memory — photorealistic, spatial, and impossible.',
        desc: 'Inhabiting Memory is a Meta Quest 3 PCVR thesis experience exploring how immersive technology can preserve and reinhabit personal memories through photorealistic Gaussian splatting. Built in Unity with a spatial family timeline, hand-tracking interactions, and custom URP rendering pipelines. Northeastern University M.S. in Extended Reality thesis, 2026.',
        paper: '/projects/genexr/Inhabiting Memory.pdf',
        presentation: '/projects/genexr/Inhabiting Memory Presentation.pdf',
        galleryImages: false
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
        id: 'haptidraw', name: 'Interview With Eternity', cat: 'VR Experience · XR 5010 · 2026', cover: '/projects/haptidraw/1.jpg',
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
        id: 'iamyou', name: 'I Am You', cat: 'VR Horror · Dissociation · 2024', cover: '/projects/iamyou/1.png',
        bg: 'linear-gradient(145deg,#0a1a1a,#1a4a4a,#2a7a7a)', ico: '👤',
        tags: ['VR', 'Horror', 'Dissociation', 'Narrative', 'Trail Camera', 'Psychological'],
        caption: 'Control your body from the outside. Find the photos. Outrun the fear.',
        desc: 'A VR horror adventure where you play as an amateur photographer whose cherished photos are scattered by a sudden wind — and the Ice Cream Man, a haunting manifestation of regret, begins to pursue you. Using trail cameras to direct your own body, you retrieve lost memories from the perspective of an external observer.'
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
