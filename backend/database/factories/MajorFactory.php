<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Major>
 */
class MajorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->sentence(2);
        return [
            'name' => $name,
            'slug' => \Illuminate\Support\Str::slug($name),
            'category' => $this->faker->word(),
            'description' => $this->faker->paragraph(),
            'ideal_interests' => [],
            'ideal_strengths' => []
        ];
    }
}
