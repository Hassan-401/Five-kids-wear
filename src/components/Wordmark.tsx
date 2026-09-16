/**
 * The brand name set as type in the cartoon's lettering — chunky capitals,
 * a navy outline and a dropped navy shadow, like the logo. Always laid out
 * left-to-right: it is a Latin name even in the Arabic build.
 *
 * "Family Cotton" is a good deal wider than the old "Kids Wear", so the second
 * line is a step smaller than the first at every size — the header has a fixed
 * band of width to fit it in.
 */
export default function Wordmark({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const scale = {
    sm: { first: "text-[0.8rem]", name: "text-base", outline: "1.5px", depth: "2px" },
    md: { first: "text-base", name: "text-[1.35rem]", outline: "2px", depth: "2.5px" },
    lg: {
      first: "text-4xl sm:text-5xl",
      name: "text-4xl sm:text-5xl xl:text-6xl",
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
      <span className={`block text-pink-500 ${scale.first}`}>Gad</span>
      <span className={`block whitespace-nowrap text-sky-400 ${scale.name}`}>
        Family Cotton
      </span>
    </span>
  );
}
