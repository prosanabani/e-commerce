<?php

namespace Webkul\Installer\Helpers;

use Illuminate\Support\Facades\DB;

class DatabaseSeederHelper
{
    public static function withoutForeignKeyChecks(callable $callback): void
    {
        if (DB::getDriverName() !== 'mysql') {
            $callback();

            return;
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        try {
            $callback();
        } finally {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }
    }
}
