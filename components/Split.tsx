import { Children, cloneElement, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from "react";

/**
 * Splits text into word spans at render time (works in server components, so
 * nothing mutates the DOM after hydration). Inline elements such as <em> keep
 * their wrapper and have their own words split.
 *
 * mode "scrub": <span class="w"> (opacity driven by scroll)
 * mode "mask":  <span class="w"><span class="wi"> (rises out of a clip)
 */
export function Split({ children, mode }: { children: ReactNode; mode: "scrub" | "mask" }) {
  let n = 0;

  const walk = (node: ReactNode): ReactNode => {
    if (typeof node === "string") {
      return node.split(/(\s+)/).map((part, i) => {
        if (part === "" ) return null;
        if (/^\s+$/.test(part)) return " ";
        const idx = n++;
        return mode === "mask" ? (
          <span className="w" key={`${idx}-${i}`}>
            <span className="wi" style={{ "--i": idx } as CSSProperties}>{part}</span>
          </span>
        ) : (
          <span className="w" key={`${idx}-${i}`}>{part}</span>
        );
      });
    }
    if (isValidElement(node)) {
      const el = node as ReactElement<{ children?: ReactNode }>;
      return cloneElement(el, undefined, Children.map(el.props.children, walk));
    }
    return node;
  };

  return <>{Children.map(children, walk)}</>;
}
