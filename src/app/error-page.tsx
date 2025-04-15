// @/app/error-page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ErrorPage({
  error,
  tryAgainLink,
}: {
  error: any;
  tryAgainLink: string;
}) {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">
        {error.status ? `Error ${error.status}` : "Error"}
      </h1>
      <p className="text-lg">{error.message || "Something went wrong"}</p>
      {error.status === 500 && (
        <p className="text-muted-foreground text-sm">
          Our servers might be down. Please try again later.
        </p>
      )}
      <div className="flex gap-2">
        <Button onClick={() => router.push(tryAgainLink)}>Try Again</Button>
        <Button variant="outline" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    </div>
  );
}
