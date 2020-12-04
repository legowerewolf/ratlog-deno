import Ratlog, { RatlogData, Stringable } from "./ratlog.ts";

/**
 * Interface representing a stream or function passed to the ratlogger constructor.
 *
 * It's either itself a function that takes data and returns nothing, or an object
 * with a `write()` function that takes data and returns nothing.
 */
type Writer<T> = ((data: T) => void) | { write: (data: T) => void };

/**
 * Identify the single function to be called when outputting to a writer
 * @param writer writer to identify output function for
 */
const getWriteFunc = <T>(writer: Writer<T>) =>
  "write" in writer ? writer.write.bind(writer) : writer;

/**
 * Take a function and an object and produce a function with properties.
 * @param func the function to attach properties to
 * @param obj an object containing properties to copy to the function
 */
const enrichFunction = <F extends Function, O>(func: F, obj: O): F & O =>
  Object.assign(func, obj);

/**
 * A `Ratlogger` is a function that takes the components of a `RatlogData` and
 * does something with it. It also exposes a `tag` property-function which produces
 * an identical `Ratlogger` with the added tags.
 */
export type Ratlogger =
  & ((
    message: Stringable,
    fields?: RatlogData["fields"],
    ...tags: Stringable[]
  ) => void)
  & { tag: (...tags: Stringable[]) => Ratlogger };

/**
 * Constructor for more customizable logger instances.
 * @param writer a writable stream or function that can take RatlogData
 * @param tags a list of tags to apply to every output from this logger
 */
const generateRatlogger = (
  writer: Writer<RatlogData>,
  ...tags: Stringable[]
): Ratlogger => {
  let originalTags = tags;

  return enrichFunction(
    (
      message: Stringable,
      fields?: RatlogData["fields"],
      ...tags: Stringable[]
    ): void => {
      getWriteFunc(writer)({
        message,
        fields,
        tags: originalTags.concat(tags),
      });
    },
    {
      tag: (
        /** a list of tags to apply to every output from this logger */
        ...tags: Stringable[]
      ): Ratlogger => generateRatlogger(writer, ...originalTags.concat(tags)),
    },
  );
};

const ratlog = (() => {
  return enrichFunction(
    /**
		 * @param writer a writable stream or function
		 * @param tags a list of tags to apply to every output from this logger
		 * @returns a logging function bound to the writer
		 */
    (writer: Writer<string>, ...tags: Stringable[]) =>
      generateRatlogger(
        (data: RatlogData) => getWriteFunc(writer)(Ratlog.format(data)),
        ...tags,
      ),
    {
      /** Constructor for more customizable logger instances. */
      logger: generateRatlogger,

      /** Exposure of the core Ratlog string formatter. */
      stringify: Ratlog.format,

      /** Exposure of the core Ratlog parser. */
      parse: Ratlog.parse,
    },
  );
})();

export default ratlog;
