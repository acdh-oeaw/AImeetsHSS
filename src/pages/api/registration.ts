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
		monday: v.optional(v.literal("on")),
		tuesday: v.optional(v.literal("on")),
		wednesday: v.optional(v.literal("on")),
		discussion: v.optional(v.picklist(["true", "on"])),
		"data-consent": v.literal("on"),
	}),
	v.transform((data) => {
		return {
			firstName: data["first-name"],
			lastName: data["last-name"],
			email: data.email,
			affiliation: data.affiliation,
			type: data.type,
			monday: data.monday,
			tuesday: data.tuesday,
			wednesday: data.wednesday,
			discussion: data.discussion,
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
			Monday: submission.monday ? true : false,
			Tuesday: submission.tuesday ? true : false,
			Wednesday: submission.wednesday ? true : false,
			Discussion: submission.discussion ? true : false,
		});
		let subject = "";
		let message = "";
		if (result.output.type === "conference") {
			subject = `[AImeetsHSS] registration form submission ${submission.lastName}`;
			message =
				`Dear ${submission.firstName} ${submission.lastName},\n` +
				`please find below details about your registration request for the AImeetsHSS conference.\n` +
				`ID: ${res.id as string}\n` +
				`First Name: ${submission.firstName}\n` +
				`Last Name: ${submission.lastName}\n` +
				`Email: ${submission.email}\n` +
				`Affiliation: ${submission.affiliation}\n` +
				`Registration Date: ${submission.date}\n` +
				`Registered for: ${submission.type}\n` +
				`We would like to inform you, that there will be pictures taken and/or filming during the conference. This material may be used for various media (print, TV, online) and publications (print, online) of the Austrian Academy of Sciences. With your participation you agree to the use of this material.\n` +
				`Best,\nThe AImeetsHSS team`;
		} else if (result.output.type === "discussion") {
			subject = `[AImeetsHSS] Anmeldung Podiumsdiskussion ${submission.lastName}`;
			message =
				`WerteR ${submission.firstName} ${submission.lastName},\n` +
				`untenan übersenden wir Ihnen ihre Anmeldedaten zur Podiumsdiskussion am XXXX.\n` +
				`ID: ${res.id as string}\n` +
				`Vorname: ${submission.firstName}\n` +
				`Nachname: ${submission.lastName}\n` +
				`Email: ${submission.email}\n` +
				`Institution: ${submission.affiliation}\n` +
				`Anmeldedatum: ${submission.date}\n` +
				`Angemeldet für: ${submission.type}\n` +
				`Wir dürfen Sie als Teilnehmer/in an der Podiumsdiskussion darüber informieren, dass im Rahmen dieser Veranstaltung möglicherweise Fotografien und/oder Filme erstellt werden. Diese Aufnahmen können in verschiedenen Medien (Print, TV, Online,...) und in Publikationen (Print, Online,...) der Österreichischen Akademie der Wissenschaften Verwendung finden. Mit Ihrer Teilnahme an der Veranstaltung stimmen Sie dieser Verwendung zu.\n` +
				`Beste Grüße,\nDas AImeetsHSS Konferenzteam`;
		}
		await sendEmail({
			from: env.EMAIL_CONTACT_ADDRESS!,
			to: submission.email,
			subject: subject,
			text: message,
		});
		return context.redirect(`/en/success?data=${encodeURIComponent(JSON.stringify(res))}`, 303);
	} catch (error) {
		log.error(error);
		return Response.json({ message: "Failed to submit." }, { status: 500 });
	}
}
