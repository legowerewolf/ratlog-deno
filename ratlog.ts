import {
	apply,
	escape,
	escapeField,
	escapeMessage,
	escapeTag,
	unescape,
	unescapeField,
	unescapeMessage,
	unescapeTag,
} from "./stringmanip.ts";

/**
 * An object that either is a string, or reveals a toString() function.
 *
 * Utility type, used to make the Ratlog API more flexible.
 */
export type Stringable = string | { toString: () => string };

/**
 * The base Ratlog data type. All logs are serialized from and parsed to objects of this type.
 */
export interface RatlogData {
	message: Stringable;
	tags?: Stringable[];
	fields?: Record<string, Stringable | null>;
}

export default class Ratlog {
	/**
	 * Take a 'line' of Ratlog data and format it for output.
	 * @param data the log line to format
	 */
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

		return (
			apply(tagString + messageString + fieldString, [escape("\n")]) + "\n"
		);
	}

	/**
	 * Take a string and parse it.
	 *
	 * Known to work on standards-compliant Ratlog formatter output. Not guaranteed to work with log data that doesn't meet the spec.
	 *
	 * @param logline a line of text to parse as Ratlog data
	 */
	static parse(logline: string): RatlogData {
		let data: Partial<RatlogData> = {};

		logline = logline.replace(/\n$/, ""); // Trim off the newline at the end

		logline = apply(logline, [unescape("\n")]);

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
