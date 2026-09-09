import { cn } from "@/lib/utils";

export function Logo({
  className,
  showWordmark = true,
  size = 40,
  invert = false,
}: {
  className?: string;
  showWordmark?: boolean;
  size?: number;
  invert?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span
        className="grid shrink-0 place-items-center rounded-xl bg-gradient-ink shadow-soft"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinejoin="round"
          className="text-[var(--accent-brand)]"
          style={{ width: size * 0.5, height: size * 0.5 }}
        >
          <path d="M12 2.5 21.5 12 12 21.5 2.5 12z" />
          <path d="M12 7.5 16.5 12 12 16.5 7.5 12z" opacity="0.65" />
        </svg>
      </span>
      {showWordmark && (
        <span
          className={cn(
            "font-display text-lg font-extrabold tracking-tight",
            invert ? "text-white" : "text-foreground",
          )}
        >
          Diamond <span className="text-[var(--accent-brand)]">Development</span>
        </span>
      )}
    </span>
  );
}
