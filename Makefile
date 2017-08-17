.PHONY: test
deps:
	npm i
lint:
	npm run lint
test:
	make lint
	node_modules/.bin/jest
