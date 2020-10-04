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
	Deno.test(JSON.stringify(data), () => assertEquals(Ratlog.format(data), log))
);

testCases.generic.map(({ log, data }) =>
	Deno.test(`"${log.trim()}"`, () => assertEquals(Ratlog.parse(log), data))
);
