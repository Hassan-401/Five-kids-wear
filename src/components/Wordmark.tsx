/**
 * The brand name set as type in the cartoon's lettering — chunky capitals,
 * a navy outline and a dropped navy shadow, like the logo. Always laid out
 * left-to-right: it is a Latin name even in the Arabic build.
 */
export default function Wordmark({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const scale = {
    sm: { five: "text-[0.8rem]", name: "text-lg", outline: "1.5px", depth: "2px" },
    md: { five: "text-base", name: "text-[1.6rem]", outline: "2px", depth: "2.5px" },
    lg: {
      five: "text-4xl sm:text-5xl",
      name: "text-5xl sm:text-6xl xl:text-7xl",
      outline: "3px",
      depth: "5px",
    },
  }[size];

  return (
    <span
      dir="ltr"
      className={`toon-word block text-start ${className}`}
      style={{ "--o": scale.outline, "--d": scale.depth } as React.CSSProperties}
    >
      <span className={`block text-pink-500 ${scale.five}`}>Five</span>
      <span className={`block whitespace-nowrap text-sky-400 ${scale.name}`}>
        PJ Masks
      </span>
    </span>
  );
}
