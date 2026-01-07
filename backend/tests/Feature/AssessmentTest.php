<?php

namespace Tests\Feature;

use App\Models\Assessment;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AssessmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_search_skills()
    {
        Skill::factory()->create(['name' => 'Python']);
        Skill::factory()->create(['name' => 'JavaScript']);

        $response = $this->getJson('/api/skills?search=py');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Python');
    }

    public function test_can_get_assessment_questions()
    {
        $response = $this->getJson('/api/assessments/questions');

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => 'skills_current']);
    }

    public function test_guest_can_start_and_update_assessment()
    {
        $response = $this->postJson('/api/assessments', ['type' => 'tier1']);

        $response->assertStatus(201);
        $assessmentId = $response->json('id');

        $updateResponse = $this->patchJson("/api/assessments/{$assessmentId}", [
            'responses' => [
                'skills_current' => [1, 2, 3],
                'analytical_thinking' => 5
            ]
        ]);

        $updateResponse->assertStatus(200);

        $this->assertDatabaseHas('assessment_responses', [
            'assessment_id' => $assessmentId,
            'question_id' => 'skills_current',
        ]);
    }

    public function test_auth_user_can_see_their_assessments()
    {
        $user = User::factory()->create();
        Assessment::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->getJson('/api/assessments');

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_user_cannot_update_others_assessment()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $assessment = Assessment::factory()->create(['user_id' => $user1->id]);

        $response = $this->actingAs($user2)->patchJson("/api/assessments/{$assessment->id}", [
            'responses' => ['analytical_thinking' => 5]
        ]);

        $response->assertStatus(403);
    }

    public function test_can_submit_assessment()
    {
        $assessment = Assessment::factory()->create(['user_id' => null]);

        $response = $this->postJson("/api/assessments/{$assessment->id}/submit");

        $response->assertStatus(200);
        $this->assertEquals('completed', $assessment->fresh()->status);
    }
}
