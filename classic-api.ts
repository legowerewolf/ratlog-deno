import Ratlog, { RatlogData, Stringable } from "./ratlog.ts";

type Writer<T> = ((data: T) => void) | { write: (data: T) => void };
const getWriteFunc = <T>(writer: Writer<T>) =>
	"write" in writer ? writer.write.bind(writer) : writer;

const enrichFunction = <F extends Function, O>(func: F, obj: O): F & O =>
	Object.assign(func, obj);

type Ratlogger = ((
	message: Stringable,
	fields?: RatlogData["fields"],
	...tags: Stringable[]
) => void) & { tag: (...tags: Stringable[]) => Ratlogger };

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
			tag: (...tags: Stringable[]): Ratlogger =>
				generateRatlogger(writer, ...originalTags.concat(tags)),
		}
	);
};

const ratlog = (() => {
	return enrichFunction(
		(writer: Writer<string>, ...tags: Stringable[]) =>
			generateRatlogger(
				(data: RatlogData) => getWriteFunc(writer)(Ratlog.format(data)),
				...tags
			),
		{
			logger: generateRatlogger,
			stringify: Ratlog.format,
		}
	);
})();

export default ratlog;
