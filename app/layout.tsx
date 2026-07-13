import "./globals.css";
import type { Metadata, Viewport } from "next";
import Header from "./components/Header";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "SkillHub - Universal Skill-Sharing & Exploration Platform",
  description: "Level up your real-world skills with interactive learning explorations. Track your progress from Foundational to Masterclass, submit project verifications, and grow your professional skills.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "SkillHub - Universal Skill-Sharing & Exploration Platform",
    description: "Level up your real-world skills with interactive learning explorations. Track your progress from Foundational to Masterclass, submit project verifications, and grow your professional skills.",
    url: "/",
    siteName: "SkillHub Platform",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "SkillHub - Universal Skill-Sharing Platform Banner",
      },
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "SkillHub - Platform Banner",
      },
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "SkillHub - Emblem Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillHub - Universal Skill-Sharing & Exploration Platform",
    description: "Level up your real-world skills with interactive learning explorations. Track your progress from Foundational to Masterclass, submit project verifications, and grow your professional skills.",
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
      <body className="min-h-screen w-full overflow-x-hidden antialiased text-slate-800 bg-[#e6ecf2]">
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

