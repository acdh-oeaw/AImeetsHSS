import { fields, singleton } from "@keystatic/core";

import {
	createAssetOptions,
	createContentFieldOptions,
	createLabel,
	createSingleton,
	createSingletonPaths,
	withI18nPrefix,
} from "@/lib/keystatic/lib";
import * as validation from "@/lib/keystatic/validation";

export const indexPage = createSingleton((locale) => {
	const paths = createSingletonPaths("/index-page/", locale);

	return singleton({
		label: createLabel("Home page", locale),
		path: paths.contentPath,
		format: { data: "json" },
		entryLayout: "form",
		// previewUrl: createPreviewUrl("/"),
		schema: {
			hero: fields.object(
				{
					title: fields.text({
						label: "Title",
						validation: { isRequired: true },
					}),
					subtitle: fields.text({
						label: "Subtitle",
						validation: { isRequired: true },
					}),
					lead: fields.text({
						label: "Lead",
						validation: { isRequired: false },
						multiline: true,
					}),
					image: fields.object(
						{
							src: fields.image({
								label: "Image",
								validation: { isRequired: false },
								...createAssetOptions(paths.assetPath),
							}),
							caption: fields.text({
								label: "Image caption",
								validation: { isRequired: false },
							}),
						},
						{
							label: "Image",
						},
					),
				},
				{
					label: "Hero section",
				},
			),
			content: fields.mdx({
				label: "Content",
				options: createContentFieldOptions(paths.assetPath),
				components: {},
			}),
			sections: fields.blocks(
				{
					data: {
						label: "Data section",
						itemLabel(props) {
							return props.fields.title.value;
						},
						schema: fields.object(
							{
								title: fields.text({
									label: "Title",
									validation: { isRequired: true },
								}),
								lead: fields.text({
									label: "Lead",
									validation: { isRequired: true },
									multiline: true,
								}),
								collections: fields.multiselect({
									label: "Collection",
									options: [
										{ label: "Conferences", value: "conferences" },
										{ label: "Events", value: "events" },
									],
									defaultValue: ["conferences", "events"],
								}),
								filter: fields.select({
									label: "Filter",
									options: [
										{ label: "All", value: "all" },
										{ label: "Past", value: "past" },
										{ label: "Future", value: "future" },
									],
									defaultValue: "all",
								}),
								count: fields.number({
									label: "Count",
									validation: { isRequired: true },
								}),
							},
							{
								label: "Data",
							},
						),
					},
					links: {
						label: "Links section",
						itemLabel(props) {
							return props.fields.title.value;
						},
						schema: fields.object(
							{
								title: fields.text({
									label: "Title",
									validation: { isRequired: true },
								}),
								lead: fields.text({
									label: "Lead",
									validation: { isRequired: true },
									multiline: true,
								}),
								links: fields.blocks(
									{
										page: {
											label: "Page",
											itemLabel(props) {
												return props.fields.title.value;
											},
											schema: fields.object(
												{
													title: fields.text({
														label: "Title",
														validation: { isRequired: true },
													}),
													id: fields.relationship({
														label: "Page",
														validation: { isRequired: true },
														collection: withI18nPrefix("pages", locale),
													}),
												},
												{
													label: "Page",
												},
											),
										},
									},
									{
										label: "Links",
									},
								),
							},
							{
								label: "Links",
							},
						),
					},
					text: {
						label: "Text section",
						itemLabel(props) {
							return props.fields.title.value;
						},
						schema: fields.object(
							{
								title: fields.text({
									label: "Title",
									validation: { isRequired: true },
								}),
								lead: fields.text({
									label: "Lead",
									validation: { isRequired: true },
									multiline: true,
								}),
								content: fields.mdx({
									label: "Content",
									options: createContentFieldOptions(paths.assetPath),
									components: {},
								}),
							},
							{
								label: "Text",
							},
						),
					},
				},
				{
					label: "Sections",
				},
			),
		},
	});
});

export const registrationPageConference = createSingleton((locale) => {
	const paths = createSingletonPaths("/registration-conference/", locale);

	return singleton({
		label: createLabel("Conference Registration", locale),
		path: paths.contentPath,
		format: { data: "json" },
		entryLayout: "form",
		// previewUrl: createPreviewUrl("/"),
		schema: {
			hero: fields.object(
				{
					title: fields.text({
						label: "Title",
						validation: { isRequired: true },
					}),
					subtitle: fields.text({
						label: "Subtitle",
						validation: { isRequired: true },
					}),
					image: fields.object(
						{
							src: fields.image({
								label: "Image",
								validation: { isRequired: false },
								...createAssetOptions(paths.assetPath),
							}),
							caption: fields.text({
								label: "Image caption",
								validation: { isRequired: false },
							}),
						},
						{
							label: "Image",
						},
					),
				},
				{
					label: "Hero section",
				},
			),
			content: fields.mdx({
				label: "Content",
				options: createContentFieldOptions(paths.assetPath),
				components: {},
			}),
		},
	});
});

export const registrationPageDiscussion = createSingleton((locale) => {
	const paths = createSingletonPaths("/registration-discussion/", locale);

	return singleton({
		label: createLabel("Podiumsdiskussion Registration", locale),
		path: paths.contentPath,
		format: { data: "json" },
		entryLayout: "form",
		schema: {
			hero: fields.object(
				{
					title: fields.text({
						label: "Title",
						validation: { isRequired: true },
					}),
					subtitle: fields.text({
						label: "Subtitle",
						validation: { isRequired: true },
					}),
					image: fields.object(
						{
							src: fields.image({
								label: "Image",
								validation: { isRequired: false },
								...createAssetOptions(paths.assetPath),
							}),
							caption: fields.text({
								label: "Image caption",
								validation: { isRequired: false },
							}),
						},
						{
							label: "Image",
						},
					),
				},
				{
					label: "Hero section",
				},
			),
			content: fields.mdx({
				label: "Content",
				options: createContentFieldOptions(paths.assetPath),
				components: {},
			}),
		},
	});
});

export const registrationPageSubmission = createSingleton((locale) => {
	const paths = createSingletonPaths("/submissions/", locale);

	return singleton({
		label: createLabel("Submissions", locale),
		path: paths.contentPath,
		format: { data: "json" },
		entryLayout: "form",
		schema: {
			hero: fields.object(
				{
					title: fields.text({
						label: "Title",
						validation: { isRequired: true },
					}),
					subtitle: fields.text({
						label: "Subtitle",
						validation: { isRequired: true },
					}),
					image: fields.object(
						{
							src: fields.image({
								label: "Image",
								validation: { isRequired: false },
								...createAssetOptions(paths.assetPath),
							}),
							caption: fields.text({
								label: "Image caption",
								validation: { isRequired: false },
							}),
						},
						{
							label: "Image",
						},
					),
				},
				{
					label: "Hero section",
				},
			),
			content: fields.mdx({
				label: "Content",
				options: createContentFieldOptions(paths.assetPath),
				components: {},
			}),
		},
	});
});

export const metadata = createSingleton((locale) => {
	const paths = createSingletonPaths("/metadata/", locale);

	return singleton({
		label: createLabel("Metadata", locale),
		path: paths.contentPath,
		format: { data: "json" },
		entryLayout: "form",
		schema: {
			title: fields.text({
				label: "Title",
				validation: { isRequired: true },
			}),
			description: fields.text({
				label: "Description",
				validation: { isRequired: true },
			}),
			twitter: fields.object(
				{
					creator: fields.text({
						label: "Creator",
						validation: { isRequired: true, pattern: validation.twitterHandle },
					}),
					site: fields.text({
						label: "Site",
						validation: { isRequired: true, pattern: validation.twitterHandle },
					}),
				},
				{
					label: "Twitter",
				},
			),
			manifest: fields.object(
				{
					name: fields.text({
						label: "Name",
						validation: { isRequired: true },
					}),
					"short-name": fields.text({
						label: "Short name",
						validation: { isRequired: true },
					}),
					description: fields.text({
						label: "Description",
						validation: { isRequired: true },
					}),
				},
				{
					label: "Webmanifest",
				},
			),
		},
	});
});

export const navigation = createSingleton((locale) => {
	const paths = createSingletonPaths("/navigation/", locale);

	const links = {
		link: fields.object(
			{
				label: fields.text({
					label: "Label",
					validation: { isRequired: true },
				}),
				href: fields.url({
					label: "URL",
					validation: { isRequired: true },
				}),
			},
			{
				label: "Custom link",
			},
		),
		page: fields.object(
			{
				label: fields.text({
					label: "Label",
					validation: { isRequired: true },
				}),
				id: fields.relationship({
					label: "Page",
					validation: { isRequired: true },
					collection: withI18nPrefix("pages", locale),
				}),
			},
			{
				label: "Link to page",
			},
		),
		separator: fields.empty(),
	};

	return singleton({
		label: createLabel("Navigation", locale),
		path: paths.contentPath,
		format: { data: "json" },
		entryLayout: "form",
		schema: {
			links: fields.blocks(
				{
					link: {
						label: "Link",
						itemLabel(props) {
							return `${props.fields.label.value} (Link)`;
						},
						schema: links.link,
					},
					page: {
						label: "Page",
						itemLabel(props) {
							return `${props.fields.label.value} (Page)`;
						},
						schema: links.page,
					},
					separator: {
						label: "Separator",
						schema: links.separator,
					},
					menu: {
						label: "Menu",
						itemLabel(props) {
							return `${props.fields.label.value} (Menu)`;
						},
						schema: fields.object(
							{
								label: fields.text({
									label: "Label",
									validation: { isRequired: true },
								}),
								links: fields.blocks(
									{
										link: {
											label: "Link",
											itemLabel(props) {
												return props.fields.label.value;
											},
											schema: links.link,
										},
										page: {
											label: "Page",
											itemLabel(props) {
												return `${props.fields.label.value} (Page)`;
											},
											schema: links.page,
										},
										separator: {
											label: "Separator",
											schema: links.separator,
										},
									},
									{
										label: "Links",
										validation: { length: { min: 1 } },
									},
								),
							},
							{
								label: "Menu",
							},
						),
					},
				},
				{
					label: "Links",
					validation: { length: { min: 1 } },
				},
			),
		},
	});
});
