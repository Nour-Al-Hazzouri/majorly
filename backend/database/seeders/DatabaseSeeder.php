<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create Test User
        User::firstOrCreate([
            'email' => 'test@example.com',
        ], [
            'name' => 'Test User',
            'password' => bcrypt('password'),
        ]);

        // Run the robust data import pipeline
        // This replaces individual seeders with a comprehensive O*NET + CIP import
        $this->command->info('Downloading Open Data...');
        \Illuminate\Support\Facades\Artisan::call('majorly:download-open-data', [], $this->command->getOutput());
        
        $this->command->info('Importing Open Data (this may take a while)...');
        \Illuminate\Support\Facades\Artisan::call('majorly:import-open-data', [], $this->command->getOutput());
    }
}
