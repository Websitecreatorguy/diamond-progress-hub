export const SITE_URL = "https://diamond-progress-hub.lovable.app";
export const SITE_NAME = "Diamond Development";
export const SITE_TAGLINE =
  "The baseball development platform for players, coaches, and parents.";

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
