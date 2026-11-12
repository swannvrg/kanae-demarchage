import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "KANAE — Démarchage", template: "%s — KANAE démarchage" },
  description: "Outils de démarchage KANAE : salons afro, labos, recyclage textile.",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/", label: "Tableau de bord" },
  { href: "/salons", label: "Salons" },
  { href: "/labos", label: "Labos" },
  { href: "/recyclage", label: "Recyclage" },
  { href: "/contacts", label: "Toute la base" },
] as const;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body className="min-h-dvh">
        <nav aria-label="Navigation principale" className="no-print border-b border-line bg-card">
          <div className="flex flex-wrap items-center gap-1 px-[18px] py-2">
            <Link href="/" className="mr-3 font-serif text-lg font-semibold text-ink no-underline">
              KANAE
            </Link>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-md px-2.5 py-1.5 text-sm text-ink no-underline hover:bg-soft">
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
