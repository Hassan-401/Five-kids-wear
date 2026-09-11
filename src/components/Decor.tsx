/**
 * Decorative pieces used across the site — the night-sky motifs of the
 * PJ Masks theme (stars, twinkles, crescent moons, lightning bolts) and the
 * wavy cloud strip that separates sections. All purely presentational —
 * hidden from assistive tech.
 */

type DecorProps = {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
};

export function Heart({ className = "", color = "#ffb3d2", style }: DecorProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} style={style} fill={color}>
      <path d="M12 21.3 3.9 12.8a5 5 0 0 1 7.1-7l1 1 1-1a5 5 0 1 1 7.1 7Z" />
    </svg>
  );
}

/** Five-point star with softened corners. */
export function Star({ className = "", color = "#ffd35c", style }: DecorProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill={color}
      stroke={color}
      strokeWidth={1.6}
      strokeLinejoin="round"
    >
      <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" />
    </svg>
  );
}

/** Four-point twinkle. */
export function Sparkle({ className = "", color = "#ffd35c", style }: DecorProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} style={style} fill={color}>
      <path d="M12 2.5c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z" />
    </svg>
  );
}

export function Moon({ className = "", color = "#ffe28a", style }: DecorProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} style={style} fill={color}>
      <path d="M20.6 14.7A8.7 8.7 0 0 1 9.3 3.4a8.7 8.7 0 1 0 11.3 11.3Z" />
    </svg>
  );
}

export function Bolt({ className = "", color = "#4cc3f1", style }: DecorProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill={color}
      stroke={color}
      strokeWidth={1.4}
      strokeLinejoin="round"
    >
      <path d="M13.6 2.5 5.2 13.4h5.9l-1.3 8.1 9-12.1h-6.1Z" />
    </svg>
  );
}

/** Wavy cloud divider used at the top/bottom edges of soft sections. */
export function CloudDivider({
  className = "",
  flip = false,
  fill = "#ffffff",
}: {
  className?: string;
  flip?: boolean;
  fill?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      className={className}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <path
        fill={fill}
        d="M0 44c60-30 120-30 180 0s120 30 180 0 120-30 180 0 120 30 180 0 120-30 180 0 120 30 180 0 120-30 180 0 120 30 180 0v46H0Z"
      />
    </svg>
  );
}

/** A field of softly twinkling stars and bolts, absolutely positioned inside its parent. */
export function FloatingStars() {
  const items = [
    { top: "10%", left: "6%", size: 22, color: "#ffd35c", Shape: Star, delay: "0s" },
    { top: "18%", left: "88%", size: 26, color: "#ffffff", Shape: Sparkle, delay: "1.1s" },
    { top: "62%", left: "4%", size: 18, color: "#ff8ac0", Shape: Star, delay: "2.2s" },
    { top: "70%", left: "82%", size: 22, color: "#4cc3f1", Shape: Bolt, delay: "0.6s" },
    { top: "36%", left: "48%", size: 14, color: "#ffd35c", Shape: Sparkle, delay: "1.7s" },
    { top: "12%", left: "38%", size: 16, color: "#88d8f8", Shape: Star, delay: "2.6s" },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map(({ Shape, ...s }, i) => (
        <Shape
          key={i}
          color={s.color}
          className="absolute anim-float-slow"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}
