<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LightcastService
{
    private string $clientId;
    private string $clientSecret;
    private string $authUrl = 'https://auth.emsicloud.com/connect/token';
    private string $apiUrl = 'https://emsiservices.com/skills/versions/latest';

    public function __construct()
    {
        $this->clientId = config('services.lightcast.client_id') ?? '';
        $this->clientSecret = config('services.lightcast.client_secret') ?? '';
    }

    /**
     * Fetch skills from Lightcast API (Real API with fallback to mock).
     *
     * @return array
     */
    public function fetchSkills(): array
    {
        if (empty($this->clientId) || empty($this->clientSecret)) {
            Log::info('Lightcast credentials not found, using mock data.');
            return $this->getMockSkills();
        }

        try {
            $token = $this->getAccessToken();
            
            $response = Http::withToken($token)
                ->get("{$this->apiUrl}/skills");

            if ($response->successful()) {
                return array_map(function ($skill) {
                    return [
                        'lightcast_id' => $skill['id'],
                        'name' => $skill['name'],
                        'category' => $skill['type']['name'] ?? 'Other'
                    ];
                }, $response->json()['data']);
            }

            Log::error('Lightcast API error: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Lightcast API exception: ' . $e->getMessage());
        }

        return $this->getMockSkills();
    }

    /**
     * Get OAuth2 Access Token
     */
    private function getAccessToken(): string
    {
        $response = Http::asForm()->post($this->authUrl, [
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'grant_type' => 'client_credentials',
            'scope' => 'emsi_open',
        ]);

        if ($response->successful()) {
            return $response->json()['access_token'];
        }

        throw new \Exception('Failed to obtain Lightcast access token');
    }

    /**
     * Comprehensive mock data for testing.
     */
    private function getMockSkills(): array
    {
        $skills = [
            // Information Technology
            ['lightcast_id' => 'KS120P871HGG09981861', 'name' => 'Software Engineering', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS126XS6C3120J73M9P0', 'name' => 'Python (Programming Language)', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS123K06Y5320J625M25', 'name' => 'JavaScript (Programming Language)', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS1211W6S811E73J9P0M', 'name' => 'Java (Programming Language)', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS120P871HGG09981862', 'name' => 'Web Development', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS120P871HGG09981863', 'name' => 'React.js', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS120P871HGG09981864', 'name' => 'Node.js', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS120P871HGG09981865', 'name' => 'SQL (Programming Language)', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS120P871HGG09981866', 'name' => 'Cyber Security', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS120P871HGG09981867', 'name' => 'Cloud Computing', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS120P871HGG09981868', 'name' => 'DevOps', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS120P871HGG09981869', 'name' => 'Amazon Web Services (AWS)', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS120P871HGG09981870', 'name' => 'Docker (Software)', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS120P871HGG09981871', 'name' => 'Git (Version Control System)', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS120P871HGG09981872', 'name' => 'Artificial Intelligence', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS120P871HGG09981873', 'name' => 'Machine Learning', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS120P871HGG09981874', 'name' => 'Database Administration', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS120P871HGG09981875', 'name' => 'Mobile Application Development', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS125LS6N7M073357592', 'name' => 'HTML', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS125LS6N7M073357593', 'name' => 'CSS', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS125LS6N7M073357594', 'name' => 'Tailwind CSS', 'category' => 'Information Technology'],
            ['lightcast_id' => 'KS125LS6N7M073357595', 'name' => 'TypeScript', 'category' => 'Information Technology'],

            // Business & Management
            ['lightcast_id' => 'KS125LS6N7M073357591', 'name' => 'Project Management', 'category' => 'Management'],
            ['lightcast_id' => 'KS120077051203020610', 'name' => 'Accounting', 'category' => 'Business'],
            ['lightcast_id' => 'KS1261Z6573539958063', 'name' => 'Marketing Strategy', 'category' => 'Business'],
            ['lightcast_id' => 'KS120P871HGG09981876', 'name' => 'Business Analysis', 'category' => 'Business'],
            ['lightcast_id' => 'KS120P871HGG09981877', 'name' => 'Financial Analysis', 'category' => 'Business'],
            ['lightcast_id' => 'KS120P871HGG09981878', 'name' => 'Strategic Planning', 'category' => 'Management'],
            ['lightcast_id' => 'KS120P871HGG09981879', 'name' => 'Sales', 'category' => 'Business'],
            ['lightcast_id' => 'KS120P871HGG09981880', 'name' => 'Leadership', 'category' => 'Management'],
            ['lightcast_id' => 'KS120P871HGG09981881', 'name' => 'Human Resources (HR)', 'category' => 'Management'],
            ['lightcast_id' => 'KS120P871HGG09981882', 'name' => 'Entrepreneurship', 'category' => 'Business'],
            ['lightcast_id' => 'KS120P871HGG09981883', 'name' => 'Budgeting', 'category' => 'Business'],
            ['lightcast_id' => 'KS120P871HGG09981884', 'name' => 'Supply Chain Management', 'category' => 'Business'],
            ['lightcast_id' => 'KS120P871HGG09981885', 'name' => 'Customer Relationship Management (CRM)', 'category' => 'Business'],

            // Health & Medicine
            ['lightcast_id' => 'ES104936302819098192', 'name' => 'Anatomy', 'category' => 'Health Care'],
            ['lightcast_id' => 'KS1219R6P68073570390', 'name' => 'Patient Care', 'category' => 'Health Care'],
            ['lightcast_id' => 'KS120P871HGG09981886', 'name' => 'Nursing', 'category' => 'Health Care'],
            ['lightcast_id' => 'KS120P871HGG09981887', 'name' => 'Clinical Research', 'category' => 'Health Care'],
            ['lightcast_id' => 'KS120P871HGG09981888', 'name' => 'Pharmacology', 'category' => 'Health Care'],
            ['lightcast_id' => 'KS120P871HGG09981889', 'name' => 'Emergency Medicine', 'category' => 'Health Care'],
            ['lightcast_id' => 'ES104936302819098193', 'name' => 'Psychology', 'category' => 'Health Care'],
            ['lightcast_id' => 'KS120P871HGG09981890', 'name' => 'Physical Therapy', 'category' => 'Health Care'],
            ['lightcast_id' => 'KS120P871HGG09981891', 'name' => 'Public Health', 'category' => 'Health Care'],

            // Science & Engineering
            ['lightcast_id' => 'KS124PQ6T05231206821', 'name' => 'Biology', 'category' => 'Science'],
            ['lightcast_id' => 'KS120P871HGG09981892', 'name' => 'Chemistry', 'category' => 'Science'],
            ['lightcast_id' => 'KS120P871HGG09981893', 'name' => 'Physics', 'category' => 'Science'],
            ['lightcast_id' => 'KS120P871HGG09981894', 'name' => 'Mathematics', 'category' => 'Science'],
            ['lightcast_id' => 'KS120P871HGG09981895', 'name' => 'Environmental Science', 'category' => 'Science'],
            ['lightcast_id' => 'KS120P871HGG09981896', 'name' => 'Mechanical Engineering', 'category' => 'Engineering'],
            ['lightcast_id' => 'KS120P871HGG09981897', 'name' => 'Civil Engineering', 'category' => 'Engineering'],
            ['lightcast_id' => 'KS120P871HGG09981898', 'name' => 'Electrical Engineering', 'category' => 'Engineering'],
            ['lightcast_id' => 'KS120P871HGG09981899', 'name' => 'Chemical Engineering', 'category' => 'Engineering'],
            ['lightcast_id' => 'KS120P871HGG09981900', 'name' => 'Aerospace Engineering', 'category' => 'Engineering'],

            // Art & Design
            ['lightcast_id' => 'KS124D860X5132800392', 'name' => 'Graphic Design', 'category' => 'Art and Design'],
            ['lightcast_id' => 'KS120B874M4312521919', 'name' => 'Adobe Creative Suite', 'category' => 'Art and Design'],
            ['lightcast_id' => 'KS120P871HGG09981901', 'name' => 'User Interface (UI) Design', 'category' => 'Art and Design'],
            ['lightcast_id' => 'KS120P871HGG09982001', 'name' => 'User Experience (UX) Design', 'category' => 'Art and Design'],
            ['lightcast_id' => 'KS120P871HGG09982002', 'name' => 'Photography', 'category' => 'Art and Design'],
            ['lightcast_id' => 'KS120P871HGG09982003', 'name' => 'Video Production', 'category' => 'Art and Design'],
            ['lightcast_id' => 'KS120P871HGG09982004', 'name' => 'Animation', 'category' => 'Art and Design'],
            ['lightcast_id' => 'KS120P871HGG09982005', 'name' => 'Fine Arts', 'category' => 'Art and Design'],
            ['lightcast_id' => 'KS120P871HGG09982006', 'name' => 'Architecture', 'category' => 'Art and Design'],

            // Education
            ['lightcast_id' => 'KS123N663G1253018261', 'name' => 'Teaching', 'category' => 'Education'],
            ['lightcast_id' => 'KS122Z36QK5320J29K84', 'name' => 'Curriculum Development', 'category' => 'Education'],
            ['lightcast_id' => 'KS120P871HGG09982007', 'name' => 'Special Education', 'category' => 'Education'],
            ['lightcast_id' => 'KS120P871HGG09982008', 'name' => 'Higher Education', 'category' => 'Education'],
            ['lightcast_id' => 'KS120P871HGG09982009', 'name' => 'Online Teaching', 'category' => 'Education'],

            // Social Sciences & Humanities
            ['lightcast_id' => 'KS120P871HGG09982010', 'name' => 'History', 'category' => 'Humanities'],
            ['lightcast_id' => 'KS120P871HGG09982011', 'name' => 'Sociology', 'category' => 'Social Sciences'],
            ['lightcast_id' => 'KS120P871HGG09982012', 'name' => 'Political Science', 'category' => 'Social Sciences'],
            ['lightcast_id' => 'KS120P871HGG09982013', 'name' => 'Economics', 'category' => 'Social Sciences'],
            ['lightcast_id' => 'KS120P871HGG09982014', 'name' => 'Philosophy', 'category' => 'Humanities'],
            ['lightcast_id' => 'KS120P871HGG09982015', 'name' => 'Anthropology', 'category' => 'Social Sciences'],
            ['lightcast_id' => 'KS120P871HGG09982016', 'name' => 'Creative Writing', 'category' => 'Humanities'],

            // Law & Public Service
            ['lightcast_id' => 'KS120P871HGG09982017', 'name' => 'Legal Research', 'category' => 'Law'],
            ['lightcast_id' => 'KS120P871HGG09982018', 'name' => 'Litigation', 'category' => 'Law'],
            ['lightcast_id' => 'KS120P871HGG09982019', 'name' => 'Public Policy', 'category' => 'Public Service'],
            ['lightcast_id' => 'KS120P871HGG09982020', 'name' => 'Crime Prevention', 'category' => 'Public Safety'],
            ['lightcast_id' => 'KS120P871HGG09982021', 'name' => 'International Relations', 'category' => 'Public Service'],

            // Soft Skills
            ['lightcast_id' => 'KS1267D6K7F129990265', 'name' => 'Communication', 'category' => 'Soft Skills'],
            ['lightcast_id' => 'KS120P871HGG09982022', 'name' => 'Critical Thinking', 'category' => 'Soft Skills'],
            ['lightcast_id' => 'KS120P871HGG09982023', 'name' => 'Problem Solving', 'category' => 'Soft Skills'],
            ['lightcast_id' => 'KS120P871HGG09982024', 'name' => 'Teamwork', 'category' => 'Soft Skills'],
            ['lightcast_id' => 'KS120P871HGG09982025', 'name' => 'Time Management', 'category' => 'Soft Skills'],
            ['lightcast_id' => 'KS120P871HGG09982026', 'name' => 'Conflict Resolution', 'category' => 'Soft Skills'],
            ['lightcast_id' => 'KS120P871HGG09982027', 'name' => 'Public Speaking', 'category' => 'Soft Skills'],
            ['lightcast_id' => 'KS120P871HGG09982028', 'name' => 'Adaptability', 'category' => 'Soft Skills'],
            ['lightcast_id' => 'KS120P871HGG09982029', 'name' => 'Emotional Intelligence', 'category' => 'Soft Skills'],
        ];

        // Add more mock skills to fill the dataset
        for ($i = 1; $i <= 50; $i++) {
            $skills[] = ['lightcast_id' => 'MOCK_S_'.($i+100), 'name' => "Cyber Security Specialist $i", 'category' => 'Information Technology'];
            $skills[] = ['lightcast_id' => 'MOCK_B_'.($i+100), 'name' => "Marketing Analyst $i", 'category' => 'Business'];
        }

        return $skills;
    }
}
