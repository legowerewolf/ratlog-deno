import { assertEquals } from "./deps.ts";
import Ratlog, { RatlogData } from "./ratlog.ts";

interface TestCase {
	log: string;
	data: RatlogData;
}

interface TestcaseFile {
	meta: {};
	generic: TestCase[];
	parsing: TestCase[];
}

console.log("Attempting to pull up-to-date test cases from spec...");
let testCases: TestcaseFile = await fetch(
	"https://raw.githubusercontent.com/ratlog/ratlog-spec/master/ratlog.testsuite.json"
)
	.then(
		(resp) => resp.text(),
		() => Deno.readTextFile("./testcases.json")
	)
	.catch(() => {
		console.error(
			"Unable to load test cases! (run with --allow-net, or if cached, --allow-read)"
		);
		Deno.exit(1);
	})
	.then(async (content) => {
		await Deno.writeTextFile("./testcases.json", content).catch(() =>
			console.warn("Unable to cache test cases! (run with --allow-write)")
		);
		return JSON.parse(content);
	});

testCases.generic.map(({ log, data }) =>
	Deno.test(`core format ${JSON.stringify(data)}`, () =>
		assertEquals(Ratlog.format(data), log)
	)
);

testCases.generic.map(({ log, data }) =>
	Deno.test(`core parse "${log.trim()}"`, () =>
		assertEquals(Ratlog.parse(log), data)
	)
);

testCases.generic.map(({ log, data }) =>
	Deno.test(`classic-api format default ${JSON.stringify(data)}`, async () => {
		const ratlog = await (await import("./classic-api.ts")).default;

		const write = (line: string) => assertEquals(line, log);

		let logger = ratlog(write);

		logger(data.message, data.fields, ...(data.tags ?? []));
	})
);

testCases.generic.map(({ log, data }) =>
	Deno.test(
		`classic-api format default bound tag ${JSON.stringify(data)}`,
		async () => {
			const ratlog = await (await import("./classic-api.ts")).default;

			const write = (line: string) => assertEquals(line, log);

			let logger = ratlog(write, ...(data.tags ?? []));

			logger(data.message, data.fields);
		}
	)
);

testCases.generic.map(({ log, data }) =>
	Deno.test(
		`classic-api format secondary bound tag ${JSON.stringify(data)}`,
		async () => {
			const ratlog = await (await import("./classic-api.ts")).default;

			const write = (line: string) => assertEquals(line, log);

			let logger1 = ratlog(write);

			let logger2 = logger1.tag(...(data.tags ?? []));

			logger2(data.message, data.fields);
		}
	)
);
