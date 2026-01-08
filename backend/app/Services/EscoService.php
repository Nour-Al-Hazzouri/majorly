<?php
 
 namespace App\Services;
 
 use Illuminate\Support\Facades\Http;
 use Illuminate\Support\Facades\Log;
 
 class EscoService
 {
     private string $baseUrl = 'https://ec.europa.eu/esco/api/';
 
     /**
      * Fetch occupations from ESCO API.
      *
      * @param int $limit
      * @param int $offset
      * @return array
      */
     public function fetchOccupations(int $limit = 100, int $offset = 0, string $text = ''): array
     {
         try {
             $params = [
                 'language' => 'en',
                 'type' => 'occupation',
                 'limit' => $limit,
                 'offset' => $offset
             ];
             if ($text) $params['text'] = $text;

             $response = Http::get("{$this->baseUrl}search", $params);
 
             if ($response->successful()) {
                 $results = $response->json()['_embedded']['results'] ?? [];
                 
                 return array_map(function ($occ) {
                     return [
                         'code' => $occ['uri'], // ESCO uses URIs as unique IDs
                         'name' => $occ['title'],
                         'description' => $occ['description'] ?? '',
                         'median_salary' => 0, // ESCO doesn't provide salary data directly in search
                         'job_outlook' => 'Average'
                     ];
                 }, $results);
             }
 
             Log::error('ESCO API error (occupations): ' . $response->body());
         } catch (\Exception $e) {
             Log::error('ESCO API exception (occupations): ' . $e->getMessage());
         }
 
         return [];
     }
 
     /**
      * Fetch skills from ESCO API.
      *
      * @param int $limit
      * @param int $offset
      * @return array
      */
     public function fetchSkills(int $limit = 100, int $offset = 0, string $text = ''): array
     {
         try {
             $params = [
                 'language' => 'en',
                 'type' => 'skill',
                 'limit' => $limit,
                 'offset' => $offset
             ];
             if ($text) $params['text'] = $text;

             $response = Http::get("{$this->baseUrl}search", $params);
 
             if ($response->successful()) {
                 $results = $response->json()['_embedded']['results'] ?? [];
                 
                 return array_map(function ($skill) {
                     return [
                         'lightcast_id' => $skill['uri'], // Reuse field for external ID
                         'name' => $skill['title'],
                         'category' => 'General' // ESCO hierarchy is complex, defaulting to General for MVP
                     ];
                 }, $results);
             }
 
             Log::error('ESCO API error (skills): ' . $response->body());
         } catch (\Exception $e) {
             Log::error('ESCO API exception (skills): ' . $e->getMessage());
         }
 
         return [];
     }
 }
