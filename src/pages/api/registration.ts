import { getFormDataValues, isoDate, log } from "@acdh-oeaw/lib";
import type { APIContext } from "astro";
import * as v from "valibot";

import { env } from "@/config/env.config";
import { createConferenceRegistration } from "@/lib/baserow";
import { sendEmail } from "@/lib/email";

export const prerender = false;

const RegistrationFormSchema = v.pipe(
	v.object({
		"first-name": v.pipe(v.string(), v.nonEmpty()),
		"last-name": v.pipe(v.string(), v.nonEmpty()),
		email: v.pipe(v.string(), v.email()),
		affiliation: v.pipe(v.string()),
		type: v.pipe(v.string()),
		"data-consent": v.literal("on"),
	}),
	v.transform((data) => {
		return {
			firstName: data["first-name"],
			lastName: data["last-name"],
			email: data.email,
			affiliation: data.affiliation,
			type: data.type,
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
		const res = await createConferenceRegistration({
			FirstName: submission.firstName,
			LastName: submission.lastName,
			Email: submission.email,
			Affiliation: submission.affiliation,
			Date: submission.date,
			Type: submission.type,
		});
		console.log(res);
		const subject = `[AImeetsHSS] registration form submission ${submission.lastName}`;
		const message =
			`Dear ${submission.firstName} ${submission.lastName},\n` +
			`please find below details about your registration request for the AImeetsHSS conference.\n` +
			`ID: ${res.id as string}\n` +
			`First Name: ${submission.firstName}\n` +
			`Last Name: ${submission.lastName}\n` +
			`Email: ${submission.email}\n` +
			`Affiliation: ${submission.affiliation}\n` +
			`Registration Date: ${submission.date}\n` +
			`Registered for: ${submission.type}\n` +
			`Best,\nThe AImeetsHSS team`;

		await sendEmail({
			from: env.EMAIL_CONTACT_ADDRESS!,
			to: submission.email,
			subject,
			text: message,
		});
		return context.redirect(`/en/success?data=${encodeURIComponent(JSON.stringify(res))}`, 303);
	} catch (error) {
		log.error(error);
		return Response.json({ message: "Failed to submit." }, { status: 500 });
	}
}
