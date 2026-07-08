import type { Quest } from "./types";

export const QUESTS: Quest[] = [
  // --- CODING & TECH ---
  {
    id: "nextjs",
    title: "Master Next.js Fullstack",
    category: "Coding & Tech",
    icon: "Code2",
    level: "Epic",
    progress: 80,
    xpReward: 500,
    description:
      "Build and deploy a full-stack Next.js application with server components and API routes. Prove your mastery with a live deployment screenshot.",
    requirements: [
      { id: "r1", label: "Set up App Router & Layouts", description: "Create at least 3 routed pages with nested layouts and navigation." },
      { id: "r2", label: "Add dynamic data fetching", description: "Implement server or client components with real database or API data." },
      { id: "r3", label: "Deploy to production cloud", description: "Deploy cleanly on Vercel, Netlify, or AWS." },
      { id: "r4", label: "Upload proof screenshot", description: "Share a screenshot of your live deployed application." },
    ],
  },
  {
    id: "ai",
    title: "Build an AI Assistant",
    category: "Coding & Tech",
    icon: "Cpu",
    level: "Epic",
    progress: 35,
    xpReward: 580,
    description:
      "Create a helpful AI chatbot or autonomous agent that solves a specific problem or assists users with daily workflows.",
    requirements: [
      { id: "r1", label: "Define assistant personality & scope", description: "Choose a targeted use case and system prompt architecture." },
      { id: "r2", label: "Integrate LLM API or local model", description: "Connect OpenAI, Gemini, Claude, or local Ollama endpoints." },
      { id: "r3", label: "Test interactive chat interface", description: "Verify streaming responses and context memory." },
      { id: "r4", label: "Upload chat proof", description: "Share a screenshot of a successful interaction solving a complex task." },
    ],
  },
  {
    id: "opensource",
    title: "Open Source Contributor",
    category: "Coding & Tech",
    icon: "Globe",
    level: "Legendary",
    progress: 10,
    xpReward: 850,
    description:
      "Give back to the developer community by finding an issue, writing clean code, and submitting a Pull Request to a public repository.",
    requirements: [
      { id: "r1", label: "Find a 'Good First Issue'", description: "Browse GitHub or GitLab for an open bug report or feature request." },
      { id: "r2", label: "Fork repository & code fix", description: "Follow project code style and add appropriate unit tests." },
      { id: "r3", label: "Submit Pull Request", description: "Write a clear PR description detailing your changes and testing." },
      { id: "r4", label: "Upload PR screenshot", description: "Share a screenshot of your submitted or merged Pull Request." },
    ],
  },
  {
    id: "gamedev",
    title: "Indie Game Demo Maker",
    category: "Coding & Tech",
    icon: "Gamepad2",
    level: "Epic",
    progress: 20,
    xpReward: 620,
    description:
      "Design and code a playable 2D or 3D mini-game demo using Godot, Unity, Unreal, or HTML5 Canvas.",
    requirements: [
      { id: "r1", label: "Design core game loop", description: "Map out player controls, rules, and win/lose conditions." },
      { id: "r2", label: "Implement physics & collision", description: "Add movement, boundaries, and interactive sprites or meshes." },
      { id: "r3", label: "Add sound effects & UI", description: "Include score tracking, start menu, and audio feedback." },
      { id: "r4", label: "Upload gameplay screenshot", description: "Capture an exciting action screenshot of your playable demo." },
    ],
  },
  {
    id: "hardware",
    title: "Custom PC or Keyboard Build",
    category: "Coding & Tech",
    icon: "Terminal",
    level: "Journeyman",
    progress: 40,
    xpReward: 450,
    description:
      "Assemble a custom mechanical keyboard from switches and keycaps, or build/upgrade a desktop PC workstation.",
    requirements: [
      { id: "r1", label: "Select components & compatibility", description: "Research switches, PCB, stabilizer lube, or PC hardware specs." },
      { id: "r2", label: "Assemble hardware & wire management", description: "Carefully mount components and route cables cleanly." },
      { id: "r3", label: "Test firmware & acoustics", description: "Flash QMK/VIA keymaps or run system stability benchmarks." },
      { id: "r4", label: "Upload battle-station photo", description: "Share a high-res photo of your completed hardware build." },
    ],
  },

  // --- CULINARY & BAKING ---
  {
    id: "cooking",
    title: "Classic French Gastronomy",
    category: "Culinary & Baking",
    icon: "ChefHat",
    level: "Adventurer",
    progress: 45,
    xpReward: 350,
    description:
      "Master traditional French culinary techniques by preparing a multi-course meal from scratch with authentic ingredients.",
    requirements: [
      { id: "r1", label: "Research authentic French recipes", description: "Study sauce reductions, knife skills, and seasoning balance." },
      { id: "r2", label: "Cook a classic entree & sauce", description: "Prepare Coq au Vin, Boeuf Bourguignon, or Ratatouille." },
      { id: "r3", label: "Plate with bistro aesthetics", description: "Pay attention to garnishing, color contrast, and presentation." },
      { id: "r4", label: "Upload culinary masterpiece photo", description: "Share a vibrant photo of your plated French dish." },
    ],
  },
  {
    id: "sourdough",
    title: "Artisan Sourdough Masterclass",
    category: "Culinary & Baking",
    icon: "Cake",
    level: "Epic",
    progress: 30,
    xpReward: 520,
    description:
      "Nurture a wild yeast starter, perform stretch-and-folds, and bake a crusty sourdough loaf with an open crumb.",
    requirements: [
      { id: "r1", label: "Feed & activate starter", description: "Ensure your wild yeast culture is bubbly and doubles in volume." },
      { id: "r2", label: "Mix, autolyse & bulk fermentation", description: "Execute coil folds and monitor dough aeration." },
      { id: "r3", label: "Shape, score & Dutch oven bake", description: "Create decorative steam scoring and bake with lid on/off." },
      { id: "r4", label: "Upload crumb cross-section photo", description: "Slice your cooled loaf and photograph the open crumb texture." },
    ],
  },
  {
    id: "latteart",
    title: "Specialty Coffee & Latte Art",
    category: "Culinary & Baking",
    icon: "Coffee",
    level: "Journeyman",
    progress: 60,
    xpReward: 380,
    description:
      "Extract a balanced espresso shot and steam velvety microfoam milk to pour Rosetta, Heart, or Tulip latte art.",
    requirements: [
      { id: "r1", label: "Dial in espresso grind size", description: "Achieve a 25-30 second extraction with rich hazelnut crema." },
      { id: "r2", label: "Steam silky microfoam milk", description: "Incorporate air silently to create glossy, wet-paint milk texture." },
      { id: "r3", label: "Pour free-hand latte art", description: "Practice height, flow rate, and wiggle techniques in a ceramic cup." },
      { id: "r4", label: "Upload coffee art photo", description: "Share a bird's-eye view photo of your finished latte art." },
    ],
  },
  {
    id: "streetfood",
    title: "Global Street Food Explorer",
    category: "Culinary & Baking",
    icon: "Utensils",
    level: "Adventurer",
    progress: 20,
    xpReward: 410,
    description:
      "Recreate an authentic street food delicacy from another culture, such as Japanese Takoyaki, Mexican Tacos al Pastor, or Taiwanese Bao.",
    requirements: [
      { id: "r1", label: "Source specialty spices & ingredients", description: "Visit a local international market for authentic condiments." },
      { id: "r2", label: "Execute traditional cooking method", description: "Use high-heat wok searing, skewering, or steaming baskets." },
      { id: "r3", label: "Assemble authentic accompaniments", description: "Prepare homemade salsas, pickled veggies, or dipping sauces." },
      { id: "r4", label: "Upload street food spread photo", description: "Photograph your vibrant international street food feast." },
    ],
  },

  // --- ARTS & CRAFTS ---
  {
    id: "digitalart",
    title: "Fantasy Concept Illustration",
    category: "Arts & Crafts",
    icon: "Palette",
    level: "Adventurer",
    progress: 50,
    xpReward: 440,
    description:
      "Create an original digital artwork or character illustration using Procreate, Photoshop, Krita, or Illustrator.",
    requirements: [
      { id: "r1", label: "Sketch dynamic composition & thumbnails", description: "Explore lighting, focal points, and character silhouettes." },
      { id: "r2", label: "Establish color palette & value structure", description: "Separate foreground, midground, and background contrast." },
      { id: "r3", label: "Refine details & atmospheric lighting", description: "Add rim lighting, textures, and environmental highlights." },
      { id: "r4", label: "Upload artwork export", description: "Share a high-resolution PNG of your finished digital painting." },
    ],
  },
  {
    id: "crochet",
    title: "Crochet & Knit Wearable",
    category: "Arts & Crafts",
    icon: "Scissors",
    level: "Journeyman",
    progress: 40,
    xpReward: 360,
    description:
      "Learn yarn stitching techniques to handcraft a cozy beanie, patterned scarf, or adorable amigurumi plushie.",
    requirements: [
      { id: "r1", label: "Select yarn weight & hook size", description: "Read a pattern gauge and practice basic chain stitches." },
      { id: "r2", label: "Complete body rows & shaping", description: "Maintain even stitch tension across increases and decreases." },
      { id: "r3", label: "Weave in ends & block project", description: "Finish seams cleanly and steam-block for perfect symmetry." },
      { id: "r4", label: "Upload handmade craft photo", description: "Share a proud photo wearing or displaying your fiber creation." },
    ],
  },
  {
    id: "3dprint",
    title: "3D Modeling & Printing Maker",
    category: "Arts & Crafts",
    icon: "Hammer",
    level: "Adventurer",
    progress: 30,
    xpReward: 470,
    description:
      "Design a functional mechanical tool or intricate figurine in Blender/Fusion360 and bring it to life on a 3D printer.",
    requirements: [
      { id: "r1", label: "CAD modeling & mesh optimization", description: "Ensure manifold geometry and proper tolerances for moving parts." },
      { id: "r2", label: "Slice model & configure supports", description: "Set layer height, infill density, and tree supports in Cura/PrusaSlicer." },
      { id: "r3", label: "Execute print & post-processing", description: "Remove support material, sand surfaces, or apply primer." },
      { id: "r4", label: "Upload 3D print photo", description: "Photograph your physical 3D printed object in action." },
    ],
  },
  {
    id: "story-photo",
    title: "Visual Storytelling Essay",
    category: "Arts & Crafts",
    icon: "Camera",
    level: "Adventurer",
    progress: 25,
    xpReward: 340,
    description:
      "Tell a compelling narrative about your city, nature, or daily life through a curated photographic photo essay.",
    requirements: [
      { id: "r1", label: "Define narrative theme", description: "Choose a unified subject like urban architecture or golden hour nature." },
      { id: "r2", label: "Capture composition & lighting", description: "Utilize leading lines, rule of thirds, and natural shadow play." },
      { id: "r3", label: "Color grade & edit series", description: "Develop consistent tones and contrast in Lightroom or darktable." },
      { id: "r4", label: "Upload hero photo", description: "Submit the most powerful shot from your visual essay as proof." },
    ],
  },

  // --- MUSIC & AUDIO ---
  {
    id: "music",
    title: "Compose an Original Song",
    category: "Music & Audio",
    icon: "Music2",
    level: "Journeyman",
    progress: 55,
    xpReward: 400,
    description:
      "Write an original melody, arrange chord progressions, and record a performance clip or DAW production track.",
    requirements: [
      { id: "r1", label: "Write chord progression & melody", description: "Create at least 16 bars of harmonious musical structure." },
      { id: "r2", label: "Arrange instrumentation & rhythm", description: "Layer acoustic instruments, synths, or percussion beats." },
      { id: "r3", label: "Record & mix audio demo", description: "Balance volume levels and apply EQ/reverb in your DAW or recorder." },
      { id: "r4", label: "Upload session screenshot", description: "Share a photo of your instrument setup or DAW timeline." },
    ],
  },
  {
    id: "podcast",
    title: "Launch a Podcast Episode",
    category: "Music & Audio",
    icon: "Music2",
    level: "Journeyman",
    progress: 50,
    xpReward: 390,
    description:
      "Plan an engaging topic, record high-clarity vocal audio, and edit/publish your first podcast episode or audio essay.",
    requirements: [
      { id: "r1", label: "Outline episode outline & research", description: "Script key talking points, interview questions, or storytelling arc." },
      { id: "r2", label: "Record vocal tracks with mic setup", description: "Ensure clean acoustics with minimal background room echo." },
      { id: "r3", label: "Edit audio & add intro music", description: "Remove pauses and master vocal loudness in Audacity or Descript." },
      { id: "r4", label: "Upload waveform or publish screen", description: "Share a screenshot of your published episode or editing timeline." },
    ],
  },

  // --- FITNESS & OUTDOORS ---
  {
    id: "fitness",
    title: "30-Day Movement & Gym Streak",
    category: "Fitness & Outdoors",
    icon: "Dumbbell",
    level: "Legendary",
    progress: 20,
    xpReward: 750,
    description:
      "Commit to 30 days of consistent physical activity—whether lifting weights, calisthenics, yoga, or martial arts.",
    requirements: [
      { id: "r1", label: "Design progressive workout split", description: "Map out push/pull/legs, cardio intervals, or mobility routines." },
      { id: "r2", label: "Log 14 consecutive workouts", description: "Track sets, reps, or heart rate zones consistently." },
      { id: "r3", label: "Hit a personal strength milestone", description: "Achieve a PR on bench press, squats, pull-ups, or flexibility." },
      { id: "r4", label: "Upload workout log or gym selfie", description: "Share a screenshot of your fitness tracker or post-workout photo." },
    ],
  },
  {
    id: "summit",
    title: "Summit a Mountain Peak",
    category: "Fitness & Outdoors",
    icon: "Mountain",
    level: "Adventurer",
    progress: 15,
    xpReward: 480,
    description:
      "Plan an outdoor trekking expedition, navigate wilderness trails, and reach the summit of a local mountain or scenic ridge.",
    requirements: [
      { id: "r1", label: "Route planning & gear preparation", description: "Check topographic maps, weather forecasts, and pack hydration/first aid." },
      { id: "r2", label: "Navigate elevation gain on trail", description: "Complete at least 5 miles or 1,500ft of vertical climb." },
      { id: "r3", label: "Practice Leave No Trace principles", description: "Pack out all waste and respect local flora and wildlife." },
      { id: "r4", label: "Upload summit vista photo", description: "Capture a triumphant photo at the peak or trail overlook." },
    ],
  },
  {
    id: "couch5k",
    title: "Couch to 5K Endurance Run",
    category: "Fitness & Outdoors",
    icon: "Footprints",
    level: "Journeyman",
    progress: 50,
    xpReward: 390,
    description:
      "Train your cardiovascular endurance until you can run 5 kilometers (3.1 miles) continuously without stopping.",
    requirements: [
      { id: "r1", label: "Complete interval running schedule", description: "Alternate between jogging and walking over 3-4 weeks." },
      { id: "r2", label: "Master pacing & breathing rhythm", description: "Maintain a conversational aerobic pace without premature fatigue." },
      { id: "r3", label: "Run 5K non-stop distance", description: "Complete the full 5,000 meter distance in a single training session." },
      { id: "r4", label: "Upload GPS route or pace screen", description: "Share a screenshot from Strava, Apple Health, or Garmin." },
    ],
  },
  {
    id: "handstand",
    title: "Master the Freestanding Handstand",
    category: "Fitness & Outdoors",
    icon: "Flame",
    level: "Epic",
    progress: 25,
    xpReward: 550,
    description:
      "Develop shoulder strength, core stability, and wrist mobility to hold a 10-second freestanding handstand with perfect form.",
    requirements: [
      { id: "r1", label: "Wrist conditioning & hollow body holds", description: "Strengthen forearms and train posterior pelvic tilt." },
      { id: "r2", label: "Wall-assisted balance drills", description: "Practice chest-to-wall holds and single-leg balance taps." },
      { id: "r3", label: "Hold 10-second freestanding balance", description: "Kick up in open space and control balance with finger pressure." },
      { id: "r4", label: "Upload action balance photo", description: "Share a photo or video still holding your impressive handstand." },
    ],
  },
  {
    id: "bikecentury",
    title: "Scenic Cycling Adventure",
    category: "Fitness & Outdoors",
    icon: "Bike",
    level: "Adventurer",
    progress: 35,
    xpReward: 430,
    description:
      "Tune up your bicycle and complete a scenic 25+ mile long-distance cycling route through countryside, coast, or city greenways.",
    requirements: [
      { id: "r1", label: "Bicycle safety check & tire inflation", description: "Inspect brakes, lube chain, and adjust saddle height." },
      { id: "r2", label: "Map scenic low-traffic route", description: "Plan rest stops, water refill points, and scenic viewpoints." },
      { id: "r3", label: "Ride 25+ continuous miles", description: "Maintain steady cadence and proper nutrition during the ride." },
      { id: "r4", label: "Upload bike & landscape photo", description: "Photograph your bicycle parked against a beautiful backdrop." },
    ],
  },

  // --- MINDFULNESS & READING ---
  {
    id: "reading",
    title: "Read 3 Non-Fiction Books",
    category: "Mindfulness & Reading",
    icon: "BookOpen",
    level: "Adventurer",
    progress: 33,
    xpReward: 420,
    description:
      "Expand your intellectual horizons by reading three non-fiction books on philosophy, science, history, or psychology.",
    requirements: [
      { id: "r1", label: "Select 3 transformative titles", description: "Choose books outside your immediate comfort zone or discipline." },
      { id: "r2", label: "Annotate key arguments & quotes", description: "Highlight pivotal chapters and write marginalia notes." },
      { id: "r3", label: "Write 3-bullet summary per book", description: "Synthesize the core thesis and practical life takeaways." },
      { id: "r4", label: "Upload book stack or notes photo", description: "Share a photo of your finished reading stack or journal notes." },
    ],
  },
  {
    id: "meditation",
    title: "14-Day Meditation & Zen Journal",
    category: "Mindfulness & Reading",
    icon: "Smile",
    level: "Journeyman",
    progress: 40,
    xpReward: 350,
    description:
      "Cultivate mental clarity and emotional resilience with 14 consecutive days of mindfulness meditation and gratitude journaling.",
    requirements: [
      { id: "r1", label: "Establish quiet daily sanctuary", description: "Set aside 10-15 minutes each morning or evening without screens." },
      { id: "r2", label: "Practice breath awareness & focus", description: "Observe thoughts without judgment and gently return to the breath." },
      { id: "r3", label: "Keep daily gratitude log", description: "Write down 3 specific things you are grateful for each day." },
      { id: "r4", label: "Upload journal or meditation spot photo", description: "Share a tranquil photo of your journal or peaceful meditation space." },
    ],
  },
  {
    id: "language",
    title: "Conversational Fluency Sprint",
    category: "Mindfulness & Reading",
    icon: "Languages",
    level: "Epic",
    progress: 30,
    xpReward: 510,
    description:
      "Learn essential vocabulary and grammar in a new foreign language until you can hold a 5-minute spontaneous conversation.",
    requirements: [
      { id: "r1", label: "Master 500 core vocabulary words", description: "Use Anki flashcards or Duolingo daily streaks for rapid recall." },
      { id: "r2", label: "Study present & past tense grammar", description: "Understand sentence structure, gender agreement, and common verbs." },
      { id: "r3", label: "Complete 5-minute conversation", description: "Speak with a native speaker on Tandem, iTalki, or in person." },
      { id: "r4", label: "Upload streak or certificate screenshot", description: "Share proof of your language milestone or learning app streak." },
    ],
  },
  {
    id: "declutter",
    title: "Digital & Physical Workspace Zen",
    category: "Mindfulness & Reading",
    icon: "Sun",
    level: "Novice",
    progress: 60,
    xpReward: 250,
    description:
      "Transform your chaotic desk and cluttered computer hard drive into a minimalist, distraction-free sanctuary for peak focus.",
    requirements: [
      { id: "r1", label: "Organize cables & desk ergonomics", description: "Clear unnecessary clutter, adjust monitor height, and route wires." },
      { id: "r2", label: "Achieve Inbox Zero & desktop cleanup", description: "Archive old emails, organize files into folders, and clear desktop icons." },
      { id: "r3", label: "Implement automated backup system", description: "Ensure important documents are synced to cloud or external SSD." },
      { id: "r4", label: "Upload pristine desk setup photo", description: "Share a before/after or clean photo of your organized workspace." },
    ],
  },

  // --- COMMUNITY & GAMING ---
  {
    id: "tabletoprpg",
    title: "Game Master an RPG Campaign",
    category: "Community & Gaming",
    icon: "Trophy",
    level: "Epic",
    progress: 40,
    xpReward: 560,
    description:
      "Write an exciting fantasy questline and Game Master a live Dungeons & Dragons or Tabletop RPG session for your friends.",
    requirements: [
      { id: "r1", label: "Design campaign setting & NPCs", description: "Create compelling villains, town maps, and plot hooks." },
      { id: "r2", label: "Prepare combat encounters & puzzles", description: "Balance monster challenge ratings and design interactive riddles." },
      { id: "r3", label: "Host 3+ hour tabletop gaming session", description: "Guide players through immersive roleplay and tactical combat." },
      { id: "r4", label: "Upload gaming table photo", description: "Photograph your dice, character sheets, and smiling game group." },
    ],
  },
  {
    id: "volunteering",
    title: "Community Service & Impact",
    category: "Community & Gaming",
    icon: "Users",
    level: "Legendary",
    progress: 10,
    xpReward: 800,
    description:
      "Make a tangible positive difference in your local community by volunteering at a food bank, animal shelter, or park cleanup.",
    requirements: [
      { id: "r1", label: "Connect with local charity or cause", description: "Find an organization aligned with environmental or social welfare." },
      { id: "r2", label: "Dedicate 4+ hours of active service", description: "Assist with sorting donations, planting trees, or mentoring youth." },
      { id: "r3", label: "Learn about the mission & impact", description: "Speak with organizers about long-term community solutions." },
      { id: "r4", label: "Upload volunteer action photo", description: "Share a photo participating in the community service event." },
    ],
  },
  {
    id: "zerowaste",
    title: "Zero-Waste & Eco Champion",
    category: "Community & Gaming",
    icon: "Leaf",
    level: "Adventurer",
    progress: 30,
    xpReward: 400,
    description:
      "Reduce your environmental footprint by eliminating single-use plastics, composting food scraps, and shopping sustainably for a week.",
    requirements: [
      { id: "r1", label: "Switch to reusable bags & bottles", description: "Eliminate disposable coffee cups, plastic bags, and utensils." },
      { id: "r2", label: "Set up home food composting", description: "Divert organic kitchen scraps from landfills to nourish soil." },
      { id: "r3", label: "Perform home energy & water audit", description: "Switch to LED bulbs, fix leaks, and optimize thermostat settings." },
      { id: "r4", label: "Upload eco-station or harvest photo", description: "Share a photo of your zero-waste kit, compost, or garden." },
    ],
  },

  // --- DESIGN & CAREER ---
  {
    id: "portfolio",
    title: "Design an Interactive Portfolio",
    category: "Design & Career",
    icon: "Briefcase",
    level: "Adventurer",
    progress: 30,
    xpReward: 450,
    description:
      "Craft a stunning personal portfolio website or case study deck that showcases your professional skills and unique creative voice.",
    requirements: [
      { id: "r1", label: "Establish brand typography & colors", description: "Choose harmonious fonts and a distinctive visual identity." },
      { id: "r2", label: "Write 3 detailed project case studies", description: "Explain the problem, your creative process, and measurable outcomes." },
      { id: "r3", label: "Optimize mobile responsiveness & speed", description: "Ensure flawless layouts across phones, tablets, and desktop displays." },
      { id: "r4", label: "Upload live portfolio screenshot", description: "Share a screenshot of your published professional portfolio." },
    ],
  },
];

export const LEVEL_TITLES = [
  "Novice Wanderer",
  "Apprentice Hero",
  "Journeyman Explorer",
  "Guild Champion",
  "Legendary Sage",
];

export function xpForLevel(level: number): number {
  return level * 1000;
}

export function titleForLevel(level: number): string {
  return LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)];
}

export function badgeForQuest(level: Quest["level"]): string {
  const map: Record<Quest["level"], string> = {
    Novice: "Bronze",
    Journeyman: "Silver",
    Adventurer: "Gold",
    Epic: "Platinum",
    Legendary: "Legendary",
  };
  return map[level];
}
