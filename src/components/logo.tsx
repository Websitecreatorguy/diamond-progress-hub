import logoAsset from "@/assets/diamond-logo.png.asset.json";
import { cn } from "@/lib/utils";

export const LOGO_URL = logoAsset.url;

export function Logo({
  className,
  showWordmark = true,
  size = 32,
}: {
  className?: string;
  showWordmark?: boolean;
  size?: number;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <img
        src={LOGO_URL}
        alt="Diamond Development"
        width={size}
        height={size}
        className="rounded-lg shadow-glow"
        style={{ width: size, height: size, objectFit: "cover" }}
      />
      {showWordmark && (
        <div className="leading-tight">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Diamond
          </div>
          <div className="text-sm font-bold tracking-tight">Development</div>
        </div>
      )}
    </div>
  );
}
