import ratlog from "./classic-api.ts";
import { assertEquals } from "./deps.ts";
import Ratlog, { RatlogData } from "./ratlog.ts";

interface TestCase {
  log: string;
  data: RatlogData;
}

interface TestcaseFile {
  meta: {
    version: string;
    source: string;
  };
  generic: TestCase[];
  parsing: TestCase[];
}

console.log("Attempting to pull up-to-date test cases from spec...");
const testCases: TestcaseFile = await fetch(
  "https://raw.githubusercontent.com/ratlog/ratlog-spec/master/ratlog.testsuite.json",
)
  .then(
    (resp) => resp.text(),
    () => Deno.readTextFile("./testcases.json"),
  )
  .catch(() => {
    console.error(
      "Unable to load test cases! (run with --allow-net, or if cached, --allow-read)",
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
    assertEquals(Ratlog.format(data), log))
);

testCases.generic.map(({ log, data }) =>
  Deno.test(`core parse "${log.trim()}"`, () =>
    assertEquals(Ratlog.parse(log), data))
);

testCases.generic.map(({ log, data }) =>
  Deno.test(`classic-api format default ${JSON.stringify(data)}`, () => {
    const write = (line: string) => assertEquals(line, log);

    const logger = ratlog(write);

    logger(data.message, data.fields, ...(data.tags ?? []));
  })
);

testCases.generic.map(({ log, data }) =>
  Deno.test(
    `classic-api format default bound tag ${JSON.stringify(data)}`,
    () => {
      const write = (line: string) => assertEquals(line, log);

      const logger = ratlog(write, ...(data.tags ?? []));

      logger(data.message, data.fields);
    },
  )
);

testCases.generic.map(({ log, data }) =>
  Deno.test(
    `classic-api format secondary bound tag ${JSON.stringify(data)}`,
    () => {
      const write = (line: string) => assertEquals(line, log);

      const logger1 = ratlog(write);

      const logger2 = logger1.tag(...(data.tags ?? []));

      logger2(data.message, data.fields);
    },
  )
);
