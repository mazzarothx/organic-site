"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

import { DEFAULT_LOGIN_REDIRECT } from "@/app/(auth)/routes";
import { Button } from "@/components/ui/button";

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex w-full flex-col items-center gap-y-2">
      <Button
        size="lg"
        className="w-full gap-2 bg-transparent"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5" />
        Google
      </Button>
      {/* <Button
				size="lg"
				className="w-full bg-transparent gap-2"
				variant="outline"
				onClick={() => onClick("github")}
			>
				<FaGithub className="h-5 w-5" />
				GitHub
			</Button> */}
    </div>
  );
};
