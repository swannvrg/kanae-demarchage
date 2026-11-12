import type { Metadata } from "next";
import { OutilPage } from "@/components/OutilPage";

export const metadata: Metadata = { title: "Recyclage textile" };

export default function Page() {
  return <OutilPage slug="recyclage" />;
}
