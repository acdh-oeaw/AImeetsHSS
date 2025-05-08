export function ensureTrailingSlash(pathname: string): string {
	if (pathname.endsWith("/")) return pathname;

	if (pathname.split("/").at(-1)?.includes(".")) return pathname;
	if (pathname.split("/").at(-1)?.includes("#")) return pathname;
	return `${pathname}/`;
}
