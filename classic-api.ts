import Ratlog, { RatlogData, Stringable } from "./ratlog.ts";

type Writer<T> = ((data: T) => void) | { write: (data: T) => void };
const getWriteFunc = <T>(writer: Writer<T>) =>
	"write" in writer ? writer.write.bind(writer) : writer;

function makeObjectCallable<F extends Function, O>(obj: O, func: F) {
	return Object.assign(func, obj) as F & O;
}

type Ratlogger = ((
	message: Stringable,
	fields?: RatlogData["fields"],
	...tags: Stringable[]
) => void) & { tag: (...tags: Stringable[]) => Ratlogger };

const generateRatlogger = (
	writer: Writer<RatlogData>,
	...tags: Stringable[]
) => {
	let originalTags = tags;

	return makeObjectCallable(
		{
			tag: (...tags: Stringable[]): Ratlogger =>
				generateRatlogger(writer, ...originalTags.concat(tags)),
		},
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
		}
	) as Ratlogger;
};

const ratlog = (() => {
	return makeObjectCallable(
		{
			logger: generateRatlogger,
			stringify: Ratlog.format,
		},
		(writer: Writer<string>, ...tags: Stringable[]) =>
			generateRatlogger(
				(data: RatlogData) => getWriteFunc(writer)(Ratlog.format(data)),
				...tags
			)
	);
})();

export default ratlog;
