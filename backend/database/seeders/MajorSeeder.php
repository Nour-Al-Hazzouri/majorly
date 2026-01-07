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
                'occupations' => ['15-1252.00', '15-1211.00'],
                'ideal_interests' => [
                    'technical_work' => 5,
                    'data_analysis' => 4,
                    'mathematical_puzzles' => 5,
                    'scientific_research' => 3
                ],
                'ideal_strengths' => [
                    'analytical_thinking' => 5,
                    'technical_aptitude' => 5,
                    'detail_orientation' => 4,
                    'creative_problem_solving' => 4
                ]
            ],
            [
                'name' => 'Nursing',
                'slug' => 'nursing',
                'category' => 'Healthcare',
                'description' => 'The protection, promotion, and optimization of health and abilities.',
                'skills' => ['Patient Care', 'Anatomy', 'Biology', 'Communication'],
                'occupations' => ['29-1141.00', '11-9111.00'],
                'ideal_interests' => [
                    'social_service' => 5,
                    'scientific_research' => 4,
                    'community_organizing' => 3
                ],
                'ideal_strengths' => [
                    'communication' => 5,
                    'adaptability' => 5,
                    'detail_orientation' => 4,
                    'leadership' => 3
                ]
            ],
            [
                'name' => 'Business Administration',
                'slug' => 'business-administration',
                'category' => 'Business',
                'description' => 'The administration of a commercial enterprise.',
                'skills' => ['Project Management', 'Accounting', 'Marketing Strategy', 'Communication'],
                'occupations' => ['13-2011.00', '11-9111.00'],
                'ideal_interests' => [
                    'business_management' => 5,
                    'community_organizing' => 4,
                    'writing_copy' => 3
                ],
                'ideal_strengths' => [
                    'leadership' => 5,
                    'communication' => 4,
                    'analytical_thinking' => 4,
                    'adaptability' => 3
                ]
            ],
            [
                'name' => 'Graphic Design',
                'slug' => 'graphic-design',
                'category' => 'Arts',
                'description' => 'The art and practice of planning and projecting ideas and experiences with visual and textual content.',
                'skills' => ['Graphic Design', 'Adobe Creative Suite', 'Communication'],
                'occupations' => ['27-1024.00'],
                'ideal_interests' => [
                    'artistic_expression' => 5,
                    'technical_work' => 3,
                    'writing_copy' => 4
                ],
                'ideal_strengths' => [
                    'creative_problem_solving' => 5,
                    'detail_orientation' => 4,
                    'adaptability' => 4,
                    'communication' => 3
                ]
            ],
            [
                'name' => 'Education',
                'slug' => 'education',
                'category' => 'Education',
                'description' => 'The process of facilitating learning, or the acquisition of knowledge, skills, values, beliefs, and habits.',
                'skills' => ['Teaching', 'Curriculum Development', 'Communication'],
                'occupations' => ['25-2021.00'],
                'ideal_interests' => [
                    'social_service' => 5,
                    'community_organizing' => 4,
                    'writing_copy' => 3
                ],
                'ideal_strengths' => [
                    'communication' => 5,
                    'leadership' => 4,
                    'adaptability' => 4,
                    'creative_problem_solving' => 3
                ]
            ],
             [
                'name' => 'Data Science',
                'slug' => 'data-science',
                'category' => 'Technology',
                'description' => 'Extracting knowledge and insights from noisy, structured and unstructured data.',
                'skills' => ['Data Analysis', 'Python (Programming Language)', 'Statistics', 'Machine Learning'],
                'occupations' => ['15-2031.00', '15-1211.00'],
                'ideal_interests' => [
                    'data_analysis' => 5,
                    'mathematical_puzzles' => 5,
                    'scientific_research' => 4,
                    'technical_work' => 3
                ],
                'ideal_strengths' => [
                    'analytical_thinking' => 5,
                    'detail_orientation' => 5,
                    'technical_aptitude' => 4,
                    'creative_problem_solving' => 3
                ]
            ],
            [
                'name' => 'Engineering',
                'slug' => 'engineering',
                'category' => 'Engineering',
                'description' => 'The branch of science and technology concerned with the design, building, and use of engines, machines, and structures.',
                'skills' => ['Mathematics', 'Physics', 'Engineering Design', 'Problem Solving'],
                'occupations' => ['17-2141.00', '17-2071.00'],
                'ideal_interests' => [
                    'technical_work' => 5,
                    'mathematical_puzzles' => 5,
                    'scientific_research' => 4
                ],
                'ideal_strengths' => [
                    'analytical_thinking' => 5,
                    'technical_aptitude' => 5,
                    'creative_problem_solving' => 4,
                    'detail_orientation' => 4
                ]
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
