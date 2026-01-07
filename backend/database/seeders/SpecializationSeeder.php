<?php

namespace Database\Seeders;

use App\Models\Major;
use App\Models\Occupation;
use App\Models\Specialization;
use Illuminate\Database\Seeder;

class SpecializationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $specializations = [
            'computer-science' => [
                [
                    'name' => 'Software Engineering',
                    'slug' => 'cs-software-engineering',
                    'description' => 'Focus on building robust, scalable applications and systems.',
                    'ideal_interests' => ['software_eng' => 5, 'performance' => 4, 'web_dev' => 3],
                    'ideal_strengths' => ['technical_depth' => 5, 'system_thinking' => 5],
                    'occupations' => ['15-1252.00']
                ],
                [
                    'name' => 'Cybersecurity',
                    'slug' => 'cs-cybersecurity',
                    'description' => 'Specialization in protecting systems, networks, and programs from digital attacks.',
                    'ideal_interests' => ['cybersecurity' => 5, 'performance' => 3],
                    'ideal_strengths' => ['technical_depth' => 5, 'system_thinking' => 4],
                    'occupations' => ['15-1212.00']
                ],
                [
                    'name' => 'AI & Machine Learning',
                    'slug' => 'cs-ai-ml',
                    'description' => 'Focus on creating systems that can learn and make decisions from data.',
                    'ideal_interests' => ['ai_ml' => 5, 'performance' => 4],
                    'ideal_strengths' => ['technical_depth' => 5, 'system_thinking' => 4],
                    'occupations' => ['15-1221.00']
                ],
                [
                    'name' => 'Web Development',
                    'slug' => 'cs-web-development',
                    'description' => 'Focus on creating websites and web applications.',
                    'ideal_interests' => ['web_dev' => 5, 'digital' => 3],
                    'ideal_strengths' => ['creative_execution' => 5, 'system_thinking' => 4],
                    'occupations' => ['15-1254.00']
                ],
            ],
            'business-administration' => [
                [
                    'name' => 'Finance',
                    'slug' => 'biz-finance',
                    'description' => 'Focus on investment, banking, and financial management.',
                    'ideal_interests' => ['finance' => 5, 'accounting' => 4, 'strategy' => 3],
                    'ideal_strengths' => ['technical_depth' => 4, 'system_thinking' => 4],
                    'occupations' => ['13-2051.00']
                ],
                [
                    'name' => 'Marketing',
                    'slug' => 'biz-marketing',
                    'description' => 'Focus on advertising, consumer behavior, and brand management.',
                    'ideal_interests' => ['marketing' => 5, 'strategy' => 4, 'digital' => 3],
                    'ideal_strengths' => ['creative_execution' => 5, 'empathy' => 4],
                    'occupations' => ['11-2021.00']
                ],
                [
                    'name' => 'Management',
                    'slug' => 'biz-management',
                    'description' => 'Focus on leading teams and managing organizational operations.',
                    'ideal_interests' => ['management' => 5, 'strategy' => 5, 'finance' => 3],
                    'ideal_strengths' => ['system_thinking' => 5, 'empathy' => 5],
                    'occupations' => ['11-1021.00']
                ],
                [
                    'name' => 'Accounting',
                    'slug' => 'biz-accounting',
                    'description' => 'Focus on financial record-keeping and auditing.',
                    'ideal_interests' => ['accounting' => 5, 'finance' => 3],
                    'ideal_strengths' => ['technical_depth' => 5, 'system_thinking' => 4],
                    'occupations' => ['13-2011.00']
                ],
            ],
            'nursing' => [
                [
                    'name' => 'Clinical Nursing',
                    'slug' => 'health-clinical-nursing',
                    'description' => 'Direct patient care in hospital or clinic settings.',
                    'ideal_interests' => ['nursing_pref' => 5, 'emergency' => 5],
                    'ideal_strengths' => ['empathy' => 5, 'technical_depth' => 4],
                    'occupations' => ['29-1141.00']
                ],
                [
                    'name' => 'Public Health',
                    'slug' => 'health-public-health',
                    'description' => 'Focus on community health and disease prevention.',
                    'ideal_interests' => ['public_health' => 5, 'research' => 4],
                    'ideal_strengths' => ['empathy' => 5, 'system_thinking' => 5],
                    'occupations' => ['21-1091.00']
                ],
                [
                    'name' => 'Healthcare Administration',
                    'slug' => 'health-admin',
                    'description' => 'Managing the operations of healthcare facilities.',
                    'ideal_interests' => ['admin' => 5, 'management' => 4],
                    'ideal_strengths' => ['system_thinking' => 5, 'empathy' => 4],
                    'occupations' => ['11-9111.00']
                ],
            ],
            'engineering' => [
                [
                    'name' => 'Mechanical Engineering',
                    'slug' => 'eng-mechanical',
                    'description' => 'Focus on physical machines and mechanical systems.',
                    'ideal_interests' => ['mechanical' => 5, 'cad' => 4],
                    'ideal_strengths' => ['system_thinking' => 5, 'technical_depth' => 5],
                    'occupations' => ['17-2141.00']
                ],
                [
                    'name' => 'Electrical Engineering',
                    'slug' => 'eng-electrical',
                    'description' => 'Focus on electronics, circuits, and power systems.',
                    'ideal_interests' => ['electrical' => 5, 'cad' => 3],
                    'ideal_strengths' => ['technical_depth' => 5, 'system_thinking' => 5],
                    'occupations' => ['17-2071.00']
                ],
                [
                    'name' => 'Civil Engineering',
                    'slug' => 'eng-civil',
                    'description' => 'Focus on infrastructure like bridges, roads, and buildings.',
                    'ideal_interests' => ['civil' => 5, 'cad' => 5],
                    'ideal_strengths' => ['system_thinking' => 5, 'technical_depth' => 4],
                    'occupations' => ['17-2051.00']
                ],
            ],
            'graphic-design' => [
                [
                    'name' => 'Digital Arts',
                    'slug' => 'arts-digital',
                    'description' => 'Creating art using digital tools for various media.',
                    'ideal_interests' => ['digital' => 5, '3d_modelling' => 4, 'web_dev' => 3],
                    'ideal_strengths' => ['creative_execution' => 5, 'technical_depth' => 4],
                    'occupations' => ['27-1014.00']
                ],
                [
                    'name' => 'Architecture',
                    'slug' => 'arts-architecture',
                    'description' => 'Designing and planning buildings and structures.',
                    'ideal_interests' => ['architecture' => 5, 'cad' => 5, '3d_modelling' => 4],
                    'ideal_strengths' => ['system_thinking' => 5, 'creative_execution' => 5],
                    'occupations' => ['17-1011.00']
                ],
            ],
        ];

        foreach ($specializations as $majorSlug => $items) {
            $major = Major::where('slug', $majorSlug)->first();
            if (!$major) continue;

            foreach ($items as $item) {
                $specialization = Specialization::updateOrCreate(
                    ['slug' => $item['slug']],
                    [
                        'major_id' => $major->id,
                        'name' => $item['name'],
                        'description' => $item['description'],
                        'ideal_interests' => $item['ideal_interests'],
                        'ideal_strengths' => $item['ideal_strengths'],
                    ]
                );

                if (isset($item['occupations'])) {
                    $occupationIds = Occupation::whereIn('code', $item['occupations'])->pluck('id');
                    $specialization->occupations()->sync($occupationIds);
                }
            }
        }
    }
}
