/**
 * The brand name set as type, in the same script that is stitched on the logo —
 * "Gad" in the logo's pink, "Family Cotton" in its navy. Always laid out
 * left-to-right: it is a Latin name even in the Arabic build.
 *
 * "Family Cotton" is much wider than the old "Kids Wear", so the second line is
 * a step smaller than the first at every size — the header has a fixed band of
 * width to fit it into.
 */
export default function Wordmark({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const scale = {
    sm: { first: "text-sm", name: "text-lg" },
    md: { first: "text-lg", name: "text-[1.45rem]" },
    lg: { first: "text-3xl sm:text-4xl", name: "text-4xl sm:text-5xl xl:text-6xl" },
  }[size];

  return (
    <span dir="ltr" className={`brand-word block text-start ${className}`}>
      <span className={`block text-pink-500 ${scale.first}`}>Gad</span>
      <span className={`block whitespace-nowrap text-navy-700 ${scale.name}`}>
        Family Cotton
      </span>
    </span>
  );
}
