export const apply = (str: string, mut: ((str: string) => string)[]) =>
	mut.reduce((prev, func) => func(prev), str);

export const escape = (symbol: string) => (input: string) => {
	switch (symbol) {
		case "\n":
			return input.replaceAll(symbol, `\\n`);
		default:
			return input.replaceAll(symbol, `\\${symbol}`);
	}
};

export const escapeTag = (tag: string) =>
	apply(tag, [escape("]"), escape("|")]);
export const escapeMessage = (message: string) =>
	apply(message, [escape("["), escape("|")]);
export const escapeField = (fieldval: string) =>
	apply(fieldval, [escape(":"), escape("|")]);
