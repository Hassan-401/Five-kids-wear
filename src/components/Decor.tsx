/**
 * Decorative background pieces used across the site: floating hearts,
 * the cloud strip that separates sections, a rainbow and a smiley cloud.
 * All purely presentational — hidden from assistive tech.
 */

export function Heart({
  className = "",
  color = "#ffb3d2",
  style,
}: {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill={color}
    >
      <path d="M12 21.3 3.9 12.8a5 5 0 0 1 7.1-7l1 1 1-1a5 5 0 1 1 7.1 7Z" />
    </svg>
  );
}

export function Sparkle({
  className = "",
  color = "#ffd97a",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill={color}>
      <path d="M12 2.5c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z" />
    </svg>
  );
}

export function Crown({ className = "", color = "#f5c451" }: { className?: string; color?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round">
      <path d="M4 17.5 3 7l5 3.5L12 4l4 6.5L21 7l-1 10.5Z" />
    </svg>
  );
}

export function PaperPlane({ className = "", color = "#74b8f5" }: { className?: string; color?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round">
      <path d="M21 3 10.5 14M21 3l-7 18-3.5-7L3.5 10.5Z" />
    </svg>
  );
}

export function Rainbow({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 70" className={className} fill="none" strokeWidth={9} strokeLinecap="round">
      <path d="M12 62a48 48 0 0 1 96 0" stroke="#ffb3d2" />
      <path d="M25 62a35 35 0 0 1 70 0" stroke="#ffd97a" />
      <path d="M38 62a22 22 0 0 1 44 0" stroke="#a9d3fa" />
      <path d="M51 62a9 9 0 0 1 18 0" stroke="#c3aef0" />
    </svg>
  );
}

export function SmileyCloud({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 80" className={className}>
      <path
        d="M28 62c-11 0-19-8-19-17s8-17 19-17c2-11 12-19 24-19s22 8 24 19c10 1 17 8 17 17s-8 17-19 17Z"
        fill="#fff"
      />
      <circle cx="45" cy="46" r="3.2" fill="#5b4a5e" />
      <circle cx="67" cy="46" r="3.2" fill="#5b4a5e" />
      <circle cx="36" cy="53" r="5" fill="#ffc4da" opacity=".85" />
      <circle cx="76" cy="53" r="5" fill="#ffc4da" opacity=".85" />
      <path d="M51 54a7 7 0 0 0 10 0" stroke="#5b4a5e" strokeWidth="2.6" fill="none" strokeLinecap="round" />
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

/** A field of softly floating hearts, absolutely positioned inside its parent. */
export function FloatingHearts() {
  const items = [
    { top: "8%", left: "6%", size: 22, color: "#ffb3d2", delay: "0s" },
    { top: "18%", left: "88%", size: 26, color: "#ff8ac0", delay: "1.1s" },
    { top: "62%", left: "4%", size: 18, color: "#ffffff", delay: "2.2s" },
    { top: "74%", left: "80%", size: 20, color: "#ffd0e3", delay: "0.6s" },
    { top: "38%", left: "48%", size: 14, color: "#ff8ac0", delay: "1.7s" },
    { top: "12%", left: "40%", size: 16, color: "#a9d3fa", delay: "2.6s" },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((h, i) => (
        <Heart
          key={i}
          color={h.color}
          className="absolute anim-float-slow"
          style={{
            top: h.top,
            left: h.left,
            width: h.size,
            height: h.size,
            animationDelay: h.delay,
          }}
        />
      ))}
    </div>
  );
}
