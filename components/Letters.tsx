import type { CSSProperties } from "react";

/**
 * Per-letter "mess" offsets. Hard-coded rather than computed so server and
 * client markup are byte-identical across JS engines. dx/dy in em, r in deg.
 * At --e: 0 these apply fully; at --e: 1 every letter sits square.
 */
const NOISE: [number, number, number][] = [
  [-0.03, 0.05, -5], [0.02, -0.07, 4], [-0.01, 0.07, -3], [0.04, -0.04, 6], [-0.03, 0.05, -4], [0.01, -0.06, 3],
  [0.04, 0.06, 4], [-0.04, -0.05, -6], [0.01, 0.07, 2], [-0.02, -0.07, -4], [0.04, 0.03, 5], [-0.03, 0.06, -2],
  [0.02, -0.05, 4], [-0.01, 0.07, -5], [0.04, -0.03, 3], [-0.04, 0.04, -4],
];

export function Letters({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <>
      {Array.from(text).map((c, i) => {
        const [dx, dy, r] = NOISE[(i + offset) % NOISE.length];
        const style = {
          "--dx": `${dx}em`, "--dy": `${dy}em`, "--r": `${r}deg`, "--ci": i + offset,
        } as CSSProperties;
        return (
          <span className="ch" style={style} aria-hidden="true" key={i}>
            <span className="ch-in" style={{ "--ci": i + offset } as CSSProperties}>{c}</span>
          </span>
        );
      })}
    </>
  );
}
