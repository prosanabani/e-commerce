cd apps\bagisto
Remove-Item bootstrap\cache\config.php, bootstrap\cache\routes-v7.php, bootstrap\cache\services.php, bootstrap\cache\packages.php, bootstrap\cache\events.php -ErrorAction SilentlyContinue
php artisan optimize:clear



You usually do not need bagisto:install again if the DB is already set up — that command is for first-time setup.




What your friend should do after clone
Bagisto is not installed by pnpm install at the repo root. They must set it up manually under apps/bagisto (see setup.md).

Step	Command / action
1 cd apps/bagisto — all PHP/Artisan commands here, not apps/backend or repo root
2 copy .env.example .env — .env is not in git
3 Edit .env: DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD (MySQL 8+ running)
4 composer install — vendor/ is not in git
5 php artisan bagisto:install
6 php artisan serve → http://localhost:8000