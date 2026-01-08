<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OnetService
{
    private string $apiKey;
    private string $baseUrl = 'https://services.onetcenter.org/ws/';

    public function __construct()
    {
        $this->apiKey = config('services.onet.api_key') ?? '';
    }

    /**
     * Fetch occupations from O*NET API.
     *
     * @return array
     */
    public function fetchOccupations(): array
    {
        if (empty($this->apiKey)) {
            Log::warning('O*NET API Key not found, returning mock data.');
            return $this->getMockOccupations();
        }

        try {
            // Fetch general list of occupations
            // Note: O*NET API might require individual calls for details (salary, outlook)
            // For the seeder/batch fetch, we start with a list.
            $response = Http::withHeaders([
                'X-API-Key' => $this->apiKey,
                'Accept' => 'application/json',
            ])->get("{$this->baseUrl}online/occupations/");

            if ($response->successful()) {
                $occupations = $response->json()['occupation'] ?? [];
                
                return array_map(function ($occ) {
                    // We might need to fetch more details per occupation if the list is sparse
                    // For MVP, we'll try to get what we can. 
                    // Usually, salary/outlook require specific endpoints per code.
                    return [
                        'code' => $occ['code'],
                        'name' => $occ['title'],
                        'description' => $occ['description'] ?? '',
                        'median_salary' => 0, // Need detail call
                        'job_outlook' => 'Average' // Need detail call
                    ];
                }, $occupations);
            }

            Log::error('O*NET API error: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('O*NET API exception: ' . $e->getMessage());
        }

        return $this->getMockOccupations();
    }

    /**
     * Fetch detailed data for a specific occupation.
     */
    public function fetchOccupationDetails(string $code): array
    {
        if (empty($this->apiKey)) {
            return [];
        }

        try {
            $response = Http::withHeaders([
                'X-API-Key' => $this->apiKey,
                'Accept' => 'application/json',
            ])->get("{$this->baseUrl}online/occupations/{$code}/details");

            if ($response->successful()) {
                return $response->json();
            }
        } catch (\Exception $e) {
            Log::error("O*NET Detail fetch failed for {$code}: " . $e->getMessage());
        }

        return [];
    }

    /**
     * Mock data fallback.
     */
    private function getMockOccupations(): array
    {
        return [
            [
                'code' => '15-1252.00',
                'name' => 'Software Developers',
                'description' => 'Research, design, and develop computer and network software or specialized utility programs.',
                'median_salary' => 127260.00,
                'job_outlook' => 'Bright Outlook'
            ],
            [
                'code' => '15-1211.00',
                'name' => 'Computer Systems Analysts',
                'description' => 'Analyze science, engineering, business, and other data processing problems to develop and implement solutions.',
                'median_salary' => 102240.00,
                'job_outlook' => 'Average'
            ],
            [
                'code' => '29-1141.00',
                'name' => 'Registered Nurses',
                'description' => 'Assess patient health problems and needs, develop and implement nursing care plans, and maintain medical records.',
                'median_salary' => 81220.00,
                'job_outlook' => 'Bright Outlook'
            ],
            [
                'code' => '13-2011.00',
                'name' => 'Accountants and Auditors',
                'description' => 'Examine, analyze, and interpret accounting records to prepare financial statements.',
                'median_salary' => 78000.00,
                'job_outlook' => 'Average'
            ],
            [
                'code' => '27-1024.00',
                'name' => 'Graphic Designers',
                'description' => 'Design or create graphics to meet specific commercial or promotional needs.',
                'median_salary' => 57990.00,
                'job_outlook' => 'Average'
            ],
            [
                'code' => '25-2021.00',
                'name' => 'Elementary School Teachers',
                'description' => 'Teach students basic academic, social, and other formative skills.',
                'median_salary' => 61690.00,
                'job_outlook' => 'Average'
            ],
            [
                'code' => '11-9111.00',
                'name' => 'Medical and Health Services Managers',
                'description' => 'Plan, direct, or coordinate medical and health services.',
                'median_salary' => 104830.00,
                'job_outlook' => 'Bright Outlook'
            ],
            [
                'code' => '15-2031.00',
                'name' => 'Operations Research Analysts',
                'description' => 'Formulate and apply mathematical modeling and other optimizing methods to develop and interpret information.',
                'median_salary' => 86200.00,
                'job_outlook' => 'Bright Outlook'
            ],
        ];
    }
}
