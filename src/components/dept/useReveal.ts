import { useEffect, useRef } from "react";

/**
 * Adds `.is-in` to every `.dept-reveal` inside the returned ref once it
 * scrolls into view, with a small stagger between siblings. Reduced-motion
 * users get everything revealed immediately (the CSS already opts out).
 */
export default function useReveal<T extends HTMLElement>(stagger = 90) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>(".dept-reveal"),
    );
    if (!targets.length) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          // stagger siblings so a grid ripples in rather than popping at once
          const siblings = Array.from(el.parentElement?.children ?? []);
          const index = Math.max(0, siblings.indexOf(el));
          el.style.transitionDelay = `${Math.min(index, 8) * stagger}ms`;
          el.classList.add("is-in");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [stagger]);

  return ref;
}
