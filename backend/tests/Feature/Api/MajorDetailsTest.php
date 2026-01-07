<?php

namespace Tests\Feature\Api;

use App\Models\Major;
use App\Models\Skill;
use App\Models\Occupation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MajorDetailsTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_major_details_by_slug()
    {
        $major = Major::factory()->create([
            'name' => 'Computer Science',
            'slug' => 'computer-science',
            'description' => 'A study of computers and computational systems.'
        ]);

        $skills = Skill::factory()->count(3)->create();
        $major->skills()->attach($skills->pluck('id'));

        $occupations = Occupation::factory()->count(2)->create();
        $major->occupations()->attach($occupations->pluck('id'));

        $response = $this->getJson("/api/majors/computer-science");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'name',
                'slug',
                'description',
                'skills' => [
                    '*' => ['id', 'name', 'category']
                ],
                'occupations' => [
                    '*' => ['id', 'name', 'code', 'median_salary']
                ]
            ])
            ->assertJsonPath('slug', 'computer-science')
            ->assertJsonCount(3, 'skills')
            ->assertJsonCount(2, 'occupations');
    }

    public function test_returns_404_if_major_not_found()
    {
        $response = $this->getJson("/api/majors/non-existent-major");

        $response->assertStatus(404);
    }
}
