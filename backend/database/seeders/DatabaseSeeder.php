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

        // NOTE: The heavy O*NET data import is too large for Render's boot process.
        // run these commands MANUALLY in the Render Shell after deployment:
        // php artisan majorly:download-open-data 
        // php artisan majorly:import-open-data
        
        // $this->command->info('Downloading Open Data...');
        // \Illuminate\Support\Facades\Artisan::call('majorly:download-open-data', [], $this->command->getOutput());
        
        // $this->command->info('Importing Open Data (this may take a while)...');
        // \Illuminate\Support\Facades\Artisan::call('majorly:import-open-data', [], $this->command->getOutput());
    }
}
