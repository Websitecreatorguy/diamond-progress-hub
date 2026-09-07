export { SITE_URL, SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { SITE_URL } from "@/lib/site";

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
