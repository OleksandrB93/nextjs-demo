"use client";

import React, { useEffect, useState } from "react";
import { UserProfile } from "./UserProfile";
import { ModeToggle } from "./ModeToggle";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const OFFSET = 80;

  useEffect(() => {
    setMounted(true);

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

  // Render the same content on server and client until mounted
  const headerClassName = mounted
    ? `shadow fixed left-1/2 z-50 transition-all duration-200 -translate-x-1/2 ${
        scrolled
          ? "bg-background/60 md:top-4 md:w-[calc(100%-46px)] md:rounded-lg md:px-30 backdrop-blur-sm border border-foreground/10"
          : "top-0 w-full bg-background border-b"
      }`
    : "shadow fixed left-1/2 z-50 transition-all duration-200 -translate-x-1/2 top-0 w-full bg-background border-b";

  return (
    <header className={headerClassName}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-md md:text-2xl font-bold text-primary hover:text-primary/80 hover:underline transition-all duration-200"
          >
            Next.js GraphQL
          </Link>
          <div className="h-8 w-px bg-foreground/40" />
          <Link
            href="/profile"
            className="text-md md:text-2xl font-bold text-primary hover:text-primary/80 hover:underline transition-all duration-200"
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
