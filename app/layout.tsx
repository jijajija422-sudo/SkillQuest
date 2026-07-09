import "./globals.css";
import type { Metadata, Viewport } from "next";
import Header from "./components/Header";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "SkillQuest - Adventurer's Guild",
  description: "SkillQuest - The RPG quest board and bounty board for self-learners.",
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
