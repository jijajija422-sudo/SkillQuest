import { ArrowRight, BadgeCheck, BookOpen, Camera, Code2, Dumbbell, Gift, Heart, Music2, Sparkles, SunMedium } from "lucide-react";

const quests = [
  {
    id: "nextjs",
    title: "Master Next.js",
    category: "Coding",
    icon: Code2,
    level: "Epic",
    progress: 80,
    tasks: [
      "Build page routing",
      "Deploy full stack app",
      "Upload proof of project"
    ],
  },
  {
    id: "cooking",
    title: "French Cooking Quest",
    category: "Cooking",
    icon: Dumbbell,
    level: "Adventurer",
    progress: 45,
    tasks: [
      "Research recipes",
      "Cook a meal",
      "Upload meal photo"
    ],
  },
  {
    id: "music",
    title: "Compose a Song",
    category: "Music",
    icon: Music2,
    level: "Journeyman",
    progress: 55,
    tasks: [
      "Write melody",
      "Record clip",
      "Share performance"
    ],
  },
];

const feed = [
  {
    name: "Aurora",
    quest: "Master Next.js",
    badge: "Legendary",
    reaction: "applauded",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1690000000/skill-quest/nextjs.png",
  },
  {
    name: "Ronan",
    quest: "French Cooking Quest",
    badge: "Sage",
    reaction: "cheered",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1690000000/skill-quest/cooking.png",
  },
];

function QuestCard({ quest }: { quest: (typeof quests)[number] }) {
  const Icon = quest.icon;
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{quest.category}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{quest.title}</h3>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{quest.level} Quest</span>
          <span>{quest.progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500" style={{ width: `${quest.progress}%` }} />
        </div>
        <div className="grid gap-2 text-sm">
          {quest.tasks.map((task) => (
            <div key={task} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-slate-600">
              <BadgeCheck className="h-4 w-4 text-emerald-500" />
              <span>{task}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(251,146,60,0.15),_transparent_30%)] px-6 py-10 sm:px-10 lg:px-16">
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/10">
              <Sparkles className="h-4 w-4" />
              SkillQuest — your learning adventure begins here
            </div>
            <div className="max-w-2xl space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Cozy RPG learning</p>
                <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
                  Turn every skill into an epic quest.
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-700">
                  SkillQuest lets self-learners map skill journeys with questlines, proof uploads, guild updates, and class-based progress.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/50">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Character Sheet</p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-white">
                      <span className="text-lg font-semibold">12</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Level</p>
                      <p className="mt-1 text-xl font-semibold text-slate-900">Apprentice Hero</p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>XP Progress</span>
                      <span>4,520 / 5,000</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full w-[90%] animate-pulse rounded-full bg-gradient-to-r from-emerald-400 via-sky-500 to-indigo-600" />
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/50">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Guild Feed</p>
                  <div className="mt-4 space-y-4">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">Aurora completed Master Next.js</p>
                      <p className="mt-2 text-sm text-slate-600">Shared proof and earned the Legend badge.</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">Ronan unlocked French Cooking Quest</p>
                      <p className="mt-2 text-sm text-slate-600">Applauded by the guild for a tasty proof photo.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-950/95 p-8 text-white shadow-2xl shadow-slate-950/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Quest Board</p>
                  <h2 className="mt-2 text-3xl font-bold">Journey map</h2>
                </div>
                <SunMedium className="h-8 w-8 text-amber-300" />
              </div>
              <div className="mt-10 grid gap-4">
                <div className="rounded-3xl bg-slate-900/95 p-5 shadow-inner shadow-slate-950/20">
                  <p className="text-sm text-slate-400">Start</p>
                  <div className="mt-4 flex items-center gap-4 rounded-3xl bg-slate-800 p-4">
                    <div className="h-12 w-12 rounded-2xl bg-sky-500/15" />
                    <div>
                      <p className="font-semibold text-white">Intro adventure</p>
                      <p className="text-sm text-slate-400">Learn core mechanics and claim first badge.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 rounded-3xl bg-slate-900/95 p-6">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Branch: Coding</span>
                    <span>Branch: Creative</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-800 p-4">
                      <p className="text-sm text-slate-400">Build a mini app</p>
                      <p className="mt-2 font-semibold text-white">Questline unlocked</p>
                    </div>
                    <div className="rounded-3xl bg-slate-800 p-4">
                      <p className="text-sm text-slate-400">Create a practice project</p>
                      <p className="mt-2 font-semibold text-white">Creative path</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Proof of Completion</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">Upload your quest evidence</h2>
                </div>
                <Camera className="h-8 w-8 text-slate-700" />
              </div>
              <p className="mt-4 text-slate-600">Submit a screenshot, photo, or video frame to show your achievement and win the guild's applause.</p>
              <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                <Heart className="h-4 w-4 text-rose-400" />
                Upload evidence
              </button>
            </div>
          </div>
        </div>
        <div className="mt-16 grid gap-8 xl:grid-cols-[0.7fr_0.3fr]">
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Questlines</p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-950">Active journeys</h2>
                </div>
                <Gift className="h-8 w-8 text-amber-500" />
              </div>
              <div className="mt-8 grid gap-6">
                {quests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            </div>
          </div>
          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/50">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Guild Highlights</p>
              <div className="mt-6 space-y-4">
                {feed.map((item, index) => (
                  <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-600">{item.reaction} {item.quest}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{item.badge}</span>
                    </div>
                    <div className="mt-4 overflow-hidden rounded-3xl bg-white">
                      <img src={item.image} alt={item.quest} className="h-32 w-full object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-slate-950/95 p-8 text-white shadow-2xl shadow-slate-950/15">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Feature idea</p>
              <h2 className="mt-4 text-2xl font-bold">Live Quest Challenge</h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Add a collaborative guild challenge where students complete themed quests together and earn team trophies.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-slate-300">
                <ArrowRight className="h-4 w-4" />
                Encourage classroom participation with shared milestones.
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
