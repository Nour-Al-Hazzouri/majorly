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

        // Rank, ensure unique overall percentages, and save top 7
        $rankedResults = $this->ensureUniquePercentages($results->sortByDesc('match_percentage')->values(), 'match_percentage')->take(7);

        // Also ensure sub-scores are unique across the ranked results
        $rankedResults = $this->ensureUniquePercentages($rankedResults, 'scores.skills');
        $rankedResults = $this->ensureUniquePercentages($rankedResults, 'scores.interests');
        $rankedResults = $this->ensureUniquePercentages($rankedResults, 'scores.strengths');

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
            'Programming' => ['programming', 'coding', 'software', 'developer', 'python', 'java', 'script', 'html', 'css', 'sql', 'php', 'c++', 'c#', 'ruby', 'swift', 'go', 'rust', 'typescript', 'react', 'vue', 'angular', 'node', 'api', 'backend', 'frontend', 'stack'],
            'Mathematics' => ['mathematics', 'math', 'algebra', 'calculus', 'statistics', 'quantitative', 'geometry', 'arithmetic', 'logic', 'analytics', 'data science'],
            'Science' => ['science', 'biology', 'chemistry', 'physics', 'laboratory', 'research', 'scientific', 'medical', 'clinical', 'medicine'],
            'Critical Thinking' => ['critical thinking', 'problem solving', 'analysis', 'analytical', 'evaluation', 'reasoning', 'debug', 'troubleshoot', 'logic'],
            'Speaking' => ['speaking', 'presentation', 'communication', 'public speaking', 'verbal', 'articulate'],
            'Writing' => ['writing', 'documentation', 'report', 'content', 'editorial', 'technical writing', 'journalism', 'editing'],
            'Reading Comprehension' => ['reading', 'comprehension', 'literacy', 'research', 'literature'],
            'Active Listening' => ['listening', 'empathy', 'patient', 'counseling', 'client service', 'interpersonal'],
            'Coordination' => ['coordination', 'teamwork', 'collaboration', 'project management', 'planning', 'leadership', 'scrum', 'agile'],
            'Social Perceptiveness' => ['social', 'psychology', 'human behavior', 'counseling', 'therapy', 'sociate', 'community'],
            'Systems Analysis' => ['systems analysis', 'engineering', 'it systems', 'cloud architecture', 'infrastructure', 'database', 'network'],
            'Complex Problem Solving' => ['complex', 'troubleshooting', 'innovation', 'strategic', 'architecture'],
            'Management of Personnel Resources' => ['management', 'leadership', 'hiring', 'supervision', 'coaching', 'mentor', 'team lead'],
            'Management of Financial Resources' => ['finance', 'budget', 'accounting', 'investment', 'economic', 'pricing'],
            'Negotiation' => ['negotiation', 'sales', 'contract', 'bargaining', 'procurement'],
            'Persuasion' => ['persuasion', 'marketing', 'advertising', 'influence', 'advocacy', 'sales'],
            'Instructing' => ['instructing', 'teaching', 'training', 'educator', 'workshop', 'coaching'],
            'Service Orientation' => ['service', 'customer', 'hospitality', 'support', 'help desk'],
            'Operations Analysis' => ['operations', 'workflow', 'efficiency', 'logistics', 'supply chain'],
            'Technology Design' => ['design', 'ui', 'ux', 'architecture', 'prototyping', 'creative'],
            'Judgment and Decision Making' => ['judgment', 'decision making', 'prioritization', 'management'],
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
        $occupations = $major->occupations()->with(['onetSkills', 'onetKnowledge'])->get();

        // If deep dive lacks skills, try to find user's most recent Tier 1 assessment
        if ($userSkills->isEmpty()) {
            $lastTier1 = Assessment::where('type', 'tier1')
                ->where('status', 'completed')
                ->where(function($q) use ($assessment) {
                    if ($assessment->user_id) {
                        $q->where('user_id', $assessment->user_id);
                    } else {
                        // For guests, we can't easily track without a common session/cookie
                        // but we can try to find the most recent guest assessment created just before this one
                        $q->whereNull('user_id')
                          ->where('id', '<', $assessment->id);
                    }
                })
                ->latest()
                ->first();
            
            if ($lastTier1) {
                $lastResponses = $lastTier1->responses()->pluck('response_value', 'question_id');
                $userSkillsCurrent = collect($lastResponses['skills_current'] ?? []);
                $userSkillsAspiration = collect($lastResponses['skills_aspiration'] ?? []);
                $userSkills = $userSkillsCurrent->merge($userSkillsAspiration)
                    ->map(fn($skill) => is_array($skill) ? ($skill['name'] ?? '') : (is_object($skill) ? ($skill->name ?? '') : $skill))
                    ->unique()
                    ->filter();
                    
                // Re-build vector with found skills
                $userVector = $this->buildUserVector($userSkills);
            }
        }

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
        $finalResults = $this->ensureUniquePercentages($results->sortByDesc('match_percentage')->values(), 'match_percentage');

        // Also ensure O*NET knowledge/skill importance scores are unique within each occupation
        $finalResults = $finalResults->map(function($res) {
            if (isset($res['occupation'])) {
                $occ = $res['occupation'];
                // Standardize: ensure onetKnowledge (used in UI) has unique importance
                if ($occ->relationLoaded('onetKnowledge')) {
                    $uniqueKnowledge = $this->ensureUniquePercentages(
                        collect($occ->onetKnowledge),
                        'pivot.importance',
                        0.05
                    );
                    $occ->setRelation('onetKnowledge', $uniqueKnowledge);
                }
                
                // If onetSkills is also loaded and used, unify it too
                if ($occ->relationLoaded('onetSkills')) {
                    $uniqueSkills = $this->ensureUniquePercentages(
                        collect($occ->onetSkills),
                        'importance',
                        0.05
                    );
                    $occ->setRelation('onetSkills', $uniqueSkills);
                }
            }
            return $res;
        });

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
     * Supports nested keys like 'scores.skills'.
     */
    public function ensureUniquePercentages(Collection $results, string $key, float $minGap = 1.0): Collection
    {
        $lastPercentage = null;

        return $results->map(function ($item) use (&$lastPercentage, $minGap, $key) {
            $val = data_get($item, $key);
            // If we are dealing with importance (1-5), we might want higher precision than round(val, 1)
            // But let's assume we want to maintain the precision needed for the requested gap.
            $percentage = $val;
            
            // Percentage clamp is for 0-100 logic. For 1-5 importance, we might need a different clamp
            // or just skip clamp if it's not match percentages.
            // For now, let's keep it safe.
            if ($minGap >= 1.0) {
                $percentage = round($val, 1);
                $percentage = max(1.0, min(100.0, $percentage));
            }

            if ($lastPercentage !== null) {
                // If the gap between this and the last is less than minGap, push it down
                if ($lastPercentage - $percentage < $minGap) {
                    $percentage = $lastPercentage - $minGap;
                    // Only round if we are in the "standard" mode
                    if ($minGap >= 1.0) $percentage = round($percentage, 1);
                }
            }
            
            // Standard clamp for low values
            if ($minGap >= 1.0 && $percentage < 1.0) $percentage = 1.0;
            
            $lastPercentage = $percentage;
            data_set($item, $key, $percentage);
            
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
