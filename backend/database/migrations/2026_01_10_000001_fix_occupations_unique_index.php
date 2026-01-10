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

        // Clear any old records that don't have a soc_code to prevent NOT NULL and UNIQUE violations
        DB::table('occupations')->whereNull('soc_code')->delete();

        Schema::table('occupations', function (Blueprint $table) {
             // Explicitly mark as nullable() to avoid Laravel defaulting to NOT NULL on Postgres
             $table->string('soc_code')->nullable()->unique()->change();
        });

        // Fix Skills
        // Clear duplicates if any exist before adding unique constraint
        $duplicates = DB::table('skills')
            ->select('name')
            ->groupBy('name')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('name');
        
        if ($duplicates->isNotEmpty()) {
            DB::table('skills')->whereIn('name', $duplicates)->delete();
        }

        Schema::table('skills', function (Blueprint $table) {
            $table->string('name')->nullable()->unique()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('occupations', function (Blueprint $table) {
            $table->dropUnique(['occupations_soc_code_unique']);
        });
        Schema::table('skills', function (Blueprint $table) {
            $table->dropUnique(['skills_name_unique']);
        });
    }
};
