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

    /**
     * Helper to invoke private/protected methods.
     */
    protected function invokeMethod(&$object, $methodName, array $parameters = [])
    {
        $reflection = new \ReflectionClass(get_class($object));
        $method = $reflection->getMethod($methodName);
        $method->setAccessible(true);
        return $method->invokeArgs($object, $parameters);
    }

    public function test_it_calculates_correct_skill_scores()
    {
        // Setup Major
        $major = Major::create(['name' => 'Computer and Mathematical', 'slug' => 'cs', 'category' => 'Tech']);
        $occupation = \App\Models\Occupation::create([
            'name' => 'Software Developer',
            'code' => 'SOFT-DEV-001',
            'soc_code' => '15-1252.00'
        ]);
        $major->occupations()->attach($occupation->id);
        
        // Add O*NET skills to occupation
        \App\Models\OccupationOnetSkill::create([
            'occupation_id' => $occupation->id,
            'onet_skill_id' => '2.B.3.e',
            'name' => 'Programming',
            'importance' => 4.0,
            'level' => 5.0
        ]);

        // Setup Assessment with matching skill
        $assessment = Assessment::factory()->create(['user_id' => null]);
        $assessment->responses()->create([
            'question_id' => 'skills_current',
            'response_value' => [['name' => 'Python']] // Python maps to Programming in our bridge
        ]);

        $recommendations = $this->matchingService->generateRecommendations($assessment);
        $techResult = $recommendations->firstWhere('major_id', $major->id);

        $this->assertGreaterThan(0, $techResult['scores']['skills']);
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

    public function test_it_handles_skill_objects_from_frontend()
    {
        $major = Major::create(['name' => 'CS', 'slug' => 'cs', 'category' => 'Test']);
        $occupation = \App\Models\Occupation::create([
            'name' => 'Dev', 
            'code' => 'DEV-001',
            'soc_code' => '15-0000'
        ]);
        $major->occupations()->attach($occupation->id);
        
        \App\Models\OccupationOnetSkill::create([
            'occupation_id' => $occupation->id,
            'onet_skill_id' => '2.B.3.e',
            'name' => 'Programming',
            'importance' => 5,
            'level' => 5
        ]);

        $responses = collect([
            'skills_current' => [['id' => 1, 'name' => 'PHP']],
            'skills_aspiration' => []
        ]);

        $score = $this->invokeMethod($this->matchingService, 'calculateVectorSkillScore', [$major, $responses]);

        $this->assertGreaterThan(0, $score);
    }
}
