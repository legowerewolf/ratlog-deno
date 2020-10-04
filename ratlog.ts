import {
	apply,
	escape,
	escapeField,
	escapeMessage,
	escapeTag,
	unescape,
	unescapeMessage,
	unescapeTag,
} from "./stringmanip.ts";

export interface RatlogData {
	message: string;
	tags?: string[];
	fields?: {
		[key: string]: string | null;
	};
}

export default class Ratlog {
	static format(data: RatlogData): string {
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

	static parse(logline: string): RatlogData {
		let data: Partial<RatlogData> = {};

		logline = logline.trimEnd();

		logline = apply(logline, [unescape("\n")]);

		let tagSection = logline.match(/^\[(.*(?<!\\))\] ?/);
		if (tagSection) {
			data.tags = tagSection[1].split(/(?<!\\)\|/g).map(unescapeTag);
			logline = logline.substring(tagSection[0].length);
		}

		let messageSection = logline.match(/.*?(?= \|)/);
		data.message = messageSection ? messageSection[0] : "";
		logline = logline.substring(data.message.length);
		data.message = unescapeMessage(data.message);

		return data as RatlogData;
	}
}
