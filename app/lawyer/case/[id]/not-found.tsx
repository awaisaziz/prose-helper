import Link from "next/link";
import { LawyerShell } from "@/components/lawyer/lawyer-shell";
import { Button } from "@/components/ui/button";

export default function CaseNotFound() {
  return (
    <LawyerShell title="Matter not found">
      <p className="text-sm text-muted-foreground">
        No case exists with that id in the mock dataset.
      </p>
      <Button className="mt-4" render={<Link href="/lawyer/dashboard" />}>
        Return to dashboard
      </Button>
    </LawyerShell>
  );
}
