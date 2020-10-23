import Ratlog, { RatlogData, Stringable } from "./ratlog.ts";

type Writer<T> = ((data: T) => void) | { write: (data: T) => void };
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
export type Ratlogger = ((
	message: Stringable,
	fields?: RatlogData["fields"],
	...tags: Stringable[]
) => void) & { tag: (...tags: Stringable[]) => Ratlogger };

const generateRatlogger = (
	/** a writable stream or function that can take RatlogData */
	writer: Writer<RatlogData>,

	/** pre-set tags */
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
			tag: (/** pre-set tags */ ...tags: Stringable[]): Ratlogger =>
				generateRatlogger(writer, ...originalTags.concat(tags)),
		}
	);
};

const ratlog = (() => {
	return enrichFunction(
		/**
		 * @param writer a writable stream or function
		 * @param tags pre-set tags
		 * @returns a logging function bound to the writer
		 */
		(writer: Writer<string>, ...tags: Stringable[]) =>
			generateRatlogger(
				(data: RatlogData) => getWriteFunc(writer)(Ratlog.format(data)),
				...tags
			),
		{
			/** Constructor for more customizable logger instances. */
			logger: generateRatlogger,

			/** Exposure of the core Ratlog string formatter. */
			stringify: Ratlog.format,
		}
	);
})();

export default ratlog;
