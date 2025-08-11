"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserProfile } from "./UserProfile";
import { ModeToggle } from "./ModeToggle";

export function Header() {
  const OFFSET = 80;

  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    let scrollContainer: Element | null = null;
    let cleanup: (() => void) | null = null;

    function handleScroll() {
      // look for container with overflow-y-auto
      if (scrollContainer) {
        setScrolled(scrollContainer.scrollTop > OFFSET);
      } else {
        // fallback to window if container is not found
        setScrolled(window.scrollY > OFFSET);
      }
    }

    // give time for container to mount
    const timeoutId = setTimeout(() => {
      // look for container with overflow-y-auto
      scrollContainer = document.querySelector(".overflow-y-auto");

      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", handleScroll, {
          passive: true,
        });
        handleScroll();
        cleanup = () =>
          scrollContainer?.removeEventListener("scroll", handleScroll);
      } else {
        // fallback to window if container is not found
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        cleanup = () => window.removeEventListener("scroll", handleScroll);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (cleanup) cleanup();
    };
  }, []);

  const headerClassName = `w-full shadow fixed left-1/2 z-50 transition-all duration-200 -translate-x-1/2 ${
    scrolled
      ? "bg-background/60 md:top-4 md:w-[calc(100%-46px)] md:rounded-lg md:px-30 backdrop-blur-sm border border-foreground/10"
      : "top-0 bg-background border-b"
  }`;

  return (
    <header className={headerClassName}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className={`text-md md:text-2xl font-bold hover:text-primary/80 hover:underline transition-all duration-200 ${
              pathname === "/" ? "text-primary" : "text-foreground/80"
            }`}
          >
            Blog GraphQL + Strapi
          </Link>
          <div className="h-8 w-px bg-foreground/40" />
          <Link
            href="/profile"
            className={`text-md md:text-2xl font-bold hover:text-primary/80 hover:underline transition-all duration-200 ${
              pathname === "/profile" ? "text-primary" : "text-foreground/80"
            }`}
          >
            Profile
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <UserProfile />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
