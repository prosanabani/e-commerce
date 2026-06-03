<?php

use App\Http\Middleware\EncryptCookies;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Cookie\Middleware\EncryptCookies as BaseEncryptCookies;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull;
use Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance;
use Webkul\Core\Http\Middleware\SecureHeaders;
use Webkul\Installer\Http\Middleware\CanInstall;

$skipApiPlatform = (static function (): bool {
    $envFile = dirname(__DIR__).'/.env';

    if (! is_readable($envFile)) {
        return false;
    }

    return (bool) preg_match('/^\s*BAGISTO_SKIP_API_PLATFORM\s*=\s*true\s*$/mi', (string) file_get_contents($envFile));
})();

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        /**
         * Remove the default Laravel middleware that prevents requests during maintenance mode. There are three
         * middlewares in the shop that need to be loaded before this middleware. Therefore, we need to remove this
         * middleware from the list and add the overridden middleware at the end of the list.
         *
         * As of now, this has been added in the Admin and Shop providers. I will look for a better approach in Laravel 11 for this.
         */
        $middleware->remove(PreventRequestsDuringMaintenance::class);

        /**
         * Remove the default Laravel middleware that converts empty strings to null. First, handle all nullable cases,
         * then remove this line.
         */
        $middleware->remove(ConvertEmptyStringsToNull::class);

        $middleware->append(SecureHeaders::class);
        $middleware->append(CanInstall::class);

        /**
         * Add the overridden middleware at the end of the list.
         */
        $middleware->replaceInGroup('web', BaseEncryptCookies::class, EncryptCookies::class);

        $middleware->validateCsrfTokens(except: [
            'stripe/*',
        ]);

        $middleware->trustProxies(at: '*');
    })
    ->withSchedule(function (Schedule $schedule) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
->withProviders(array_values(array_filter([
    /**
     * API Platform introspects Eloquent models (including translatable relations) during
     * boot. On an empty database that breaks artisan migrate / bagisto:install.
     * Set BAGISTO_SKIP_API_PLATFORM=true in .env until the schema exists.
     */
    $skipApiPlatform ? null : \ApiPlatform\Laravel\ApiPlatformProvider::class,
    $skipApiPlatform ? null : \ApiPlatform\Laravel\ApiPlatformDeferredProvider::class,
    $skipApiPlatform ? null : \ApiPlatform\Laravel\Eloquent\ApiPlatformEventProvider::class,
])))
->create();
