import "./globals.css";
import type { Metadata, Viewport } from "next";
import Header from "./components/Header";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "SkillQuest",
  description: "SkillQuest - The RPG quest board for self-learners.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="calm" className="overflow-x-hidden">
      <body className="min-h-screen w-full overflow-x-hidden antialiased text-slate-900 dark:text-slate-100">
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
