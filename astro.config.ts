import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import type { Writable } from "type-fest";
import { loadEnv } from "vite";

import { reactFiles } from "./eslint.config";
import { defaultLocale, locales } from "./src/config/i18n.config";

const env = loadEnv(import.meta.env.MODE, process.cwd(), "");

export default defineConfig({
	/**
	 * When switching to static site generation, place an empty `index.astro` file in
	 * the `src/pages` folder, so `astro` will generate a redirect to the default locale
	 * via `<meta http-equiv="refresh" content="0;url=/en/">`.
	 */
	adapter: node({
		mode: "standalone",
	}),
	base: env.PUBLIC_APP_BASE_PATH,
	i18n: {
		defaultLocale,
		locales: locales as Writable<typeof locales>,
		routing: {
			prefixDefaultLocale: true,
		},
	},
	integrations: [
		icon({
			/** @see https://www.astroicon.dev/reference/configuration/#include */
			include: {
				lucide: ["chevron-down", "menu", "message-circle", "search", "square-arrow-left", "x"],
				simpleIcons: ["orcid"],
			},
		}),
		/** Only needed to make the astro jsx runtime work correctly. */
		mdx(),
		react({
			include: reactFiles,
		}),
		sitemap({
			i18n: {
				defaultLocale,
				locales: Object.fromEntries(
					locales.map((locale) => {
						return [locale, locale];
					}),
				),
			},
		}),
		solidJs({
			exclude: reactFiles,
		}),
	],
	prefetch: {
		defaultStrategy: "hover",
		prefetchAll: true,
	},
	redirects: {
		"/admin": {
			destination:
				env.PUBLIC_APP_BASE_PATH != null
					? `${env.PUBLIC_APP_BASE_PATH.replace(/\/$/, "")}/keystatic`
					: "/keystatic",
			status: 307,
		},
	},
	scopedStyleStrategy: "where",
	server: {
		/** Required by keystatic. */
		host: "127.0.0.1",
		port: 3000,
	},
	site: env.PUBLIC_APP_BASE_URL,
});
