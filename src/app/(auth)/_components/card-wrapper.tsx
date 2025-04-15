"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { BackButton } from "./back-button";
import { Header } from "./header";
import { Social } from "./social";

interface CardWrapperProps {
  children: React.ReactNode;
  headerTitle: string;
  headerSubtitle: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerTitle,
  headerSubtitle,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] border-none bg-transparent">
      <CardHeader>
        <Header title={headerTitle} subtitle={headerSubtitle} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <div className="my-6 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
