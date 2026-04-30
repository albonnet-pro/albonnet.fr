"use client";

import { useState, useEffect } from "react";

export function useScrollY(): number {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () =>
      setY(window.scrollY || document.documentElement.scrollTop || document.body.scrollTop);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return y;
}
