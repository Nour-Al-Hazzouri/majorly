<?php

namespace App\Services;

class QuestionService
{
    /**
     * Get the Tier 1 assessment questions and structure.
     *
     * @return array
     */
    public function getTier1Questions(): array
    {
        return [
            [
                'id' => 'skills_current',
                'title' => 'Current Skills',
                'description' => 'What skills do you currently possess? Select at least 3.',
                'type' => 'skills_search',
                'required' => true,
                'min_selections' => 3,
            ],
            [
                'id' => 'skills_aspiration',
                'title' => 'Skills to Learn',
                'description' => 'Which skills are you interested in learning or developing?',
                'type' => 'skills_search',
                'required' => true,
                'min_selections' => 1,
            ],
            [
                'id' => 'strengths_weaknesses',
                'title' => 'Strengths & Weaknesses',
                'description' => 'Rate yourself on the following attributes (1 = Weak, 5 = Strong).',
                'type' => 'rating_scale',
                'required' => true,
                'questions' => [
                    ['id' => 'analytical_thinking', 'text' => 'Analytical Thinking'],
                    ['id' => 'creative_problem_solving', 'text' => 'Creative Problem Solving'],
                    ['id' => 'communication', 'text' => 'Communication & Interpersonal Skills'],
                    ['id' => 'leadership', 'text' => 'Leadership & Influence'],
                    ['id' => 'technical_aptitude', 'text' => 'Technical Aptitude'],
                    ['id' => 'detail_orientation', 'text' => 'Attention to Detail'],
                    ['id' => 'adaptability', 'text' => 'Adaptability & Flexibility'],
                ],
            ],
            [
                'id' => 'interests',
                'title' => 'Interest Profiler',
                'description' => 'How much would you enjoy doing these activities? (1 = Dislike, 5 = Enjoy)',
                'type' => 'rating_scale',
                'required' => true,
                'questions' => [
                    ['id' => 'scientific_research', 'text' => 'Conducting scientific experiments or research'],
                    ['id' => 'artistic_expression', 'text' => 'Creating art, music, or writing'],
                    ['id' => 'social_service', 'text' => 'Helping or teaching others'],
                    ['id' => 'business_management', 'text' => 'Managing people or projects in a business setting'],
                    ['id' => 'technical_work', 'text' => 'Working with machinery, computers, or tools'],
                    ['id' => 'data_analysis', 'text' => 'Analyzing data and finding patterns'],
                    ['id' => 'community_organizing', 'text' => 'Organizing community events or initiatives'],
                    ['id' => 'outdoor_activity', 'text' => 'Working outdoors or with physical environment'],
                    ['id' => 'mathematical_puzzles', 'text' => 'Solving complex mathematical or logical puzzles'],
                    ['id' => 'writing_copy', 'text' => 'Writing articles, blogs, or marketing content'],
                ],
            ],
        ];
    }

    /**
     * Get deep dive questions for a specific major.
     *
     * @param \App\Models\Major $major
     * @return array
     */
    public function getDeepDiveQuestions(\App\Models\Major $major): array
    {
        $category = $major->category;

        $questions = [
            'Technology' => [
                ['id' => 'cybersecurity', 'text' => 'I am interested in how hackers think and how to stop them.'],
                ['id' => 'web_dev', 'text' => 'I enjoy creating visually appealing and interactive websites.'],
                ['id' => 'ai_ml', 'text' => 'I like working with large datasets to find patterns and predictions.'],
                ['id' => 'software_eng', 'text' => 'I prefer building robust, scalable backend systems and architectures.'],
                ['id' => 'performance', 'text' => 'I enjoy optimizing code for performance and efficiency.'],
            ],
            'Business' => [
                ['id' => 'finance', 'text' => 'I am fascinated by stock markets and investment strategies.'],
                ['id' => 'marketing', 'text' => 'I enjoy analyzing consumer behavior and creating ad campaigns.'],
                ['id' => 'management', 'text' => 'I like leading teams and organizing complex projects.'],
                ['id' => 'accounting', 'text' => 'I have an eye for detail and enjoy working with financial records.'],
                ['id' => 'strategy', 'text' => 'I prefer strategic planning over daily operational tasks.'],
            ],
            'Healthcare' => [
                ['id' => 'nursing_pref', 'text' => 'I want to work directly with patients in a fast-paced hospital setting.'],
                ['id' => 'public_health', 'text' => 'I am interested in tracking disease outbreaks and community health.'],
                ['id' => 'admin', 'text' => 'I prefer the organizational side of hospitals and clinics.'],
                ['id' => 'research', 'text' => 'I enjoy working in a lab setting and discovering new treatments.'],
                ['id' => 'emergency', 'text' => 'I am comfortable handling medical emergencies and high-pressure situations.'],
            ],
            'Engineering' => [
                ['id' => 'mechanical', 'text' => 'I am interested in how engines and physical machines work.'],
                ['id' => 'electrical', 'text' => 'I like designing circuits and working with electronics.'],
                ['id' => 'civil', 'text' => 'I want to design and build large-scale infrastructure like bridges.'],
                ['id' => 'chemical', 'text' => 'I am fascinated by chemical reactions and material science.'],
                ['id' => 'cad', 'text' => 'I enjoy using Computer-Aided Design (CAD) software.'],
            ],
            'Arts' => [
                ['id' => 'digital', 'text' => 'I prefer creating art using digital tools and software.'],
                ['id' => 'fine_arts', 'text' => 'I enjoy traditional mediums like painting, sculpting, or drawing.'],
                ['id' => 'architecture', 'text' => 'I am interested in the intersection of art and structural design.'],
                ['id' => 'fashion', 'text' => 'I like designing clothing and following fashion trends.'],
                ['id' => '3d_modelling', 'text' => 'I enjoy conceptualizing and creating 3D models.'],
            ],
        ];

        $specificQuestions = $questions[$category] ?? [];

        if (empty($specificQuestions)) {
            return [];
        }

        return [
            [
                'id' => 'interests',
                'title' => $major->name . ' Deep Dive',
                'description' => 'How much do you agree with the following statements? (1 = Strong Disagree, 5 = Strong Agree)',
                'type' => 'rating_scale',
                'required' => true,
                'questions' => $specificQuestions,
            ],
            [
                'id' => 'strengths_weaknesses',
                'title' => 'Specialized Strengths',
                'description' => 'Rate your level of comfort with these specific activities.',
                'type' => 'rating_scale',
                'required' => true,
                'questions' => [
                    ['id' => 'technical_depth', 'text' => 'Diving deep into complex technical details'],
                    ['id' => 'creative_execution', 'text' => 'Executing creative ideas from concept to reality'],
                    ['id' => 'system_thinking', 'text' => 'Understanding how different parts of a system interact'],
                    ['id' => 'empathy', 'text' => 'Understanding and sharing the feelings of others'],
                ],
            ],
        ];
    }
}
