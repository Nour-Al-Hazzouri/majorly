<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Occupation>
 */
class OccupationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->jobTitle(),
            'code' => $this->faker->unique()->numerify('##-####'),
            'description' => $this->faker->paragraph(),
            'median_salary' => $this->faker->numberBetween(40000, 150000),
            'job_outlook' => $this->faker->randomElement(['Growing', 'Stable', 'Declining']),
        ];
    }
}
