REPORTER ?= dot

TESTS = test/*.js

test: ;	@NODE_ENV=test ./node_modules/.bin/mocha \
	--timeout 1000 --reporter $(REPORTER) $(TESTS)

.PHONY: test