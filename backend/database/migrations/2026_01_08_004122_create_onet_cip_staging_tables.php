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
        // Staging table for O*NET Occupations (Occupation Data)
        if (!Schema::hasTable('onet_occupations')) {
            Schema::create('onet_occupations', function (Blueprint $table) {
            $table->id();
            $table->string('soc_code')->index(); // e.g., 15-1252.00
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamps();
        });
        }

        // Staging table for O*NET Knowledge/Skills (Knowledge.txt, Skills.txt)
        if (!Schema::hasTable('onet_knowledge')) {
            Schema::create('onet_knowledge', function (Blueprint $table) {
            $table->id();
            $table->string('element_id')->index(); // e.g., 2.C.1.b
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type'); // 'Knowledge', 'Skill'
            $table->timestamps();
        });
        }
        
        // Pivot: Occupation has Knowledge/Skill
        if (!Schema::hasTable('onet_occupation_knowledge')) {
            Schema::create('onet_occupation_knowledge', function (Blueprint $table) {
            $table->id();
            $table->string('soc_code')->index();
            $table->string('element_id')->index();
            $table->decimal('importance', 5, 2); // 1.00 to 5.00
            $table->decimal('level', 5, 2);      // 0.00 to 7.00
            $table->timestamps();
        });
        }
        
        // Staging for CIP-SOC Crosswalk
        if (!Schema::hasTable('cip_soc_crosswalk')) {
            Schema::create('cip_soc_crosswalk', function (Blueprint $table) {
            $table->id();
            $table->string('cip_code')->index(); // 11.0701
            $table->string('cip_title');
            $table->string('soc_code')->index(); // 15-1252.00
            $table->string('soc_title');
            $table->timestamps();
        });
        }

        // Staging for Technology Skills (Technology Skills.txt)
        if (!Schema::hasTable('onet_occupation_tech_skills')) {
            Schema::create('onet_occupation_tech_skills', function (Blueprint $table) {
                $table->id();
                $table->string('soc_code')->index();
                $table->string('skill_name');
                $table->boolean('hot_tech')->default(false);
                $table->timestamps();
            });
        }

        // Add soc_code to main occupations table if not exists (for linking)
        if (!Schema::hasColumn('occupations', 'soc_code')) {
            Schema::table('occupations', function (Blueprint $table) {
                $table->string('soc_code')->nullable()->index();
            });
        }
        
        // Add cip_code to majors table
        if (!Schema::hasColumn('majors', 'cip_code')) {
            Schema::table('majors', function (Blueprint $table) {
                $table->string('cip_code')->nullable()->index();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('onet_cip_staging_tables');
    }
};
