import { getFormDataValues, isoDate, log } from "@acdh-oeaw/lib";
import type { APIContext } from "astro";
import fs from "fs";
import path from "path";
import * as v from "valibot";

import { env } from "@/config/env.config";
import { createConferenceSubmission } from "@/lib/baserow";
import { sendEmail } from "@/lib/email";
import { withBasePath } from "@/lib/with-base-path";

export const prerender = false;

const FileSchema = v.pipe(
	v.instance(File),
	v.mimeType(["application/pdf"]),
	v.maxSize(1024 * 1024 * 10),
);

const RegistrationFormSchema = v.pipe(
	v.object({
		"first-name": v.pipe(v.string(), v.nonEmpty()),
		"last-name": v.pipe(v.string(), v.nonEmpty()),
		email: v.pipe(v.string(), v.email()),
		affiliation: v.pipe(v.string()),
		"submission-type": v.picklist(["poster", "demo"]),
		language: v.picklist(["english", "german"]),
		title: v.pipe(v.string(), v.nonEmpty()),
		abstract: FileSchema,
		comments: v.optional(v.pipe(v.string())),
		"data-consent": v.literal("on"),
	}),
	v.transform((data) => {
		return {
			firstName: data["first-name"],
			lastName: data["last-name"],
			email: data.email,
			affiliation: data.affiliation,
			type: data["submission-type"],
			language: data.language,
			title: data.title,
			abstract: data.abstract,
			comments: data.comments ?? "",
			dataConsent: true,
			date: isoDate(new Date()),
		};
	}),
);

type RegistrationFormSchema = v.InferOutput<typeof RegistrationFormSchema>;

export async function POST(context: APIContext) {
	const formData = await context.request.formData();
	const result = await v.safeParseAsync(RegistrationFormSchema, getFormDataValues(formData));

	if (!result.success) {
		return Response.json({ message: "Invalid input." }, { status: 400 });
	}

	const submission = result.output;

	try {
		const res = await createConferenceSubmission({
			FirstName: submission.firstName,
			LastName: submission.lastName,
			Email: submission.email,
			Affiliation: submission.affiliation,
			Date: submission.date,
			Title: submission.title,
			Type: submission.type,
			Language: submission.language,
			Comments: submission.comments,
		});

		const file = formData.get("abstract") as File;
		//eslint-disable-next-line  @typescript-eslint/restrict-template-expressions
		const filePath = path.join(`./${env.FS_ABSTRACTS_PATH!.toString()}`, `${res.id}__${file.name}`);
		const writableStream = fs.createWriteStream(filePath);
		const reader = file.stream().getReader();

		async function writeToFile() {
			//eslint-disable-next-line  @typescript-eslint/no-unnecessary-condition
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				writableStream.write(value);
			}
			writableStream.end();
		}

		await writeToFile();

		const subject = `[AImeetsHSS] submission form ${submission.lastName}`;
		const message =
			`Dear ${submission.firstName} ${submission.lastName},\n` +
			`please find below details about your submission to the AImeetsHSS conference.\n` +
			`ID: ${res.id as string}\n` +
			`First Name: ${submission.firstName}\n` +
			`Last Name: ${submission.lastName}\n` +
			`Email: ${submission.email}\n` +
			`Affiliation: ${submission.affiliation}\n` +
			`Submission Date: ${submission.date}\n` +
			`Submission Title: ${submission.title}\n` +
			`Submission Type: ${submission.type}\n` +
			`Submission Language: ${submission.language}\n` +
			`Best,\nThe AImeetsHSS team`;

		await sendEmail({
			from: env.EMAIL_CONTACT_ADDRESS!,
			to: submission.email,
			subject,
			text: message,
		});
		return context.redirect(withBasePath(`/en/success`), 303);
	} catch (error) {
		log.error(error);
		return Response.json({ message: "Failed to submit." }, { status: 500 });
	}
}
