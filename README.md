# 🐀 Ratlog library for Deno - Application Logging for Rats, Humans, and Machines

[![Github release version (semver)](https://img.shields.io/github/v/release/legowerewolf/ratlog-deno?sort=semver)](https://github.com/legowerewolf/ratlog-deno/releases/latest)
[![GitHub commits since latest release (by SemVer)](https://img.shields.io/github/commits-since/legowerewolf/ratlog-deno/latest?sort=semver)](https://github.com/legowerewolf/ratlog-deno/releases/latest)
[![License](https://img.shields.io/github/license/legowerewolf/ratlog-deno)](https://github.com/legowerewolf/ratlog-deno/blob/main/LICENSE)

[![unit test status (Github Actions)](https://img.shields.io/github/workflow/status/legowerewolf/ratlog-deno/Deno?label=unit%20tests)](https://github.com/legowerewolf/ratlog-deno/actions?query=workflow%3ADeno)
[![code analysis status](https://img.shields.io/github/workflow/status/legowerewolf/ratlog-deno/CodeQL?label=CodeQL%20vulnerability%20analysis)](https://github.com/legowerewolf/ratlog-deno/actions?query=workflow%3ACodeQL)

[![On deno.land/x/ as ratlog](https://img.shields.io/badge/deno%20%2Fx%2F-ratlog-informational)](https://deno.land/x/ratlog)

[Deno](https://deno.land/) implementation of
[Ratlog log formatter](https://github.com/ratlog/ratlog-spec).

## Getting started

This package exposes two APIs. The more fully-featured of the two tries to match
the [Ratlog.js](https://github.com/ratlog/ratlog.js) API, and is henceforth
called the Classic API.

```ts
// Import the Classic API from deno.land/x/
import ratlog from "https://deno.land/x/ratlog@v1.0.0/classic-api.ts";

// Set up logging through the console output
const log = ratlog(console.log);

log("hello, world");
//> hello, world

// Add fields
log("counting", { count: 1 });
//> counting | count: 1

// Add fields and a tag
log("counting", { count: -1 }, "negative");
//> [negative] counting | count: -1

// Create another logger bound to a tag
const warn = log.tag("warning");

warn("disk space low");
//> [warning] disk space low

// Combine and nest tags any way you like
const critical = warn.tag("critical");

critical("shutting down all servers");
//> [warning|critical] shutting down all servers

// Parse messages
ratlog.parse("[negative] counting | count: -1");
// returns { message: "counting", tags: ["negative"], fields: { count: -1 } }

ratlog.parse("counting | count: 1");
// returns { message: "counting", fields: { count: 1 } }
```

The core of the implementation is exposed in `./ratlog.ts`, and is called the
Core API. It's less fully featured, but provides a parsing implementation.

```ts
// Import the Core API from deno.land/x/
import Ratlog from "https://deno.land/x/ratlog@v1.0.0/ratlog.ts";

Ratlog.log({ message: "hello, world" });
// returns "hello, world"

Ratlog.log({ message: "counting", fields: { count: 1 } });
// returns "counting | count: 1"

Ratlog.log({ message: "counting", tags: ["negative"], fields: { count: -1 } });
// returns "[negative] counting | count: -1"

Ratlog.parse("[negative] counting | count: -1");
// returns { message: "counting", tags: ["negative"], fields: { count: -1 } }

Ratlog.parse("counting | count: 1");
// returns { message: "counting", fields: { count: 1 } }

Ratlog.parse("hello, world");
// returns { message: "hello, world" }
```

## How to help

- Check out
  [issues requesting commentary](https://github.com/legowerewolf/ratlog-deno/issues?q=is%3Aissue+is%3Aopen+label%3Arequesting_commentary)
  and share your thoughts.

- Grab an
  [untouched issue](https://github.com/legowerewolf/ratlog-deno/issues?q=is%3Aissue+is%3Aopen+-linked%3Apr)
  and start hacking. Start a draft PR and link it to claim the issue.

- Check that dependencies (all found in
  [deps.ts](https://github.com/legowerewolf/ratlog-deno/blob/main/deps.ts)) are
  up to date.

- Contribute test cases (input-output pairs) to the
  [Ratlog spec](https://github.com/ratlog/ratlog-spec) repo (specifically
  [this file](https://github.com/ratlog/ratlog-spec/blob/master/ratlog.testsuite.json)).

- Contribute test runners (API implementation) to
  [test.ts](https://github.com/legowerewolf/ratlog-deno/blob/main/test.ts).
