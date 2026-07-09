import "./globals.css";
import type { Metadata, Viewport } from "next";
import Header from "./components/Header";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "SkillQuest - Adventurer's Guild & RPG Quest Registry",
  description: "Level up your real-world skills with an RPG-style quest board. Track Novice to Legendary bounties, seal visual proof of deeds, and earn guild prestige with fellow adventurers.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "SkillQuest - Adventurer's Guild & RPG Quest Registry",
    description: "Level up your real-world skills with an RPG-style quest board. Track Novice to Legendary bounties, seal visual proof of deeds, and earn guild prestige with fellow adventurers.",
    url: "/",
    siteName: "SkillQuest - Adventurer's Guild",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "SkillQuest - Adventurer's Guild & RPG Quest Board Banner",
      },
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "SkillQuest - Vector Guild Banner",
      },
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "SkillQuest - Guild Emblem Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillQuest - Adventurer's Guild & RPG Quest Registry",
    description: "Level up your real-world skills with an RPG-style quest board. Track Novice to Legendary bounties, seal visual proof of deeds, and earn guild prestige.",
    images: ["/opengraph-image", "/og-image.svg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="min-h-screen w-full overflow-x-hidden antialiased text-[#f4ecd8] bg-[#122017]">
        <AuthProvider>
          <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
            <Header />
            <div className="flex-1 w-full min-w-0">
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
