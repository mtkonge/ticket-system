
.PHONY: build watch check clean

build:
	esbuild src/main.ts --outfile=bundle.js --minify --sourcemap --bundle

watch:
	esbuild src/main.ts --outfile=bundle.js --minify --sourcemap --bundle --watch

check:
	tsc --noEmit -p tsconfig.json

checkwatch:
	tsc --noEmit --watch -p tsconfig.json

clean:
	rm -rf bundle.js bundle.js.map

