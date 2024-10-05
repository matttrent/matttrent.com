build: clean
	NODE_ENV=production node metalsmith.js

clean:
	rm -rf build

serve:
	DEBUG=1 NODE_ENV=development node_modules/metalsmith-start/bin/metalsmith-start

deploy: build
	cd ./build && \
	git init . && \
	git add . && \
	git commit -m "Deploy"; \
	git push "git@github.com:matttrent/matttrent.github.io.git" --force && \
	rm -rf .git

.PHONY: build serve clean
