<?php

namespace App\Services;

use App\Models\Assessment;
use App\Models\AssessmentResult;
use App\Models\Major;
use App\Models\Specialization;
use Illuminate\Support\Collection;

class MatchingService
{
    /**
     * Calculate and save recommendations for a given assessment.
     *
     * @param Assessment $assessment
     * @return Collection
     */
    public function generateRecommendations(Assessment $assessment): Collection
    {
        $responses = $assessment->responses()->pluck('response_value', 'question_id');
        $majors = Major::with(['skills', 'occupations.onetSkills'])->get();

        $results = $majors->map(function (Major $major) use ($responses) {
            $skillScore = $this->calculateVectorSkillScore($major, $responses);
            $interestScore = $this->calculateRatingScore($major->ideal_interests ?? [], $responses['interests'] ?? []);
            $strengthScore = $this->calculateRatingScore($major->ideal_strengths ?? [], $responses['strengths_weaknesses'] ?? []);

            // Add microscopic entropy for sub-score uniqueness (deterministic based on major ID)
            $subEntropy = ($major->id % 1000) * 0.00001;
            $skillScore = round($skillScore + $subEntropy, 4);
            $interestScore = round($interestScore + $subEntropy, 4);
            $strengthScore = round($strengthScore + $subEntropy, 4);

            // Weighting: 60% Skills (Vector Mapping), 25% Interests, 15% Strengths
            $matchPercentage = ($skillScore * 0.6) + ($interestScore * 0.25) + ($strengthScore * 0.15);

            return [
                'major_id' => $major->id,
                'major' => $major,
                'match_percentage' => round($matchPercentage, 2),
                'scores' => [
                    'skills' => $skillScore,
                    'interests' => $interestScore,
                    'strengths' => $strengthScore,
                ],
                'reasoning' => $this->generateReasoning($major, $skillScore, $interestScore, $strengthScore)
            ];
        });

        // Rank, ensure unique percentages, and save top 7
        $rankedResults = $this->ensureUniquePercentages($results->sortByDesc('match_percentage')->values())->take(7);

        $assessment->results()->delete();

        foreach ($rankedResults as $index => $data) {
            AssessmentResult::create([
                'assessment_id' => $assessment->id,
                'major_id' => $data['major_id'],
                'match_percentage' => $data['match_percentage'],
                'rank' => $index + 1,
                'reasoning' => $data['reasoning'],
            ]);
        }

        return $rankedResults;
    }

    /**
     * Calculate skill score using Vector Similarity between User Profile and Major Profile.
     */
    private function calculateVectorSkillScore(Major $major, Collection $responses): float
    {
        $userSkillsCurrent = collect($responses['skills_current'] ?? []);
        $userSkillsAspiration = collect($responses['skills_aspiration'] ?? []);
        
        $userSkills = $userSkillsCurrent->merge($userSkillsAspiration)
            ->map(fn($skill) => is_array($skill) ? ($skill['name'] ?? '') : (is_object($skill) ? ($skill->name ?? '') : $skill))
            ->unique()
            ->filter();

        if ($userSkills->isEmpty()) return 0;

        // 1. Build User Vector (35 dimensions)
        $userVector = $this->buildUserVector($userSkills);

        // 2. Build Major Vector (average of linked occupations)
        $majorVector = $this->getMajorRequirementVector($major);

        // 3. Calculate Cosine Similarity
        return $this->calculateCosineSimilarity($userVector, $majorVector) * 100;
    }

    private function buildUserVector(Collection $skillNames): array
    {
        $vector = array_fill_keys($this->getOnetSkillCategories(), 0.0);

        // Mapping rules for Lightcast skills to O*NET categories
        $mapping = [
            'Programming' => ['programming', 'coding', 'software', 'developer', 'python', 'java', 'script', 'html', 'css', 'sql', 'php'],
            'Mathematics' => ['math', 'statistics', 'calculus', 'algebra', 'quantitative', 'analytics', 'data science'],
            'Critical Thinking' => ['critical thinking', 'problem solving', 'analysis', 'logic'],
            'Reading Comprehension' => ['reading', 'research', 'literacy'],
            'Writing' => ['writing', 'documentation', 'editing', 'content'],
            'Speaking' => ['speaking', 'presentation', 'communication', 'public speaking'],
            'Active Listening' => ['listening', 'empathy', 'interpersonal'],
            'Science' => ['science', 'biology', 'chemistry', 'physics', 'laboratory', 'medicine'],
            'Technology Design' => ['design', 'ui', 'ux', 'architecture', 'prototyping', 'creative'],
            'Judgment and Decision Making' => ['judgment', 'decision making', 'prioritization', 'management'],
            'Systems Analysis' => ['systems analysis', 'engineering', 'it systems', 'cloud architecture'],
            'Coordination' => ['coordination', 'teamwork', 'collaboration', 'project management'],
            'Social Perceptiveness' => ['social', 'psychology', 'human behavior', 'counseling'],
            'Repairing' => ['repair', 'technician', 'maintenance', 'mechanical'],
            'Equipment Selection' => ['equipment', 'procurement', 'hardware'],
        ];

        foreach ($skillNames as $skill) {
            $skillLower = strtolower($skill);
            foreach ($mapping as $onetCategory => $keywords) {
                foreach ($keywords as $keyword) {
                    if (str_contains($skillLower, $keyword)) {
                        // Scoring: If a user has a matching skill, we bump that O*NET category.
                        // For a more advanced version, we could weight the bump.
                        $vector[$onetCategory] = min(5.0, $vector[$onetCategory] + 2.5);
                        break;
                    }
                }
            }
        }

        return $vector;
    }

    private function getMajorRequirementVector(Major $major): array
    {
        $categories = $this->getOnetSkillCategories();
        $vector = array_fill_keys($categories, 0.0);
        $occupations = $major->occupations;

        if ($occupations->isEmpty()) return $vector;

        foreach ($categories as $category) {
            $totalScore = 0;
            $count = 0;

            foreach ($occupations as $occ) {
                $skill = $occ->onetSkills->where('name', $category)->first();
                if ($skill) {
                    // Score = Importance * Level (normalized to 0-5 scale)
                    // Importance is usually 1-5, Level is 1-7 in O*NET raw data.
                    // But in our import, they are raw numbers.
                    $totalScore += ($skill->importance * $skill->level) / 7;
                    $count++;
                }
            }
            $vector[$category] = $count > 0 ? ($totalScore / $count) : 0.0;
        }

        return $vector;
    }

    private function calculateCosineSimilarity(array $vecA, array $vecB): float
    {
        $dotProduct = 0;
        $normA = 0;
        $normB = 0;

        foreach ($vecA as $key => $valA) {
            $valB = $vecB[$key] ?? 0;
            $dotProduct += $valA * $valB;
            $normA += $valA * $valA;
            $normB += $valB * $valB;
        }

        $norm = sqrt($normA) * sqrt($normB);
        return $norm == 0 ? 0 : ($dotProduct / $norm);
    }

    private function getOnetSkillCategories(): array
    {
        return [
            "Critical Thinking", "Operations Analysis", "Social Perceptiveness", "Persuasion", 
            "Active Listening", "Troubleshooting", "Time Management", "Learning Strategies", 
            "Systems Evaluation", "Operation and Control", "Negotiation", "Equipment Maintenance", 
            "Repairing", "Equipment Selection", "Systems Analysis", "Coordination", 
            "Active Learning", "Management of Financial Resources", "Programming", 
            "Management of Personnel Resources", "Complex Problem Solving", "Operations Monitoring", 
            "Speaking", "Management of Material Resources", "Monitoring", "Writing", 
            "Quality Control Analysis", "Science", "Installation", "Technology Design", 
            "Instructing", "Mathematics", "Reading Comprehension", "Service Orientation", 
            "Judgment and Decision Making"
        ];
    }

    /**
     * Calculate and save specialization recommendations for a deep dive assessment.
     */
    public function generateSpecializationRecommendations(Assessment $assessment, Major $major): Collection
    {
        $responses = $assessment->responses()->pluck('response_value', 'question_id');
        
        $userSkillsCurrent = collect($responses['skills_current'] ?? []);
        $userSkillsAspiration = collect($responses['skills_aspiration'] ?? []);
        $userSkills = $userSkillsCurrent->merge($userSkillsAspiration)
            ->map(fn($skill) => is_array($skill) ? ($skill['name'] ?? '') : (is_object($skill) ? ($skill->name ?? '') : $skill))
            ->unique()
            ->filter();

        // Build user vector once
        $userVector = $this->buildUserVector($userSkills);

        $results = collect();
        $occupations = $major->occupations()->with('onetSkills')->get();

        foreach ($occupations as $occupation) {
            // Occupation profile vector
            $occVector = array_fill_keys($this->getOnetSkillCategories(), 0.0);
            foreach ($occupation->onetSkills as $skill) {
                $occVector[$skill->name] = ($skill->importance * $skill->level) / 7;
            }

            $skillMatch = $this->calculateCosineSimilarity($userVector, $occVector) * 100;

            // Factor in direct occupation ratings if they exist from the deep dive
            $finalMatch = $skillMatch;
            if (isset($responses["occupation_{$occupation->id}"])) {
                $directRating = $responses["occupation_{$occupation->id}"];
                $directScore = (($directRating - 1) / 4) * 100;
                // 60% skill vector match, 40% direct preference
                $finalMatch = ($skillMatch * 0.6) + ($directScore * 0.4);
            }

            $results->push([
                'occupation_id' => $occupation->id,
                'occupation' => $occupation,
                'match_percentage' => $finalMatch,
            ]);
        }

        // Rank and ensure unique percentages
        $finalResults = $this->ensureUniquePercentages($results->sortByDesc('match_percentage')->values());

        // Save results
        $assessment->results()->delete();

        foreach ($finalResults->take(15) as $index => $data) {
            AssessmentResult::create([
                'assessment_id' => $assessment->id,
                'major_id' => $major->id,
                'occupation_id' => $data['occupation_id'],
                'match_percentage' => $data['match_percentage'],
                'rank' => $index + 1,
                'reasoning' => [], 
            ]);
        }
        
        return $finalResults->take(15);
    }

    /**
     * Ensure all percentages in the collection are unique by subtracting small deltas from duplicates.
     */
    private function ensureUniquePercentages(Collection $results): Collection
    {
        $seenPercentages = [];
        $delta = 0.1;

        return $results->map(function ($item) use (&$seenPercentages, $delta) {
            $percentage = round($item['match_percentage'], 1);
            
            while (in_array($percentage, $seenPercentages)) {
                $percentage = round($percentage - $delta, 1);
            }
            
            $percentage = max(1, min(100, $percentage));
            $seenPercentages[] = $percentage;
            $item['match_percentage'] = $percentage;
            
            return $item;
        });
    }

    /**
     * Calculate rating score (Interests or Strengths) using Inverse Normalized Distance.
     */
    private function calculateRatingScore($idealProfile, $userRatings): float
    {
        if (is_string($idealProfile)) {
            $idealProfile = json_decode($idealProfile, true);
        }

        if (empty($idealProfile) || empty($userRatings)) {
            return 20.0;
        }

        $totalDiff = 0;
        $count = 0;

        foreach ($idealProfile as $traitId => $idealValue) {
            if (isset($userRatings[$traitId])) {
                $diff = abs($idealValue - $userRatings[$traitId]);
                $totalDiff += (4 - $diff) / 4;
                $count++;
            }
        }

        return $count === 0 ? 0 : ($totalDiff / $count) * 100;
    }

    private function generateReasoning(Major $major, float $skills, float $interests, float $strengths): array
    {
        $reasons = [];

        if ($skills >= 80) {
            $reasons[] = "Strong alignment with your core technical and cognitive abilities.";
        } elseif ($skills >= 50) {
            $reasons[] = "Matches many of your demonstrated skills.";
        }

        if ($interests >= 80) {
            $reasons[] = "Highly aligns with your academic interests.";
        }

        if ($strengths >= 80) {
            $reasons[] = "Greatly suits your personal strengths.";
        }

        return $reasons;
    }
}
