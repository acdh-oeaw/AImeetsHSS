import { collection, fields } from "@keystatic/core";

import {
	createAssetOptions,
	createCollection,
	createCollectionPaths,
	createContentFieldOptions,
	createLabel,
} from "@/lib/keystatic/lib";

export const pages = createCollection((locale) => {
	const paths = createCollectionPaths("/pages/", locale);

	return collection({
		label: createLabel("Pages", locale),
		path: paths.contentPath,
		slugField: "title",
		format: { contentField: "content" },
		entryLayout: "content",
		columns: ["title"],
		// previewUrl: createPreviewUrl("/{slug}"),
		schema: {
			title: fields.slug({
				name: {
					label: "Title",
					validation: { isRequired: true },
				},
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
			summary: fields.text({
				label: "Summary",
				validation: { isRequired: true },
				multiline: true,
			}),
			content: fields.mdx({
				label: "Content",
				options: createContentFieldOptions(paths.assetPath),
				components: {},
			}),
		},
	});
});

export const events = createCollection((locale) => {
	const paths = createCollectionPaths("/events/", locale);

	return collection({
		label: createLabel("Events", locale),
		path: paths.contentPath,
		slugField: "title",
		format: { contentField: "content" },
		entryLayout: "content",
		columns: ["title"],
		// previewUrl: createPreviewUrl("/events/{slug}"),
		schema: {
			title: fields.slug({
				name: {
					label: "Title",
					validation: { isRequired: true },
				},
			}),
			date: fields.date({
				label: "Date",
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
			summary: fields.text({
				label: "Summary",
				validation: { isRequired: true },
				multiline: true,
			}),
			content: fields.mdx({
				label: "Content",
				options: createContentFieldOptions(paths.assetPath),
				components: {},
			}),
		},
	});
});
