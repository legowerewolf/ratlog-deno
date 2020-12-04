/**
 * Transform a string with the given functions
 * @param str a string to be transformed
 * @param mut an array of string transformation functions to be applied left-to-right to `str`
 */
export const apply = (str: string, mut: ((str: string) => string)[]) =>
  mut.reduce((prev, func) => func(prev), str);

/**
 * Generate a function that escapes a given character for input strings
 * @param symbol a symbol (character) to generate an escape function for
 */
export const escape = (symbol: string) =>
  (
    /** A string to escape */ input: string,
  ) => {
    switch (symbol) {
      case "\n":
        return input.replaceAll("\n", `\\n`);
      default:
        return input.replaceAll(symbol, `\\${symbol}`);
    }
  };

/**
 * Generate a function that unescapes a given character for input strings
 * @param symbol a symbol (character) to generate an unescape function for
 */
export const unescape = (symbol: string) =>
  (
    /** A string to unescape */ input: string,
  ) => {
    switch (symbol) {
      case "\n":
        return input.replaceAll(`\\n`, `\n`);
      default:
        return input.replaceAll(`\\${symbol}`, symbol);
    }
  };

/** Escape symbols unsafe for tags */
export const escapeTag = (tag: string) =>
  apply(tag, [escape("]"), escape("|")]);

/** Escape symbols unsafe for messages */
export const escapeMessage = (message: string) =>
  apply(message, [escape("["), escape("|")]);

/** Escape symbols unsafe for fields */
export const escapeField = (fieldval: string) =>
  apply(fieldval, [escape(":"), escape("|")]);

/** Unescape symbols unsafe for tags */
export const unescapeTag = (tag: string) =>
  apply(tag, [unescape("]"), unescape("|")]);

/** Unescape symbols unsafe for messages */
export const unescapeMessage = (message: string) =>
  apply(message, [unescape("["), unescape("|")]);

/** Unescape symbols unsafe for fields */
export const unescapeField = (fieldpart: string) =>
  apply(fieldpart, [unescape(":"), unescape("|")]);
