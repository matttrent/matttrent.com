build: clean
	node metalsmith.js

clean:
	rm -rf build

serve:
	node_modules/metalsmith-start/bin/metalsmith-start

deploy: build
	cd ./build && \
	git init . && \
	git add . && \
	git commit -m "Deploy"; \
	git push "git@github.com:matttrent/matttrent.github.io.git" --force && \
	rm -rf .git

.PHONY: build serve clean
