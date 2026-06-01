<?php

namespace Webkul\Installer\Helpers;

use Illuminate\Support\Facades\DB;

class DatabaseSeederHelper
{
    public static function withoutForeignKeyChecks(callable $callback): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');

            try {
                $callback();
            } finally {
                DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            }

            return;
        }

        if ($driver === 'pgsql') {
            DB::statement("SET session_replication_role = 'replica';");

            try {
                $callback();
            } finally {
                DB::statement('SET session_replication_role = DEFAULT;');
            }

            return;
        }

        $callback();
    }

    public static function syncPostgresSequence(string $table, string $column = 'id'): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement(
            "SELECT setval(pg_get_serial_sequence(?, ?), COALESCE((SELECT MAX({$column}) FROM {$table}), 1), true)",
            [$table, $column],
        );
    }
}
