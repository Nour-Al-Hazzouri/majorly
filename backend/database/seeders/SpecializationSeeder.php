<?php

namespace Database\Seeders;

use App\Models\Major;
use App\Models\Specialization;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SpecializationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $specializations = [
            'Computer Science' => [
                'Software Engineering',
                'Data Science',
                'Artificial Intelligence',
                'Cybersecurity',
            ],
            'Psychology' => [
                'Clinical Psychology',
                'Counseling Psychology',
                'Developmental Psychology',
            ],
            'Nursing' => [
                'Pediatric Nursing',
                'Critical Care Nursing',
                'Geriatric Nursing',
            ],
            'Business Administration' => [
                'Marketing',
                'Finance',
                'Human Resources',
                'Operations Management',
            ],
            'Mechanical Engineering' => [
                'Robotics',
                'Automotive Engineering',
                'HVAC Systems',
            ],
        ];

        foreach ($specializations as $majorName => $specs) {
            $major = Major::where('name', $majorName)->first();
            
            if ($major) {
                foreach ($specs as $specName) {
                    Specialization::firstOrCreate(
                        ['name' => $specName, 'major_id' => $major->id],
                        [
                            'description' => "A specialization within {$majorName}.",
                            'slug' => Str::slug($specName),
                        ]
                    );
                }
            }
        }
    }
}
