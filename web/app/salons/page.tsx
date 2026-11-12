import type { Metadata } from "next";
import { OutilPage } from "@/components/OutilPage";

export const metadata: Metadata = { title: "Salons afro" };

export default function Page() {
  return <OutilPage slug="salons" />;
}
