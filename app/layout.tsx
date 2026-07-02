import "./globals.css";
import type { Metadata } from "next";
import Header from "./components/Header";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "SkillQuest",
  description: "SkillQuest - The RPG quest board for self-learners.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="calm">
      <body className="min-h-screen text-slate-900 dark:text-slate-100">
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
