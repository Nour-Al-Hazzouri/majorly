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

        return [];
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
}
