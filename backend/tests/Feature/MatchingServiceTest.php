<?php

namespace Tests\Feature;

use App\Models\Assessment;
use App\Models\AssessmentResponse;
use App\Models\Major;
use App\Models\Skill;
use App\Services\MatchingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MatchingServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $matchingService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->matchingService = new MatchingService();
    }

    public function test_it_calculates_correct_skill_scores()
    {
        // Setup Major with specific skills
        $major = Major::create(['name' => 'Tech', 'slug' => 'tech', 'category' => 'Tech']);
        $skills = Skill::factory()->count(10)->create();
        $major->skills()->attach($skills->take(5)->pluck('id'));

        // Setup Assessment with 3 matching skills
        $assessment = Assessment::factory()->create(['user_id' => null]);
        $assessment->responses()->create([
            'question_id' => 'skills_current',
            'response_value' => $skills->take(3)->pluck('id')->toArray()
        ]);

        $recommendations = $this->matchingService->generateRecommendations($assessment);
        $techResult = $recommendations->firstWhere('major_id', $major->id);

        // (3 match / 5 total major skills) * 100 = 60%
        $this->assertEquals(60, $techResult['scores']['skills']);
    }

    public function test_it_calculates_correct_rating_scores()
    {
        $major = Major::create([
            'name' => 'Business',
            'slug' => 'biz',
            'category' => 'Biz',
            'ideal_interests' => [
                'leadership' => 5,
                'data' => 3
            ]
        ]);

        $assessment = Assessment::factory()->create(['user_id' => null]);
        $assessment->responses()->create([
            'question_id' => 'interests',
            'response_value' => [
                'leadership' => 5, // Exact match (diff 0)
                'data' => 1      // 2 points away (diff 2)
            ]
        ]);

        $recommendations = $this->matchingService->generateRecommendations($assessment);
        $bizResult = $recommendations->firstWhere('major_id', $major->id);

        // Score 1: (4-0)/4 = 1.0
        // Score 2: (4-2)/4 = 0.5
        // Total = (1.0 + 0.5) / 2 = 0.75 * 100 = 75%
        $this->assertEquals(75, $bizResult['scores']['interests']);
    }

    public function test_it_ranks_majors_by_weighted_total()
    {
        // Create two majors
        $major1 = Major::create([
            'name' => 'Major 1',
            'slug' => 'm1',
            'category' => 'Test',
            'ideal_interests' => ['a' => 5],
            'ideal_strengths' => ['b' => 5]
        ]);
        $major2 = Major::create([
            'name' => 'Major 2',
            'slug' => 'm2',
            'category' => 'Test',
            'ideal_interests' => ['a' => 1],
            'ideal_strengths' => ['b' => 1]
        ]);

        $assessment = Assessment::factory()->create(['user_id' => null]);
        $assessment->responses()->createMany([
            ['question_id' => 'interests', 'response_value' => ['a' => 5]],
            ['question_id' => 'strengths_weaknesses', 'response_value' => ['b' => 5]]
        ]);

        $recommendations = $this->matchingService->generateRecommendations($assessment);

        $this->assertEquals($major1->id, $recommendations->first()['major_id']);
        $this->assertGreaterThan($recommendations->last()['match_percentage'], $recommendations->first()['match_percentage']);
    }

    public function test_it_finalizes_recommendations_on_assessment_submission()
    {
        $major = Major::create(['name' => 'Target', 'slug' => 'target', 'category' => 'Test']);
        $assessment = Assessment::factory()->create(['user_id' => null]);

        $response = $this->postJson("/api/assessments/{$assessment->id}/submit");

        $response->assertStatus(200);
        $this->assertEquals('completed', $assessment->fresh()->status);
        $this->assertDatabaseHas('assessment_results', [
            'assessment_id' => $assessment->id,
            'major_id' => $major->id
        ]);
    }
}
