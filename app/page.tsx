import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-10 px-6 py-16">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Pro Se Helper</h1>
        <p className="mt-3 text-sm text-gray-600">
          AI co-counsel for Ontario Small Claims Court — debt & money disputes
          up to $50,000.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/client/dashboard"
          className="group rounded-xl border border-gray-200 p-6 transition hover:border-blue-500 hover:shadow-md"
        >
          <h2 className="text-xl font-semibold group-hover:text-blue-600">
            I&apos;m a Client
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Describe your dispute, get your rights and remedies, and draft your
            Plaintiff&apos;s Claim (Form 7A).
          </p>
        </Link>

        <Link
          href="/lawyer/dashboard"
          className="group rounded-xl border border-gray-200 p-6 transition hover:border-blue-500 hover:shadow-md"
        >
          <h2 className="text-xl font-semibold group-hover:text-blue-600">
            I&apos;m a Lawyer
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Review client drafts, sign off on filings, and track every
            procedural deadline with the Deadline Guardian.
          </p>
        </Link>
      </div>

      <Disclaimer />
    </main>
  );
}
