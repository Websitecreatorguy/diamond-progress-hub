import logo from "@/assets/cy-logo.png";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showWordmark = true,
  size = 36,
}: {
  className?: string;
  showWordmark?: boolean;
  size?: number;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <img
        src={logo}
        alt="Christian Yoo Web Design"
        width={size}
        height={size}
        className="rounded-xl"
        style={{ width: size, height: size, objectFit: "contain" }}
      />
      {showWordmark && (
        <span className="leading-tight">
          <span className="block font-display text-[15px] font-semibold tracking-tight">
            Christian Yoo
          </span>
          <span className="block text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Web Design
          </span>
        </span>
      )}
    </span>
  );
}
