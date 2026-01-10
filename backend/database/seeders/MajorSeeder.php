<?php

namespace Database\Seeders;

use App\Models\Major;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

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
                'category' => 'Technology',
                'description' => 'The study of computers and computational systems. It involves the theory, design, development, and application of software and software systems.',
                'ideal_interests' => ['Computers', 'Programming', 'Logic', 'Problem Solving'],
                'ideal_strengths' => ['Analytical Thinking', 'Attention to Detail', 'Innovation'],
                'cip_code' => '110701',
            ],
            [
                'name' => 'Psychology',
                'category' => 'Social Sciences',
                'description' => 'The scientific study of the human mind and its functions, especially those affecting behavior in a given context.',
                'ideal_interests' => ['Helping People', 'Understanding Behavior', 'Research'],
                'ideal_strengths' => ['Empathy', 'Active Listening', 'Critical Thinking'],
                'cip_code' => '420101',
            ],
            [
                'name' => 'Nursing',
                'category' => 'Healthcare',
                'description' => 'A profession within the health care sector focused on the care of individuals, families, and communities so they may attain, maintain, or recover optimal health.',
                'ideal_interests' => ['Healthcare', 'Patient Care', 'Biology'],
                'ideal_strengths' => ['Compassion', 'Resilience', 'Communication'],
                'cip_code' => '513801',
            ],
            [
                'name' => 'Business Administration',
                'category' => 'Business',
                'description' => 'The administration of a commercial enterprise. It includes all aspects of overseeing and supervising business operations.',
                'ideal_interests' => ['Leadership', 'Finance', 'Management'],
                'ideal_strengths' => ['Leadership', 'Strategic Planning', 'Decision Making'],
                'cip_code' => '520201',
            ],
            [
                'name' => 'Mechanical Engineering',
                'category' => 'Engineering',
                'description' => 'The branch of engineering dealing with the design, construction, and use of machines.',
                'ideal_interests' => ['Machines', 'Design', 'Physics'],
                'ideal_strengths' => ['Problem Solving', 'Mathematics', 'Creativity'],
                'cip_code' => '141901',
            ],
            [
                'name' => 'Biology',
                'category' => 'Science',
                'description' => 'The study of life and living organisms, including their structure, function, growth, evolution, distribution, and taxonomy.',
                'ideal_interests' => ['Nature', 'Research', 'Lab Work'],
                'ideal_strengths' => ['Observation', 'Analysis', 'Patience'],
                'cip_code' => '260101',
            ],
        ];

        foreach ($majors as $majorData) {
            $major = Major::firstOrCreate(
                ['name' => $majorData['name']],
                array_merge($majorData, ['slug' => Str::slug($majorData['name'])])
            );

            // Connect relevant occupations (Basic matching for demo purposes)
            $keywords = [];
            switch ($majorData['name']) {
                case 'Computer Science':
                    $keywords = ['Software', 'Computer', 'Programmer', 'Web'];
                    break;
                case 'Psychology':
                    $keywords = ['Psychologist', 'Counseling', 'Mental'];
                    break;
                case 'Nursing':
                    $keywords = ['Nurse', 'Nursing'];
                    break;
                case 'Business Administration':
                    $keywords = ['Manager', 'Executive', 'Business', 'Marketing'];
                    break;
                case 'Mechanical Engineering':
                    $keywords = ['Mechanical', 'Engineer'];
                    break;
                case 'Biology':
                    $keywords = ['Biologist', 'Biological'];
                    break;
            }

            if (!empty($keywords)) {
                $occupationIds = \App\Models\Occupation::where(function($query) use ($keywords) {
                    foreach ($keywords as $keyword) {
                        $query->orWhere('name', 'LIKE', "%{$keyword}%");
                    }
                })->limit(5)->pluck('id');
                
                $major->occupations()->syncWithoutDetaching($occupationIds);
            }
        }
    }
}
