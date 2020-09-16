composer:
	composer install

yarn:
	yarn install

db:
	php bin/console doctrine:database:drop --force
	php bin/console doctrine:database:create
	php bin/console doctrine:migrations:migrate --no-interaction

dataset:
	php bin/console doctrine:fixtures:load --append

cache:
	php bin/console cache:clear

asset:
	yarn encore dev

install: composer yarn db cache asset

install-dataset: install dataset