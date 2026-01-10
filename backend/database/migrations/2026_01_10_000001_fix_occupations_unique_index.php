<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Fix Occupations
        Schema::table('occupations', function (Blueprint $table) {
            if (!Schema::hasColumn('occupations', 'soc_code')) {
                $table->string('soc_code')->nullable()->after('code');
            }
        });

        Schema::table('occupations', function (Blueprint $table) {
             $table->string('soc_code')->change()->unique();
        });

        // Fix Skills
        Schema::table('skills', function (Blueprint $table) {
            // Check if unique index exists (Postgres uses a specific naming convention but unique() handles it)
            // To be safe, we just try to add it. If it fails, we know it exists.
            // But better to clear duplicates first if any.
            $table->string('name')->change()->unique();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('occupations', function (Blueprint $table) {
            $table->dropUnique(['soc_code']);
        });
        Schema::table('skills', function (Blueprint $table) {
            $table->dropUnique(['skills_name_unique']);
        });
    }
};
