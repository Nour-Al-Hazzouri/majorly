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
        Schema::create('major_occupation', function (Blueprint $table) {
            $table->foreignId('major_id')->constrained()->onDelete('cascade');
            $table->foreignId('occupation_id')->constrained()->onDelete('cascade');
            $table->primary(['major_id', 'occupation_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('major_occupation');
    }
};
