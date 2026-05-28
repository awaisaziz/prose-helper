import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lawyer Console — Pro Se Helper",
  description:
    "Review client claims, verify citations, and track procedural deadlines.",
};

export default function LawyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
