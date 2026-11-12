import type { Metadata } from "next";
import { OutilPage } from "@/components/OutilPage";

export const metadata: Metadata = { title: "Labos et centres techniques" };

export default function Page() {
  return <OutilPage slug="labos" />;
}
