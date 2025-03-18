import { defineMiddleware } from "astro:middleware";

/** Required for `manual` i18n routing config in `astro.config.ts`. */
export const onRequest = defineMiddleware(async (_context, next) => {
	return next();
});
