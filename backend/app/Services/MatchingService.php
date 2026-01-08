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
        $majors = Major::with('skills')->get();

        $results = $majors->map(function (Major $major) use ($responses) {
            $skillScore = $this->calculateSkillScore($major, $responses);
            $interestScore = $this->calculateRatingScore($major->ideal_interests ?? [], $responses['interests'] ?? []);
            $strengthScore = $this->calculateRatingScore($major->ideal_strengths ?? [], $responses['strengths_weaknesses'] ?? []);

            // Weighting: 50% Skills, 30% Interests, 20% Strengths
            $matchPercentage = ($skillScore * 0.5) + ($interestScore * 0.3) + ($strengthScore * 0.2);

            // Tie-breaker: Add a tiny bit of deterministic variance based on ID (to avoid exactly 20% for everyone if scores are flat)
            // This ensures we always have a clear ranking.
            $matchPercentage += ($major->id % 100) / 10000;

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

        // Rank and save top 7
        $rankedResults = $results->sortByDesc('match_percentage')->values()->take(7);

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
     * Calculate and save specialization recommendations for a deep dive assessment.
     *
     * @param Assessment $assessment
     * @param Major $major
     * @return Collection
     */
    public function generateSpecializationRecommendations(Assessment $assessment, Major $major): Collection
    {
        $responses = $assessment->responses()->pluck('response_value', 'question_id');
        
        $behavioralRatings = [];
        $occupationRatings = [];

        // Parse responses into behavioral (baseline) and occupation-specific
        foreach ($responses as $questionId => $rating) {
            if (str_starts_with($questionId, 'occupation_')) {
                $occupationId = str_replace('occupation_', '', $questionId);
                $occupationRatings[$occupationId] = $rating;
            } elseif (is_numeric($rating)) {
                // Curated behavioral IDs: st1, bu1, he1, etc.
                // We only include simple numeric ratings for the baseline
                $behavioralRatings[] = $rating;
            }
        }

        // Calculate baseline score from behavioral questions (0-100)
        $baselineScore = 20.0; // Default baseline
        if (count($behavioralRatings) > 0) {
            $averageRating = array_sum($behavioralRatings) / count($behavioralRatings);
            // 1 = 0%, 5 = 100%
            $baselineScore = (($averageRating - 1) / 4) * 100;
        }

        $results = collect();
        $occupations = $major->occupations;

        foreach ($occupations as $occupation) {
            $matchPercentage = $baselineScore;

            // If we have a specific rating for this occupation, use it to fine-tune
            // Let the direct rating have 70% weight if present, baseline 30%
            if (isset($occupationRatings[$occupation->id])) {
                $directRating = $occupationRatings[$occupation->id];
                $directScore = (($directRating - 1) / 4) * 100;
                $matchPercentage = ($directScore * 0.7) + ($baselineScore * 0.3);
            }

            // Differentiate based on occupation "data weight" to prevent ties
            $taskCount = is_array($occupation->tasks) ? count($occupation->tasks) : 0;
            $dataFit = min(3, $taskCount / 10); // Max 3% boost for roles with more task data
            $matchPercentage += $dataFit;

            // Add a visible deterministic spread based on ID (0.1% to 1.5%)
            $matchPercentage += ($occupation->id % 15) / 10;

            $results->push([
                'occupation_id' => $occupation->id,
                'occupation' => $occupation,
                'specialization_id' => null,
                'specialization' => null,
                'match_percentage' => $matchPercentage,
                'scores' => [
                    'behavioral' => $baselineScore,
                    'specific' => isset($occupationRatings[$occupation->id]) ? ($directScore ?? 0) : 0,
                ]
            ]);
        }

        $rankedResults = $results->sortByDesc('match_percentage')->values();

        // Enforce stratification: only first 2 can have same value, others must decay
        $finalResults = collect();
        $lastScore = null;
        
        foreach ($rankedResults as $index => $data) {
            $currentScore = round($data['match_percentage'], 2);
            
            if ($index > 1 && $lastScore !== null) {
                // Ensure strictly decreasing after top 2
                if ($currentScore >= $lastScore) {
                    $currentScore = $lastScore - 1.5; // Decisive 1.5% drop
                }
            }
            
            $data['match_percentage'] = max(5, min(100, $currentScore));
            $finalResults->push($data);
            $lastScore = $currentScore;
        }

        // Save results
        $assessment->results()->delete();

        foreach ($finalResults->take(15) as $index => $data) {
            AssessmentResult::create([
                'assessment_id' => $assessment->id,
                'major_id' => $major->id,
                'occupation_id' => $data['occupation_id'],
                'specialization_id' => null,
                'match_percentage' => $data['match_percentage'],
                'rank' => $index + 1,
                'reasoning' => [], 
            ]);
        }
        
        return $finalResults->take(15);
    }

    private function calculateSkillScore(Major $major, Collection $responses): float
    {
        $userSkillsCurrent = collect($responses['skills_current'] ?? []);
        $userSkillsAspiration = collect($responses['skills_aspiration'] ?? []);

        // Ensure we only have IDs even if the frontend sends objects
        $userSkills = $userSkillsCurrent->merge($userSkillsAspiration)
            ->map(fn($skill) => is_array($skill) ? ($skill['id'] ?? $skill) : (is_object($skill) ? ($skill->id ?? $skill) : $skill))
            ->unique();

        if ($userSkills->isEmpty()) {
            return 0;
        }

        $majorSkills = $major->skills->pluck('id');
        if ($majorSkills->isEmpty()) {
            return 0;
        }

        $intersection = $userSkills->intersect($majorSkills);
        
        // Match percentage = (Matching Skills / Total Major Skills) * 100
        return ($intersection->count() / $majorSkills->count()) * 100;
    }

    /**
     * Calculate rating score (Interests or Strengths) using Inverse Normalized Distance.
     *
     * @param array $idealProfile
     * @param array $userRatings
     * @return float (0-100)
     */
    /**
     * @param array|string $idealProfile
     * @param array $userRatings
     * @return float (0-100)
     */
    private function calculateRatingScore($idealProfile, $userRatings): float
    {
        // Handle case where idealProfile is a JSON string (sometimes Laravel doesn't cast early enough)
        if (is_string($idealProfile)) {
            $idealProfile = json_decode($idealProfile, true);
        }

        if (empty($idealProfile) || empty($userRatings)) {
            return 20.0; // Default baseline score
        }

        $totalDiff = 0;
        $count = 0;

        foreach ($idealProfile as $traitId => $idealValue) {
            if (isset($userRatings[$traitId])) {
                // Difference between user 1-5 and ideal 1-5
                $diff = abs($idealValue - $userRatings[$traitId]);
                // Max difference is 4. Weight the score so 0 diff = 100%, 4 diff = 0%
                $totalDiff += (4 - $diff) / 4;
                $count++;
            }
        }

        if ($count === 0) {
            return 0;
        }

        return ($totalDiff / $count) * 100;
    }

    /**
     * Generate human-readable reasoning for the match.
     */
    private function generateReasoning(Major $major, float $skills, float $interests, float $strengths): array
    {
        $reasons = [];

        if ($skills >= 70) {
            $reasons[] = "Strong alignment with your current and target skills.";
        } elseif ($skills >= 40) {
            $reasons[] = "Matches some of your core abilities.";
        }

        if ($interests >= 80) {
            $reasons[] = "Highly aligns with your academic and career interests.";
        }

        if ($strengths >= 80) {
            $reasons[] = "Greatly suits your personal strengths.";
        }

        return $reasons;
    }
}
