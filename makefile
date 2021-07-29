all : dist/classic-api.js dist/ratlog.js dist/ratlog.d.ts

# Download the latest version of Deno
deno :
	wget -nv --spider --output-file=wget_log https://github.com/denoland/deno/releases/latest
	wget -q https://github.com/denoland/deno/releases/download/$$(grep -Po v\\d+\\.\\d+\\.\\d+ wget_log)/deno-x86_64-unknown-linux-gnu.zip
	unzip deno-x86_64-unknown-linux-gnu.zip
	@rm wget_log deno-x86_64-unknown-linux-gnu.zip

# Bundle typescript files into safe outputs using Deno, which'll be fetched if needed
dist/%.js : %.ts | deno
	@mkdir -p dist
	deno bundle $< $@

dist/%.d.ts : %.ts
	@mkdir -p dist
	-tsc $< --declaration --emitDeclarationOnly --outDir dist --lib esnext