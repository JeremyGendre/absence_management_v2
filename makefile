composer.lock: composer.json
	composer update --prefer-stable

vendor: composer.lock
	composer install

yarn.lock: package.json
	yarn upgrade

node_modules: yarn.lock
	yarn install --freeze-lock --check-files

db:
	php bin/console doctrine:database:drop --if-exists --force
	php bin/console doctrine:database:create
	php bin/console doctrine:migrations:migrate --no-interaction

dataset:
	php bin/console doctrine:fixtures:load --append

cache:
	php bin/console cache:clear

build: node_modules
	yarn build

asset:
	yarn encore dev

install: vendor node_modules db cache asset

i : install

install-local: db cache asset

il: install-local

install-dataset: install dataset

id: install-dataset

install-local-dataset: install-local dataset

ild: install-local-dataset

deploy: install build
