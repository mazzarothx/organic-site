"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { BsCardChecklist } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { GoHome } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { LuMapPin } from "react-icons/lu";

export default function SideBar() {
  return (
    <div className="h-full">
      <div className="flex h-fit flex-col gap-2">
        <SideBarItem icon={<GoHome />} text="Home" href="/my-account" />
        <SideBarItem
          icon={<FaRegUserCircle />}
          text="Details"
          href="/my-account/details"
        />
        <SideBarItem
          icon={<LuMapPin />}
          text="Address"
          href="/my-account/address"
        />
        <SideBarItem
          icon={<BsCardChecklist />}
          text="Orders"
          href="/my-account/orders"
        />
        <SideBarItem
          icon={<IoSettingsOutline />}
          text="Settings"
          href="/my-account/settings"
        />
      </div>
    </div>
  );
}

function SideBarItem({
  icon,
  text,
  href,
}: {
  icon?: ReactNode;
  text: string;
  href: string;
}) {
  const pathname = usePathname();
  const isActive = pathname.endsWith(href);
  return (
    <Link href={href}>
      <div
        className={`flex h-9 w-40 items-center gap-3 rounded-lg px-4 ${
          isActive
            ? "bg-dash-primary/10 text-dash-primary-light/90 hover:bg-dash-primary/15"
            : "text-dash-text-secondary hover:bg-dash-background-secondary/80"
        } `}
      >
        {icon} {text}
      </div>
    </Link>
  );
}
