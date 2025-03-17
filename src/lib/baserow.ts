import { env } from "@/config/env.config";

interface ConferenceRegistration {
	FirstName: string;
	LastName: string;
	Email: string;
	Affiliation: string;
	Date: string;
	Type: string;
	Monday?: boolean;
	Tuesday?: boolean;
	Wednesday?: boolean;
	Discussion?: boolean;
}

interface Submission {
	FirstName: string;
	LastName: string;
	Email: string;
	Affiliation: string;
	Date: string;
	Title: string;
	Type: string;
	Comments: string;
}

export async function createConferenceRegistration(
	data: ConferenceRegistration,
): Promise<Record<string, unknown>> {
	const tableId = env.BASEROW_TABLE_ID_CONFERENCE;
	const requestOptions = {
		method: "POST",
		headers: {
			Authorization: `Token ${env.BASEROW_API_KEY!.toString()}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};

	const res = await fetch(
		`${env.PUBLIC_BASEROW_API_BASE_URL!.toString()}/database/rows/table/${tableId!.toString()}/?user_field_names=true`,
		requestOptions,
	);
	return (await res.json()) as Record<string, unknown>;
}

export async function createConferenceSubmission(
	data: Submission,
): Promise<Record<string, unknown>> {
	const tableId = env.BASEROW_TABLE_ID_SUBMISSIONS;
	const requestOptions = {
		method: "POST",
		headers: {
			Authorization: `Token ${env.BASEROW_API_KEY!.toString()}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};

	const res = await fetch(
		`${env.PUBLIC_BASEROW_API_BASE_URL!.toString()}/database/rows/table/${tableId!.toString()}/?user_field_names=true`,
		requestOptions,
	);
	return (await res.json()) as Record<string, unknown>;
}
