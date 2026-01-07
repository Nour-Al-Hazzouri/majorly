<?php

namespace App\Services;

use App\Models\Assessment;
use App\Models\AssessmentResult;
use App\Models\Major;
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
    private function calculateRatingScore(array $idealProfile, array $userRatings): float
    {
        if (empty($idealProfile)) {
            return 0;
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
