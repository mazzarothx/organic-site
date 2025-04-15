"use client";

import { UserRoundXIcon } from "lucide-react";

import { LoginButton } from "@/app/(auth)/_components/login-button";
import { UserButton } from "@/app/(auth)/_components/user-button";
import { useCurrentUser } from "@/app/(auth)/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { CartModal } from "../cart/cart-modal";
import { ThemeButton } from "../theme-button";

const NavbarIconsMounted = () => {
  const user = useCurrentUser();

  return (
    <div className="flex items-center justify-center gap-2">
      {user && <UserButton />}
      {!user && (
        <LoginButton mode="modal" asChild>
          <Button variant="icon">
            <div className="relative flex h-5 w-5 items-center justify-center">
              <UserRoundXIcon size={22} />
            </div>
          </Button>
        </LoginButton>
      )}
      <CartModal />
      <ThemeButton />
    </div>
  );
};

export default NavbarIconsMounted;
