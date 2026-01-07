<?php

namespace App\Services;

class LightcastService
{
    /**
     * Fetch skills from Lightcast API (Mock for now).
     *
     * @return array
     */
    public function fetchSkills(): array
    {
        // Mock data to simulate API response
        return [
            ['lightcast_id' => 'KS120P871HGG09981861', 'name' => 'Software Engineering', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS126XS6C3120J73M9P0', 'name' => 'Python (Programming Language)', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS122N076F1D53M1Z8S4', 'name' => 'Data Analysis', 'category' => 'Analysis'],
            ['lightcast_id' => 'KS125LS6N7M073357591', 'name' => 'Project Management', 'category' => 'Management'],
            ['lightcast_id' => 'KS1267D6K7F129990265', 'name' => 'Communication', 'category' => 'Soft Skills'],
            ['lightcast_id' => 'KS123K06Y5320J625M25', 'name' => 'JavaScript (Programming Language)', 'category' => 'Information Technology'],
            ['lightcast_id' => 'ES104936302819098192', 'name' => 'Anatomy', 'category' => 'Health Care'],
            ['lightcast_id' => 'KS1219R6P68073570390', 'name' => 'Patient Care', 'category' => 'Health Care'],
            ['lightcast_id' => 'KS124PQ6T05231206821', 'name' => 'Biology', 'category' => 'Science'],
            ['lightcast_id' => 'KS120077051203020610', 'name' => 'Accounting', 'category' => 'Business'],
            ['lightcast_id' => 'KS1261Z6573539958063', 'name' => 'Marketing Strategy', 'category' => 'Business'],
            ['lightcast_id' => 'KS124D860X5132800392', 'name' => 'Graphic Design', 'category' => 'Art and Design'],
            ['lightcast_id' => 'KS120B874M4312521919', 'name' => 'Adobe Creative Suite', 'category' => 'Art and Design'],
            ['lightcast_id' => 'KS123N663G1253018261', 'name' => 'Teaching', 'category' => 'Education'],
            ['lightcast_id' => 'KS122Z36QK5320J29K84', 'name' => 'Curriculum Development', 'category' => 'Education'],
        ];
    }
}
