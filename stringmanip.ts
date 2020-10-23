/**
 * @param str a string to be transformed
 * @param mut an array of string transformation functions to be applied left-to-right to `str`
 */
export const apply = (str: string, mut: ((str: string) => string)[]) =>
	mut.reduce((prev, func) => func(prev), str);

/**
 *
 * @param symbol a symbol (character) to generate an escape function for
 */
export const escape = (symbol: string) => (input: string) => {
	switch (symbol) {
		case "\n":
			return input.replaceAll("\n", `\\n`);
		default:
			return input.replaceAll(symbol, `\\${symbol}`);
	}
};

/**
 * @param symbol a symbol (character) to generate an unescape function for
 */
export const unescape = (symbol: string) => (input: string) => {
	switch (symbol) {
		case "\n":
			return input.replaceAll(`\\n`, `\n`);
		default:
			return input.replaceAll(`\\${symbol}`, symbol);
	}
};

export const escapeTag = (tag: string) =>
	apply(tag, [escape("]"), escape("|")]);
export const escapeMessage = (message: string) =>
	apply(message, [escape("["), escape("|")]);
export const escapeField = (fieldval: string) =>
	apply(fieldval, [escape(":"), escape("|")]);

export const unescapeTag = (tag: string) =>
	apply(tag, [unescape("]"), unescape("|")]);
export const unescapeMessage = (message: string) =>
	apply(message, [unescape("["), unescape("|")]);
export const unescapeField = (fieldpart: string) =>
	apply(fieldpart, [unescape(":"), unescape("|")]);
