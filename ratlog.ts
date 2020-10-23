import {
	escape,
	escapeField,
	escapeMessage,
	escapeTag,
	unescape,
	unescapeField,
	unescapeMessage,
	unescapeTag,
} from "./stringmanip.ts";

export type Stringable = string | { toString: () => string };

export interface RatlogData {
	message: Stringable;
	tags?: Stringable[];
	fields?: Record<string, Stringable | null>;
}

export default class Ratlog {
	static format(data: RatlogData): string {
		let tagString =
			data.tags?.length ?? 0 > 0
				? `[${(data.tags ?? [])
						.map((tag) => escapeTag(tag.toString()))
						.join("|")}] `
				: ``;

		let messageString = escapeMessage(data.message.toString() ?? "");

		let fieldString = Object.entries(data.fields ?? {})
			.map((entry) =>
				entry.map((subentry) =>
					subentry != null ? escapeField(subentry.toString()) : subentry
				)
			)
			.map((entry) => `${entry[0]}${entry[1] != null ? `: ${entry[1]}` : ``}`)
			.reduce((prev, cur) => `${prev} | ${cur}`, "");

		return escape("\n")(tagString + messageString + fieldString) + "\n";
	}

	static parse(logline: string): RatlogData {
		let data: Partial<RatlogData> = {};

		logline = logline.replace(/\n$/, ""); // Trim off the newline at the end

		logline = unescape("\n")(logline);

		let tagSection = logline.match(/^\[(.*(?<!\\))\] ?/);
		if (tagSection) {
			data.tags = tagSection[1].split(/(?<!\\)\|/g).map(unescapeTag);
			logline = logline.substring(tagSection[0].length);
		}

		let messageSection = logline.match(/.*?(?= \|)/);
		let messageString = messageSection ? messageSection[0] : logline;
		logline = logline.substring(messageString.length);
		data.message = unescapeMessage(messageString);

		if (logline.length > 0)
			data.fields = logline
				.split(/ (?<!\\)\| /g)
				.slice(1)
				.reduce((fields: RatlogData["fields"], elem) => {
					let parts = elem.split(/(?<!\\): /);

					return {
						...fields,
						[unescapeField(parts[0])]: parts[1]
							? unescapeField(parts[1])
							: null,
					};
				}, {});

		return data as RatlogData;
	}
}
