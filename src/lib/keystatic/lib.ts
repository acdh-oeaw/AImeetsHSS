import type { Collection, ComponentSchema, Config, Singleton } from "@keystatic/core";
import type { ContentComponent } from "@keystatic/core/content-components";
import { createReader as createLocalReader } from "@keystatic/core/reader";
import { createGitHubReader } from "@keystatic/core/reader/github";
import slugify from "@sindresorhus/slugify";

import { env } from "@/config/env.config";
import type { Locale } from "@/config/i18n.config";
import { withBasePath } from "@/lib/with-base-path";

export function createLabel(label: string, locale: Locale) {
	return `${label} (${locale})`;
}

export function createAssetOptions<TPath extends `/${string}/`>(path: TPath) {
	return {
		directory: `./public/assets${path}` as const,
		publicPath: withBasePath(`/assets${path}`),
		transformFilename(originalFilename: string) {
			return slugify(originalFilename, { preserveCharacters: ["."] });
		},
	};
}

export function createPreviewUrl(previewUrl: string): string {
	if (env.PUBLIC_KEYSTATIC_MODE === "github") {
		return `/api/preview/start?branch={branch}&to=${previewUrl}`;
	}

	return previewUrl;
}

export function createContentFieldOptions<TPath extends `/${string}/`>(assetPath: TPath) {
	const assetPaths = createAssetOptions(assetPath);
	const headingLevels = [2, 3, 4, 5] as const;

	return {
		heading: headingLevels,
		image: assetPaths,
	};
}

export function createComponent<TPath extends `/${string}/`, TComponent extends ContentComponent>(
	createComponentFactory: (assetPath: TPath, locale: Locale) => TComponent,
) {
	return function createComponent(assetPath: TPath, locale: Locale) {
		return createComponentFactory(assetPath, locale);
	};
}

export function createCollectionPaths<TPath extends `/${string}/`>(path: TPath, locale: Locale) {
	return {
		assetPath: `/content/${locale}${path}`,
		contentPath: `./content/${locale}${path}*/`,
	} as const;
}

export function createSingletonPaths<TPath extends `/${string}/`>(path: TPath, locale: Locale) {
	return {
		assetPath: `/content/${locale}${path}`,
		contentPath: `./content/${locale}${path}`,
	} as const;
}

export function createCollection<
	TSchema extends Record<string, ComponentSchema>,
	TSlugField extends string,
>(createLocalisedCollectionFactory: (locale: Locale) => Collection<TSchema, TSlugField>) {
	return function createLocalisedCollection(locale: Locale) {
		return createLocalisedCollectionFactory(locale);
	};
}

export function createSingleton<Schema extends Record<string, ComponentSchema>>(
	createLocalisedSingletonFactory: (locale: Locale) => Singleton<Schema>,
) {
	return function createLocalisedSingleton(locale: Locale) {
		return createLocalisedSingletonFactory(locale);
	};
}

export function withI18nPrefix<TLabel extends string, TLocale extends Locale>(
	label: TLabel,
	locale: TLocale,
) {
	return `${locale}:${label}` as const;
}

export type WithoutI18nPrefix<T extends string> = T extends `${Locale}:${infer U}` ? U : T;

export function createReader<
	TCollections extends Record<string, Collection<Record<string, ComponentSchema>, string>>,
	TSingletons extends Record<string, Singleton<Record<string, ComponentSchema>>>,
>(
	config: Config<TCollections, TSingletons>,
	getGitHubReaderConfig?: () => {
		repo: `${string}/${string}`;
		pathPrefix?: string;
		ref?: string;
		token?: string;
	} | null,
) {
	const gitHubConfig = getGitHubReaderConfig?.();

	if (gitHubConfig != null) {
		return createGitHubReader(config, gitHubConfig);
	}

	return createLocalReader(process.cwd(), config);
}
