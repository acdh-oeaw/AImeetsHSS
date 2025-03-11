/* @jsxImportSource react */

import { config } from "@keystatic/core";

import { env } from "@/config/env.config";
import { locales } from "@/config/i18n.config";
import { pages } from "@/lib/keystatic/collections";
import { withI18nPrefix } from "@/lib/keystatic/lib";
import { Logo } from "@/lib/keystatic/logo";
import {
	indexPage,
	metadata,
	navigation,
	registrationPageConference,
	registrationPageDiscussion,
} from "@/lib/keystatic/singletons";

export default config({
	collections: {
		[withI18nPrefix("pages", "en")]: pages("en"),
	},
	singletons: {
		[withI18nPrefix("indexPage", "en")]: indexPage("en"),

		[withI18nPrefix("registrationPageConference", "en")]: registrationPageConference("en"),
		[withI18nPrefix("registrationPageDiscussion", "en")]: registrationPageDiscussion("en"),

		[withI18nPrefix("metadata", "en")]: metadata("en"),

		[withI18nPrefix("navigation", "en")]: navigation("en"),
	},
	storage:
		env.PUBLIC_KEYSTATIC_MODE === "github" &&
		env.PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER != null &&
		env.PUBLIC_KEYSTATIC_GITHUB_REPO_NAME != null
			? {
					kind: "github",
					repo: {
						owner: env.PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
						name: env.PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
					},
					branchPrefix: "content/",
				}
			: {
					kind: "local",
				},
	ui: {
		brand: {
			mark() {
				return <Logo />;
			},
			name: "AI meets Humanities",
		},
		navigation: {
			"Home page": locales.map((locale) => withI18nPrefix("indexPage", locale)),
			Registration: [
				...locales.map((locale) => withI18nPrefix("registrationPageConference", locale)),
				...locales.map((locale) => withI18nPrefix("registrationPageDiscussion", locale))
			],
			Pages: locales.map((locale) => withI18nPrefix("pages", locale)),
			Navigation: locales.map((locale) => withI18nPrefix("navigation", locale)),
			Metadata: locales.map((locale) => withI18nPrefix("metadata", locale)),
		},
	},
});
