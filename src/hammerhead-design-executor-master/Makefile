REPORTER = dot

test:
	NODE_ENV=test node_modules/.bin/mocha --reporter $(REPORTER)

#test-cov: lib-cov
#  @INSTINCT_COV=1 $(MAKE) test REPORTER=html-cov > public/coverage.html

#lib-cov:
#  @jscoverage lib lib-cov

.PHONY: test
