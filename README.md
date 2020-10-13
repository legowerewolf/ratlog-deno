# ratlog-deno

[![Github release version (semver)](https://img.shields.io/github/v/release/legowerewolf/ratlog-deno?sort=semver)](https://github.com/legowerewolf/ratlog-deno/releases/latest)
![GitHub commits since latest release (by SemVer)](https://img.shields.io/github/commits-since/legowerewolf/ratlog-deno/latest?sort=semver)
![License](https://img.shields.io/github/license/legowerewolf/ratlog-deno)

[![unit test status (Github Actions)](https://img.shields.io/github/workflow/status/legowerewolf/ratlog-deno/Deno?label=unit%20tests)](https://github.com/legowerewolf/ratlog-deno/actions?query=workflow%3ADeno)
[![code analysis status](https://img.shields.io/github/workflow/status/legowerewolf/ratlog-deno/CodeQL?label=CodeQL%20vulnerability%20analysis)](https://github.com/legowerewolf/ratlog-deno/actions?query=workflow%3ACodeQL)

[![On deno.land/x/ as ratlog](https://img.shields.io/badge/deno%20%2Fx%2F-ratlog-informational)](https://deno.land/x/ratlog)

[Deno](https://deno.land/) implementation of
[Ratlog log formatter](https://github.com/ratlog/ratlog-spec).

API is unstable. `import` from specific commits until stated otherwise.

## How to help

- Check out
  [issues requesting commentary](https://github.com/legowerewolf/ratlog-deno/issues?q=is%3Aissue+is%3Aopen+label%3Arequesting_commentary)
  and share your thoughts.

- Pick something off the "not started" section of the
  [project board](https://github.com/legowerewolf/ratlog-deno/projects/1) and
  start hacking.

- Contribute test cases (input-output pairs) to the
  [Ratlog spec](https://github.com/ratlog/ratlog-spec) repo (specifically
  [this file](https://github.com/ratlog/ratlog-spec/blob/master/ratlog.testsuite.json)).

- Contribute test runners (API implementation) to
  [test.ts](https://github.com/legowerewolf/ratlog-deno/blob/main/test.ts).
