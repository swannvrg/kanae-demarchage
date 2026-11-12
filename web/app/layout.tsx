import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { WRAP } from "@/lib/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "KANAE — Démarchage", template: "%s — KANAE démarchage" },
  description: "Outils de démarchage KANAE : salons afro, labos, recyclage textile.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#5c0a3a" };

const NAV = [
  { href: "/", label: "Tableau de bord" },
  { href: "/salons", label: "Salons" },
  { href: "/labos", label: "Labos" },
  { href: "/recyclage", label: "Recyclage" },
  { href: "/resultats", label: "Résultats" },
  { href: "/contacts", label: "Toute la base" },
] as const;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body className="min-h-dvh">
        <nav aria-label="Navigation principale" className="no-print sticky top-0 z-30 border-b border-line bg-card">
          {/* Menu compact : une ligne qui défile horizontalement sur téléphone */}
          <div className={`${WRAP} flex items-center gap-1 overflow-x-auto py-1.5 [scrollbar-width:none]`}>
            <Link href="/" className="mr-2 inline-flex min-h-11 shrink-0 items-center font-serif text-lg font-semibold text-ink no-underline">
              KANAE
            </Link>
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-md px-3 text-sm text-ink no-underline hover:bg-soft"
              >
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
