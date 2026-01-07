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
}
