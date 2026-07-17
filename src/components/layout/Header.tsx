import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-white/10 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-white">
          Cursor <span className="text-primary">Quiz</span>
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link
            href="/leaderboard"
            className="text-white/70 transition hover:text-white"
          >
            Ranking
          </Link>
        </nav>
      </div>
    </header>
  );
}
