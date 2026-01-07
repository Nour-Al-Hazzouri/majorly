<?php

namespace Database\Seeders;

use App\Models\Occupation;
use App\Services\OnetService;
use Illuminate\Database\Seeder;

class OccupationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(OnetService $service): void
    {
        $occupations = $service->fetchOccupations();

        foreach ($occupations as $data) {
            Occupation::updateOrCreate(
                ['code' => $data['code']],
                [
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'median_salary' => $data['median_salary'],
                    'job_outlook' => $data['job_outlook']
                ]
            );
        }
    }
}
