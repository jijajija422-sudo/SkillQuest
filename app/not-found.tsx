import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment p-6">
      <div className="max-w-xl rounded-2xl bg-white/90 p-8 text-center shadow-xl">
        <h1 className="text-4xl font-extrabold">404</h1>
        <p className="mt-4 text-lg text-slate-700">Page not found — but your quests await.</p>
        <div className="mt-6">
          <Link href="/" className="rounded-full bg-slate-900 px-4 py-2 text-white">Go home</Link>
        </div>
      </div>
    </div>
  );
}
