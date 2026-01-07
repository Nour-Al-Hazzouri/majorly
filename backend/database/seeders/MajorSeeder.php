<?php

namespace Database\Seeders;

use App\Models\Major;
use App\Models\Occupation;
use App\Models\Skill;
use Illuminate\Database\Seeder;

class MajorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $majors = [
            [
                'name' => 'Computer Science',
                'slug' => 'computer-science',
                'category' => 'Technology',
                'description' => 'Study of computers and computational systems.',
                'skills' => ['Software Engineering', 'Python (Programming Language)', 'JavaScript (Programming Language)'],
                'occupations' => ['15-1252.00', '15-1211.00']
            ],
            [
                'name' => 'Nursing',
                'slug' => 'nursing',
                'category' => 'Healthcare',
                'description' => 'The protection, promotion, and optimization of health and abilities.',
                'skills' => ['Patient Care', 'Anatomy', 'Biology', 'Communication'],
                'occupations' => ['29-1141.00', '11-9111.00']
            ],
            [
                'name' => 'Business Administration',
                'slug' => 'business-administration',
                'category' => 'Business',
                'description' => 'The administration of a commercial enterprise.',
                'skills' => ['Project Management', 'Accounting', 'Marketing Strategy', 'Communication'],
                'occupations' => ['13-2011.00', '11-9111.00']
            ],
            [
                'name' => 'Graphic Design',
                'slug' => 'graphic-design',
                'category' => 'Arts',
                'description' => 'The art and practice of planning and projecting ideas and experiences with visual and textual content.',
                'skills' => ['Graphic Design', 'Adobe Creative Suite', 'Communication'],
                'occupations' => ['27-1024.00']
            ],
            [
                'name' => 'Education',
                'slug' => 'education',
                'category' => 'Education',
                'description' => 'The process of facilitating learning, or the acquisition of knowledge, skills, values, beliefs, and habits.',
                'skills' => ['Teaching', 'Curriculum Development', 'Communication'],
                'occupations' => ['25-2021.00']
            ],
             [
                'name' => 'Data Science',
                'slug' => 'data-science',
                'category' => 'Technology',
                'description' => 'Extracting knowledge and insights from noisy, structured and unstructured data.',
                'skills' => ['Data Analysis', 'Python (Programming Language)', 'Statistics', 'Machine Learning'],
                'occupations' => ['15-2031.00', '15-1211.00']
            ]
        ];

        foreach ($majors as $data) {
            $major = Major::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'name' => $data['name'],
                    'category' => $data['category'],
                    'description' => $data['description']
                ]
            );

            // Attach Skills
            if (isset($data['skills'])) {
                $skillIds = Skill::whereIn('name', $data['skills'])->pluck('id');
                $major->skills()->sync($skillIds);
            }

            // Attach Occupations
            if (isset($data['occupations'])) {
                 $occupationIds = Occupation::whereIn('code', $data['occupations'])->pluck('id');
                 $major->occupations()->sync($occupationIds);
            }
        }
    }
}
