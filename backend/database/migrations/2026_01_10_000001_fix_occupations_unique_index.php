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
        // 1. Ensure columns exist
        if (!Schema::hasColumn('occupations', 'soc_code')) {
            Schema::table('occupations', function (Blueprint $table) {
                $table->string('soc_code')->nullable()->after('code');
            });
        }

        // 2. Clear invalid data (DML)
        DB::statement('DELETE FROM occupations WHERE soc_code IS NULL');
        
        // 3. Add unique constraints using raw SQL (survives pooler transaction logic better)
        // Occupations
        DB::statement('ALTER TABLE occupations DROP CONSTRAINT IF EXISTS occupations_soc_code_unique');
        DB::statement('ALTER TABLE occupations ADD CONSTRAINT occupations_soc_code_unique UNIQUE (soc_code)');

        // Skills
        // Clear duplicates
        DB::statement('DELETE FROM skills WHERE id IN (
            SELECT id FROM (
                SELECT id, ROW_NUMBER() OVER (PARTITION BY name ORDER BY id) as row_num
                FROM skills
            ) t WHERE t.row_num > 1
        )');
        
        DB::statement('ALTER TABLE skills DROP CONSTRAINT IF EXISTS skills_name_unique');
        DB::statement('ALTER TABLE skills ADD CONSTRAINT skills_name_unique UNIQUE (name)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE occupations DROP CONSTRAINT IF EXISTS occupations_soc_code_unique');
        DB::statement('ALTER TABLE skills DROP CONSTRAINT IF EXISTS skills_name_unique');
    }
};
