"use client";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import NavbarIconsMounted from "./navbar-icons-mounted";
import NavbarLinksMounted from "./navbar-links-mounted";
import NavbarMobile from "./navbar-mobile-version";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) {
    return null;
  }

  const logoSrc =
    resolvedTheme === "dark"
      ? "/logos/organic-logo-branco.svg"
      : "/logos/organic-logo-preto.svg";

  return (
    <motion.header
      className={cn(
        "bg-background/5 fixed inset-x-0 top-8 right-8 left-8 z-50 mx-auto flex h-[60px] items-center justify-between px-8 shadow-sm transition-colors duration-500 ease-in-out",
        isScrolled && "bg-background/30 saturate-100 backdrop-blur",
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <NavbarLinksMounted />
      <Link href="/" className="flex items-center justify-center gap-1">
        <span className="sr-only">Homepage</span>
        <Image
          src={logoSrc}
          alt="Logo"
          width={100}
          height={28}
          aria-hidden="true"
        />
      </Link>
      <div className="flex items-center gap-2">
        <Separator orientation="vertical" className="h-6" />
        <NavbarIconsMounted />
        <NavbarMobile />
      </div>
    </motion.header>
  );
};

export default Navbar;
