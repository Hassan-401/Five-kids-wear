import { useEffect, useRef } from "react";

/**
 * Writes `--px` / `--py` custom properties on the returned element as the
 * pointer moves across it, so children with `.parallax-layer` drift by
 * `value * --depth`. Updates are coalesced into one rAF per frame, and the
 * listener is skipped entirely for coarse pointers and reduced-motion users.
 */
export default function usePointerParallax<T extends HTMLElement>(
  strength = 18,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    let frame = 0;
    let px = 0;
    let py = 0;

    const apply = () => {
      frame = 0;
      el.style.setProperty("--px", `${px.toFixed(2)}px`);
      el.style.setProperty("--py", `${py.toFixed(2)}px`);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // -1 .. 1 relative to the centre of the hero
      px = ((e.clientX - r.left) / r.width - 0.5) * -2 * strength;
      py = ((e.clientY - r.top) / r.height - 0.5) * -2 * strength;
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    const onLeave = () => {
      px = 0;
      py = 0;
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [strength]);

  return ref;
}
