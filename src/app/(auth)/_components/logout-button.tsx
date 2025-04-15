"use client";

import { logout } from "@/app/(auth)/actions/logout";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "../hooks/use-current-user";

interface LogoutButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export const LogoutButton = ({ children, className }: LogoutButtonProps) => {
  const router = useRouter();
  const user = useCurrentUser();
  const onClick = async () => {
    await logout();
    console.log(user?.name);
    router.refresh();
  };

  return (
    <div onClick={onClick} className={`cursor-pointer, ${className}`}>
      {children}
    </div>
  );
};
