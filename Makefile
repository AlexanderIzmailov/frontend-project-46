install:
	npm ci

lint:
	npx eslint .

test:
	npx jest

test-coverage:
	npx jest --coverage --coverageProvider=v8