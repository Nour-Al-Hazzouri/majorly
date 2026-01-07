<?php

namespace Tests\Feature;

use App\Models\Assessment;
use App\Models\Major;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeepDiveAssessmentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_can_fetch_deep_dive_questions()
    {
        $major = Major::where('slug', 'computer-science')->first();

        $response = $this->getJson("/api/assessments/questions?major_id={$major->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['title' => 'Computer Science Deep Dive']);
    }

    public function test_can_submit_deep_dive_assessment()
    {
        $major = Major::where('slug', 'computer-science')->first();
        $user = User::factory()->create();

        // 1. Start assessment
        $response = $this->actingAs($user)
            ->postJson('/api/assessments', [
                'type' => 'deep_dive',
                'metadata' => ['major_id' => $major->id]
            ]);

        $response->assertStatus(201);
        $assessmentId = $response->json('id');

        // 2. Save responses
        $this->actingAs($user)
            ->patchJson("/api/assessments/{$assessmentId}", [
                'responses' => [
                    'interests' => [
                        'cybersecurity' => 5,
                        'web_dev' => 1,
                        'ai_ml' => 3,
                        'software_eng' => 4,
                        'performance' => 4,
                    ],
                    'strengths_weaknesses' => [
                        'technical_depth' => 5,
                        'creative_execution' => 2,
                        'system_thinking' => 4,
                        'empathy' => 3,
                    ]
                ]
            ])
            ->assertStatus(200);

        // 3. Submit
        $response = $this->actingAs($user)
            ->postJson("/api/assessments/{$assessmentId}/submit");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'assessment',
                'recommendations'
            ])
            ->assertJsonFragment(['name' => 'Cybersecurity']);
    }
}
