"use client";

import { FaUser } from "react-icons/fa";

import { useCurrentUser } from "../hooks/use-current-user";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { ListCollapse, LogOut } from "lucide-react";
import Link from "next/link";
import { BsCardChecklist } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { LogoutButton } from "./logout-button";

export const UserButton = () => {
  const user = useCurrentUser();

  return (
    <HoverCard>
      <HoverCardTrigger className="flex items-center justify-center" asChild>
        <div>
          <Avatar className="flex size-7 items-center justify-center">
            <Link href="/my-account">
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback className="">
                <FaUser className="size-[22px] text-textunactive transition-colors hover:text-textactive" />
              </AvatarFallback>
            </Link>
          </Avatar>
        </div>
      </HoverCardTrigger>

      {/* <CommandIcon className="size-4" /> */}

      <HoverCardContent>
        <div className="flex flex-col gap-5">
          {/* {user?.role === UserRole.ADMIN && (
            <>
              <div className="flex items-center gap-4 group text-textactive hover:text-accent transition-colors">
                <FaAlignJustify className=" h-5 w-5 " />
                <Link href="/
                
                board">Dashboard</Link>
              </div>
              <Separator className="my-4 bg-white" />
            </>
          )} */}

          {/* My Account  */}
          <div className="group flex items-center gap-4 text-textactive transition-colors hover:text-accent">
            <FaRegUserCircle className="h-5 w-5" />
            <Link href="/my-account">My Account</Link>
          </div>

          {/* Details  */}
          <div className="group flex items-center gap-4 text-textactive transition-colors hover:text-accent">
            <ListCollapse className="h-5 w-5" />
            <Link href="/my-account/profile">Details</Link>
          </div>

          {/* Orders  */}
          <div className="group flex items-center gap-4 text-textactive transition-colors hover:text-accent">
            <BsCardChecklist className="h-5 w-5" />
            <Link href="/my-account/orders">Orders</Link>
          </div>

          {/* Settings  */}
          {/* <div className="flex items-center gap-4 group text-textactive hover:text-accent transition-colors">
            <IoSettingsOutline className=" h-5 w-5 " />
            <Link href="/my-account/settings">Settings</Link>
          </div> */}

          <Separator className="bg-textunactive/30" />

          <LogoutButton className="group flex cursor-pointer items-center gap-4 text-textactive transition-colors hover:text-accent">
            <LogOut className="h-5 w-5" />
            Logout
          </LogoutButton>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
