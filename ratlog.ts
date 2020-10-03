import {
	apply,
	escape,
	escapeField,
	escapeMessage,
	escapeTag,
} from "./stringmanip.ts";

const encoder = new TextEncoder();

export interface RatlogData {
	message: string;
	tags?: string[];
	fields?: {
		[key: string]: string | null;
	};
}

export default class Ratlog {
	static format(data: RatlogData) {
		let tagString =
			data.tags?.length ?? 0 > 0
				? `[${(data.tags ?? []).map(escapeTag).join("|")}] `
				: ``;

		let messageString = escapeMessage(data.message ?? "");

		let fieldString = Object.entries(data.fields ?? {})
			.map((entry) =>
				entry.map((subentry) =>
					subentry != null ? escapeField(subentry) : subentry
				)
			)
			.map((entry) => `${entry[0]}${entry[1] != null ? `: ${entry[1]}` : ``}`)
			.reduce((prev, cur) => `${prev} | ${cur}`, "");

		return (
			apply(tagString + messageString + fieldString, [escape("\n")]) + "\n"
		);
	}
}
