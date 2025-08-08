"use client";

import React, { useEffect, useState } from "react";
import { UserProfile } from "./UserProfile";
import { ModeToggle } from "./ModeToggle";
import Link from "next/link";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const OFFSET = 80;

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

  return (
    <header
      className={`shadow fixed left-1/2 z-50 transition-all duration-200 -translate-x-1/2 ${
        scrolled
          ? "bg-background/60 md:top-4 md:w-[calc(100%-46px)] md:rounded-lg md:px-30 backdrop-blur-sm border border-foreground/10"
          : "top-0 w-full bg-background border-b"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          Next.js GraphQL Demo
        </Link>
        <div className="flex items-center gap-2">
          <UserProfile />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
