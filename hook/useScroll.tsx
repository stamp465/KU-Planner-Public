"use client";

import { ScrollDirection } from "@/constants/enum";
import { useState, useEffect } from "react";

export function useScroll() {
  const [scrollDirection, setScrollDirection] =
    useState<ScrollDirection | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        // if scroll down
        setScrollDirection(ScrollDirection.Down);
      } else {
        // if scroll up
        setScrollDirection(ScrollDirection.Up);
      }

      // remember current page location to use in the next move
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      // cleanup function
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  return {
    lastScrollY,
    scrollDirection,
  };
}
