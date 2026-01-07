<?php

namespace Tests\Feature;

use App\Models\Major;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MajorTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_toggle_favorite_major()
    {
        $user = User::factory()->create();
        $major = Major::create([
            'name' => 'Computer Science',
            'slug' => 'cs',
            'category' => 'Technology'
        ]);

        $this->actingAs($user, 'sanctum');

        // Toggle on
        $response = $this->postJson("/api/majors/{$major->id}/favorite");
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Major saved to favorites.',
                'is_favorite' => true
            ]);
        
        $this->assertDatabaseHas('saved_majors', [
            'user_id' => $user->id,
            'major_id' => $major->id
        ]);

        // Toggle off
        $response = $this->postJson("/api/majors/{$major->id}/favorite");
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Major removed from favorites.',
                'is_favorite' => false
            ]);

        $this->assertDatabaseMissing('saved_majors', [
            'user_id' => $user->id,
            'major_id' => $major->id
        ]);
    }

    public function test_user_can_list_favorites()
    {
        $user = User::factory()->create();
        $majors = Major::factory(3)->create(['category' => 'Test']);
        
        $user->savedMajors()->attach($majors->pluck('id'));

        $this->actingAs($user, 'sanctum');

        $response = $this->getJson("/api/majors/favorites");
        
        $response->assertStatus(200)
            ->assertJsonCount(3, 'favorites');
    }

    public function test_guest_cannot_favorite_major()
    {
        $major = Major::create([
            'name' => 'Nursing',
            'slug' => 'nursing',
            'category' => 'Healthcare'
        ]);

        $response = $this->postJson("/api/majors/{$major->id}/favorite");
        
        $response->assertStatus(401);
    }
}
