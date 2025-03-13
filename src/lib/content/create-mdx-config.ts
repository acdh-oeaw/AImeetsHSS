import type { CompileOptions } from "@mdx-js/mdx";
import withSyntaxHighlighter from "@shikijs/rehype";
import type { ElementContent } from "hast";
import withHeadingIds from "rehype-slug";
import withFrontmatter from "remark-frontmatter";
import withGfm from "remark-gfm";
import withMdxFrontmatter from "remark-mdx-frontmatter";
import withTypographicQuotes from "remark-smartypants";
import type { Options as TypographicOptions } from "retext-smartypants";
import type { BuiltinTheme, CodeOptionsThemes } from "shiki";

import type { Locale } from "@/config/i18n.config";
import { withCustomHeadingIds } from "@/lib/content/with-custom-heading-ids";
import { withFootnotes } from "@/lib/content/with-footnotes";
import { withIframeTitles } from "@/lib/content/with-iframe-titles";
import { withMdxTableOfContents, withTableOfContents } from "@/lib/content/with-table-of-contents";
import { createI18n } from "@/lib/i18n/create-i18n";

const syntaxHighlighterConfig: CodeOptionsThemes<BuiltinTheme> = {
	defaultColor: "light",
	themes: {
		light: "github-light",
		dark: "github-dark",
	},
};

const typographyConfig: Record<Locale, TypographicOptions> = {
	en: {
		openingQuotes: { double: "“", single: "‘" },
		closingQuotes: { double: "”", single: "’" },
	},
};

export async function createMdxConfig(locale: Locale): Promise<CompileOptions> {
	const { t } = await createI18n(locale);

	const config: CompileOptions = {
		elementAttributeNameCase: "html",
		jsxImportSource: "astro",
		remarkPlugins: [
			withFrontmatter,
			withMdxFrontmatter,
			withGfm,
			withFootnotes,
			[withTypographicQuotes, typographyConfig[locale]],
		],
		remarkRehypeOptions: {
			/** @see https://github.com/syntax-tree/mdast-util-to-hast/blob/13.0.0/lib/footer.js#L81 */
			footnoteBackContent(_, rereferenceIndex) {
				const result: Array<ElementContent> = [{ type: "text", value: "↩" }];

				if (rereferenceIndex > 1) {
					result.push({
						type: "element",
						tagName: "sup",
						properties: {},
						children: [{ type: "text", value: String(rereferenceIndex) }],
					});
				}

				return result;
			},
			/** @see https://github.com/syntax-tree/mdast-util-to-hast/blob/13.0.0/lib/footer.js#L108 */
			footnoteBackLabel(referenceIndex, rereferenceIndex) {
				return t("mdx.footnote-back-label", {
					reference:
						String(referenceIndex + 1) +
						(rereferenceIndex > 1 ? `-${String(rereferenceIndex)}` : ""),
				});
			},
			footnoteLabel: t("mdx.footnotes"),
			footnoteLabelProperties: { className: ["sr-only"] },
			footnoteLabelTagName: "h2",
		},
		rehypePlugins: [
			withCustomHeadingIds,
			withHeadingIds,
			withTableOfContents,
			withMdxTableOfContents,
			withIframeTitles,
			[withSyntaxHighlighter, syntaxHighlighterConfig],
		],
	};

	return Promise.resolve(config);
}
