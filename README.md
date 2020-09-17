## Project Setup

*Prerequisite* make sure you have :
- symfony client downloaded 
- yarn / npm installed 
- composer installed 
- generate the public / private keys in the api/config/jwt folder (see the .env file in the api folder)
- You can, **optionally**, install the *make* program in order to just have a single command to execute.

First, make sure you have yarn / npm installed as well as composer. Also, you'll need the symfony cli program which basically will simplify the PHP server command.

Secondly, duplicate the .env file and create a .env.local file that you can override in order to fill in the right information about the database and so on.

### Commands
- `yarn install / npm install`
- `composer install`
- `php bin/console doctrine:database:drop --if-exists --force`
- `php bin/console doctrine:database:create`
- `php bin/console doctrine:schema:update --force` or `php bin/console doctrine:migrations:migrate`
- `php bin/console doctrine:fixtures:load`
- `php bin/console cache:clear`
- `yarn encore dev` to make webpack encore watch and compile your js & css files
- `symfony serve` to start the php development server

OR If you have make installed on your computer :
- `make install` or `make install-dataset`  
then
- `symfony serve` to start the php development server
